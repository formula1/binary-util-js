import * as tap from "tap";

import {
  isArraySorted, haveSameItems,
  sameItemsSameOrder,
} from "./utility/checkers.js";

import {
  strCompare, numCompare,
  NAN_COMPARE_ERROR
} from "./utility/compares.js";

tap.test("compares", async (compareTest)=>{
  compareTest.test("string", async (strTest)=>{
    strTest.ok(strCompare("a", "z") < 0, "lesser than");
    strTest.ok(strCompare("m", "m") === 0, "equal to");
    strTest.ok(strCompare("z", "a") > 0, "greater than");
  });
  compareTest.test("number", async (numTest)=>{
    numTest.ok(
      numCompare(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY) < 0,
      "lesser than, Inf"
    );
    numTest.ok(
      numCompare(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY) === 0,
      "Two positive Infinites are the same"
    );
    numTest.ok(numCompare(-1, 1) < 0, "lesser than");
    numTest.ok(numCompare(0, 0) === 0, "equal to");
    numTest.ok(numCompare(1, -1) > 0, "greater than");
    numTest.ok(
      numCompare(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY) > 0,
      "greater than, Inf"
    );
    numTest.ok(
      numCompare(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY) === 0,
      "Two negative Infinites are the same"
    );
    numTest.throws(
      ()=>(numCompare(Number.NaN, 0)),
      NAN_COMPARE_ERROR,
      "NaN in first argument throws"
    );
    numTest.throws(
      ()=>(numCompare(0, Number.NaN)),
      NAN_COMPARE_ERROR,
      "NaN in second argument throws"
    );
  });
});

tap.test("isArraySorted", async (iASTest)=>{
  iASTest.test("verify simple arrays", async (simpleTest)=>{
    simpleTest.ok(
      isArraySorted([], strCompare),
      "Empty arrays are to be considered sorted"
    );
    simpleTest.ok(
      isArraySorted(["a"], strCompare),
      "Arrays with single elements are to be considered sorted"
    );
  });
  iASTest.test("verify a sorted array", async (sortedTest)=>{
    sortedTest.test("string compare", async (strTest)=>{
      const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
      strTest.test("unique", async (uTest)=>{
        uTest.ok(isArraySorted(alphabet, strCompare), "verified sorted");
      });
      strTest.test("duplicate", async (dTest)=>{
        const alphaBetDup = alphabet.reduce((array, letter)=>{
          return (array).concat(letter.repeat(4).split(""));
        }, []);
        dTest.ok(alphaBetDup[0] === alphaBetDup[1], "at least two are duplicates");
        dTest.ok(isArraySorted(alphaBetDup, strCompare), "verified sorted");
      });
    });
    sortedTest.test("number compare", async (numTest)=>{
      const numUpto16 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      numTest.test("unique", async (uTest)=>{
        uTest.ok(isArraySorted(numUpto16, numCompare), "verified sorted");
      });
      numTest.test("duplicate", async (dTest)=>{
        const numUpto16Dup = numUpto16.reduce((array, number)=>{
          for(var i = 0; i < 4; i++){
            array.push(number);
          }
          return array;
        }, []);
        dTest.ok(numUpto16Dup[0] === numUpto16Dup[1], "at least two are duplicates");
        dTest.ok(isArraySorted(numUpto16Dup, numCompare), "verified sorted");
        dTest.end();
      });
    });
    sortedTest.end();
  });

  iASTest.test("fail an unsorted array", async (unsortedTest)=>{
    unsortedTest.test("string compare", async (strTest)=>{
      const unsortedStr = "zyab".split("");
      strTest.test("unique", async (uTest)=>{
        uTest.notOk(isArraySorted(unsortedStr, strCompare), "verified unsorted");
      });
      strTest.test("duplicates", async (dTest)=>{
        const unsortedStrDup = unsortedStr.reduce((array, letter)=>{
          return (array).concat(letter.repeat(4).split(""));
        }, []);
        dTest.ok(unsortedStrDup[0] === unsortedStrDup[1], "at least two letters are duplicates");
        dTest.notOk(isArraySorted(unsortedStrDup, strCompare), "verified unsorted");
      });
    });
    unsortedTest.test("number compare", async (numTest)=>{
      const unsortedNum = [16, 11, 12, 8, 9, 0, 1];
      numTest.test("unique", async (uTest)=>{
        uTest.notOk(isArraySorted(unsortedNum, numCompare), "verified unsorted");
      });
      numTest.test("duplicates", async (dTest)=>{
        const unsortedNumDup = unsortedNum.reduce((array, number)=>{
          for(var i = 0; i < 4; i++){
            array.push(number);
          }
          return array;
        }, []);
        dTest.ok(unsortedNumDup[0] === unsortedNumDup[1], "at least two numbers are duplicates");
        dTest.notOk(isArraySorted(unsortedNumDup, numCompare), "verified unsorted");
      });
    });
  });
});

tap.test("haveSameItems", async (hSITest)=>{
  hSITest.test("empty arrays are the same", async (emptyTest)=>{
    const a = [];
    const b = [];
    emptyTest.notOk(a === b, "The two areays are different objects");
    emptyTest.ok(haveSameItems(a, b, strCompare), "The two arrays are considered the same");
  });

  hSITest.test("verify two equivelent arrays have the same items", async (sameTest)=>{
    sameTest.test("string compare", async (strTest)=>{
      const a = "abcdefghijklmnopqrstuvwxyz".split("");
      const b = "abcdefghijklmnopqrstuvwxyz".split("");
      strTest.notOk(a === b, "The two arrays are different objects");
      strTest.ok(haveSameItems(a, b, strCompare), "The two arrays have the same values");
    });
    sameTest.test("number compare", async (strTest)=>{
      const a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15];
      const b = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15];
      strTest.notOk(a === b, "The two arrays are different objects");
      strTest.ok(haveSameItems(a, b, numCompare), "The two arrays have the same values");
    });
  });
  hSITest.test("verify two arrays in different orders have the same items", async (sameTest)=>{
    sameTest.test("string compare", async (strTest)=>{
      const a = "abcdefghijklmnopqrstuvwxyz".split("");
      const b = "abcdefghijklmnopqrstuvwxyz".split("").reverse();
      strTest.notOk(a === b, "The two arrays are different objects");
      console.log("top items:", a[0], b[0], strCompare(a[0], b[0]));
      strTest.notOk(strCompare(a[0], b[0]) === 0, "At least one of each aren't the same");
      strTest.ok(haveSameItems(a, b, strCompare), "The two arrays have the same values");
    });
    sameTest.test("number compare", async (strTest)=>{
      const a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15];
      const b = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15].reverse();
      strTest.notOk(a === b, "The two arrays are different objects");
      strTest.notOk(numCompare(a[0], b[0]) === 0, "At least one of each aren't the same");
      strTest.ok(haveSameItems(a, b, numCompare), "The two arrays have the same values");
    });
  });
  hSITest.test("two arrays of different lengths are considered different", async (sameTest)=>{
    sameTest.test("string compare", async (strTest)=>{
      const a = "aaaaa".split("");
      const b = "aaaaaaaaaaaaa".split("");
      strTest.notOk(a === b, "The two arrays are different objects");
      strTest.notOk(haveSameItems(a, b, strCompare), "The two arrays are considered different");
    });
    sameTest.test("number compare", async (strTest)=>{
      const a = [1, 1, 1, 1];
      const b = [1, 1, 1, 1, 1, 1, 1, 1];
      strTest.notOk(a === b, "The two arrays are different objects");
      strTest.notOk(haveSameItems(a, b, numCompare), "The two arrays are considered different");
    });
  });
  hSITest.test("verify two arrays of the same length have different items", async (sameTest)=>{
    sameTest.test("string compare", async (strTest)=>{
      const a = "abc".split("");
      const b = "xyz".split("");
      strTest.notOk(a === b, "The two arrays are different objects");
      strTest.notOk(haveSameItems(a, b, strCompare), "The two arrays are considered different");
    });
    sameTest.test("number compare", async (strTest)=>{
      const a = [0, 1, 2];
      const b = [13, 14, 15];
      strTest.notOk(a === b, "The two arrays are different objects");
      strTest.notOk(haveSameItems(a, b, numCompare), "The two arrays are considered different");
    });
  });
});

tap.test("sameItemsSameOrder", async (sISOTest)=>{
  sISOTest.test("verify two equivelent arrays have the same items", async (sameTest)=>{
    sameTest.test("string compare", async (strTest)=>{
      const a = "abcdefghijklmnopqrstuvwxyz".split("");
      const b = "abcdefghijklmnopqrstuvwxyz".split("");
      strTest.notOk(a === b, "The two arrays are different objects");
      strTest.ok(
        haveSameItems(a, b, strCompare),
        "The two arrays have the same values and are in the same order"
      );
    });
    sameTest.test("number compare", async (strTest)=>{
      const a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15];
      const b = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15];
      strTest.notOk(a === b, "The two arrays are different objects");
      strTest.ok(
        sameItemsSameOrder(a, b, numCompare),
        "The two arrays have the same values and are in the same order"
      );
    });
  });
  sISOTest.test("fail two arrays with same items in different orders", async (diffOrderTest)=>{
    diffOrderTest.test("reverse", async (revTest)=>{
      revTest.test("string compare", async (strTest)=>{
        const a = "abcdefghijklmnopqrstuvwxyz".split("");
        const b = [...a].reverse();
        strTest.notOk(a === b, "The two arrays are different objects");
        strTest.notOk(strCompare(a[0], b[0]) === 0, "At least one of each aren't the same");
        strTest.notOk(
          sameItemsSameOrder(a, b, strCompare),
          "The two arrays are in different orders"
        );
      });
      revTest.test("number compare", async (strTest)=>{
        const a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15];
        const b = [...a].reverse();
        strTest.notOk(a === b, "The two arrays are different objects");
        strTest.notOk(numCompare(a[0], b[0]) === 0, "At least one of each aren't the same");
        strTest.notOk(
          sameItemsSameOrder(a, b, numCompare),
          "The two arrays are in different orders"
        );
      });
    });
    diffOrderTest.test("last two items different", async (revTest)=>{
      function switchLastTwo(array){
        const lastTwo = array.splice(-2, 2);
        lastTwo.reverse();
        return array.concat(lastTwo);
      }
      revTest.test("string compare", async (strTest)=>{
        const a = "abcdefghijklmnopqrstuvwxyz".split("");
        const b = switchLastTwo([...a]);
        strTest.notOk(a === b, "The two arrays are different objects");
        strTest.ok(strCompare(a[0], b[0]) === 0, "At least one of each are the same");
        strTest.notOk(
          sameItemsSameOrder(a, b, strCompare),
          "The two arrays are in different orders"
        );
      });
      revTest.test("number compare", async (strTest)=>{
        const a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15];
        const b = switchLastTwo([...a]);
        strTest.notOk(a === b, "The two arrays are different objects");
        console.log("first two", a[0], b[0]);
        strTest.ok(numCompare(a[0], b[0]) === 0, "At least one of each are the same");
        strTest.notOk(
          sameItemsSameOrder(a, b, numCompare),
          "The two arrays are in different orders"
        );
      });
    });
  });
});

tap.end();
