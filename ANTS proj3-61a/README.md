# Ants Vs. SomeBees (CS 61A Project 3)

Tower-defense game inspired by *Plants Vs. Zombies*. Place ants in tunnels to stop bees from reaching your colony. Most game logic lives in `ants.py`.

## Requirements

- Python 3
- A web browser (for the GUI)

## How to play

### Web GUI (recommended on Windows)

```bat
play.bat
```

Or:

```bash
python gui.py
```

The server opens at `http://localhost:8000` (or the next free port in `8000–8099`).

**Controls**

1. Click **Play Ants** on the splash screen  
2. Click an ant type in the top row  
3. Click a tunnel square to place it  

### Options

| Flag | Meaning |
|------|---------|
| `-d test` / `-d easy` / `-d normal` / `-d hard` / `-d extra-hard` | Difficulty (also: `t`, `e`, `n`, `h`, `i`) |
| `-w` / `--water` | Wet layout with water places |
| `--food N` | Starting food (default: 2) |

Examples:

```bat
play.bat -d easy
play.bat -d hard -w
python gui.py -d normal --food 10
```

### Text mode

```bash
python ants_text.py
```

### Classic Tk GUI

```bash
python ants_gui.py
```

## Game overview

Each turn:

1. New bees may enter from the hive  
2. You place ants (spending food)  
3. Insects act — ants first, then bees  

**Win:** all bees are defeated.  
**Lose:** a bee reaches the end of a tunnel, or the `QueenAnt` is destroyed.

## Implemented ants

| Ant | Cost | Role |
|-----|------|------|
| Harvester | 2 | Produces 1 food per turn |
| Thrower | 3 | Throws at nearest bee |
| Short Thrower | 2 | Range ≤ 3 |
| Long Thrower | 2 | Range ≥ 5 |
| Fire | 5 | Damages bees in its place; bursts on death |
| Wall | 4 | High-health blocker |
| Hungry | 4 | Eats a bee, then chews for a few turns |
| Bodyguard | 4 | Container that protects another ant |
| Tank | 6 | Container that also damages bees |
| Scuba | 6 | Waterproof thrower (survives water) |
| Queen | 7 | Doubles damage behind her; colony loses if she dies |
| Ninja | 5 | Damages bees without blocking them |

Optional / unfinished in this tree: `SlowThrower`, `ScaryThrower`, `LaserAnt` (`implemented = False`).

## Project layout

```
ANTS proj3-61a/
├── ants.py              # Core classes & ant implementations
├── ants_strategies.py   # CLI flags & game startup
├── ants_plans.py        # Bee assault plans by difficulty
├── ants_text.py         # Text interface
├── ants_gui.py          # Tk graphics interface
├── gui.py               # Browser GUI server
├── gui.html / assets/   # Web UI assets
├── play.bat             # Windows launcher for gui.py
├── proj03.ok            # ok autograder config
└── tests/               # Problems 00–12 + EC
```

## Testing

Unlock and run tests with the course `ok` client (place `ok` in this folder if needed):

```bash
python ok -q 01          # one problem
python ok --local        # all default tests locally
python ok -u             # unlock locked tests
```

Default suites: `00`–`12` and `EC` (see `proj03.ok`).

## Notes

- Set an ant’s `implemented = True` in `ants.py` to show it in the GUI.  
- Water places (`-w`) kill non-waterproof insects on entry; only scuba ants survive by default.  
- Official spec: [cs61a.org/proj/ants](https://cs61a.org/proj/ants/)

## Play Game 
