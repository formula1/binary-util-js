
export const COMPARE_ERROR = (result)=>{
  return `Result from running compare is a expected to be a real number between Negative infinity and positive infinity, got ${result}`
};


var counter = 0;
export uniqueId(base){
  return [
    (base || ""),
    (counter++).toString(32),
    Date.now().toString(32),
    Math.random().toString(32).substring(2),
  ].join("-");
}
