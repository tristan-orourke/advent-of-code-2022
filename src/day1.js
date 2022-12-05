import { pipe, identity, map, max, orderBy, split, sum, take } from "lodash/fp";
import input from "./input/day1";
import { parseNum } from "./util"

/**
 * 
 * @param string input 
 * @returns number
 */
const sumRowsOfNumbers = pipe(
  split("\n"),
  map(parseNum),
  sum
);

const sumSectionsOfRows = pipe(
  split("\n\n"),
  map(sumRowsOfNumbers)
);

const takeHighest = (n) => pipe(orderBy(identity, "desc"), take(n))

const testInput =
  `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

// Q1
const maxTotalCalories = pipe(sumSectionsOfRows, max);
// Q2
const sum3HighestCalories = pipe(sumSectionsOfRows, takeHighest(3), sum)

console.log(maxTotalCalories(input));
console.log(sum3HighestCalories(input));