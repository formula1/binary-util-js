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
- insert
  - takes
- upsert

# Todo
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
- support both mutable and immutable arrays
