#!/usr/bin/env python3
"""Convert a BW Academy lesson or curriculum Markdown file into a styled Word doc.

Usage: python md_to_docx.py input.md output.docx

If the lesson contains a teleprompter script (between the
"=== TELEPROMPTER SCRIPT START/END ===" lines), it is laid out in the doc in a
large, double-spaced reading style, and also saved next to the .docx as
"<output name> - Teleprompter.txt" (plain text, ready to paste into a
teleprompter app).

Supported Markdown (keep to this subset):
  # Title            -> document title
  ## Heading         -> section bar; "## 1 · Hook" etc. picks up the section colour
  ### Subheading     -> bold subheading
  - item / * item    -> bullet;  1. item -> numbered
  **bold**, *italic* -> inline formatting
  ---                -> thin divider
  blank line         -> paragraph break
"""
import re, sys
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

COLORS = {1: "F48FE0", 2: "A8D9A0", 3: "F5D77A", 4: "F2A097", 5: "9FC3EE", 6: "8FDFE9"}
DEFAULT = "D9D9D9"
INK = RGBColor(0x1D, 0x1D, 0x1F)

def shade(p, hex_fill):
    pPr = p._p.get_or_add_pPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear"); shd.set(qn("w:color"), "auto"); shd.set(qn("w:fill"), hex_fill)
    pPr.append(shd)

def bottom_border(p, color="1D1D1F", size="12"):
    pPr = p._p.get_or_add_pPr()
    bdr = OxmlElement("w:pBdr"); b = OxmlElement("w:bottom")
    for k, v in (("val", "single"), ("sz", size), ("space", "4"), ("color", color)):
        b.set(qn("w:" + k), v)
    bdr.append(b); pPr.append(bdr)

TOKEN = re.compile(r"(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)")

def add_inline(p, text, size=11, bold=False):
    for part in TOKEN.split(text):
        if not part:
            continue
        if part.startswith("**") and part.endswith("**"):
            r = p.add_run(part[2:-2]); r.bold = True
        elif part.startswith("*") and part.endswith("*") and len(part) > 2:
            r = p.add_run(part[1:-1]); r.italic = True
            if bold: r.bold = True
        else:
            r = p.add_run(part); r.bold = bold or None
        r.font.size = Pt(size); r.font.color.rgb = INK

def convert(src, dst):
    doc = Document()
    sec = doc.sections[0]
    sec.left_margin = sec.right_margin = Inches(0.9)
    sec.top_margin = sec.bottom_margin = Inches(0.8)
    st = doc.styles["Normal"]; st.font.name = "Arial"; st.font.size = Pt(11)
    st.element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
    st.paragraph_format.space_after = Pt(6)

    para_buf = []
    in_script = False
    script_lines = []
    def flush():
        if para_buf:
            p = doc.add_paragraph(); add_inline(p, " ".join(para_buf)); para_buf.clear()

    for raw in open(src, encoding="utf-8").read().splitlines():
        line = raw.rstrip()
        s = line.strip()
        if s.startswith("=== TELEPROMPTER SCRIPT START"):
            flush(); in_script = True
            p = doc.add_paragraph(); r = p.add_run("TELEPROMPTER SCRIPT: copy from here")
            r.bold = True; r.font.size = Pt(9); r.font.color.rgb = RGBColor(0x88, 0x88, 0x88)
            bottom_border(p, "9FC3EE", "8")
            continue
        if s.startswith("=== TELEPROMPTER SCRIPT END"):
            in_script = False
            p = doc.add_paragraph(); bottom_border(p, "9FC3EE", "8")
            r = p.add_run("END OF SCRIPT"); r.bold = True; r.font.size = Pt(9)
            r.font.color.rgb = RGBColor(0x88, 0x88, 0x88)
            continue
        if in_script:
            script_lines.append(s)
            if s:
                p = doc.add_paragraph()
                p.paragraph_format.line_spacing = 1.5
                p.paragraph_format.space_after = Pt(10)
                r = p.add_run(s); r.font.size = Pt(13)
                if s.startswith("[") and s.endswith("]"):
                    r.italic = True; r.font.color.rgb = RGBColor(0x77, 0x77, 0x77)
                else:
                    r.font.color.rgb = INK
            continue
        if not s:
            flush(); continue
        if s.startswith("# "):
            flush()
            p = doc.add_paragraph(); r = p.add_run("BW ACADEMY"); r.bold = True
            r.font.size = Pt(9); r.font.color.rgb = RGBColor(0x66, 0x66, 0x66)
            p.paragraph_format.space_after = Pt(0)
            p = doc.add_paragraph(); add_inline(p, s[2:], size=22, bold=True)
            bottom_border(p); p.paragraph_format.space_after = Pt(10)
        elif s.startswith("## "):
            flush()
            text = s[3:]
            m = re.match(r"(\d+)\s*[·.:\-]", text)
            fill = COLORS.get(int(m.group(1)), DEFAULT) if m else DEFAULT
            p = doc.add_paragraph(); shade(p, fill)
            p.paragraph_format.space_before = Pt(14); p.paragraph_format.space_after = Pt(6)
            add_inline(p, "  " + text, size=14, bold=True)
        elif s.startswith("### "):
            flush()
            p = doc.add_paragraph(); p.paragraph_format.space_before = Pt(8)
            add_inline(p, s[4:], size=12, bold=True)
        elif re.match(r"^[-*]\s+", s):
            flush()
            indent = len(line) - len(line.lstrip())
            p = doc.add_paragraph(style="List Bullet 2" if indent >= 2 else "List Bullet")
            add_inline(p, re.sub(r"^[-*]\s+", "", s))
        elif re.match(r"^\d+[.)]\s+", s):
            flush()
            p = doc.add_paragraph(style="List Number")
            add_inline(p, re.sub(r"^\d+[.)]\s+", "", s))
        elif re.fullmatch(r"-{3,}", s):
            flush()
            p = doc.add_paragraph(); bottom_border(p, "BBBBBB", "6")
        elif s.startswith("```"):
            continue
        else:
            # a line starting with **Label:** is its own paragraph; otherwise join wrapped lines
            if s.startswith("**") or s.startswith("*"):
                flush(); para_buf.append(s); flush()
            else:
                para_buf.append(s)
    flush()
    doc.save(dst)
    if script_lines:
        import os
        txt = os.path.splitext(dst)[0] + " - Teleprompter.txt"
        text = "\n".join(script_lines).strip()
        text = re.sub(r"\n{3,}", "\n\n", text) + "\n"
        open(txt, "w", encoding="utf-8").write(text)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    convert(sys.argv[1], sys.argv[2])
