    // ================= AQUARIUM (crystal pitch: the sea & its creatures live under the glass) =================
    // Dave-the-Diver-flavoured reef life swimming beneath a transparent crystal pitch.

    // --- sprites ---------------------------------------------------------------
    // A single reef fish facing right at the origin; caller flips for direction.
    function drawReefFish(x,y,flip,now,f,phase){
      ctx.save(); ctx.translate(Math.round(x),Math.round(y)); if(flip) ctx.scale(-1,1);
      const wag=Math.sin(now*0.02+phase), L=f.len, Hh=f.ht;
      // tail fin (wags)
      const ty=wag*Hh*0.35;
      ctx.fillStyle=f.fin; ctx.beginPath(); ctx.moveTo(-L*0.42,0); ctx.lineTo(-L*0.5-Hh*0.55,-Hh*0.5+ty); ctx.lineTo(-L*0.5-Hh*0.55,Hh*0.5+ty); ctx.closePath(); ctx.fill();
      // dorsal fin
      ctx.beginPath(); ctx.moveTo(-L*0.12,-Hh*0.42); ctx.lineTo(L*0.12,-Hh*0.82-wag*1.2); ctx.lineTo(L*0.28,-Hh*0.4); ctx.closePath(); ctx.fill();
      // body
      ctx.fillStyle=f.body; ctx.beginPath(); ctx.ellipse(0,0,L*0.5,Hh*0.5,0,0,6.283); ctx.fill();
      // pale belly
      ctx.fillStyle=f.belly; ctx.beginPath(); ctx.ellipse(-L*0.02,Hh*0.18,L*0.4,Hh*0.28,0,0,6.283); ctx.fill();
      // stripes
      if(f.stripe){ ctx.fillStyle=f.stripe; for(let s=-1;s<=1;s++){ const sx=s*L*0.17; ctx.fillRect(Math.round(sx),Math.round(-Hh*0.42),1,Math.max(1,Math.round(Hh*0.84))); } }
      // eye
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(L*0.28,-Hh*0.08,Math.max(1,Hh*0.16),0,6.283); ctx.fill();
      ctx.fillStyle='#0a1418'; ctx.beginPath(); ctx.arc(L*0.31,-Hh*0.08,Math.max(0.7,Hh*0.09),0,6.283); ctx.fill();
      ctx.restore();
    }
    // Drifting translucent jellyfish (pulsing bell + trailing tentacles).
    function drawJelly(x,y,sz,col,now,phase){
      ctx.save(); ctx.translate(Math.round(x),Math.round(y));
      const pulse=0.5+0.5*Math.sin(now*0.004+phase), w=sz*(0.9+pulse*0.18);
      ctx.fillStyle=col;
      ctx.beginPath(); ctx.ellipse(0,0,w,sz*0.8,0,Math.PI,0); ctx.fill();
      ctx.fillRect(-w,-1,w*2,2);
      ctx.strokeStyle=col; ctx.lineWidth=1;
      for(let t=-2;t<=2;t++){ let tx=t*w*0.32; ctx.beginPath(); ctx.moveTo(tx,0); for(let k=1;k<=sz*1.7;k+=2){ tx+=Math.sin(now*0.006+phase+t+k*0.28)*0.5; ctx.lineTo(tx,k);} ctx.stroke(); }
      ctx.restore();
    }
    // Distant silhouette fish for the surrounding tank water (drawn in the surround).
    function drawBgFish(x,y,sz,col,flip,phase,now){
      ctx.save(); ctx.translate(Math.round(x),Math.round(y)); if(flip) ctx.scale(-1,1);
      const wag=Math.sin(now*0.015+phase); ctx.fillStyle=col;
      ctx.beginPath(); ctx.ellipse(0,0,sz,sz*0.52,0,0,6.283); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-sz*0.8,0); ctx.lineTo(-sz-sz*0.6,-sz*0.5+wag*sz*0.3); ctx.lineTo(-sz-sz*0.6,sz*0.5+wag*sz*0.3); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    // --- animated under-glass layer -------------------------------------------
    const AQ_SPECIES=[
      {len:12,ht:7,body:'#ff8a3a',belly:'#ffd8b0',fin:'#e85a1a',stripe:'#fff2e0'}, // clownfish
      {len:13,ht:8,body:'#2b9be0',belly:'#8fd8ff',fin:'#ffd23a',stripe:null},      // blue tang
      {len:10,ht:8,body:'#ffd23a',belly:'#ffeda0',fin:'#e0a020',stripe:null},      // yellow tang
      {len:11,ht:9,body:'#b06ad0',belly:'#e6bcf2',fin:'#7a3aa0',stripe:'#ffe6ff'}, // angelfish
      {len:15,ht:7,body:'#e0596a',belly:'#ffb8c0',fin:'#a03040',stripe:null},      // snapper
      {len:9, ht:9,body:'#7ad0a0',belly:'#c8f2d8',fin:'#3a9060',stripe:null}       // puffer
    ];
    let _aqInit=false, _aqReef=[], _aqJelly=[], _aqBub=[], _aqFry=[], _aqFryOff={x:0,y:0};
    function _aqEnsure(){
      if(_aqInit) return; _aqInit=true;
      const IN=WALL+3, w=W-WALL*2-6, h=H-WALL*2-6;
      for(let i=0;i<9;i++){ const sp=AQ_SPECIES[i%AQ_SPECIES.length], d=0.55+Math.random()*0.6;
        _aqReef.push({sp, x:IN+Math.random()*w, y:IN+Math.random()*h, vx:(Math.random()<0.5?-1:1)*(0.16+Math.random()*0.34)*d, vy:(Math.random()-0.5)*0.12, ph:Math.random()*6.28, d}); }
      const jc=['rgba(255,178,220,0.42)','rgba(180,212,255,0.42)','rgba(205,182,255,0.42)'];
      for(let i=0;i<3;i++) _aqJelly.push({x:IN+Math.random()*w, y:IN+Math.random()*h, sz:5+Math.random()*4, vy:-(0.05+Math.random()*0.08), col:jc[i%3], ph:Math.random()*6.28});
      for(let i=0;i<20;i++) _aqBub.push({x:IN+Math.random()*w, y:IN+Math.random()*h, vy:0.2+Math.random()*0.36, sz:Math.random()<0.35?2:1, dr:Math.random()*6.28});
      // a small school of fry that swims as a loose cluster
      for(let i=0;i<10;i++) _aqFry.push({off:i*0.62, r:6+Math.random()*5, ph:Math.random()*6.28});
    }
    function drawAquariumFX(ctx,now){
      _aqEnsure();
      const IN=WALL, w=W-WALL*2, h=H-WALL*2;
      // the flicked ball spooks the sea life: a fast-moving coin nearby sends fish darting away
      let bx=-999,by=-999,bsp=0,flick=false;
      try{ if(typeof coin!=='undefined'&&coin&&(typeof phase==='undefined'||phase==='play')){ bx=coin.x; by=coin.y; bsp=Math.hypot(coin.vx||0,coin.vy||0); flick=bsp>1.4; } }catch(e){}
      ctx.save(); ctx.beginPath(); ctx.rect(IN,IN,w,h); ctx.clip();

      // shafts of sunlight / caustics rippling across the sea floor
      ctx.save(); ctx.globalCompositeOperation='lighter';
      for(let c=0;c<5;c++){ const cx=IN+(((now*0.012*(c*0.5+1))+c*0.23*w)%(w+50))-25, cy=IN+h*(0.12+0.18*c)+Math.sin(now*0.001+c)*10, rad=24+c*6;
        const rg=ctx.createRadialGradient(cx,cy,2,cx,cy,rad); rg.addColorStop(0,'rgba(150,236,255,0.08)'); rg.addColorStop(1,'rgba(150,236,255,0)'); ctx.fillStyle=rg; ctx.fillRect(cx-rad,cy-rad,rad*2,rad*2); }
      ctx.restore();

      // jellyfish (deep, drifting up) — also nudged aside by a nearby flick
      for(const J of _aqJelly){ J.y+=J.vy; J.x+=Math.sin(now*0.001+J.ph)*0.14; if(flick){ const dx=J.x-bx,dy=J.y-by,dd=Math.hypot(dx,dy)||0.001; if(dd<56){ J.x+=dx/dd*0.8; J.y+=dy/dd*0.8; } } if(J.y<IN-8){ J.y=IN+h+8; J.x=IN+4+Math.random()*(w-8); } drawJelly(J.x,J.y,J.sz,J.col,now,J.ph); }

      // schooling fry — tiny darting dots that scatter away from the flicked ball
      let fcx=IN+w*0.5+Math.sin(now*0.0006)*w*0.32, fcy=IN+h*0.5+Math.cos(now*0.0009)*h*0.3;
      if(flick){ const dx=fcx-bx,dy=fcy-by,dc=Math.hypot(dx,dy)||0.001; if(dc<58){ _aqFryOff.x+=dx/dc*4.5; _aqFryOff.y+=dy/dc*4.5; } }
      _aqFryOff.x*=0.9; _aqFryOff.y*=0.9; fcx+=_aqFryOff.x; fcy+=_aqFryOff.y;
      const frySpread=1+Math.min(2.4,(Math.abs(_aqFryOff.x)+Math.abs(_aqFryOff.y))*0.08);
      ctx.fillStyle='rgba(255,236,170,0.62)';
      for(const p of _aqFry){ const fx=fcx+Math.cos(now*0.004+p.off)*p.r*2.2*frySpread, fy=fcy+Math.sin(now*0.005+p.off)*p.r*frySpread+Math.sin(now*0.02+p.ph)*1.2; ctx.fillRect(Math.round(fx),Math.round(fy),1,1); ctx.fillRect(Math.round(fx)-1,Math.round(fy),1,1); }

      // reef fish — flee the flicked ball, then ease back to a calm cruise; bounce off the crystal walls
      for(const F of _aqReef){
        F.scare=(F.scare||0)*0.93;
        if(flick){ const dx=F.x-bx,dy=F.y-by,dd=Math.hypot(dx,dy)||0.001, R=52+bsp*3.2;
          if(dd<R){ const push=(1-dd/R)*(0.7+bsp*0.08); F.vx+=dx/dd*push; F.vy+=dy/dd*push; F.scare=Math.min(1,F.scare+0.7); } }
        const spd=Math.hypot(F.vx,F.vy);
        if(F.scare>0.05){ const mx=2.6; if(spd>mx){ F.vx*=mx/spd; F.vy*=mx/spd; } }
        else if(spd>0.001){ const tgt=0.16+F.d*0.2, ns=spd+(tgt-spd)*0.04; F.vx*=ns/spd; F.vy*=ns/spd; }
        F.x+=F.vx; F.y+=F.vy+(F.scare>0.05?0:Math.sin(now*0.003+F.ph)*0.09);
        if(F.x<IN+5){ F.vx=Math.abs(F.vx); } if(F.x>IN+w-5){ F.vx=-Math.abs(F.vx); }
        if(F.y<IN+6){ F.vy=Math.abs(F.vy); } if(F.y>IN+h-6){ F.vy=-Math.abs(F.vy); }
        ctx.globalAlpha=0.34+F.d*0.24; drawReefFish(F.x,F.y,F.vx<0,now,F.sp,F.ph); }
      ctx.globalAlpha=1;

      // rising bubbles
      ctx.fillStyle='rgba(202,244,255,0.42)';
      for(const B of _aqBub){ B.y-=B.vy; B.x+=Math.sin(now*0.004+B.dr)*0.2; if(B.y<IN){ B.y=IN+h; B.x=IN+Math.random()*w; } ctx.fillRect(Math.round(B.x),Math.round(B.y),B.sz,B.sz); }

      // frosted crystal — a pale haze that sinks the sea life deeper behind the glass so the
      // coin, nails & tokens resting on top always read clearly against it
      ctx.fillStyle='rgba(150,196,222,0.26)'; ctx.fillRect(IN,IN,w,h);

      ctx.restore();

      // crystal sheen on top — a slow light sweep so the pitch reads as glass
      ctx.save(); ctx.beginPath(); ctx.rect(IN,IN,w,h); ctx.clip(); ctx.globalCompositeOperation='lighter';
      const sy=IN+((now*0.028)%h), bh=18;
      const lg=ctx.createLinearGradient(0,sy-bh,0,sy+bh); lg.addColorStop(0,'rgba(210,246,255,0)'); lg.addColorStop(0.5,'rgba(210,246,255,0.07)'); lg.addColorStop(1,'rgba(210,246,255,0)');
      ctx.fillStyle=lg; ctx.fillRect(IN,sy-bh,w,bh*2);
      // faint fixed corner glare where light catches the glass
      const cg=ctx.createRadialGradient(IN+w*0.28,IN+h*0.2,4,IN+w*0.28,IN+h*0.2,h*0.4); cg.addColorStop(0,'rgba(255,255,255,0.05)'); cg.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle=cg; ctx.fillRect(IN,IN,w,h);
      ctx.restore();
    }

