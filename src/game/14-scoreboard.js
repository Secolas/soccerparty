    // ================= SCOREBOARD =================
    const sb=el('ns_scorebug'), sctx=sb.getContext('2d');
    const SB_W=200,SB_H=62;
    sb.width=SB_W; sb.height=SB_H;
    function sizeSB(){ sb.style.width=(SB_W*SCALE*0.62)+'px'; sb.style.height=(SB_H*SCALE*0.62)+'px'; }
    sizeSB(); sctx.imageSmoothingEnabled=false;
    const SEG={0:[1,1,1,1,1,1,0],1:[0,1,1,0,0,0,0],2:[1,1,0,1,1,0,1],3:[1,1,1,1,0,0,1],4:[0,1,1,0,0,1,1],5:[1,0,1,1,0,1,1],6:[1,0,1,1,1,1,1],7:[1,1,1,0,0,0,0],8:[1,1,1,1,1,1,1],9:[1,1,1,1,0,1,1]};
    function drawDigit(g,x,y,d,on,off){ const w=10,h=17,t=2,s=SEG[d]||SEG[0]; const seg=(i,rx,ry,rw,rh)=>{ g.fillStyle=s[i]?on:off; g.fillRect(x+rx,y+ry,rw,rh); }; seg(0,t,0,w-2*t,t); seg(1,w-t,t,t,(h-3*t)/2+t); seg(2,w-t,h/2,t,(h-3*t)/2+t); seg(3,t,h-t,w-2*t,t); seg(4,0,h/2,t,(h-3*t)/2+t); seg(5,0,t,t,(h-3*t)/2+t); seg(6,t,(h-t)/2,w-2*t,t); }
    function mmss(){ let s; if(matchLen>0){ s=Math.max(0,Math.ceil((matchLen*1000-matchMs)/1000)); } else { s=Math.floor(matchMs/1000); } return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); }
    function drawScoreboard(){
      sctx.fillStyle='#0e1f14'; sctx.fillRect(0,0,SB_W,SB_H);
      sctx.fillStyle='#16351f'; sctx.fillRect(2,2,SB_W-4,SB_H-4);
      sctx.fillStyle='#0a1a10'; sctx.fillRect(5,5,SB_W-10,SB_H-10);
      sctx.fillStyle='#caa23c'; sctx.fillRect(2,2,SB_W-4,2); sctx.fillRect(2,SB_H-4,SB_W-4,2); sctx.fillRect(2,2,2,SB_H-4); sctx.fillRect(SB_W-4,2,2,SB_H-4);
      // clock
      sctx.font="8px 'Press Start 2P', monospace"; sctx.textAlign='center'; sctx.textBaseline='top';
      sctx.fillStyle='#e8b84a'; sctx.fillText(mmss(),SB_W/2,8);
      // flags + abbr
      function flag(x,side){ sctx.save(); sctx.beginPath(); sctx.rect(x,24,22,14); sctx.clip(); paintPattern(sctx,x,24,22,14,teamKits[side].kit); sctx.restore(); sctx.strokeStyle='rgba(0,0,0,0.5)'; sctx.lineWidth=1; sctx.strokeRect(x+0.5,24.5,22,14); }
      flag(10,'red'); flag(SB_W-32,'blue');
      const activeR=current==='red'&&!winner&&phase==='play', activeB=current==='blue'&&!winner&&phase==='play';
      sctx.font="7px 'Press Start 2P', monospace"; sctx.textBaseline='top';
      sctx.fillStyle=activeR?'#e05a4a':'#9a8478'; sctx.fillText(teamKits.red.abbr,21,42);
      sctx.fillStyle=activeB?'#5a8de0':'#7a889a'; sctx.fillText(teamKits.blue.abbr,SB_W-21,42);
      // score digits
      const on='#a9c94b',off='rgba(120,140,60,0.10)';
      drawDigit(sctx,SB_W/2-24,26,Math.min(9,score.red),on,off);
      drawDigit(sctx,SB_W/2+14,26,Math.min(9,score.blue),on,off);
      sctx.fillStyle='#caa23c'; sctx.fillRect(SB_W/2-1,30,2,2); sctx.fillRect(SB_W/2-1,38,2,2);
      // turn dot
      if(!winner&&phase==='play'){ sctx.fillStyle=activeR?'#e05a4a':'#5a8de0'; const dx=activeR?27:SB_W-27; sctx.fillRect(dx-1,SB_H-11,3,3); }
    }

