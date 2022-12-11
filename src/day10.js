import { identity, cond, pipe, startsWith, split, nth } from "lodash/fp"
import {parseNum} from "./util"

const doNoop = identity

const doAddX = value => registers => [
	registers, // reprrsents the one step before operation completes
	{...registers, X: registers.X + value}
]

const doInstr = instr => cond([
	[startsWith("noop", instr), doNoop],
	[startsWith("addx", instr), doAddX(nth(1, parseNum(split(" ", instr))]
])
