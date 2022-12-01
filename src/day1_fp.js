import { flow, identity, map, max, orderBy, parseInt, split, sum, take } from "lodash/fp";

/**
 * 
 * @param string input 
 * @returns number
 */
const sumRowsOfNumbers = flow(
  split("\n"),
  map(parseInt),
  sum
);

const sumSectionsOfRows = flow(
  split("\n\n"),
  map(sumRowsOfNumbers)
);

const takeHighest = (n) => (array) => flow(orderBy(array, "desc"), take(n))

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
const maxTotalCalories = flow(sumSectionsOfRows, max);
// Q2
const sum3HighestCalories = flow(sumSectionsOfRows, takeHighest(3), sum)

console.log(maxTotalCalories(input));
console.log(sum3HighestCalories(input));