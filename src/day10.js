import { identity, cond, pipe, startsWith, split, nth, concat, last, multiply, map, reduce, sum, constant, tail, spread, stubTrue, get, inRange, chunk, join, wrap } from "lodash/fp";
import { diverge, mapWithIndex, parseNum, wrapWithLogger } from "./util";
import input from "./input/day10";

const doNoop = input => [input] // wrap whatever input in an array, to represent a single step passing

const doAddX = value => registers => [
	registers, // represents the one step before operation completes
	{ ...registers, X: registers.X + value }
];

const getArgs = pipe(split(" "), tail, map(parseNum))

const doInstr = cond([
	[startsWith("noop"), constant(doNoop)],
	[startsWith("addx"), pipe(getArgs, spread(doAddX))],
	[stubTrue, constant(identity)],
]);

const runInstruction = (regHistory, instruction) => concat(
	regHistory,
	doInstr(instruction)(last(regHistory))
);

const getSignalStrength = cycle => pipe(nth(cycle - 1), get("X"), multiply(cycle));

const pixelDrawn = screenWidth => (registers, index) => {
	const pixelPosition = index % screenWidth;
	const spritePosition = registers.X;
	return inRange(spritePosition - 1, spritePosition + 2, pixelPosition);
}

const drawPixel = x => x ? "#" : ".";

const interestingCycles = [20, 60, 100, 140, 180, 220];
const initialRegisters = { X: 1 };

const sumOverSignalStrengths = pipe(
	split("\n"),
	reduce(runInstruction, [initialRegisters]),
	diverge(map(getSignalStrength, interestingCycles)),
	sum
)

const drawProgramOutput = pipe(
	split("\n"),
	reduce(runInstruction, [initialRegisters]),
	mapWithIndex(pixelDrawn(40)),
	map(drawPixel),
	chunk(40),
	map(join("")),
	join("\n")
)

const testInput =
	`addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

console.log(sumOverSignalStrengths(input));
console.log(drawProgramOutput(input));