
import { compareError } from "../errors.js";
import { findLast } from "../search/findLast.js";

import { prepareIndexForUse } from "../utility.js";

export function mergeSort(array, compare){
  return divide(array);

  function divide(array){
    if(array.length <= 1){
      return array;
    }
    var middle = Math.floor(array.length/2);
    var aA = array.slice(0, middle);
    var bA = array.slice(middle, 0);

    if(aA.length <= 1 && bA.length <= 1){
      return mergeSortedArrays(aA, bA, compare);
    }
    if(aA.length > 1 && bA.length > 1){
      return mergeSortedArrays(divide(aA), divide(bA), compare);
    }
    if(aA.length === 1){
      return mergeSortedArrays(aA, divide(bA), compare);
    }
    if(bA.length === 1){
      return mergeSortedArrays(divide(aA), bA, compare);
    }

  }
}

export function mergeSortedArrays(aA,  bA, compare){
  if(aA.length === 0){
    return bA;
  }
  if(bA.length === 0){
    return aA;
  }

  function first(array){
    return array[0];
  }
  function last(array){
    return array[array.length - 1];
  }

  if(aA.length === 1 && bA.length === 1){
    const result = compare(first(aA), first(bA));
    if(result < 0){
      return (aA).concat(bA);
    }
    if(result === 0){
      // Should I do a random number?
      return (aA).concat(bA);
    }
    if(result > 0){
      return (bA).concat(aA);
    }
    throw new Error(compareError);
  }

  if(compare(first(aA), last(bA)) >= 0){
    return (bA).concat(aA);
  }
  if(compare(last(aA), first(bA)) <= 0){
    return (aA).concat(bA);
  }

  const expectedFinalLength = aA.length + bA.length;
  var finalArray = [];

  while(finalArray.length < expectedFinalLength){
    const bCurrent = first(bA);
    const aOffset = findLast(aA, bCurrent, compare);
    const aCurrent = first(aA);
    const bOffset = findLast(bA, aCurrent, compare);
    if(aOffset >= aA.length || aOffset === Number.POSITIVE_INFINITY){
      // if the current b item is greater than the last item of the b array
      return (finalArray).concat(aA).concat(bA);
    }
    if(bOffset >= bA.length || bOffset === Number.POSITIVE_INFINITY){
      // if the current a item is greater than the last item of the b array
      return (finalArray).concat(bA).concat(aA);
    }
    if(aOffset === Number.NEGATIVE_INFINITY){
      if(bOffset === aOffset){
        throw new Error("if a wants to go first, the b should know it goes after it");
      }
      finalArray = (
        (finalArray)
        .concat(bA.splice(0, prepareIndexForUse(bOffset)))
        .concat(aA.splice(0, 1))
      );
      continue;
    }
    if(bOffset === Number.NEGATIVE_INFINITY){
      finalArray = (
        (finalArray)
        .concat(aA.splice(0, prepareIndexForUse(aOffset)))
        .concat(bA.splice(0, 1))
      );
      continue;
    }
    finalArray = (
      (finalArray)
      .concat(aA.splice(0, prepareIndexForUse(aOffset)))
      .concat(bA.splice(0, prepareIndexForUse(bOffset)))
    );
  }
  return finalArray;
}
