import { filter, flatMap, forEach, get, head, identity, map, min, nth, pipe, split, spread, startsWith, sum, tail, trim } from "lodash/fp";
import { diverge, parseNum, branch, arrayFromMapValues } from "./util";
import input from "./input/day7";
/**
 * @typedef {{size: number; name: string}} File
 */


/**
 * @typedef {name: string; files: Map<string, File>; dirs: Map<string, Directory>; totalSize:? number} Directory
 */

/**
 * @typedef {currentPath: string[]; root: Directory} FileSystem
 */

const initFile = (size, name) => ({ size, name })
const initDirectory = (name) => ({ name, files: new Map(), dirs: new Map() });

/**
 * @param {string} description
 * @returns {File}
 */
const parseFile = pipe(
  split(" "),
  diverge([
    pipe(nth(0), parseNum),
    pipe(nth(1), identity),
  ]),
  spread(initFile)
)

const parseDir = pipe(
  split(" "),
  nth(1),
  initDirectory
)

/**
 * @param {string} description
 * @returns {File|Directory}
 */
const parseFileOrDir = branch(startsWith("dir"), parseDir, parseFile);

function directorySize(directory) { 
  const filesSize = pipe(
    get("files"),
    arrayFromMapValues,
    map(get("size")),
    sum)(directory);
  const subdirsSize = pipe(
    get("dirs"),
    arrayFromMapValues,
    map(directorySize),
    sum)(directory);
  return filesSize + subdirsSize;
}

/**
 * 
 * @param {string[]} path 
 * @returns {(dir: Directory) => Directory|File}
 */
const getPathFromDirectory = (path) => (dir) => {
  if (dir === undefined) {
    throw new Error("undefined directory");
  }
  if (path.length === 0) {
    return dir;
  } else if (path.length === 1 && dir.files.has(head(path))) {
    return dir.files.get(head(path));
  } else if (dir.dirs.has(head(path))) {
    return getPathFromDirectory(tail(path))(dir.dirs.get(head(path)));
  }
  throw new Error(`cannot find path ${path} in dir ${dir.name}`);
}

class FileSystem {
  constructor() {
    this.currentPath = [];
    this.root = initDirectory("/");
  }
  cd(dir) {
    if (dir === "/") {
      this.currentPath = [];
    } else if (dir === "..") {
      this.currentPath.pop();
    } else {
      this.currentPath.push(dir);
    }
  }
  getCurrentDirectory() {
    return getPathFromDirectory(this.currentPath)(this.root);
  }
  addEntry(input) {
    const currentDirectory = this.getCurrentDirectory();
    const fileOrDir = parseFileOrDir(input);
    if (fileOrDir.dirs !== undefined) {
      const dir = fileOrDir;
      currentDirectory.dirs.set(dir.name, dir);
    } else {
      const file = fileOrDir;
      currentDirectory.files.set(file.name, file);
    }
    return currentDirectory;
  }
  calculateDirectorySizes() {
    function calculateDirectorySizesRecurse(directory) {
      const filesSize = pipe(
        get("files"),
        arrayFromMapValues,
        map(get("size")),
        sum)(directory);
      const subdirsSize = pipe(
        get("dirs"),
        arrayFromMapValues,
        map(calculateDirectorySizesRecurse),
        sum)(directory);
      directory.totalSize = filesSize + subdirsSize;
      return directory.totalSize;
    }
    calculateDirectorySizesRecurse(this.root);
  }
}

const parseTerminalOutput = (input) => {
  const instructions = pipe(split("$"), tail, map(trim))(input);
  const fs = new FileSystem();
  instructions.forEach(instruction => {
    const [cmd, output] = pipe(split("\n"), diverge([head, tail]))(instruction);
    const [cmdType, args] = pipe(split(" "), diverge([head, tail]))(cmd);
    if (cmdType === "cd") {
      fs.cd(head(args));
    } else if (cmdType === "ls") {
      forEach(entry => fs.addEntry(entry), output);
    } else {
      throw new Error(`Unknown cmd type ${cmdType}`);
    }
  });
  return fs;
}

function unwrapNestedDirectoriesToList(directory) {
  const dirArray = arrayFromMapValues(directory.dirs);
  const result = [directory, ...flatMap(unwrapNestedDirectoriesToList, dirArray)];
  return result;
}

const testInput =
  `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

const directoryIsLargerThan = size => dir => dir.totalSize >= size;
const directoryIsSmallerThan = size => dir => dir.totalSize <= size;

//q1
const sumOfSmallDirectories = sizeCutoff => input => {
  const fs = parseTerminalOutput(input);
  fs.calculateDirectorySizes();
  return pipe(
    unwrapNestedDirectoriesToList,
    filter(directoryIsSmallerThan(sizeCutoff)),
    map(get("totalSize")),
    sum
  )(fs.root)
}

// q2
const smallestDirectorySizeWhichFreesEnoughSpace = totalSpace => neededSpace => input => {
  const fs = parseTerminalOutput(input);
  fs.calculateDirectorySizes();
  const currentUnused = totalSpace - fs.root.totalSize;
  const sizeCutoff = neededSpace - currentUnused;
  if (sizeCutoff <= 0) {
    return 0;
  }
  return pipe(
    unwrapNestedDirectoriesToList,
    filter(directoryIsLargerThan(sizeCutoff)),
    map(get("totalSize")),
    min
  )(fs.root)
}

const q2 = smallestDirectorySizeWhichFreesEnoughSpace(70000000)(30000000);

console.log(sumOfSmallDirectories(100000)(testInput));
console.log(sumOfSmallDirectories(100000)(input));
console.log(q2(testInput));
console.log(q2(input));