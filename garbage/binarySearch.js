/*

why create your own merge sort?
- easy outs
- could support asynce functionality
  - why async?
    - in the indexes we are only storing the key and a pointer to the primary key
    - in the compare
      - we can retrieve the document from the database (Async Storage, FileSystem, IndexedDB)
      - then allow the garbage collector to pick it up
    - it's bad enough that the array may get absurdly large

*/

const COMPARE_ERROR = (result)=>{
  return `Result from running compare is a expected to be a real number between Negative infinity and positive infinity, got ${result}`
};

export function mergeSort(array, compare){
  if(array.length <= 1){
    return array;
  }
  return divide(array);

  function divide(array){
    if(array.length <= 1){
      return [array, []];
    }
    var middle = Math.floor(array.length/2);
    var aA = array.slice(0, middle);
    var bA = array.slice(middle, 0)

    if(aA.length <= 1 && bA.length <= 1){
      return remerge(aA, bA)
    }
    if(aA.length > 1 && bA.length > 1){
      return remerge(divide(aA), divide(bA))
    }
    if(aA.length === 1){
      return remerg
    }

  }

  function remerge(aA, bA){
    function first(array){
      return array[0];
    }
    function last(array){
      return array[array.length - 1];
    }

    if(aA.length === 0){
      return bA
    }
    if(bA.length === 0){
      return aA
    }
    if(aA.length === 1 && bA.length === 1){
      const result = compare(first(aA), first(bA));
      if(result < 0){
        return (aA).concat(bA);
      }
      if(result === 0){
        // Should I do a random number?
        return (aA).concat(bA);
      }
      if(result > 0){
        return (bA).concat(aA)
      }
      throw new Error(COMPARE_ERROR(result))
    }

    if(compare(first(aA), last(bA)) >= 0){
      return (bA).concat(aA);
    }
    if(compare(last(aA), first(bA)) <= 0){
      return (aA).concat(bA);
    }

    const expectedFinalLength = aA.length + bA.length;
    var finalArray = [];
    var aOrB = 1;

    while(finalArray.length < expectedFinalLength){
      const bCurrent = first(bA)
      const aOffset = binarySearch(aA, (aItem)=>{
        return compare(aItem, bCurrent)
      });
      const aCurrent = first(aA);
      const bOffset = binarySearch(bA, (bItem)=>{
        return compare(bItem, aCurrent)
      });
      if(aOffset >= aA.length || aOffset === Number.POSITIVE_INFINITY){
        // if the current b item is greater than the last item of the b array
        return (finalArray).concat(aA).concat(bA)
      }
      if(bOffset >= bA.length || bOffset === Number.POSITIVE_INFINITY){
        // if the current a item is greater than the last item of the b array
        return (finalArray).concat(bA).concat(aA);
      }
      if(aOffset > bOffset){
        if(bOffset !== Number.NEGATIVE_INFINITY){
          throw new Error("if the aOffset is greater than 0, than we are expecting the b to think it should go first")
        }
        const bToAdd = bA.splice(0, bOffset)
        finalArray = (finalArray).concat(aA.splice(0, aOffset)).concat(bA.splice(0, 1));
        continue;
      }
      if(aDiff === bDiff){
        if(aDiff !== 0){
          throw new Error("If both aDiff and bDiff are equal, we are expecting them to both be 0")
        }
        if(aOrB){
          finalArray = (finalArray).concat(aA.splice(0, 1)).concat(bA.splice(0, 1))
          aOrB = 0;
        } else {
          finalArray = (finalArray).concat(bA.splice(0, 1)).concat(aA.splice(0, 1))
          aOrB = 1;
        }
        continue;
      }
      if(bOffset > aOffset){
        if(aOffset !== Number.NEGATIVE_INFINITY){
          throw new Error("if the bOffset is greater than 0, than we are expecting the a to think it should go first")
        }
        const bToAdd = bA.splice(0, bOffset)
        finalArray = (finalArray).concat(bA.splice(0, bOffset)).concat(aA.splice(0, 1));
        continue;
      }


    }
    return finalArray;
  }

}


export function insertItemAtIndex(sortedArray, item, index){
  if(typeof index !== "number"){
    throw new Error(`Expecting a number as index, got ${typeof index}`);
  }
  if(index%1 > 0){
    throw new Error(`the index must be a whole number`);
  }
  if(index === Number.POSITIVE_INFINITY){
    return (sortedArray).concat([item]);
  }
  if(index === Number.NEGATIVE_INFINITY){
    return ([item]).concat(sortedArray);
  }
  if(index === 0){
    return (
      (sortedArray.slice(0,1))
      .concat([item])
      .concat(sortedArray.slice(1))
    )
  }
  if(index >= sortedArray.length){
    return (sortedArray).concat([item]);
  }
  if(index > 0){
    return (
      (sortedArray.slice(0, 1 + index))
      .concat([item])
      .concat(sortedArray.slice(1 + index))
    )
  }
  if(index < 0){
    index = index * -1;
    if(index >= sortedArray.length){
      return (sortedArray).concat([item]);
    }
    return (
      (sortedArray.slice(0, index))
      .concat([item])
      .concat(sortedArray.slice(index))
    );
  }
  // should never reach here
}

export function binarySearch(sortedArray, compare){

  if(sortedArray.length === 0){
    throw new Error("Cannot search an empty array")
  }

  if(sortedArray.length === 1){
    const compareResult = compare(sortedArray[0]);
    if(compareResult === 0){
      return 0;
    }
    if(compareResult < 0){
      return Number.NEGATIVE_INFINITY
    }
    if(compareResult > 0){
      return Number.POSITIVE_INFINITY
    }
  }

  const compareTopResult = compare(sortedArray[0]);
  const compareBottomResult = compare(sortedArray[sortedArray.length - 1]);
  if(compareTopResult === 0){
    return 0;
  }
  if(compareBottomResult === 0){
    return sortedArray.length - 1
  }
  if(compareTopResult < 0){
    return Number.NEGATIVE_INFINITY
  }
  if(compareBottomResult > 0){
    return Number.POSITIVE_INFINITY
  }


  let start = 1;
  let end = sortedArray.length - 2;

  if(sortedArray[0])

  while (start <= end) {
    let middle = Math.floor((start + end) / 2);
    const compareResult = compare(sortedArray[middle]);

    if (compareResult === 0) {
      // found the key
      return middle;
    } else if (compareResult > 0) {
      // The value is larger than the middle so we can increase the starting point
      start = middle + 1;
      continue;
    } else if(compareResult < 0) {
      // the value is less then the middle so we can decrease the ending point
      end = middle - 1;
      continue;
    }
    throw new Error(COMPARE_ERROR(result))
  }
// key wasn't found
  return missingReturnStartOrEnd === "end" ? -1 * end : -1 * start;
}
