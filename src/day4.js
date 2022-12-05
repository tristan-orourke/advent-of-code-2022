import { head, last, map, pipe, split, spread } from "lodash/fp";
import { countWhereTrue, parseNum } from "./util";
import input from "./input/day4";

const rangeAContainsRangeB = (a, b) => head(a) <= head(b) && last(a) >= last(b);

const rangesOverlapEntirely = (a, b) => rangeAContainsRangeB(a, b) || rangeAContainsRangeB(b, a);

const rangeContainsNum = (range, num) => head(range) <= num && last(range) >= num;

const rangesOverlapAtAll = (a, b) => rangeContainsNum(a, head(b)) || rangeContainsNum(a, last(b)) || rangesOverlapEntirely(a, b)

const parseAssignments = pipe(
  split("\n"),
  map(pipe(
    split(","),
    map(pipe(
      split("-"),
      map(parseNum)
    ))
  ))
);

// eslint-disable-next-line no-unused-vars
const testInput =
  `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

const countEntirelyOverlappingAssignments = pipe(
  parseAssignments,
  map(spread(rangesOverlapEntirely)),
  countWhereTrue
);
const countPartiallyOverlappingAssignments = pipe(
  parseAssignments,
  map(spread(rangesOverlapEntirely)),
  countWhereTrue
);

console.log(countEntirelyOverlappingAssignments(input));
console.log(countPartiallyOverlappingAssignments(input));