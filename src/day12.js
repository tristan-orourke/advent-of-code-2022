import { eq, filter, head, join, map, pipe, reduce, size, split, toArray, tail } from "lodash/fp";
import { log, wrapWithLogger } from "./util";

const getAdjacentPositions = grid => ([x, y]) => {
  const positions = [];
  if (x > 0) {
    positions.push([x - 1, y]);
  }
  if (y > 0) {
    positions.push([x, y - 1]);
  }
  if (x < (size(grid[0]) - 1)) {
    positions.push([x + 1, y]);
  }
  if (y < (size(grid) - 1)) {
    positions.push([x, y + 1]);
  }
  return positions
}

const getLocation = grid => ([x, y]) => grid[y][x];

const canReachLocation = fromValue => toValue =>
  eq("S", fromValue) ||
  eq("E", toValue) ||
  (fromValue.charCodeAt(0) >= (toValue.charCodeAt(0) - 1));

const canReachPosition = grid => fromPosition => toPosition => {
  const toValue = getLocation(grid);
  return canReachLocation(toValue(fromPosition))(toValue(toPosition));
}

const positionToKey = join(',');
const keyToPosition = split(',');

const findPosition = grid  => target => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (getLocation(grid)([x, y]) === target) return [x, y];
    }
  }
  return [0, 0];
};

const isValidNewEdge = grid => visitedMap => fromPosition => toPosition => {
  const key = positionToKey(toPosition);
  return !visitedMap.has(key) && canReachPosition(grid)(fromPosition)(toPosition);
}

const expandEdge = grid => ({ visitedMap, edge }) => {
  const fromPosition = head(edge);
  const newEdges = pipe(
    getAdjacentPositions(grid),
    filter(isValidNewEdge(grid)(visitedMap)(fromPosition)),
  )(fromPosition);
  return reduce((acc, newEdge) => {
    const stepsToFromPosition = acc.visitedMap.get(positionToKey(fromPosition));
    acc.visitedMap.set(positionToKey(newEdge), stepsToFromPosition + 1);
    acc.edge.push(newEdge)
    return acc;
  },
    { visitedMap, edge: tail(edge) },
    newEdges
  );
}

const repeatWhile = (fn, conditionFn) => initialInput => {
  let value = initialInput;
  while (conditionFn(value)) {
    value = fn(value);
  }
  return value;
};

const findStepsToEnd = grid => {
  const initialPosition = findPosition(grid)("S");
  const endPosition = findPosition(grid)("E");
  const endKey = positionToKey(endPosition);
  const initialInput = { visitedMap: new Map([[positionToKey(initialPosition), 0]]), edge: [initialPosition] };
  const findFinalState = repeatWhile(
    expandEdge(grid),
    ({ visitedMap, edge }) => {
      return !visitedMap.has(endKey) && size(edge) > 0
    }
  )
  const { visitedMap } = findFinalState(initialInput);
  return visitedMap.get(endKey);
  // return visitedMap;
}

const testInput =
  `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

console.log(pipe(
  split("\n"),
  map(toArray),
  findStepsToEnd,
  // visitedMap => visitedMap.get("E")
  // (grid) => getAdjacentPositions(grid)([5,0])
)(testInput));