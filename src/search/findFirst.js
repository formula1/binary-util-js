
import {
  minIndexOrDefault,
  maxIndexOrDefault
} from "../utility.js";

import {
  compareError,
} from "../errors.js";

import {
  tryEarlyOuts,
  testMinIndex,
  testLastIsUnique,
} from "./early-outs.js";

export function findFirst(array, item, compare, minIndex, maxIndex){
  const earlyOut = tryEarlyOuts(array, item, compare, minIndex, maxIndex);
  if(earlyOut !== false){
    return earlyOut;
  }

  const currentCompare = testMinIndex(array, item, compare, minIndex);
  if(currentCompare !== false) return currentCompare;

  const lastTest = testLastIsUnique(array, item, compare, maxIndex);
  if(lastTest !== false && lastTest !== true){
    return lastTest;
  }

  minIndex = minIndexOrDefault(minIndex, false);
  maxIndex = maxIndexOrDefault(maxIndex, array, lastTest);

  return findFirst_UNSAFE(
    array, item, compare,
    minIndex, maxIndex,
    lastTest
  );
}

export function findFirst_UNSAFE(array, item, compare, minIndex, maxIndex, lastTest){
  var currentMin = lastTest ? array.length - 2 : void 0;

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
      if(currentIndex - 1 < minIndex){
        return currentIndex;
      }
      if(compare(item, array[currentIndex-1]) < 0){
        return currentIndex;
      }
      currentMin = currentIndex;
      maxIndex = currentIndex - 2;
      continue;
    }
    if(currentCompare < 0){
      maxIndex = currentIndex - 1;
      continue;
    }
    throw new Error(compareError);
  }
  if(currentMin > 0){
    return currentMin;
  }
  return -1 * minIndex;
}
