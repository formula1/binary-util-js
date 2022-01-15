

export function pileShuffle(length){
  const initialArray = [];
  for(var i = 0; i < length; i++){
    initialArray.push(i);
  }
  const half = Math.floor(initialArray.length / 2);
  const a = initialArray.slice(0, half);
  const b = initialArray.slice(half);
  const unsortedArray = a.reduce((currentArray, aItem, index)=>{
    if(Math.floor(Math.random() * 2) === 1){
      return currentArray.concat([aItem, b[index]]);
    } else {
      return currentArray.concat([b[index], aItem]);
    }
  }, []);
  if(initialArray.length % 2 > 0) unsortedArray.push(b[b.length - 1]);
  return unsortedArray;
}

export function startOrEndShuffle(length){
  const array = [];
  for(var i = 0; i < length; i++){
    if(i % 2 === 0){
      array.push(i);
    } else {
      array.unshift(i);
    }
  }
  return array;
}
