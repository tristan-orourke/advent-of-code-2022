import { add, cond, constant, divide, eq, floor, get, head, identity, isInteger, map, multiply, nth, pipe, range, size, sortBy, split, spread, subtract, take, toInteger, reduce, tail, stubTrue, reverse, toSafeInteger } from "lodash/fp"
import { matchRegex, pipeWithLogger, testRegex, time, wrapWithLogger } from "./util";
import input from "./input/day11";

const operandToFunction = cond([
  [eq('+'), constant(add)],
  [eq('-'), constant(subtract)],
  [eq('*'), constant(multiply)],
  [eq('/'), constant(divide)]
]);

const valueToFunction = cond([
  [eq('old'), constant(toSafeInteger)],
  [pipe(Number, isInteger), pipe(toInteger, constant)]
]);

const operationToFunction = line => {
  const pattern = /Operation: new = (old|\d+) ([+-/*]) (old|\d+)/
  const [_, a, operandRaw, b] = line.match(pattern);
  const getA = valueToFunction(a);
  const getB = valueToFunction(b);
  const operand = operandToFunction(operandRaw);
  return (input) => operand(getA(input), getB(input));
}

const isDivisibleBy = factor => value => toSafeInteger(value) % toSafeInteger(factor) === 0;

const divisibleByPattern = /Test: divisible by (\d+)/;
const parseTestDivisor = cond([
  [testRegex(divisibleByPattern), pipe(matchRegex(divisibleByPattern), nth(1), toInteger)]
]);

const parseTarget = pipe(matchRegex(/throw to monkey (\d+)/), nth(1), toInteger);

const parseQueue = pipe(
  matchRegex(/Starting items: (.*)/),
  nth(1),
  split(", "),
  map(toInteger),
);

const initializeMonkey = monkeyBlock => {
  const lines = split("\n", monkeyBlock);
  return {
    operation: operationToFunction(lines[2]),
    testDivisor: parseTestDivisor(lines[3]),
    trueTarget: parseTarget(lines[4]),
    falseTarget: parseTarget(lines[5]),
    items: parseQueue(lines[1]),
    inspectionCount: 0,
  }
};

const initializeMonkeyWithDivideOperation = monkeyBlock => {
  const lines = split("\n", monkeyBlock);
  return {
    operation: pipe(
      operationToFunction(lines[2]),
      n => divide(n, 3),
      toInteger
    ),
    testDivisor: parseTestDivisor(lines[3]),
    trueTarget: parseTarget(lines[4]),
    falseTarget: parseTarget(lines[5]),
    items: parseQueue(lines[1]),
    inspectionCount: 0,
  }
};

const adjustMonkeysForLeastCommonMultiple = monkeys => {
  const leastCommonMultiple = reduce(multiply, 1, map(get("testDivisor"), monkeys));
  const adjustMonkey = monkey => ({
    ...monkey,
    operation: pipe(
      monkey.operation,
      n => n % leastCommonMultiple
    ),
  });
  return map(adjustMonkey, monkeys);
}

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
  const newValue = monkey.operation(item);
  const target = isDivisibleBy(monkey.testDivisor)(newValue) ? monkey.trueTarget : monkey.falseTarget;
  const newMonkeys = throwToMonkey(monkeys)(target, newValue);
  newMonkeys[index] = {
    ...monkey,
    items: tail(monkey.items),
    inspectionCount: monkey.inspectionCount + 1,
  };
  return newMonkeys;
}

const activateMonkey = (monkeys, index) => {
  let newMonkeys = monkeys;
  while (size(newMonkeys[index].items) > 0) {
    newMonkeys = activateMonkeyOnce(index)(newMonkeys);
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
  map(initializeMonkeyWithDivideOperation),
  runRoundsN(20),
  map(get("inspectionCount")),
  sortBy(identity),
  reverse,
  take(2),
  spread(multiply),
)

//Q1
const totalMonkeyBusinessV2 = pipe(
  split("\n\n"),
  map(initializeMonkey),
  adjustMonkeysForLeastCommonMultiple,
  runRoundsN(10000),
  map(get("inspectionCount")),
  sortBy(identity),
  reverse,
  take(2),
  spread(multiply),
)

console.log(time(totalMonkeyBusiness)(input));
console.log(time(totalMonkeyBusinessV2)(input));


