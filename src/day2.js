import { pipe,  map,  split, sum, nth, join } from "lodash/fp";
import input from "./input/day2";
import { diverge } from "./util";

const opponentMap = {
  A: "R",
  B: "P",
  C: "S"
};
const playerMap = {
  X: "R",
  Y: "P",
  Z: "S"
}
// How many points awarded to the second player?
const outcomePoints = {
  RR: 3,
  PP: 3,
  SS: 3,
  RP: 6,
  PR: 0,
  RS: 0,
  SR: 6,
  PS: 6,
  SP: 0,
}
// Bonus points for playing a particular move
const shapePoints = {
  R: 1,
  P: 2,
  S: 3,
}

const parseOpponentMove = (codes) => opponentMap[codes[0]]
const parsePlayerMove = (codes) => playerMap[codes[1]];

const playerMoveMap = {
  RX: "S", // X means the second player should lose
  PX: "R",
  SX: "P",
  RY: "R", // Y means the player should draw
  PY: "P",
  SY: "S",
  RZ: "P", // Z means the player should win
  PZ: "S",
  SZ: "R",
}
const parsePlayerMoveV2 = (codes) => {
  const interimCodes = [parseOpponentMove(codes), codes[1]];
  return playerMoveMap[join("", interimCodes)];
}

const scoreMoves = (moves) => {
  const outcome = outcomePoints[join("", moves)];
  const bonus = shapePoints[nth(1, moves)];
  return sum([outcome, bonus]);
}

const roundScore = pipe(split(" "), diverge([parseOpponentMove, parsePlayerMove]), scoreMoves)
const roundScoreV2 = pipe(split(" "), diverge([parseOpponentMove, parsePlayerMoveV2]), scoreMoves)

// eslint-disable-next-line no-unused-vars
const testInput =
  `A Y
B X
C Z`;

// Q1
const totalScore = pipe(split("\n"), map(roundScore), sum);
// Q2
const totalScoreV2 = pipe(split("\n"), map(roundScoreV2), sum);

console.log(totalScore(input));
console.log(totalScoreV2(input));