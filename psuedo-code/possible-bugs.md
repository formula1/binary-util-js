# Possible Bugs:

There, may be a bug where the currentStrea, is also ended
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
