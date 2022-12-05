import { identity, parseInt, reduce, map } from "lodash/fp"

/**
 * Apply the same input to an array of functions, result in an array of outputs
 */
export const diverge = fns => input => map(f => f(input), fns)

export const parseNum = parseInt(0)

export const countWhere = (predicate) => reduce((accum, value) => predicate(value) ? accum + 1 : accum, 0);

export const countWhereTrue = countWhere(identity);
