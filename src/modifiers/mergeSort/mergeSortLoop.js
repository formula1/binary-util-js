import { insertItemAny } from "../insert.js";

import {
  getFirst,
  LinkedList,
} from "../../utility.js";

import {
  mergeSingles, mergeSortedArraysNoSearch
} from "./reused.js";

export function mergeSortLoop(unsortedArray, compare){
  // const fnStart = Date.now();

  if(!Array.isArray(unsortedArray)){
    throw new Error("merge sort is expecting an array as its first argument");
  }
  if(typeof compare !== "function"){
    throw new Error("merge sort is expecting a function as its second argument");
  }
  if(unsortedArray.length === 0){
    return [];
  }
  if(unsortedArray.length === 1){
    return [getFirst(unsortedArray)];
  }
  if(unsortedArray.length === 2){
    return mergeSingles(
      unsortedArray[0],
      unsortedArray[1],
      compare
    );
  }
  const length = unsortedArray.length;
  const list = new LinkedList();
  var counter = 0;
  if(length % 2 > 0) {
    list.push(
      insertItemAny(
        mergeSingles(
          unsortedArray[0],
          unsortedArray[1],
          compare
        ),
        unsortedArray[2],
        compare
      )
    );
    counter += 3;

    // if length is three we skip the next loop
    // Then it fallse through the loop after because the list length is 1
  }

  while(length > counter){
    list.push(
      mergeSingles(
        unsortedArray[counter],
        unsortedArray[counter + 1],
        compare
      )
    );
    counter = counter + 2;
  }

  while(list.length > 1){
    const aI = list.pop();
    const bI = list.pop();

    const merged = mergeSortedArraysNoSearch(
      aI, bI,
      compare
    );

    list.unshift(merged);

  }

  return list.pop();
}
