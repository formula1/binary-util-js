# Array Utils

This is a library with a bunch of Array utils. In a work where pe

# Methods

## Notes

For most of the functions a compare function will be needed.
Some examples:
```JavaScript
function compareNumbers(a, b){
  return a - b
}
function compareStrings(a, b){
  return (a).localeCompare(b)
}
function compareValuesInObject(aObj, bObj){
  return aObj[myKey] - bObj[myKey]
}
function compareValuesOfKey(aKey, bKey){
  return myObjects[aKey] - myObjects[bKey]
}
```

## Search
> These methods are meant to support lists that have multiple items with the same key

#### findAny
```javascript
  findAny(sortedArray, item, compare, minIndex = undefined, maxIndex = undefined)
```
- finds the first result found matching item, could be the first, last, middle, just the first one found
- This returns
  - the first index found between 0 to (array.length - 1)
  - Number.POSITIVE_INFINITY if its greater than the entire list
  - Number.NEGATIVE_INFINITY if its lesser than the entire lit
  - a negative index specifying which item it should come before

#### findFirst
```javascript
  findFirst(sortedArray, item, compare, minIndex = undefined, maxIndex = undefined)
```
- this returns the first result of the valid items
- This returns
  - the first index found between 0 to (array.length - 1)
  - Number.POSITIVE_INFINITY if its greater than the entire list
  - Number.NEGATIVE_INFINITY if its lesser than the entire lit
  - a negative index specifying which item it should come before

#### findLast
```javascript
  findLast(sortedArray, item, compare, minIndex = undefined, maxIndex = undefined)
```
- some lists have multiple of items of the same key
- this returns the last result of the valid items
- This returns
  - the first index found between 0 to (array.length - 1)
  - Number.POSITIVE_INFINITY if its greater than the entire list
  - Number.NEGATIVE_INFINITY if its lesser than the entire lit
  - a negative index specifying which item it should come before

#### findRange
```javascript
  findRange(sortedArray, item, compare, minIndex = undefined, maxIndex = undefined)
```
- some lists have multiple of items of the same key
- this returns either the only item if its unique
- This returns
  - Number.POSITIVE_INFINITY if its greater than the entire list
  - Number.NEGATIVE_INFINITY if its lesser than the entire lit
  - a negative index specifying which item it should come before
  - a positive index specifying if theres only one item
  - an array with [startIndex, endIndex] both should be positive numbers

## Modifiers
> Modifiers don't actually mutate the array. Instead it returns a new array.
In the future, I may do some mutations but for now we consider the original arrays immutable

### Insert Unique
> These will throw an error if another item matching it is found.
I might include the indexes of that the items were inserted at but I'm not sure

#### insertItemUnique
```JavaScript
  insertItemUnique(sortedArray, item, compare)
```
- returns
  - the new array with the item inserted
- I might also include the index that the item was inserted at

#### insertAllUnique
```JavaScript
  insertItemUnique(sortedArray, unsortedArray, compare)
```
- returns
  - the new array with the items inserted

### Insert Any
> These will insert at the first index found matching its conditions. doesn't matter if there is a duplicate item or not

#### insertItemAny
```javascript
  insertItemAny(sortedArray, item, compare)
```
- returns
  - the new array with the item inserted

#### insertAllAny
```javascript
  insertAllAny(sortedArray, unsortedArray, compare)
```
- returns
  - the new array with the items inserted

### Remove

#### removeAny
```javascript
  removeAny(array, item, compare)
```
- returns
  - if no item was found - returns false
  - if an item was found - a new array with the item removed

#### removeAll
```javascript
  removeAll(array, item, compare)
```
- returns
  - if no items were found - returns false
  - if items were found - a new array with the items removed


### Update

#### updateAny
```JavaScript
  updateAny(array, item, compare, update)
```
- returns
  - if no item was found - returns false
  - if an item was found - a new array with the old item removed and new item inserted


#### updateAll
```JavaScript
  updateAny(array, item, compare, update)
```
- returns
  - if no items were found - returns false
  - if items were found - a new array with the old items removed and new items inserted

### Sorting

#### mergeSort
```JavaScript
  mergeSort(array, compare)
```
- returns
  - a single sorted array

#### mergeSortedArrays
```javascript
  mergeSortedArrays(aArray,  bArray, compare);
```
- this is nice little function for programs that have two sorted arrays they want merged
- it's also used internally by mergeSort
- returns
  - a single sorted array

## Stream

#### mergeSortedStreams
> This was written with the newItemCallback and endCallback to support a wide variety of applications

```javascript
mergeSortedStreams(streams, sortOrder, compare, newItemCallback, endCallback);
```
- returns undefined

## Threading
> This is very prototypical but has the opportuinity to do expensive compares in a seperate thread.
It probably belongs in its own seperate repo.

# Todo

## Short Term
- try early outs based on minIndex and maxIndex even when they are not their defaults or undefined
- provide more information relating to errors
  - examples
    - what were the arguments for the compare result?
    - provided function is not a function, what is it?

## Long Term
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
- Support Sorting Streams
  - merging sorted streams
    - accepts whether the result stream should be ascending or descending
    - accepts an array of any number of sorted stream
    - each stream also should have an ascending or descending argument
      - will probably have to store the items where stream.sortOrder !== args.sortOrder
    - must wait for all streams to send their first item to start
    - returns one stream and whether its ascending or descending
  - sorting unsorted stream
    - note that I'd probably need

## Maybe
- support for negative min and max
  - this will result in array.length - min or array.length - max
- With merge sort, try to sort from both ends
  - currently I'm only checking the first items but I could be checking the last items as well
  - could make the whole sort go twice as fast
  - both front and back may overlap so I would have to make sure it doesn't
- make the non abstract functions private
- rename ThreadWorker to something like WorkOrganizer
