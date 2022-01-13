import {
  minIndexOrDefault,
  maxIndexOrDefault
} from "../utility";

import {
  compareError,
} from "../errors";

import {
  tryEarlyOuts,
  testFirstIsUnique,
  testMaxIndex,
} from "./early-outs";

export function findLast(array, item, compare, minIndex, maxIndex){
  const earlyOut = tryEarlyOuts(array, item, compare, minIndex, maxIndex);
  if(earlyOut !== false){
    return earlyOut;
  }

  const currentCompare = testMaxIndex(array, item, compare, maxIndex);
  if(currentCompare !== false) return currentCompare;

  const firstTest = testFirstIsUnique(array, item, compare, minIndex);
  if(firstTest !== false && firstTest !== true){
    return firstTest;
  }

  minIndex = minIndexOrDefault(minIndex, firstTest);
  maxIndex = maxIndexOrDefault(maxIndex, array, false);

  return findLast_UNSAFE(
    array, item, compare,
    minIndex, maxIndex,
    firstTest, false
  );
}

export function findLast_UNSAFE(array, item, compare, minIndex, maxIndex, firstTest){

  var currentMax = firstTest ? 1 : void 0;

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
      if(currentIndex + 1 > maxIndex){
        return currentIndex;
      }
      if(compare(item, array[currentIndex+1]) < 0){
        return currentIndex;
      }
      currentMax = currentIndex;
      minIndex = currentIndex - 2;
      continue;
    }
    if(currentCompare > 0) {
      maxIndex = currentIndex - 1;
      continue;
    }
    throw new Error(compareError);
  }
  if(currentMax > 0){
    return currentMax;
  }
  return -1 * maxIndex;
}
