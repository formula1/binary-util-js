export function isArraySorted(array, compare){
  var counter = array.length;
  while(counter--){
    if(counter <= 0) return true;
    var compareResult = compare(array[counter - 1], array[counter]);
    if(compareResult > 0){
      return false;
    }
  }
  return true;
}

export function haveSameItems(aA, bA, compare){
  if(aA.length !== bA.length) return false;

  // if we didn't find an item, the some function returns true
  // - in that case we want the opposite
  // the some function returns false if all items were found
  // - in that case we want to return true
  return !aA.some((aItem)=>{
    // if we didn't find an item we want to exit early
    // if we did we go to the next item
    return !bA.some((bItem)=>{
      // if we find equivilence we want to exit early
      return compare(bItem, (aItem)) === 0;
    });
  });
}

export function sameItemsSameOrder(aA, bA, compare){
  if(aA.length !== bA.length) return false;
  return !aA.some((aItem, index)=>{
    return compare(bA[index], (aItem)) !== 0;
  });
}
