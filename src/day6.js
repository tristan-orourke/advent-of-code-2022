import { add, pipe, size, slice, uniq } from "lodash/fp";
import input from "./input/day6";

/**
 * Finds the first position for which the predicate function returns true
 * @param {(input: string|array, index: number) => boolean} predicate 
 * @returns {(input: string|array) => number|undefined}
 */
const scanForPosition = (predicate) => (input) => {
  for (let index = 0; index < size(input); index++) {
    if (predicate(input, index)) {
      return index;
    }
  }
  return undefined;
}

const allElementsAreUnique = input => size(uniq(input)) === size(input);

/**
 * The n unique elements includes the one at index.
 * @param {*} count 
 * @returns 
 */
const precededByCountUniqueElements = count => (input, index) =>
  (index >= (count - 1))
    ? allElementsAreUnique(slice(index + 1 - count, index + 1, input)) // extra plus-1 because index and zero-indexed and count is not, and because slice end is exclusive
    : false;

const testInput1 = "bvwbjplbgvbhsrlpgdmjqwftvncz";
const testInput2 = "nppdvjthqldpwncqszvftbrmjlhg";
const testInput3 = "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg";
const testInput4 = "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw";


// q1
const findMarkerPosition = pipe(
  scanForPosition(precededByCountUniqueElements(4)),
  add(1) // convert from zero index to position number
)
// q2
const findMessagePosition = pipe(
  scanForPosition(precededByCountUniqueElements(14)),
  add(1) // convert from zero index to position number
)
// console.log(findMarkerPosition(testInput1));
// console.log(findMarkerPosition(testInput2));
// console.log(findMarkerPosition(testInput3));
// console.log(findMarkerPosition(testInput4));
console.log(findMarkerPosition(input));

// console.log(findMessagePosition(testInput1));
// console.log(findMessagePosition(testInput2));
// console.log(findMessagePosition(testInput3));
// console.log(findMessagePosition(testInput4));
console.log(findMessagePosition(input));