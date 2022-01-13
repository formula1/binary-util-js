
import { ThreadWorkerNoModules } from "../ThreadWorkerNoModules";

export class WebWorker extends ThreadWorkerNoModules {

  constructor({ maxNumProcesses, availableFunctions }){
    super({ maxNumProcesses, availableFunctions });
  }

  // abstract functions
  listenForMessage(callback){
    self.addEventListener("message", (e)=>{
      callback(e.data);
    });
  }
  postMessage(arg){
    return self.postMessage(arg);
  }

}
