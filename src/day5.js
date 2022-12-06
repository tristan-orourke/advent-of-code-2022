import { map, pipe, reduce, split, chunk, nth, join, constant, flatMap, last, spread } from "lodash/fp";
import { diverge, makeArray, parseNum } from "./util";
import input from "./input/day5";

const reduceWithIndex = reduce.convert({cap: false});

const processBlock = (stackMap, chunk, index) => {
  const blockPattern = /\[(\w+)\]/
  const columnPattern = / (\w+) /
  const blockMatch = chunk.match(blockPattern);
  if (blockMatch) {
    const block = blockMatch[1];
    if (!stackMap.has(index)) {
      stackMap.set(index, []);
    }
    stackMap.get(index).unshift(block); // Add block to the front of the stack.
    return stackMap;
  }
  const columnMatch = chunk.match(columnPattern);
  if (columnMatch) {
    const column = columnMatch[1];
    stackMap.set(column, stackMap.get(index));
    stackMap.delete(index);
  }
  return stackMap
}

const buildStacks = pipe(
  split("\n"),
  reduce((m, row) => {
    const chunks = pipe(chunk(4), map(join("")))(row);
    return reduceWithIndex(processBlock, m)(chunks);
  }, new Map())
);

const moveBlock = (from, to) => (stackMap) => {
  const block = stackMap.get(from).pop();
  stackMap.get(to).push(block);
  return stackMap;
}

const moveMultipleBlocks = (count, from, to) => stackMap => {
  const blocks = stackMap.get(from).slice(-count);
  stackMap.set(to, [...stackMap.get(to), ...blocks]); // add the moved blocks to stack to
  stackMap.set(from, stackMap.get(from).slice(0, -count)); // remove the blocks from stack from
  return stackMap;
}

const extractParamsFromInstruction = instruction => {
  const instructionPattern = /move (\d+) from (\w+) to (\w+)/
  // eslint-disable-next-line no-unused-vars
  const [_, count, from, to] = instruction.match(instructionPattern);
  return [count, from, to];
}

const instructionToMoves = instruction => {
  const [count, from, to] = extractParamsFromInstruction(instruction);
  const move = moveBlock(from, to);
  return makeArray(parseNum(count), constant(move));
}

const instructionToMovesV2 = pipe(extractParamsFromInstruction, spread(moveMultipleBlocks))

const parseInstructions = pipe(
  split("\n"),
  flatMap(instructionToMoves)
);

const parseInstructionsV2 = pipe(
  split("\n"),
  map(instructionToMovesV2)
)

const testInput =
`    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

const testStacks =
`    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 `;

const runProcedureOnInput = (instructionParser) => pipe(
  split("\n\n"),
  diverge([
    pipe(nth(0), buildStacks),
    pipe(nth(1), instructionParser)
  ]),
  ([stacks, moves]) => pipe(...moves)(stacks)
)

const getTopOfEachStack = pipe(
  m => m.values(),
  Array.from,
  map(last),
  join("")
)

// Q1
console.log(pipe(runProcedureOnInput(parseInstructions), getTopOfEachStack)(input));
// Q2
console.log(pipe(runProcedureOnInput(parseInstructionsV2), getTopOfEachStack)(input));