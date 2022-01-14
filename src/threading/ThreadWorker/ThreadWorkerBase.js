
import {
  MAX_SAFE_NUMBER,

  RESULT_TYPE,
  IS_AVAILABLE_TYPE,
  EMIT_ERROR_TYPE,

  ADD_PROCESS_TYPE,
  RUN_PROCESS_TYPE,
  DEL_PROCESS_TYPE,
  ONEOFF_PROCESS_TYPE,
  KILL_PROCESS_TYPE,
  PING_PROCESS_TYPE,
} from "../constants.js";

import {
  onlyStringKeys,

  alreadyHaveBaseFn,
  availFnNeedsDigest,
  availFnNeedsRun,
  availFnNeedsCleanup,

  fnNeedsToBeImplemented,
} from "../errors.js";

import { ModuleHandler } from "./ModuleHandler.js";

export class ThreadWorkerBase {

  constructors({ maxNumProcesses, availableFunctions }){
    this.baseFnTypes = Object.keys(availableFunctions).reduce((obj, key)=>{
      if(typeof key !== "string"){
        throw new Error(onlyStringKeys);
      }
      key = key.toUpperCase();
      this.testBaseFn(key, availableFunctions[key]);
      availableFunctions[key].key = key;
      obj[key.toUpperCase()] = availableFunctions[key];
      return obj;
    }, {});
    this.listenForMessage((message)=>{
      this.onMessageListener(message);
    });
    this.maxNumProcesses = typeof maxNumProcesses === "number" ? maxNumProcesses : MAX_SAFE_NUMBER;
    this.currentNumProcesses = 0;
    this.messageIds = {};
    this.preparedFns = {};
    this.claimedAvailable = false;
    this.moduleHandler = new ModuleHandler();
    this.isAvailable();
  }

  testBaseFn(key, fn){
    if(typeof key !== "string"){
      throw new Error(onlyStringKeys);
    }
    if(key in this.baseFnTypes){
      throw new Error(alreadyHaveBaseFn);
    }
    if(typeof fn.digest !== "function"){
      throw new Error(availFnNeedsDigest);
    }
    if(typeof fn.run !== "function"){
      throw new Error(availFnNeedsRun);
    }
    if(typeof fn.cleanup !== "function"){
      throw new Error(availFnNeedsCleanup);
    }
  }

  async onMessageListener(message){
    if(typeof message !== "object"){
      this.postMessage({
        type: EMIT_ERROR_TYPE,
        message: "worker is expecting an object as a message",
        extra: message
      });
      console.error("worker is expecting an object as a message");
      return;
    }
    if(!message.id){
      this.postMessage({
        type: EMIT_ERROR_TYPE,
        message: "worker is expecting the message must have an id",
        extra: message
      });
      console.error(`message must have an id: ${JSON.stringify(message, null, 2)}`);
      return;
    }
    if(message.id in this.messageIds){
      this.postMessage({
        type: EMIT_ERROR_TYPE,
        message: "worker is expecting the message to have a unique id, got a duplicate",
        extra: message
      });
      console.error(`message must have unique id, got a duplicate: ${message.id}`);
      return;
    }
    try {
      switch(message.type){
        case ADD_PROCESS_TYPE: {
          return this.postMessage({
            result: await this.wrap(()=>{
              return this.add(message.args);
            }),
            type: RESULT_TYPE,
            id: message.id,
            isError: false,
          });
        }
        case RUN_PROCESS_TYPE: {
          return this.postMessage({
            result: await this.wrap(()=>{
              return this.run(message.args);
            }),
            type: RESULT_TYPE,
            id: message.id,
            isError: false,
          });
        }
        case DEL_PROCESS_TYPE: {
          return this.postMessage({
            result: await this.wrap(()=>{
              return this.remove(message.args);
            }),
            type: RESULT_TYPE,
            id: message.id,
            isError: false,
          });
        }
        case ONEOFF_PROCESS_TYPE: {
          return this.postMessage({
            result: await this.onOff(message.baseFnType, message.args),
            type: RESULT_TYPE,
            id: message.id,
            isError: false,
          });
        }
        case KILL_PROCESS_TYPE: {
          throw new Error("killing a process hasn't been implemented yet");
        }
        case PING_PROCESS_TYPE: {
          return this.postMessage({
            is: message.id,
            isError: false,
            result: "pong"
          });
        }
        default: {
          throw new Error("invalid type of message " + message.args.type);
        }
      }
    }catch(e){
      return this.postMessage({
        type: RESULT_TYPE,
        id: message.id,
        isError: true,
        result: {
          message: e.message,
          stack: e.stack,
        }
      });
    }
  }

  async isAvailable(){
    if(this.claimedAvailable){
      return;
    }
    this.claimedAvailable = true;
    await Promise.resolve();
    this.postMessage(JSON.stringify({
      type: IS_AVAILABLE_TYPE
    }));
  }

  async wrapFn(fn){
    try{
      this.currentNumProcesses++;
      if(this.currentNumProcesses === this.maxNumProcesses){
        this.claimedAvailable = false;
      }
      Promise.resolve().then(()=>{
        if(this.currentNumProcesses < this.maxNumProcesses){
          this.isAvailable();
        }
      });
      const result = await fn();
      if(this.currentNumProcesses === this.maxNumProcesses){
        this.isAvailable();
      }
      this.currentNumProcesses--;
      return result;
    }catch(e){
      if(this.currentNumProcesses === this.maxNumProcesses){
        this.isAvailable();
      }
      this.currentNumProcesses--;
      throw e;
    }
  }

  async oneOff({ baseFnType, modules, initialArgs, args }){
    var id = await this.add({ baseFnType, initialArgs, moduleNames: modules });
    const result = await this.run(id, baseFnType, args);
    this.remove(id);
    return result;
  }

  listenForMessage(){
    throw new Error(fnNeedsToBeImplemented);
  }
  postMessage(){
    throw new Error(fnNeedsToBeImplemented);
  }
  async add(){
    throw new Error(fnNeedsToBeImplemented);
  }
  async run(){
    throw new Error(fnNeedsToBeImplemented);
  }
  async remove(){
    throw new Error(fnNeedsToBeImplemented);
  }
}
