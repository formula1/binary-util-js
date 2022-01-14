
import { findAny } from "../search/findAny";
import { findRange } from "../search/findRange";

import { isFound } from "../utility";

export function removeAny(array, item, compare){
  var index = findAny(array, item, compare);
  if(!isFound(index)) return false;
  return removeIndex(array, index);
}

export function removeAll(array, item, compare){
  var indexes = findRange(array, item, compare);
  if(!isFound(indexes)) return false;
  if(!Array.isArray(indexes)){
    return removeIndex(array, indexes);
  }
  return removeRange(array, indexes);
}

export function removeIndex(array, index){
  if(index === 0){
    return (array.slice(1));
  }
  if(index === array.length - 1){
    return array.slice(0, array.length - 1);
  }
  return (
    (array.slice(0, index))
    .concat(array.slice(index + 1))
  );
}

export function removeRange(array, range){
  if(range[0] === 0){
    return array.slice(range[1] + 1);
  }
  if(range[1] === array.length - 1){
    return array.slice(0, range[0]);
  }
  return (
    (array.slice(0, range[0]))
    .concat(array.slice(range[1] + 1))
  );
}
