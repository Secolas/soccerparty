    // ================= BOARD THEMES =================
    const boardCanvas=document.createElement('canvas'); boardCanvas.width=W; boardCanvas.height=H;
    const bc=boardCanvas.getContext('2d');

    function grain(g,count,dark,light){ for(let n=0;n<count;n++){ const x=WALL+Math.random()*(W-WALL*2), y=WALL+Math.random()*(H-WALL*2), len=1+Math.random()*4; g.fillStyle=Math.random()>0.5?dark:light; g.fillRect(Math.round(x),Math.round(y),Math.round(len),1);} }

    const BOARDS={
      wood:{ name:'WOOD', surround:'#140f0a', stand:'#241a12', tier:'rgba(0,0,0,0.25)',
        frame:'#6b4a28',frameHi:'#8a6338',frameLo:'#4a3018',post:'#d9d0be',
        line:'rgba(245,235,210,0.5)',line2:'rgba(245,235,210,0.42)',
        netRecess:'#241812',netBack:'rgba(0,0,0,0.35)',netMesh:'rgba(230,225,210,0.28)',netMouth:'rgba(255,250,235,0.18)',
        netStrand:'rgba(238,233,218,0.6)',netOverlay:'rgba(20,14,10,0.5)',
        surface(g){ const planks=6,pw=(W-WALL*2)/planks,tones=['#c98a4a','#c07f40','#bd7d3f','#c4854a','#b97a3c','#c68746']; for(let i=0;i<planks;i++){ const px=Math.round(WALL+i*pw); g.fillStyle=tones[i%tones.length]; g.fillRect(px,WALL,Math.ceil(pw),H-WALL*2); g.strokeStyle='rgba(92,58,26,0.15)'; g.lineWidth=1; for(let st=0;st<5;st++){ let gx=px+3+Math.random()*(pw-6); g.beginPath(); g.moveTo(gx,WALL); for(let y=WALL;y<H-WALL;y+=6){ g.lineTo(gx+Math.sin(y*0.05+st)*1.3,y);} g.stroke(); } if(Math.random()<0.55){ const kx=px+pw*0.5+(Math.random()-0.5)*pw*0.4, ky=WALL+22+Math.random()*(H-WALL*2-44); g.strokeStyle='rgba(70,44,20,0.4)'; for(let r=2;r<6;r+=2){ g.beginPath(); g.ellipse(kx,ky,r,r*1.6,0,0,Math.PI*2); g.stroke(); } } g.fillStyle='rgba(58,36,15,0.42)'; g.fillRect(px,WALL,1,H-WALL*2); g.fillStyle='rgba(255,228,182,0.12)'; g.fillRect(px+1,WALL,1,H-WALL*2); } grain(g,700,'rgba(80,50,20,0.15)','rgba(255,225,180,0.11)'); },
        preview(g,w,h){ g.fillStyle='#c07f40'; g.fillRect(0,0,w,h); for(let i=0;i<5;i++){g.fillStyle='rgba(90,60,30,0.4)';g.fillRect(i*w/5,0,1,h);} } },

      grass:{ name:'GRASS', surround:'#08160b', stand:'#0d2413', tier:'rgba(255,255,255,0.05)',
        frame:'#12331b',frameHi:'#1c4a29',frameLo:'#0a2011',post:'#eef6ee',
        line:'rgba(245,255,240,0.72)',line2:'rgba(245,255,240,0.6)',
        netRecess:'#0a1a0f',netBack:'rgba(0,0,0,0.4)',netMesh:'rgba(240,255,240,0.3)',netMouth:'rgba(255,255,255,0.22)',
        netStrand:'rgba(245,255,245,0.65)',netOverlay:'rgba(6,20,10,0.55)',
        surface(g){ g.fillStyle='#2f8f3e'; g.fillRect(0,0,W,H); const bands=13,bh=(H-WALL*2)/bands; for(let i=0;i<bands;i++){ const by=Math.round(WALL+i*bh); g.fillStyle=i%2?'#2b8339':'#34984a'; g.fillRect(WALL,by,W-WALL*2,Math.ceil(bh)+1); g.fillStyle=i%2?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.05)'; g.fillRect(WALL,by,W-WALL*2,Math.ceil(bh/2)); } for(let n=0;n<1300;n++){ const x=WALL+Math.random()*(W-WALL*2)|0,y=WALL+Math.random()*(H-WALL*2)|0; g.fillStyle=Math.random()>0.5?'rgba(20,80,30,0.18)':'rgba(190,235,180,0.14)'; g.fillRect(x,y,1,1+(Math.random()*2|0)); } g.fillStyle='rgba(150,120,70,0.16)'; for(const gy of [WALL+20,H-WALL-20]){ for(let n=0;n<130;n++){ g.fillRect((W/2+(Math.random()-0.5)*GOAL_W)|0,(gy+(Math.random()-0.5)*22)|0,1,1); } } },
        preview(g,w,h){ for(let i=0;i<6;i++){g.fillStyle=i%2?'#2b8339':'#34984a';g.fillRect(0,i*h/6,w,h/6+1);} g.strokeStyle='rgba(255,255,255,0.7)';g.strokeRect(2,2,w-4,h-4);} },

      street:{ name:'STREET', surround:'#111214', stand:'#1c1f22', tier:'rgba(255,255,255,0.04)',
        frame:'#3a3d40',frameHi:'#54585c',frameLo:'#262829',post:'#e6c34a',
        line:'rgba(240,220,120,0.6)',line2:'rgba(235,235,235,0.42)',
        netRecess:'#1a1c1e',netBack:'rgba(0,0,0,0.4)',netMesh:'rgba(220,220,225,0.3)',netMouth:'rgba(255,255,255,0.2)',
        netStrand:'rgba(225,225,230,0.6)',netOverlay:'rgba(15,16,18,0.55)',
        surface(g){ g.fillStyle='#6f7276'; g.fillRect(0,0,W,H); for(let n=0;n<1600;n++){ const v=Math.random(); g.fillStyle=v>0.6?'rgba(255,255,255,0.06)':v>0.3?'rgba(0,0,0,0.10)':'rgba(90,92,96,0.5)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1); } for(let n=0;n<44;n++){ g.fillStyle=Math.random()>0.5?'rgba(205,205,210,0.5)':'rgba(48,48,52,0.5)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,2,2); } for(let n=0;n<5;n++){ const ox=WALL+Math.random()*(W-WALL*2),oy=WALL+Math.random()*(H-WALL*2); g.fillStyle='rgba(0,0,0,0.06)'; for(let b=0;b<44;b++){ g.fillRect(ox+(Math.random()-0.5)*24,oy+(Math.random()-0.5)*24,2,2); } } g.strokeStyle='rgba(0,0,0,0.30)'; g.lineWidth=1; for(let n=0;n<12;n++){ let x=WALL+Math.random()*(W-WALL*2),y=WALL+Math.random()*(H-WALL*2); g.beginPath(); g.moveTo(x,y); for(let st=0;st<5;st++){ x+=(Math.random()-0.5)*16;y+=(Math.random()-0.5)*16;g.lineTo(x,y);} g.stroke(); } },
        preview(g,w,h){ g.fillStyle='#6f7276';g.fillRect(0,0,w,h); for(let n=0;n<40;n++){g.fillStyle=Math.random()>0.5?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.15)';g.fillRect(Math.random()*w|0,Math.random()*h|0,1,1);} g.strokeStyle='rgba(240,220,120,0.7)';g.strokeRect(2,2,w-4,h-4);} },

      beach:{ name:'BEACH', surround:'#1b2733', stand:'#26333f', tier:'rgba(255,255,255,0.05)',
        frame:'#b98a52',frameHi:'#d6a86a',frameLo:'#8f6636',post:'#fff6e2',
        line:'rgba(120,90,50,0.5)',line2:'rgba(120,90,50,0.4)',
        netRecess:'#7a5a34',netBack:'rgba(0,0,0,0.3)',netMesh:'rgba(255,250,235,0.34)',netMouth:'rgba(255,255,255,0.25)',
        netStrand:'rgba(255,250,235,0.6)',netOverlay:'rgba(60,40,20,0.4)',
        surface(g){ g.fillStyle='#e3c98f'; g.fillRect(0,0,W,H); for(let n=0;n<1600;n++){ const v=Math.random(); g.fillStyle=v>0.55?'rgba(255,245,215,0.5)':v>0.3?'rgba(180,150,100,0.35)':'rgba(210,180,130,0.4)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1); } g.strokeStyle='rgba(200,170,120,0.4)'; g.lineWidth=1; for(let y=WALL+8;y<H-WALL;y+=9){ g.beginPath(); for(let x=WALL;x<W-WALL;x+=3){ g.lineTo(x,y+Math.sin(x*0.25)*1.4+Math.sin(x*0.08)*1.0);} g.stroke(); } g.fillStyle='rgba(150,120,80,0.10)'; for(let n=0;n<320;n++){ g.fillRect(WALL+Math.random()*(W-WALL*2)|0,(H*0.5+(Math.random()-0.5)*H*0.32)|0,2,1); } const sh=['rgba(255,255,255,0.7)','rgba(240,200,190,0.7)','rgba(220,220,240,0.7)']; for(let n=0;n<10;n++){ g.fillStyle=sh[n%3]; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,2,2); } },
        preview(g,w,h){ g.fillStyle='#e3c98f';g.fillRect(0,0,w,h); for(let n=0;n<40;n++){g.fillStyle=Math.random()>0.5?'rgba(255,245,215,0.6)':'rgba(180,150,100,0.4)';g.fillRect(Math.random()*w|0,Math.random()*h|0,1,1);} g.strokeStyle='rgba(120,90,50,0.6)';g.strokeRect(2,2,w-4,h-4);} },

      neon:{ name:'NEON', surround:'#05060d', stand:'#0a0c18', tier:'rgba(80,255,255,0.06)',
        frame:'#12142a',frameHi:'#2ff3ff',frameLo:'#0a0b18',post:'#2ff3ff',
        line:'rgba(90,240,255,0.8)',line2:'rgba(255,90,220,0.6)',
        netRecess:'#0a0c1a',netBack:'rgba(0,0,0,0.5)',netMesh:'rgba(90,240,255,0.35)',netMouth:'rgba(120,255,255,0.35)',
        netStrand:'rgba(120,255,255,0.6)',netOverlay:'rgba(6,8,20,0.55)',
        surface(g){ g.fillStyle='#0a0b16'; g.fillRect(0,0,W,H); g.strokeStyle='rgba(80,255,255,0.12)'; g.lineWidth=1; for(let x=WALL;x<=W-WALL;x+=12){ g.beginPath(); g.moveTo(x+0.5,WALL); g.lineTo(x+0.5,H-WALL); g.stroke(); } for(let y=WALL;y<=H-WALL;y+=12){ g.beginPath(); g.moveTo(WALL,y+0.5); g.lineTo(W-WALL,y+0.5); g.stroke(); } for(let x=WALL;x<=W-WALL;x+=24){ for(let y=WALL;y<=H-WALL;y+=24){ if(Math.random()<0.3){ g.fillStyle=Math.random()>0.5?'rgba(90,240,255,0.5)':'rgba(255,90,220,0.45)'; g.fillRect(x-1,y-1,3,3); } } } for(let n=0;n<120;n++){ g.fillStyle=Math.random()>0.5?'rgba(90,240,255,0.25)':'rgba(255,90,220,0.2)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1); } },
        preview(g,w,h){ g.fillStyle='#0a0b16';g.fillRect(0,0,w,h); g.strokeStyle='rgba(90,240,255,0.5)'; for(let x=0;x<w;x+=6){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();} g.strokeStyle='rgba(255,90,220,0.7)';g.strokeRect(2,2,w-4,h-4);} },

      ice:{ name:'ICE', surround:'#0e1a24', stand:'#152634', tier:'rgba(255,255,255,0.06)',
        frame:'#dfe9f2',frameHi:'#ffffff',frameLo:'#b7c6d4',post:'#c9202f',
        line:'rgba(90,140,200,0.65)',line2:'rgba(200,60,70,0.5)',
        netRecess:'#c2d4e2',netBack:'rgba(120,150,180,0.4)',netMesh:'rgba(150,175,200,0.4)',netMouth:'rgba(255,255,255,0.45)',
        netStrand:'rgba(120,150,190,0.6)',netOverlay:'rgba(180,200,220,0.4)',
        surface(g){ g.fillStyle='#dce9f2'; g.fillRect(0,0,W,H); for(let n=0;n<900;n++){ g.fillStyle=Math.random()>0.5?'rgba(255,255,255,0.5)':'rgba(150,180,210,0.25)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1); } g.fillStyle='rgba(255,255,255,0.10)'; for(let n=0;n<6;n++){ const fx=WALL+Math.random()*(W-WALL*2),fy=WALL+Math.random()*(H-WALL*2); for(let b=0;b<54;b++){ g.fillRect(fx+(Math.random()-0.5)*28,fy+(Math.random()-0.5)*28,2,2); } } g.strokeStyle='rgba(255,255,255,0.55)'; g.lineWidth=1; for(let n=0;n<5;n++){ const cx=WALL+Math.random()*(W-WALL*2),cy=WALL+Math.random()*(H-WALL*2),arms=3+(Math.random()*3|0); for(let a=0;a<arms;a++){ let ang=Math.random()*Math.PI*2,x=cx,y=cy; g.beginPath(); g.moveTo(x,y); for(let st=0;st<4;st++){ ang+=(Math.random()-0.5)*0.6; const len=4+Math.random()*8; x+=Math.cos(ang)*len; y+=Math.sin(ang)*len; g.lineTo(x,y);} g.stroke(); } } for(let n=0;n<12;n++){ let x=WALL+Math.random()*(W-WALL*2),y=WALL+Math.random()*(H-WALL*2),a=Math.random()*Math.PI,len=6+Math.random()*16; g.beginPath(); g.moveTo(x,y); g.lineTo(x+Math.cos(a)*len,y+Math.sin(a)*len); g.stroke(); } },
        preview(g,w,h){ g.fillStyle='#dce9f2';g.fillRect(0,0,w,h); g.strokeStyle='rgba(200,60,70,0.6)';g.beginPath();g.moveTo(0,h/2);g.lineTo(w,h/2);g.stroke(); g.strokeStyle='rgba(90,140,200,0.6)';g.strokeRect(2,2,w-4,h-4);} },

      cobble:{ name:'COBBLE', surround:'#221e18', stand:'#2e2820', tier:'rgba(255,240,210,0.05)', frame:'#9a8f78',frameHi:'#c2b596',frameLo:'#6a6050',post:'#fff6e6', line:'rgba(90,78,58,0.62)',line2:'rgba(90,78,58,0.46)', netRecess:'#3a3f48',netBack:'rgba(0,0,0,0.35)',netMesh:'rgba(240,238,230,0.3)',netMouth:'rgba(255,255,255,0.22)',netStrand:'rgba(240,238,230,0.6)',netOverlay:'rgba(20,22,28,0.5)', surface(g){ g.fillStyle='#ddd3bf'; g.fillRect(0,0,W,H); var cs=6; var lt=['#e2dac9','#dacfba','#e6dfd0','#d4c9b3']; for(var y=WALL;y<H-WALL;y+=cs){ for(var x=WALL;x<W-WALL;x+=cs){ var wv=Math.sin(x*0.13+y*0.085); var dark = wv>0.74; g.fillStyle= dark ? (Math.random()>0.5?'#c6bba1':'#beb298') : lt[Math.floor(Math.random()*4)]; g.fillRect(x,y,cs-1,cs-1); } } g.fillStyle='rgba(120,110,90,0.16)'; for(var yy=WALL;yy<H-WALL;yy+=cs){ g.fillRect(WALL,yy,W-WALL*2,1);} for(var xx=WALL;xx<W-WALL;xx+=cs){ g.fillRect(xx,WALL,1,H-WALL*2);} grain(g,260,'rgba(150,140,120,0.08)','rgba(255,250,240,0.10)'); }, preview(g,w,h){ g.fillStyle='#ddd3bf'; g.fillRect(0,0,w,h); g.fillStyle='#c6bba1'; for(var y=0;y<h;y+=4){ for(var x=0;x<w;x+=4){ if(Math.sin(x*0.4+y*0.3)>0.55) g.fillRect(x,y,3,3);} } g.strokeStyle='rgba(120,110,90,0.5)'; g.strokeRect(2,2,w-4,h-4); } },

      clay:{ name:'CLAY', surround:'#3a231a', stand:'#4a2e20', tier:'rgba(255,220,180,0.05)', frame:'#b5642f',frameHi:'#d68a4a',frameLo:'#7d3f1c',post:'#fff0d8', line:'rgba(255,240,215,0.78)',line2:'rgba(255,240,215,0.6)', netRecess:'#5a3320',netBack:'rgba(0,0,0,0.3)',netMesh:'rgba(255,245,225,0.32)',netMouth:'rgba(255,255,255,0.24)',netStrand:'rgba(255,245,225,0.6)',netOverlay:'rgba(60,30,15,0.42)', surface(g){ g.fillStyle='#c2632f'; g.fillRect(0,0,W,H); for(var n=0;n<1500;n++){ var v=Math.random(); g.fillStyle=v>0.6?'rgba(230,150,90,0.4)':v>0.3?'rgba(140,66,30,0.35)':'rgba(200,110,60,0.4)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1);} g.strokeStyle='rgba(150,74,36,0.28)'; g.lineWidth=1; for(var y=WALL+6;y<H-WALL;y+=7){ g.beginPath(); for(var x=WALL;x<W-WALL;x+=3){ g.lineTo(x,y+Math.sin(x*0.12)*1.2);} g.stroke(); } g.fillStyle='rgba(90,44,20,0.12)'; for(var m=0;m<6;m++){ var ox=WALL+Math.random()*(W-WALL*2),oy=WALL+Math.random()*(H-WALL*2); for(var b=0;b<40;b++){ g.fillRect(ox+(Math.random()-0.5)*22,oy+(Math.random()-0.5)*22,2,2);} } }, preview(g,w,h){ g.fillStyle='#c2632f'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(150,74,36,0.5)'; for(var y=3;y<h;y+=5){ g.beginPath(); g.moveTo(0,y); g.lineTo(w,y); g.stroke(); } g.strokeStyle='rgba(255,240,215,0.7)'; g.strokeRect(2,2,w-4,h-4); } },

      turf:{ name:'TURF', surround:'#0a1420', stand:'#122234', tier:'rgba(255,255,255,0.05)', frame:'#1b3a5c',frameHi:'#2f5f8f',frameLo:'#0e2036',post:'#ffffff', line:'rgba(255,255,255,0.82)',line2:'rgba(255,255,255,0.65)', netRecess:'#0c1a12',netBack:'rgba(0,0,0,0.4)',netMesh:'rgba(255,255,255,0.32)',netMouth:'rgba(255,255,255,0.24)',netStrand:'rgba(255,255,255,0.6)',netOverlay:'rgba(8,20,14,0.5)', surface(g){ g.fillStyle='#1f9e52'; g.fillRect(0,0,W,H); var cols=10,cw=(W-WALL*2)/cols; for(var i=0;i<cols;i++){ var cx=Math.round(WALL+i*cw); g.fillStyle=i%2?'#1c9149':'#25ab5b'; g.fillRect(cx,WALL,Math.ceil(cw)+1,H-WALL*2);} for(var n=0;n<900;n++){ g.fillStyle=Math.random()>0.5?'rgba(0,0,0,0.22)':'rgba(255,255,255,0.06)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1);} for(var f=0;f<600;f++){ g.fillStyle='rgba(120,220,150,0.12)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1+(Math.random()*2|0));} }, preview(g,w,h){ for(var i=0;i<8;i++){ g.fillStyle=i%2?'#1c9149':'#25ab5b'; g.fillRect(i*w/8,0,w/8+1,h);} g.strokeStyle='rgba(255,255,255,0.8)'; g.strokeRect(2,2,w-4,h-4); } },

      stone:{ name:'STONE', surround:'#1c2830', stand:'#26343d', tier:'rgba(255,255,255,0.05)', frame:'#c9b89a',frameHi:'#e6d8bd',frameLo:'#9a8768',post:'#fff8ec', line:'rgba(70,60,50,0.55)',line2:'rgba(70,60,50,0.42)', netRecess:'#6a5a44',netBack:'rgba(0,0,0,0.3)',netMesh:'rgba(245,240,228,0.3)',netMouth:'rgba(255,255,255,0.22)',netStrand:'rgba(245,240,228,0.6)',netOverlay:'rgba(30,26,20,0.45)', surface(g){ g.fillStyle='#d8cdb4'; g.fillRect(0,0,W,H); g.strokeStyle='rgba(120,105,80,0.5)'; g.lineWidth=1; var rows2=10,rh=(H-WALL*2)/rows2; for(var r=0;r<rows2;r++){ var y0=WALL+r*rh,off=(r%2)*9; g.beginPath(); g.moveTo(WALL,Math.round(y0)+0.5); g.lineTo(W-WALL,Math.round(y0)+0.5); g.stroke(); for(var sx=WALL+off;sx<W-WALL;sx+=18){ g.beginPath(); g.moveTo(Math.round(sx)+0.5,y0); g.lineTo(Math.round(sx)+0.5,y0+rh); g.stroke(); } } for(var n=0;n<800;n++){ g.fillStyle=Math.random()>0.5?'rgba(255,250,235,0.22)':'rgba(150,135,105,0.28)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1);} var by=Math.round(H/2)-3; for(var cxk=WALL;cxk<W-WALL;cxk+=6){ g.fillStyle=((((cxk-WALL)/6)|0)%2)?'rgba(200,40,50,0.20)':'rgba(255,255,255,0.18)'; g.fillRect(cxk,by,6,6);} }, preview(g,w,h){ g.fillStyle='#d8cdb4'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(120,105,80,0.6)'; for(var y=0;y<h;y+=5){ g.beginPath(); g.moveTo(0,y); g.lineTo(w,y); g.stroke(); } for(var cxk=0;cxk<w;cxk+=5){ g.fillStyle=(((cxk/5)|0)%2)?'rgba(200,40,50,0.5)':'rgba(255,255,255,0.5)'; g.fillRect(cxk,h/2-2,5,4);} g.strokeStyle='rgba(70,60,50,0.6)'; g.strokeRect(2,2,w-4,h-4); } },

      savanna:{ name:'SAVANNA', surround:'#241408', stand:'#33200f', tier:'rgba(255,220,180,0.05)', frame:'#8a5a2c',frameHi:'#b07a3c',frameLo:'#5a3818',post:'#fff0d8', line:'rgba(255,245,225,0.75)',line2:'rgba(255,245,225,0.6)', netRecess:'#5a3820',netBack:'rgba(0,0,0,0.3)',netMesh:'rgba(255,245,225,0.32)',netMouth:'rgba(255,255,255,0.24)',netStrand:'rgba(255,245,225,0.6)',netOverlay:'rgba(50,28,12,0.42)', surface(g){ g.fillStyle='#b5673a'; g.fillRect(0,0,W,H); for(var n=0;n<1500;n++){ var v=Math.random(); g.fillStyle=v>0.6?'rgba(210,140,80,0.4)':v>0.3?'rgba(120,64,30,0.32)':'rgba(180,100,55,0.4)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1);} g.strokeStyle='rgba(90,50,24,0.26)'; g.lineWidth=1; for(var m=0;m<9;m++){ var cx=WALL+Math.random()*(W-WALL*2),cy=WALL+Math.random()*(H-WALL*2); g.beginPath(); g.moveTo(cx,cy); for(var st=0;st<4;st++){ cx+=(Math.random()-0.5)*20;cy+=(Math.random()-0.5)*20;g.lineTo(cx,cy);} g.stroke(); } g.fillStyle='rgba(150,135,60,0.45)'; for(var t2=0;t2<80;t2++){ var gx=WALL+Math.random()*(W-WALL*2)|0, gy=WALL+Math.random()*(H-WALL*2)|0; g.fillRect(gx,gy-2,1,2); } }, preview(g,w,h){ g.fillStyle='#b5673a'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(90,50,24,0.4)'; for(var i=0;i<4;i++){ g.beginPath(); g.moveTo(Math.random()*w,Math.random()*h); g.lineTo(Math.random()*w,Math.random()*h); g.stroke(); } g.strokeStyle='rgba(255,245,225,0.7)'; g.strokeRect(2,2,w-4,h-4); } }
    };
    let boardKey='wood', board=BOARDS[boardKey];
    const AMBIENCE={ wood:'desk', grass:'stadium', street:'urban', beach:'beach', neon:'cyber', ice:'winter', cobble:'lisbon', clay:'fiesta', turf:'arena', stone:'coast', savanna:'safari' };
    function ambType(){ return AMBIENCE[boardKey]||'stadium'; }

    function drawNetPocket(x,y,w,h,side){
      const th=board;
      bc.fillStyle=th.netRecess; bc.fillRect(x,y,w,h);
      bc.fillStyle=th.netBack;
      if(side==='top') bc.fillRect(x,y,w,3); else bc.fillRect(x,y+h-3,w,3);
      bc.fillStyle=th.netMesh;
      const step=3;
      for(let py=y;py<y+h;py++){ const ld=(side==='top')?(y+h-1-py):(py-y); for(let px=x;px<x+w;px++){ const lxx=px-x; if(((lxx+ld)%step===0)||((lxx-ld+900)%step===0)) bc.fillRect(px,py,1,1); } }
      bc.fillStyle=th.netMouth;
      if(side==='top') bc.fillRect(x,y+h-2,w,1); else bc.fillRect(x,y+1,w,1);
    }
    function buildBoard(){
      board=BOARDS[boardKey];
      try{ buildAmbient(); }catch(e){}
      bc.clearRect(0,0,W,H);
      board.surface(bc);
      // frame
      const f=board.frame,fh=board.frameHi,fl=board.frameLo;
      bc.fillStyle=f; bc.fillRect(0,0,W,WALL); bc.fillRect(0,H-WALL,W,WALL); bc.fillRect(0,0,WALL,H); bc.fillRect(W-WALL,0,WALL,H);
      bc.fillStyle=fh; bc.fillRect(0,0,W,2); bc.fillRect(0,0,2,H);
      bc.fillStyle=fl; bc.fillRect(0,H-2,W,2); bc.fillRect(W-2,0,2,H);
      bc.fillStyle='rgba(0,0,0,0.22)';
      bc.fillRect(WALL,WALL,W-WALL*2,2); bc.fillRect(WALL,H-WALL-2,W-WALL*2,2); bc.fillRect(WALL,WALL,2,H-WALL*2); bc.fillRect(W-WALL-2,WALL,2,H-WALL*2);
      // nets
      const gL=Math.round((W-GOAL_W)/2);
      drawNetPocket(gL,0,GOAL_W,NET_DEPTH,'top');
      drawNetPocket(gL,H-NET_DEPTH,GOAL_W,NET_DEPTH,'bottom');
      bc.fillStyle=board.post;
      bc.fillRect(gL-1,0,2,NET_DEPTH); bc.fillRect(gL+GOAL_W-1,0,2,NET_DEPTH);
      bc.fillRect(gL-1,H-NET_DEPTH,2,NET_DEPTH); bc.fillRect(gL+GOAL_W-1,H-NET_DEPTH,2,NET_DEPTH);
    }
    buildBoard();

