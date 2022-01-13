
import { findAny } from "../search/findAny";
import { findRange } from "../search/findRange";

import { insertAny, insertAllAny } from "./insert";

import { cannotUpdateNonExistingItem } from "../errors";

import { isFound } from "../utility";

function removeIndex(array, index){
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

function removeRange(array, range){
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

export function updateAny(array, item, compare, update){
  var index = findAny(array, item, compare);
  if(!isFound(index)) throw new Error(cannotUpdateNonExistingItem);
  array = removeIndex(array, index);
  return insertAny(
    array,
    update(array[index]),
    compare
  );
}

export function updateAll(array, item, compare, update){
  var indexes = findRange(array, item, compare);
  if(!isFound(indexes)) throw new Error(cannotUpdateNonExistingItem);
  if(!Array.isArray(indexes)){
    array = removeIndex(array, indexes);
    return insertAny(
      array,
      update(array[indexes]),
      compare
    );
  }
  const updatedItems = array.slice(indexes[0], indexes[1] + 1).map((item)=>{
    return update(item);
  });
  array = removeRange(array, indexes);
  return insertAllAny(
    array,
    updatedItems,
    compare
  );
}
