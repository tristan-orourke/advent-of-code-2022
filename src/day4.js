import { head, last, map, pipe, split } from "lodash/fp";
import { countWhereTrue, parseNum } from "./util";
import input from "./input_4";

const rangeAContainsRangeB = (a, b) => head(a) <= head(b) && last(a) >= last(b);

const rangesOverlapEntirely = (a, b) => rangeAContainsRangeB(a, b) || rangeAContainsRangeB(b, a);

const rangeContainsNum = (range, num) => head(range) <= num && last(range) >= num;

const rangesOverlapAtAll = (a, b) => rangeContainsNum(a, head(b)) || rangeContainsNum(a, last(b)) || rangesOverlapEntirely(a, b)

const parseAssignments = pipe(
  split("\n"),
  map(split(",")),
  map(map(split("-"))),
  map(map(map(parseNum)))
)

const testInput =
`2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

const countEntirelyOverlappingAssignments = pipe(
  parseAssignments,
  map(ranges => rangesOverlapEntirely(...ranges)),
  countWhereTrue
);
const countPartiallyOverlappingAssignments = pipe(
  parseAssignments,
  map(ranges => rangesOverlapAtAll(...ranges)),
  countWhereTrue
);

console.log(countEntirelyOverlappingAssignments(input));
console.log(countPartiallyOverlappingAssignments(input));