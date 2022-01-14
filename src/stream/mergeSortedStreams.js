
export function mergeSortedStreams(streams, sortOrder, compare, write_UNSAFE, end_UNSAFE){
  var ready = false;
  var queue = {};
  var activeStream = void 0;
  var endedStreams = new Set();
  var lastItems = {};
  var listeners = {};

  const isAOverB = (
    sortOrder === "ascending" ? (
      (a, b)=>(compare(a, b) <= 0)
    ) : (
      (a, b)=>(compare(a, b) >= 0)
    )
  );

  try {
    streams.forEach((stream)=>{
      listeners[stream.id] = {
        message: (message, callback)=>{
          handleRecieveItem(stream, message, callback);
        },
        end: ()=>{
          handleEnd(stream);
        },
      };
      stream.on("message", listeners[stream.id].message);
      stream.on("end", listeners[stream.id].end);

      // done next tick in case the messages start sending syncronously
    });
  }catch(e){
    streams.forEach((stream)=>{
      cleanupStream(stream);
    });
    throw e;
  }
  streams.forEach((stream)=>{
    Promise.resolve.then(()=>{
      stream.start();
    });
  });

  async function handleRecieveItem(stream, item, next){
    if(!ready){
      queue[stream.id].push(item);
      await waitForAll(stream);
      return next();
    }
    if(stream !== activeStream){
      return queue[stream.id].push(item);
    }
    var nextStreamAndItem = await streams.reduce(async (currentPromise, otherStream)=>{
      if(otherStream === stream) return currentPromise;
      const active = await currentPromise;
      const otherItem = getActiveItem(otherStream);
      if(await isAOverB(otherItem, active.item)){
        return {
          stream: otherStream,
          item: otherItem
        };
      }
      return active;
    }, Promise.resolve({
      stream: stream,
      item: item
    }));
    activeStream = nextStreamAndItem.stream;
    if(activeStream !== stream){
      queue[stream.id].push(item);
      await consumeQueue(activeStream);
      return next();
    }
    lastItems[stream.id] = item;
    write(item);
    return next();
  }
  async function waitForAll(stream){
    var nextStreamOrFalse = streams.reduce(async (streamOrFalseP, otherStream)=>{
      const streamOrFalse = await streamOrFalseP;
      if(streamOrFalse === false) return false;
      if(endedStreams.has(otherStream)) return streamOrFalse;
      if(this.queue[otherStream.id].length === 0){
        return false;
      }
      if(await isAOverB(
        queue[otherStream.id][0],
        queue[streamOrFalse.id][0]
      )){
        return otherStream;
      }
      return streamOrFalse;
    }, Promise.resolve(stream));

    if(nextStreamOrFalse === false){
      return;
    }
    this.ready = true;
    await consumeQueue(nextStreamOrFalse);
  }
  async function consumeQueue(currentStream){
    var isAQueueEmpty = false;
    var finalStream = currentStream;
    do{
      write(currentStream, this.queue[currentStream.id].unshift());
      isAQueueEmpty = this.queue[currentStream.id].length === 0;
      const active = await this.streams.reduce(async (currentPromise, otherStream)=>{
        if(currentStream === otherStream) return currentPromise;
        const active = await currentPromise;
        if(!await isAOverB(
          queue[active.stream.id][0].
          queue[otherStream.id][0]
        )){
          return active;
        }
        active.stream = otherStream;
        if(!endedStreams.has(otherStream)){
          active.final = otherStream;
        }
        return active;
      }, Promise.resolve({
        stream: currentStream,
        item: lastItems[currentStream.id],
        final: finalStream,
      }));
      finalStream = active.final;
      currentStream = active.stream;
    }while(!isAQueueEmpty);

    activeStream = finalStream;
  }

  async function handleEnd(stream){
    endedStreams.add(stream);
    cleanupStream(stream);
    if(streams.length === 0){

      // If there is no active stream
      // - when all the streams ended before ending items
      // - just end
      if(activeStream) await consumeQueue(activeStream);
      end_UNSAFE();
      return;
    }
    if(stream !== activeStream){
      return;
    }
    activeStream = void 0;
    const active = await streams.reduce(async (currentPromise, otherStream)=>{
      if(endedStreams.has(otherStream)) return currentPromise;
      var currentActive = await currentPromise();
      if(currentActive === void 0){
        return {
          stream: otherStream,
          item: getActiveItem(otherStream),
        };
      }
      if(compareStreamsItemWithItem(otherStream, currentActive.item)){
        return {
          stream: otherStream,
          item: getActiveItem(otherStream),
        };
      }
      return currentActive;
    }, Promise.resolve());
    activeStream = active.stream;
    if(!ready){
      return waitForAll();
    }
    if(queue[activeStream.id].length > 0){
      return consumeQueue(activeStream);
    }
  }

  function getActiveItem(stream){
    if(queue[stream.id].length === 0){
      return lastItems[stream.id];
    } else {
      return queue[stream.id][0];
    }
  }

  async function compareStreamsItemWithItem(stream, item){
    const otherItem = getActiveItem(stream);
    if(await isAOverB(otherItem, item)){
      return true;
    }
    return false;
  }

  function write(stream, item){
    lastItems[stream.id] = item;
    write_UNSAFE(item);
  }

  function cleanupStream(stream){
    try {
      if(stream.id in listeners){
        stream.off("message", listeners[stream.id].message);
        stream.off("end", listeners[stream.id].end);
      }
    }catch(e){
      console.error(e);
    }
  }
}
