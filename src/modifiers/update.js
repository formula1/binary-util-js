
import { findAny } from "../search/findAny";
import { findRange } from "../search/findRange";

import { insertAny, insertAllAny } from "./insert";

import { isFound } from "../utility";

import { removeIndex, removeRange } from "./remove";

export function updateAny(array, item, compare, update){
  var index = findAny(array, item, compare);
  if(!isFound(index)) return false;
  const newItem = update(array[index]);
  array = removeIndex(array, index);
  return insertAny(
    array,
    newItem,
    compare
  );
}

export function updateAll(array, item, compare, update){
  var indexes = findRange(array, item, compare);
  if(!isFound(indexes)) return false;
  if(!Array.isArray(indexes)){
    const newItem = update(array[indexes]);
    array = removeIndex(array, indexes);
    return insertAny(
      array,
      newItem,
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
