import * as tap from "tap";

import {
  numCompare
} from "./utility/compares.js";

import {
  isArraySorted,
  haveSameItems,
  sameItemsSameOrder,
} from "./utility/checkers.js";

import {
  startOrEndShuffle
} from "./utility/shuffles.js";

import { mergeSortRecursive } from "../src/modifiers/mergeSort/mergeSortRecursive.js";
import { mergeSortLoop } from "../src/modifiers/mergeSort/mergeSortLoop.js";

tap.test("sorting", async (sortTest)=>{
  sortTest.test("mergeSort recursion:", async (reTest)=>{
    runSortTest(reTest, mergeSortRecursive);
  });
  sortTest.test("mergeSort no recursion:", async (noTest)=>{
    runSortTest(noTest, mergeSortLoop);
  });
});

function runSortTest(sortTest, sorter){
  sortTest.throws(
    ()=>(sorter("I'm not an array", numCompare)),
    void 0,
    "non array throws an error"
  );
  sortTest.throws(
    ()=>(sorter(void 0, numCompare)),
    void 0,
    "no array throws an error"
  );
  sortTest.throws(
    ()=>(sorter([], "i'm not a function")),
    void 0,
    "bad compare function throws an error"
  );
  sortTest.throws(
    ()=>(sorter([], void 0)),
    void 0,
    "no compare function throws an error"
  );
  sortTest.test("empty array returns empty array", async (emptyTest)=>{
    const arg = [];
    const result = sorter(arg, numCompare);
    emptyTest.notOk(arg === result, "The returned array should be different");
    emptyTest.ok(result.length === arg.length, "The returned lengths are the same");
    emptyTest.ok(result.length === 0, "The length is 0");
  });
  sortTest.test("single array returns single array", async (emptyTest)=>{
    const arg = [Number.POSITIVE_INFINITY];
    const result = sorter(arg, numCompare);
    emptyTest.notOk(arg === result, "The returned array should be different");
    emptyTest.ok(result.length === arg.length, "The returned lengths are the same");
    emptyTest.ok(haveSameItems(result, arg, numCompare), "have the same items");
    emptyTest.ok(arg.length === 1, "The length is 1");
  });
  sortTest.test("tiny number arrays", async (simpleTest)=>{
    simpleTest.test("even", async (evenTest)=>{
      runSortedProbablyAndUnsortedTests(evenTest, sorter, 8);
    });
    simpleTest.test("odd", async (evenTest)=>{
      runSortedProbablyAndUnsortedTests(evenTest, sorter, 9);
    });
  });

  sortTest.test("small number arrrays", async (simpleTest)=>{
    simpleTest.test("even", async (evenTest)=>{
      runSortedProbablyAndUnsortedTests(evenTest, sorter, Math.pow(2, 8));
    });
    simpleTest.test("odd", async (oddTest)=>{
      runSortedProbablyAndUnsortedTests(oddTest, sorter, Math.pow(2, 8));
    });
  });

  // sortTest.test("big array", async (bigTest)=>{
  //   const BIG_NUMBER = Math.pow(2, 16);
  //   bigTest.test("even", async (evenTest)=>{
  //     runSortedProbablyAndUnsortedTests(evenTest, sorter, BIG_NUMBER);
  //   });
  //   bigTest.test("odd", async (evenTest)=>{
  //     runSortedProbablyAndUnsortedTests(evenTest, sorter, BIG_NUMBER - 1);
  //   });
  // });
}

function runSortedProbablyAndUnsortedTests(test, sorter, length){
  test.test("unsorted", async (unsortedTest)=>{
    unsortedTest.test("unique", async (uTest)=>{
      const unsortedArray = startOrEndShuffle(length);

      runUnsortedTest(uTest, unsortedArray, sorter, numCompare);
    });
    unsortedTest.test("duplicates", async (dTest)=>{
      const unsortedArray = [];
      var counter = 4;
      const currentLength = Math.floor(length / 4);
      if(length % 2 > 0) unsortedArray.push(4);
      for(var i = 0; i < currentLength; i++){
        for(var c = 0; c < 4; c++){
          unsortedArray.push(counter);
        }
        if(counter === 1) counter = 4;
        else counter--;
      }
      runUnsortedTest(dTest, unsortedArray, sorter, numCompare);
    });
    unsortedTest.test("half unsorted", async (halfTest)=>{
      halfTest.test("unique", async (uTest)=>{
        var unsortedArray = [];
        for(var i = 0; i < length; i++){
          unsortedArray.push(i);
        }
        const index = Math.floor(length/2);
        unsortedArray = (
          (unsortedArray.slice(0, index))
          .concat(unsortedArray.slice(index).reverse())
        );
        runUnsortedTest(uTest, unsortedArray, sorter, numCompare);
      });
      halfTest.test("duplicates", async (dTest)=>{
        var unsortedArray = [];
        var counter = 4;
        const currentLength = length / 4;
        for(var i = 0; i < currentLength; i++){
          for(var c = 0; c < 4; c++){
            unsortedArray.push(counter);
          }
          if(counter === 1) counter = 4;
          else counter--;
        }
        const index = Math.floor(length/2);
        unsortedArray = (
          (unsortedArray.slice(0, index))
          .concat(unsortedArray.slice(index).reverse())
        );
        runUnsortedTest(dTest, unsortedArray, sorter, numCompare);
      });
    });
  });
  test.test("probably unique and unsorted", async (pUTest)=>{
    const probablyUnsortedArray = [];
    for(var i = 0; i < length; i++){
      probablyUnsortedArray.push(Math.random());
    }
    runProbablyTest(pUTest, probablyUnsortedArray, sorter, numCompare);
  });
  test.test("sorted", async (sortedTest)=>{
    sortedTest.test("unique", async (sTest)=>{
      const sortedArray = [];
      for(var i = 0; i < length; i++){
        sortedArray.push(i);
      }
      runSortedTest(sTest, sortedArray, sorter, numCompare);
    });
    sortedTest.test("duplicates", async (sTest)=>{
      const sortedArray = [];
      const currentLen = Math.floor(length / 4);
      if(length % 2 > 1) sortedArray.push(0);
      for(var i = 0; i < currentLen; i++){
        for(var c = 0; c < 4; c++){
          sortedArray.push(i);
        }
      }
      runSortedTest(sTest, sortedArray, sorter, numCompare);
    });
    sortedTest.test("all the same", async (sTest)=>{
      const sortedArray = [];
      for(var i = 0; i < length; i++){
        sortedArray.push(1);
      }
      runSortedTest(sTest, sortedArray, sorter, numCompare);
    });
  });
}

function runUnsortedTest(test, unsortedArray, sortFn, compare){
  const unsortedArrayCopy = [...unsortedArray];
  const sortedArray = sortFn(unsortedArray, compare);
  test.notOk(
    unsortedArrayCopy === unsortedArray,
    "The unsorted copy and original should not be the same object"
  );
  test.ok(
    sameItemsSameOrder(unsortedArray, unsortedArrayCopy, compare),
    "The sorter did not modify the original array"
  );
  test.notOk(
    isArraySorted(unsortedArray, compare),
    "The original array is not sorted"
  );
  test.notOk(
    unsortedArray === sortedArray,
    "The sorted array is not equal to the unsorted array"
  );
  test.ok(
    haveSameItems(sortedArray, unsortedArray, compare),
    "The sorted Array and unsorted array have the same items"
  );
  test.ok(
    isArraySorted(sortedArray, numCompare, compare),
    "The sorted array is sorted"
  );
  return {
    sortedArray: sortedArray,
    unsortedArray: unsortedArray,
  };
}

function runProbablyTest(test, probablyArray, sortFn, compare){
  const probablyArrayCopy = [...probablyArray];
  const sortedArray = sortFn(probablyArray, compare);
  test.notOk(
    probablyArrayCopy === probablyArray,
    "The unsorted copy and original should not be the same object"
  );
  test.ok(
    sameItemsSameOrder(probablyArray, probablyArrayCopy, compare),
    "The sorter did not modify the original array"
  );
  test.notOk(
    probablyArray === sortedArray,
    "The sorted array is not equal to the unsorted array"
  );
  test.ok(
    haveSameItems(sortedArray, probablyArray, compare),
    "The sorted Array and unsorted array have the same items"
  );
  test.ok(
    isArraySorted(sortedArray, numCompare, compare),
    "The sorted array is sorted"
  );
}

function runSortedTest(test, originalArray, sortFn, compare){
  const originalArrayCopy = [...originalArray];
  const sortedArray = sortFn(originalArray, compare);
  test.notOk(
    originalArrayCopy === originalArray,
    "The unsorted copy and original should not be the same object"
  );
  test.ok(
    sameItemsSameOrder(originalArray, originalArrayCopy, compare),
    "The sorter did not modify the original array"
  );
  test.ok(
    isArraySorted(originalArray, compare),
    "The original array is sorted"
  );
  test.notOk(
    originalArray === sortedArray,
    "The sorted array is not equal to the unsorted array"
  );
  test.ok(
    sameItemsSameOrder(sortedArray, originalArray, compare),
    "The sorted and original array should have the same items in the same order"
  );
  test.ok(
    isArraySorted(sortedArray, numCompare, compare),
    "The sorted array is sorted"
  );
}

tap.end();
