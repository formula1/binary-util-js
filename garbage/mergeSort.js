
import { COMPARE_ERROR } from "./constants";

export function mergeSort(array, compare){
  return divide(array);

  function divide(array){
    if(array.length <= 1){
      return array;
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
      return remerge(aA, divide(bA))
    }
    if(bA.length === 1){
      return remerge(divide(aA), bA);
    }

  }

  function remerge(aA, bA){

    if(aA.length === 0){
      return bA
    }
    if(bA.length === 0){
      return aA
    }

    function first(array){
      return array[0];
    }
    function last(array){
      return array[array.length - 1];
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
      if(aOffset === Number.NEGATIVE_INFINITY){
        if(bOffset === aOffset){
          throw new Error("if a wants to go first, the b should know it goes after it")
        }
        if(aOffset < 0){
          aOffset = -1 * aOffset;
        } else {
          aOffset = 1 + aOffset;
        }
        const bToAdd = bA.splice(0, bOffset)
        finalArray = (finalArray).concat(aA.splice(0, aOffset)).concat(bA.splice(0, 1));
        continue;
      }
      if(aOffset === bOffset){
        if(aOffset !== 0){
          throw new Error("If both aDiff and bDiff are equal, we are expecting them to both be 0")
        }
        finalArray = (finalArray).concat(aA.splice(0, 1)).concat(bA.splice(0, 1))
        continue;
      }
      if(bOffset > aOffset){
        if(aOffset !== Number.NEGATIVE_INFINITY){
          throw new Error("if the bOffset is greater than 0, than we are expecting the a to think it should go first")
          throw new Error("if b wants to go first, the a should know it goes after it")
        }
        const bToAdd = bA.splice(0, bOffset)
        finalArray = (finalArray).concat(bA.splice(0, bOffset)).concat(aA.splice(0, 1));
        continue;
      }
    }
    return finalArray;
  }

}
