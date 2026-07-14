    // ================= AI OPPONENT =================
    function aiFlick(){
      const t=current;
      coin.spin=0; // clear residual curve from a previous curveball shot, same as a human flick does
      if(pen&&pen.active){ var _Z=['L','C','R']; var _kp=pen.dive; var _sp=aiLevel==='hard'?0.9:(aiLevel==='med'?0.6:0.3); var _pick; if(Math.random()<_sp){ var _aw=[]; for(var _i=0;_i<3;_i++){ if(_Z[_i]!==_kp) _aw.push(_Z[_i]); } _pick=_aw[Math.floor(Math.random()*_aw.length)]; } else { _pick=_Z[Math.floor(Math.random()*3)]; } var _off=GOAL_W/3; var _bx=W/2+(_pick==='L'?-_off:(_pick==='R'?_off:0)); var _err=aiLevel==='hard'?4:(aiLevel==='med'?9:16); var _gx=_bx+(Math.random()*2-1)*_err; var _gy=t==='red'?NET_DEPTH+COIN_R+1:H-NET_DEPTH-COIN_R-1; var _dx=_gx-coin.x,_dy=_gy-coin.y,_di=Math.hypot(_dx,_dy),_ang=Math.atan2(_dy,_dx); var _spd=Math.min(5.1,Math.max(4.2,_di*0.05+3.0)); coin.vx=Math.cos(_ang)*_spd; coin.vy=Math.sin(_ang)*_spd; flickCount++; _achBounces=0; hitOwn=false; moving=true; ghostUsed=false; ghosting=false; portalUsed=false; ricochetUsed=false; serpentPhase=0; turnFlash=Math.max(turnFlash,10); return; }
      const goalY = t==='red' ? NET_DEPTH+COIN_R+1 : H-NET_DEPTH-COIN_R-1;
      const spread=(GOAL_W*0.5-2)*(1-AI_ACC[aiLevel]);
      const goalX=W/2+(Math.random()*2-1)*spread;
      let dx=goalX-coin.x, dy=goalY-coin.y;
      const dist=Math.hypot(dx,dy);
      const ang=Math.atan2(dy,dx)+(Math.random()*2-1)*AI_NOISE[aiLevel];
      let speed=Math.min(FLICK_MAX,Math.max(5.0,dist*0.05+3.2)*(0.9+Math.random()*0.25))*(TAC.power||1); if(debuffActive(current,'freeze')) speed=Math.min(speed,FLICK_MAX*0.5); if(pen&&pen.active) speed=Math.min(speed,5.1);
      coin.vx=Math.cos(ang)*speed; coin.vy=Math.sin(ang)*speed; if(debuffActive(current,'drunk')){ var _dj=(Math.random()-0.5)*DRUNK_SPREAD,_djc=Math.cos(_dj),_djs=Math.sin(_dj),_djx=coin.vx*_djc-coin.vy*_djs,_djy=coin.vx*_djs+coin.vy*_djc; coin.vx=_djx; coin.vy=_djy; } flickCount++; _achBounces=0;
      hitOwn=false; moving=true; ghostUsed=false; ghosting=false; portalUsed=false; ricochetUsed=false; serpentPhase=0; turnFlash=Math.max(turnFlash,10);
      
    }
    function maybeAI(delta){ if(pen&&pen.active&&pen.step!=='aim'){ aiPending=false; return; }
      if(paused||winner||phase!=='play'||moving||aiming||scoring||banner>0){ aiPending=false; return; }
      if(!aiEnabled[current]) return;
      if(!aiPending){ aiPending=true; aiDelay=950+Math.random()*550; return; }
      aiDelay-=delta; if(aiDelay<=0){ aiPending=false; aiFlick(); }
    }

