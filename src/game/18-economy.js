    // ================= TOKEN ECONOMY (test feature: exhibition only) =================
    // Gold tokens spawn on the pitch; any shot that touches one adds it to a shared pot.
    // Whoever scores claims the pot (x2 if the scoring shot itself collected a token).
    // Coins buy abilities in the post-goal draft (priced by rarity) and rerolls.
    var ecoTokens=[], ecoPot=0, ecoWallet={red:0,blue:0}, ecoShotPickups=0, ecoFx=[];
    var ECO_TOKEN_R=4, ECO_MAX_TOKENS=5, ECO_REROLL_COST=2, ECO_TOKEN_VALUE=2, ECO_WIN_BONUS=5;
    function ecoEnabled(){ return (typeof mode!=='undefined') && (mode==='tournament' || (mode==='exhibition' && _ecoOn)); }
    function ecoTournament(){ return (typeof mode!=='undefined') && mode==='tournament'; }
    function abPrice(id){ var w=abWeight(id); return w<=1?14:(w<=2?9:(w<=3?6:(w<=4?4:3))); }
    function ecoReset(){ ecoPot=0; ecoTokens=[]; ecoShotPickups=0; ecoFx=[]; if(!ecoTournament()) ecoWallet={red:0,blue:0}; if(ecoEnabled()) ecoSpawnTokens(); }
    function ecoRunReset(){ ecoWallet={red:0,blue:0}; ecoPot=0; ecoShotPickups=0; }
    function ecoSpawnTokens(){ if(!ecoEnabled()) return; var y0=NET_DEPTH+GOAL_AREA_D+16, y1=H-NET_DEPTH-GOAL_AREA_D-16, tries=0;
      while(ecoTokens.length<ECO_MAX_TOKENS && tries<140){ tries++;
        var px=WALL+16+Math.random()*(W-2*WALL-32), py=y0+Math.random()*(y1-y0), ok=true;
        if(coin && Math.hypot(px-coin.x,py-coin.y)<24) ok=false;
        if(ok&&nails){ for(var i=0;i<nails.length;i++){ if(Math.hypot(px-nails[i].x,py-nails[i].y)<NAIL_R+ECO_TOKEN_R+6){ ok=false; break; } } }
        if(ok){ for(var j=0;j<ecoTokens.length;j++){ if(Math.hypot(px-ecoTokens[j].x,py-ecoTokens[j].y)<20){ ok=false; break; } } }
        if(ok) ecoTokens.push({x:px,y:py,ph:Math.random()*6.28});
      } }
    function ecoFlickStart(){ ecoShotPickups=0; }
    function ecoStep(){ if(!ecoEnabled()||!ecoTokens.length||!coin) return;
      for(var i=ecoTokens.length-1;i>=0;i--){ var t=ecoTokens[i];
        if(Math.hypot(coin.x-t.x,coin.y-t.y)<COIN_R+ECO_TOKEN_R){ ecoTokens.splice(i,1); ecoPot+=ECO_TOKEN_VALUE; ecoShotPickups++; ecoFx.push({x:t.x,y:t.y,life:26}); try{ spawnSparks(t.x,t.y,current,8); }catch(e){} try{ if(!muted) tone(1180,0.06,'square',0.06); }catch(e){} } } }
    function ecoOnGoal(scorer){ if(!ecoEnabled()) return;
      if(ecoPot>0){ var mult=(ecoShotPickups>0)?2:1, take=ecoPot*mult; ecoWallet[scorer]=(ecoWallet[scorer]||0)+take;
        try{ if(window.__nsCenterMsg) window.__nsCenterMsg(teamKits[scorer].abbr+' CLAIMS '+take+' COINS'+(mult>1?' - TOKEN SHOT x2!':'!')); }catch(e){}
        ecoPot=0; try{ updateScoreboards(); }catch(e){} }
      ecoShotPickups=0; }
    function ecoCpuGrant(side,onDone){ onDone=onDone||function(){}; var arr=sideAb[side]; if(!arr||arr.length>=3){ onDone(); return; }
      var pool=abPool(side,arr).filter(function(c){ return (ecoWallet[side]||0)>=abPrice(c.id); });
      if(!pool.length){ onDone(); return; }
      var pick=weightedPick(pool, losingBoost(side)); ecoWallet[side]-=abPrice(pick.id);
      var wi=el('ns_slot_'+side+'_'+arr.length); paused=true;
      if(window.__nsCenterMsg) window.__nsCenterMsg(teamKits[side].abbr+' SHOPS…');
      spinSlot(wi,pick,function(){ arr.push(pick.id); applyTactics(); syncSpecialNails(); try{resolveSwap();}catch(e){} updateScoreboards(); try{syncSlots();}catch(e){}
        if(window.__nsCenterMsg) window.__nsCenterMsg(teamKits[side].abbr+' BUYS '+pick.name+' ('+abPrice(pick.id)+' COINS)!');
        try{ var _fi=makeIconEl(pick.id,52); flyTo(_fi, window.innerWidth/2, window.innerHeight/2, wi, {hold:120,dur:620,endScale:0.42}, function(){ paused=false; onDone(); }); }catch(e){ paused=false; onDone(); } }); }
    function drawEcoCoin(g,x,y,r){ g.beginPath(); g.arc(x,y,r,0,6.283); g.fillStyle='#e8b93c'; g.fill(); g.lineWidth=1; g.strokeStyle='#8a6318'; g.stroke(); g.fillStyle='#f7dd7f'; g.fillRect(x-0.8,y-r+1.5,1.6,Math.max(1,2*r-3)); }
    function drawEco(now){ if(!ecoEnabled()) return;
      for(var i=0;i<ecoTokens.length;i++){ var t=ecoTokens[i], bob=Math.sin((now||0)*0.004+t.ph)*1.2; drawEcoCoin(ctx,t.x,t.y+bob,ECO_TOKEN_R); }
      for(var k=ecoFx.length-1;k>=0;k--){ var f=ecoFx[k]; ctx.save(); ctx.globalAlpha=Math.max(0,f.life/26); ctx.font="7px 'Press Start 2P', monospace"; ctx.textAlign='center'; ctx.fillStyle='#ffd84a'; ctx.fillText('+'+ECO_TOKEN_VALUE, f.x, f.y-(26-f.life)*0.5); ctx.restore(); f.life--; if(f.life<=0) ecoFx.splice(k,1); }
      if(ecoPot>0){ ctx.save(); ctx.font="7px 'Press Start 2P', monospace"; ctx.textBaseline='middle'; drawEcoCoin(ctx,W-13,H/2,4); ctx.textAlign='right'; ctx.fillStyle='#ffd84a'; ctx.strokeStyle='rgba(0,0,0,0.7)'; ctx.lineWidth=2; ctx.strokeText(''+ecoPot, W-19, H/2+0.5); ctx.fillText(''+ecoPot, W-19, H/2+0.5); ctx.restore(); } }
