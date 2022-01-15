import {
  numCompare,
} from "../utility/compares.js";

import {
  isArraySorted,
  haveSameItems,
} from "../utility/checkers.js";

import {
  startOrEndShuffle
} from "../utility/shuffles.js";

import { insertItemAny } from "../../src/modifiers/insert.js";
import { mergeSortRecursive } from "../../src/modifiers/mergeSort/mergeSortRecursive.js";
import { mergeSortLoop } from "../../src/modifiers/mergeSort/mergeSortLoop.js";
import { mergeSortLoopLL } from "../../src/modifiers/mergeSort/mergeSortLoopLL.js";

runUnsorted(mergeSortRecursive, Math.pow(2, 16));
runUnsorted(mergeSortLoop, Math.pow(2, 16));
runUnsorted(mergeSortLoopLL, Math.pow(2, 16));

function runUnsorted(sorter, length){
  const unsortedArray = startOrEndShuffle(length);

  const start = Date.now();
  const sortedArray = sorter(unsortedArray, numCompare);
  const end = Date.now();

  const insertedArray = insertItemAny(
    sortedArray,
    length,
    numCompare
  );

  console.log(
    sorter.name, {
      array: sortedArray.length < 16 ? sortedArray : "too large",
      expectedLength: length,
      arrayLength: sortedArray.length,
      insertedIsSorted: isArraySorted(insertedArray, numCompare),
      isSorted: isArraySorted(sortedArray, numCompare),
      sameItems: haveSameItems(sortedArray, unsortedArray, numCompare),
      duration: end - start
    }
  );
}
