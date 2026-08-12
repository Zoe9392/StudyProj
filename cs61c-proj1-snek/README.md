# 61C Project 1: snek

A Snake game from CS 61C Project 1. This repo includes the original C implementation and a browser version under `web/`.

## Web game

Play in the browser — same rules as the course project (walls, fruit, WASD heads, growth on eat).

Four always-visible buttons turn the snake: **Up / Left / Down / Right**.

```bash
# frontend (ES modules need a local server)
cd web
python -m http.server 8000
# open http://localhost:8000
```

**Controls:** 4 direction buttons · `WASD` / arrows · Space pause

## C project (original)

Terminal Snake: load a board, advance one time step, write the result.

### Board characters

| Character | Meaning |
| --- | --- |
| `#` | Wall |
| ` ` (space) | Empty |
| `*` | Fruit |
| `w` `a` `s` `d` | Tail |
| `^` `<` `v` `>` | Body |
| `W` `A` `S` `D` | Live head |
| `x` | Dead head |

### Build & run (C)

```bash
make snake
./snake -i tests/01-simple-in.snk -o tests/01-simple-out.snk

make interactive-snake
./interactive-snake

make unit-tests && ./unit-tests
make run-integration-tests
```

### Layout

| Path | Role |
| --- | --- |
| `src/game.c`, `src/game.h` | C game state and logic |
| `src/snake.c` | One-step CLI |
| `src/interactive_snake.c` | Terminal play mode |
| `web/` | Browser client + 4 turn buttons |
| `tests/` | Integration boards |
