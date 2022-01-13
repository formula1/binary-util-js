/* eslint-env browser */
/* global WebWorker */

import { ThreadClientBase } from "../ThreadClient";
import { PING_PROCESS_TYPE } from "../../constants";

const DEFAULT_AVAILABLE_CPU_THREADS = 1;

export class WebWorkerClient extends ThreadClientBase {

  constructor({ pathToWorkerScript, maxQueueStack, cpuThreads, availableFunctions }){
    super({ pathToWorkerScript, maxQueueStack, cpuThreads, availableFunctions });
  }
  getAvailableCPUs(){
    throw window.navigator.hardwareConcurrency || DEFAULT_AVAILABLE_CPU_THREADS;
  }
  createWorker(pathToWorkerScript){
    // this is an abstract function
    // needs to be implemented
    return new WebWorker(pathToWorkerScript);
  }
  listenForMessage(worker, callback){
    worker.addEventListener("message", (e)=>{
      callback(e.data);
    });
  }
  listenForDeath(worker, callback){
    const interval = setInterval(async ()=>{
      try {
        const result = this.startProcess(PING_PROCESS_TYPE, "ping", 100);
        console.log("ping", result);
      }catch(e){
        clearInterval(interval);
        callback(e);
      }
    }, 250);
  }

  sendMessageToWorker(worker, message){
    worker.postMessage(message);
  }

  killWorker(worker){
    worker.terminate();
  }

}
