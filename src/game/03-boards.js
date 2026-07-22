    // ================= BOARD THEMES =================
    const boardCanvas=document.createElement('canvas'); boardCanvas.width=W; boardCanvas.height=H;
    const bc=boardCanvas.getContext('2d');

    function grain(g,count,dark,light){ for(let n=0;n<count;n++){ const x=WALL+Math.random()*(W-WALL*2), y=WALL+Math.random()*(H-WALL*2), len=1+Math.random()*4; g.fillStyle=Math.random()>0.5?dark:light; g.fillRect(Math.round(x),Math.round(y),Math.round(len),1);} }

    const BOARDS={
      wood:{ name:'WOOD', surround:'#1c150d', stand:'#352619', tier:'rgba(0,0,0,0.25)',
        frame:'#6b4a28',frameHi:'#8a6338',frameLo:'#4a3018',post:'#d9d0be',
        line:'rgba(245,235,210,0.5)',line2:'rgba(245,235,210,0.42)',
        netRecess:'#241812',netBack:'rgba(0,0,0,0.35)',netMesh:'rgba(230,225,210,0.28)',netMouth:'rgba(255,250,235,0.18)',
        netStrand:'rgba(238,233,218,0.6)',netOverlay:'rgba(20,14,10,0.5)',
        surface(g){ const planks=6,pw=(W-WALL*2)/planks,tones=['#c98a4a','#c07f40','#bd7d3f','#c4854a','#b97a3c','#c68746']; for(let i=0;i<planks;i++){ const px=Math.round(WALL+i*pw); g.fillStyle=tones[i%tones.length]; g.fillRect(px,WALL,Math.ceil(pw),H-WALL*2); g.strokeStyle='rgba(92,58,26,0.15)'; g.lineWidth=1; for(let st=0;st<5;st++){ let gx=px+3+Math.random()*(pw-6); g.beginPath(); g.moveTo(gx,WALL); for(let y=WALL;y<H-WALL;y+=6){ g.lineTo(gx+Math.sin(y*0.05+st)*1.3,y);} g.stroke(); } if(Math.random()<0.55){ const kx=px+pw*0.5+(Math.random()-0.5)*pw*0.4, ky=WALL+22+Math.random()*(H-WALL*2-44); g.strokeStyle='rgba(70,44,20,0.4)'; for(let r=2;r<6;r+=2){ g.beginPath(); g.ellipse(kx,ky,r,r*1.6,0,0,Math.PI*2); g.stroke(); } } g.fillStyle='rgba(58,36,15,0.42)'; g.fillRect(px,WALL,1,H-WALL*2); g.fillStyle='rgba(255,228,182,0.12)'; g.fillRect(px+1,WALL,1,H-WALL*2); } grain(g,700,'rgba(80,50,20,0.15)','rgba(255,225,180,0.11)'); },
        preview(g,w,h){ g.fillStyle='#c07f40'; g.fillRect(0,0,w,h); for(let i=0;i<5;i++){g.fillStyle='rgba(90,60,30,0.4)';g.fillRect(i*w/5,0,1,h);} } },

      grass:{ name:'GRASS', surround:'#14170f', stand:'#243a1a', tier:'rgba(255,255,255,0.05)',
        frame:'#12331b',frameHi:'#1c4a29',frameLo:'#0a2011',post:'#eef6ee',
        line:'rgba(245,255,240,0.72)',line2:'rgba(245,255,240,0.6)',
        netRecess:'#0a1a0f',netBack:'rgba(0,0,0,0.4)',netMesh:'rgba(240,255,240,0.3)',netMouth:'rgba(255,255,255,0.22)',
        netStrand:'rgba(245,255,245,0.65)',netOverlay:'rgba(6,20,10,0.55)',
        surface(g){ g.fillStyle='#2f8f3e'; g.fillRect(0,0,W,H); const bands=13,bh=(H-WALL*2)/bands; for(let i=0;i<bands;i++){ const by=Math.round(WALL+i*bh); g.fillStyle=i%2?'#2b8339':'#34984a'; g.fillRect(WALL,by,W-WALL*2,Math.ceil(bh)+1); g.fillStyle=i%2?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.05)'; g.fillRect(WALL,by,W-WALL*2,Math.ceil(bh/2)); } for(let n=0;n<1300;n++){ const x=WALL+Math.random()*(W-WALL*2)|0,y=WALL+Math.random()*(H-WALL*2)|0; g.fillStyle=Math.random()>0.5?'rgba(20,80,30,0.18)':'rgba(190,235,180,0.14)'; g.fillRect(x,y,1,1+(Math.random()*2|0)); } g.fillStyle='rgba(150,120,70,0.16)'; for(const gy of [WALL+20,H-WALL-20]){ for(let n=0;n<130;n++){ g.fillRect((W/2+(Math.random()-0.5)*GOAL_W)|0,(gy+(Math.random()-0.5)*22)|0,1,1); } } },
        preview(g,w,h){ for(let i=0;i<6;i++){g.fillStyle=i%2?'#2b8339':'#34984a';g.fillRect(0,i*h/6,w,h/6+1);} g.strokeStyle='rgba(255,255,255,0.7)';g.strokeRect(2,2,w-4,h-4);} },

      street:{ name:'STREET', surround:'#17150f', stand:'#2a2620', tier:'rgba(255,255,255,0.04)',
        frame:'#3a3d40',frameHi:'#54585c',frameLo:'#262829',post:'#e6c34a',
        line:'rgba(240,220,120,0.6)',line2:'rgba(235,235,235,0.42)',
        netRecess:'#1a1c1e',netBack:'rgba(0,0,0,0.4)',netMesh:'rgba(220,220,225,0.3)',netMouth:'rgba(255,255,255,0.2)',
        netStrand:'rgba(225,225,230,0.6)',netOverlay:'rgba(15,16,18,0.55)',
        surface(g){ g.fillStyle='#6f7276'; g.fillRect(0,0,W,H); for(let n=0;n<1600;n++){ const v=Math.random(); g.fillStyle=v>0.6?'rgba(255,255,255,0.06)':v>0.3?'rgba(0,0,0,0.10)':'rgba(90,92,96,0.5)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1); } for(let n=0;n<44;n++){ g.fillStyle=Math.random()>0.5?'rgba(205,205,210,0.5)':'rgba(48,48,52,0.5)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,2,2); } for(let n=0;n<5;n++){ const ox=WALL+Math.random()*(W-WALL*2),oy=WALL+Math.random()*(H-WALL*2); g.fillStyle='rgba(0,0,0,0.06)'; for(let b=0;b<44;b++){ g.fillRect(ox+(Math.random()-0.5)*24,oy+(Math.random()-0.5)*24,2,2); } } g.strokeStyle='rgba(0,0,0,0.30)'; g.lineWidth=1; for(let n=0;n<12;n++){ let x=WALL+Math.random()*(W-WALL*2),y=WALL+Math.random()*(H-WALL*2); g.beginPath(); g.moveTo(x,y); for(let st=0;st<5;st++){ x+=(Math.random()-0.5)*16;y+=(Math.random()-0.5)*16;g.lineTo(x,y);} g.stroke(); } },
        preview(g,w,h){ g.fillStyle='#6f7276';g.fillRect(0,0,w,h); for(let n=0;n<40;n++){g.fillStyle=Math.random()>0.5?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.15)';g.fillRect(Math.random()*w|0,Math.random()*h|0,1,1);} g.strokeStyle='rgba(240,220,120,0.7)';g.strokeRect(2,2,w-4,h-4);} },

      beach:{ name:'BEACH', surround:'#232620', stand:'#343128', tier:'rgba(255,255,255,0.05)',
        frame:'#b98a52',frameHi:'#d6a86a',frameLo:'#8f6636',post:'#fff6e2',
        line:'rgba(120,90,50,0.5)',line2:'rgba(120,90,50,0.4)',
        netRecess:'#7a5a34',netBack:'rgba(0,0,0,0.3)',netMesh:'rgba(255,250,235,0.34)',netMouth:'rgba(255,255,255,0.25)',
        netStrand:'rgba(255,250,235,0.6)',netOverlay:'rgba(60,40,20,0.4)',
        surface(g){ g.fillStyle='#e3c98f'; g.fillRect(0,0,W,H); for(let n=0;n<1600;n++){ const v=Math.random(); g.fillStyle=v>0.55?'rgba(255,245,215,0.5)':v>0.3?'rgba(180,150,100,0.35)':'rgba(210,180,130,0.4)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1); } g.strokeStyle='rgba(200,170,120,0.4)'; g.lineWidth=1; for(let y=WALL+8;y<H-WALL;y+=9){ g.beginPath(); for(let x=WALL;x<W-WALL;x+=3){ g.lineTo(x,y+Math.sin(x*0.25)*1.4+Math.sin(x*0.08)*1.0);} g.stroke(); } g.fillStyle='rgba(150,120,80,0.10)'; for(let n=0;n<320;n++){ g.fillRect(WALL+Math.random()*(W-WALL*2)|0,(H*0.5+(Math.random()-0.5)*H*0.32)|0,2,1); } const sh=['rgba(255,255,255,0.7)','rgba(240,200,190,0.7)','rgba(220,220,240,0.7)']; for(let n=0;n<10;n++){ g.fillStyle=sh[n%3]; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,2,2); } },
        preview(g,w,h){ g.fillStyle='#e3c98f';g.fillRect(0,0,w,h); for(let n=0;n<40;n++){g.fillStyle=Math.random()>0.5?'rgba(255,245,215,0.6)':'rgba(180,150,100,0.4)';g.fillRect(Math.random()*w|0,Math.random()*h|0,1,1);} g.strokeStyle='rgba(120,90,50,0.6)';g.strokeRect(2,2,w-4,h-4);} },

      neon:{ name:'NEON', surround:'#0a0810', stand:'#150f1e', tier:'rgba(80,255,255,0.06)',
        frame:'#12142a',frameHi:'#2ff3ff',frameLo:'#0a0b18',post:'#2ff3ff',
        line:'rgba(90,240,255,0.8)',line2:'rgba(255,90,220,0.6)',
        netRecess:'#0a0c1a',netBack:'rgba(0,0,0,0.5)',netMesh:'rgba(90,240,255,0.35)',netMouth:'rgba(120,255,255,0.35)',
        netStrand:'rgba(120,255,255,0.6)',netOverlay:'rgba(6,8,20,0.55)',
        surface(g){ g.fillStyle='#0a0b16'; g.fillRect(0,0,W,H); g.strokeStyle='rgba(80,255,255,0.12)'; g.lineWidth=1; for(let x=WALL;x<=W-WALL;x+=12){ g.beginPath(); g.moveTo(x+0.5,WALL); g.lineTo(x+0.5,H-WALL); g.stroke(); } for(let y=WALL;y<=H-WALL;y+=12){ g.beginPath(); g.moveTo(WALL,y+0.5); g.lineTo(W-WALL,y+0.5); g.stroke(); } for(let x=WALL;x<=W-WALL;x+=24){ for(let y=WALL;y<=H-WALL;y+=24){ if(Math.random()<0.3){ g.fillStyle=Math.random()>0.5?'rgba(90,240,255,0.5)':'rgba(255,90,220,0.45)'; g.fillRect(x-1,y-1,3,3); } } } for(let n=0;n<120;n++){ g.fillStyle=Math.random()>0.5?'rgba(90,240,255,0.25)':'rgba(255,90,220,0.2)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1); } },
        preview(g,w,h){ g.fillStyle='#0a0b16';g.fillRect(0,0,w,h); g.strokeStyle='rgba(90,240,255,0.5)'; for(let x=0;x<w;x+=6){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();} g.strokeStyle='rgba(255,90,220,0.7)';g.strokeRect(2,2,w-4,h-4);} },

      ice:{ name:'ICE', surround:'#141d23', stand:'#26333e', tier:'rgba(255,255,255,0.06)',
        frame:'#dfe9f2',frameHi:'#ffffff',frameLo:'#b7c6d4',post:'#c9202f',
        line:'rgba(90,140,200,0.65)',line2:'rgba(200,60,70,0.5)',
        netRecess:'#c2d4e2',netBack:'rgba(120,150,180,0.4)',netMesh:'rgba(150,175,200,0.4)',netMouth:'rgba(255,255,255,0.45)',
        netStrand:'rgba(120,150,190,0.6)',netOverlay:'rgba(180,200,220,0.4)',
        surface(g){ g.fillStyle='#dce9f2'; g.fillRect(0,0,W,H); for(let n=0;n<900;n++){ g.fillStyle=Math.random()>0.5?'rgba(255,255,255,0.5)':'rgba(150,180,210,0.25)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1); } g.fillStyle='rgba(255,255,255,0.10)'; for(let n=0;n<6;n++){ const fx=WALL+Math.random()*(W-WALL*2),fy=WALL+Math.random()*(H-WALL*2); for(let b=0;b<54;b++){ g.fillRect(fx+(Math.random()-0.5)*28,fy+(Math.random()-0.5)*28,2,2); } } g.strokeStyle='rgba(255,255,255,0.55)'; g.lineWidth=1; for(let n=0;n<5;n++){ const cx=WALL+Math.random()*(W-WALL*2),cy=WALL+Math.random()*(H-WALL*2),arms=3+(Math.random()*3|0); for(let a=0;a<arms;a++){ let ang=Math.random()*Math.PI*2,x=cx,y=cy; g.beginPath(); g.moveTo(x,y); for(let st=0;st<4;st++){ ang+=(Math.random()-0.5)*0.6; const len=4+Math.random()*8; x+=Math.cos(ang)*len; y+=Math.sin(ang)*len; g.lineTo(x,y);} g.stroke(); } } for(let n=0;n<12;n++){ let x=WALL+Math.random()*(W-WALL*2),y=WALL+Math.random()*(H-WALL*2),a=Math.random()*Math.PI,len=6+Math.random()*16; g.beginPath(); g.moveTo(x,y); g.lineTo(x+Math.cos(a)*len,y+Math.sin(a)*len); g.stroke(); } },
        preview(g,w,h){ g.fillStyle='#dce9f2';g.fillRect(0,0,w,h); g.strokeStyle='rgba(200,60,70,0.6)';g.beginPath();g.moveTo(0,h/2);g.lineTo(w,h/2);g.stroke(); g.strokeStyle='rgba(90,140,200,0.6)';g.strokeRect(2,2,w-4,h-4);} },

      cobble:{ name:'COBBLE', surround:'#2b241b', stand:'#3d3327', tier:'rgba(255,240,210,0.05)', frame:'#9a8f78',frameHi:'#c2b596',frameLo:'#6a6050',post:'#fff6e6', line:'rgba(90,78,58,0.62)',line2:'rgba(90,78,58,0.46)', netRecess:'#3a3f48',netBack:'rgba(0,0,0,0.35)',netMesh:'rgba(240,238,230,0.3)',netMouth:'rgba(255,255,255,0.22)',netStrand:'rgba(240,238,230,0.6)',netOverlay:'rgba(20,22,28,0.5)', surface(g){ g.fillStyle='#ddd3bf'; g.fillRect(0,0,W,H); var cs=6; var lt=['#e2dac9','#dacfba','#e6dfd0','#d4c9b3']; for(var y=WALL;y<H-WALL;y+=cs){ for(var x=WALL;x<W-WALL;x+=cs){ var wv=Math.sin(x*0.13+y*0.085); var dark = wv>0.74; g.fillStyle= dark ? (Math.random()>0.5?'#c6bba1':'#beb298') : lt[Math.floor(Math.random()*4)]; g.fillRect(x,y,cs-1,cs-1); } } g.fillStyle='rgba(120,110,90,0.16)'; for(var yy=WALL;yy<H-WALL;yy+=cs){ g.fillRect(WALL,yy,W-WALL*2,1);} for(var xx=WALL;xx<W-WALL;xx+=cs){ g.fillRect(xx,WALL,1,H-WALL*2);} grain(g,260,'rgba(150,140,120,0.08)','rgba(255,250,240,0.10)'); }, preview(g,w,h){ g.fillStyle='#ddd3bf'; g.fillRect(0,0,w,h); g.fillStyle='#c6bba1'; for(var y=0;y<h;y+=4){ for(var x=0;x<w;x+=4){ if(Math.sin(x*0.4+y*0.3)>0.55) g.fillRect(x,y,3,3);} } g.strokeStyle='rgba(120,110,90,0.5)'; g.strokeRect(2,2,w-4,h-4); } },

      clay:{ name:'CLAY', surround:'#42291d', stand:'#553626', tier:'rgba(255,220,180,0.05)', frame:'#b5642f',frameHi:'#d68a4a',frameLo:'#7d3f1c',post:'#fff0d8', line:'rgba(255,240,215,0.78)',line2:'rgba(255,240,215,0.6)', netRecess:'#5a3320',netBack:'rgba(0,0,0,0.3)',netMesh:'rgba(255,245,225,0.32)',netMouth:'rgba(255,255,255,0.24)',netStrand:'rgba(255,245,225,0.6)',netOverlay:'rgba(60,30,15,0.42)', surface(g){ g.fillStyle='#c2632f'; g.fillRect(0,0,W,H); for(var n=0;n<1500;n++){ var v=Math.random(); g.fillStyle=v>0.6?'rgba(230,150,90,0.4)':v>0.3?'rgba(140,66,30,0.35)':'rgba(200,110,60,0.4)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1);} g.strokeStyle='rgba(150,74,36,0.28)'; g.lineWidth=1; for(var y=WALL+6;y<H-WALL;y+=7){ g.beginPath(); for(var x=WALL;x<W-WALL;x+=3){ g.lineTo(x,y+Math.sin(x*0.12)*1.2);} g.stroke(); } g.fillStyle='rgba(90,44,20,0.12)'; for(var m=0;m<6;m++){ var ox=WALL+Math.random()*(W-WALL*2),oy=WALL+Math.random()*(H-WALL*2); for(var b=0;b<40;b++){ g.fillRect(ox+(Math.random()-0.5)*22,oy+(Math.random()-0.5)*22,2,2);} } }, preview(g,w,h){ g.fillStyle='#c2632f'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(150,74,36,0.5)'; for(var y=3;y<h;y+=5){ g.beginPath(); g.moveTo(0,y); g.lineTo(w,y); g.stroke(); } g.strokeStyle='rgba(255,240,215,0.7)'; g.strokeRect(2,2,w-4,h-4); } },

      turf:{ name:'TURF', surround:'#12151b', stand:'#22292f', tier:'rgba(255,255,255,0.05)', frame:'#1b3a5c',frameHi:'#2f5f8f',frameLo:'#0e2036',post:'#ffffff', line:'rgba(255,255,255,0.82)',line2:'rgba(255,255,255,0.65)', netRecess:'#0c1a12',netBack:'rgba(0,0,0,0.4)',netMesh:'rgba(255,255,255,0.32)',netMouth:'rgba(255,255,255,0.24)',netStrand:'rgba(255,255,255,0.6)',netOverlay:'rgba(8,20,14,0.5)', surface(g){ g.fillStyle='#1f9e52'; g.fillRect(0,0,W,H); var cols=10,cw=(W-WALL*2)/cols; for(var i=0;i<cols;i++){ var cx=Math.round(WALL+i*cw); g.fillStyle=i%2?'#1c9149':'#25ab5b'; g.fillRect(cx,WALL,Math.ceil(cw)+1,H-WALL*2);} for(var n=0;n<900;n++){ g.fillStyle=Math.random()>0.5?'rgba(0,0,0,0.22)':'rgba(255,255,255,0.06)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1);} for(var f=0;f<600;f++){ g.fillStyle='rgba(120,220,150,0.12)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1+(Math.random()*2|0));} }, preview(g,w,h){ for(var i=0;i<8;i++){ g.fillStyle=i%2?'#1c9149':'#25ab5b'; g.fillRect(i*w/8,0,w/8+1,h);} g.strokeStyle='rgba(255,255,255,0.8)'; g.strokeRect(2,2,w-4,h-4); } },

      stone:{ name:'STONE', surround:'#24231c', stand:'#363023', tier:'rgba(255,255,255,0.05)', frame:'#c9b89a',frameHi:'#e6d8bd',frameLo:'#9a8768',post:'#fff8ec', line:'rgba(70,60,50,0.55)',line2:'rgba(70,60,50,0.42)', netRecess:'#6a5a44',netBack:'rgba(0,0,0,0.3)',netMesh:'rgba(245,240,228,0.3)',netMouth:'rgba(255,255,255,0.22)',netStrand:'rgba(245,240,228,0.6)',netOverlay:'rgba(30,26,20,0.45)', surface(g){ g.fillStyle='#d8cdb4'; g.fillRect(0,0,W,H); g.strokeStyle='rgba(120,105,80,0.5)'; g.lineWidth=1; var rows2=10,rh=(H-WALL*2)/rows2; for(var r=0;r<rows2;r++){ var y0=WALL+r*rh,off=(r%2)*9; g.beginPath(); g.moveTo(WALL,Math.round(y0)+0.5); g.lineTo(W-WALL,Math.round(y0)+0.5); g.stroke(); for(var sx=WALL+off;sx<W-WALL;sx+=18){ g.beginPath(); g.moveTo(Math.round(sx)+0.5,y0); g.lineTo(Math.round(sx)+0.5,y0+rh); g.stroke(); } } for(var n=0;n<800;n++){ g.fillStyle=Math.random()>0.5?'rgba(255,250,235,0.22)':'rgba(150,135,105,0.28)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1);} var by=Math.round(H/2)-3; for(var cxk=WALL;cxk<W-WALL;cxk+=6){ g.fillStyle=((((cxk-WALL)/6)|0)%2)?'rgba(200,40,50,0.20)':'rgba(255,255,255,0.18)'; g.fillRect(cxk,by,6,6);} }, preview(g,w,h){ g.fillStyle='#d8cdb4'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(120,105,80,0.6)'; for(var y=0;y<h;y+=5){ g.beginPath(); g.moveTo(0,y); g.lineTo(w,y); g.stroke(); } for(var cxk=0;cxk<w;cxk+=5){ g.fillStyle=(((cxk/5)|0)%2)?'rgba(200,40,50,0.5)':'rgba(255,255,255,0.5)'; g.fillRect(cxk,h/2-2,5,4);} g.strokeStyle='rgba(70,60,50,0.6)'; g.strokeRect(2,2,w-4,h-4); } },

      savanna:{ name:'SAVANNA', surround:'#2e1b0d', stand:'#422a16', tier:'rgba(255,220,180,0.05)', frame:'#8a5a2c',frameHi:'#b07a3c',frameLo:'#5a3818',post:'#fff0d8', line:'rgba(255,245,225,0.75)',line2:'rgba(255,245,225,0.6)', netRecess:'#5a3820',netBack:'rgba(0,0,0,0.3)',netMesh:'rgba(255,245,225,0.32)',netMouth:'rgba(255,255,255,0.24)',netStrand:'rgba(255,245,225,0.6)',netOverlay:'rgba(50,28,12,0.42)', surface(g){ g.fillStyle='#b5673a'; g.fillRect(0,0,W,H); for(var n=0;n<1500;n++){ var v=Math.random(); g.fillStyle=v>0.6?'rgba(210,140,80,0.4)':v>0.3?'rgba(120,64,30,0.32)':'rgba(180,100,55,0.4)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1);} g.strokeStyle='rgba(90,50,24,0.26)'; g.lineWidth=1; for(var m=0;m<9;m++){ var cx=WALL+Math.random()*(W-WALL*2),cy=WALL+Math.random()*(H-WALL*2); g.beginPath(); g.moveTo(cx,cy); for(var st=0;st<4;st++){ cx+=(Math.random()-0.5)*20;cy+=(Math.random()-0.5)*20;g.lineTo(cx,cy);} g.stroke(); } g.fillStyle='rgba(150,135,60,0.45)'; for(var t2=0;t2<80;t2++){ var gx=WALL+Math.random()*(W-WALL*2)|0, gy=WALL+Math.random()*(H-WALL*2)|0; g.fillRect(gx,gy-2,1,2); } }, preview(g,w,h){ g.fillStyle='#b5673a'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(90,50,24,0.4)'; for(var i=0;i<4;i++){ g.beginPath(); g.moveTo(Math.random()*w,Math.random()*h); g.lineTo(Math.random()*w,Math.random()*h); g.stroke(); } g.strokeStyle='rgba(255,245,225,0.7)'; g.strokeRect(2,2,w-4,h-4); } },

      aquarium:{ name:'AQUARIUM', surround:'#03111e', stand:'#082033', tier:'rgba(120,220,255,0.06)',
        frame:'#0e4a63',frameHi:'#2aa8c8',frameLo:'#052430',post:'#e2fbff',
        line:'rgba(226,251,255,0.7)',line2:'rgba(226,251,255,0.5)',
        netRecess:'#052430',netBack:'rgba(0,0,0,0.4)',netMesh:'rgba(170,238,255,0.32)',netMouth:'rgba(215,255,255,0.28)',
        netStrand:'rgba(195,244,255,0.6)',netOverlay:'rgba(3,20,30,0.5)',
        surface(g){
          // deep-sea seen straight down through the crystal pitch
          var sg=g.createLinearGradient(0,WALL,0,H-WALL);
          sg.addColorStop(0,'#0c4864'); sg.addColorStop(0.5,'#0a5273'); sg.addColorStop(1,'#062c40');
          g.fillStyle=sg; g.fillRect(0,0,W,H);
          // brighter column of surface light down the pitch centre
          var cg=g.createLinearGradient(W*0.32,0,W*0.68,0);
          cg.addColorStop(0,'rgba(120,220,255,0)'); cg.addColorStop(0.5,'rgba(140,235,255,0.12)'); cg.addColorStop(1,'rgba(120,220,255,0)');
          g.fillStyle=cg; g.fillRect(WALL,WALL,W-WALL*2,H-WALL*2);
          // sea-floor sand glow behind each goal
          for(var s=0;s<2;s++){ var gy=s?H-WALL:WALL, dir=s?-1:1; var fg=g.createLinearGradient(0,gy,0,gy+dir*46); fg.addColorStop(0,'rgba(214,196,140,0.30)'); fg.addColorStop(1,'rgba(214,196,140,0)'); g.fillStyle=fg; g.fillRect(WALL,s?H-WALL-46:WALL,W-WALL*2,46); }
          // scattered sea-floor pebbles / sand fleck
          for(var n=0;n<520;n++){ var v=Math.random(); g.fillStyle=v>0.55?'rgba(180,235,255,0.10)':v>0.3?'rgba(6,34,50,0.35)':'rgba(90,190,220,0.12)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1); }
          // coral / rock clusters silhouetted in the corners
          function coral(cx,cy,c1,c2){ for(var b=0;b<26;b++){ var a=Math.random()*6.283,rr=Math.random()*7; g.fillStyle=Math.random()>0.5?c1:c2; g.fillRect((cx+Math.cos(a)*rr)|0,(cy+Math.sin(a)*rr)|0,2,2); } }
          coral(WALL+14,H*0.5-24,'rgba(224,110,150,0.5)','rgba(180,70,120,0.45)');
          coral(W-WALL-14,H*0.5+24,'rgba(120,200,170,0.5)','rgba(80,160,140,0.45)');
          coral(WALL+18,H-WALL-30,'rgba(230,160,90,0.5)','rgba(190,120,60,0.45)');
          coral(W-WALL-16,WALL+30,'rgba(160,140,220,0.5)','rgba(120,100,190,0.45)');
          // faint crystal panel grid — the glass tiles of the pitch
          g.strokeStyle='rgba(200,245,255,0.10)'; g.lineWidth=1;
          for(var gx=WALL;gx<=W-WALL;gx+=Math.round((W-WALL*2)/6)){ g.beginPath(); g.moveTo(gx+0.5,WALL); g.lineTo(gx+0.5,H-WALL); g.stroke(); }
          for(var gyy=WALL;gyy<=H-WALL;gyy+=Math.round((H-WALL*2)/9)){ g.beginPath(); g.moveTo(WALL,gyy+0.5); g.lineTo(W-WALL,gyy+0.5); g.stroke(); }
        },
        preview(g,w,h){ var sg=g.createLinearGradient(0,0,0,h); sg.addColorStop(0,'#0c4864'); sg.addColorStop(1,'#062c40'); g.fillStyle=sg; g.fillRect(0,0,w,h); g.fillStyle='#e0a85a'; g.fillRect(w*0.55,h*0.4,3,2); g.fillStyle='#ff7a3a'; g.fillRect(w*0.55+3,h*0.4,1,2); g.fillStyle='#4ac8ff'; g.fillRect(w*0.25,h*0.62,3,2); g.strokeStyle='rgba(226,251,255,0.7)'; g.strokeRect(2,2,w-4,h-4); } },

      storm:{ name:'STORM', surround:'#0e141b', stand:'#1a2632', tier:'rgba(180,200,220,0.05)',
        frame:'#3a4652',frameHi:'#5a6b7a',frameLo:'#1c2530',post:'#e6eef5',
        line:'rgba(220,232,245,0.72)',line2:'rgba(220,232,245,0.5)',
        netRecess:'#141c24',netBack:'rgba(0,0,0,0.45)',netMesh:'rgba(200,215,230,0.3)',netMouth:'rgba(230,240,250,0.25)',netStrand:'rgba(210,225,240,0.6)',netOverlay:'rgba(8,14,20,0.5)',
        surface(g){ g.fillStyle='#1f3a2a'; g.fillRect(0,0,W,H); var bands=13,bh=(H-WALL*2)/bands; for(var i=0;i<bands;i++){ var by=Math.round(WALL+i*bh); g.fillStyle=i%2?'#1d3527':'#254230'; g.fillRect(WALL,by,W-WALL*2,Math.ceil(bh)+1); }
          for(var n=0;n<900;n++){ g.fillStyle=Math.random()>0.5?'rgba(150,180,200,0.10)':'rgba(10,20,16,0.25)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1); }
          for(var p=0;p<7;p++){ var px=WALL+20+Math.random()*(W-WALL*2-40), py=WALL+20+Math.random()*(H-WALL*2-40), rw=6+Math.random()*10; var rg=g.createRadialGradient(px,py,1,px,py,rw); rg.addColorStop(0,'rgba(150,185,210,0.30)'); rg.addColorStop(1,'rgba(150,185,210,0)'); g.fillStyle=rg; g.beginPath(); g.ellipse(px,py,rw,rw*0.5,0,0,6.283); g.fill(); }
          g.strokeStyle='rgba(180,200,220,0.07)'; g.lineWidth=1; for(var r=0;r<60;r++){ var x=WALL+Math.random()*(W-WALL*2), y=WALL+Math.random()*(H-WALL*2); g.beginPath(); g.moveTo(x,y); g.lineTo(x-3,y+8); g.stroke(); } },
        preview(g,w,h){ g.fillStyle='#254230'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(180,200,220,0.5)'; g.lineWidth=1; for(var r=0;r<16;r++){ var x=Math.random()*w,y=Math.random()*h; g.beginPath(); g.moveTo(x,y); g.lineTo(x-2,y+5); g.stroke(); } g.strokeStyle='rgba(220,232,245,0.7)'; g.strokeRect(2,2,w-4,h-4); } },

      candy:{ name:'CANDY', surround:'#3a1f3a', stand:'#5a2f52', tier:'rgba(255,220,240,0.06)',
        frame:'#e06aa0',frameHi:'#ff9ac8',frameLo:'#b0407a',post:'#fff0f8',
        line:'rgba(255,255,255,0.85)',line2:'rgba(255,255,255,0.62)',
        netRecess:'#7a3a64',netBack:'rgba(0,0,0,0.3)',netMesh:'rgba(255,240,250,0.34)',netMouth:'rgba(255,255,255,0.25)',netStrand:'rgba(255,240,250,0.6)',netOverlay:'rgba(80,30,60,0.4)',
        surface(g){ var cols=['#ffd8ec','#d6f2e6','#fff2d0','#e2dcff']; var bands=10,bh=(H-WALL*2)/bands; g.fillStyle=cols[0]; g.fillRect(0,0,W,H); for(var i=0;i<bands;i++){ var by=Math.round(WALL+i*bh); g.fillStyle=cols[i%4]; g.fillRect(WALL,by,W-WALL*2,Math.ceil(bh)+1); }
          var sp=['#ff5a8a','#5ad0ff','#ffc21e','#5ae08a','#c86aff','#ffffff']; for(var n=0;n<240;n++){ var x=WALL+Math.random()*(W-WALL*2), y=WALL+Math.random()*(H-WALL*2), a=Math.random()*3.14; g.save(); g.translate(x,y); g.rotate(a); g.fillStyle=sp[n%6]; g.fillRect(-2,-0.7,4,1.4); g.restore(); } },
        preview(g,w,h){ var cols=['#ffd8ec','#d6f2e6','#fff2d0','#e2dcff']; for(var i=0;i<6;i++){ g.fillStyle=cols[i%4]; g.fillRect(0,i*h/6,w,h/6+1); } var sp=['#ff5a8a','#5ad0ff','#ffc21e','#5ae08a']; for(var n=0;n<24;n++){ g.fillStyle=sp[n%4]; g.fillRect(Math.random()*w|0,Math.random()*h|0,2,1); } g.strokeStyle='rgba(255,90,150,0.7)'; g.strokeRect(2,2,w-4,h-4); } },

      casino:{ name:'CASINO', surround:'#2a0a10', stand:'#4a1420', tier:'rgba(255,215,120,0.06)',
        frame:'#8a6a2a',frameHi:'#d6b054',frameLo:'#5a4418',post:'#ffe9a8',
        line:'rgba(255,235,170,0.8)',line2:'rgba(255,235,170,0.58)',
        netRecess:'#123a20',netBack:'rgba(0,0,0,0.4)',netMesh:'rgba(255,235,170,0.3)',netMouth:'rgba(255,245,200,0.25)',netStrand:'rgba(255,235,170,0.55)',netOverlay:'rgba(10,30,18,0.5)',
        surface(g){ g.fillStyle='#0f6b3a'; g.fillRect(0,0,W,H); for(var n=0;n<1400;n++){ g.fillStyle=Math.random()>0.5?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.06)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1); }
          var cx=W/2, cy=H/2; g.strokeStyle='rgba(255,235,170,0.32)'; g.lineWidth=1; for(var rr=14;rr<=30;rr+=8){ g.beginPath(); g.arc(cx,cy,rr,0,6.283); g.stroke(); } for(var s=0;s<12;s++){ var a=s/12*6.283; g.beginPath(); g.moveTo(cx+Math.cos(a)*14,cy+Math.sin(a)*14); g.lineTo(cx+Math.cos(a)*30,cy+Math.sin(a)*30); g.stroke(); g.fillStyle=(s%2)?'rgba(200,40,50,0.30)':'rgba(20,20,24,0.34)'; g.beginPath(); g.arc(cx+Math.cos(a+0.26)*24,cy+Math.sin(a+0.26)*24,2.4,0,6.283); g.fill(); }
          },
        preview(g,w,h){ g.fillStyle='#0f6b3a'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(255,235,170,0.6)'; g.beginPath(); g.arc(w/2,h/2,h*0.16,0,6.283); g.stroke(); g.beginPath(); g.arc(w/2,h/2,h*0.10,0,6.283); g.stroke(); g.fillStyle='#c83a4a'; g.beginPath(); g.arc(w*0.3,h*0.7,3,0,6.283); g.fill(); g.strokeStyle='rgba(255,235,170,0.7)'; g.strokeRect(2,2,w-4,h-4); } },

      space:{ name:'SPACE', surround:'#05060f', stand:'#0c1020', tier:'rgba(120,200,255,0.05)',
        frame:'#3a4a63',frameHi:'#5aa8d6',frameLo:'#1a2436',post:'#dff2ff',
        line:'rgba(150,220,255,0.7)',line2:'rgba(150,220,255,0.5)',
        netRecess:'#0a1120',netBack:'rgba(0,0,0,0.5)',netMesh:'rgba(140,210,255,0.3)',netMouth:'rgba(180,230,255,0.28)',netStrand:'rgba(150,215,255,0.6)',netOverlay:'rgba(4,8,18,0.55)',
        surface(g){ g.fillStyle='#141a2c'; g.fillRect(0,0,W,H);
          g.strokeStyle='rgba(90,140,190,0.18)'; g.lineWidth=1; var ps=Math.round((W-WALL*2)/5); for(var x=WALL;x<=W-WALL;x+=ps){ g.beginPath(); g.moveTo(x+0.5,WALL); g.lineTo(x+0.5,H-WALL); g.stroke(); } var pv=Math.round((H-WALL*2)/8); for(var y=WALL;y<=H-WALL;y+=pv){ g.beginPath(); g.moveTo(WALL,y+0.5); g.lineTo(W-WALL,y+0.5); g.stroke(); }
          g.fillStyle='rgba(150,190,230,0.22)'; for(var yy=WALL;yy<=H-WALL;yy+=pv){ for(var xx=WALL;xx<=W-WALL;xx+=ps){ g.fillRect(xx-1,yy-1,2,2); } }
          var plates=[[0.3,0.3,'58,106,208'],[0.7,0.45,'208,74,90'],[0.4,0.65,'208,74,90'],[0.65,0.75,'58,106,208'],[0.5,0.5,'58,106,208']];
          for(var pI=0;pI<plates.length;pI++){ var pl=plates[pI], cx=WALL+pl[0]*(W-WALL*2), cy=WALL+pl[1]*(H-WALL*2); var rg=g.createRadialGradient(cx,cy,2,cx,cy,15); rg.addColorStop(0,'rgba('+pl[2]+',0.32)'); rg.addColorStop(1,'rgba('+pl[2]+',0)'); g.fillStyle=rg; g.fillRect(cx-15,cy-15,30,30); g.strokeStyle='rgba('+pl[2]+',0.4)'; g.strokeRect(cx-9,cy-9,18,18); } },
        preview(g,w,h){ g.fillStyle='#141a2c'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(90,140,190,0.4)'; for(var x=0;x<w;x+=6){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();} g.fillStyle='#3a6ad0'; g.fillRect(w*0.3,h*0.35,4,4); g.fillStyle='#d04a5a'; g.fillRect(w*0.6,h*0.6,4,4); g.strokeStyle='rgba(150,220,255,0.7)'; g.strokeRect(2,2,w-4,h-4); } },

      skate:{ name:'SKATE', surround:'#1a1a1e', stand:'#2a2a30', tier:'rgba(255,255,255,0.04)',
        frame:'#7a7d82',frameHi:'#a6a9ae',frameLo:'#4a4d52',post:'#ffe24a',
        line:'rgba(255,226,74,0.75)',line2:'rgba(255,255,255,0.55)',
        netRecess:'#1c1c20',netBack:'rgba(0,0,0,0.4)',netMesh:'rgba(220,220,225,0.3)',netMouth:'rgba(255,255,255,0.22)',netStrand:'rgba(225,225,230,0.6)',netOverlay:'rgba(14,14,18,0.5)',
        surface(g){ g.fillStyle='#6a6d72'; g.fillRect(0,0,W,H);
          for(var n=0;n<1500;n++){ var v=Math.random(); g.fillStyle=v>0.6?'rgba(255,255,255,0.05)':v>0.3?'rgba(0,0,0,0.09)':'rgba(90,92,96,0.5)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1); }
          var qg=g.createLinearGradient(0,WALL,0,WALL+40); qg.addColorStop(0,'rgba(0,0,0,0.28)'); qg.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=qg; g.fillRect(WALL,WALL,W-WALL*2,40); var qg2=g.createLinearGradient(0,H-WALL,0,H-WALL-40); qg2.addColorStop(0,'rgba(0,0,0,0.28)'); qg2.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=qg2; g.fillRect(WALL,H-WALL-40,W-WALL*2,40);
          var gc=['#e0433a','#3a8de0','#f2c23a','#3aa050','#e0559a']; for(var s=0;s<5;s++){ var gx=WALL+Math.random()*(W-WALL*2), gy=WALL+Math.random()*(H-WALL*2); g.globalAlpha=0.14; g.fillStyle=gc[s%5]; for(var b=0;b<26;b++){ g.fillRect(gx+(Math.random()-0.5)*22,gy+(Math.random()-0.5)*22,2,2); } g.globalAlpha=1; }
          g.strokeStyle='rgba(255,226,74,0.25)'; g.lineWidth=2; for(var r=0;r<3;r++){ var ry=WALL+(H-WALL*2)*(0.3+r*0.2); g.beginPath(); g.moveTo(WALL+10,ry); g.lineTo(W-WALL-10,ry); g.stroke(); } },
        preview(g,w,h){ g.fillStyle='#6a6d72'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(255,226,74,0.5)'; g.lineWidth=2; g.beginPath(); g.moveTo(4,h*0.4); g.lineTo(w-4,h*0.4); g.stroke(); g.fillStyle='rgba(224,67,58,0.4)'; g.fillRect(w*0.6,h*0.6,6,6); g.strokeStyle='rgba(255,226,74,0.7)'; g.strokeRect(2,2,w-4,h-4); } },

      jungle:{ name:'JUNGLE', surround:'#0d1a0d', stand:'#16281a', tier:'rgba(180,255,180,0.05)',
        frame:'#6a5a2a',frameHi:'#9a8038',frameLo:'#3a3016',post:'#ffe9a8',
        line:'rgba(240,235,200,0.7)',line2:'rgba(240,235,200,0.5)',
        netRecess:'#2a3a1a',netBack:'rgba(0,0,0,0.4)',netMesh:'rgba(230,240,200,0.3)',netMouth:'rgba(245,250,220,0.25)',netStrand:'rgba(230,240,200,0.55)',netOverlay:'rgba(10,20,10,0.5)',
        surface(g){ g.fillStyle='#3a4a34'; g.fillRect(0,0,W,H);
          var cs=Math.round((W-WALL*2)/6); var slab=['#3f5238','#455a3c','#384a32','#4a6040']; for(var y=WALL;y<H-WALL;y+=cs){ for(var x=WALL;x<W-WALL;x+=cs){ g.fillStyle=slab[Math.floor(Math.random()*4)]; g.fillRect(x,y,cs-1,cs-1); } }
          g.strokeStyle='rgba(20,30,18,0.5)'; g.lineWidth=1; for(var yy=WALL;yy<H-WALL;yy+=cs){ g.beginPath(); g.moveTo(WALL,yy+0.5); g.lineTo(W-WALL,yy+0.5); g.stroke(); } for(var xx=WALL;xx<W-WALL;xx+=cs){ g.beginPath(); g.moveTo(xx+0.5,WALL); g.lineTo(xx+0.5,H-WALL); g.stroke(); }
          for(var n=0;n<700;n++){ g.fillStyle=Math.random()>0.5?'rgba(120,180,90,0.18)':'rgba(30,50,25,0.3)'; g.fillRect(WALL+Math.random()*(W-WALL*2)|0,WALL+Math.random()*(H-WALL*2)|0,1,1); }
          g.strokeStyle='rgba(60,120,50,0.4)'; g.lineWidth=2; for(var vv=0;vv<5;vv++){ var vx=WALL+Math.random()*(W-WALL*2), vy=WALL; g.beginPath(); g.moveTo(vx,vy); for(var st=0;st<8;st++){ vx+=(Math.random()-0.5)*16; vy+=(H-WALL*2)/8; g.lineTo(vx,vy);} g.stroke(); }
          g.strokeStyle='rgba(230,200,90,0.4)'; g.lineWidth=1; g.strokeRect(W/2-10,H/2-10,20,20); g.beginPath(); g.arc(W/2,H/2,6,0,6.283); g.stroke(); },
        preview(g,w,h){ g.fillStyle='#3f5238'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(60,120,50,0.5)'; g.lineWidth=1; for(var v=0;v<3;v++){ var x=Math.random()*w; g.beginPath(); g.moveTo(x,0); g.lineTo(x+(Math.random()-0.5)*8,h); g.stroke(); } g.strokeStyle='rgba(240,235,200,0.7)'; g.strokeRect(2,2,w-4,h-4); } }
    };
    let boardKey='wood', board=BOARDS[boardKey];
    const AMBIENCE={ wood:'desk', grass:'stadium', street:'urban', beach:'beach', neon:'cyber', ice:'winter', cobble:'lisbon', clay:'fiesta', turf:'arena', stone:'coast', savanna:'safari', aquarium:'aquarium', storm:'storm', candy:'candy', casino:'casino', space:'space', skate:'skate', jungle:'jungle' };
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
      try{ if(typeof _ballTracks!=='undefined'&&_ballTracks) _ballTracks.length=0; }catch(e){}
      try{ if(typeof gumballs!=='undefined'&&gumballs) gumballs.length=0; if(typeof candyPatches!=='undefined'&&candyPatches) candyPatches.length=0; if(typeof gumSpots!=='undefined'&&gumSpots) gumSpots.length=0; }catch(e){}
      try{ if(typeof dice!=='undefined'&&dice) dice.length=0; if(typeof numBoxes!=='undefined'&&numBoxes) numBoxes.length=0; rouletteCap=null; rouletteShot=false; rouletteBox=null; if(typeof ROUL_BASE!=='undefined') rouletteAng=ROUL_BASE; if(typeof beachBalls!=='undefined'&&beachBalls) beachBalls.length=0; if(typeof beachCrabs!=='undefined'&&beachCrabs) beachCrabs.length=0; }catch(e){}
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

