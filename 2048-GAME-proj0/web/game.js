(() => {
  const SIZE = 4;
  const WIN_TILE = 2048;
  const PROB_TWO = 0.9;
  const BEST_KEY = "game2048-best";

  const boardEl = document.getElementById("board");
  const scoreEl = document.getElementById("score");
  const bestEl = document.getElementById("best");
  const overlayEl = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlay-title");
  const newGameBtn = document.getElementById("new-game");
  const tryAgainBtn = document.getElementById("try-again");

  let grid = emptyGrid();
  let score = 0;
  let best = Number(localStorage.getItem(BEST_KEY) || 0);
  let won = false;
  let over = false;
  let keepPlaying = false;

  bestEl.textContent = String(best);

  function emptyGrid() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  }

  function cloneGrid(g) {
    return g.map((row) => row.slice());
  }

  function gridsEqual(a, b) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (a[r][c] !== b[r][c]) return false;
      }
    }
    return true;
  }

  function emptyCells(g) {
    const cells = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (g[r][c] === 0) cells.push({ r, c });
      }
    }
    return cells;
  }

  function addRandomTile() {
    const cells = emptyCells(grid);
    if (!cells.length) return;
    const pick = cells[Math.floor(Math.random() * cells.length)];
    grid[pick.r][pick.c] = Math.random() < PROB_TWO ? 2 : 4;
  }

  function slideLine(line) {
    const filtered = line.filter((v) => v !== 0);
    const merged = [];
    const mergeMarks = Array(SIZE).fill(false);
    let gained = 0;
    let i = 0;

    while (i < filtered.length) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        const value = filtered[i] * 2;
        merged.push(value);
        gained += value;
        mergeMarks[merged.length - 1] = true;
        i += 2;
      } else {
        merged.push(filtered[i]);
        i += 1;
      }
    }
    while (merged.length < SIZE) merged.push(0);
    return { line: merged, gained, mergeMarks };
  }

  function rotateClockwise(g) {
    const next = emptyGrid();
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) next[c][SIZE - 1 - r] = g[r][c];
    }
    return next;
  }

  function rotateCounterClockwise(g) {
    const next = emptyGrid();
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) next[SIZE - 1 - c][r] = g[r][c];
    }
    return next;
  }

  function flipRows(g) {
    return g.map((row) => row.slice().reverse());
  }

  function rotateMarksClockwise(marks) {
    const next = emptyGrid();
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) next[c][SIZE - 1 - r] = marks[r][c];
    }
    return next;
  }

  /** Slide/merge in a direction. Same merge rules as the Java Model.tilt. */
  function tilt(direction) {
    let working = cloneGrid(grid);
    let mergeMarks = emptyGrid();
    let rotationsBack = 0;
    let flip = false;

    if (direction === "up") {
      working = rotateCounterClockwise(working);
      rotationsBack = 1;
    } else if (direction === "down") {
      working = rotateClockwise(working);
      rotationsBack = 3;
    } else if (direction === "right") {
      working = flipRows(working);
      flip = true;
    }

    let gained = 0;
    for (let r = 0; r < SIZE; r++) {
      const result = slideLine(working[r]);
      working[r] = result.line;
      gained += result.gained;
      for (let c = 0; c < SIZE; c++) mergeMarks[r][c] = result.mergeMarks[c];
    }

    if (flip) {
      working = flipRows(working);
      for (let r = 0; r < SIZE; r++) mergeMarks[r].reverse();
    }
    for (let i = 0; i < rotationsBack; i++) {
      working = rotateClockwise(working);
      mergeMarks = rotateMarksClockwise(mergeMarks);
    }

    const moved = !gridsEqual(grid, working);
    const mergeCells = new Set();
    if (moved) {
      grid = working;
      score += gained;
      if (score > best) {
        best = score;
        localStorage.setItem(BEST_KEY, String(best));
      }
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (mergeMarks[r][c]) mergeCells.add(`${r},${c}`);
        }
      }
    }
    return { moved, mergeCells };
  }

  function hasWinTile(g) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (g[r][c] === WIN_TILE) return true;
      }
    }
    return false;
  }

  function canMove(g) {
    if (emptyCells(g).length) return true;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const v = g[r][c];
        if (c + 1 < SIZE && g[r][c + 1] === v) return true;
        if (r + 1 < SIZE && g[r + 1][c] === v) return true;
      }
    }
    return false;
  }

  function showOverlay(title, kind, buttonLabel) {
    overlayTitle.textContent = title;
    tryAgainBtn.textContent = buttonLabel;
    overlayEl.classList.remove("hidden", "win", "lose");
    overlayEl.classList.add(kind);
  }

  function hideOverlay() {
    overlayEl.classList.add("hidden");
    overlayEl.classList.remove("win", "lose");
  }

  function updateStatus() {
    if (!keepPlaying && hasWinTile(grid)) {
      won = true;
      showOverlay("You Win!", "win", "Keep Going");
      return;
    }
    if (!canMove(grid)) {
      over = true;
      showOverlay("Game Over", "lose", "Try Again");
    }
  }

  function render(mergeCells = new Set()) {
    boardEl.innerHTML = "";
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.setAttribute("role", "gridcell");
        const value = grid[r][c];
        if (value) {
          const tile = document.createElement("div");
          let cls = "v4096";
          if (value <= 2048) cls = `v${value}`;
          else if (value >= 8192) cls = "v8192";
          tile.className = `tile ${cls}`;
          if (mergeCells.has(`${r},${c}`)) tile.classList.add("merged");
          tile.textContent = String(value);
          cell.appendChild(tile);
        }
        boardEl.appendChild(cell);
      }
    }
    scoreEl.textContent = String(score);
    bestEl.textContent = String(best);
  }

  function newGame() {
    grid = emptyGrid();
    score = 0;
    won = false;
    over = false;
    keepPlaying = false;
    hideOverlay();
    addRandomTile();
    addRandomTile();
    render();
  }

  function tryMove(direction) {
    if (over) return;
    if (won && !keepPlaying) return;

    const { moved, mergeCells } = tilt(direction);
    if (!moved) return;
    addRandomTile();
    render(mergeCells);
    updateStatus();
  }

  const keyMap = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    w: "up",
    s: "down",
    a: "left",
    d: "right",
    W: "up",
    S: "down",
    A: "left",
    D: "right",
  };

  window.addEventListener("keydown", (e) => {
    const dir = keyMap[e.key];
    if (!dir) return;
    e.preventDefault();
    tryMove(dir);
  });

  let touchStartX = 0;
  let touchStartY = 0;
  boardEl.addEventListener(
    "touchstart",
    (e) => {
      const t = e.changedTouches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
    },
    { passive: true }
  );
  boardEl.addEventListener(
    "touchend",
    (e) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (Math.max(absX, absY) < 24) return;
      if (absX > absY) tryMove(dx > 0 ? "right" : "left");
      else tryMove(dy > 0 ? "down" : "up");
    },
    { passive: true }
  );

  newGameBtn.addEventListener("click", newGame);
  tryAgainBtn.addEventListener("click", () => {
    if (won && !over && !keepPlaying) {
      keepPlaying = true;
      hideOverlay();
      return;
    }
    newGame();
  });

  newGame();
})();
