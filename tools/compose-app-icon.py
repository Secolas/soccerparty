#!/usr/bin/env python3
"""Compose the Soccer Party app icon.

Takes the AI-generated base (a soccer ball being shot with a straight motion
streak, produced by `node gen-assets.mjs icon-base.png`) and composites the
REAL in-game ability icon PNGs flying along the trail — no slot boxes, just the
icons trailing behind the ball and tapering smaller toward the tail.

    python3 tools/compose-app-icon.py

Writes assets/generated/icon-app.png (the icon referenced by index.html).
"""
import math
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEN = os.path.join(ROOT, "assets", "generated")

# Ball centre and trail tail (approx, in the 512px base).
BALL = (380, 160)
TAIL = (95, 395)

# Abilities that fly in the trail, ordered ball -> tail.
ABILITIES = ["icon-ghost", "icon-curveball", "icon-shield",
             "icon-cannon", "icon-magnet", "icon-freeze"]
# (t along ball->tail, icon size px, perpendicular offset px)
SPECS = [(0.20, 86, 30), (0.36, 78, -34), (0.52, 68, 34),
         (0.66, 58, -30), (0.80, 48, 26), (0.92, 40, -22)]


def main():
    base = Image.open(os.path.join(GEN, "icon-base.png")).convert("RGBA")
    bx, by = BALL
    tx, ty = TAIL
    dx, dy = tx - bx, ty - by
    length = math.hypot(dx, dy)
    px, py = -dy / length, dx / length  # unit perpendicular
    for name, (t, sz, off) in zip(ABILITIES, SPECS):
        cx = bx + dx * t + px * off
        cy = by + dy * t + py * off
        icon = Image.open(os.path.join(GEN, name + ".png")).convert("RGBA")
        icon = icon.resize((sz, sz), Image.NEAREST)  # keep pixels crisp
        base.alpha_composite(icon, (int(cx - sz / 2), int(cy - sz / 2)))
    out = os.path.join(GEN, "icon-app.png")
    base.save(out)
    print("wrote", out)


if __name__ == "__main__":
    main()
