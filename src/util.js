import { size } from "lodash";
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

export const pipeWithLogger = (...fns) => (...input) => {
  console.log("pipe input", input);
  let output = input;
  for (let index = 0; index < size(fns); index++) {
    if (index > 0) console.log("interim input", output);
    output = fns[index](...output);    
  }
  console.log("pipe output", output);
  return output;
}

export const branch = (predicateFn, trueFn, falseFn) => input => predicateFn(input) ? trueFn(input) : falseFn(input);

export const arrayFromMapValues = m => Array.from(m.values());

export const reduceWithIndex = reduce.convert({cap: false});
export const mapWithIndex = map.convert({cap: false});

export const matchRegex = pattern => str => str.match(pattern);