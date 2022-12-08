import { all, any, findIndex, flatten, get, gt, gte, lt, lte, map, max, multiply, pipe, reduce, reverse, size, slice, split, spread, sum, takeWhile } from "lodash/fp";
import { countWhereTrue, parseNum, wrapWithLogger } from "./util";
import input from "./input/day8";

const mapMatrix = fn => matrix => matrix.map(
  (_, rowI) => matrix[rowI].map(
    (_, colI) => fn(matrix[rowI, colI], rowI, colI)
  )
);

const transpose = matrix =>
  matrix[0].map( // iterate through the first row to get each index which will become the columns
    (_, colI) => matrix.map(
      (row) => row[colI]
    )
  );

/** 
 * @typedef {{rows: T[][]; columns: T[][]}} Grid
 * @template T
 */


/**
 * @template T
 * @param {T[][]} matrix
 * @returns {Grid<T>}
 */
const gridFromMatrix = matrix => ({
  rows: matrix,
  columns: transpose(matrix)
})

const numberGridFromInput = pipe(
  split("\n"),
  map(pipe(
    Array.from,
    map(parseNum)
  )),
  gridFromMatrix
);

/**
 * A position in a row is visible if it is greater than all positions to the left of it, or to the right.
 * If there are no other entries either to the left or right, it is visible by default.
 * @param {number} index
 * @param {number[]} row
 * @returns {boolean}
 */
const isPositionVisibleInRow = (row, index) => {
  const left = slice(0, index)(row);
  const right = slice(index+1, size(row))(row);
  const greaterThanAll = (value, others) => all(gt(value), others)
  return size(left) === 0 || size(right) === 0 || greaterThanAll(row[index], reverse(left)) || greaterThanAll(row[index], right)
};

const isVisibleInGrid = (value, rowI, colI, grid) => {
  const row = grid.rows[rowI];
  const col = grid.columns[colI];
  const left = slice(0, colI, row);
  const right = slice(colI + 1, size(row), row); 
  const up = slice(0, rowI, col);
  const down = slice(rowI + 1, size(col), col);
  const greaterThanAll = (value, others) => all(gt(value), others)
  const isVisibleInDirection = reference => array => size(array) === 0 || greaterThanAll(reference, array);
  return any(
    isVisibleInDirection(value),
    // we flip left and up because we want to look at closer values first
    [left, right, up, down]
  );
}


const scenicScore = (value, rowI, colI, grid) => {
  const row = grid.rows[rowI];
  const col = grid.columns[colI];
  const left = slice(0, colI, row);
  const right = slice(colI + 1, size(row), row); 
  const up = slice(0, rowI, col);
  const down = slice(rowI + 1, size(col), col);
  const scoreDirection = reference => array => {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (element >= reference) {
        return index + 1;
      }
    }
    return size(array);
  }
  const scores = map(
    scoreDirection(value), 
    // we flip left and up because we want to look at closer values first
    [reverse(left), right, reverse(up), down]
  );
  return reduce(multiply, 1, scores);
}

const mapGrid = fn => grid => {
  const mappedGrid = grid.rows.map(
    (row, rowI) => row.map(
      (value, colI) => fn(value, rowI, colI, grid)
    )
  );
  return {
    rows: mappedGrid,
    columns: transpose(mappedGrid)
  }
}

const countVisibleValues = pipe(
  numberGridFromInput,
  mapGrid(isVisibleInGrid),
  get("rows"),
  flatten,
  countWhereTrue,
)

const bestScenicScore = pipe(
  numberGridFromInput,
  mapGrid(scenicScore),
  get("rows"),
  flatten,
  spread(Math.max)
)

const testInput = 
`30373
25512
65332
33549
35390`;

console.log(countVisibleValues(testInput));
console.log(countVisibleValues(input));
console.log(bestScenicScore(testInput));
console.log(bestScenicScore(input));