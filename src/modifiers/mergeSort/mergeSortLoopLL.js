import { compareError } from "../../errors.js";

import {
  getFirst,
  LinkedList,
} from "../../utility.js";

import {
  mergeSinglesArray,
  mergeSinglesLL,
  mergeSortedArraysNoSearch
} from "./reused.js";

const NUM_TYPE = "number";

export function mergeSortLoopLL(unsortedArray, compare){
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
    return mergeSinglesArray(
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
      compareDoubleLL(
        mergeSinglesLL(
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
    const sLL = mergeSinglesLL(
      unsortedArray[counter],
      unsortedArray[counter + 1],
      compare
    );
    list.push(sLL);
    counter = counter + 2;
  }

  var i = 0;
  while(list.length > 1){
    sumLengths(list, length, i);
    const aLL = list.pop();
    const bLL = list.pop();
    const aL = aLL.length;
    const bL = bLL.length;
    const merged = mergeSortedArraysNoSearch(
      aLL, bLL,
      compare,
      (ll)=>(ll.first), (ll)=>(ll.last),
      ()=>(new LinkedList()), mergeSinglesLL, insertItemIntoLL
    );
    if(aL + bL !== merged.length){
      console.log("lengths:", aL, bL, merged.length);
      throw new Error("The sum of the two linked lists is not equal to the final");
    }
    if(typeof merged === "undefined"){
      throw new Error("undefined merge");
    }
    list.unshift(merged);
    i++;
  }

  return Array.from(list.pop());
}

function compareDoubleLL(ll, item, compare){
  var c = compare(item, ll.first);
  if(c <= 0) return ll.unshift(item);
  if(typeof c !== NUM_TYPE || Number.isNaN(c)){
    console.error("badResult:", c);
    throw new Error(compareError);
  }
  c = compare(item, ll.last);
  if(c >= 0) return ll.push(item);
  if(typeof c !== NUM_TYPE || Number.isNaN(c)){
    console.error("badResult:", c);
    throw new Error(compareError);
  }
  return ll.insertAtIndex(item, 1);
}

function insertItemIntoLL(aLL, bItem, compare){
  const retArray = new LinkedList();
  var found = false;
  var aItem;
  var c;
  do{
    aItem = aLL.shift();
    c = compare(aItem, bItem, compare);
    if(c >= 0){
      retArray.push(bItem);
      retArray.push(aItem);
      found = true;
      break;
    }
    if(c < 0){
      retArray.push(aItem);
      continue;
    }
    console.error("badResult:", c, aItem, bItem, aLL);
    throw new Error(compareError);
  }while(aLL.length);
  if(found){
    return retArray.concat(aLL);
  } else {
    return retArray.concat([bItem]);
  }
}

function sumLengths(bigLL, expectedLength, i){
  const calculatedLength = Array.from(bigLL).reduce((total, littleLL)=>{
    if(typeof littleLL.length !== "number"){
      console.error("bad length:", littleLL.length);
      throw new Error("a linked list has a bad length");
    }
    return total + littleLL.length;
  }, 0);
  if(calculatedLength !== expectedLength){
    console.error("mismatch lengths at iteration:", i, expectedLength, calculatedLength);
    throw new Error("mismatched lengths");
  }
}

function ensureNumbers(aLL, bLL){
  const aA = Array.from(aLL);
  aA.forEach((item, i)=>{
    if(typeof item !== "number"){
      console.error("Found a bad item in aA:", item, i);
      throw new Error("bad item found");
    }
  });
  const bA = Array.from(bLL);
  bA.forEach((item, i)=>{
    if(typeof item !== "number"){
      console.error("Found a bad item in bA:", item, i);
      throw new Error("bad item found");
    }
  });
}

function ensureLinkedLists(aLL, bLL, list){
  if(!(bLL instanceof LinkedList) && !(aLL instanceof LinkedList)){
    console.log("aLL and bLL are not a linked lists:", aLL, bLL, list.length);
    throw new Error("aLL and bLL are not a linked lists");
  }
  if(!(aLL instanceof LinkedList)){
    console.log("aLL is not a linked list:", aLL, list.length);
    throw new Error("aLL is not a linked list");
  }
  if(!(bLL instanceof LinkedList)){
    console.log("bLL is not a linked list:", bLL, list.length);
    throw new Error("bLL is not a linked list");
  }
}
