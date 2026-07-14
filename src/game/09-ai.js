    // ================= AI OPPONENT =================
    function aiFlick(){
      const t=current;
      coin.spin=0; // clear residual curve from a previous curveball shot, same as a human flick does
      if(pen&&pen.active){ var _Z=['L','C','R']; var _kp=pen.dive; var _sp=aiLevel==='hard'?0.9:(aiLevel==='med'?0.6:0.3); var _pick; if(Math.random()<_sp){ var _aw=[]; for(var _i=0;_i<3;_i++){ if(_Z[_i]!==_kp) _aw.push(_Z[_i]); } _pick=_aw[Math.floor(Math.random()*_aw.length)]; } else { _pick=_Z[Math.floor(Math.random()*3)]; } var _off=GOAL_W/3; var _bx=W/2+(_pick==='L'?-_off:(_pick==='R'?_off:0)); var _err=aiLevel==='hard'?4:(aiLevel==='med'?9:16); var _gx=_bx+(Math.random()*2-1)*_err; var _gy=t==='red'?NET_DEPTH+COIN_R+1:H-NET_DEPTH-COIN_R-1; var _dx=_gx-coin.x,_dy=_gy-coin.y,_di=Math.hypot(_dx,_dy),_ang=Math.atan2(_dy,_dx); var _spd=Math.min(5.1,Math.max(4.2,_di*0.05+3.0)); coin.vx=Math.cos(_ang)*_spd; coin.vy=Math.sin(_ang)*_spd; flickCount++; _achBounces=0; hitOwn=false; moving=true; ghostUsed=false; ghosting=false; portalUsed=false; ricochetUsed=false; serpentPhase=0; turnFlash=Math.max(turnFlash,10); return; }
      const goalY = t==='red' ? NET_DEPTH+COIN_R+1 : H-NET_DEPTH-COIN_R-1;
      const spread=(GOAL_W*0.5-2)*(1-AI_ACC[aiLevel])*(TAC.laser?0.45:1);
      const goalX=W/2+(Math.random()*2-1)*spread;
      let dx=goalX-coin.x, dy=goalY-coin.y;
      const dist=Math.hypot(dx,dy);
      const ang=Math.atan2(dy,dx)+(Math.random()*2-1)*AI_NOISE[aiLevel]*(TAC.laser?0.5:1);
      let speed=Math.min(FLICK_MAX,Math.max(5.0,dist*0.05+3.2)*(0.9+Math.random()*0.25))*(TAC.power||1); if(debuffActive(current,'freeze')) speed=Math.min(speed,FLICK_MAX*0.5); if(pen&&pen.active) speed=Math.min(speed,5.1);
      // curveball: the shot will bend, so pick the launch angle whose simulated curved path lands closest to the target
      var ang2=ang;
      if(TAC.curve && speed>=1.9){ var _bestA=ang,_bestD=1e9; for(var _ci=-9;_ci<=9;_ci++){ var _ca=ang+_ci*0.055; var _svx=Math.cos(_ca)*speed,_svy=Math.sin(_ca)*speed; var _shx=-_svx,_sd2=(_shx>0.05)?1:((_shx<-0.05)?-1:((W/2-coin.x)>=0?1:-1)); var _ss=_sd2*((_svy<0)?1:-1)*1.2; var _sx=coin.x,_sy=coin.y,_md=1e9; for(var _st=0;_st<150;_st++){ var _ssp=Math.hypot(_svx,_svy); if(_ssp<0.4) break; var _px=-_svy/_ssp,_py=_svx/_ssp; _svx+=_px*_ss*_ssp*0.05; _svy+=_py*_ss*_ssp*0.05; _ss*=0.984; _svx*=FRICTION; _svy*=FRICTION; _sx+=_svx; _sy+=_svy; if(_sx<WALL+COIN_R){_sx=WALL+COIN_R;_svx=-_svx*RESTITUTION;_ss*=0.35;} else if(_sx>W-WALL-COIN_R){_sx=W-WALL-COIN_R;_svx=-_svx*RESTITUTION;_ss*=0.35;} var _d=Math.hypot(_sx-goalX,_sy-goalY); if(_d<_md) _md=_d; if((t==='red'&&_sy<=goalY)||(t==='blue'&&_sy>=goalY)) break; } if(_md<_bestD){ _bestD=_md; _bestA=_ca; } } ang2=_bestA; }
      coin.vx=Math.cos(ang2)*speed; coin.vy=Math.sin(ang2)*speed;
      if(TAC.curve && speed>=1.9){ var _hx2=-coin.vx,_hd2=(_hx2>0.05)?1:((_hx2<-0.05)?-1:((W/2-coin.x)>=0?1:-1)); coin.spin=_hd2*((coin.vy<0)?1:-1)*1.2; try{sfxCurl();}catch(e){} }
      if(debuffActive(current,'drunk')){ var _dj=(Math.random()-0.5)*DRUNK_SPREAD,_djc=Math.cos(_dj),_djs=Math.sin(_dj),_djx=coin.vx*_djc-coin.vy*_djs,_djy=coin.vx*_djs+coin.vy*_djc; coin.vx=_djx; coin.vy=_djy; } flickCount++; _achBounces=0;
      hitOwn=false; moving=true; ghostUsed=false; ghosting=false; portalUsed=false; ricochetUsed=false; serpentPhase=0; steerBudget=(TAC.guided?40:0); steerHold=null; turnFlash=Math.max(turnFlash,10);
      
    }
    // CPU versions of the tap-to-use abilities, run once at the start of its turn
    function aiUtility(){ var t=current; if(!(aiEnabled&&aiEnabled[t])) return; var ab=sideAb[t]||[];
      if(ab.indexOf('medic')>=0 && !medicUsed[t] && (debuffActive(t,'freeze')||debuffActive(t,'drunk')||debuffActive(t,'fog'))){ try{ useMedic(t); }catch(e){} }
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
    function maybeAI(delta){ if(pen&&pen.active&&pen.step!=='aim'){ aiPending=false; return; }
      if(moving&&!scoring&&!paused&&phase==='play'&&aiEnabled[current]&&TAC.guided&&steerBudget>0){ steerHold=W/2; }
      if(paused||winner||phase!=='play'||moving||aiming||scoring||banner>0){ aiPending=false; return; }
      if(!aiEnabled[current]) return;
      if(!aiPending){ aiPending=true; aiDelay=950+Math.random()*550; try{ aiUtility(); }catch(e){} return; }
      aiDelay-=delta; if(aiDelay<=0){ aiPending=false; aiFlick(); }
    }

