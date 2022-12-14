import { add, all, any, anyPass, apply, concat, cond, constant, eq, every, flatMap, gt, head, identity, invokeArgs, isArray, isEqual, isInteger, lte, map, multiply, overArgs, overEvery, overSome, pipe, size, split, spread, stubTrue, subtract, sum, tail } from "lodash/fp"
import { log, logFunctionExecution, unspread, wrapWithLogger } from "./util";
import input from "./input/day13";

// compare functions: if left is less than right, return -1
// compare functions: if left is greater than right, return +1

const compareIntegers = subtract;
const isUndefined = eq(undefined)
const isEmptyArray = x => isArray(x) && size(x) === 0;
const listWrap = x => [x];

const allTrue = unspread(all(identity));

function compareItems(left, right) {
  if (isEmptyArray(left) && isEmptyArray(right)) {
    return 0;
  }
  const compareValue = cond([
    [overArgs(allTrue, [isInteger, isInteger]), compareIntegers],
    [overArgs(allTrue, [isInteger, isArray]), overArgs(compareItems, [listWrap, identity])],
    [overArgs(allTrue, [isArray, isInteger]), overArgs(compareItems, [identity, listWrap])],
    [overArgs(allTrue, [isUndefined, isUndefined]), constant(0)],
    [overArgs(allTrue, [isUndefined, stubTrue]), constant(-1)],
    [overArgs(allTrue, [stubTrue, isUndefined]), constant(1)],
    [overArgs(allTrue, [isArray, isArray]), compareItems],
  ])(head(left), head(right));

  return compareValue !== 0 ? compareValue : compareItems(tail(left), tail(right));
}

const findIndexesWhere = predicateFn => array => {
  let indexes = [];
  for (let index = 0; index < array.length; index++) {
    if (predicateFn(array[index])) indexes.push(index);
  }
  return indexes;
}

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
  findIndexesWhere(gt(0)),
  map(add(1)), // because problem isn't zero-indexed
  sum
)(input))




// Q2
const dividerPackets = [
  [[2]],
  [[6]]
];
const isDividerPacket = anyPass(map(isEqual, dividerPackets));
console.log(pipe(
  split("\n\n"),
  flatMap(split("\n")),
  map(eval),
  concat(dividerPackets),
  (array => array.sort(compareItems)),
  findIndexesWhere(isDividerPacket),
  map(add(1)), // because problem isn't zero-indexed
  apply(multiply)
)(input));
