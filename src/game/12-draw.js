    // ================= DRAW =================
    function drawCrowd(now){
      // ---- themed surround (each pitch has its own scenery zone) ----
      const at=ambType();
      function fillBands(c){ ctx.fillStyle=c; ctx.fillRect(0,0,CW,OY); ctx.fillRect(0,OY+H,CW,CH-(OY+H)); ctx.fillRect(0,OY,OX,H); ctx.fillRect(OX+W,OY,CW-(OX+W),H); }
      ctx.fillStyle=board.surround; ctx.fillRect(0,0,CW,CH);
      if(at==='stadium'){
        fillBands(board.stand);
        ctx.fillStyle=board.tier;
        for(let y=6;y<OY;y+=8) ctx.fillRect(0,y,CW,1);
        for(let y=OY+H+6;y<CH;y+=8) ctx.fillRect(0,y,CW,1);
      } else if(at==='beach'){
        fillBands('#e6cd94');
        // dune speckle
        ctx.fillStyle='rgba(255,246,214,0.5)'; for(let i=0;i<70;i++){ const rx=Math.random()*CW,ry=Math.random()*CH; if(rx>OX&&rx<OX+W&&ry>OY&&ry<OY+H) continue; ctx.fillRect(rx|0,ry|0,1,1); }
        // sea along the very outer ring with rolling waves
        const sea='#2f8fc4', foam='rgba(232,246,255,0.85)';
        ctx.fillStyle=sea; ctx.fillRect(0,0,CW,4); ctx.fillRect(0,CH-4,CW,4); ctx.fillRect(0,0,3,CH); ctx.fillRect(CW-3,0,3,CH);
        ctx.fillStyle=foam; for(let x=0;x<CW;x+=6){ const w=Math.round(Math.sin(now*0.006+x*0.3)); ctx.fillRect(x,3+w,3,1); ctx.fillRect(x+3,CH-4+w,3,1); }
      } else if(at==='winter'){
        fillBands('#cfe2ef');
        ctx.fillStyle='rgba(255,255,255,0.6)'; for(let i=0;i<40;i++){ const rx=Math.random()*CW,ry=Math.random()*CH; if(rx>OX&&rx<OX+W&&ry>OY&&ry<OY+H) continue; ctx.fillRect(rx|0,ry|0,1,1); }
        // faint skate lines on the ice
        ctx.strokeStyle='rgba(160,190,215,0.5)'; ctx.lineWidth=1;
        for(let i=0;i<5;i++){ const yy=6+i*6; ctx.beginPath(); ctx.moveTo(4,yy); ctx.bezierCurveTo(CW*0.3,yy-3,CW*0.6,yy+3,CW-4,yy); ctx.stroke(); }
      } else if(at==='urban'){
        fillBands('#34373c');
        // sidewalk strip next to the pitch
        ctx.fillStyle='#5f6469'; ctx.fillRect(0,OY-4,CW,4); ctx.fillRect(0,OY+H,CW,4); ctx.fillRect(OX-4,OY,4,H); ctx.fillRect(OX+W,OY,4,H);
        // lane dashes on the top & bottom roads
        ctx.fillStyle='#e0c33a'; for(let x=4;x<CW;x+=12){ ctx.fillRect(x,Math.round(OY*0.5),6,1); ctx.fillRect(x,Math.round(CH-OY*0.5),6,1); }
      } else if(at==='desk'){
        // nature: grass verge with texture
        fillBands('#3c6b34');
        ctx.fillStyle='rgba(90,150,70,0.6)'; for(let i=0;i<90;i++){ const rx=Math.random()*CW,ry=Math.random()*CH; if(rx>OX&&rx<OX+W&&ry>OY&&ry<OY+H) continue; ctx.fillRect(rx|0,ry|0,1,1); }
        ctx.fillStyle='rgba(40,80,34,0.5)'; for(let i=0;i<40;i++){ const rx=Math.random()*CW,ry=Math.random()*CH; if(rx>OX&&rx<OX+W&&ry>OY&&ry<OY+H) continue; ctx.fillRect(rx|0,ry|0,1,2); }
      } else if(at==='cyber'){
        fillBands('#0a0c18');
        // neon edge glow around the pitch
        ctx.fillStyle='rgba(47,243,255,0.5)'; ctx.fillRect(OX-2,OY-2,W+4,1); ctx.fillRect(OX-2,OY+H+1,W+4,1);
        ctx.fillStyle='rgba(255,90,220,0.5)'; ctx.fillRect(OX-2,OY-2,1,H+4); ctx.fillRect(OX+W+1,OY-2,1,H+4);
      } else if(at==='aquarium'){
        // the whole arena sits inside a giant sea tank — deep water all around
        fillBands('#062c40');
        const dg=ctx.createLinearGradient(0,0,0,CH); dg.addColorStop(0,'rgba(4,20,32,0.55)'); dg.addColorStop(0.5,'rgba(10,70,100,0)'); dg.addColorStop(1,'rgba(4,20,32,0.55)');
        ctx.fillStyle=dg; ctx.fillRect(0,0,CW,OY); ctx.fillRect(0,OY+H,CW,CH-(OY+H)); ctx.fillStyle=dg; ctx.fillRect(0,OY,OX,H); ctx.fillRect(OX+W,OY,CW-(OX+W),H);
        // glowing glass tank edge around the pitch
        ctx.fillStyle='rgba(120,225,255,0.4)'; ctx.fillRect(OX-2,OY-2,W+4,1); ctx.fillRect(OX-2,OY+H+1,W+4,1); ctx.fillRect(OX-2,OY-2,1,H+4); ctx.fillRect(OX+W+1,OY-2,1,H+4);
      } else if(at==='space'){
        fillBands('#0a0e1a');
        for(let i=0;i<90;i++){ const hx=Math.sin(i*12.9)*43758.5, sx=(hx-Math.floor(hx))*CW; const hy=Math.sin(i*78.2)*12345.6, sy=(hy-Math.floor(hy))*CH; if(sx>OX&&sx<OX+W&&sy>OY&&sy<OY+H) continue; const tw=0.35+0.65*Math.abs(Math.sin(now*0.003+i)); ctx.fillStyle='rgba(255,255,255,'+tw.toFixed(2)+')'; ctx.fillRect(sx|0,sy|0,1,1); }
      } else if(at==='jungle'){
        fillBands('#132414');
        for(let i=0;i<80;i++){ const hx=Math.sin(i*22.1)*9137.7, lx=(hx-Math.floor(hx))*CW; const hy=Math.sin(i*46.3)*5521.3, ly=(hy-Math.floor(hy))*CH; if(lx>OX&&lx<OX+W&&ly>OY&&ly<OY+H) continue; ctx.fillStyle=(i%2)?'rgba(40,90,40,0.6)':'rgba(70,120,55,0.5)'; ctx.fillRect(lx|0,ly|0,2,1); }
      } else if(at==='skate'){
        fillBands('#242428');
      } else {
        fillBands(board.stand);
      }
      // people (fans / beachgoers / skaters-crowd / dancers) — nature & aquarium pitches stay creature-only
      const showFans = at!=='desk' && at!=='aquarium';
      const glow = at==='cyber';
      if(showFans && at!=='stadium' && at!=='arena') for(const p of crowd){
        if(p.hop>0||p.hv!==0){ p.hop+=p.hv; p.hv-=0.4; if(p.hop<=0){p.hop=0;p.hv=0;} }
        if(banner>0&&p.hop===0&&Math.random()<0.05){ p.hv=(p.celebHi?3.6:2.2); }
        const sway=Math.sin(now*0.004+p.phase)*(glow?1.1:0.6);
        const y=p.y-p.hop+sway;
        if(glow){ ctx.fillStyle='rgba(120,90,255,0.35)'; ctx.fillRect(Math.round(p.x-2),Math.round(y-2),5,6); }
        ctx.fillStyle=p.shirt; ctx.fillRect(Math.round(p.x-1),Math.round(y-1),3,4);
        ctx.fillStyle=p.skin; ctx.fillRect(Math.round(p.x-1),Math.round(y-4),2,2);
        // handheld waving flag (stadium ultras only)
        if(p.flag&&at==='stadium'){
          const wv=Math.sin(now*0.012+p.phase)*1.2;
          const fx=Math.round(p.x+1), fy=Math.round(y-7);
          ctx.fillStyle='rgba(60,45,30,0.9)'; ctx.fillRect(fx,fy,1,5);              // pole
          ctx.fillStyle=p.flagCol; ctx.fillRect(fx+1,Math.round(fy+wv),3,2);        // cloth
        }
      }
      // per-pitch scenery (beach umbrellas/birds, snow, drones, etc.)
      drawAmbient(now);
      // giant tifo banners — official stadium only
      if(ambType()==='stadium'){
        drawTifo('blue', OX+W/2, OY*0.52, now);
        drawTifo('red',  OX+W/2, OY+H+(CH-(OY+H))*0.48, now);
      }
      // camera flashes + roar during celebration
      if(banner>0){
        for(let i=0;i<7;i++){ const p=crowd[Math.floor(Math.random()*crowd.length)]; if(!p) continue; ctx.fillStyle='rgba(255,255,255,0.95)'; ctx.fillRect(Math.round(p.x),Math.round(p.y-2),1,1); }
      }
    }

    function drawFireworks(){
      for(const r of rockets){
        if(r.delay>0){ r.delay--; continue; }
        r.y+=r.vy;
        ctx.fillStyle=r.color; ctx.fillRect(Math.round(r.x),Math.round(r.y),1,2);
        ctx.fillStyle='rgba(255,240,190,0.4)'; ctx.fillRect(Math.round(r.x),Math.round(r.y+2),1,2);
        if(r.y<=r.targetY){ explode(r.x,r.y,r.color); r.dead=true; }
      }
      rockets=rockets.filter(r=>!r.dead);
      for(const s of sparks){ s.x+=s.vx; s.y+=s.vy; s.vy+=0.06; s.life--; const a=Math.max(0,s.life/26); ctx.globalAlpha=Math.min(1,a); ctx.fillStyle=s.color; ctx.fillRect(Math.round(s.x),Math.round(s.y),1,1); }
      ctx.globalAlpha=1;
      sparks=sparks.filter(s=>s.life>0);
    }

    // velocity stretch (elongate along motion) + impact squash (flatten along
    // travel for a few frames after a hard hit). Scales space around the ball
    // centre so the detailed coin art below is untouched. Returns true if a
    // transform was pushed (caller restores).
    function ballDeform(cx,cy){
      var sp=(typeof moving!=='undefined'&&moving&&!scoring)?Math.hypot(coin.vx,coin.vy):0;
      var q=(coin&&coin.squish)?coin.squish:0, sx=1, sy=1, ang=Math.atan2(coin.vy||0,coin.vx||0.0001);
      if(sp>2){ var k=Math.min(0.32,(sp-2)*0.016); sx=1+k; sy=1-k*0.72; }
      if(q>0){ var qq=Math.min(0.34,q*0.055); sx=Math.min(sx,1-qq); sy=Math.max(sy,1+qq); }
      if(sx===1&&sy===1) return false;
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(ang); ctx.scale(sx,sy); ctx.rotate(-ang); ctx.translate(-cx,-cy); return true;
    }
    function drawBall(cx,cy){
      ctx.fillStyle='rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.arc(cx+1,cy+1.5,COIN_R,0,Math.PI*2); ctx.fill();
      var _bdf=false; try{ _bdf=ballDeform(cx,cy); }catch(e){}
      if(useBall){ ctx.beginPath(); ctx.arc(cx,cy,COIN_R,0,Math.PI*2); ctx.fillStyle='#fbfbf6'; ctx.fill(); ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,COIN_R,0,Math.PI*2); ctx.clip(); ctx.fillStyle='rgba(150,162,178,0.25)'; ctx.beginPath(); ctx.arc(cx+1.2,cy+2.0,COIN_R,0,Math.PI*2); ctx.fill(); var pr=COIN_R*0.34, rot=-Math.PI/2; ctx.fillStyle='#1b1b22'; ctx.beginPath(); for(var i=0;i<5;i++){ var a=rot+i*Math.PI*2/5,px=cx+Math.cos(a)*pr,py=cy+Math.sin(a)*pr; i?ctx.lineTo(px,py):ctx.moveTo(px,py);} ctx.closePath(); ctx.fill(); for(var j=0;j<5;j++){ var b=rot+(j+0.5)*Math.PI*2/5; ctx.beginPath(); ctx.arc(cx+Math.cos(b)*(COIN_R*0.82),cy+Math.sin(b)*(COIN_R*0.82),COIN_R*0.17,0,Math.PI*2); ctx.fill(); } ctx.restore(); ctx.lineWidth=1; ctx.strokeStyle='#a9a99f'; ctx.beginPath(); ctx.arc(cx,cy,COIN_R,0,Math.PI*2); ctx.stroke(); ctx.fillStyle='rgba(255,255,255,0.95)'; ctx.beginPath(); ctx.arc(cx-COIN_R*0.45,cy-COIN_R*0.5,COIN_R*0.24,0,Math.PI*2); ctx.fill(); } else {
        ctx.beginPath(); ctx.arc(cx,cy,COIN_R,0,Math.PI*2); var _cg=ctx.createRadialGradient(cx-COIN_R*0.4,cy-COIN_R*0.45,COIN_R*0.1,cx,cy,COIN_R*1.05); _cg.addColorStop(0,'#fff7e0'); _cg.addColorStop(0.5,COLORS.coin); _cg.addColorStop(1,COLORS.coinEdge); ctx.fillStyle=_cg; ctx.fill();
        ctx.lineWidth=1; ctx.strokeStyle=COLORS.coinEdge; ctx.stroke();
        ctx.fillStyle='rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc(cx-COIN_R*0.35,cy-COIN_R*0.4,Math.max(1,COIN_R*0.22),0,Math.PI*2); ctx.fill();
      }
      if(_bdf) ctx.restore();
    }

    // Scrolling perimeter ad-boards on the two side rails, lit in the CURRENT
    // team's kit colours and moving like a stadium LED banner — an ambient
    // "whose turn is it" indicator that flips teams when possession changes.
    var _tbFlagCache={};
    // one vertical (rotated 90°) flag tile per team, cached
    function _tbFlag(nm,w,h){
      var key=nm+'|v'+w+'x'+h, c=_tbFlagCache[key]; if(c) return c;
      var cv=document.createElement('canvas'); cv.width=w; cv.height=h; var g=cv.getContext('2d'); g.imageSmoothingEnabled=false;
      try{ g.save(); g.translate(w,0); g.rotate(Math.PI/2);   // render the flag landscape then rotate it upright on the rail
        if(typeof _paintFlag==='function') _paintFlag(g,0,0,h,w,nm); else if(typeof paintPattern==='function'&&teamKits[current]&&teamKits[current].kit) paintPattern(g,0,0,h,w,teamKits[current].kit);
        g.restore(); }catch(e){}
      _tbFlagCache[key]=cv; return cv;
    }
    function drawTurnBoards(now){
      if(phase!=='play') return;
      var tk=(typeof teamKits!=='undefined')?teamKits[current]:null; if(!tk) return;
      var fw=WALL, fh=20, gap=16, tile=fh+gap, img=_tbFlag(tk.name||'',fw,fh); if(!img) return;
      var rows=Math.ceil((H+tile)/tile)+1, base=(now||0);
      // rails scroll opposite directions at the same speed: left down, right up
      var rails=[{s:0,spd:0.012},{s:W-WALL,spd:-0.012}];
      rails.forEach(function(r){
        var s=r.s, off=(((base*r.spd)%tile)+tile)%tile;
        ctx.save(); ctx.beginPath(); ctx.rect(s,0,WALL,H); ctx.clip();
        ctx.fillStyle=(typeof board!=='undefined'&&board&&board.frame)?board.frame:'rgba(10,8,16,0.55)'; ctx.fillRect(s,0,WALL,H);   // gaps match the stadium frame colour
        ctx.imageSmoothingEnabled=false;
        for(var k=0;k<rows;k++){ var yy=(k*tile-tile)+off; ctx.drawImage(img,s,Math.round(yy),fw,fh); ctx.strokeStyle='rgba(0,0,0,0.45)'; ctx.lineWidth=1; ctx.strokeRect(s+0.5,Math.round(yy)+0.5,fw-1,fh-1); }
        ctx.fillStyle='rgba(255,255,255,0.10)'; ctx.fillRect(s,0,WALL,1);              // top sheen
        ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.fillRect(s,0,1,H); ctx.fillRect(s+WALL-1,0,1,H);  // rail edges
        ctx.restore();
      });
    }
    // ---- shared flick signal: one detection per frame, read by every pitch's FX ----
    // A "flick" = the ball launching from (near) rest. It drops a short-lived pulse at that
    // spot (for ripples / shockwaves / divots) and a longer spook timer (startled wildlife).
    var _flickPrevBsp=0, _flickPulse=null, _flickSpook=0;
    function updateFlickFX(){
      var bsp=0; try{ if(typeof coin!=='undefined'&&coin&&(typeof phase==='undefined'||phase==='play')) bsp=Math.hypot(coin.vx||0,coin.vy||0); }catch(e){}
      if(bsp>1.6 && _flickPrevBsp<0.8){ try{ _flickPulse={x:coin.x,y:coin.y,life:16,life0:16}; }catch(e){} _flickSpook=90; }
      _flickPrevBsp=bsp;
      if(_flickPulse){ _flickPulse.life--; if(_flickPulse.life<=0) _flickPulse=null; }
      if(_flickSpook>0) _flickSpook--;
    }

    // ---- ball-path trail: records the rolling ball's path, then fades it; each pitch styles it ----
    var _ballTracks=[];
    var TRAIL_STYLE={
      beach: {life:220, kind:'rut', rim:[255,247,220,0.13,1.85], rut:[122,92,52,0.34,1.05]},   // groove in sand
      clay:  {life:300, kind:'rut', rim:[176,96,54,0.16,0.7],   rut:[92,42,24,0.30,1.45]},      // skid mark on clay
      street:{life:210, kind:'rut', rim:[86,86,92,0.12,0.6],    rut:[16,16,20,0.30,1.35]},      // asphalt skid
      grass: {life:120, kind:'rut', rim:[188,232,150,0.10,1.6], rut:[24,70,30,0.20,0.9]},       // flattened grass
      ice:   {life:360, kind:'ice'},                                                            // skate scratches
      neon:  {life:80,  kind:'neon'}                                                            // glowing light-trail
    };
    function drawBallTrail(ctx,now){
      var st=TRAIL_STYLE[boardKey]; if(!st) return;
      try{ if(phase==='play' && typeof coin!=='undefined' && coin && typeof moving!=='undefined' && moving){
          var sp=Math.hypot(coin.vx||0,coin.vy||0);
          if(sp>0.4){ var lp=_ballTracks[_ballTracks.length-1];
            if(!lp || Math.hypot(coin.x-lp.x,coin.y-lp.y)>=3){ _ballTracks.push({x:coin.x,y:coin.y,life:st.life,life0:st.life}); if(_ballTracks.length>600) _ballTracks.shift(); } }
        } }catch(e){}
      for(var i=0;i<_ballTracks.length;i++) _ballTracks[i].life--;
      while(_ballTracks.length && _ballTracks[0].life<=0) _ballTracks.shift();
      if(_ballTracks.length<2) return;
      ctx.save(); ctx.lineCap='round'; ctx.lineJoin='round';
      function seg(cb){ for(var k=1;k<_ballTracks.length;k++){ var a=_ballTracks[k-1], b=_ballTracks[k]; if(Math.hypot(b.x-a.x,b.y-a.y)>45) continue; var lf=Math.min(a.life,b.life)/a.life0; if(lf<=0) continue; cb(a,b,lf); } }
      if(st.kind==='rut'){
        var rim=st.rim, rut=st.rut;
        seg(function(a,b,lf){ ctx.strokeStyle='rgba('+rim[0]+','+rim[1]+','+rim[2]+','+(rim[3]*lf).toFixed(3)+')'; ctx.lineWidth=COIN_R*rim[4]; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); });
        seg(function(a,b,lf){ ctx.strokeStyle='rgba('+rut[0]+','+rut[1]+','+rut[2]+','+(rut[3]*lf).toFixed(3)+')'; ctx.lineWidth=COIN_R*rut[4]; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); });
      } else if(st.kind==='ice'){
        // two carved blade grooves: a darker cut with a bright shaved-ice highlight beside it (reads on white ice)
        for(var o=-1;o<=1;o+=2){ (function(off){
          seg(function(a,b,lf){ var dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,px=-dy/d*1.7*off,py=dx/d*1.7*off; ctx.strokeStyle='rgba(96,128,168,'+(0.6*lf).toFixed(3)+')'; ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(a.x+px,a.y+py); ctx.lineTo(b.x+px,b.y+py); ctx.stroke(); });
          seg(function(a,b,lf){ var dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,px=-dy/d*(1.7*off-0.9),py=dx/d*(1.7*off-0.9); ctx.strokeStyle='rgba(255,255,255,'+(0.5*lf).toFixed(3)+')'; ctx.lineWidth=0.7; ctx.beginPath(); ctx.moveTo(a.x+px,a.y+py); ctx.lineTo(b.x+px,b.y+py); ctx.stroke(); });
        })(o); }
      } else if(st.kind==='neon'){
        ctx.globalCompositeOperation='lighter';
        seg(function(a,b,lf){ ctx.strokeStyle='rgba(90,240,255,'+(0.18*lf).toFixed(3)+')'; ctx.lineWidth=COIN_R*2.0; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); });
        seg(function(a,b,lf){ ctx.strokeStyle='rgba(205,255,255,'+(0.6*lf).toFixed(3)+')'; ctx.lineWidth=COIN_R*0.7; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); });
      }
      ctx.restore();
    }
    // grass divot: a puff of grass blades kicked up and settling at the flick spot
    function drawGrassDivot(ctx,now){ if(!_flickPulse) return; var p=_flickPulse, s=p.life/p.life0; ctx.save(); for(var i=0;i<10;i++){ var ang=i*0.63+p.x*0.017, dist=(1-s)*14+2, gx=p.x+Math.cos(ang)*dist, gy=p.y+Math.sin(ang)*dist-(1-s)*5; ctx.fillStyle=(i%2?'rgba(70,132,54,':'rgba(40,96,44,')+(s*0.7).toFixed(3)+')'; ctx.fillRect(gx|0,gy|0,1,2); } ctx.restore(); }
    // neon shockwave: a ring expanding from the flick spot lighting up grid nodes it crosses
    function drawNeonShock(ctx,now){ if(!_flickPulse) return; var p=_flickPulse, s=p.life/p.life0, rr=(1-s)*70+6; ctx.save(); ctx.globalCompositeOperation='lighter'; ctx.strokeStyle='rgba(120,255,255,'+(s*0.6).toFixed(3)+')'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(p.x,p.y,rr,0,6.283); ctx.stroke(); ctx.fillStyle='rgba(255,90,220,'+(s*0.5).toFixed(3)+')'; var g=12; for(var gx=Math.round((p.x-rr)/g)*g; gx<=p.x+rr; gx+=g){ for(var gy=Math.round((p.y-rr)/g)*g; gy<=p.y+rr; gy+=g){ if(Math.abs(Math.hypot(gx-p.x,gy-p.y)-rr)<7){ ctx.fillRect(gx-1,gy-1,3,3); } } } ctx.restore(); }
    // sticky gum blobs on the candy pitch (hard) — reverse the ball when it passes over
    function drawGum(ctx,now){ if(typeof gumSpots==='undefined') return; for(var i=0;i<gumSpots.length;i++){ var p=gumSpots[i], r=p.r, wob=1+0.08*Math.sin(now*0.006+i*2.1); ctx.save(); ctx.translate(p.x,p.y); ctx.strokeStyle='rgba(255,120,190,0.6)'; ctx.lineWidth=1.2; for(var s=0;s<4;s++){ var a=(s/4)*6.283+now*0.0016; ctx.beginPath(); ctx.moveTo(Math.cos(a)*r*0.7,Math.sin(a)*r*0.55); ctx.lineTo(Math.cos(a)*(r+3),Math.sin(a)*(r*0.8+2)); ctx.stroke(); } ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.ellipse(0,r*0.5,r,r*0.5,0,0,6.283); ctx.fill(); ctx.fillStyle='#ff5aa8'; ctx.beginPath(); ctx.ellipse(0,0,r*wob,r*0.82*wob,0,0,6.283); ctx.fill(); ctx.fillStyle='#ff8ec6'; ctx.beginPath(); ctx.ellipse(0,-1,r*0.58,r*0.48,0,0,6.283); ctx.fill(); ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.beginPath(); ctx.ellipse(-r*0.3,-r*0.3,r*0.22,r*0.14,0,0,6.283); ctx.fill(); ctx.restore(); } }
    function drawStormPuddles(ctx,now){ var pud=stormPuddles(); for(var i=0;i<pud.length;i++){ var p=pud[i]; var rg=ctx.createRadialGradient(p.x,p.y,1,p.x,p.y,p.r); rg.addColorStop(0,'rgba(120,160,195,0.34)'); rg.addColorStop(1,'rgba(120,160,195,0.05)'); ctx.fillStyle=rg; ctx.beginPath(); ctx.ellipse(p.x,p.y,p.r,p.r*0.55,0,0,6.283); ctx.fill(); ctx.strokeStyle='rgba(180,205,230,0.22)'; ctx.lineWidth=1; ctx.beginPath(); ctx.ellipse(p.x,p.y,p.r,p.r*0.55,0,0,6.283); ctx.stroke(); } }
    function drawCaramel(ctx,now){ var car=(typeof candyPatches!=='undefined')?candyPatches:[]; for(var i=0;i<car.length;i++){ var p=car[i]; ctx.save(); ctx.translate(p.x,p.y); ctx.fillStyle='rgba(178,108,40,0.82)'; ctx.beginPath(); ctx.ellipse(0,0,p.r,p.r*0.7,0,0,6.283); ctx.fill(); ctx.fillStyle='rgba(138,78,26,0.85)'; ctx.beginPath(); ctx.ellipse(0,1,p.r*0.7,p.r*0.5,0,0,6.283); ctx.fill(); ctx.fillStyle='rgba(255,220,160,0.5)'; ctx.beginPath(); ctx.ellipse(-p.r*0.3,-p.r*0.22,p.r*0.25,p.r*0.15,0,0,6.283); ctx.fill(); ctx.restore(); } }
    function drawGumballs(ctx,now){ for(var i=0;i<gumballs.length;i++){ var g=gumballs[i]; ctx.save(); ctx.translate(g.x,g.y); ctx.fillStyle=g.col; ctx.beginPath(); ctx.arc(0,0,g.r,0,6.283); ctx.fill(); ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(-g.r*0.35,-g.r*0.35,g.r*0.3,0,6.283); ctx.fill(); ctx.strokeStyle='rgba(0,0,0,0.15)'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(0,0,g.r,0,6.283); ctx.stroke(); ctx.restore(); } }
    // CASINO roulette wheel (spins; shows the winning number on a result)
    function drawRouletteWheel(ctx,now){ var cx=W/2,cy=H/2,R=ROUL_R, base=(typeof rouletteAng!=='undefined')?rouletteAng:((typeof ROUL_BASE!=='undefined')?ROUL_BASE:-2.0943951); var cols=['#c83a4a','#2a2a30','#d6b054','#3a6ad0','#3aa050','#c86ad0']; var flash=(typeof rouletteFlash!=='undefined')?rouletteFlash:0; var seg=Math.PI/3; ctx.save(); ctx.translate(cx,cy); ctx.rotate(base); for(var s=0;s<6;s++){ var a0=s*seg,a1=(s+1)*seg; ctx.fillStyle=cols[s]; ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,R,a0,a1); ctx.closePath(); ctx.fill(); if(flash>0&&(s+1)===rouletteLastN){ ctx.save(); ctx.globalAlpha=Math.min(0.85,flash/26); ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,R,a0,a1); ctx.closePath(); ctx.fill(); ctx.restore(); } ctx.strokeStyle='rgba(20,16,10,0.6)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(Math.cos(a0)*R,Math.sin(a0)*R); ctx.stroke(); } ctx.restore(); ctx.strokeStyle='rgba(255,235,170,0.9)'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(cx,cy,R,0,6.283); ctx.stroke(); var _fs=Math.max(11,Math.round(R*0.5)); ctx.font='bold '+_fs+'px monospace'; ctx.textAlign='center'; ctx.textBaseline='middle'; for(var s2=0;s2<6;s2++){ var phi=base+(s2+0.5)*seg, nx=cx+Math.cos(phi)*R*0.58, ny=cy+Math.sin(phi)*R*0.58, isW=(flash>0&&(s2+1)===rouletteLastN); ctx.save(); ctx.translate(nx,ny); ctx.rotate(phi+Math.PI/2); ctx.fillStyle='rgba(0,0,0,0.72)'; ctx.fillText(''+(s2+1),0.7,0.7); ctx.fillStyle=isW?'#fff8d0':'rgba(255,252,232,1)'; ctx.fillText(''+(s2+1),0,0); ctx.restore(); } ctx.fillStyle='#3a2f18'; ctx.beginPath(); ctx.arc(cx,cy,R*0.13,0,6.283); ctx.fill(); ctx.fillStyle='#ffe9a8'; ctx.beginPath(); ctx.arc(cx,cy,R*0.06,0,6.283); ctx.fill(); if(flash>0){ ctx.save(); ctx.globalAlpha=Math.min(1,flash/22); ctx.font='bold 16px monospace'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.strokeStyle='rgba(0,0,0,0.75)'; ctx.lineWidth=3; ctx.strokeText(''+rouletteLastN,cx,cy-R-14); ctx.fillStyle='#fff'; ctx.fillText(''+rouletteLastN,cx,cy-R-14); ctx.restore(); } }
    function drawDice(ctx,now){ if(typeof dice==='undefined') return; for(var i=0;i<dice.length;i++){ var d=dice[i], s=d.sz; ctx.save(); ctx.translate(d.x,d.y); if(d.tumble>0){ var tb=d.tumble/12; ctx.rotate(Math.sin(d.tumble*0.9)*0.55*tb); var _sc=1+0.22*tb; ctx.scale(_sc,_sc); } ctx.fillStyle='rgba(0,0,0,0.28)'; ctx.fillRect(-s+1.5,-s+2,s*2,s*2); ctx.fillStyle='#f7f2e8'; ctx.fillRect(-s,-s,s*2,s*2); ctx.strokeStyle='#3a3030'; ctx.lineWidth=1.2; ctx.strokeRect(-s,-s,s*2,s*2); ctx.fillStyle='#20202a'; var o=s*0.5, P=({1:[[0,0]],2:[[-o,-o],[o,o]],3:[[-o,-o],[0,0],[o,o]],4:[[-o,-o],[o,-o],[-o,o],[o,o]],5:[[-o,-o],[o,-o],[0,0],[-o,o],[o,o]],6:[[-o,-o],[o,-o],[-o,0],[o,0],[-o,o],[o,o]]})[d.face]||[[0,0]]; for(var k=0;k<P.length;k++){ ctx.beginPath(); ctx.arc(P[k][0],P[k][1],1.7,0,6.283); ctx.fill(); } ctx.restore(); } }
    function drawNumBoxes(ctx,now){ if(typeof numBoxes==='undefined'||!numBoxes.length) return; var flash=(typeof rouletteFlash!=='undefined')?rouletteFlash:0, win=(typeof rouletteBox!=='undefined')?rouletteBox:null; ctx.save(); var _capA=(typeof rouletteCap!=='undefined'&&rouletteCap); if(_capA) _numTblF=1; else _numTblF=Math.max(0.3,_numTblF-0.035); ctx.globalAlpha=_numTblF; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.font='bold 24px monospace'; for(var i=0;i<numBoxes.length;i++){ var b=numBoxes[i], x=b.x-b.w/2, y=b.y-b.h/2, isW=(win===b&&flash>0); ctx.fillStyle='rgba(128,26,34,0.45)'; ctx.fillRect(x,y,b.w,b.h); if(isW){ var _fa=Math.min(0.92,0.5+flash/26*0.55); ctx.save(); ctx.fillStyle='rgba(255,222,74,'+_fa.toFixed(3)+')'; ctx.fillRect(x,y,b.w,b.h); ctx.strokeStyle='#fff6c0'; ctx.lineWidth=3.5; ctx.strokeRect(x+2,y+2,b.w-4,b.h-4); ctx.restore(); } ctx.strokeStyle='rgba(255,232,150,0.5)'; ctx.lineWidth=1; ctx.strokeRect(x,y,b.w,b.h); if(b.n>0){ ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillText(''+b.n,b.x+0.8,b.y+0.8); ctx.fillStyle=isW?'#2a1e00':'rgba(255,250,235,0.92)'; ctx.fillText(''+b.n,b.x,b.y); } } ctx.restore(); }
    function drawBeachHaz(ctx,now){ var t=(typeof hzTier==='function')?hzTier():1; if(typeof beachWaveT!=='undefined'){ beachWaveT+=1.4; var per=200, wp=(beachWaveT%per)/per, wy=NET_DEPTH+wp*(H-2*NET_DEPTH); ctx.save(); var fg=ctx.createLinearGradient(0,wy-16,0,wy+2); fg.addColorStop(0,'rgba(150,220,255,0)'); fg.addColorStop(1,'rgba(180,235,255,0.20)'); ctx.fillStyle=fg; ctx.fillRect(WALL,wy-16,W-WALL*2,18); ctx.strokeStyle='rgba(235,250,255,0.6)'; ctx.lineWidth=2; ctx.beginPath(); for(var x=WALL;x<=W-WALL;x+=6){ var yy=wy+Math.sin((x*0.06)+now*0.01)*3; if(x===WALL)ctx.moveTo(x,yy); else ctx.lineTo(x,yy); } ctx.stroke(); ctx.restore(); } if(typeof beachCrabs!=='undefined'){ if(t>=1&&beachCrabs.length===0){ var cn=[0,1,2][t], CY=[0.6,0.4]; for(var i=0;i<cn;i++) beachCrabs.push({x:WALL+40+i*70,y:WALL+CY[i]*(H-WALL*2),dir:(i%2?-1:1),sp:1.0}); } for(var ci=0;ci<beachCrabs.length;ci++){ var cr=beachCrabs[ci]; cr.x+=cr.dir*cr.sp; if(cr.x>W-WALL-14){cr.dir=-1;} if(cr.x<WALL+14){cr.dir=1;} ctx.save(); ctx.translate(cr.x,cr.y); ctx.strokeStyle='#c9551f'; ctx.lineWidth=1.5; for(var lg=0;lg<3;lg++){ ctx.beginPath(); ctx.moveTo(-4,-1+lg*2); ctx.lineTo(-10,-3+lg*3); ctx.moveTo(4,-1+lg*2); ctx.lineTo(10,-3+lg*3); ctx.stroke(); } ctx.fillStyle='#e0632a'; ctx.beginPath(); ctx.ellipse(0,0,7,5,0,0,6.283); ctx.fill(); ctx.beginPath(); ctx.arc(-8,-3,2.6,0,6.283); ctx.arc(8,-3,2.6,0,6.283); ctx.fill(); ctx.fillStyle='#fff'; ctx.fillRect(-3.5,-6,2,3); ctx.fillRect(1.5,-6,2,3); ctx.fillStyle='#111'; ctx.fillRect(-3,-5,1,2); ctx.fillRect(2,-5,1,2); ctx.restore(); } } if(typeof beachBalls!=='undefined'){ for(var bi=0;bi<beachBalls.length;bi++){ var b=beachBalls[bi]; ctx.save(); ctx.translate(b.x,b.y); ctx.fillStyle='rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.ellipse(0,b.r*0.75,b.r,b.r*0.4,0,0,6.283); ctx.fill(); var cols=['#ff5a5a','#ffd23a','#3aa0ff','#ffffff']; for(var w=0;w<4;w++){ ctx.fillStyle=cols[w]; ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,b.r,w/4*6.283,(w+1)/4*6.283); ctx.closePath(); ctx.fill(); } ctx.strokeStyle='rgba(0,0,0,0.2)'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(0,0,b.r,0,6.283); ctx.stroke(); ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(-b.r*0.32,-b.r*0.32,b.r*0.26,0,6.283); ctx.fill(); ctx.restore(); } } }
    function drawAqHazards(ctx,now){ if(typeof aqWhirl==='function'){ var ws=aqWhirl(); for(var wi=0;wi<ws.length;wi++){ var w=ws[wi]; ctx.save(); ctx.translate(w.x,w.y); ctx.globalAlpha=0.6; var g=ctx.createRadialGradient(0,0,3,0,0,w.r*0.7); g.addColorStop(0,'rgba(20,60,90,0.55)'); g.addColorStop(1,'rgba(20,60,90,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,w.r*0.7,0,6.283); ctx.fill(); ctx.rotate(now*0.004); ctx.strokeStyle='rgba(130,205,240,0.7)'; ctx.lineWidth=2; ctx.lineCap='round'; for(var a=0;a<2;a++){ ctx.beginPath(); var base=a*Math.PI; for(var s=0;s<=1.001;s+=0.1){ var rr=w.r*0.6*s, th=base+s*5.4, x=Math.cos(th)*rr, y=Math.sin(th)*rr; if(s===0)ctx.moveTo(x,y); else ctx.lineTo(x,y);} ctx.stroke(); } ctx.globalAlpha=1; ctx.fillStyle='rgba(10,40,64,0.7)'; ctx.beginPath(); ctx.arc(0,0,4.5,0,6.283); ctx.fill(); ctx.restore(); } } if(typeof aqBubbles==='function'){ var bj=aqBubbles(); for(var i=0;i<bj.length;i++){ var b=bj[i]; ctx.save(); ctx.globalCompositeOperation='lighter'; for(var k=0;k<6;k++){ var ph=(now*0.05+k*40+i*17)%60, by=b.y-ph*0.62, bx=b.x+Math.sin((now*0.01)+k+i)*3, br=1.4+(k%2); ctx.fillStyle='rgba(185,232,255,'+(0.4*(1-ph/60)).toFixed(3)+')'; ctx.beginPath(); ctx.arc(bx,by,br,0,6.283); ctx.fill(); } ctx.restore(); ctx.strokeStyle='rgba(150,210,255,0.3)'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(b.x,b.y,6,0,6.283); ctx.stroke(); } } }
    function drawSpacePlates(ctx,now){ if(typeof spacePlates!=='function') return; var pl=spacePlates(); for(var i=0;i<pl.length;i++){ var p=pl[i], pu=0.5+0.5*Math.sin(now*0.004+i*1.3), R=13; ctx.save(); ctx.translate(p.x,p.y); var g=ctx.createRadialGradient(0,0,2,0,0,R+9); g.addColorStop(0,'rgba(120,170,255,'+(0.32+pu*0.30).toFixed(3)+')'); g.addColorStop(1,'rgba(120,170,255,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,R+9,0,6.283); ctx.fill(); ctx.fillStyle='rgba(50,80,140,0.55)'; ctx.beginPath(); ctx.arc(0,0,R,0,6.283); ctx.fill(); ctx.strokeStyle='rgba(150,200,255,0.9)'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(0,0,R,0,6.283); ctx.stroke(); for(var k=0;k<3;k++){ ctx.globalAlpha=0.5-k*0.13; ctx.beginPath(); ctx.arc(0,0,R*0.6-k*3,0,6.283); ctx.stroke(); } ctx.restore(); } }
    function _skPath(ctx,pp){ ctx.beginPath(); ctx.moveTo(pp[0].x,pp[0].y); for(var q=1;q<pp.length;q++) ctx.lineTo(pp[q].x,pp[q].y); }
    function _skBar(ctx,w,h){ var rx=w/2, ry=h/2, r=Math.min(ry,5); ctx.beginPath(); ctx.moveTo(-rx+r,-ry); ctx.lineTo(rx-r,-ry); ctx.quadraticCurveTo(rx,-ry,rx,-ry+r); ctx.lineTo(rx,ry-r); ctx.quadraticCurveTo(rx,ry,rx-r,ry); ctx.lineTo(-rx+r,ry); ctx.quadraticCurveTo(-rx,ry,-rx,ry-r); ctx.lineTo(-rx,-ry+r); ctx.quadraticCurveTo(-rx,-ry,-rx+r,-ry); ctx.closePath(); }
    // skate side walls replace the flag frame (WALL-width): concrete half-pipe transition
    function drawSkateFrame(now){ for(var side=0;side<2;side++){ var lft=(side===0), x=lft?0:(W-WALL); ctx.save(); ctx.beginPath(); ctx.rect(x,0,WALL,H); ctx.clip(); ctx.fillStyle='#3a3a42'; ctx.fillRect(x,0,WALL,H); var g=ctx.createLinearGradient(lft?0:W,0,lft?WALL:(W-WALL),0); g.addColorStop(0,'rgba(0,0,0,0.5)'); g.addColorStop(0.55,'rgba(120,124,134,0.12)'); g.addColorStop(1,'rgba(255,255,255,0.24)'); ctx.fillStyle=g; ctx.fillRect(x,0,WALL,H); ctx.strokeStyle='rgba(255,255,255,0.10)'; ctx.lineWidth=1; for(var c=1;c<=2;c++){ var lx=lft?(WALL*c/3):(W-WALL*c/3); ctx.beginPath(); ctx.moveTo(lx,0); ctx.lineTo(lx,H); ctx.stroke(); } ctx.fillStyle='rgba(255,246,220,0.7)'; ctx.fillRect(lft?(WALL-1.5):(W-WALL),0,1.5,H); ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(lft?0:(W-1),0,1,H); ctx.restore(); } }
    // GROUND layer: dash kicker humps sit on the pitch under the ball (hard only)
    function drawSkateTracks(ctx,now){ if(typeof skateBumpList==='undefined') return; var _st=(typeof hzTier==='function')?hzTier():0; if(_st<2) return; var _bls=(typeof skateBumps==='function')?skateBumps():skateBumpList; for(var b=0;b<_bls.length;b++){ var p=_bls[b]; ctx.save(); ctx.translate(p.x,p.y); var w=p.w,h=p.h; ctx.strokeStyle='rgba(0,0,0,0.20)'; ctx.lineWidth=2; _skBar(ctx,w,h); ctx.stroke(); var g2=ctx.createLinearGradient(0,-h,0,h); g2.addColorStop(0,'rgba(255,255,255,0.26)'); g2.addColorStop(0.5,'rgba(255,255,255,0.05)'); g2.addColorStop(1,'rgba(0,0,0,0.18)'); ctx.fillStyle=g2; _skBar(ctx,w,h); ctx.fill(); ctx.fillStyle='rgba(255,255,255,0.24)'; _skBar(ctx,w*0.7,h*0.4); ctx.fill(); ctx.restore(); } }
    // OVER layer: the tracks are raised hills — drawn on top of tokens, nails and the
    // resting ball (which flicks below them); the ball only rides ON TOP while in a tube.
    function drawSkateHills(ctx,now){ if(typeof skateTrackPts==='undefined') return; if(typeof stadiumHazards==='function' && !stadiumHazards()) return; var _tks=(typeof skateTracks==='function')?skateTracks():skateTrackPts; for(var i=0;i<_tks.length;i++){ var pp=_tks[i].pts; if(!pp||pp.length<2) continue; ctx.save(); ctx.lineJoin='round'; ctx.lineCap='round'; ctx.save(); ctx.strokeStyle='rgba(0,0,0,0.20)'; ctx.lineWidth=3*COIN_R+5; ctx.beginPath(); for(var _si=0;_si<pp.length;_si++){ var _pr=_si/(pp.length-1), _off=1.5+4.5*Math.sin(_pr*Math.PI); if(_si===0) ctx.moveTo(pp[_si].x,pp[_si].y+_off); else ctx.lineTo(pp[_si].x,pp[_si].y+_off); } ctx.stroke(); ctx.restore(); _skPath(ctx,pp); ctx.strokeStyle='rgba(38,42,50,0.96)'; ctx.lineWidth=3*COIN_R+4; ctx.stroke(); _skPath(ctx,pp); ctx.strokeStyle='rgba(110,114,124,1)'; ctx.lineWidth=3*COIN_R; ctx.stroke(); _skPath(ctx,pp); ctx.strokeStyle='rgba(134,138,148,1)'; ctx.lineWidth=3*COIN_R-4; ctx.stroke(); _skPath(ctx,pp); ctx.strokeStyle='rgba(255,255,255,0.16)'; ctx.lineWidth=2; ctx.stroke(); _skPath(ctx,pp); ctx.setLineDash([5,7]); ctx.lineDashOffset=0; ctx.strokeStyle='rgba(255,220,120,0.7)'; ctx.lineWidth=1.5; ctx.stroke(); ctx.setLineDash([]); ctx.restore(); } var _onTrack=(typeof skateTube!=='undefined' && skateTube); if(!_onTrack && typeof coin!=='undefined'){ for(var _t=0;_t<_tks.length && !_onTrack;_t++){ var _tp3=_tks[_t].pts; if(!_tp3) continue; for(var _q3=0;_q3<_tp3.length-1;_q3++){ var _ax3=_tp3[_q3].x,_ay3=_tp3[_q3].y,_ex3=_tp3[_q3+1].x-_ax3,_ey3=_tp3[_q3+1].y-_ay3,_l3=(_ex3*_ex3+_ey3*_ey3)||1,_pr3=Math.max(0,Math.min(1,((coin.x-_ax3)*_ex3+(coin.y-_ay3)*_ey3)/_l3)),_px3=_ax3+_ex3*_pr3,_py3=_ay3+_ey3*_pr3; if(Math.hypot(coin.x-_px3,coin.y-_py3)<3*COIN_R){ _onTrack=true; break; } } } } if(_onTrack && typeof phase!=='undefined' && phase==='play' && typeof coin!=='undefined' && typeof drawBall==='function'){ try{ ctx.save(); ctx.globalAlpha=0.28; ctx.fillStyle='#000'; ctx.beginPath(); ctx.ellipse(coin.x,coin.y+COIN_R*0.9,COIN_R*0.9,COIN_R*0.45,0,0,Math.PI*2); ctx.fill(); ctx.restore(); drawBall(coin.x,coin.y); }catch(e){} } }
    function drawJungleVines(ctx,now){ if(typeof jungleVines!=='function') return; var vs=jungleVines(); for(var i=0;i<vs.length;i++){ var v=vs[i], sway=Math.sin(now*0.002+i*1.7)*6; ctx.save(); ctx.strokeStyle='rgba(60,120,50,0.9)'; ctx.lineWidth=2.5; ctx.beginPath(); ctx.moveTo(v.x-sway,WALL); ctx.quadraticCurveTo(v.x+sway,(WALL+v.y)/2,v.x,v.y); ctx.stroke(); ctx.fillStyle='rgba(70,150,60,0.95)'; ctx.beginPath(); ctx.arc(v.x,v.y,6,0,6.283); ctx.fill(); ctx.fillStyle='rgba(130,215,115,0.95)'; ctx.beginPath(); ctx.ellipse(v.x+5,v.y-2,5,2.6,0.6,0,6.283); ctx.fill(); ctx.beginPath(); ctx.ellipse(v.x-5,v.y+2,5,2.6,-0.6,0,6.283); ctx.fill(); ctx.restore(); } }
    function drawBoardFXGround(ctx,now){ if(boardKey==='aquarium'){ try{ drawAquariumFX(ctx,now); if(stadiumHazards()) drawAqHazards(ctx,now); }catch(e){} return; } if(boardKey==='casino'&&stadiumHazards()){ try{ drawNumBoxes(ctx,now); drawRouletteWheel(ctx,now); drawDice(ctx,now); }catch(e){} return; } if(boardKey==='storm'&&stadiumHazards()){ try{ drawStormPuddles(ctx,now); }catch(e){} return; } if(boardKey==='candy'&&stadiumHazards()){ try{ drawCaramel(ctx,now); drawGumballs(ctx,now); drawGum(ctx,now); }catch(e){} return; } if(boardKey==='space'&&stadiumHazards()){ try{ drawSpacePlates(ctx,now); }catch(e){} return; } if(boardKey==='skate'&&stadiumHazards()){ try{ drawSkateTracks(ctx,now); }catch(e){} return; } if(boardKey==='jungle'&&stadiumHazards()){ try{ drawJungleVines(ctx,now); }catch(e){} return; } if(boardKey==='beach'){ try{ drawBallTrail(ctx,now); if(stadiumHazards()) drawBeachHaz(ctx,now); }catch(e){} return; } if(boardKey==='clay'||boardKey==='ice'){ try{ drawBallTrail(ctx,now); }catch(e){} return; } if(boardKey==='street'){ try{ drawBallTrail(ctx,now); }catch(e){} drawStreetLights(ctx,now); return; } if(boardKey==='wood'){ ctx.save(); ctx.globalCompositeOperation='lighter'; const per=W+H+200,tt=(now*0.03)%per; const gx=-100+tt*(W+200)/per, gy=-100+tt*(H+200)/per, rad=Math.max(W,H)*0.6; const rg=ctx.createRadialGradient(gx,gy,10,gx,gy,rad); rg.addColorStop(0,'rgba(255,240,210,0.10)'); rg.addColorStop(0.5,'rgba(255,238,205,0.05)'); rg.addColorStop(1,'rgba(255,235,200,0)'); ctx.fillStyle=rg; ctx.fillRect(WALL,WALL,W-WALL*2,H-WALL*2); ctx.restore(); return; } if(boardKey==='grass'){ try{ drawBallTrail(ctx,now); drawGrassDivot(ctx,now); }catch(e){} ctx.save(); const clouds=[[0.011,0.05,0.16,34],[0.009,0.38,0.40,28],[0.013,0.66,0.28,40],[0.008,0.18,0.64,30],[0.012,0.82,0.72,26],[0.010,0.52,0.88,36]]; for(let ci=0;ci<clouds.length;ci++){ const sp=clouds[ci][0],off=clouds[ci][1],fy=clouds[ci][2],rad=clouds[ci][3]; let cxp=((now*sp+off*(W+rad*2))%(W+rad*2))-rad; let cyp=H*fy+Math.sin(now*0.0004+ci*1.3)*10; const rg=ctx.createRadialGradient(cxp,cyp,rad*0.15,cxp,cyp,rad); rg.addColorStop(0,'rgba(0,0,0,0.14)'); rg.addColorStop(0.55,'rgba(0,0,0,0.07)'); rg.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=rg; ctx.fillRect(0,0,W,H); } ctx.restore(); return; } if(boardKey==='neon'){ try{ drawBallTrail(ctx,now); drawNeonShock(ctx,now); }catch(e){} ctx.save(); ctx.globalCompositeOperation='lighter'; const p=0.5+0.5*Math.sin(now*0.0025); ctx.fillStyle='rgba(30,120,150,'+(0.04+p*0.05)+')'; ctx.fillRect(WALL,WALL,W-WALL*2,H-WALL*2); const sy=WALL+((now*0.05)%(H-WALL*2)),bh=16; const lg=ctx.createLinearGradient(0,sy-bh,0,sy+bh); lg.addColorStop(0,'rgba(90,240,255,0)'); lg.addColorStop(0.5,'rgba(90,240,255,0.15)'); lg.addColorStop(1,'rgba(90,240,255,0)'); ctx.fillStyle=lg; ctx.fillRect(WALL,sy-bh,W-WALL*2,bh*2); ctx.restore(); return; } } function drawBoardFXOver(ctx,now){ if(boardKey==='wood'){ ctx.save(); for(let i=0;i<12;i++){ const hx=Math.sin(i*19.3)*7321.1,hs=hx-Math.floor(hx); const hy=Math.sin(i*44.1)*3312.7,ho=hy-Math.floor(hy); const spd=0.006+ho*0.01, yy=WALL+((ho*(H-WALL*2))-now*spd+(H-WALL*2)*40)%(H-WALL*2), xx=WALL+((hs*(W-WALL*2))+Math.sin(now*0.0008+i)*6+(W-WALL*2))%(W-WALL*2); const tw=0.28+0.28*Math.sin(now*0.003+i*1.7); ctx.fillStyle='rgba(255,245,220,'+tw+')'; ctx.fillRect(xx|0,yy|0,1,1); } ctx.restore(); return; } if(boardKey==='beach'){ const gulls=[[0.010,0.0,0.20,7],[0.008,0.45,0.62,6],[0.013,0.8,0.40,5]]; for(let gi=0;gi<gulls.length;gi++){ const sp=gulls[gi][0],off=gulls[gi][1],fy=gulls[gi][2],sc=gulls[gi][3]; let x=((now*sp+off*(W+60))%(W+60))-30; let y=H*fy+Math.sin(now*0.002+gi)*7; const flap=2.4+Math.sin(now*0.02+gi*1.3)*3; const shx=x+6,shy=y+13; ctx.strokeStyle='rgba(120,95,55,0.16)'; ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(shx-sc,shy); ctx.quadraticCurveTo(shx-sc*0.4,shy-flap*0.5,shx,shy); ctx.quadraticCurveTo(shx+sc*0.4,shy-flap*0.5,shx+sc,shy); ctx.stroke(); ctx.strokeStyle='rgba(252,252,255,0.96)'; ctx.lineWidth=1.7; ctx.beginPath(); ctx.moveTo(x-sc,y); ctx.quadraticCurveTo(x-sc*0.4,y-flap,x,y); ctx.quadraticCurveTo(x+sc*0.4,y-flap,x+sc,y); ctx.stroke(); ctx.fillStyle='rgba(60,60,66,0.9)'; ctx.fillRect(Math.round(x)-1,Math.round(y)-1,2,2); } return; } if(boardKey==='ice'){ ctx.save(); for(let i=0;i<46;i++){ const hx=Math.sin(i*12.9)*43758.5,hs=hx-Math.floor(hx); const hy=Math.sin(i*78.2)*12345.6,ho=hy-Math.floor(hy); const spd=0.02+ho*0.03; const yy=WALL+((ho*(H-WALL*2))+now*spd)%(H-WALL*2); const xx=WALL+((hs*(W-WALL*2))+Math.sin(now*0.001+i)*8+(W-WALL*2))%(W-WALL*2); const sz=1+(i%3===0?1:0); ctx.fillStyle=i%4===0?'rgba(255,255,255,0.85)':'rgba(255,255,255,0.55)'; ctx.fillRect(xx|0,yy|0,sz,sz); } for(let i=0;i<10;i++){ const hx=Math.sin(i*33.7)*9871.1,gx=WALL+(hx-Math.floor(hx))*(W-WALL*2); const hy=Math.sin(i*51.3)*5527.7,gy=WALL+(hy-Math.floor(hy))*(H-WALL*2); const tw=Math.sin(now*0.006+i*2.1); if(tw>0.7){ const a=(tw-0.7)/0.3; ctx.fillStyle='rgba(255,255,255,'+(a*0.9)+')'; ctx.fillRect(gx|0,(gy-1)|0,1,3); ctx.fillRect((gx-1)|0,gy|0,3,1); } } ctx.restore(); return; } if(boardKey==='storm'){ ctx.save(); ctx.strokeStyle='rgba(190,210,235,0.35)'; ctx.lineWidth=1; var wlean=(typeof stormWindAng!=='undefined')?Math.cos(stormWindAng)*5:-2; for(var i=0;i<70;i++){ var hx=Math.sin(i*12.9)*43758.5,hs=hx-Math.floor(hx); var hy=Math.sin(i*57.3)*7788.1,ho=hy-Math.floor(hy); var spd=6+ho*5; var yy=WALL+((ho*(H-WALL*2))+now*spd*0.06)%(H-WALL*2); var xx=WALL+((hs*(W-WALL*2))-now*spd*0.02+(W-WALL*2)*4)%(W-WALL*2); ctx.beginPath(); ctx.moveTo(xx,yy); ctx.lineTo(xx+wlean,yy+7); ctx.stroke(); } ctx.restore(); if(typeof stormStrike!=='undefined'&&stormStrike){ var _ls=stormStrike; if(_ls.ph<30){ var _tp=_ls.ph/30; ctx.save(); ctx.globalAlpha=0.35+0.45*_tp; ctx.strokeStyle='rgba(220,235,255,0.85)'; ctx.lineWidth=1.4; ctx.beginPath(); ctx.arc(_ls.x,_ls.y,16*(1-_tp)+3,0,6.283); ctx.stroke(); ctx.fillStyle='rgba(220,235,255,'+(0.28*_tp).toFixed(2)+')'; ctx.fillRect(_ls.x-1,WALL,2,_ls.y-WALL); ctx.restore(); } else { ctx.save(); ctx.globalAlpha=Math.max(0,1-(_ls.ph-30)/8); ctx.fillStyle='rgba(235,242,255,0.45)'; ctx.fillRect(0,0,W,H); ctx.strokeStyle='rgba(255,255,255,0.95)'; ctx.lineWidth=2; var _bx=_ls.x,_by=WALL; ctx.beginPath(); ctx.moveTo(_bx,_by); for(var _k=0;_k<5;_k++){ _bx+=(Math.random()-0.5)*12; _by+=(_ls.y-WALL)/5; ctx.lineTo(_bx,_by);} ctx.stroke(); ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.arc(_ls.x,_ls.y,5,0,6.283); ctx.fill(); ctx.restore(); } } return; } if(boardKey==='candy'){ ctx.save(); var _cs=['rgba(255,120,180,','rgba(120,220,255,','rgba(255,215,90,','rgba(140,240,170,','rgba(210,140,255,']; for(var i=0;i<26;i++){ var hx=Math.sin(i*19.7)*7321.7,hs=hx-Math.floor(hx); var hy=Math.sin(i*41.3)*3312.9,ho=hy-Math.floor(hy); var spd=0.6+ho*0.8; var yy=WALL+((ho*(H-WALL*2))-now*spd*0.02+(H-WALL*2)*4)%(H-WALL*2); var xx=WALL+((hs*(W-WALL*2))+Math.sin(now*0.001+i)*6+(W-WALL*2))%(W-WALL*2); var tw=0.4+0.6*Math.abs(Math.sin(now*0.004+i*1.7)); var s2=(i%3===0)?2:1; ctx.fillStyle=_cs[i%5]+(tw*0.7).toFixed(3)+')'; ctx.fillRect(xx|0,yy|0,s2,s2); if(i%4===0){ ctx.fillRect((xx|0)-1,yy|0,1,1); ctx.fillRect((xx|0)+s2,yy|0,1,1); ctx.fillRect(xx|0,(yy|0)-1,1,1); ctx.fillRect(xx|0,(yy|0)+s2,1,1); } } ctx.restore(); return; } if(boardKey==='casino'){ ctx.save(); var _su=['♠','♥','♦','♣']; ctx.font='7px monospace'; ctx.textAlign='center'; for(var i=0;i<8;i++){ var hx=Math.sin(i*23.1)*9187.3,hs=hx-Math.floor(hx); var hy=Math.sin(i*51.7)*4423.9,ho=hy-Math.floor(hy); var yy=WALL+((ho*(H-WALL*2))-now*(0.3+ho*0.4)*0.03+(H-WALL*2)*4)%(H-WALL*2); var xx=WALL+8+hs*(W-WALL*2-16)+Math.sin(now*0.001+i)*5; ctx.globalAlpha=0.3+0.2*Math.sin(now*0.003+i); ctx.fillStyle=(i%2===0)?'rgba(230,90,90,0.9)':'rgba(240,240,245,0.9)'; ctx.fillText(_su[i%4],xx,yy); } ctx.restore(); return; } if(boardKey==='space'){ ctx.save(); var scx=W/2,scy=H/2,sang=now*0.0009; ctx.strokeStyle='rgba(120,200,255,0.28)'; ctx.lineWidth=1; for(var k=0;k<3;k++){ ctx.beginPath(); ctx.arc(scx,scy,20+k*8,sang+k*2.1,sang+k*2.1+1.3); ctx.stroke(); } var pl=[[0.3,0.3,'120,160,255'],[0.7,0.45,'255,110,130'],[0.4,0.65,'255,110,130'],[0.65,0.75,'120,160,255'],[0.5,0.5,'120,160,255']]; for(var i=0;i<pl.length;i++){ var px=WALL+pl[i][0]*(W-WALL*2), py=WALL+pl[i][1]*(H-WALL*2), pu=0.14+0.14*Math.sin(now*0.004+i*1.3); ctx.fillStyle='rgba('+pl[i][2]+','+pu.toFixed(3)+')'; ctx.fillRect(px-9,py-9,18,18); } var ssy=WALL+((now*0.03)%(H-WALL*2)); ctx.fillStyle='rgba(150,220,255,0.06)'; ctx.fillRect(WALL,ssy-6,W-WALL*2,12); ctx.restore(); return; } if(boardKey==='skate'){ ctx.save(); var tx=W/2+Math.sin(now*0.0009)*(W*0.3); var slg=ctx.createLinearGradient(tx-40,0,tx+40,0); slg.addColorStop(0,'rgba(255,255,255,0)'); slg.addColorStop(0.5,'rgba(255,255,255,0.07)'); slg.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle=slg; ctx.fillRect(WALL,WALL,W-WALL*2,H-WALL*2); for(var r=0;r<3;r++){ var ry=WALL+(H-WALL*2)*(0.3+r*0.2); var sx=WALL+10+((now*0.12*(r+1))%(W-WALL*2-20)); if(Math.sin(now*0.02+r)>0.3){ ctx.fillStyle='rgba(255,230,120,0.9)'; ctx.fillRect(sx|0,ry|0,2,1); ctx.fillStyle='rgba(255,180,60,0.6)'; ctx.fillRect((sx|0)-2,(ry|0)-1,1,1); ctx.fillRect((sx|0)-3,(ry|0)+1,1,1); } } ctx.restore(); try{ drawSkateHills(ctx,now); }catch(e){} return; } if(boardKey==='jungle'){ ctx.save(); ctx.strokeStyle='rgba(50,110,45,0.5)'; ctx.lineWidth=2; for(var v=0;v<5;v++){ var vx=WALL+(W-WALL*2)*(0.12+v*0.19); var sw=Math.sin(now*0.001+v*1.3)*6; var len=30+v*8; ctx.beginPath(); ctx.moveTo(vx,WALL); ctx.quadraticCurveTo(vx+sw*0.5,WALL+len*0.5,vx+sw,WALL+len); ctx.stroke(); ctx.fillStyle='rgba(70,140,60,0.6)'; ctx.fillRect(Math.round(vx+sw)-1,Math.round(WALL+len),3,3); } for(var i=0;i<10;i++){ var hx=Math.sin(i*17.3)*5123.1,hs=hx-Math.floor(hx); var hy=Math.sin(i*39.7)*2917.3,ho=hy-Math.floor(hy); var fx=WALL+hs*(W-WALL*2)+Math.sin(now*0.0018+i)*10; var fy=WALL+ho*(H-WALL*2)+Math.cos(now*0.0015+i*1.7)*8; var tw=0.3+0.5*Math.abs(Math.sin(now*0.005+i*2.1)); ctx.fillStyle='rgba(200,255,120,'+tw.toFixed(3)+')'; ctx.fillRect(fx|0,fy|0,1,1); } ctx.restore(); return; } } function drawStreetLights(ctx,now){ const IN=WALL+3, cx=W/2, cy=H/2, R=Math.min(W,H)*0.52, FAULT=1; const lamps=[[IN,IN],[W-IN,IN],[IN,H-IN],[W-IN,H-IN]]; const bkt=Math.floor(now/110), fh=(function(){ let v=Math.sin(bkt*127.1)*43758.5453; return v-Math.floor(v); })(); const inten=[]; for(let i=0;i<4;i++){ inten[i]=(i===FAULT)?(fh<0.34?0.0:1.0):1.0; } ctx.save(); ctx.globalCompositeOperation='lighter'; for(let i=0;i<4;i++){ const lx=lamps[i][0],ly=lamps[i][1],s=inten[i]; if(s<=0.02) continue; const a=0.42*s; const rg=ctx.createRadialGradient(lx,ly,4,lx,ly,R); rg.addColorStop(0,'rgba(255,226,150,'+a+')'); rg.addColorStop(0.42,'rgba(255,214,130,'+(a*0.36)+')'); rg.addColorStop(1,'rgba(255,210,120,0)'); ctx.fillStyle=rg; ctx.fillRect(WALL,WALL,W-WALL*2,H-WALL*2); ctx.strokeStyle='rgba(255,228,160,1)'; ctx.lineWidth=2; for(let k=0;k<6;k++){ ctx.globalAlpha=0.06*s*(1-k*0.14); ctx.beginPath(); ctx.moveTo(lx,ly); ctx.lineTo(lx+(cx-lx)*(0.28+k*0.13), ly+(cy-ly)*(0.28+k*0.13)); ctx.stroke(); } ctx.globalAlpha=1; } ctx.restore(); for(let i=0;i<4;i++){ const lx=lamps[i][0],ly=lamps[i][1],lit=inten[i]>0.5; ctx.fillStyle=lit?'rgba(255,240,200,0.55)':'rgba(70,64,48,0.5)'; ctx.fillRect(lx-3,ly-3,6,6); ctx.fillStyle=lit?'rgba(255,250,230,0.95)':'rgba(110,102,84,0.7)'; ctx.fillRect(lx-2,ly-2,4,4); } } var nsCamS={on:false,side:null,holdT:0,z:1.6,_t:'',_o:''}; var _camShotDone=false; function nsSetCam(z,ox,oy){ if(!canvas) return; var o=ox.toFixed(1)+'% '+oy.toFixed(1)+'%', t='scale('+z+')'; if(o!==nsCamS._o){ canvas.style.transformOrigin=o; nsCamS._o=o; } if(t!==nsCamS._t){ canvas.style.transform=t; nsCamS._t=t; } } function nsGoalFocus(side){ var gx=W/2, gy=(side==='top')?16:(H-16); var bx=Math.max(0,Math.min(W,coin.x)), by=Math.max(0,Math.min(H,coin.y)); var fx=OX+(gx*0.7+bx*0.3), fy=OY+(gy*0.7+by*0.3); return {x:fx/CW*100, y:fy/CH*100}; } function nsCam(dt){ if(typeof reduceMotion!=='undefined'&&reduceMotion){ if(nsCamS.on){ nsCamS.on=false; nsCamS.side=null; nsSetCam(1,50,50); } return; } if(pen&&pen.active){ if(nsCamS.on){ nsCamS.on=false; nsCamS.side=null; nsSetCam(1,50,50); } return; } if(phase!=='play'||winner){ if(nsCamS.on){ nsCamS.on=false; nsCamS.side=null; nsSetCam(1,50,50); } return; } var sp=Math.hypot(coin.vx,coin.vy); var attackTop=(current==='red'); var nearTop=coin.y<H*0.34&&coin.vy<-0.3, nearBot=coin.y>H*0.66&&coin.vy>0.3; var oppApproach=attackTop?nearTop:nearBot; var inLane=Math.abs(coin.x-W/2)<GOAL_W*0.95+12; if(sp>2.2&&inLane&&oppApproach){ if(nsCamS.on){ nsCamS.holdT=320; nsCamS.side=attackTop?'top':'bottom'; } else if(!_camShotDone){ try{sfxSuspense();}catch(e){} try{sfxCrowdSwell();}catch(e){} nsCamS.on=true; nsCamS.holdT=320; nsCamS.side=attackTop?'top':'bottom'; _camShotDone=true; } } else if(scoring&&nsCamS.on){ nsCamS.holdT=300; } else if(nsCamS.on){ nsCamS.holdT-=dt; if(nsCamS.holdT<=0||sp<0.5){ nsCamS.on=false; nsCamS.side=null; nsSetCam(1,50,50); return; } } if(nsCamS.on){ var f=nsGoalFocus(nsCamS.side); nsSetCam(nsCamS.z,f.x,f.y); } } function draw(now){
      ctx.clearRect(0,0,CW,CH);
      try{ updateFlickFX(); }catch(e){}
      drawCrowd(now);

      ctx.save();
      ctx.translate(OX,OY);
      if(shake>0){ ctx.translate(Math.round((Math.random()-0.5)*shake),Math.round((Math.random()-0.5)*shake)); }
      ctx.drawImage(boardCanvas,0,0);

      // radial stadium lighting over the pitch
      const lg=ctx.createRadialGradient(W/2,H*0.42,10,W/2,H*0.42,H*0.62);
      lg.addColorStop(0,'rgba(255,255,255,0.10)'); lg.addColorStop(0.55,'rgba(255,255,255,0.02)'); lg.addColorStop(1,'rgba(0,0,0,0.22)');
      ctx.fillStyle=lg; ctx.fillRect(0,0,W,H); try{ drawBoardFXGround(ctx,now); }catch(e){}
      try{ if(boardKey==='skate') drawSkateFrame(now); else drawTurnBoards(now); }catch(e){}

      // net glow
      if(scoring||banner>0){
        const gL=(W-GOAL_W)/2, t=scoring?0.5:Math.min(0.5,banner/110*0.5);
        const side=scoringTeam||bannerTeam;
        const pc=primary(side).replace('#','');
        const rr=parseInt(pc.substr(0,2),16),gg=parseInt(pc.substr(2,2),16),bb=parseInt(pc.substr(4,2),16);
        ctx.fillStyle='rgba('+rr+','+gg+','+bb+','+(t*0.5)+')';
        if(side==='red') ctx.fillRect(gL,0,GOAL_W,NET_DEPTH); else ctx.fillRect(gL,H-NET_DEPTH,GOAL_W,NET_DEPTH);
      }

      // pitch lines
      ctx.strokeStyle=board.line; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(WALL,Math.round(H/2)+0.5); ctx.lineTo(W-WALL,Math.round(H/2)+0.5); ctx.stroke();
      ctx.beginPath(); ctx.arc(W/2,H/2,22,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle=board.line; ctx.fillRect(Math.round(W/2)-1,Math.round(H/2)-1,2,2);   // centre spot
      const gL=(W-GOAL_W)/2,gR=(W+GOAL_W)/2;
      ctx.strokeStyle=board.line2;
      ctx.beginPath(); ctx.moveTo(gL,NET_DEPTH+0.5); ctx.lineTo(gR,NET_DEPTH+0.5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gL,H-NET_DEPTH-0.5); ctx.lineTo(gR,H-NET_DEPTH-0.5); ctx.stroke();
      for(const team of ['red','blue']){
        const r=goalAreaRect(team);
        if(phase==='setup'){ const cnt=countInGoalArea(team,dragNail); const over=cnt>=1&&dragNail&&dragNail.team===team&&inRect(dragNail.x,dragNail.y,r); ctx.fillStyle=over?'rgba(214,75,58,0.18)':'rgba(245,235,210,0.07)'; ctx.fillRect(r.x,r.y,r.w,r.h); }
        drawEndMarks(ctx,team);
      }
      // possession flash over the active team's half
      if(turnFlash>0&&phase==='play'&&!winner){ const a=Math.min(0.24,turnFlash/28*0.24); ctx.fillStyle=current==='red'?'rgba(224,91,72,'+a+')':'rgba(91,143,232,'+a+')'; if(current==='red') ctx.fillRect(WALL,H/2,W-WALL*2,H/2-WALL); else ctx.fillRect(WALL,WALL,W-WALL*2,H/2-WALL); }

      const cr=8;
      ctx.strokeStyle=board.line2;
      ctx.beginPath(); ctx.arc(WALL,WALL,cr,0,Math.PI/2); ctx.stroke();
      ctx.beginPath(); ctx.arc(W-WALL,WALL,cr,Math.PI/2,Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(WALL,H-WALL,cr,-Math.PI/2,0); ctx.stroke();
      ctx.beginPath(); ctx.arc(W-WALL,H-WALL,cr,Math.PI,Math.PI*1.5); ctx.stroke();

      try{drawEco(now);}catch(e){} try{drawWalls();}catch(e){} try{drawMud(now);}catch(e){} try{drawPortals(now);}catch(e){} try{drawLasers(now);}catch(e){} try{drawWall(now);}catch(e){} try{drawDrains(now);}catch(e){} try{drawBoulder(now);}catch(e){} try{drawPuddles(now);}catch(e){} try{drawTraps(now);}catch(e){} try{drawBlizzard(now);}catch(e){} try{drawTrapFx(now);}catch(e){} try{drawShield(now);}catch(e){} try{drawMagnetPull(now);}catch(e){} // nails
      for(const n of nails){
        if(n.team===current&&!winner&&phase==='play'){ const pulse=0.5+Math.sin(frameTick*0.13)*0.5; ctx.beginPath(); ctx.arc(n.x,n.y,NAIL_R+4+pulse,0,Math.PI*2); ctx.fillStyle=n.team==='red'?'rgba(224,91,72,0.16)':'rgba(91,143,232,0.16)'; ctx.fill(); }
        paintNail(ctx,n.x,n.y,(n.goalie&&((sideAb[n.team]||[]).indexOf('bigkeeper')>=0))?NAIL_R+3:NAIL_R,teamKits[n.team].kit, n.team===current&&!winner&&phase==='play', resolveKit(teamKits[n.team].kit, effStyle(n.team)));
        if(n.goalie){ ctx.beginPath(); ctx.arc(n.x,n.y,NAIL_R+1.5,0,Math.PI*2); ctx.strokeStyle='#f4e9c8'; ctx.lineWidth=1.5; ctx.stroke(); } if(n.damp){ ctx.beginPath(); ctx.arc(n.x,n.y,NAIL_R+2.5,0,Math.PI*2); ctx.strokeStyle='#8a5a2a'; ctx.lineWidth=2; ctx.stroke(); }
        if(n.clearer && typeof clearUsed!=='undefined' && clearUsed && !clearUsed[n.team]){ var _cpl=0.5+Math.sin(frameTick*0.11)*0.5, _cR=NAIL_R+5.5; ctx.save(); ctx.globalAlpha=0.16+_cpl*0.10; ctx.fillStyle='#5aa0ff'; ctx.beginPath(); ctx.arc(n.x,n.y,_cR,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=0.7+_cpl*0.25; ctx.strokeStyle='#bfe0ff'; ctx.lineWidth=1.8; ctx.beginPath(); ctx.arc(n.x,n.y,_cR,0,Math.PI*2); ctx.stroke(); ctx.restore(); }
        if(phase==='setup'){ const r=goalAreaRect(n.team); const bad=(n===dragNail)&&inRect(n.x,n.y,r)&&countInGoalArea(n.team,n)>=1; ctx.beginPath(); ctx.arc(n.x,n.y,NAIL_R+2,0,Math.PI*2); ctx.strokeStyle=bad?'rgba(214,75,58,0.9)':'rgba(255,255,255,0.5)'; ctx.lineWidth=1; ctx.stroke(); }
      }

      // fortress portcullis draws OVER the goalie (keeper sits behind the bars) but under the ball
      try{drawPortcullis(now);}catch(e){}

      // sand geyser vents sit on the sand under the ball (erupting spout draws upward)
      try{drawGeysers(now);}catch(e){}
      // pinball table pieces sit on the pitch under the ball: orbit lanes lowest, then bumpers
      // and flippers (the ball bounces off their edges)
      try{drawOrbits(now);}catch(e){}
      try{drawBumpers(now);}catch(e){}
      try{drawFlippers(now);}catch(e){}

      // ball (with shot trail)
      if(phase==='play'){
        for(const t of shotTrail){ const a=Math.max(0,t.life/t.max)*((t.curl||t.wet)?0.32:0.22); ctx.beginPath(); ctx.arc(t.x,t.y,COIN_R,0,Math.PI*2); ctx.fillStyle=t.wet?'rgba(64,150,255,'+a+')':(t.curl?'rgba(120,220,255,'+a+')':'rgba(244,233,200,'+a+')'); ctx.fill(); if(t.wet){ ctx.fillStyle='rgba(170,215,255,'+Math.min(1,a*1.4)+')'; ctx.beginPath(); ctx.arc(t.x-2,t.y-1.5,1.4,0,Math.PI*2); ctx.arc(t.x+2.3,t.y+1.6,1.1,0,Math.PI*2); ctx.fill(); } }
        ctx.save(); if(ghosting) ctx.globalAlpha=0.4; if(coin.air>0){ var _a0=coin.air0||22, _ap=1-(coin.air/_a0), _hh=Math.sin(_ap*Math.PI)*(COIN_R*2.6); ctx.save(); ctx.globalAlpha=0.26; ctx.fillStyle='#000'; ctx.beginPath(); ctx.ellipse(coin.x,coin.y,COIN_R*0.85,COIN_R*0.45,0,0,Math.PI*2); ctx.fill(); ctx.restore(); drawBall(coin.x,coin.y-_hh); } else { drawBall(coin.x,coin.y); } ctx.restore();
        // once the ball is inside a fortress goal box (past the gate line), redraw the portcullis
        // over it so it reads as being behind the bars, like the keeper
        try{ if(typeof royPortcArena==='function' && royPortcArena()){ var _gr=goalAreaRect('blue'); if(coin.x>_gr.x && coin.x<_gr.x+_gr.w && (coin.y<NET_DEPTH+_gr.h || coin.y>H-NET_DEPTH-_gr.h)) drawPortcullis(now); } }catch(e){}
      }

      // ambush serpents drawn UNDER the bushes (they stay hidden beneath the foliage and
      // only the lunging head pokes out), then bushes over the ball + serpent so a captured
      // ball and the coiled snake both disappear INTO the foliage
      try{drawSerp(now);}catch(e){}
      try{drawBushes(now);}catch(e){}
      // cacti stand over the ball (it disappears behind them); dust-devil towers over everything
      try{drawCacti(now);}catch(e){}
      try{drawDevil(now);}catch(e){}
      // warehouse: spider crawls over the floor/webs; crates crash down on top of everything
      try{drawSpider(now);}catch(e){}
      try{drawCrates(now);}catch(e){}
      // front net overlay (bulge)
      const netTeam=scoringTeam||parkedTeam;
      const ballInGoal=(scoring||banner>0||parkedTeam)&&netTeam;
      if(ballInGoal){
        const gL2=Math.round((W-GOAL_W)/2),gR2=gL2+GOAL_W,top=netTeam==='red',edge=top?0:H,frontLine=top?NET_DEPTH:H-NET_DEPTH;
        const cx=Math.max(gL2+4,Math.min(gR2-4,netBulgeX||coin.x)),bulge=netBulge,halfW=GOAL_W*0.5;
        const backAt=px=>{ const d=(px-cx)/halfW,bell=Math.exp(-d*d*4); return top?edge-bulge*bell:edge+bulge*bell; };
        ctx.save(); const pad=Math.ceil(bulge)+2; ctx.beginPath(); if(top) ctx.rect(gL2,-pad,GOAL_W,NET_DEPTH+pad); else ctx.rect(gL2,frontLine,GOAL_W,NET_DEPTH+pad); ctx.clip();
        ctx.fillStyle=board.netOverlay;
        for(let px=gL2;px<gR2;px++){ const by=backAt(px); if(top) ctx.fillRect(px,by,1,frontLine-by); else ctx.fillRect(px,frontLine,1,by-frontLine); }
        ctx.fillStyle=board.netStrand; const step=3;
        for(let px=gL2;px<gR2;px++){ const by=backAt(px),y0=top?Math.floor(by):frontLine,y1=top?frontLine:Math.ceil(by),lxx=px-gL2; for(let py=y0;py<y1;py++){ const ld=top?(frontLine-1-py):(py-frontLine); if(((lxx+ld)%step===0)||((lxx-ld+900)%step===0)) ctx.fillRect(px,py,1,1); } }
        ctx.fillStyle='rgba(0,0,0,0.45)';
        for(let px=gL2;px<gR2;px++){ const by=Math.round(backAt(px)); ctx.fillRect(px,top?by:by-1,1,1); }
        ctx.restore();
      }

      // blackout alley: darkness overlay drawn over the pitch/ball/hazards but under the aim HUD,
      // so the lit pool follows the ball and the aim guide stays readable
      try{drawBlackout(now);}catch(e){}

      // aim — pull-back guide + predicted bounce path + power meter
      if(pen&&pen.active) drawPenaltyHUD();
      if(aiming&&aimStart&&aimNow&&debuffActive(current,'fog')){ ctx.save(); for(var _fp=0;_fp<7;_fp++){ var _fa=_fp*(Math.PI*2/7); ctx.globalAlpha=0.16; ctx.fillStyle='#c9d0d8'; ctx.beginPath(); ctx.arc(coin.x+Math.cos(_fa)*7,coin.y+Math.sin(_fa)*7,8+(_fp%3)*3,0,Math.PI*2); ctx.fill(); } ctx.globalAlpha=0.55; ctx.fillStyle='#e8edf2'; ctx.beginPath(); ctx.arc(coin.x,coin.y,9,0,Math.PI*2); ctx.fill(); ctx.restore(); } if(aiming&&aimStart&&aimNow&&!debuffActive(current,'fog')){
        const dx=aimStart.x-aimNow.x,dy=aimStart.y-aimNow.y,rawP=Math.hypot(dx,dy),power=Math.min(rawP,(pen&&pen.active)?32:(TAC.frozen?35:70)),ang=Math.atan2(dy,dx); var _dw=(debuffActive(current,'drunk'))?Math.sin((now||0)*0.012)*0.4:0, angD=ang+_dw;
        // pull-back dashed guide behind the ball + short aim line in the flick direction
        const pull=Math.min(rawP,TAC.frozen?21:42); var bx=coin.x-Math.cos(angD)*pull, by=coin.y-Math.sin(angD)*pull;
        ctx.strokeStyle='rgba(255,250,235,0.85)'; ctx.lineWidth=1.6; ctx.setLineDash([2,2]); ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(coin.x,coin.y); ctx.stroke(); ctx.setLineDash([]);
        var pEff=power*staminaMul(); var _stamMode=(mode!=='practice' && mode!=='penalty' && !(pen&&pen.active)); var L=(13+pEff*0.6)*(TAC.laser?2.4:1); if(TAC.backspin) L=400; const pcol=TAC.frozen?'#7fdcff':(_stamMode?['#5dff5d','#ffd21a','#ff2a1a','#b31414'][Math.min(flickCount,3)]:((power/70)<0.5?'#5dff5d':(power/70)<0.82?'#ffd21a':'#ff2a1a')); var v0=pEff*(FLICK_MAX/FLICK_POWER)*TAC.power, gvx=Math.cos(angD)*v0, gvy=Math.sin(angD)*v0, gx=coin.x, gy=coin.y; var _gh=-gvx, _ghd=(_gh>0.05)?1:((_gh<-0.05)?-1:((W/2-coin.x)>=0?1:-1)); var gspin=(TAC.curve&&power>=12)?(_ghd*((gvy<0)?1:-1)*1.9):0; var ff=FRICTION+(TAC.glide||0)+royFloorFric(), lft=WALL+COIN_R, rgt=W-WALL-COIN_R, tp=WALL+COIN_R, bt=H-WALL-COIN_R; var gpts=[[gx,gy]], acc=0, ppx=gx, ppy=gy, _bk=null, _stop=false, _sg=!(TAC.curve||TAC.serpent||TAC.backspin||TAC.wet), _gmL=(W-GOAL_W)/2, _gmR=(W+GOAL_W)/2, gBase=Math.atan2(gvy,gvx), gDir=1, gPh=0, gbfx=Math.cos(angD), gbfy=Math.sin(angD), gBackPhase=0, gWetBase=Math.atan2(gvy,gvx), gWetPhase=0; for(var gs=0; gs<80 && acc<L && !_bk && !_stop; gs++){ var gsp=Math.hypot(gvx,gvy); if(gsp<(TAC.backspin?0.12:0.3)) break; if(gspin){ var gpx=-gvy/gsp, gpy=gvx/gsp; gvx+=gpx*gspin*gsp*0.05; gvy+=gpy*gspin*gsp*0.05; var _gcm=Math.hypot(gvx,gvy)||1; gvx=gvx/_gcm*gsp; gvy=gvy/_gcm*gsp; gspin*=0.984; } var _subs=(TAC.serpent||TAC.wet)?Math.max(1,Math.ceil(Math.hypot(gvx,gvy)/MAX_STEP)):1; for(var _su=0; _su<_subs && acc<L && !_bk && !_stop; _su++){ var _hw=false; if(TAC.serpent){ var _gsp2=Math.hypot(gvx,gvy); if(_gsp2>0.3){ var _gang=gBase+gDir*SERPENT_SWING*Math.cos(gPh); gvx=Math.cos(_gang)*_gsp2; gvy=Math.sin(_gang)*_gsp2; gPh+=SERPENT_FREQ; } } if(TAC.wet&&!TAC.serpent&&!TAC.curve){ var _gws=Math.hypot(gvx,gvy); if(_gws>0.3){ var _gwa=gWetBase+WET_WOBBLE*Math.cos(gWetPhase); gvx=Math.cos(_gwa)*_gws; gvy=Math.sin(_gwa)*_gws; gWetPhase+=WET_WFREQ; } } var _px0=gx, _py0=gy; gx+=gvx/_subs; gy+=gvy/_subs; var _inMouth=(gx>_gmL&&gx<_gmR); if(gx<lft){gx=lft;gvx=-gvx*RESTITUTION;gspin*=0.35;_hw=true;} else if(gx>rgt){gx=rgt;gvx=-gvx*RESTITUTION;gspin*=0.35;_hw=true;} if(gy<tp&&!_inMouth){gy=tp;gvy=-gvy*RESTITUTION;gspin*=0.35;_hw=true;} else if(gy>bt&&!_inMouth){gy=bt;gvy=-gvy*RESTITUTION;gspin*=0.35;_hw=true;} if(_hw&&TAC.serpent){ var _bh=Math.atan2(gvy,gvx); gDir=-gDir; gBase=_bh-gDir*SERPENT_SWING*Math.cos(gPh); } if(_hw&&TAC.wet&&!TAC.serpent){ var _ggspd=Math.hypot(gvx,gvy)||1, _ggoy=(current==='red')?(NET_DEPTH+COIN_R+1):(H-NET_DEPTH-COIN_R-1), _gggh=Math.atan2(_ggoy-gy,(W/2)-gx), _ggch=Math.atan2(gvy,gvx), _ggd=Math.atan2(Math.sin(_gggh-_ggch),Math.cos(_gggh-_ggch)), _ggbi=_ggch+_ggd*0.55; gvx=Math.cos(_ggbi)*_ggspd; gvy=Math.sin(_ggbi)*_ggspd; if((current==='red'&&gvy>0.05)||(current==='blue'&&gvy<-0.05)){ gvy=-gvy; } gWetBase=Math.atan2(gvy,gvx)-WET_WOBBLE*Math.cos(gWetPhase); } if(_inMouth&&(gy<=NET_DEPTH+COIN_R||gy>=H-NET_DEPTH-COIN_R)){ gy=Math.max(NET_DEPTH+COIN_R,Math.min(H-NET_DEPTH-COIN_R,gy)); gpts.push([gx,gy]); _stop=true; break; } acc+=Math.hypot(gx-ppx,gy-ppy); ppx=gx; ppy=gy; if(!_sg||_hw) gpts.push([gx,gy]); for(var _bi=0;_bi<nails.length;_bi++){ var _bn=nails[_bi]; if(_bn.goalie) continue; var _bnr=NAIL_R, _bsx=coin.x-_bn.x, _bsy=coin.y-_bn.y; if(_bsx*_bsx+_bsy*_bsy<(COIN_R+_bnr+3)*(COIN_R+_bnr+3)) continue; var _svx=gx-_px0, _svy=gy-_py0, _swx=_bn.x-_px0, _swy=_bn.y-_py0, _sden=(_svx*_svx+_svy*_svy)||1, _st=Math.max(0,Math.min(1,(_swx*_svx+_swy*_svy)/_sden)), _scx=_px0+_st*_svx, _scy=_py0+_st*_svy, _sdd=(_bn.x-_scx)*(_bn.x-_scx)+(_bn.y-_scy)*(_bn.y-_scy); if(_sdd<(COIN_R+_bnr)*(COIN_R+_bnr)){ _bk=[Math.round(_scx),Math.round(_scy)]; break; } } } gvx*=ff; gvy*=ff; if(TAC.backspin){ if(!gBackPhase){ gvx*=0.92; gvy*=0.92; var _gbfv=gvx*gbfx+gvy*gbfy; if(_gbfv<0.4){ gvx=-gbfx*3.0; gvy=-gbfy*3.0; gBackPhase=1; if(TAC.serpent){ gBase+=Math.PI; gDir=-gDir; } } } else { gvx*=0.90; gvy*=0.90; } } } if(_sg){ var _lp=gpts[gpts.length-1]; if(!_lp||_lp[0]!==gx||_lp[1]!==gy) gpts.push([gx,gy]); } ctx.lineCap='round'; ctx.lineJoin='miter'; ctx.miterLimit=2; ctx.strokeStyle='rgba(0,0,0,0.6)'; ctx.lineWidth=4.5; ctx.beginPath(); ctx.moveTo(gpts[0][0],gpts[0][1]); for(var gq=1;gq<gpts.length;gq++) ctx.lineTo(gpts[gq][0],gpts[gq][1]); ctx.stroke(); ctx.strokeStyle=pcol; ctx.lineWidth=2.4; ctx.beginPath(); ctx.moveTo(gpts[0][0],gpts[0][1]); for(var gr=1;gr<gpts.length;gr++) ctx.lineTo(gpts[gr][0],gpts[gr][1]); ctx.stroke(); ctx.lineCap='butt'; ctx.lineJoin='miter'; if(_bk){ var _mx=_bk[0],_my=_bk[1]; ctx.beginPath(); ctx.arc(_mx,_my,4.6,0,Math.PI*2); ctx.fillStyle='rgba(0,0,0,0.55)'; ctx.fill(); ctx.beginPath(); ctx.arc(_mx,_my,3.3,0,Math.PI*2); ctx.fillStyle=pcol; ctx.fill(); ctx.beginPath(); ctx.arc(_mx,_my,1.3,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,0.92)'; ctx.fill(); } else { var glast=gpts[gpts.length-1], gprev=gpts[Math.max(0,gpts.length-2)], geang=Math.atan2(glast[1]-gprev[1],glast[0]-gprev[0]); ctx.save(); ctx.translate(glast[0],glast[1]); ctx.rotate(geang); ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.beginPath(); ctx.moveTo(6,0); ctx.lineTo(-4.5,-5.5); ctx.lineTo(-4.5,5.5); ctx.closePath(); ctx.fill(); ctx.fillStyle=pcol; ctx.beginPath(); ctx.moveTo(4,0); ctx.lineTo(-3,-3.8); ctx.lineTo(-3,3.8); ctx.closePath(); ctx.fill(); ctx.restore(); }
        // power meter bar
        const meterW=44,meterH=4,mx=W/2-meterW/2,my=H/2+32,pf=power/70;
        ctx.fillStyle='rgba(20,12,6,0.68)'; ctx.fillRect(mx,my,meterW,meterH);
        ctx.fillStyle=pf<0.5?'#a9c94b':pf<0.82?'#ffcf3a':'#ff5a3a'; ctx.fillRect(mx,my,meterW*pf,meterH);
        ctx.strokeStyle='rgba(244,233,200,0.55)'; ctx.strokeRect(mx+0.5,my+0.5,meterW-1,meterH-1);
      }
      ctx.restore();

      // confetti + contact sparks + banner
      ctx.save(); ctx.translate(OX,OY);
      try{ drawBoardFXOver(ctx,now); }catch(e){} for(const p of confetti){ ctx.fillStyle=p.color; ctx.fillRect(Math.round(p.x),Math.round(p.y),p.size,p.size); }
      for(const p of hitSparks){ ctx.globalAlpha=Math.min(1,Math.max(0,p.life/p.max)); ctx.fillStyle=p.color; ctx.fillRect(Math.round(p.x),Math.round(p.y),2,2); ctx.globalAlpha=1; }
      if(typeof goalFlash!=='undefined'&&goalFlash>0){ ctx.save(); ctx.globalAlpha=Math.min(0.6,(goalFlash/13)*0.6); ctx.fillStyle='#ffffff'; ctx.fillRect(-OX,-OY,CW,CH); ctx.restore(); }
      if(typeof castFx!=='undefined'&&castFx>0){ ctx.save(); ctx.globalAlpha=(castFx/14)*0.38; var _cg=ctx.createRadialGradient(W/2,H/2,8,W/2,H/2,Math.max(W,H)*0.62); _cg.addColorStop(0,castCol); _cg.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=_cg; ctx.fillRect(0,0,W,H); ctx.restore(); }
      if(typeof turnFx!=='undefined'&&turnFx>0){ ctx.save(); ctx.globalAlpha=(turnFx/13)*0.55; ctx.strokeStyle=turnFxCol; ctx.lineWidth=5; ctx.strokeRect(2.5,2.5,W-5,H-5); ctx.restore(); }
      if(banner>0){ drawBanner(); drawGoalCrowd(); } if(winner){ try{ drawWinner(); }catch(e){} }
      ctx.restore();

      // fireworks (canvas coords)
      drawFireworks();
    }

    var NS_TROPHY=new Image(); try{ NS_TROPHY.src='assets/generated/icon-trophy.png'; }catch(e){} var NS_VSBG={}; ['brazil','argentina','france','spain','germany','england','portugal','netherlands','italy','belgium','croatia','japan','usa','mexico','iceland','senegal'].forEach(function(_k){ var _im=new Image(); try{ _im.src='assets/generated/vsbg-'+_k+'.png'; }catch(e){} NS_VSBG[_k]=_im; }); var NS_WALL=new Image(); try{ NS_WALL.src='assets/generated/icon-wall.png'; }catch(e){} var NS_ROYMAP=new Image(); try{ NS_ROYMAP.src='assets/generated/roymap.png'; }catch(e){} var NS_BUSH=[]; for(var _nbi=0;_nbi<4;_nbi++){ (function(_k){ var _im=new Image(); try{ _im.src='assets/generated/sprite-bush-'+(_k+1)+'.png'; }catch(e){} NS_BUSH[_k]=_im; })(_nbi); } var NS_MUD=new Image(); try{ NS_MUD.src='assets/generated/sprite-mud.png'; }catch(e){} var NS_CACTUS=new Image(); try{ NS_CACTUS.src='assets/generated/sprite-cactus.png'; }catch(e){} var NS_SERP=[]; for(var _nsi=0;_nsi<4;_nsi++){ (function(_k){ var _im=new Image(); try{ _im.src='assets/generated/serp-corner-'+(_k+1)+'.png'; }catch(e){} NS_SERP[_k]=_im; })(_nsi); } var NS_LUNGE=[]; for(var _nli=0;_nli<4;_nli++){ (function(_k){ var _im=new Image(); try{ _im.src='assets/generated/serp-lunge-'+(_k+1)+'.png'; }catch(e){} NS_LUNGE[_k]=_im; })(_nli); } var NS_FANS=[]; try{ ['standing','scarf','flag','seated'].forEach(function(p){ for(var v=1;v<=4;v++){ var _im2=new Image(); try{ _im2.src='assets/generated/fan-'+p+'-'+v+'-sheet.png'; }catch(e){} NS_FANS.push({img:_im2,pose:p}); } }); }catch(e){} window._FAN_NAT={Brazil:'#00a651',Argentina:'#7cc0f0',France:'#12238c',Spain:'#e4002b',Germany:'#333333',England:'#3d5afe',Portugal:'#8b1a1a',Netherlands:'#f36c21',Italy:'#1f9ed4',Belgium:'#e6b800',Croatia:'#c81d3c',Japan:'#f0f0f0',USA:'#4b3fbf',Mexico:'#146b3a',Iceland:'#29c7c7',Senegal:'#ffdd00'}; window._FAN_PAL={Brazil:['#00a651','#00a651','#ffdf00'],Argentina:['#7cc0f0','#ffffff'],France:['#12238c','#ffffff','#e4002b'],Spain:['#e4002b','#ffcc00'],Germany:['#dd0000','#ffce00','#2b2b2b'],England:['#ffffff','#e4002b'],Portugal:['#1a7a3c','#c8102e'],Netherlands:['#f36c21','#f36c21','#f36c21','#ffffff','#12238c'],Italy:['#008c45','#ffffff','#cd212a'],Belgium:['#e4002b','#f2d200','#2b2b2b'],Croatia:['#c81d3c','#ffffff'],Japan:['#f5f5f5','#e4002b'],USA:['#b22234','#ffffff','#3c3b6e'],Mexico:['#006847','#ffffff','#ce1126'],Iceland:['#003897','#ffffff','#d72828'],Senegal:['#00853f','#fdef42','#e31b23']}; window._FLAG_DEF={France:{d:'v',c:['#0055a4','#ffffff','#ef4135']},Germany:{d:'h',c:['#111111','#dd0000','#ffce00']},Netherlands:{d:'h',c:['#ae1c28','#ffffff','#21468b']},Italy:{d:'v',c:['#008c45','#ffffff','#cd212a']},Belgium:{d:'v',c:['#111111','#fae042','#ed2939']},Spain:{d:'h',c:['#aa151b','#f1bf00','#aa151b']},Argentina:{d:'h',c:['#74acdf','#ffffff','#74acdf']},England:{d:'v',c:['#ffffff','#cf142b','#ffffff']},Portugal:{d:'v',c:['#046a38','#046a38','#da291c']},Croatia:{d:'h',c:['#ff0000','#ffffff','#171796']},Japan:{d:'v',c:['#ffffff','#bc002d','#ffffff']},USA:{d:'h',c:['#b22234','#ffffff','#3c3b6e']},Mexico:{d:'v',c:['#006847','#ffffff','#ce1126']},Iceland:{d:'h',c:['#02529c','#ffffff','#dc1e35']},Senegal:{d:'v',c:['#00853f','#fdef42','#e31b23']},Brazil:{d:'v',c:['#009c3b','#ffdf00','#009c3b']}}; window._flagTintFor=function(nm,fb){ var d=window._FLAG_DEF&&window._FLAG_DEF[nm]; return d?{flag:d.c,dir:d.d,shirt:fb}:fb; };  function drawWalls(){ if(typeof royaleArena!=='undefined' && royaleArena && royaleArena.cust==='fortress'){ var _fw=royWallRects(); ctx.imageSmoothingEnabled=false; for(var _fi=0;_fi<_fw.length;_fi++){ var r=_fw[_fi]; ctx.fillStyle='rgba(24,18,32,0.95)'; ctx.fillRect(r.x-1,r.y-1,r.w+2,r.h+2); ctx.fillStyle='#b8b2c6'; ctx.fillRect(r.x,r.y,r.w,r.h); ctx.fillStyle='#d2cbde'; ctx.fillRect(r.x,r.y,Math.max(1,r.w-1),r.h); ctx.strokeStyle='rgba(40,30,55,0.55)'; ctx.lineWidth=1; for(var _bry=r.y+5; _bry<r.y+r.h-1; _bry+=6){ ctx.beginPath(); ctx.moveTo(r.x,_bry); ctx.lineTo(r.x+r.w,_bry); ctx.stroke(); } } } ['red','blue'].forEach(function(tm){ if((sideAb[tm]||[]).indexOf('wall')<0) return; var _hp=(wallHP[tm]==null)?WALL_MAX:wallHP[tm]; if(_hp<=0) return; var dmg=WALL_MAX-_hp; var bw=Math.round(GOAL_W*0.30), bh=24, bx=Math.round(W/2-bw/2), isTop=(tm==='blue'), by=isTop?(NET_DEPTH+GOAL_AREA_D-Math.round(bh/2)):(H-NET_DEPTH-GOAL_AREA_D-Math.round(bh/2)); if(typeof NS_WALL!=='undefined'&&NS_WALL.complete&&NS_WALL.naturalWidth){ ctx.imageSmoothingEnabled=false; ctx.save(); ctx.globalAlpha=Math.max(0.5,1-0.22*dmg); if(isTop){ var _cy=by+bh/2; ctx.translate(0,_cy); ctx.scale(1,-1); ctx.translate(0,-_cy); } ctx.drawImage(NS_WALL,bx,by,bw,bh); ctx.restore(); } else { ctx.fillStyle='rgba(28,20,38,0.92)'; ctx.fillRect(bx-1,by-1,bw+2,bh+2); ctx.fillStyle='#cfc8dc'; ctx.fillRect(bx,by,bw,bh); } var _pipY=isTop?(by+bh+2):(by-5), _pw=3, _pg=2, _tot=WALL_MAX*_pw+(WALL_MAX-1)*_pg, _sx=Math.round(W/2-_tot/2); ctx.save(); for(var _p=0;_p<WALL_MAX;_p++){ ctx.fillStyle=(_p<_hp)?'#e6ff7a':'rgba(240,240,255,0.18)'; ctx.fillRect(_sx+_p*(_pw+_pg),_pipY,_pw,3); } ctx.restore(); }); } function drawWinner(){ var side=winner; if(!side) return; var tc=primary(side); ctx.save(); ctx.fillStyle='rgba(6,4,10,0.55)'; ctx.fillRect(0,0,W,H); var cw=Math.min(W-18,152), ch=120; ctx.translate(W/2,H/2); ctx.fillStyle='rgba(16,10,6,0.95)'; ctx.fillRect(-cw/2,-ch/2,cw,ch); ctx.fillStyle=tc; ctx.fillRect(-cw/2,-ch/2,cw,4); ctx.fillRect(-cw/2,ch/2-4,cw,4); var fw=34,fh=22,fx=-fw/2,fy=-ch/2+10; try{ ctx.imageSmoothingEnabled=false; ctx.save(); ctx.beginPath(); ctx.rect(fx,fy,fw,fh); ctx.clip(); paintPattern(ctx,fx,fy,fw,fh,teamKits[side].kit); ctx.restore(); ctx.strokeStyle='rgba(0,0,0,0.5)'; ctx.lineWidth=1; ctx.strokeRect(fx+0.5,fy+0.5,fw-1,fh-1); }catch(e){} if(typeof NS_TROPHY!=='undefined'&&NS_TROPHY.complete&&NS_TROPHY.naturalWidth){ var ts=38; ctx.drawImage(NS_TROPHY,-ts/2,fy+fh+3,ts,ts); } ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.font="9px 'Press Start 2P', monospace"; ctx.lineWidth=3; ctx.strokeStyle='#120a06'; ctx.strokeText(teamKits[side].name.toUpperCase(),0,ch/2-24); ctx.fillStyle=tc; ctx.fillText(teamKits[side].name.toUpperCase(),0,ch/2-25); ctx.font="12px 'Press Start 2P', monospace"; ctx.lineWidth=4; ctx.strokeStyle='#120a06'; ctx.strokeText('WINS!',0,ch/2-8); ctx.fillStyle='#f4e9c8'; ctx.fillText('WINS!',0,ch/2-9); ctx.restore(); } function drawGoalCrowd(){ if(banner<=0) return; var side=bannerTeam; if(!side||!teamKits[side]) return; var nm=teamKits[side].name; var pal=(window._FAN_PAL&&window._FAN_PAL[nm])||[(window._FAN_NAT&&window._FAN_NAT[nm])||primary(side)]; var cel=[]; for(var _c=0;_c<NS_FANS.length;_c++){ if(NS_FANS[_c].pose==='standing'||NS_FANS[_c].pose==='scarf') cel.push(NS_FANS[_c]); } if(!cel.length) cel=NS_FANS; if(!cel.length) return; var ph=(110-banner), fade=Math.min(1,banner/16), cx=W/2, baseY=H/2+80; var rows=[[4,0.86,-10,7,0.85],[5,1.0,0,0,1]]; ctx.save(); ctx.globalAlpha=fade; var gi=0; for(var r=0;r<rows.length;r++){ var RC=rows[r][0], scl=rows[r][1], yo=rows[r][2], xs=rows[r][3], al=rows[r][4]; var step=17*scl, gw=step*(RC-1), gx=cx-gw/2+xs; for(var i=0;i<RC;i++){ var fx=gx+step*i; var order=gi; gi++; var a=Math.max(0,Math.min(1,(ph-order*1.4)/10)); var s=1.7, ea=a-1, pop=a<=0?0:(1+ea*ea*((s+1)*ea+s)); var jump=a>=1?Math.abs(Math.sin(ph*0.22+order*0.7))*6:0; var fy=baseY+yo-jump; var sz=34*scl; var e=cel[(order*5+r)%cel.length], tn={c:pal[(i+r)%pal.length],hairTop:(e&&e.pose==='standing')?15:0}, frame=Math.floor(ph*0.35+order*2); if(r===rows.length-1){ ctx.save(); ctx.globalAlpha=fade*0.28*a; ctx.fillStyle='#000'; ctx.translate(fx,baseY+2); ctx.scale(1,0.34); ctx.beginPath(); ctx.arc(0,0,sz*0.42*a,0,6.283); ctx.fill(); ctx.restore(); } if(pop>0.02){ ctx.globalAlpha=fade*al; _fanTint(e.img,fx,fy,Math.round(sz*pop),frame,tn,false); } } } ctx.globalAlpha=1; ctx.restore(); } function _heroFrame(img,frame,nm,kitCols,flip){ if(!img||!img.complete||!img.naturalWidth) return null; var fw=48, nf=Math.max(1,Math.floor(img.naturalWidth/fw)), f=((frame%nf)+nf)%nf; if(!window._heroCache) window._heroCache={}; var _hcK=(img.src||'')+'|'+f+'|'+nm+'|'+((kitCols||[]).join(','))+'|'+(flip?1:0); if(window._heroCache[_hcK]) return window._heroCache[_hcK]; if(!window._gflag) window._gflag={}; var FW=72,FH=46, off=window._gflag[nm]; if(!off){ off=document.createElement('canvas'); off.width=FW; off.height=FH; var og=off.getContext('2d'); og.imageSmoothingEnabled=false; _paintFlag(og,0,0,FW,FH,nm); window._gflag[nm]=off; } var fdata=off.getContext('2d').getImageData(0,0,FW,FH).data; var cv=document.createElement('canvas'); cv.width=48; cv.height=48; var c=cv.getContext('2d'); c.imageSmoothingEnabled=false; c.drawImage(img,f*fw,0,fw,48,0,0,48,48); function _hx(h){ h=(''+h).replace('#',''); if(h.length===3) h=h.charAt(0)+h.charAt(0)+h.charAt(1)+h.charAt(1)+h.charAt(2)+h.charAt(2); return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; } var kc=(kitCols&&kitCols.length?kitCols:['#cccccc']).map(_hx); try{ var id=c.getImageData(0,0,48,48), d=id.data, FY=20; var minx=48,maxx=0,miny=48,maxy=0,any=false, sminx=48,smaxx=0; for(var i=0;i<d.length;i+=4){ if(d[i+3]<8) continue; var r=d[i],g2=d[i+1],b=d[i+2],mx=Math.max(r,g2,b),mn=Math.min(r,g2,b),sat=mx===0?0:(mx-mn)/mx,lum=(r+g2+b)/3; if(sat<0.22&&lum>60&&lum<236){ var q=i/4, px=q%48, py=(q-px)/48; if(py<FY){ if(px<minx)minx=px; if(px>maxx)maxx=px; if(py<miny)miny=py; if(py>maxy)maxy=py; any=true; } else { if(px<sminx)sminx=px; if(px>smaxx)smaxx=px; } } } var bw=Math.max(1,maxx-minx+1), bh=Math.max(1,maxy-miny+1), sbw=Math.max(1,smaxx-sminx+1), sn=kc.length; for(var j=0;j<d.length;j+=4){ if(d[j+3]<8) continue; var r2=d[j],g3=d[j+1],b2=d[j+2],mx2=Math.max(r2,g3,b2),mn2=Math.min(r2,g3,b2),sat2=mx2===0?0:(mx2-mn2)/mx2,lum2=(r2+g3+b2)/3; if(!(sat2<0.22&&lum2>60&&lum2<236)) continue; var q2=j/4, px2=q2%48, py2=(q2-px2)/48, col; if(py2<FY&&any){ var u=(px2-minx)/bw, v=(py2-miny)/bh; if(flip) u=1-u; var sx=Math.min(FW-1,Math.max(0,Math.floor(u*FW))), sy=Math.min(FH-1,Math.max(0,Math.floor(v*FH))), fi=(sy*FW+sx)*4; col=[fdata[fi],fdata[fi+1],fdata[fi+2]]; } else { col=kc[0]; } var k=Math.min(1.18,lum2/255+0.52); d[j]=Math.min(255,Math.round(col[0]*k)); d[j+1]=Math.min(255,Math.round(col[1]*k)); d[j+2]=Math.min(255,Math.round(col[2]*k)); } c.putImageData(id,0,0); }catch(e){} window._heroCache[_hcK]=cv; return cv; } function _paintFlag(g,x,y,w,h,nm){ function fill(a){ g.fillStyle=a; g.fillRect(x,y,w,h); } function H3(a,b,c){ g.fillStyle=a;g.fillRect(x,y,w,Math.ceil(h/3)); g.fillStyle=b;g.fillRect(x,y+h/3,w,Math.ceil(h/3)); g.fillStyle=c;g.fillRect(x,y+2*h/3,w,h-2*Math.floor(h/3)); } function V3(a,b,c){ g.fillStyle=a;g.fillRect(x,y,Math.ceil(w/3),h); g.fillStyle=b;g.fillRect(x+w/3,y,Math.ceil(w/3),h); g.fillStyle=c;g.fillRect(x+2*w/3,y,w-2*Math.floor(w/3),h); } function disc(cx,cy,r,col){ g.fillStyle=col; g.beginPath(); g.arc(cx,cy,r,0,6.283); g.fill(); } function star(cx,cy,r,col){ g.fillStyle=col; g.beginPath(); for(var i=0;i<10;i++){ var ra=(i%2===0)?r:r*0.45, an=-1.5708+i*0.62832; if(i===0) g.moveTo(cx+Math.cos(an)*ra,cy+Math.sin(an)*ra); else g.lineTo(cx+Math.cos(an)*ra,cy+Math.sin(an)*ra); } g.closePath(); g.fill(); } if(nm==='France'){ V3('#0055a4','#ffffff','#ef4135'); } else if(nm==='Italy'){ V3('#008c45','#ffffff','#cd212a'); } else if(nm==='Belgium'){ V3('#111111','#fae042','#ed2939'); } else if(nm==='Mexico'){ V3('#006847','#ffffff','#ce1126'); disc(x+w/2,y+h/2,h*0.1,'#8b5a2b'); } else if(nm==='Germany'){ H3('#111111','#dd0000','#ffce00'); } else if(nm==='Netherlands'){ H3('#ae1c28','#ffffff','#21468b'); } else if(nm==='Spain'){ H3('#aa151b','#f1bf00','#aa151b'); } else if(nm==='Argentina'){ H3('#74acdf','#ffffff','#74acdf'); disc(x+w/2,y+h/2,h*0.13,'#f6b40e'); } else if(nm==='Croatia'){ H3('#ff0000','#ffffff','#171796'); } else if(nm==='Senegal'){ V3('#00853f','#fdef42','#e31b23'); star(x+w/2,y+h/2,h*0.18,'#00853f'); } else if(nm==='Portugal'){ g.fillStyle='#046a38'; g.fillRect(x,y,w*0.4,h); g.fillStyle='#da291c'; g.fillRect(x+w*0.4,y,w-w*0.4,h); disc(x+w*0.4,y+h/2,h*0.14,'#ffd23f'); } else if(nm==='Japan'){ fill('#ffffff'); disc(x+w/2,y+h/2,h*0.28,'#bc002d'); } else if(nm==='England'){ fill('#ffffff'); g.fillStyle='#cf142b'; var te=Math.max(2,h*0.16); g.fillRect(x,y+h/2-te/2,w,te); g.fillRect(x+w/2-te/2,y,te,h); } else if(nm==='Iceland'){ fill('#02529c'); var vx=x+w*0.36, tw=Math.max(3,h*0.22), tr=Math.max(1,h*0.1); g.fillStyle='#ffffff'; g.fillRect(x,y+h/2-tw/2,w,tw); g.fillRect(vx-tw/2,y,tw,h); g.fillStyle='#dc1e35'; g.fillRect(x,y+h/2-tr/2,w,tr); g.fillRect(vx-tr/2,y,tr,h); } else if(nm==='USA'){ var ns=7; for(var u=0;u<ns;u++){ g.fillStyle=(u%2===0)?'#b22234':'#ffffff'; g.fillRect(x,y+h*u/ns,w,Math.ceil(h/ns)); } g.fillStyle='#3c3b6e'; g.fillRect(x,y,w*0.42,h*0.54); } else if(nm==='Brazil'){ fill('#009c3b'); g.save(); g.translate(x+w/2,y+h/2); g.rotate(0.7854); g.fillStyle='#ffdf00'; var dd=Math.min(w,h)*0.34; g.fillRect(-dd,-dd,dd*2,dd*2); g.restore(); disc(x+w/2,y+h/2,h*0.19,'#002776'); } else { fill('#8899aa'); } } function drawGoalFlag(){ if(banner<=0) return; var side=bannerTeam; if(!side||!teamKits[side]) return; var nm=teamKits[side].name; if(!window._gflag) window._gflag={}; var FW=72, FH=46, off=window._gflag[nm]; if(!off){ off=document.createElement('canvas'); off.width=FW; off.height=FH; var og=off.getContext('2d'); og.imageSmoothingEnabled=false; _paintFlag(og,0,0,FW,FH,nm); window._gflag[nm]=off; } var ph=110-banner, appear=Math.max(0,Math.min(1,ph/10)), fade=Math.min(1,banner/16)*appear; var sc=0.72+0.28*appear, dh=Math.round(H*0.3*sc), dw=Math.round(dh*FW/FH), cx=W/2, ox=Math.round(cx-dw/2), oy=Math.round(OY+5); ctx.save(); ctx.globalAlpha=fade; ctx.fillStyle='rgba(38,28,16,0.9)'; ctx.fillRect(ox-2,oy-2,2,dh+7); for(var c=0;c<dw;c++){ var t2=c/dw, wv=Math.sin(ph*0.14+t2*6.0)*2.6*t2; ctx.drawImage(off, t2*FW,0, Math.max(0.5,FW/dw),FH, ox+c, oy+wv, 1, dh); } ctx.restore(); } function drawBanner(){
      const t=banner, appear=Math.min(1,(110-t)/8), scale=0.55+appear*0.45+Math.sin((110-t)*0.3)*0.02;
      const side=bannerTeam, tc=primary(side);
      ctx.save(); ctx.translate(W/2,H/2); ctx.scale(scale,scale);
      ctx.fillStyle='rgba(16,10,6,0.86)'; ctx.fillRect(-W/2,-30,W,60);
      ctx.fillStyle=tc; ctx.fillRect(-W/2,-30,W,4); ctx.fillRect(-W/2,26,W,4);
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.font="bold 22px 'Press Start 2P', monospace";
      ctx.lineWidth=5; ctx.strokeStyle='#120a06'; ctx.strokeText('GOAL!',0,-6);
      ctx.fillStyle='#f4e9c8'; ctx.fillText('GOAL!',0,-7);
      ctx.font="9px 'Press Start 2P', monospace";
      ctx.lineWidth=3; ctx.strokeStyle='#120a06'; ctx.strokeText(teamKits[side].name.toUpperCase(),0,13);
      ctx.fillStyle=tc; ctx.fillText(teamKits[side].name.toUpperCase(),0,12);
      ctx.restore();
    }

    function updateFX(){
      frameTick++;
      if(turnFlash>0) turnFlash--;
      if(_drillDisp&&_drillDisp.length&&!moving){ for(var _di=_drillDisp.length-1;_di>=0;_di--){ var _dn=_drillDisp[_di]; if(!_dn||!_dn._drillHome){ _drillDisp.splice(_di,1); continue; } _dn.x+=(_dn._drillHome.x-_dn.x)*0.25; _dn.y+=(_dn._drillHome.y-_dn.y)*0.25; if(Math.hypot(_dn._drillHome.x-_dn.x,_dn._drillHome.y-_dn.y)<0.5){ _dn.x=_dn._drillHome.x; _dn.y=_dn._drillHome.y; _dn._drillHome=null; _drillDisp.splice(_di,1); } } }
      if(shake>0){ shake*=0.86; if(shake<0.3) shake=0; }
      if(goalFlash>0) goalFlash--;
      if(goalSlow>0) goalSlow--;
      if(coin&&coin.squish>0) coin.squish--;
      if(turnFx>0) turnFx--;
      if(castFx>0) castFx--;
      if(banner>0) banner--;
      if(netHold>0){ netHold--; } else if(netBulge>0){ netVel+=(0-netBulge)*0.25; netVel*=0.6; netBulge+=netVel; if(netBulge<0.15&&Math.abs(netVel)<0.15){ netBulge=0; netVel=0; } }
      if(confetti.length){ for(const p of confetti){ p.x+=p.vx; p.y+=p.vy; p.vy+=0.14; p.vx*=0.99; p.life--; } confetti=confetti.filter(p=>p.life>0&&p.y<H+10); }
      if(hitSparks.length){ for(const p of hitSparks){ p.x+=p.vx; p.y+=p.vy; p.vx*=0.9; p.vy*=0.9; p.life--; } hitSparks=hitSparks.filter(p=>p.life>0); }
      if(shotTrail.length){ for(const t of shotTrail) t.life--; shotTrail=shotTrail.filter(t=>t.life>0); }
    }

    // fixed-timestep loop for consistent motion
    let accumulator=0; const FRAME_MS=1000/60;
    function loop(ts){
      ts=ts||performance.now();
      if(!lastT) lastT=ts;
      let delta=Math.min(50, ts-lastT); lastT=ts; if(paused){ draw(ts); requestAnimationFrame(loop); return; }
      if(timerRunning&&phase==='play'&&!winner){ matchMs+=delta; if(matchLen>0&&!timeUp){ var _sl=Math.ceil((matchLen*1000-matchMs)/1000); if(_sl<=10&&_sl>0&&_sl!==_lastTick){ _lastTick=_sl; try{ sfxTick(_sl<=3); }catch(e){} } } if(matchLen>0&&!timeUp&&matchMs>=matchLen*1000){ matchMs=matchLen*1000; timeUp=true; onTimeUp(); } }
      var _tScale=(typeof nsCamS!=='undefined'&&nsCamS.on&&!scoring)?0.4:1; if(typeof goalSlow!=='undefined'&&goalSlow>0) _tScale=Math.min(_tScale,0.5); accumulator+=delta*_tScale;
      while(accumulator>=FRAME_MS){ if(hitStop>0){ hitStop--; } else { stepPhysics(); updateGoalies(); } updateFX(); accumulator-=FRAME_MS; }
      maybeAI(delta); if(pen&&pen.active) penTick(); try{ royFlipperTick(delta); }catch(e){} try{ royGeyserTick(delta); }catch(e){} try{ royDevilTick(delta); }catch(e){} try{ royLaserTick(delta); }catch(e){} try{ royWallTick(delta); }catch(e){} try{ roySpiderTick(delta); }catch(e){} try{ royCrateTick(delta); }catch(e){} try{ royPortcTick(delta); }catch(e){} try{ royBoulderTick(delta); }catch(e){} if(royBlizzard()){ var _ps=Math.sin(royGustPhase); royGustPhase+=ROY_GUST_FREQ; if(_ps<=0 && Math.sin(royGustPhase)>0) royGustDir=Math.random()*6.2832; } try{ nsCam(delta); }catch(e){}
      draw(ts);
      requestAnimationFrame(loop);
    }

