
import { findAny } from "../../src/search/findAny.js";

const sortedArray = "011122223333444455556666777788889999".split("");

function runTest(name, fn){
  const start = Date.now();
  var fnResult = fn();
  console.log(name, "result:", fnResult, Date.now() - start);
}

runTest("findAny", ()=>{
  return findAny(sortedArray, "3", (a, b)=>((a).localeCompare(b)));
});
runTest("findAny", ()=>{
  return findAny(sortedArray, "3", (a, b)=>((a).localeCompare(b)));
});

runTest("findAny", ()=>{
  return findAny(sortedArray, "7", (a, b)=>((a).localeCompare(b)));
});
runTest("findAny", ()=>{
  return findAny(sortedArray, "7", (a, b)=>((a).localeCompare(b)));
});

runTest("findAny", ()=>{
  return findAny(sortedArray, "0", (a, b)=>((a).localeCompare(b)));
});
runTest("findAny", ()=>{
  return findAny(sortedArray, "0", (a, b)=>((a).localeCompare(b)));
});
