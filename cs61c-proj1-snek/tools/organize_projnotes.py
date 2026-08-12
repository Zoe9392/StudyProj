"""Organize ProjNotes.md: TOC + consistent ## sections; preserve all original body text."""
from pathlib import Path
import re
import shutil

src_history = Path(r"C:\Users\97614\AppData\Roaming\Cursor\User\History\4e62d34a\8Tj9.md")
path = Path(r"g:\CSlearner\Cal_cs61c\fa25-proj1-starter\ProjNotes.md")

# Restore the pre-organize working copy
shutil.copy2(src_history, path)

raw = path.read_text(encoding="utf-8")
lines = raw.splitlines()
while lines and lines[-1].strip() == "":
    lines.pop()

# Exact original heading line -> (display title for ##, anchor)
# Match original heading lines exactly as they appear in the file.
heading_specs = [
    (r"^##\s+Step 1: What the project is \?\s*$", "Step 1: What the project is ?", "step-1"),
    (r"^###\s+Task 1:\s+create_default_game\s*$", "Task 1:  create_default_game", "task-1"),
    (r"^###\s+Task 2: free_game\(\)\s*$", "Task 2: free_game()", "task-2"),
    (r"^###\s+Task3: print_board\s*$", "Task3: print_board", "task-3"),
    (r"^###\s+Task 4\s*$", "Task 4", "task-4"),
    (r"^##\s+4\.3: next square\s*$", "4.3: next square", "task-4-3"),
    (r"^##\s+Task 4\.5: update_game \(2026\.08\.03\)\s*$", "Task 4.5: update_game (2026.08.03)", "task-4-5"),
    (r"^##\s+Task 5\.1\s*$", "Task 5.1", "task-5-1"),
    (r"^###\s+Task 5:\s*$", "Task 5:", "task-5"),
    (r"^###\s+Task 6 --- find_head and initialize_snakes\s*$", "Task 6 --- find_head and initialize_snakes", "task-6"),
    (r"^##\s+Task 6\.2: initialize_snakes\s*$", "Task 6.2: initialize_snakes", "task-6-2"),
    (r"^###\s+Task 7: main\s*$", "Task 7: main", "task-7"),
]

heading_map = [(re.compile(p), title, anchor) for p, title, anchor in heading_specs]

toc_items = [(a, t) for _, t, a in heading_specs] + [
    ("integration-tests", "Integration tests"),
    ("final-notes", "Notes"),
]

out = []
out.append("# Snake Project Local Development")
out.append("")
out.append("## Table of Contents")
out.append("")
for anchor, label in toc_items:
    out.append(f"- [{label}](#{anchor})")
out.append("")
out.append("---")
out.append("")

content_lines = lines[1:]  # skip original H1

integration_inserted = False
# Only treat the LAST "Notes:" line as the final Notes section
notes_line_indices = [i for i, ln in enumerate(content_lines) if ln.strip() == "Notes:"]
final_notes_idx = notes_line_indices[-1] if notes_line_indices else -1

first_section = True
for idx, line in enumerate(content_lines):
    matched = False
    for pat, title, anchor in heading_map:
        if pat.match(line):
            if out and out[-1] != "":
                out.append("")
            if not first_section:
                out.append("---")
                out.append("")
            first_section = False
            out.append(f'<a id="{anchor}"></a>')
            out.append(f"## {title}")
            matched = True
            break
    if matched:
        continue

    if (
        not integration_inserted
        and line.startswith("zy990718@ZOEZHU:")
        and "make run-integration-tests" in line
    ):
        if out and out[-1] != "":
            out.append("")
        out.append("---")
        out.append("")
        out.append('<a id="integration-tests"></a>')
        out.append("## Integration tests")
        out.append("")
        integration_inserted = True

    if idx == final_notes_idx:
        if out and out[-1] != "":
            out.append("")
        out.append("---")
        out.append("")
        out.append('<a id="final-notes"></a>')
        out.append("## Notes")
        out.append("")
        out.append(line)  # preserve original "Notes:" line
        continue

    out.append(line)

text_out = "\n".join(out) + "\n"
path.write_text(text_out, encoding="utf-8")

# Verify all non-empty original non-heading body lines remain
missing = []
for ln in content_lines:
    if re.match(r"^#{1,3}\s", ln):
        continue
    if ln.strip() == "":
        continue
    if ln not in text_out:
        missing.append(ln)

print("Wrote", path)
print("New lines:", len(text_out.splitlines()))
print("Missing non-empty original body lines:", len(missing))
for m in missing[:20]:
    print(" MISSING:", repr(m[:100]))
