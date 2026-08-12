/**
 * Browser port of CS61C Project 1 snek game logic
 * (create_default_game, update_game, food, redirect, etc.)
 */

export function createDefaultGame() {
  const numRows = 18;
  const numCols = 20;
  const board = [];

  for (let i = 0; i < numRows; i++) {
    if (i === 0 || i === numRows - 1) {
      board.push("#".repeat(numCols).split(""));
    } else {
      board.push(("#" + " ".repeat(numCols - 2) + "#").split(""));
    }
  }

  board[2][9] = "*";
  board[2][2] = "d";
  board[2][3] = ">";
  board[2][4] = "D";

  return {
    numRows,
    board,
    numSnakes: 1,
    snakes: [
      {
        tailRow: 2,
        tailCol: 2,
        headRow: 2,
        headCol: 4,
        live: true,
      },
    ],
    foodSeed: 1,
    snakeSeed: 1,
    score: 0,
  };
}

function getBoardAt(game, row, col) {
  return game.board[row][col];
}

function setBoardAt(game, row, col, ch) {
  game.board[row][col] = ch;
}

function isTail(c) {
  return c === "w" || c === "a" || c === "s" || c === "d";
}

function isHead(c) {
  return c === "W" || c === "A" || c === "S" || c === "D" || c === "x";
}

function isSnake(c) {
  return isTail(c) || isHead(c) || c === "<" || c === ">" || c === "^" || c === "v";
}

function bodyToTail(c) {
  switch (c) {
    case "^":
      return "w";
    case "<":
      return "a";
    case "v":
      return "s";
    case ">":
      return "d";
    default:
      return "?";
  }
}

function headToBody(c) {
  switch (c) {
    case "W":
      return "^";
    case "A":
      return "<";
    case "S":
      return "v";
    case "D":
      return ">";
    default:
      return "?";
  }
}

function getNextRow(curRow, c) {
  if (c === "v" || c === "s" || c === "S") return curRow + 1;
  if (c === "^" || c === "w" || c === "W") return curRow - 1;
  return curRow;
}

function getNextCol(curCol, c) {
  if (c === ">" || c === "d" || c === "D") return curCol + 1;
  if (c === "<" || c === "a" || c === "A") return curCol - 1;
  return curCol;
}

function nextSquare(game, snum) {
  const snake = game.snakes[snum];
  const head = getBoardAt(game, snake.headRow, snake.headCol);
  const nextRow = getNextRow(snake.headRow, head);
  const nextCol = getNextCol(snake.headCol, head);
  return getBoardAt(game, nextRow, nextCol);
}

function updateHead(game, snum) {
  const snake = game.snakes[snum];
  const currHead = game.board[snake.headRow][snake.headCol];
  const body = headToBody(currHead);
  const nextRow = getNextRow(snake.headRow, body);
  const nextCol = getNextCol(snake.headCol, body);

  setBoardAt(game, snake.headRow, snake.headCol, body);
  setBoardAt(game, nextRow, nextCol, currHead);
  snake.headRow = nextRow;
  snake.headCol = nextCol;
}

function updateTail(game, snum) {
  const snake = game.snakes[snum];
  const currTail = getBoardAt(game, snake.tailRow, snake.tailCol);
  const nextRow = getNextRow(snake.tailRow, currTail);
  const nextCol = getNextCol(snake.tailCol, currTail);
  const newTail = bodyToTail(getBoardAt(game, nextRow, nextCol));

  setBoardAt(game, snake.tailRow, snake.tailCol, " ");
  setBoardAt(game, nextRow, nextCol, newTail);
  snake.tailRow = nextRow;
  snake.tailCol = nextCol;
}

function detRand(seedRef) {
  let game = seedRef.value;
  if (game === 0) game = 1;
  if (game & 1) {
    game = (game >>> 1) ^ 0x80000057;
  } else {
    game = game >>> 1;
  }
  seedRef.value = game >>> 0;
  return seedRef.value;
}

function getNumCols(game, row) {
  return game.board[row].length;
}

export function deterministicFood(game) {
  const seedRef = { value: game.foodSeed };
  let row = detRand(seedRef) % game.numRows;
  let col = detRand(seedRef) % getNumCols(game, row);

  while (game.board[row][col] !== " ") {
    row = detRand(seedRef) % game.numRows;
    col = detRand(seedRef) % getNumCols(game, row);
  }
  game.board[row][col] = "*";
  game.foodSeed = seedRef.value;
  return 1;
}

export function updateGame(game, addFood = deterministicFood) {
  for (let i = 0; i < game.numSnakes; i++) {
    if (!game.snakes[i].live) continue;

    const next = nextSquare(game, i);
    if (next === " ") {
      updateHead(game, i);
      updateTail(game, i);
    } else if (next === "*") {
      updateHead(game, i);
      game.score += 1;
      addFood(game);
    } else if (next === "#" || isSnake(next)) {
      game.snakes[i].live = false;
      setBoardAt(game, game.snakes[i].headRow, game.snakes[i].headCol, "x");
    }
  }
}

export function redirectSnake(game, inputDirection) {
  const snake = game.snakes[0];
  if (!snake || !snake.live) return;

  const { headRow: row, headCol: col } = snake;
  if (inputDirection === "w") game.board[row][col] = "W";
  else if (inputDirection === "a") game.board[row][col] = "A";
  else if (inputDirection === "s") game.board[row][col] = "S";
  else if (inputDirection === "d") game.board[row][col] = "D";
}

export function randomTurn(game, snum) {
  const snake = game.snakes[snum];
  const curHead = game.board[snake.headRow][snake.headCol];
  const heads = ["<", "v", ">", "^"];
  let i = heads.indexOf(curHead);
  if (i < 0) return;

  const seedRef = { value: game.snakeSeed };
  if (detRand(seedRef) % 2 === 0) i += 1;
  else i -= 1;
  i = ((i % 4) + 4) % 4;
  game.snakeSeed = seedRef.value;
  game.board[snake.headRow][snake.headCol] = heads[i];
}

export function countLiveSnakes(game) {
  return game.snakes.filter((s) => s.live).length;
}

export function cloneBoard(game) {
  return game.board.map((row) => row.slice());
}
