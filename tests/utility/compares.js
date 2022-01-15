
export const NAN_COMPARE_ERROR = "Can't compare a NaN";

export function numCompare(a, b){
  if(Number.isNaN(a)){
    throw new Error(NAN_COMPARE_ERROR);
  }
  if(Number.isNaN(b)){
    throw new Error(NAN_COMPARE_ERROR);
  }

  // Infinity - Infinity should result in 0
  if(a === b) return 0;
  return a - b;
}

export function strCompare(a, b){
  return a.localeCompare(b);
}
