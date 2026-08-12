import {
  createDefaultGame,
  updateGame,
  redirectSnake,
  randomTurn,
  countLiveSnakes,
} from "./game.js";

const CELL = 32;
const COLORS = {
  "#": "#244836",
  " ": "#163428",
  "*": "#ff4f6d",
  body: "#6fe08a",
  head: "#9dff7a",
  dead: "#ff8a3d",
  grid: "rgba(200, 240, 216, 0.06)",
};

const DIR_TO_KEY = { up: "w", down: "s", left: "a", right: "d" };
const KEY_TO_DIR = {
  w: "up",
  a: "left",
  s: "down",
  d: "right",
  arrowup: "up",
  arrowleft: "left",
  arrowdown: "down",
  arrowright: "right",
};

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const statusEl = document.getElementById("status");
const speedEl = document.getElementById("speed");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayMsg = document.getElementById("overlay-msg");

let game = createDefaultGame();
let running = false;
let timestep = 0;
let intervalMs = 1000;
let timerId = null;
let pulse = 0;

function resizeCanvas() {
  const cols = game.board[0].length;
  const rows = game.numRows;
  canvas.width = cols * CELL;
  canvas.height = rows * CELL;
}

function cellColor(ch) {
  if (ch === "#") return COLORS["#"];
  if (ch === " ") return COLORS[" "];
  if (ch === "*") return COLORS["*"];
  if (ch === "x") return COLORS.dead;
  if ("WASD".includes(ch)) return COLORS.head;
  if ("wasd^<>v".includes(ch)) return COLORS.body;
  return COLORS[" "];
}

function drawBoard() {
  if (!game?.board) return;
  const cols = game.board[0].length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let r = 0; r < game.numRows; r++) {
    for (let c = 0; c < cols; c++) {
      const ch = game.board[r][c];
      const x = c * CELL;
      const y = r * CELL;

      ctx.fillStyle = cellColor(ch);
      ctx.fillRect(x, y, CELL, CELL);

      if (ch === "*") {
        const t = 0.5 + 0.5 * Math.sin(pulse / 200);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.15 + 0.25 * t})`;
        ctx.beginPath();
        ctx.arc(x + CELL / 2, y + CELL / 2, CELL * 0.22, 0, Math.PI * 2);
        ctx.fill();
      }

      if ("WASD".includes(ch)) {
        ctx.fillStyle = "rgba(16, 36, 28, 0.35)";
        const eye = CELL * 0.14;
        if (ch === "W" || ch === "S") {
          ctx.fillRect(x + CELL * 0.28, y + CELL * 0.3, eye, eye);
          ctx.fillRect(x + CELL * 0.58, y + CELL * 0.3, eye, eye);
        } else {
          ctx.fillRect(x + CELL * 0.3, y + CELL * 0.28, eye, eye);
          ctx.fillRect(x + CELL * 0.3, y + CELL * 0.58, eye, eye);
        }
      }

      ctx.strokeStyle = COLORS.grid;
      ctx.strokeRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);
    }
  }
}

function formatSpeed(ms) {
  return `${(ms / 1000).toFixed(1)}s`;
}

function updateHud() {
  scoreEl.textContent = String(game.score);
  speedEl.textContent = formatSpeed(intervalMs);
  if (!running && countLiveSnakes(game) === 0) {
    statusEl.textContent = "dead";
  } else if (running) {
    statusEl.textContent = "live";
  } else {
    statusEl.textContent = "paused";
  }
}

function showOverlay(title, msg) {
  overlayTitle.textContent = title;
  overlayMsg.textContent = msg;
  overlay.classList.remove("hidden");
}

function hideOverlay() {
  overlay.classList.add("hidden");
}

function stopLoop() {
  running = false;
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function tick() {
  for (let j = 0; j < game.numSnakes; j++) {
    if (game.snakes[j].live && j >= 1 && timestep % 6 === 0) {
      randomTurn(game, j);
    }
  }

  updateGame(game);
  timestep += 1;
  drawBoard();
  updateHud();

  if (countLiveSnakes(game) === 0) {
    stopLoop();
    showOverlay("Game over", `Final score: ${game.score}. Hit a wall or yourself.`);
  }
}

function startLoop() {
  stopLoop();
  hideOverlay();
  running = true;
  statusEl.textContent = "live";
  timerId = setInterval(tick, intervalMs);
  updateHud();
}

function restart() {
  stopLoop();
  game = createDefaultGame();
  timestep = 0;
  resizeCanvas();
  drawBoard();
  updateHud();
  hideOverlay();
  statusEl.textContent = "ready";
}

function adjustSpeed(deltaMs) {
  intervalMs = Math.min(2000, Math.max(100, intervalMs + deltaMs));
  speedEl.textContent = formatSpeed(intervalMs);
  if (running) startLoop();
}

function flashButton(dir) {
  const btn = document.querySelector(`.dir-btn[data-dir="${dir}"]`);
  if (!btn) return;
  btn.classList.add("is-pressed");
  setTimeout(() => btn.classList.remove("is-pressed"), 120);
}

function handleDir(dir) {
  flashButton(dir);
  redirectSnake(game, DIR_TO_KEY[dir]);
  drawBoard();
  if (!running && countLiveSnakes(game) > 0) startLoop();
}

document.getElementById("btn-start").addEventListener("click", () => {
  if (countLiveSnakes(game) === 0) restart();
  if (!running) startLoop();
});

document.getElementById("btn-restart").addEventListener("click", () => {
  restart();
});

document.getElementById("btn-again").addEventListener("click", () => {
  restart();
  startLoop();
});

window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (KEY_TO_DIR[key]) {
    e.preventDefault();
    handleDir(KEY_TO_DIR[key]);
  } else if (e.key === "[") {
    adjustSpeed(100);
  } else if (e.key === "]") {
    adjustSpeed(-100);
  } else if (key === " " || key === "enter") {
    e.preventDefault();
    if (running) {
      stopLoop();
      statusEl.textContent = "paused";
    } else if (countLiveSnakes(game) > 0) {
      startLoop();
    } else {
      restart();
      startLoop();
    }
  }
});

document.querySelectorAll(".dir-btn").forEach((btn) => {
  btn.addEventListener("click", () => handleDir(btn.dataset.dir));
});

function animatePulse(now) {
  pulse = now;
  drawBoard();
  requestAnimationFrame(animatePulse);
}

resizeCanvas();
drawBoard();
updateHud();
requestAnimationFrame(animatePulse);
