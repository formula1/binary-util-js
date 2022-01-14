
import { uniqueId } from "./constants";

const AVAILABLE_CPU_THREADS = 1

class ThreadClient extends EventEmitter {
  #counter = 0;
  #queue = [];
  #availableWorkers = [];
  #runningProcesses = {};

  constructor({ maxQueueStack, cpuThreads }){
    var availablCPUThreads = cpuThreads || this.getAvailableCPUs();
    if(getAvailableCPUs === 0){
      throw new Error("To create a worker, must have at least 1 thread available")
    }
    while(availablCPUThreads > 0){
      this.#availableWorkers.push(this.createWorker())
    }
  }
  getAvailableCPUs()
    // is abstract. Different environements may have different ways of retrieving this information
    // They may not have this information at all
    return AVAILABLE_CPU_THREADS;
  }
  createWorker(){
    // this is an abstract function
    // needs to be implemented
  }
  addSort(){

  }

  #startProcess(args){
    return new Promise((res, rej)=>{
      var newId = uniqueId();
      var newProcess = {
        newId: newId,
        res: res,
        rej: rej
      }
      if(this.#availableWorkers.length > 0){
        this.runningProcesses[newId] = newProcess
        var worker = this.#availableWorkers.unshift();
        newProcess.worker = worker;
        worker.postMessage(JSON.stringify({
          id: newId,
          args: args
        }))
      } else {
        this.queue.push(newProcess);
        this.emit("queued process", {...newProcess})
      }
    })
  }

  #onRecieveMessage(message){
    if(!message.id){
      return this.emit("error", "Every message recieved from a worker must have an id", message)
    }
    var process = this.#runningProcesses[message.id]
    if(!process){
      return this.emit("error", "Recieved message with no process expecting", message)
    }
    if()
  }
}
