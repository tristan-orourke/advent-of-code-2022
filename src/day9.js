import { slice } from "lodash";
import { constant, flatMap, get, head, identity, join, last, map, nth, pipe, reduce, size, split, tail, uniq, wrap } from "lodash/fp";
import rawInput, { input } from "./input/day9";
import { makeArray, parseNum, wrapWithLogger } from "./util";

const shift = direction => position => {
  const newPosition = [...position];
  switch (direction) {
    case "R":
      newPosition[0] += 1;
      break;
    case "L":
      newPosition[0] -= 1;
      break;
    case "U":
      newPosition[1] += 1;
      break;
    case "D":
      newPosition[1] -= 1;
      break;
  }
  return newPosition;
}

const shiftHead = direction => rope => [shift(direction)(head(rope)), ...tail(rope)];

const positionsAreTouching = (a, b) => Math.abs(a[0] - b[0]) <= 1 && Math.abs(a[1] - b[1]) <= 1;
const positionsAreEqual = (a, b) => a[0] === b[0] && a[1] === b[1];

function adjustRope(rope) {
  if (size(rope) <= 1) {
    return rope;
  }
  const first = head(rope);
  const next = nth(1, rope);
  // if first and next are touching, nothing needs to change
  if (positionsAreTouching(first, next)) {
    return rope;
  } else {
    const newNext = [...next];
    if (first[0] === next[0]) {
      // first and next are in the same column, so move the next up or down
      newNext[1] += first[1] > next[1] ? 1 : -1;
    } else if (first[1] === next[1]) {
      // first and next are in the same row, so move the next left or right
      newNext[0] += first[0] > next[0] ? 1 : -1;
    } else {
      // first and next are not in the same row or column, so move the next diagonally
      newNext[0] += first[0] > next[0] ? 1 : -1;
      newNext[1] += first[1] > next[1] ? 1 : -1;
    }
    return [first, ...adjustRope([newNext, ...tail(tail(rope))])];
  }
}


const countPositions = pipe(
  map(join(",")),
  uniq,
  size
  )

  const accumulateToInput = fn => input => [fn(head(input)), ...input]
  
  const pipeWithHistory = (...fns) => input => pipe(...map(accumulateToInput, fns))([input]);

  const reduceWithHistory = (fn, initialAccumulator) => {
    const reducer = (history, value) => {
      const acc = head(history);
      const newAcc = fn(acc, value);
      return [newAcc, ...history];
    }
    return reduce(reducer, [initialAccumulator]);
  }
  
const shiftAndAdjustRope = (rope, direction) => pipe(shiftHead(direction), adjustRope)(rope);

const countUniqueTailPositions = initialRope => pipe(
  split("\n"),
  flatMap(pipe(
    split(" "),
    ([dir, count]) => makeArray(parseNum(count), constant(dir))
  )),
  reduceWithHistory(shiftAndAdjustRope, initialRope),
  // (directions) => pipeWithHistory(...)(initialRope),
  map(last),
  countPositions
)

const testInput = 
`R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

console.log(countUniqueTailPositions(makeArray(2, constant([0,0])))(input))
console.log(countUniqueTailPositions(makeArray(10, constant([0,0])))(input))