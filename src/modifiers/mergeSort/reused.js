import { compareError } from "../../errors.js";
import { findLast } from "../../search/findLast.js";

import { insertItemAny } from "../insert.js";

import {
  prepareIndexForUse,
  getFirst,
  getLast,
} from "../../utility.js";

export function mergeSortedArraysSeach(aA,  bA, compare){
  if(aA.length === 0){
    return bA;
  }
  if(bA.length === 0){
    return aA;
  }

  if(aA.length === 1 && bA.length === 1){
    return mergeSingles(getFirst(aA), getFirst(bA), compare);
  }

  if(compare(getFirst(aA), getLast(bA)) >= 0){
    return (bA).concat(aA);
  }
  if(compare(getLast(aA), getFirst(bA)) <= 0){
    return (aA).concat(bA);
  }

  var finalArray = [];

  while(aA.length > 0 && bA.length > 0){
    const bCurrent = getFirst(bA);
    const aOffset = findLast(aA, bCurrent, compare);
    const aCurrent = getFirst(aA);
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
  if(aA.length){
    return finalArray.concat(aA);
  }
  if(bA.length){
    return finalArray.concat(bA);
  }
  return finalArray;
}

export function mergeSortedArraysNoSearch(aA,  bA, compare){
  if(aA.length === 0){
    return bA;
  }
  if(bA.length === 0){
    return aA;
  }

  if(aA.length === 1 && bA.length === 1){
    return mergeSingles(aA.shift(), bA.shift(), compare);
  }

  if(compare(getFirst(aA), getLast(bA)) >= 0){
    return (bA).concat(aA);
  }
  if(compare(getLast(aA), getFirst(bA)) <= 0){
    return (aA).concat(bA);
  }

  // var totalShiftTime = 0;

  var finalArray = [];

  // var shiftStart = Date.now();

  var aCurrent = aA.shift();
  var bCurrent = bA.shift();

  // totalShiftTime += Date.now() - shiftStart;

  var c;

  do{
    c = compare(aCurrent, bCurrent);
    if(c < 0){
      finalArray.push(aCurrent);

      // shiftStart = Date.now();

      aCurrent = aA.shift();

      // totalShiftTime += Date.now() - shiftStart;
      continue;
    }
    if(c === 0){

      finalArray.push(aCurrent);
      finalArray.push(bCurrent);

      // shiftStart = Date.now();

      aCurrent = aA.shift();
      bCurrent = bA.shift();

      // totalShiftTime += Date.now() - shiftStart;

      continue;
    }
    if(c > 0){
      finalArray.push(bCurrent);

      // shiftStart = Date.now();

      bCurrent = bA.shift();

      // totalShiftTime += Date.now() - shiftStart;
      continue;
    }
    throw new Error(compareError);
  }while(aA.length > 0 && bA.length > 0);

  if(aA.length === 0 && bA.length === 0){
    return finalArray.concat(mergeSingles(aCurrent, bCurrent, compare));
  }

  if(aA.length === 0){
    return finalArray.concat(
      insertItemAny(
        ([bCurrent]).concat(bA),
        aCurrent,
        compare
      )
    );
  }
  if(bA.length === 0){
    return finalArray.concat(
      insertItemAny(
        ([aCurrent]).concat(aA),
        bCurrent,
        compare
      )
    );
  }
}

export function mergeSingles(aI, bI, compare){
  const result = compare(aI, bI);
  if(result < 0){
    return [aI, bI];
  }
  if(result === 0){
    // Should I do a random number?
    return [aI, bI];
  }
  if(result > 0){
    return [bI, aI];
  }
  throw new Error(compareError);
}
