import { UNDEFINED } from "../constants.js";
import {
  easySingle,
  easyMin,
  easyMax,
} from "../utility.js";

import {
  emptyArrayMessage,
  testMinAndMax,
  compareError,
} from "../errors.js";

export function tryEarlyOuts(array, item, compare, minIndex, maxIndex){
  if(array.length === 0) throw new Error(emptyArrayMessage);
  testMinAndMax(array, minIndex, maxIndex);
  if(array.length === 1) return easySingle(array, item, compare);
  if(minIndex === maxIndex && minIndex !== UNDEFINED) {
    var c = compare(item, array[minIndex]);
    if(c > 1){
      if(
        minIndex === array.length - 1
        ||
        minIndex === UNDEFINED
      ) return Number.POSITIVE_INFINITY;
      else return -1 * (minIndex + 1);
    }
    if(c === 0) return minIndex;
    if(c < 1){
      if(
        minIndex === 0
        ||
        minIndex === UNDEFINED
      ) return Number.NEGATIVE_INFINITY;
      else return -1 * minIndex;
    }
    throw new Error(compareError);
  }
  return false;
}

export function testMinIndex(array, item, compare, maxIndex){
  if(maxIndex === UNDEFINED || maxIndex >= array.length-1){
    const currentCompare = easyMin(array, item, compare);
    if(currentCompare !== false) return currentCompare;
  }
  return false;
}

export function testMaxIndex(array, item, compare, minIndex){
  if(minIndex === UNDEFINED || minIndex === 0){
    const currentCompare = easyMax(array, item, compare);
    if(currentCompare !== false) return currentCompare;
  }
  return false;
}

export function testLastIsUnique(array, item, compare, maxIndex){
  if(maxIndex !== UNDEFINED){
    if(maxIndex < array.length - 1) return false;
  }
  const currentCompare = easyMax(array, item, compare);
  if(currentCompare === Number.POSITIVE_INFINITY) return currentCompare;
  if(currentCompare === false) return false;

  // So we just found an item at the first index
  // we have the opportunity to just check the next value
  // if the next value is greater than the current item, we've found the obly item

  if(compare(item, array[currentCompare-1]) > 0){
    return currentCompare;
  }
  if(array.length === 2){
    return Number.NEGATIVE_INFINITY;
  }
  return true;
}

export function testFirstIsUnique(array, item, compare, minIndex){
  if(minIndex !== UNDEFINED){
    if(minIndex > 0) return false;
  }
  const currentCompare = easyMin(array, item, compare);
  if(currentCompare === Number.NEGATIVE_INFINITY) return currentCompare;
  if(currentCompare === false) return false;

  // So we just found an item at the first index
  // we have the opportunity to just check the next value
  // if the next value is greater than the current item, we've found the obly item

  if(compare(item, array[currentCompare - 1]) > 0){
    return currentCompare;
  }
  if(array.length === 2){
    return Number.POSITIVE_INFINITY;
  }
  return true;
}
