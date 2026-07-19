    // ================= TOKEN ECONOMY (test feature: exhibition only) =================
    // Gold tokens spawn on the pitch; any shot that touches one adds it to a shared pot.
    // Whoever scores claims the pot (x2 if the scoring shot itself collected a token).
    // Coins buy abilities in the post-goal draft (priced by rarity) and rerolls.
    var ecoTokens=[], ecoPot=0, ecoWallet={red:0,blue:0}, ecoShotPickups=0, ecoAssist=false, ecoFx=[], ecoWalletShown={red:0,blue:0}, ecoClaimAnim=null;
    var ECO_TOKEN_R=4, ECO_MAX_TOKENS=5, ECO_REROLL_COST=2, ECO_TOKEN_VALUE=1, ECO_WIN_BONUS=5;
    function ecoEnabled(){ return (typeof mode!=='undefined') && (mode==='tournament' || (mode==='exhibition' && _ecoOn)); }
    function ecoTournament(){ return (typeof mode!=='undefined') && mode==='tournament'; }
    function abPrice(id){ var w=abWeight(id); return w<=1?14:(w<=2?9:(w<=3?6:(w<=4?4:3))); }
    function ecoReset(){ ecoPot=0; ecoTokens=[]; ecoShotPickups=0; ecoFx=[]; ecoClaimAnim=null; if(!ecoTournament()) ecoWallet={red:0,blue:0}; ecoWalletShown={red:(ecoWallet.red||0),blue:(ecoWallet.blue||0)}; if(ecoEnabled()) ecoSpawnTokens(); }
    function ecoRunReset(){ ecoWallet={red:0,blue:0}; ecoWalletShown={red:0,blue:0}; ecoClaimAnim=null; ecoPot=0; ecoShotPickups=0; }
    function ecoSpawnTokens(){ if(!ecoEnabled()) return; var y0=NET_DEPTH+GOAL_AREA_D+16, y1=H-NET_DEPTH-GOAL_AREA_D-16, tries=0;
      while(ecoTokens.length<ECO_MAX_TOKENS && tries<140){ tries++;
        var px=WALL+16+Math.random()*(W-2*WALL-32), py=y0+Math.random()*(y1-y0), ok=true;
        if(coin && Math.hypot(px-coin.x,py-coin.y)<24) ok=false;
        if(ok&&nails){ for(var i=0;i<nails.length;i++){ if(Math.hypot(px-nails[i].x,py-nails[i].y)<NAIL_R+ECO_TOKEN_R+6){ ok=false; break; } } }
        if(ok){ for(var j=0;j<ecoTokens.length;j++){ if(Math.hypot(px-ecoTokens[j].x,py-ecoTokens[j].y)<20){ ok=false; break; } } }
        if(ok) ecoTokens.push({x:px,y:py,ph:Math.random()*6.28});
      } }
    function ecoFlickStart(){ ecoShotPickups=0; ecoAssist=false; }
    function ecoStep(){ if(!ecoEnabled()||!ecoTokens.length||!coin) return;
      for(var i=ecoTokens.length-1;i>=0;i--){ var t=ecoTokens[i];
        if(Math.hypot(coin.x-t.x,coin.y-t.y)<COIN_R+ECO_TOKEN_R){ ecoTokens.splice(i,1); ecoPot+=ECO_TOKEN_VALUE; ecoShotPickups++; ecoFx.push({x:t.x,y:t.y,life:26}); try{ spawnSparks(t.x,t.y,current,8); }catch(e){} try{ if(!muted) tone(1180,0.06,'square',0.06); }catch(e){} } } }
    function ecoOnGoal(scorer){ if(!ecoEnabled()) return;
      if(ecoPot>0){ var mult=(ecoAssist?2:1)*(((sideAb[scorer]||[]).indexOf('market')>=0)?2:1), take=ecoPot*mult, before=(ecoWallet[scorer]||0); ecoWallet[scorer]=before+take;
        try{ if(window.__nsCenterMsg) window.__nsCenterMsg(teamKits[scorer].abbr+' CLAIMS '+take+' COINS'+(mult>1?' - ASSIST x2!':'!')); }catch(e){}
        ecoPot=0; try{ ecoFlyReward(scorer, before, ecoWallet[scorer]); }catch(e){ try{ updateScoreboards(); }catch(e2){} } }
      ecoShotPickups=0; ecoAssist=false; }
    function ecoChing(k){ try{ if(muted) return; var f=784*Math.pow(1.0595,Math.min(k,14)); tone(f,0.055,'square',0.05); setTimeout(function(){ try{ tone(f*1.5,0.06,'square',0.042); }catch(e){} },42); }catch(e){} }
    function ecoFlyReward(side, from, to){ var wl=el('ns_wallet_'+side), wn=el('ns_walletnum_'+side);
      if(!wl || wl.style.display==='none' || to<=from){ ecoWalletShown[side]=to; ecoClaimAnim=null; try{ updateScoreboards(); }catch(e){} return; }
      ecoClaimAnim=side; ecoWalletShown[side]=from; if(wn) wn.textContent=from;
      var stage=el('ns_stage'), r=stage?stage.getBoundingClientRect():null;
      var sx=r?(r.left+r.width/2):(window.innerWidth/2), sy=r?(r.top+r.height*0.4):(window.innerHeight/2);
      var total=to-from, n=Math.max(3,Math.min(10,total)), landed=0;
      for(var i=0;i<n;i++){ (function(k){
        var c=mk('div','width:16px;height:16px;background:url('+coinCSS()+') center/contain no-repeat;image-rendering:pixelated;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.5));');
        var jx=sx+(Math.random()*2-1)*46, jy=sy+(Math.random()*2-1)*24;
        try{ flyTo(c, jx, jy, wl, {hold:70+k*60, dur:520, endScale:0.66}, function(){ landed++; ecoChing(k); var v=from+Math.round((landed/n)*total); if(landed>=n) v=to; ecoWalletShown[side]=v; if(wn) wn.textContent=v; if(landed>=n){ ecoClaimAnim=null; try{ updateScoreboards(); }catch(e){} } }); }catch(e){ landed++; if(landed>=n){ ecoWalletShown[side]=to; ecoClaimAnim=null; } }
      })(i); }
    }
    function ecoCpuGrant(side,onDone){ onDone=onDone||function(){}; var arr=sideAb[side]; if(!arr||arr.length>=3){ onDone(); return; }
      var pool=abPool(side,arr).filter(function(c){ return (ecoWallet[side]||0)>=abPrice(c.id); });
      if(!pool.length){ onDone(); return; }
      var pick=weightedPick(pool, losingBoost(side)); ecoWallet[side]-=abPrice(pick.id);
      var wi=el('ns_slot_'+side+'_'+arr.length); paused=true;
      if(window.__nsCenterMsg) window.__nsCenterMsg(teamKits[side].abbr+' SHOPS…');
      spinSlot(wi,pick,function(){ arr.push(pick.id); applyTactics(); syncSpecialNails(); try{resolveSwap();}catch(e){} updateScoreboards(); try{syncSlots();}catch(e){}
        if(window.__nsCenterMsg) window.__nsCenterMsg(teamKits[side].abbr+' BUYS '+pick.name+' ('+abPrice(pick.id)+' COINS)!');
        try{ var _fi=makeIconEl(pick.id,52); flyTo(_fi, window.innerWidth/2, window.innerHeight/2, wi, {hold:120,dur:620,endScale:0.42}, function(){ paused=false; onDone(); }); }catch(e){ paused=false; onDone(); } }); }
    // procedural pixel-art coin: an 8-frame spin sheet (16px cells) built once
    function coinSheet(){ if(window.__NS_COIN) return window.__NS_COIN; try{ var S=16,N=8,cv=document.createElement('canvas'); cv.width=S*N; cv.height=S; var g=cv.getContext('2d'); g.imageSmoothingEnabled=false; var cx=S/2-0.5,cy=S/2-0.5,RY=6.6,LIGHT='#ffe58a',MID='#e8b93c',DARK='#b5811f',RIM='#7a5410',SHINE='#fff4c8'; for(var f=0;f<N;f++){ var ang=f/N*Math.PI*2, hw=Math.max(0.9,Math.abs(Math.cos(ang))*6.6), ox=f*S; for(var y=0;y<S;y++){ for(var x=0;x<S;x++){ var dx=(x-cx)/hw, dy=(y-cy)/RY, d=dx*dx+dy*dy; if(d>1.05) continue; var col; if(d>0.78) col=RIM; else if(dx<-0.32&&dy<-0.05) col=SHINE; else if(dx<0.05) col=LIGHT; else if(dx<0.55) col=MID; else col=DARK; g.fillStyle=col; g.fillRect(ox+x,y,1,1); } } if(hw<2.2){ g.fillStyle=SHINE; g.fillRect(ox+Math.round(cx),Math.round(cy-RY+1.5),1,Math.max(1,Math.round(RY*2-3))); } } window.__NS_COIN=cv; return cv; }catch(e){ return null; } }
    function drawCoinSprite(g,cx,cy,size,frame){ var sh=coinSheet(); if(!sh){ g.beginPath(); g.arc(cx,cy,size/2,0,6.283); g.fillStyle='#e8b93c'; g.fill(); return; } var S=16, f=(((frame|0)%8)+8)%8, _sm=g.imageSmoothingEnabled; g.imageSmoothingEnabled=false; g.drawImage(sh, f*S,0,S,S, Math.round(cx-size/2), Math.round(cy-size/2), size, size); g.imageSmoothingEnabled=_sm; }
    function coinCSS(){ if(window.__NS_COINURL) return window.__NS_COINURL; try{ var S=16, sh=coinSheet(), c2=document.createElement('canvas'); c2.width=S; c2.height=S; var g2=c2.getContext('2d'); g2.imageSmoothingEnabled=false; if(sh) g2.drawImage(sh,0,0,S,S,0,0,S,S); window.__NS_COINURL=c2.toDataURL(); return window.__NS_COINURL; }catch(e){ return ''; } }
    function drawEcoCoin(g,x,y,r,frame){ drawCoinSprite(g,x,y,Math.round(r*2.7),frame||0); }
    function drawEco(now){ if(!ecoEnabled()) return;
      for(var i=0;i<ecoTokens.length;i++){ var t=ecoTokens[i], bob=Math.sin((now||0)*0.004+t.ph)*1.2; drawEcoCoin(ctx,t.x,t.y+bob,ECO_TOKEN_R,Math.floor((now||0)*0.012+t.ph*3)); }
      for(var k=ecoFx.length-1;k>=0;k--){ var f=ecoFx[k]; ctx.save(); ctx.globalAlpha=Math.max(0,f.life/26); ctx.font="7px 'Press Start 2P', monospace"; ctx.textAlign='center'; ctx.fillStyle='#ffd84a'; ctx.fillText('+'+ECO_TOKEN_VALUE, f.x, f.y-(26-f.life)*0.5); ctx.restore(); f.life--; if(f.life<=0) ecoFx.splice(k,1); }
      if(ecoPot>0){ ctx.save(); ctx.font="7px 'Press Start 2P', monospace"; ctx.textBaseline='middle'; drawEcoCoin(ctx,W-13,H/2,4.5,0); ctx.textAlign='right'; ctx.fillStyle='#ffd84a'; ctx.strokeStyle='rgba(0,0,0,0.7)'; ctx.lineWidth=2; ctx.strokeText(''+ecoPot, W-19, H/2+0.5); ctx.fillText(''+ecoPot, W-19, H/2+0.5); ctx.restore(); } }
