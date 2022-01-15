export function fnTimer(title, fn){
  const start = Date.now();
  const result = fn();
  console.log(title, Date.now() - start);
  return result;
}

export function addUpFnTimer(message){
  var total = 0;
  return {
    add(fn){
      const start = Date.now();
      const result = fn();
      total += Date.now() - start;
      return result;
    },
    log(){
      console.log(message, total);
    }
  };
}

export function delayedTimer(message){
  const start = Date.now();
  return ()=>{
    console.log(message, Date.now() - start);
  };
}
