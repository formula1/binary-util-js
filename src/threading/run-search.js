
import { findAny } from "../search/findAny.js";

export function digestInitialArgs(args){
  const { compare } = args;
  return {
    compare: new Function("return " + compare)(),
  };
}

export function run(digestedArgs, args){
  const { compare } = digestedArgs;
  const { array, item } = args;
  return findAny(array, item, compare);
}

export function cleanup(digestedArgs){
  console.log(digestedArgs);
  return;
}
