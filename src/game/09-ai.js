    // ================= AI OPPONENT =================
    // The CPU switches shot styles the way a human can via the toggle: when it
    // holds both Curveball + Serpent, it turns on Curveball to bend around a
    // defender blocking the lane to goal, and Serpent otherwise.
    function aiPickShotMod(){ var sd=current;
    var arr=(sideAb&&sideAb[sd])||[];
    if(arr.indexOf('curve')<0 || arr.indexOf('serpent')<0) return;
    if(!abOff[sd]) abOff[sd]=[];
    var gy=(sd==='red')?(NET_DEPTH+COIN_R+1):(H-NET_DEPTH-COIN_R-1), gx=W/2, vx=gx-coin.x, vy=gy-coin.y, seg=(vx*vx+vy*vy)||1, blocked=false;
    for(var n=0;n<nails.length;n++){ var nn=nails[n];
    if(nn.goalie||nn.team===sd) continue;
    var wx=nn.x-coin.x, wy=nn.y-coin.y, tt=Math.max(0,Math.min(1,(wx*vx+wy*vy)/seg)), cx=coin.x+tt*vx, cy=coin.y+tt*vy;
    if(Math.hypot(nn.x-cx,nn.y-cy)<NAIL_R+COIN_R+6){ blocked=true;
    break; } } var want=blocked?'curve':'serpent', other=blocked?'serpent':'curve';
    var oi=abOff[sd].indexOf(want);
    if(oi>=0) abOff[sd].splice(oi,1);
    if(abOff[sd].indexOf(other)<0) abOff[sd].push(other);
    try{ applyTactics(); }catch(e){} try{ syncSlots();
    }catch(e){} }
    // Compute the CPU's shot (target, angle, speed, curve spin, drunk jitter) WITHOUT touching the ball,
    // and return it as a plain object. Split out so the aim telegraph can lock the shot in at think-start
    // and render the very shot that will be released. aiPickShotMod runs here (it decides curve vs serpent).
    function aiComputeShot(){
      try{ aiPickShotMod(); }catch(e){}
      const t=current;
      if(pen&&pen.active){ var _Z=['L',
      'C','R']; var _kp=pen.dive;
      var _sp=aiLevel==='hard'?0.9:(aiLevel==='med'?0.6:0.3);
      var _pick; if(Math.random()<_sp){ var _aw=[];
      for(var _i=0;_i<3;_i++){ if(_Z[_i]!==_kp) _aw.push(_Z[_i]);
      } _pick=_aw[Math.floor(Math.random()*_aw.length)];
      } else { _pick=_Z[Math.floor(Math.random()*3)];
      } var _off=(GOAL_W/2)*(aiLevel==='hard'?0.9:(aiLevel==='med'?0.78:0.5));
      var _bx=W/2+(_pick==='L'?-_off:(_pick==='R'?_off:0));
      var _err=aiLevel==='hard'?4:(aiLevel==='med'?9:16);
      var _gx=_bx+(Math.random()*2-1)*_err;
      var _gy=t==='red'?NET_DEPTH+COIN_R+1:H-NET_DEPTH-COIN_R-1;
      var _dx=_gx-coin.x,_dy=_gy-coin.y,_di=Math.hypot(_dx,_dy),_ang=Math.atan2(_dy,_dx);
      var _spd=Math.min(5.1,Math.max(4.2,_di*0.05+3.0));
      return {pen:true, vx:Math.cos(_ang)*_spd, vy:Math.sin(_ang)*_spd}; }
      let goalY = t==='red' ? NET_DEPTH+COIN_R+1 : H-NET_DEPTH-COIN_R-1;
      let spread=(GOAL_W*0.5-2)*(1-AI_ACC[aiLevel])*(TAC.laser?0.30:1);
      let goalX=W/2+(Math.random()*2-1)*spread;
      // THE HARDWOOD: a shot only counts if it went through a hoop, so aim at the hoop that best
      // lines up with the run at goal instead of the goal mouth. Without this the CPU keeps having
      // goals waved off and the rim rule quietly becomes a one-sided advantage for the player.
      var _rimT=null; try{ if(typeof bkAimTarget==='function') _rimT=bkAimTarget(t); }catch(e){}
      if(_rimT){ spread=Math.min(spread,_rimT.half*0.45);
      goalX=_rimT.x+(Math.random()*2-1)*spread; goalY=_rimT.y; }
      // CENTRE COURT: the net cannot be beaten along the ground. Aim down an open side lane (a curve
      // then bends it back at goal) or onto a live racket that will lob it over. With Chip the plan is
      // null and it shoots straight at goal, lifting the ball in flight instead — see aiMaybeChip.
      var _tnP=null; try{ if(typeof tnAimPlan==='function') _tnP=tnAimPlan(t); }catch(e){}
      if(_tnP){ spread=Math.min(spread,_tnP.kind==='lane'?3.2:4.5);
      goalX=_tnP.x+(Math.random()*2-1)*spread; goalY=_tnP.y; }
      // CRAZY GOLF: the one real lesson is DO NOT SHOOT INTO THE POND — the goal centre sits behind the
      // water on this layout, so left alone the CPU drowns its own possession every turn. cgAimPlan routes
      // through the nearer flank lane when the line to goal crosses water or a tree, and takes a nearby
      // live cup when one is worth a turn (which needs a soft putt, hence the speed floor drop below).
      var _cgP=null; try{ if(typeof cgAimPlan==='function') _cgP=cgAimPlan(t); }catch(e){}
      if(_cgP){ spread=Math.min(spread,_cgP.soft?2.2:4.0);
      goalX=_cgP.x+(Math.random()*2-1)*spread; goalY=_cgP.y; }
      // These arenas gate scoring on threading something (a hoop, a lane, a racket), so a loose CPU
      // shot is simply wasted. Tighten its aim here so the ratio of wasted turns stays sane.
      var _s3=false; try{ _s3=(typeof stadiumHazards==='function')&&stadiumHazards()&&(boardKey==='tennis'||boardKey==='court'||boardKey==='baseball'||boardKey==='minigolf'); }catch(e){}
      if(_s3){ spread*=0.55; }
      let dx=goalX-coin.x, dy=goalY-coin.y;
      const dist=Math.hypot(dx,dy);
      const ang=Math.atan2(dy,dx)+(Math.random()*2-1)*AI_NOISE[aiLevel]*(TAC.laser?0.38:1)*(_s3?0.55:1);
      let speed=Math.min(FLICK_MAX,Math.max(5.0,dist*0.05+3.2)*(0.9+Math.random()*0.25))*(TAC.power||1)*staminaMul();
      // A putt at a cup has to ARRIVE dying or it skips the lip, and the roll here is v/(1-FRICTION) =
      // 62.5*v, so the speed that stops on the hole is dist/62.5 — far below the 5.0 floor above.
      if(_cgP&&_cgP.soft) speed=Math.max(1.0,Math.min(speed,(dist+10)/62.5));
      // The CPU gets the hole-out reward on the same terms the player does. Applied LAST so the soft-putt
      // cap above cannot quietly throw the free full-power flick away.
      var _fullFlick=false;
      try{ if((typeof cgFullFlick==='function')&&cgFullFlick()){ speed=FLICK_MAX*(TAC.power||1)*staminaMul(); _fullFlick=true; } }catch(e){}
      if(debuffActive(current,'freeze')) speed=Math.min(speed,FLICK_MAX*0.5);
      if(pen&&pen.active) speed=Math.min(speed,5.1);
      // curveball: the shot will bend, so pick the launch angle whose simulated curved path lands closest to the target
      var ang2=ang;
      if(TAC.curve && speed>=1.9){ var _bestA=ang,_bestD=1e9;
      for(var _ci=-9;_ci<=9;_ci++){ var _ca=ang+_ci*0.055;
      var _svx=Math.cos(_ca)*speed,_svy=Math.sin(_ca)*speed;
      var _shx=-_svx,_sd2=(_shx>0.05)?1:((_shx<-0.05)?-1:((W/2-coin.x)>=0?1:-1));
      var _ss=_sd2*((_svy<0)?1:-1)*1.9;
      var _sx=coin.x,_sy=coin.y,_md=1e9;
      for(var _st=0;_st<150;_st++){ var _ssp=Math.hypot(_svx,_svy);
      if(_ssp<0.4) break; var _px=-_svy/_ssp,_py=_svx/_ssp;
      _svx+=_px*_ss*_ssp*0.05;
      _svy+=_py*_ss*_ssp*0.05;
      var _acm=Math.hypot(_svx,_svy)||1;
      _svx=_svx/_acm*_ssp; _svy=_svy/_acm*_ssp;
      _ss*=0.984; _svx*=FRICTION;
      _svy*=FRICTION; _sx+=_svx;
      _sy+=_svy; if(_sx<WALL+COIN_R){_sx=WALL+COIN_R;
      _svx=-_svx*RESTITUTION;_ss*=0.35;
      } else if(_sx>W-WALL-COIN_R){_sx=W-WALL-COIN_R;
      _svx=-_svx*RESTITUTION;_ss*=0.35;
      } var _d=Math.hypot(_sx-goalX,_sy-goalY);
      if(_d<_md) _md=_d; if((t==='red'&&_sy<=goalY)||(t==='blue'&&_sy>=goalY)) break;
      } if(_md<_bestD){ _bestD=_md;
      _bestA=_ca; } } ang2=_bestA;
      }
      var _vx=Math.cos(ang2)*speed, _vy=Math.sin(ang2)*speed, _spin=0, _curveSfx=false;
      if(TAC.curve && speed>=1.9){ var _hx2=-_vx,_hd2=(_hx2>0.05)?1:((_hx2<-0.05)?-1:((W/2-coin.x)>=0?1:-1)); _spin=_hd2*((_vy<0)?1:-1)*1.9; _curveSfx=true; }
      if(debuffActive(current,'drunk')){ var _dj=(Math.random()-0.5)*DRUNK_SPREAD,_djc=Math.cos(_dj),_djs=Math.sin(_dj),_djx=_vx*_djc-_vy*_djs,_djy=_vx*_djs+_vy*_djc;
      _vx=_djx; _vy=_djy; }
      return {pen:false, vx:_vx, vy:_vy, spin:_spin, curveSfx:_curveSfx, fullFlick:_fullFlick};
    }
    // Apply a shot from aiComputeShot to the ball and fire the one-time side effects (curve sound, full-
    // flick spend, rewind snapshot, per-flick flag resets). Kept separate from compute so the telegraph
    // can render the locked-in shot during the wind-up, then release exactly it without recomputing.
    function aiApplyShot(shot){
      coin.spin=0; // clear residual curve from a previous curveball shot, same as a human flick does
      if(!shot) return;
      if(shot.pen){ coin.vx=shot.vx; coin.vy=shot.vy;
      flickCount++; _achBounces=0; hitOwn=false; moving=true;
      ghostUsed=false; ghosting=false; portalUsed=false; ricochetUsed=false;
      serpentPhase=0; turnFlash=Math.max(turnFlash,10); return; }
      if(shot.fullFlick){ try{ cgSpendFullFlick(); }catch(e){} }
      _rwSnap={x:coin.x,y:coin.y,team:current,flickCount:flickCount};
      coin.vx=shot.vx; coin.vy=shot.vy;
      if(shot.spin){ coin.spin=shot.spin; if(shot.curveSfx){ try{sfxCurl();}catch(e){} } }
      flickCount++; _achBounces=0;
      hitOwn=false; moving=true;
      ghostUsed=false; ghosting=false;
      portalUsed=false; ricochetUsed=false;
      _aiChipRoll=0; _camShotDone=false;
      serpentPhase=0; serpentBase=Math.atan2(coin.vy,coin.vx);
      serpentDir=1; wetBase=Math.atan2(coin.vy,coin.vx);
      wetPhase=0; drillUsed=false;
      (function(){ var _bsp=Math.hypot(coin.vx,coin.vy)||1;
      backspinFx=coin.vx/_bsp;
      backspinFy=coin.vy/_bsp;
      backspinPhase=0; })(); steerBudget=(TAC.guided?40:0);
      steerHold=null; try{ ecoFlickStart();
      }catch(e){} try{ trioReset();
      }catch(e){} turnFlash=Math.max(turnFlash,10);
    }
    function aiFlick(){ aiApplyShot(aiComputeShot()); }
    // CPU versions of the tap-to-use abilities, run once at the start of its turn
    function aiUtility(){ var t=current; if(!(aiEnabled&&aiEnabled[t])) return; var ab=sideAb[t]||[];
      // REWIND: undo the CPU's own last flick if it clearly worsened the ball's position
      if(ab.indexOf('rewind')>=0 && !rewindUsed[t] && _rwSnap && _rwSnap.team===t && !moving && !scoring && !winner){ var _rgy=(t==='red')?(NET_DEPTH+COIN_R+1):(H-NET_DEPTH-COIN_R-1);
      var _d0=Math.hypot(_rwSnap.x-W/2,_rwSnap.y-_rgy), _d1=Math.hypot(coin.x-W/2,coin.y-_rgy);
      if(_d1>_d0+55){ try{ useRewind(t);
      }catch(e){} return; } }
      if(ab.indexOf('medic')>=0 && !medicUsed[t] && (debuffActive(t,'freeze')||debuffActive(t,'drunk')||debuffActive(t,'fog')||debuffActive(t,'injury'))){ try{ useMedic(t); }catch(e){} }
      if(ab.indexOf('strategist')>=0 && !strategistUsed[t]){
        var gy=(t==='red')?(H-NET_DEPTH):NET_DEPTH, inDef=(t==='red')?(coin.y>H*0.62):(coin.y<H*0.38);
        if(inDef){ var own=nails.filter(function(n){ return n.team===t&&!n.goalie&&!n.striker; });
          if(own.length){ own.sort(function(a,b){ return Math.abs(gy-b.y)-Math.abs(gy-a.y); }); var mv=own[0];
            var sx=coin.x+(W/2-coin.x)*0.5, sy=coin.y+(gy-coin.y)*0.55, c=clampToPitch(sx,sy), sp=resolveSpot(c.x,c.y,mv), r=goalAreaRect(t);
            if(inRect(sp.x,sp.y,r)&&countInGoalArea(t,mv)>=1){ sy=coin.y+(gy-coin.y)*0.3; c=clampToPitch(sx,sy); sp=resolveSpot(c.x,c.y,mv); }
            if(!(inRect(sp.x,sp.y,r)&&countInGoalArea(t,mv)>=1) && !overlapsAny(sp.x,sp.y,mv)){
              mv.x=sp.x; mv.y=sp.y; strategistUsed[t]=true; strategistArm=null;
              try{syncSlots();}catch(e){} try{updateScoreboards();}catch(e){} setStatus(teamKits[t].abbr+' STRATEGIST!');
              try{sfxAbility('strategist');}catch(e){} try{spawnSparks(mv.x,mv.y,t,10);}catch(e){}
            } } } }
    }
    // JOYSTICK: steer toward the open side of the goal (away from the keeper), not just dead-centre.
    var _aiChipRoll=0;
    function aiSteerTarget(){ var gx=W/2;
    if(aiLevel==='easy') return gx;
    var gk=null; for(var i=0;i<nails.length;i++){ if(nails[i].team!==current && nails[i].goalie){ gk=nails[i];
    break; } } if(gk){ var off=GOAL_W*0.30;
    gx=(gk.x<=W/2)?(W/2+off):(W/2-off);
    gx=Math.max(W/2-GOAL_W/2+COIN_R, Math.min(W/2+GOAL_W/2-COIN_R, gx));
    } return gx; }
    // CHIP: loft the shot over a defender/keeper sitting in the lane just ahead of the ball.
    function aiMaybeChip(){ if(Math.hypot(coin.vx,coin.vy)<1.2) return;
    if(_aiChipRoll<0) return;
    // CENTRE COURT: chip the NET. Nothing crosses it on the ground, so lift the ball just before it
    // arrives — 22 frames of air is enough to clear the band and land on the far side.
    try{ if((typeof boardKey!=='undefined')&&boardKey==='tennis'&&(typeof stadiumHazards==='function')&&stadiumHazards()){
    var _ny=H/2, _dn=Math.abs(coin.y-_ny);
    var _atNet=((coin.y>_ny&&coin.vy<-0.3)||(coin.y<_ny&&coin.vy>0.3));
    if(_atNet&&_dn<34&&_dn>7&&tnBlocksAt(coin.x)){ chipUsed=true;
    coin.air=22; coin.air0=22;
    try{sfxGuided();}catch(e){} try{ setStatus(((teamKits[current]&&teamKits[current].abbr)||'CPU')+' CHIP!');
    }catch(e){} } return; } }catch(e){}
    var goalY=(current==='red')?NET_DEPTH:(H-NET_DEPTH);
    var toGoal=(current==='red')?(coin.vy<-0.3):(coin.vy>0.3);
    if(!toGoal) return; var dg=Math.abs(coin.y-goalY);
    if(dg>95||dg<32) return;
    var blocked=false; for(var i=0;i<nails.length;i++){ var n=nails[i];
    if(n.team===current) continue;
    var ahead=(current==='red')?(n.y<coin.y):(n.y>coin.y);
    if(ahead && Math.abs(n.y-coin.y)<72 && Math.abs(n.x-coin.x)<NAIL_R+COIN_R+11){ blocked=true;
    break; } } if(!blocked) return;
    if(_aiChipRoll===0){ var pr=(aiLevel==='hard')?0.95:(aiLevel==='med'?0.75:0.45);
    _aiChipRoll=(Math.random()<pr)?1:-1;
    } if(_aiChipRoll===1){ chipUsed=true;
    coin.air=22; coin.air0=22;
    try{sfxGuided();}catch(e){} try{ setStatus(((teamKits[current]&&teamKits[current].abbr)||'CPU')+' CHIP!');
    }catch(e){} } }
    function maybeAI(delta){ try{ if(tutHoldsTurn()){ aiPending=false; return; } }catch(_th){}
      if(pen&&pen.active&&pen.step!=='aim'){ aiPending=false; return; }
      if(moving&&!scoring&&!paused&&phase==='play'&&aiEnabled[current]&&TAC.guided&&steerBudget>0){ steerHold=aiSteerTarget(); }
      if(moving&&!scoring&&!paused&&phase==='play'&&aiEnabled[current]&&TAC.chip&&!chipUsed&&(!coin.air||coin.air<=0)){ try{ aiMaybeChip(); }catch(e){} }
      if(paused||winner||phase!=='play'||moving||aiming||scoring||banner>0){ aiPending=false; aiShot=null; return; }
      if(!aiEnabled[current]) return;
      if(!aiPending){ aiPending=true; aiDelay=950+Math.random()*550; aiThink0=aiDelay;
      try{ aiUtility(); }catch(e){}
      // Lock in the exact shot now (not at release) so the telegraph draws the real thing. Penalties keep
      // computing at release — pen.dive can change during the wind-up, so a precomputed pen shot could go stale.
      try{ aiShot=(CPU_AIM_TELEGRAPH && !(pen&&pen.active))?aiComputeShot():null; }catch(e){ aiShot=null; }
      try{ aiAim=CPU_AIM_TELEGRAPH?aiTargetCenter(current):null; }catch(e){ aiAim=null; }
      return; }
      aiDelay-=delta; if(aiDelay<=0){ aiPending=false; aiAim=null; if(aiShot){ aiApplyShot(aiShot); aiShot=null; } else { aiFlick(); } }
    }
    /* The point the CPU is lining up on, WITHOUT the random spread aiFlick adds — so the telegraph arrow
       shows its intent, not the jittered result. Mirrors the target-selection at the top of aiFlick
       (goal centre, or whichever arena aim-plan applies); read-only, so it cannot affect the shot. */
    function aiTargetCenter(t){ var gy=(t==='red')?(NET_DEPTH+COIN_R+1):(H-NET_DEPTH-COIN_R-1), gx=W/2;
    try{ var r=(typeof bkAimTarget==='function')?bkAimTarget(t):null; if(r){ gx=r.x; gy=r.y; } }catch(e){}
    try{ var tn=(typeof tnAimPlan==='function')?tnAimPlan(t):null; if(tn){ gx=tn.x; gy=tn.y; } }catch(e){}
    try{ var cg=(typeof cgAimPlan==='function')?cgAimPlan(t):null; if(cg){ gx=cg.x; gy=cg.y; } }catch(e){}
    return {x:gx,y:gy}; }

