import { insertItemAny } from "../insert.js";

import {
  getFirst, getLast,
} from "../../utility.js";

import {
  buildEmptyArray,
  mergeSinglesArray,
  mergeSortedArraysNoSearch,
} from "./reused.js";

export function mergeSortRecursive(initialArray, compare){
  if(!Array.isArray(initialArray)){
    throw new Error("merge sort is expecting an array as its first argument");
  }
  if(typeof compare !== "function"){
    throw new Error("merge sort is expecting a function as its second argument");
  }
  if(initialArray.length === 0){
    return [];
  }
  if(initialArray.length === 1){
    return [getFirst(initialArray)];
  }
  return divideRecursion(initialArray);

  function divideRecursion(array){

    if(array.length <= 1){
      return array;
    }
    const middle = Math.floor(array.length/2);
    const aA = array.slice(0, middle);
    const bA = array.slice(middle);

    if(aA.length === 1 && bA.length === 1){
      const result = mergeSinglesArray(aA[0],  bA[0], compare);
      return result;
    }
    if(aA.length > 1 && bA.length > 1){
      const result = mergeSortedArraysNoSearch(
        divideRecursion(aA),
        divideRecursion(bA),
        compare,
        getFirst, getLast,
        buildEmptyArray, mergeSinglesArray, insertItemAny
      );
      return result;
    }
    if(aA.length <= 1){
      const result = mergeSortedArraysNoSearch(
        aA, divideRecursion(bA),
        compare,
        getFirst, getLast,
        buildEmptyArray, mergeSinglesArray, insertItemAny
      );
      return result;
    }
    if(bA.length <= 1){
      const result = mergeSortedArraysNoSearch(
        divideRecursion(aA), bA,
        compare,
        getFirst, getLast,
        buildEmptyArray, mergeSinglesArray, insertItemAny
      );
      return result;
    }
    throw new Error(
      "Something went wrong with the array lengths: "
      + "\naArray.length " + aA.length
      + "\nbArray.length " + bA.length
    );
  }
}
