# 2048 (CS 61B Project 0)

Classic tile-merge puzzle from UC Berkeley CS 61B. Slide numbered tiles; equal tiles merge into their sum. Reach **2048** to win.

This folder has the original Java GUI (`game2048/`) plus a browser version under `web/`.

## Play in the browser

**Windows**

```bat
play.bat
```

Or open the file directly:

```text
web/index.html
```

**From a terminal** (any OS)

```bash
# macOS
open web/index.html

# Linux
xdg-open web/index.html

# or serve locally
python -m http.server 8080 --directory web
# then visit http://localhost:8080
```

### Controls

| Input | Action |
|-------|--------|
| Arrow keys / WASD | Move tiles |
| Swipe (touch) | Move tiles |
| **New Game** | Restart |
| **Keep Going** | Continue after winning |

Best score is saved in the browser (`localStorage`).

## Rules (same as the Java model)

1. Each move slides all tiles as far as possible in one direction.
2. Two adjacent tiles with the same value merge into one tile of double value; that value is added to the score.
3. A tile participates in at most one merge per move.
4. After a successful move, a random **2** (90%) or **4** (10%) appears in an empty cell.
5. **Win** when a 2048 tile appears. **Lose** when no empty cells and no adjacent merges remain.

## Java version (original course project)

Requires Java and the CS 61B `ucb` GUI library from the course.

```bash
# Compile (adjust classpath for your library jar)
javac -cp ".:path/to/library.jar" game2048/*.java
java -cp ".:path/to/library.jar" game2048.Main
```

Main entry: `game2048.Main` — 4×4 board, 90% chance of spawning a 2.

### Core classes

| File | Role |
|------|------|
| `Model.java` | Game state, `tilt`, win/lose checks |
| `Board.java` | Tile grid + viewing perspective |
| `Game.java` | Input loop, random tile spawn |
| `GUI.java` / `BoardWidget.java` | Desktop UI |
| `Test*.java` | JUnit-style unit tests |

## Project layout

```
2048-GAME-proj0/
├── README.md
├── play.bat              # Opens the web game
├── web/                  # Playable browser game
│   ├── index.html
│   ├── style.css
│   └── game.js
└── game2048/             # Java CS 61B implementation
    ├── Main.java
    ├── Model.java
    ├── Board.java
    └── ...
```

## Notes

- The web game reimplements the tilt/merge rules in JavaScript; it does not run the Java code in the browser.
- Course materials: [CS 61B Project 0](https://sp23.datastructur.es/materials/proj/proj0/proj0/) (semester URLs vary).
