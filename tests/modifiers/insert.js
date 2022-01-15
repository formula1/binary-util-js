
import { isArraySorted } from "../utility/utility.js";
import { insertItemUnique } from "../../src/modifiers/insert.js";

var sortedArray = "abcdefghijklmnopqrstuvwxyz".split("");

function runTest(name, fn){
  const start = Date.now();
  var fnResult = fn();
  console.log(name, "result:", fnResult, Date.now() - start);
}

function strCompare(a, b){
  return (a).localeCompare(b);
}

var counter = 0;
while(counter < sortedArray.length){
  runTest("findAny", ()=>{
    var arrayWithMissing = [...sortedArray];

    // const index = Math.floor(Math.random() * arrayWithMissing.length);
    var item = arrayWithMissing.splice(counter, 1)[0];
    var completeArray = insertItemUnique(arrayWithMissing, item, strCompare);
    return {
      index: counter,
      item: item,
      arrayWithMissing: arrayWithMissing.join(""),
      arrayWithItem: completeArray.join(""),
      isArraySorted: isArraySorted(completeArray, strCompare)
    };
  });
  counter++;
}
