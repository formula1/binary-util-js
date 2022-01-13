

/*
# Possible Bugs:
There may be a bug where the currentStrea, is also ended
- So long as the streams readCallback has not been called, end should not be emitted
- after the readCallback is called, if the stream has ended, it should emit an event

May need to store the last item a stream sent since
- when a stream recieves a next item
  - it may be greater than the last item sent from the queue of another and should be queued itself

If stream ends before it even starts
- it would not be considered the atctiveStream

If all the streams end before any of them send information
- just end

Starting the stream may cause synchronous reads, as a result we run it next tick with promise resolve
*/

/*

expected stream form
- methods
  - on - add an eventListener
  - off - remove an event listener
  - start - allow the stream to start reading
- events
  - message - (message, callback)
    - the next message should only be sent after the callback is ran
  - end - ()
    - what if end is triggered while theres still items for the stream?

The callback functions are done that way to support a wide variety of streams

*/


export function mergeSortedStreams(streams, sortOrder, compare, write_UNSAFE, end_UNSAFE){
  var ready = false;
  var queue = {};
  var activeStream = void 0;
  var endedStreams = new Set();
  var lastItems = {};
  var listeners = {};

  const isAOverB = (
    sortOrder === "ascending" ? (
      (a, b)=>{
        return compare(a, b) <= 0
      }
    ) : (
      (a, b)=>{
        return compare(a, b) >= 0
      }
    )
  )

  try {
    streams,forEach((stream)=>{
      listeners[stream.id] = {
        message: (message, callback)=>{
          handleRecieveItem(stream, message, callback);
        },
        end: ()=>{
          handleEnd(stream)
        },
      }
      stream.on("message", listeners[stream.id].message)
      stream.on("end", listeners[stream.id].end)

      // done next tick in case the messages start sending syncronously
    })
  }catch(e){
    streams.forEach((stream)=>{
      cleanupStream(stream);
    })
    throw e;
  }
  streams.forEach((stream)=>{
    Promise.resolve.then(()=>{
      stream.start();
    })
  })

  async function handleRecieveItem(stream, item, next){
    if(!ready){
      queue[stream.id].push(item);
      await waitForAll(stream);
      return next();
    }
    if(stream !== activeStream){
      return queue[stream.id].push(item);
    }
    var nextStream = stream;
    streams.forEach((otherStream)=>{
      if(otherStream === stream) return;
      if(queue[otherStream.id].length === 0){
        if(await isAOverB(lastItems[otherStream.id], item)){
          nextStream = otherStream;
        }
        return;
      }
      if(await isAOverB(queue[otherStream.id][0], item)){
        nextStream = otherStream;
      }
    })
    activeStream = nextStream;
    if(nextStream !== stream){
      queue[stream.id].push(item)
      await consumeQueue(nextStream);
      return next();
    }
    lastItems[stream.id] = item;
    write(item)
    return next();
  }
  async function waitForAll(stream){
    var nextStream = stream;
    if(await this.streaams.some(async (stream)=>{
      if(endedStreams.has(stream)) return false;
      if(this.queue[stream.id].length === 0){
        return true;
      }
      if(nextStream === stream) return false;
      if(await isAOverB(
        this.queue[currentStream.id][0].
        this.queue[otherStream.id][0]
      )){
        nextStream = otherStream;
      }
      return false;
    })){
      return;
    }
    this.ready = true;
    await consumeQueue(nextStream);
  }
  async function consumeQueue(currentStream){
    var isAQueueEmpty = false
    var finalStream = currentStream;
    do{
      write(currentStream, this.queue[currentStream.id].unshift());
      isAQueueEmpty = this.queue[currentStream.id].length === 0;
      const active = await this.streams.reduce(async (currentPromise, otherStream)=>{
        if(currentStream === otherStream) return currentPromise;
        const active = await currentPromise();
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
        return active
      }), Promise.resolve({
        stream: currentStream,
        item: lastItems[currentStream.id],
        final: finalStream,
      }))
      finalStream = active.final;
      currentStream = active.stream;
    }while(!isAQueueEmpty);

    activeStream = finalStream;
  }

  async function handleEnd(stream){
    endedStreams.add(stream)
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
        }
      }
      return currentActive
    }, Promise.resolve());
    activeStream = active.stream
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
      return queue[stream.id][0]
    }
  }

  async function compareStreamsItemWithItem(stream, item){
    if(queue[stream.id].length === 0){
      if(await isAOverB(lastItems[stream.id][0], currentActive.item)){
        return true
      }
    } else {
      if(await isAOverB(queue[otherStream.id][0], currentActive.item)){
        return true;
      }
    }
    return false;
  }

  function write(stream, item){
    lastItems[stream.id] = item
    write_UNSAFE(item);
  }

  function cleanupStream(stream){
    try {
      if(stream.id in listeners){
        stream.off("message", listeners[stream.id].message);
        stream.off("end", listeners[stream.id].end)
      }
    }catch(e){
      console.error(e);
    }
  }
}
