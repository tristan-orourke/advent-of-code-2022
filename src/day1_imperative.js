import _ from "lodash";
import input from "./input/day1";

/**
 * 
 * @param string input 
 * @returns number
 */
const sumRowsOfNumbers = (input) => _.chain(input)
  .split("\n")
  .map(_.parseInt)
  .sum()
  .value()

const sumSectionsOfRows = (input) => _.chain(input)
.split("\n\n")
.map(sumRowsOfNumbers)
.value()

/**
 * 
 * @param string input 
 */
const maxTotalCalories = (input) => _.max(sumSectionsOfRows(input))

const nHighestGroupSums = (input, n) => _.chain(sumSectionsOfRows(input)).orderBy(_.identity, "desc").take(n).value()

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

console.log(maxTotalCalories(input));
console.log(_.sum(nHighestGroupSums(input, 3)))