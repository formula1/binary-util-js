# Array Utils

This is a library with a bunch of Array utils. In a work where pe

# Methods
- findAny
  - some lists have multiple of the same key
  - as a result, if you don't care which item, findAny will get that item
- findRange
  - some lists have multiple of the same key
  - what this does is find the starting and ending point of the range
  - if you want to include results that don't end up as 0 such as including a range between 0 and 5
```javascript
function myCompareFn(a,b){
  var diff = b - a;
  if(diff > 0 && diff < 5){
    return 0
  }
  return diff;
}
```
- findFirst
  - some lists have multiple of the same key
  - this function finds the first item that fits the value
- findLast
  - some lists have multiple of the same key
  - this function finds the last item that fits the value

- insert
  - takes
- upsert

# Short Term
- try early outs based on minIndex and maxIndex even when they are not their defaults or undefined
- provide more information relating to errors
  - examples
    - what were the arguments for the compare result?
    - provided function is not a function, what is it?
- insert first and last

# Long Term
- Rewritten Typescript support
- Async Support
  - some compares use things like files or async storage
    - as a result, the searches and sorts
- Threading support
  -
  - make thread client and thread worker abstract
  - allow the thread to load in external node modules
- Use BigNumber to support abusrdly large lists
- Bucket Sort?
- Support using a file with arbitrarilly large items (like strings)
  - maybe a CSV?
    - each value needs to escape their escape characters and their "objectend" character
  - search algortihm
    - go to the middle of the file
    - objectStart = the "objectend" before the currentItem
      - check the byte before it to ensure that it isn't an escape character
    - objectEnd = find the "objectend" after the currentItem
      - if the byte before it was an escape character, skip that object end
    - return value(fileRead(objectStart, objectEnd))
    - this method technically isn't the same as a binary search, it's more of an "approximated search"
  - this needs its own getFirst, getLast and getAtIndex functions since it would probably be async or require loops/iteration until the program finds the "objectend" they are looking for
- support both mutable and immutable arrays
- create tests
- wasm search and modifiers though I'm not sure if wasm can run a "compare" function nor has async/await support

# Maybe
- support for negative min and max
  - this will result in array.length - min or array.length - max
- With merge sort, try to sort from both ends
  - currently I'm only checking the first items but I could be checking the last items as well
  - could make the whole sort go twice as fast
  - both front and back may overlap so I would have to make sure it doesn't
- make the non abstract functions private
- rename ThreadWorker to something like WorkOrganizer
