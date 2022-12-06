import { identity, parseInt, reduce, map } from "lodash/fp"

/**
 * Apply the same input to an array of functions, result in an array of outputs
 * @template T
 * @template Y
 * @param {Array<(t: T) => Y>} fns
 * @returns {(input: T) => Y[]}
 */
export const diverge = fns => input => map(f => f(input), fns)

export const parseNum = parseInt(0)

export const countWhere = (predicate) => reduce((accum, value) => predicate(value) ? accum + 1 : accum, 0);

export const countWhereTrue = countWhere(identity);

/**
 * @template T
 * @param {number} length 
 * @param {(index: number) => T} initializer
 * @returns {T[]}
 */
export const makeArray = (length, initializer) => Array.from({length}, (_, i) => initializer(i));

export const wrapWithLogger = fn => (...input) => {
  console.log("input", input);
  const output = fn(...input);
  console.log("output", output);
  return output;
}