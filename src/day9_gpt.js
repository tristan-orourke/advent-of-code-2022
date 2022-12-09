import { join, map, pipe, size, split, uniq } from "lodash/fp";
import rawInput from "./input/day9";

// initialize the head and tail positions
let head = [0, 0];
let tail = [0, 0];
let tailPositions = [[...tail]];

// read the input
const input = split("\n", rawInput);

// loop through each input
for (let i = 0; i < input.length; i++) {
  // split the input into direction and distance
  const [direction, distance] = input[i].split(" ");

  for (let i = 0; i < parseInt(distance); i++) {
    // update the head position based on the direction and distance
    switch (direction) {
      case "R":
        head[0] += 1;
        break;
      case "L":
        head[0] -= 1;
        break;
      case "U":
        head[1] += 1;
        break;
      case "D":
        head[1] -= 1;
        break;
    }

    // update the tail position if the head and tail are not touching
    if (Math.abs(head[0] - tail[0]) > 1 || Math.abs(head[1] - tail[1]) > 1) {
      if (head[0] === tail[0]) {
        // head and tail are in the same column, so move the tail up or down
        tail[1] += head[1] > tail[1] ? 1 : -1;
      } else if (head[1] === tail[1]) {
        // head and tail are in the same row, so move the tail left or right
        tail[0] += head[0] > tail[0] ? 1 : -1;
      } else {
        // head and tail are not in the same row or column, so move the tail diagonally
        tail[0] += head[0] > tail[0] ? 1 : -1;
        tail[1] += head[1] > tail[1] ? 1 : -1;
      }
    }
    tailPositions.push([...tail]);
  }
}

const countPositions = pipe(
  map(join(",")),
  uniq,
  size
)

// print the final positions of the head and tail
console.log(`Head: ${head[0]},${head[1]}`);
console.log(`Tail: ${tail[0]},${tail[1]}`);
console.log(`Unique positions: ${countPositions(tailPositions)}`)