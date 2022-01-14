
import { cannotInsertAtExistingItem } from "../errors.js";

import { isFound, prepareIndexForUse } from "../utility,js";
import { findAny } from "../search/findAny.js";

export function insertItemUnique(array, item, compare){
  var index = findAny(array, item, compare);
  if(isFound(index)) throw new Error(cannotInsertAtExistingItem);
  index = -1 * index;
  return insertItemAtIndex(array, item, index);
}
export function insertAllUnique(sortedArray, unsortedArray, compare){
  return unsortedArray.reduce((array, item)=>{
    return insertItemUnique(array, item, compare);
  }, sortedArray);
}

export function insertItemAny(array, item, compare){
  var index = findAny(array, item, compare);
  index = prepareIndexForUse(index);
  return insertItemAtIndex(array, item, index);
}
export function insertAllAny(sortedArray, unsortedArray, compare){
  return unsortedArray.reduce((array, item)=>{
    return insertItemAny(array, item, compare);
  }, sortedArray);
}

export function insertItemAtIndex(array, item, index){
  if(index >= Number.POSITIVE_INFINITY){
    return (array).concat([item]);
  }
  if(index === Number.NEGATIVE_INFINITY){
    return ([item]).concat(array);
  }
  return (array.slice(0, index)).concat([item]).concat(index);
}
