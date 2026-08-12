"""Generate a PPT introducing CS61C Project 1: snek."""
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import nsmap
from lxml import etree

# Colors matching project aesthetic
INK = RGBColor(0x10, 0x24, 0x1C)
MINT = RGBColor(0xC8, 0xF0, 0xD8)
LIME = RGBColor(0x6F, 0xE0, 0x8A)
FOAM = RGBColor(0xEE, 0xFA, 0xF2)
CORAL = RGBColor(0xFF, 0x4F, 0x6D)
SOFT = RGBColor(0x1A, 0x3A, 0x2C)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
GRAY = RGBColor(0x4A, 0x5C, 0x52)


def set_run(run, size=18, bold=False, color=INK, font="Calibri"):
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color
    run.font.name = font
    rPr = run._r.get_or_add_rPr()
    from pptx.oxml.ns import qn
    ea = rPr.find(qn("a:ea"))
    if ea is None:
        ea = etree.SubElement(rPr, qn("a:ea"))
    ea.set("typeface", font)


def add_bg(slide, color):
    fill = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5)
    )
    fill.fill.solid()
    fill.fill.fore_color.rgb = color
    fill.line.fill.background()
    # send to back
    spTree = slide.shapes._spTree
    sp = fill._element
    spTree.remove(sp)
    spTree.insert(2, sp)


def add_accent_bar(slide, color=LIME):
    bar = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, 0, 0, Inches(0.18), Inches(7.5)
    )
    bar.fill.solid()
    bar.fill.fore_color.rgb = color
    bar.line.fill.background()


def add_title(slide, text, top=0.35, size=32, color=INK):
    box = slide.shapes.add_textbox(Inches(0.6), Inches(top), Inches(12.2), Inches(0.8))
    tf = box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    run = p.add_run()
    run.text = text
    set_run(run, size=size, bold=True, color=color)
    return box


def add_bullets(slide, items, left=0.7, top=1.3, width=11.8, height=5.5, size=18):
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = box.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.level = 0
        p.space_after = Pt(10)
        if isinstance(item, tuple):
            text, level = item
            p.level = level
        else:
            text = item
        run = p.add_run()
        run.text = ("• " if p.level == 0 else "– ") + text
        set_run(run, size=size if p.level == 0 else size - 2, color=SOFT if p.level == 0 else GRAY)
    return box


def add_footer(slide, page, total=12):
    box = slide.shapes.add_textbox(Inches(11.5), Inches(7.05), Inches(1.5), Inches(0.3))
    p = box.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.RIGHT
    run = p.add_run()
    run.text = f"{page} / {total}"
    set_run(run, size=11, color=GRAY)


def add_card(slide, left, top, width, height, title, body_lines, title_color=INK):
    shape = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE,
        Inches(left), Inches(top), Inches(width), Inches(height),
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = FOAM
    shape.line.color.rgb = INK
    shape.line.width = Pt(1.5)

    tbox = slide.shapes.add_textbox(
        Inches(left + 0.2), Inches(top + 0.15), Inches(width - 0.4), Inches(0.4)
    )
    run = tbox.text_frame.paragraphs[0].add_run()
    run.text = title
    set_run(run, size=16, bold=True, color=title_color)

    bbox = slide.shapes.add_textbox(
        Inches(left + 0.2), Inches(top + 0.55), Inches(width - 0.4), Inches(height - 0.7)
    )
    tf = bbox.text_frame
    tf.word_wrap = True
    for i, line in enumerate(body_lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_after = Pt(4)
        run = p.add_run()
        run.text = line
        set_run(run, size=13, color=SOFT)


def build():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank = prs.slide_layouts[6]
    total = 11

    # ---- 1 Title ----
    s = prs.slides.add_slide(blank)
    add_bg(s, FOAM)
    # big brand
    box = s.shapes.add_textbox(Inches(0.8), Inches(2.0), Inches(11.5), Inches(1.4))
    run = box.text_frame.paragraphs[0].add_run()
    run.text = "snek"
    set_run(run, size=72, bold=True, color=INK)
    box2 = s.shapes.add_textbox(Inches(0.8), Inches(3.4), Inches(11.5), Inches(0.6))
    run = box2.text_frame.paragraphs[0].add_run()
    run.text = "CS 61C Project 1 · Code Project Introduction"
    set_run(run, size=26, color=SOFT)
    box3 = s.shapes.add_textbox(Inches(0.8), Inches(4.3), Inches(11.5), Inches(0.8))
    tf = box3.text_frame
    tf.word_wrap = True
    run = tf.paragraphs[0].add_run()
    run.text = "C implementation · Memory management · File I/O · Playable web version"
    set_run(run, size=18, color=GRAY)
    # accent strip at bottom
    strip = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(6.9), Inches(13.333), Inches(0.6))
    strip.fill.solid()
    strip.fill.fore_color.rgb = INK
    strip.line.fill.background()
    t = s.shapes.add_textbox(Inches(0.8), Inches(7.0), Inches(10), Inches(0.4))
    run = t.text_frame.paragraphs[0].add_run()
    run.text = "UC Berkeley CS 61C style course project"
    set_run(run, size=14, color=LIME)

    # ---- 2 Agenda ----
    s = prs.slides.add_slide(blank)
    add_bg(s, WHITE)
    add_accent_bar(s)
    add_title(s, "Agenda")
    add_bullets(s, [
        "Project overview & learning goals",
        "Board representation & game rules",
        "Core data structures",
        "C task breakdown & key functions",
        "Testing & validation",
        "Web extension",
        "Repository layout & how to run",
        "Summary",
    ], size=20)
    add_footer(s, 2, total)

    # ---- 3 Overview ----
    s = prs.slides.add_slide(blank)
    add_bg(s, WHITE)
    add_accent_bar(s)
    add_title(s, "Project Overview")
    add_bullets(s, [
        "Implement playable Snake (snek) game logic in plain C",
        "Practice pointers, heap alloc/free, 2D char boards, and file I/O",
        "Pipeline: load board → advance one timestep → write updated board",
        "Also includes interactive terminal play and a browser web version",
        "In scope: C, debugging, and memory management from lectures/labs",
    ], size=18)
    add_footer(s, 3, total)

    # ---- 4 Goals ----
    s = prs.slides.add_slide(blank)
    add_bg(s, WHITE)
    add_accent_bar(s)
    add_title(s, "Learning Goals")
    add_card(s, 0.6, 1.3, 3.9, 4.8, "Memory", [
        "Paired malloc / free",
        "2D board allocation order",
        "Free from inner → outer",
        "Valgrind for leaks",
    ], LIME)
    add_card(s, 4.7, 1.3, 3.9, 4.8, "Data Structures", [
        "game_t / snake_t",
        "Char grid for snake body",
        "Direction codes wasd / WASD",
        "Multi-snake numbering",
    ])
    add_card(s, 8.8, 1.3, 3.9, 4.8, "Engineering", [
        "Makefile builds",
        "Unit + integration tests",
        "gdb / assert debugging",
        "Port rules to the web UI",
    ], CORAL)
    add_footer(s, 4, total)

    # ---- 5 Board ----
    s = prs.slides.add_slide(blank)
    add_bg(s, WHITE)
    add_accent_bar(s)
    add_title(s, "Board Character Legend")
    add_bullets(s, [
        "#  wall    ·  (space) empty    ·  *  fruit",
        "Tail wasd  ·  Body ^ < v >  ·  Live head W A S D  ·  Dead head x",
        "Directions: w/^ up · a/< left · s/v down · d/> right",
        "Snakes numbered by tail order (top→bottom, left→right); IDs stay fixed",
    ], size=18)

    # mini board example
    board = s.shapes.add_textbox(Inches(0.8), Inches(4.0), Inches(11.5), Inches(2.6))
    tf = board.text_frame
    tf.word_wrap = False
    sample = [
        "Default board (snippet):",
        "####################",
        "#                  #",
        "#  d>D    *        #",
        "#                  #",
        "####################",
    ]
    for i, line in enumerate(sample):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        run = p.add_run()
        run.text = line
        set_run(run, size=14 if i == 0 else 15, bold=(i == 0), color=SOFT if i == 0 else INK, font="Consolas")
    add_footer(s, 5, total)

    # ---- 6 Rules ----
    s = prs.slides.add_slide(blank)
    add_bg(s, WHITE)
    add_accent_bar(s)
    add_title(s, "One-Timestep Update Rules")
    add_bullets(s, [
        "Each live snake moves one cell in its head direction",
        "Hit wall # or snake body → die; head becomes x",
        "Eat fruit * → update head only (grow) and spawn new fruit",
        "Move onto empty space → update head + update tail",
        "C: update_game()  ·  Web: same rules ported to JavaScript",
    ], size=18)
    add_footer(s, 6, total)

    # ---- 7 Structs ----
    s = prs.slides.add_slide(blank)
    add_bg(s, WHITE)
    add_accent_bar(s)
    add_title(s, "Core Data Structures (game.h)")
    code = s.shapes.add_textbox(Inches(0.7), Inches(1.3), Inches(12), Inches(5.5))
    tf = code.text_frame
    tf.word_wrap = True
    snippet = """typedef struct snake_t {
  unsigned int tail_row, tail_col;
  unsigned int head_row, head_col;
  bool live;
} snake_t;

typedef struct game_t {
  unsigned int num_rows;
  char **board;          // each row: chars + '\\n' + '\\0'
  unsigned int num_snakes;
  snake_t *snakes;
} game_t;"""
    for i, line in enumerate(snippet.split("\n")):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_after = Pt(2)
        run = p.add_run()
        run.text = line
        set_run(run, size=16, color=INK, font="Consolas")
    add_footer(s, 7, total)

    # ---- 8 Tasks ----
    s = prs.slides.add_slide(blank)
    add_bg(s, WHITE)
    add_accent_bar(s)
    add_title(s, "C Task Breakdown")
    tasks = [
        ("Task 1–2", "create_default_game / free_game\nHeap-allocate default game · free correctly"),
        ("Task 3", "print_board\nPrint each board row to a FILE*"),
        ("Task 4", "update_game\nMove / eat / death logic"),
        ("Task 5", "read_line / load_board\nDynamically load any-size board"),
        ("Task 6", "find_head / initialize_snakes\nScan tails and trace heads"),
        ("Task 7", "snake.c main\nCLI: load → update → write"),
    ]
    for i, (title, body) in enumerate(tasks):
        col = i % 3
        row = i // 3
        add_card(
            s,
            0.55 + col * 4.2,
            1.25 + row * 2.8,
            3.95,
            2.5,
            title,
            body.split("\n"),
        )
    add_footer(s, 8, total)

    # ---- 9 Testing ----
    s = prs.slides.add_slide(blank)
    add_bg(s, WHITE)
    add_accent_bar(s)
    add_title(s, "Testing & Debugging")
    add_bullets(s, [
        "make unit-tests && ./unit-tests  — per-task unit tests",
        "make valgrind-test-free-game  — check free_game for leaks",
        "make run-integration-tests  — diff against tests/*-ref.snk",
        "Common pitfalls: rows need '\\n'+'\\0'; free order; fgetc returns int; realloc growth",
        "Tools: -Wconversion warnings, Valgrind, board dump files",
    ], size=17)
    add_footer(s, 9, total)

    # ---- 10 Web ----
    s = prs.slides.add_slide(blank)
    add_bg(s, WHITE)
    add_accent_bar(s)
    add_title(s, "Web Extension")
    add_bullets(s, [
        "web/: C rules ported to JavaScript (game.js)",
        "Canvas rendering + four direction buttons (Up / Left / Down / Right)",
        "Keyboard WASD / arrows · [ ] speed · Space pause",
        "Run: cd web && python -m http.server 8000",
        "Open http://localhost:8000 to play",
    ], size=18)
    add_footer(s, 10, total)

    # ---- 11 Summary ----
    s = prs.slides.add_slide(blank)
    add_bg(s, FOAM)
    add_accent_bar(s, INK)
    add_title(s, "Summary")
    add_bullets(s, [
        "snek ties core C skills into one complete, testable mini-game",
        "Covers structs, heap memory, file loading, and state updates",
        "Test-driven workflow (unit + integration + Valgrind) checks correctness",
        "Web version shows the same rules can be reused and visualized cross-language",
        "Next: deepen understanding of pointer aliasing, edge cases, and performance",
    ], size=18)
    thanks = s.shapes.add_textbox(Inches(0.7), Inches(6.2), Inches(12), Inches(0.5))
    run = thanks.text_frame.paragraphs[0].add_run()
    run.text = "Thanks · Q & A"
    set_run(run, size=22, bold=True, color=INK)
    add_footer(s, 11, total)

    out = r"g:\CSlearner\Cal_cs61c\fa25-proj1-starter\snek-project-intro.pptx"
    prs.save(out)
    print(out)


if __name__ == "__main__":
    build()
