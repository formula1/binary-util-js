


class ThreadWorker(){
  #idCounter = 0;
  #modulesInUse = {};
  #messageIds = {};
  #preparedFns = {};
  #baseFnTypes = {
    SEARCH: binarySearch,
    SORT: mergeSort
  };

  async onMessageListener(message){
    try {
      message = JSON.parse(message)
    }catch(e){
      console.error(`failed parsing message: ${message}`)
      console.error(e);
      return;
    }
    if(!message.id){
      console.error(`message must have an id: ${JSON.stringify(message, null, 2)}`)
      return;
    }
    if(message.id in this.messageIds){
      console.error(`message must have unique id, got a duplicate: ${message.id}`)
      return;
    }
    try {
      switch(message.args.type){
        case "add": {
          return this.respond(
            message.id,
            false,
            addSort(message.args)
          )
        }
        case "run": {
          return this.respond(
            message.id,
            false,
            runSort(message.args)
          )
        }
        case "remove": {
          return this.respond(
            message.id,
            false,
            removeSort(message.args)
          )
        }
        default: {
          throw new Error("invalid type of message " + message.args.type)
        }
      }
    }catch(e){
      return this.response(
        message.id,
        true,
        {
          message: e.message,
          stack: e.stack,
        }
      )
    }
  }
  respond(messageId, isError, result){
    return self.postMessage(JSON.stringify({
      id: messageId,
      isError: true,
      result: result
    }))
  }

  oneOff({ array, baseFnType, compare, context, modules}){
    var id = this.add({ baseFnType, compare, context, modules });
    this.run({ id, array });
    this.remove({ id });
  }

  add({ baseFnType, compare, context, modules }){
    baseFnType = baseFnType.toUpperCase();
    if(!(baseFnType in this.#baseFnTypes)){
      throw new Error(
        "base function type " + baseFnType + " is not in the list: " + JSON.stringify(Object.keys(this.#baseFnTypes))
      );
    }
    // run the function parser so we can exit early if theres an error
    var compareFn = new Function("return " + compare)()

    // run the add modules because the require might return an error
    this.#addModules(modules);

    const id = baseFnType + "-" + (this.#idCounter++).toString(32) + Date.now().toString(32) + "-" + Math.random().toString(32).substring(2);
    const modules = moduleNanes.reduce((obj, moduleName)=>{
      obj[moduleName] = this.#modulesInUse[moduleName].
    }, {});
    this.#preparedFns[id] = {
      compare: comparFn.bind({ context: context, modules: modules }),
      baseFnType: baseFnType,
      libraryNanes: modules
    }
    return id;
  }
  run({ id, array }){
    if(!(id in this.#sorts)){
      throw new Error(`sort id[${id}] does not exist`)
    }
    const { compare, baseFnType } = this.#sorts[id];
    return this.#baseFnTypes[baseFnType](array, compare)
  }
  remove({ id }){
    if(!(id in this.#preparedFns)){
      return false;
    }
    this.#removeModules(this.#preparedFns[id].moduleNames);
    delete this.#preparedFns[id];
    return true;
  }

  #addModules(moduleNames){
    try {
      moduleNames.forEach(()=>{
        if(library in this.#modulesInUse){
          return;
        }
        this.#modulesInUse[library] = {
          counter: 0,
          result: require(library)
        }
      })
      moduleNames.forEach((library)=>{
        this.#modulesInUse[library].counter++;
      })
    }catch(e){
      // if get an error, revert all the changes we just made
      // the error probably will be the result of the require
      moduleNames.forEach((library)=>{
        if(!(library in this.#modulesInUse)){
          // if the first one causes an error, all the rest won't get added
          return;
        }
        if(this.#modulesInUse[library].counter > 0){
          return;
        }
        delete this.#modulesInUse[library];
      })
      throw e
    }
  }
  #removeModules(moduleNames){
    moduleNames.forEach((moduleName)=>{
      if(!(library in this.#modulesInUse)){
        console.warn("missing module: " + moduleName)
        return;
      }
      this.modulesInUse[moduleName].counter--;
      if(this.modulesInUse[moduleName].counter === 0){
        // allow the garbage collector to do the rest
        delete this.modulesInUse[library];
      }
    })
  }

}
