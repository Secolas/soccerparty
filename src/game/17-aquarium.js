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
    let _aqInit=false, _aqReef=[], _aqJelly=[], _aqBub=[], _aqFry=[], _aqFryOff={x:0,y:0}, _aqPrevBsp=0, _aqPulse=null;
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
      // the disturbance is the FLICK itself — the moment the ball is struck away from (near) rest.
      // We spook the water only around that launch spot, not along the whole flight path.
      let bx=-999,by=-999,bsp=0;
      try{ if(typeof coin!=='undefined'&&coin&&(typeof phase==='undefined'||phase==='play')){ bx=coin.x; by=coin.y; bsp=Math.hypot(coin.vx||0,coin.vy||0); } }catch(e){}
      if(bsp>1.6 && _aqPrevBsp<0.8){ _aqPulse={x:bx,y:by,life:8,life0:8}; }   // launch detected → ripple at the flick spot
      _aqPrevBsp=bsp;
      const pulse=(_aqPulse&&_aqPulse.life>0)?_aqPulse:null;
      if(_aqPulse){ _aqPulse.life--; if(_aqPulse.life<=0) _aqPulse=null; }
      ctx.save(); ctx.beginPath(); ctx.rect(IN,IN,w,h); ctx.clip();

      // shafts of sunlight / caustics rippling across the sea floor
      ctx.save(); ctx.globalCompositeOperation='lighter';
      for(let c=0;c<5;c++){ const cx=IN+(((now*0.012*(c*0.5+1))+c*0.23*w)%(w+50))-25, cy=IN+h*(0.12+0.18*c)+Math.sin(now*0.001+c)*10, rad=24+c*6;
        const rg=ctx.createRadialGradient(cx,cy,2,cx,cy,rad); rg.addColorStop(0,'rgba(150,236,255,0.08)'); rg.addColorStop(1,'rgba(150,236,255,0)'); ctx.fillStyle=rg; ctx.fillRect(cx-rad,cy-rad,rad*2,rad*2); }
      ctx.restore();

      // small startle zone around the spot the ball was flicked from
      const startleR = 30, pStr = pulse ? (pulse.life/pulse.life0) : 0, px = pulse?pulse.x:0, py = pulse?pulse.y:0;

      // jellyfish (deep, drifting up) — gently shoved aside if the flick happened close
      for(const J of _aqJelly){ J.y+=J.vy; J.x+=Math.sin(now*0.001+J.ph)*0.14; if(pulse){ const dx=J.x-px,dy=J.y-py,dd=Math.hypot(dx,dy)||0.001; if(dd<startleR){ const k=(1-dd/startleR)*0.5*pStr; J.x+=dx/dd*k; J.y+=dy/dd*k; } } if(J.y<IN-8){ J.y=IN+h+8; J.x=IN+4+Math.random()*(w-8); } drawJelly(J.x,J.y,J.sz,J.col,now,J.ph); }

      // schooling fry — scatter only if the ball was flicked from within the shoal, then regroup (drag)
      let fcx=IN+w*0.5+Math.sin(now*0.0006)*w*0.32, fcy=IN+h*0.5+Math.cos(now*0.0009)*h*0.3;
      if(pulse){ const dx=fcx-px,dy=fcy-py,dc=Math.hypot(dx,dy)||0.001; if(dc<startleR+10){ const k=(1-dc/(startleR+10))*3.0*pStr; _aqFryOff.x+=dx/dc*k; _aqFryOff.y+=dy/dc*k; } }
      _aqFryOff.x*=0.9; _aqFryOff.y*=0.9; fcx+=_aqFryOff.x; fcy+=_aqFryOff.y;
      const frySpread=1+Math.min(1.8,(Math.abs(_aqFryOff.x)+Math.abs(_aqFryOff.y))*0.06);
      ctx.fillStyle='rgba(255,236,170,0.62)';
      for(const p of _aqFry){ const fx=fcx+Math.cos(now*0.004+p.off)*p.r*2.2*frySpread, fy=fcy+Math.sin(now*0.005+p.off)*p.r*frySpread+Math.sin(now*0.02+p.ph)*1.2; ctx.fillRect(Math.round(fx),Math.round(fy),1,1); ctx.fillRect(Math.round(fx)-1,Math.round(fy),1,1); }

      // reef fish — startle only for fish near the spot the ball was flicked from, then a physical
      // burst-and-glide: a fish turns and darts SIDEWAYS along its swimming axis (fish don't
      // rocket straight up), water drag bleeds the dash off, and it settles back to a slow cruise
      const DRAG=0.93;
      for(const F of _aqReef){
        F.fear=(F.fear||0)*0.95;
        if(pulse){ const dx=F.x-px,dy=F.y-py,dd=Math.hypot(dx,dy)||0.001;
          if(dd<startleR){
            // escape mostly to the left/right (away from the flick spot), with only a slight vertical tilt
            let ax=(Math.abs(dx)>3)?Math.sign(dx):(F.vx>=0?1:-1), ay=(dy/dd)*0.35;
            const m=Math.hypot(ax,ay)||1; ax/=m; ay/=m;
            const kick=(1-dd/startleR)*0.6*pStr;
            F.vx+=ax*kick; F.vy+=ay*kick; F.fear=Math.min(1,F.fear+0.8);
          } }
        const spd=Math.hypot(F.vx,F.vy)||0.001, tgt=0.14+F.d*0.16;
        if(F.fear>0.06 && spd>tgt){ F.vx*=DRAG; F.vy*=DRAG; const MX=1.3; if(spd>MX){ F.vx*=MX/spd; F.vy*=MX/spd; } }   // gliding down from the dash
        else { const ns=spd+(tgt-spd)*0.03; F.vx*=ns/spd; F.vy*=ns/spd; }                                              // relaxed cruise
        F.x+=F.vx; F.y+=F.vy+(F.fear>0.06?0:Math.sin(now*0.003+F.ph)*0.08);
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

