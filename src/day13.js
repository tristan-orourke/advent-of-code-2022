import { spread } from "lodash";
import { all, cond, constant, eq, every, head, identity, isArray, isInteger, map, overArgs, overEvery, pipe, size, split, subtract, tail } from "lodash/fp"
import { log, logFunctionExecution, unspread, wrapWithLogger } from "./util";

// compare functions: if left is less than right, return -1
// compare functions: if left is greater than right, return +1

const compareIntegers = subtract;
const isEmptyOrUndefined = x => eq(undefined, x) || size(x) === 0;
const listWrap = x => [x];

const allTrue = unspread(all(identity));

function compareItems(left, right) {
  console.log("compare inputs", left, right);
  if (isEmptyOrUndefined(left) && isEmptyOrUndefined(right)) {
    console.log("compare lists empty, output 0")
    return 0;
  }
  const compareValue = cond([
    [overArgs(allTrue, [isInteger, isInteger]), logFunctionExecution("branch 1")(compareIntegers)],
    [overArgs(allTrue, [isInteger, isArray]), logFunctionExecution("branch 2")(overArgs(compareItems, [listWrap, identity]))],
    [overArgs(allTrue, [isArray, isInteger]), logFunctionExecution("branch 3")(overArgs(compareItems, [identity, listWrap]))],
    [overArgs(allTrue, [isEmptyOrUndefined, isEmptyOrUndefined]), logFunctionExecution("branch 4")(constant(0))],
    [overArgs(allTrue, [isEmptyOrUndefined, isArray]), logFunctionExecution("branch 5")(constant(-1))],
    [overArgs(allTrue, [isArray, isEmptyOrUndefined]), logFunctionExecution("branch 6")(constant(1))],
    [overArgs(allTrue, [isArray, isArray]), logFunctionExecution("branch 7")(compareItems)],
  ])(head(left), head(right));

  return compareValue !== 0 ? log("compare output")(compareValue) : compareItems(tail(left), tail(right));
}

// overArgs(console.log, [isInteger, isInteger])(3, [])
// overArgs(wrapWithLogger(unspread(all)), [isInteger, isInteger])(3, [])
const c = (compareItems);
// c([1], [1]);

const testInput = 
`[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

console.log(pipe(
  split("\n\n"),
  map(pipe(
    split("\n"),
    map(eval),
    spread(compareItems)
  )),
)(testInput))