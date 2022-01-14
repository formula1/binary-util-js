
import {
  minIndexOrDefault,
  maxIndexOrDefault
} from "../utility.js";

import {
  compareError,
} from "../errors.js";

import {
  testMaxIndex,
  testMinIndex,
  tryEarlyOuts
} from "./early-outs.js";

export function findAny(array, item, compare, minIndex, maxIndex){
  const earlyOut = tryEarlyOuts(array, item, compare, minIndex, maxIndex);
  if(earlyOut !== false) return earlyOut;

  var currentCompare;

  currentCompare = testMinIndex(array, item, compare, minIndex);
  if(currentCompare !== false) return currentCompare;
  currentCompare = testMaxIndex(array, item, compare, maxIndex);
  if(currentCompare !== false) return currentCompare;

  minIndex = minIndexOrDefault(minIndex);
  maxIndex = maxIndexOrDefault(maxIndex, array);

  return findAny_UNSAFE(
    array, item, compare,
    minIndex, maxIndex
  );
}

export function findAny_UNSAFE(array, item, compare, minIndex, maxIndex){
  var currentIndex;
  var currentCompare;

  while(minIndex <= maxIndex){
    currentIndex = Math.floor((minIndex + maxIndex) / 2);
    currentCompare = compare(item, array[currentIndex]);

    if(currentCompare > 0){
      minIndex = currentIndex + 1;
      continue;
    }
    if(currentCompare === 0){
      return currentIndex;
    }
    if(currentCompare < 0){
      maxIndex = currentIndex - 1;
      continue;
    }
    throw new Error(compareError);
  }
  return -1 * maxIndex;
}
