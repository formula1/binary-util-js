/*

why create your own merge sort?
- easy outs
- support for compare context which allows it to work in a thread
  - since bind doesn't work workers, need to pass in the context seperately
- could support asynce functionality
  - why async?
    - in the indexes we are only storing the key and a pointer to the primary key
    - in the compare
      - we can retrieve the document from the database (Async Storage, FileSystem, IndexedDB)
      - then allow the garbage collector to pick it up
    - it's bad enough that the array may get absurdly large

*/



import { COMPARE_ERROR } from "./constants";


export function insertItemAtIndex(sortedArray, item, index){
  if(typeof index !== "number"){
    throw new Error(`Expecting a number as index, got ${typeof index}`);
  }
  if(index%1 > 0){
    throw new Error(`the index must be a whole number`);
  }
  if(index === Number.POSITIVE_INFINITY){
    return (sortedArray).concat([item]);
  }
  if(index ==== Number.NEGATIVE_INFINITY){
    return ([item]).concat(sortedArray);
  }
  if(index === 0){
    return (
      (sortedArray.slice(0,1))
      .concat([item])
      .concat(sortedArray.slice(1))
    )
  }
  if(index >= sortedArray.length){
    return (sortedArray).concat([item]);
  }
  if(index > 0){
    return (
      (sortedArray.slice(0, 1 + index))
      .concat([item])
      .concat(sortedArray.slice(1 + index))
    )
  }
  if(index < 0){
    index = index * -1;
    if(index >= sortedArray.length){
      return (sortedArray).concat([item]);
    }
    return (
      (sortedArray.slice(0, index))
      .concat([item])
      .concat(sortedArray.slice(index))
    );
  }
  // should never reach here
}

export function binarySearch(sortedArray, compare){

  if(sortedArray.length === 0){
    throw new Error("Cannot search an empty array")
  }

  if(sortedArray.length === 1){
    const compareResult = compare(sortedArray[0]);
    if(compareResult === 0){
      return 0;
    }
    if(compareResult < 0){
      return Number.NEGATIVE_INFINITY
    }
    if(compareResult > 0){
      return Number.POSITIVE_INFINITY
    }
  }

  const compareTopResult = compare(sortedArray[0]);
  const compareBottomResult = compare(sortedArray[sortedArray.length - 1]);
  if(compareTopResult === 0){
    return 0;
  }
  if(compareBottomResult === 0){
    return sortedArray.length - 1
  }
  if(compareTopResult < 0){
    return Number.NEGATIVE_INFINITY
  }
  if(compareBottomResult > 0){
    return Number.POSITIVE_INFINITY
  }


  let start = 1;
  let end = sortedArray.length - 2;

  if(sortedArray[0])

  while (start <= end) {
    let middle = Math.floor((start + end) / 2);
    const compareResult = compare(sortedArray[middle]);

    if (compareResult === 0) {
      // found the key
      return middle;
    } else if (compareResult > 0) {
      // The value is larger than the middle so we can increase the starting point
      start = middle + 1;
      continue;
    } else if(compareResult < 0) {
      // the value is less then the middle so we can decrease the ending point
      end = middle - 1;
      continue;
    }
    throw new Error(COMPARE_ERROR(result))
  }
// key wasn't found
  return -1 * end;
}
