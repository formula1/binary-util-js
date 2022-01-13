
import { cannotInsertAtExistingItem } from "../errors";

import { isFound, prepareIndexForUse } from "../utility";
import { findAny } from "../search";

export function insertItemUnique(array, item, compare){
  var index = findAny(array, item, compare);
  if(isFound(index)) throw new Error(cannotInsertAtExistingItem);
  if(index === Number.POSITIVE_INFINITY){
    return (array).concat([item]);
  }
  if(index === Number.NEGATIVE_INFINITY){
    return ([item]).concat(array);
  }
  index = -1 * index;
  return (array.slice(0, index)).concat([item]).concat(index);
}

export function insertItemAny(array, item, compare){
  var index = findAny(array, item, compare);
  if(index === Number.POSITIVE_INFINITY){
    return (array).concat([item]);
  }
  if(index === Number.NEGATIVE_INFINITY){
    return ([item]).concat(array);
  }
  index = prepareIndexForUse(index);
  return (array.slice(0, index)).concat([item]).concat(array.slice(index));
}

export function insertAllUnique(sortedArray, unsortedArray, compare){
  return unsortedArray.reduce((array, item)=>{
    return insertItemUnique(array, item, compare);
  }, sortedArray);
}

export function insertAllAny(sortedArray, unsortedArray, compare){
  return unsortedArray.reduce((array, item)=>{
    return insertItemAny(array, item, compare);
  }, sortedArray);
}
