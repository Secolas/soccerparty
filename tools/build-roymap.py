#!/usr/bin/env python3
"""Deterministically build the Stadium Royale journey map from the REAL pitch
surface colours/textures used in index.html (BOARDS[*].surface). Nine pitch
bands stacked bottom->top in Royale stadium order, a winding trail up the
middle, trophy at the top. Prints the 9 node coordinates (normalised) to paste
into index.html's showRoyaleMap NODES.

    python3 tools/build-roymap.py
"""
import math, os, random
from PIL import Image, ImageDraw

random.seed(7)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEN = os.path.join(ROOT, "assets", "generated")
S = 512
img = Image.new("RGB", (S, S), (10, 12, 20))
d = ImageDraw.Draw(img, "RGBA")
h = S / 9.0
WALLpx = 6

def band_rect(k):           # k=0 bottom (stadium1) .. 8 top (stadium9)
    y1 = S - (k + 1) * h
    y0 = S - k * h
    return int(round(y1)), int(round(y0))

def speckle(x0, y0, x1, y1, cols, n):
    for _ in range(n):
        x = random.randint(x0, x1 - 1); y = random.randint(y0, y1 - 1)
        d.point((x, y), fill=random.choice(cols))

def fill(x0, y0, x1, y1, c):
    d.rectangle([x0, y0, x1 - 1, y1 - 1], fill=c)

def draw_ice(x0,y0,x1,y1):
    fill(x0,y0,x1,y1,(220,233,242))
    speckle(x0,y0,x1,y1,[(255,255,255),(183,198,212),(200,220,235)], 1400)
    for _ in range(5):
        cx=random.randint(x0,x1); cy=random.randint(y0,y1)
        for _s in range(6):
            nx=cx+random.randint(-18,18); ny=cy+random.randint(-6,6)
            d.line([cx,cy,nx,ny], fill=(255,255,255,120)); cx,cy=nx,ny

def draw_savanna(x0,y0,x1,y1):
    fill(x0,y0,x1,y1,(181,103,58))
    speckle(x0,y0,x1,y1,[(210,140,80),(120,64,30),(180,100,55)], 2000)
    for _ in range(4):
        tx=random.randint(x0+20,x1-20); ty=random.randint(y0+4,y1-4)
        d.ellipse([tx-8,ty-4,tx+8,ty+3], fill=(70,110,50)); d.line([tx,ty,tx,ty+6],fill=(90,60,30))

def draw_cobble(x0,y0,x1,y1):
    fill(x0,y0,x1,y1,(221,211,191))
    tones=[(226,218,201),(218,207,186),(230,223,208),(212,201,179),(198,186,161)]
    cs=6
    for yy in range(y0,y1,cs):
        for xx in range(x0,x1,cs):
            d.rectangle([xx,yy,xx+cs-2,yy+cs-2], fill=random.choice(tones))

def draw_clay(x0,y0,x1,y1):
    fill(x0,y0,x1,y1,(194,99,47))
    speckle(x0,y0,x1,y1,[(230,150,90),(140,66,30),(200,110,60)], 2000)

def draw_neon(x0,y0,x1,y1):
    fill(x0,y0,x1,y1,(10,11,22))
    for xx in range(x0,x1,12): d.line([xx,y0,xx,y1], fill=(80,255,255,60))
    for yy in range(y0,y1,12): d.line([x0,yy,x1,yy], fill=(80,255,255,60))
    for _ in range(3):
        px=random.randint(x0+10,x1-30); py=random.randint(y0+4,y1-8)
        d.rectangle([px,py,px+random.randint(8,22),py+random.randint(3,8)], outline=(255,90,220,180))

def draw_street(x0,y0,x1,y1):
    fill(x0,y0,x1,y1,(111,114,118))
    speckle(x0,y0,x1,y1,[(255,255,255),(0,0,0),(90,92,96)], 2200)

def draw_wood(x0,y0,x1,y1):
    tones=[(201,138,74),(192,127,64),(189,125,63),(196,133,74),(185,122,60),(198,135,70)]
    planks=6; pw=(x1-x0)/planks
    for i in range(planks):
        px=int(x0+i*pw); d.rectangle([px,y0,int(px+pw),y1], fill=tones[i%len(tones)])
        d.line([px,y0,px,y1], fill=(92,58,26,120))

def draw_stone(x0,y0,x1,y1):
    fill(x0,y0,x1,y1,(216,205,180))
    rows=4; rh=(y1-y0)/rows
    for r in range(rows+1):
        yy=int(y0+r*rh); d.line([x0,yy,x1,yy], fill=(120,105,80,150))
    for r in range(rows):
        yy=int(y0+r*rh); off=(r%2)*9
        for sx in range(x0+off,x1,18): d.line([sx,yy,sx,int(yy+rh)], fill=(120,105,80,120))

def draw_grass(x0,y0,x1,y1):
    stripes=8; sw=(x1-x0)/stripes
    for i in range(stripes):
        sx=int(x0+i*sw); d.rectangle([sx,y0,int(sx+sw),y1], fill=(43,131,57) if i%2 else (52,152,74))

PITCHES=[draw_ice,draw_savanna,draw_cobble,draw_clay,draw_neon,draw_street,draw_wood,draw_stone,draw_grass]

for k,fn in enumerate(PITCHES):
    y1,y0=band_rect(k)
    fn(WALLpx,y1,S-WALLpx,y0)
    # faint white pitch markings
    d.rectangle([WALLpx+3,y1+3,S-WALLpx-3,y0-3], outline=(255,255,255,60))
    midy=(y1+y0)//2
    d.line([WALLpx+3,midy,S-WALLpx-3,midy], fill=(255,255,255,45))
    d.ellipse([S//2-10,midy-10,S//2+10,midy+10], outline=(255,255,255,55))
    # dark separator
    d.rectangle([0,y1-1,S,y1+1], fill=(20,16,12,200))

# winding trail up the middle
def trailx(y): return S/2 + 52*math.sin(y*0.031)
pts=[(trailx(y),y) for y in range(0,S+1,4)]
for wdt,col in [(22,(120,86,42)),(16,(176,132,72)),(9,(206,168,104))]:
    d.line(pts, fill=col, width=wdt, joint="curve")

# trophy at very top
try:
    tr=Image.open(os.path.join(GEN,"icon-trophy.png")).convert("RGBA").resize((64,64),Image.NEAREST)
    img.paste(tr,(S//2-32,2),tr)
except Exception as e:
    print("trophy skip",e)

img.save(os.path.join(GEN,"roymap.png"))
print("wrote roymap.png")
# node coords (normalised) on the trail at each band centre
nodes=[]
for k in range(9):
    y1,y0=band_rect(k); midy=(y1+y0)/2; nx=trailx(midy)
    nodes.append((round(nx/S,3), round(midy/S,3)))
print("NODES=", [list(n) for n in nodes])
