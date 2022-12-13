import { eq, filter, head, join, map, pipe, reduce, size, split, toArray, tail, reverse, subtract, flip, identity, overEvery, negate } from "lodash/fp";
import { log, pipeWithLogger, wrapWithLogger } from "./util";
import input from "./input/day12";

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

const canReachLocation = fromValue => toValue => {
  if (eq("S", fromValue)) {
    return eq("a", toValue)
  }
  if (eq("E", toValue)) {
    return eq("z", fromValue);
  }
  return fromValue.charCodeAt(0) >= (toValue.charCodeAt(0) - 1)
}

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

const findAllPositions = grid  => target => {
  const positions = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (getLocation(grid)([x, y]) === target) positions.push([x, y]);
    }
  }
  return positions;
};

const isValidNewEdge = grid => visitedMap => fromPosition => toPosition => {
  const key = positionToKey(toPosition);
  return !visitedMap.has(key) && canReachPosition(grid)(fromPosition)(toPosition);
}

const mapAlreadyContainsPosition = visitedMap => position => {
  return visitedMap.has(positionToKey(position));
}

const expandEdge = grid => isLegalTransition => ({ visitedMap, edge }) => {
  const fromPosition = head(edge);
  // eslint-disable-next-line lodash-fp/prefer-composition-grouping
  const newEdges = pipe(
    getAdjacentPositions(grid),
    filter(negate(mapAlreadyContainsPosition(visitedMap))),
    filter(isLegalTransition(fromPosition))
  )(fromPosition);
  return reduce((acc, newEdge) => {
    const stepsToFromPosition = acc.visitedMap.get(positionToKey(fromPosition));
    acc.visitedMap.set(positionToKey(newEdge), {prevPosition: fromPosition, steps: stepsToFromPosition + 1});
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

const findMapToEnd = grid => {
  const initialPosition = findPosition(grid)("S");
  const endPosition = findPosition(grid)("E");
  const endKey = positionToKey(endPosition);
  const initialInput = { visitedMap: new Map([[positionToKey(initialPosition), {prevPosition: null, steps: 0}]]), edge: [initialPosition] };
  const findFinalState = repeatWhile(
    expandEdge(grid)(canReachPosition(grid)),
    ({ visitedMap, edge }) => {
      return !visitedMap.has(endKey) && size(edge) > 0
    }
  )
  const { visitedMap } = findFinalState(initialInput);
  return visitedMap;
}

const constructMap = grid => isLegalTransition => mapIsComplete => startingPosition => {
  const initialInput = { visitedMap: new Map([[positionToKey(startingPosition), {prevPosition: null, steps: 0}]]), edge: [startingPosition] };
  const findFinalState = repeatWhile(
    expandEdge(grid)(isLegalTransition),
    mapIsComplete
  )
  const { visitedMap } = findFinalState(initialInput);
  return visitedMap;
}

const constructPathToEnd = grid => visitedMap => {
  const path = [];
  let position = findPosition(grid)("E");
  while(position) {
    path.push(position);
    position = visitedMap.get(positionToKey(position)).prevPosition;
  }
  return reverse(path);
}

const findLatestStartingPoint = grid => visitedMap => {
  const startingPoints = [
    findPosition(grid)("S"),
    ...findAllPositions(grid)("a")
  ];

}

const testInput =
  `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

// q1
console.log(pipe(
  split("\n"),
  map(toArray),
  grid => pipe(
    findMapToEnd,
    constructPathToEnd(grid)
  )(grid),
  size,
  n => n - 1,
)(input));

// console.log(pipe(
//   split("\n"),
//   map(toArray),
//   grid => pipe(
//     findCompleteMap,
//     constructPathToEnd(grid)
//   )(grid),
//   size,
//   n => n - 1,
// )(testInput));