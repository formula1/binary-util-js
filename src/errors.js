
export const cannotInsertAtExistingItem = "Cannot insert at an index that already exists";

export const emptyArray = "The array that was passed is empty";

export const negAndNot = `one value was found to be missing, but the other was found`;

export function negativeAndNot(neg, notNeg){
  return `${neg} was found to be missing, but ${notNeg} was found`;
}

export const negShouldBeEqual = "start and end are missing, they should be equal";

export function testMinAndMax(array, min, max){
  const typeMin = typeof min;
  const typeMax = typeof max;
  if(typeMin === "number"){
    if(min < 0){
      throw new Error("the minimum index must not be less than 0");
    }
    if(min >= array.length){
      throw new Error("the minimum index must not be greater than the array length");
    }
  }
  if(typeMax === "number"){
    if(max < 0){
      throw new Error("the maximum index must not be less than 0");
    }
    if(max >= array.length){
      throw new Error("the maximum index must not be greater than the array length");
    }
  }
  if(typeMin === "number" && typeMax === "number"){
    if(min > max){
      throw new Error("the minimum index must not be greater than the maximum index");
    }
  }
}

export const compareError = `Compare result is expected to be a real number`;

// For Thread Worker
export const onlyStringKeys = "Only string keys are allowed to be usesd";
export const providedFnIsNotAFn = "Provided function is not a function";
export const baseFnTypeMissing = "Base Function Type does not exist in this worker";
export const availFnNeedsDigest = "Each function to add needs to have a digest function";
export const availFnNeedsRun = "Each function to add needs to have a run function";
export const availFnNeedsCleanup = "Each function to add needs to have a cleanup function";
export const alreadyHaveBaseFn = "Already have a base function";

export const fnNeedsToBeImplemented = "function needs to be implemented";
