import { parseInt } from "lodash/fp"

/**
 * Apply the same input to an array of functions, result in an array of outputs
 */
export const diverge = fns => input => map(f => f(input), fns)

export const parseNum = parseInt(0)
