

export function isArraySorted(array, compare){
  var counter = array.length;
  while(counter--){
    if(counter === 0) return true;
    if(compare(array[counter - 1], array[counter]) > 0){
      return false;
    }
  }
}

function numCompare(a, b){
  return a - b;
}

function strCompare(a, b){
  return a.localeCompare(b);
}

var probablyUnsorted = [];
for(var i = 0; i < 10; i++){
  probablyUnsorted.push(Math.random());
}
console.log("is sorted?", probablyUnsorted, isArraySorted(probablyUnsorted, numCompare));

var unsorted = "2315716789".split("");
console.log("is sorted?", unsorted, isArraySorted(unsorted, strCompare));
var sorted = "abcdefghijklmnopqrstuvwxyz".split("");
console.log("is sorted?", sorted, isArraySorted(sorted, strCompare));
