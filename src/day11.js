import { add, cond, constant, divide, eq, floor, get, head, identity, isInteger, map, multiply, nth, pipe, range, size, sortBy, split, spread, subtract, take, toInteger, reduce, tail } from "lodash/fp"
import { matchRegex, pipeWithLogger, wrapWithLogger } from "./util";

const operandToFunction = cond([
  [eq('+'), add],
  [eq('-'), subtract],
  [eq('*'), multiply],
  [eq('/'), divide]
]);

const valueToFunction = cond([
  [eq('old'), identity],
  [pipe(Number, isInteger), pipe(toInteger, constant)]
]);

const operationToFunction = line => {
  const pattern = /Operation: new = (old|\d+) ([+-/*]) (old|\d+)/
  const [_, a, operandRaw, b] = line.match(pattern);
  const getA = valueToFunction(a);
  const getB = valueToFunction(b);
  const operand = operandToFunction(operandRaw);
  return (input) => operand(getB(input), getA(input));
}

const isDivisibleBy = factor => value => value % factor === 0;

const divisibleByPattern = /Test: divisible by (\d+)/;
const testToFunction = cond([
  [divisibleByPattern.test, pipeWithLogger(matchRegex(divisibleByPattern), nth(1), toInteger, isDivisibleBy)]
]);

const parseTarget = pipe(matchRegex(/throw to monkey (\d+)/), nth(1), toInteger);

const initializeQueue = pipe(
  split("\n"),
  nth(1),
  matchRegex(/Starting items: (.*)/),
  nth(1),
  split(", "),
  map(toInteger),
);

const initializeMonkey = monkeyBlock => {
  const lines = split("\n", monkeyBlock);
  console.log(divisibleByPattern.test(lines[3]));
  return {
    operation: operationToFunction(lines[2]),
    test: testToFunction(lines[3]),
    trueTarget: parseTarget(lines[4]),
    falseTarget: parseTarget(lines[5]),
    items: initializeQueue(lines[1]),
    inspectionCount: 0,
  }
};

const throwToMonkey = monkeys => (target, value) => {
  const newMonkeys = [...monkeys];
  newMonkeys[target] = {
    ...monkeys[target],
    items: [...monkeys[target].items, value]
  };
  return newMonkeys;
}

const activateMonkeyOnce = index => monkeys => {
  const monkey = monkeys[index];
  const item = head(monkey.items);
  const newValue = pipe(monkey.operation, divide(3), floor)(item);
  const target = monkey.test(newValue) ? monkey.trueTarget : monkey.falseTarget;
  const newMonkeys = throwToMonkey(monkeys)(target, newValue);
  newMonkeys[index] = {
    ...monkey,
    items: tail(monkey.itmes),
    inspectionCount: monkey.inspectionCount + 1,
  };
  return newMonkeys;
}

const activateMonkey = (monkeys, index) => {
  let newMonkeys = monkeys;
  while (size(newMonkeys[index].items) > 0) {
    newMonkeys = activateMonkeyOnce(index)(monkeys);
  }
  return newMonkeys;
}

const runRound = monkeys => {
  return reduce(activateMonkey, monkeys, range(0, size(monkeys)));
};

const runRoundsN = n => monkeys => {
  return reduce(runRound, monkeys, range(0, n));
}

const testInput =
  `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`;

//Q1
const totalMonkeyBusiness = pipe(
  split("\n\n"),
  map(initializeMonkey),
  runRoundsN(20),
  map(get("inspectionCount")),
  sortBy(identity),
  take(2),
  spread(multiply),
)

console.log(totalMonkeyBusiness(testInput));


