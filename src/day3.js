import { head, identity, intersection, map, pipe, reduce, size, slice, split, sum, tail } from "lodash/fp";
import input from "./input_3";

const splitInHalves = input => {
  const n = size(input);
  return [slice(0, n / 2, input), slice(n / 2, n, input)];
};

const findDuplicateItem = pipe(
  splitInHalves,
  (input) => intersection(...input),
  head
);

const charPriority = c => {
  const n = c.charCodeAt();
  return n <= 90
    ? n - 38 // Capital letters (65-90 converts to 27-52)
    : n - 96 // lowercase (97-122 converts to 1-26)
};

const splitInChunks = chunkSize => array => {
  let chunks = []
  for (let i = 0; i < size(array); i += chunkSize) {
    const chunk = slice(i, i + chunkSize, array);
    chunks.push(chunk);
  }
  return chunks;
}

const massIntersection = arrays => reduce(intersection, head(arrays), tail(arrays));

const testInput =
  `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

// Q1
const sumPrioritiesOfDuplicateItems = pipe(
  split("\n"),
  map(pipe(
    findDuplicateItem,
    charPriority
  )),
  sum
);
console.log(sumPrioritiesOfDuplicateItems(input));

const sumPrioritiesOfChunkIntersections = pipe(
  split("\n"),
  splitInChunks(3),
  map(pipe(
    map(split("")), // split strings into arrays, for intersection
    massIntersection,
    head,
    charPriority
  )),
  sum
);
console.log(sumPrioritiesOfChunkIntersections(input));