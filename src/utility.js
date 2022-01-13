
var counter = 0;
export function uniqueId(base){
  return [
    (base || ""),
    (counter++).toString(32),
    Date.now().toString(32),
    Math.random().toString(32).substring(2),
  ].join("_");
}

export function easyMin(array, item, compare){
  const c = compare(item, getFirst(array));
  if(c < 0) return Number.NEGATIVE_INFINITY;
  if(c === 0) return 0;
  return false;
}

export function easyMax(array, item, compare){
  const c = compare(item, getLast(array));
  if(c > 0) return Number.POSITIVE_INFINITY;
  if(c === 0) return array.length - 1;
  return false;
}

export function easySingle(array, item, compare){
  const c = compare(item, getFirst(array));
  if(c > 0) return Number.POSITIVE_INFINITY;
  if(c < 0) return Number.NEGATIVE_INFINITY;
  return 0;
}

export function getFirst(array){
  return array[0];
}

export function getLast(array){
  return array[array.length];
}

export function minIndexOrDefault(minIndex, testedNext){
  if(typeof minIndex === "undefined"){
    return 1 + (testedNext ? 1 : 0);
  }
  if(minIndex === 0){
    return 1 + (testedNext ? 1 : 0);
  }
  return minIndex;
}

export function maxIndexOrDefault(maxIndex, array, testedPrev){
  if(typeof maxIndex === "undefined"){
    return array.length - 2 + (testedPrev ? -1 : 0);
  }
  if(maxIndex === array.length - 1){
    return array.length - 2  + (testedPrev ? -1 : 0);
  }
  return maxIndex;
}

export function isFound(index){
  if(Array.isArray(index)) return true;
  if(index < 0) return false;
  if(index === Number.POSITIVE_INFINITY) return false;
  return true;
}

export function prepareIndexForUse(index){
  if(index === Number.POSITIVE_INFINITY) return index;
  if(index === Number.NEGATIVE_INFINITY) return index;
  if(index < 0) return -1 * index;
  return 1 + index;
}
