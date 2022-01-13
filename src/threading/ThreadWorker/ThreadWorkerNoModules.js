
import { uniqueId } from "../utility";

import {
  baseFnTypeMissing,
} from "../errors";

import { ThreadWorkerBase } from "./ThreadWorkerBase";

export class ThreadWorkerNoModules extends ThreadWorkerBase {

  constructor({ maxNumProcesses, availableFunctions }){
    super({ maxNumProcesses, availableFunctions });
  }
  async add({ baseFnType, initialArgs }){
    baseFnType = baseFnType.toUpperCase();
    if(!(baseFnType in this.baseFnTypes)){
      throw new Error(baseFnTypeMissing);
    }

    // might throw an error
    const digestedArgs = await this.baseFnTypes.digestInitialArgs(initialArgs);

    const id = uniqueId(baseFnType);
    this.preparedFns[id] = {
      baseFnType: baseFnType,
      digestedArgs: digestedArgs,
    };
    return id;
  }
  async run({ id, args }){
    if(!(id in this.preparedFns)){
      throw new Error(`sort id[${id}] does not exist`);
    }
    const fnPrep = this.preparedFns[id];
    const fn = this.baseFnTypes[fnPrep.baseFnType];
    return await fn.run(fnPrep.digestedArgs, args);
  }
  async remove({ id }){
    if(!(id in this.preparedFns)){
      return false;
    }
    try {
      await this.preparedFns[id].cleanup(this.preparedFns[id].digestedArgs);
      delete this.preparedFns[id];
      return true;
    }catch(e){
      delete this.preparedFns[id];
      throw e;
    }
  }
}
