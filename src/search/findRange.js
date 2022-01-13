
import {
  negAndNot,
  negShouldBeEqual,
} from "../errors";

import {
  findFirst_UNSAFE,
} from "./findFirst";

import {
  findLast_UNSAFE,
} from "./findLast";

import {
  minIndexOrDefault,
  maxIndexOrDefault
} from "../utility";

import {
  tryEarlyOuts,
  testFirstIsUnique,
  testLastIsUnique,
} from "./early-outs";

export function findRange(array, item, compare, minIndex, maxIndex){
  const earlyOut = tryEarlyOuts(array, item, compare, minIndex, maxIndex);
  if(earlyOut !== false) return earlyOut;

  var lastTest = testLastIsUnique(array, item, compare, maxIndex);
  if(lastTest !== true && lastTest !== false) return lastTest;

  var firstTest = testFirstIsUnique(array, item, compare, minIndex);
  if(firstTest !== true && firstTest !== false){
    return firstTest;
  }

  minIndex = minIndexOrDefault(minIndex, firstTest);
  maxIndex = maxIndexOrDefault(maxIndex, array, lastTest);

  const firstResult = findFirst_UNSAFE(
    array, item, compare,
    minIndex, maxIndex,
    firstTest, lastTest
  );
  const lastResult = findLast_UNSAFE(
    array, item, compare,
    minIndex, maxIndex,
    firstTest, lastTest
  );

  if(firstResult < 0 || lastResult < 0){
    if(firstResult < 0){
      if(lastResult >= 0){
        throw new Error(negAndNot);
      }
      if(firstResult !== lastResult){
        throw new Error(negShouldBeEqual);
      }
    }
    if(lastResult < 0){
      if(firstResult >= 0){
        throw new Error(negAndNot);
      }
      if(firstResult !== lastResult){
        throw new Error(negShouldBeEqual);
      }
    }
    return firstResult;
  }

  return [firstResult, lastResult];
}
