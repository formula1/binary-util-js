
import * as EventEmitter from "events";

import {
  uniqueId,

  RESULT_TYPE,
  IS_AVAILABLE_TYPE,
  EMIT_ERROR_TYPE,

  MAX_SAFE_NUMBER,

  ADD_PROCESS_TYPE,
  RUN_PROCESS_TYPE,
  DEL_PROCESS_TYPE,
  ONEOFF_PROCESS_TYPE,
  KILL_PROCESS_TYPE,

} from "./constants.js";

import {
  fnNeedsToBeImplemented,
} from "../errors.js";

const DEFAULT_MAX_QUEUE_TIMEOUT = 5 * 1000;

export class ThreadClient extends EventEmitter {

  constructor({
    pathToWorkerScript,
    maxQueueStack,
    cpuThreads,
    availableFunctions,
    maxQueueTimeout
  }){
    super();
    var availablCPUThreads = cpuThreads || this.getAvailableCPUs();
    if(typeof maxQueueTimeout !== "number"){
      this.maxQueueTimeout = DEFAULT_MAX_QUEUE_TIMEOUT;
    } else if(maxQueueTimeout <= 0){
      throw new Error(
        "maxQueueTimeout must be a real number >= 0, infinity if you don't want it to timeout"
      );
    } else {
      this.maxQueueTimeout = maxQueueTimeout;
    }

    availableFunctions.forEach((fn)=>{
      if(typeof fn !== "string"){
        throw new Error(
          "the functions you want available must be identified as a string"
        );
      }
      if(fn in this){
        throw new Error(
          "a function name is trying to overwrite an existing property"
        );
      }
      this[fn] = async (initialArgs)=>{
        const processTypeId = await this.add(fn, initialArgs);
        const runner = (args)=>{
          return this.run(processTypeId, args);
        };
        runner.delete = ()=>{
          return this.delete(processTypeId);
        };
        return runner;
      };
      this[fn + "OneOff"] = (initialArgs, args)=>{
        return this.oneOff(fn, initialArgs, args);
      };
    }, []);

    if(this.getAvailableCPUs() === 0){
      throw new Error("To create a worker, must have at least 1 thread available");
    }
    while(availablCPUThreads > 0){
      const worker = this.createWorker(pathToWorkerScript);
      this.listenForMessage(worker, (message)=>{
        this.handleMessage(worker, message);
      });
      this.listenForDeath(worker, (e)=>{
        this.handleDeath(worker, e);
      });
      worker.id = uniqueId("WORKER");
      this.workersProcesses[worker.id] = {};
      availablCPUThreads--;
    }
    this.counter = 0;
    this.maxQueueStack = typeof maxQueueStack === "number" ? maxQueueStack : MAX_SAFE_NUMBER;
    this.queue = [];
    this.availableWorkers = [];
    this.runningProcesses = {};
    this.workersProcesses = {};
    this.runningProcessesByWorker = {};
    this.availableProcessTypes = new Set();
    this.availableFunctions = availableFunctions;
  }

  getAvailableCPUs(){
    throw new Error(fnNeedsToBeImplemented);
  }

  createWorker(){
    throw new Error(fnNeedsToBeImplemented);
  }

  sendMessageToWorker(){
    throw new Error(fnNeedsToBeImplemented);
  }

  killWorker(){
    throw new Error(fnNeedsToBeImplemented);
  }

  async add(baseFn, initialArgs){
    if(typeof baseFn !== "string"){
      throw new Error("expected the base function name to be a string");
    }
    var newId = await this.startProcess(ADD_PROCESS_TYPE, {
      baseFn: baseFn,
      initialArgs: initialArgs,
    });
    this.availableProcessTypes.add(newId);
    return newId;
  }
  run(processTypeId, args){
    if((typeof processTypeId !== "string")){
      throw new Error("expected the process type id to be a string");
    }
    if(!this.availableProcessTypes.has(processTypeId)){
      throw new Error("this process type id has not been added yet");
    }
    return this.startProcess(RUN_PROCESS_TYPE, {
      id: processTypeId,
      args: args,
    });
  }
  delete(processTypeId){
    if(!this.availableProcessTypes.has(processTypeId)){
      throw new Error("this process type id has not been added yet");
    }
    this.availableProcessTypes.delete(processTypeId);
    return this.startProcess(DEL_PROCESS_TYPE, {
      id: processTypeId,
    });
  }
  oneoff(baseFn, initialArgs, args){
    if(typeof baseFn !== "string"){
      throw new Error("expected the base function name to be a string");
    }
    return this.startProcess(ONEOFF_PROCESS_TYPE, {
      baseFn, initialArgs, args
    });
  }
  kill({ process, error }){
    this.startProcess({
      type: KILL_PROCESS_TYPE,
      processId: process.id
    }).catch((e)=>{
      this.killWorker(process.worker);
      this.emit("error", "unable to kill process", e);
    });
    delete this.runningProcesses[process.id];
    delete this.workersProcesses[process.worker.id][process.id];
    process.rej(error);
  }

  handleMessage(worker, message){
    try {
      message = JSON.parse(message);
    } catch(e){
      return this.emit("error", "Failed to parse message: " + message);
    }

    switch(message.type){
      case RESULT_TYPE: return this.onRun(message);
      case IS_AVAILABLE_TYPE: return this.workerIsAvailable(worker);
      case EMIT_ERROR_TYPE: return this.emit("error", message.message, message.extra);
      default: return this.emit("error", "invalid message type");
    }
  }

  handleDeath(worker, e){
    Object.values(this.workersProcesses[worker.id]).forEach((process)=>{
      delete this.runningProcesses[process.id];
      process.rej("thread died");
    });
    delete this.workersProcesses[worker.id];
    this.emit("error", "worker died", e);
  }

  startProcess(processType, args, specifiedTimeout){
    return new Promise((res, rej)=>{
      var newId = uniqueId();
      var newProcess = {
        id: newId,
        type: processType,
        args: args,
        res: res,
        rej: rej,
      };
      if(specifiedTimeout || this.maxQueueTimeout < Number.POSITIVE_INFINITY){
        newProcess.timeout = setTimeout(()=>{
          this.kill({ process: newProcess, error: "timedout" });
        }, specifiedTimeout, this.maxQueueTimeout);
      }
      if(this.availableWorkers.length > 0){
        this.runningProcesses[newId] = newProcess;
        var worker = this.availableWorkers.unshift();
        this.giveWorkerAProcess(worker, newProcess);
      } else {
        this.queue.push(newProcess);
        this.emit("queued process", { ...newProcess });
      }
    });
  }

  onResult(message){
    if(!message.id){
      return this.emit("error", "Every message recieved from a worker must have an id", message);
    }
    var process = this.runningProcesses[message.id];
    if(!process){
      return this.emit("error", "Recieved message with no process expecting", message);
    }
    if(process.timeout){
      clearTimeout(process.timeout);
    }
    delete this.runningProcesses[message.id];
    delete this.workersProcesses[process.worker.id][message.id];
    if(
      Object.keys(this.workersProcesses[process.worker.id]).length === 0
      &&
      this.queue.length === 0
      &&
      !this.availableWorkers.includes(process.worker)
    ){
      console.warn(
        [
          "The worker has no active processes",
          "Theres nothing in the queue",
          "the worker hasn't said they were available yet"
        ].join(" and ") + " , there may be something wrong with the worker."
        + " The Available event is supposed to happen before the process result"
      );
    }

    // If the worker is finished, they should emit the
    if(message.isError){
      return process.rej(message.result);
    }
    return process.res(message.result);
  }

  giveWorkerAProcess(worker, process){
    process.worker = worker;
    this.workersProcesses[worker.id][process.id] = process;
    this.sendMessageToWorker({
      id: process.id,
      type: process.type,
    }, [process.args]);
  }

  workerIsAvailable(worker){
    if(this.queue.length === 0){
      return this.availableWorkers.push(worker);
    }
    const process = this.queue.unshift();
    this.giveWorkerAProcess(worker, process);
  }
}
