export const input =
`Monkey 0:
  Starting items: 54, 53
  Operation: new = old * 3
  Test: divisible by 2
    If true: throw to monkey 2
    If false: throw to monkey 6

Monkey 1:
  Starting items: 95, 88, 75, 81, 91, 67, 65, 84
  Operation: new = old * 11
  Test: divisible by 7
    If true: throw to monkey 3
    If false: throw to monkey 4

Monkey 2:
  Starting items: 76, 81, 50, 93, 96, 81, 83
  Operation: new = old + 6
  Test: divisible by 3
    If true: throw to monkey 5
    If false: throw to monkey 1

Monkey 3:
  Starting items: 83, 85, 85, 63
  Operation: new = old + 4
  Test: divisible by 11
    If true: throw to monkey 7
    If false: throw to monkey 4

Monkey 4:
  Starting items: 85, 52, 64
  Operation: new = old + 8
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 7

Monkey 5:
  Starting items: 57
  Operation: new = old + 2
  Test: divisible by 5
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 6:
  Starting items: 60, 95, 76, 66, 91
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 2
    If false: throw to monkey 5

Monkey 7:
  Starting items: 65, 84, 76, 72, 79, 65
  Operation: new = old + 5
  Test: divisible by 19
    If true: throw to monkey 6
    If false: throw to monkey 0`;
export default input;