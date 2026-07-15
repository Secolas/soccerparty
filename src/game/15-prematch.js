    // ================= PRE-MATCH OVERLAY (FIFA-style arrow steppers) =================
    const pre=el('ns_pre');
    // per-side selection: index into COUNTRIES
    const sel={ red:{i:0,rand:false}, blue:{i:1,rand:false} };
    const curPreset=side=>COUNTRIES[sel[side].i]; function resolveSel(side,avoid){ if(sel[side]&&sel[side].rand){ var pool=[]; for(var _i=0;_i<COUNTRIES.length;_i++) pool.push(_i); if(avoid){ var ai=COUNTRIES.indexOf(avoid); if(ai>=0&&pool.length>1) pool=pool.filter(function(x){return x!==ai;}); } sel[side].i=pool[Math.floor(Math.random()*pool.length)]; } return curPreset(side); }
    let refreshPitch=()=>{}; var fmtRefreshers=[];
    function mk(tag,style,text){ const e=document.createElement(tag); if(style) e.setAttribute('style',style); if(text!=null) e.textContent=text; return e; }
    function arrowBtn(ch,fn){ const b=mk('button',"font-family:'Press Start 2P',monospace;font-size:10px;color:#f4e9c8;background:#241a2e;border:2px solid #4a3a5e;padding:7px 3px;cursor:pointer;line-height:1;",ch); b.onclick=(e)=>{e.preventDefault();fn();}; return b; }
    function drawFieldPreview(g){
      g.imageSmoothingEnabled=false; g.clearRect(0,0,W,H);
      g.drawImage(boardCanvas,0,0);
      const gL=(W-GOAL_W)/2,gR=(W+GOAL_W)/2;
      g.strokeStyle=board.line; g.lineWidth=1.8;
      g.beginPath(); g.moveTo(WALL,Math.round(H/2)+0.5); g.lineTo(W-WALL,Math.round(H/2)+0.5); g.stroke();
      g.beginPath(); g.arc(W/2,H/2,22,0,Math.PI*2); g.stroke();
      g.fillStyle=board.line; g.fillRect(Math.round(W/2)-1,Math.round(H/2)-1,3,3);   // centre spot
      for(const team of ['red','blue']){ drawEndMarks(g,team,1.8); }
      // formation dots in the chosen teams' kits
      for(const team of ['red','blue']){ const kit=curPreset(team).kit; var _rk=resolveKit(kit,(typeof kitStyle!=='undefined'&&kitStyle[team])?kitStyle[team]:'jersey'); for(const n of formation(team)){ paintNail(g,n.x,n.y,NAIL_R,kit,false,_rk); } }
      // ball at kickoff
      g.beginPath(); g.arc(W/2,H/2,COIN_R,0,Math.PI*2); g.fillStyle='#fbfbf6'; g.fill(); g.lineWidth=1; g.strokeStyle='#a9a99f'; g.stroke();
    }
    // shared style helpers
    const FS=(px,col)=>"font-family:'Press Start 2P',monospace;font-size:"+px+"px;color:"+col+";";
    const SQBTN="font-family:'Press Start 2P',monospace;font-size:6px;padding:4px 5px;border:1px solid #3a3050;background:#0e0a16;color:#c9bce0;cursor:pointer;";
    let tourSize=8, tourLevel='med';
    function segRow(host,label,opts,getVal,setVal,cols){
      host.appendChild(mk('div',FS(8,'#9a8fb0')+'margin:7px 0 4px;',label));
      const row=mk('div','display:grid;grid-template-columns:repeat('+(cols||opts.length)+',1fr);gap:5px;');
      const btns=[];
      function restyle(){ btns.forEach(([b,v])=>{ const s=getVal()===v; b.style.background=s?'#c6e84a':'#0e0a16'; b.style.color=s?'#0b0910':'#8a7ea0'; b.style.borderColor=s?'#c6e84a':'#3a3050'; }); }
      opts.forEach(([v,l])=>{ const b=mk('button',SQBTN+'font-size:7px;padding:5px;text-align:center;',l); b.onclick=()=>{ setVal(v); restyle(); }; btns.push([b,v]); row.appendChild(b); });
      restyle(); host.appendChild(row);
    }

    function pitchStepper(host){
      host.appendChild(mk('div',FS(8,'#9a8fb0')+'margin-bottom:3px;','PITCH'));
      const BKEYS=Object.keys(BOARDS); let bi=Math.max(0,BKEYS.indexOf(boardKey));
      const prow=mk('div','display:flex;align-items:center;justify-content:center;gap:6px;');
      const PVW=88, PVH=Math.round(PVW*H/W);
      const pcv=document.createElement('canvas'); pcv.width=W; pcv.height=H; pcv.style.width=PVW+'px'; pcv.style.height=PVH+'px'; pcv.style.display='block'; pcv.style.imageRendering='pixelated';
      const pwrap=mk('div','background:#0e0a16;border:2px solid #3a3050;padding:2px;line-height:0;'); pwrap.appendChild(pcv);
      const pname=mk('div',FS(8,'#c9bce0')+'text-align:center;margin-top:3px;','');
      function renderPitch(){ boardKey=BKEYS[bi]; buildBoard(); drawFieldPreview(pcv.getContext('2d')); pname.textContent=BOARDS[boardKey].name; }
      refreshPitch=renderPitch;
      prow.appendChild(arrowBtn('◀',()=>{ bi=(bi-1+BKEYS.length)%BKEYS.length; renderPitch(); }));
      prow.appendChild(pwrap);
      prow.appendChild(arrowBtn('▶',()=>{ bi=(bi+1)%BKEYS.length; renderPitch(); }));
      host.appendChild(prow); host.appendChild(pname);
      renderPitch();
    }

    function squadControls(host,onlyRed){
      host.appendChild(mk('div',FS(8,'#9a8fb0')+'margin:7px 0 4px;','SQUAD SIZE'));
      const sizeRow=mk('div','display:flex;gap:6px;justify-content:center;margin-bottom:5px;');
      const sizeBtns=[];
      function restyleSize(){ sizeBtns.forEach(([b,sz])=>{ const s=teamSize===sz; b.style.background=s?'#c6e84a':'#0e0a16'; b.style.color=s?'#0b0910':'#8a7ea0'; b.style.borderColor=s?'#c6e84a':'#3a3050'; }); }
      [5,7].forEach(sz=>{ const b=mk('button',SQBTN,sz+' A-SIDE'); b.onclick=()=>{ teamSize=sz; formationName={red:defaultFormation(sz),blue:defaultFormation(sz)}; if(typeof fmtRefreshers!=='undefined') fmtRefreshers.forEach(function(f){ try{ f(); }catch(e){} }); restyleSize(); refreshPitch(); }; sizeBtns.push([b,sz]); sizeRow.appendChild(b); });
      host.appendChild(sizeRow);
      restyleSize();
    }

    function buildPre(){ pen=null; try{ var _me0=document.getElementById('ns_matchend'); if(_me0&&_me0.parentNode) _me0.parentNode.removeChild(_me0); }catch(e){}
      pre.innerHTML=''; pre.style.display='block'; pre.scrollTop=0;
      const pad=mk('div','padding:7px 8px 9px;');
      (function(){ var logo=mk('div','text-align:center;margin:1px 0 6px;line-height:1.0;'); var ex='text-shadow:0 2px 0 #33244a,0 4px 0 #1c1330,0 6px 7px rgba(0,0,0,0.55);'; logo.appendChild(mk('div',FS(20,'#f4e9c8')+'letter-spacing:3px;'+ex,'SOCCER')); logo.appendChild(mk('div',FS(23,'#c6e84a')+'letter-spacing:2px;margin-top:3px;'+ex,'PARTY')); var _NC=window._FAN_NAT||{}; var _mfans=[]; function _mkFanEl(sheet,color,x,sz,back,flip){ var cnv=mk('canvas','image-rendering:pixelated;position:absolute;'); cnv.width=48; cnv.height=48; cnv.style.width=sz+'px'; cnv.style.height=sz+'px'; cnv.style.left=x+'px'; cnv.style.bottom=(back?'11px':'0px'); cnv.style.zIndex=(back?'1':'2'); if(back) cnv.style.opacity='0.82'; var im=new Image(); try{ im.src='assets/generated/'+sheet; }catch(e){} _mfans.push({cnv:cnv,im:im,col:color,flip:flip}); return cnv; } function _side(defs,flip){ var box=mk('div','position:relative;width:104px;height:60px;'); defs.forEach(function(D){ box.appendChild(_mkFanEl(D.sheet,(window._flagTintFor?window._flagTintFor(D.n,_NC[D.n]||'#cccccc'):(_NC[D.n]||'#cccccc')),D.x,D.s,D.b,flip)); }); return box; } var _left=_side([{sheet:'fan-flag-2-sheet.png',n:'Argentina',x:18,s:40,b:1},{sheet:'fan-flag-3-sheet.png',n:'Netherlands',x:52,s:40,b:1},{sheet:'fan-flag-1-sheet.png',n:'Brazil',x:2,s:52,b:0},{sheet:'fan-flag-2-sheet.png',n:'France',x:42,s:52,b:0}],true); var _right=_side([{sheet:'fan-flag-4-sheet.png',n:'Germany',x:18,s:40,b:1},{sheet:'fan-flag-1-sheet.png',n:'England',x:52,s:40,b:1},{sheet:'fan-flag-3-sheet.png',n:'Spain',x:2,s:52,b:0},{sheet:'fan-flag-4-sheet.png',n:'Italy',x:42,s:52,b:0}],false); var _row=mk('div','display:flex;align-items:flex-end;justify-content:center;gap:8px;margin-bottom:9px;'); _row.appendChild(_left); _row.appendChild(logo); _row.appendChild(_right); pad.appendChild(_row); if(window._fanMenuTimer) clearInterval(window._fanMenuTimer); var _mf=0; window._fanMenuTimer=setInterval(function(){ _mf=(_mf+1)%9; for(var q=0;q<_mfans.length;q++){ var F=_mfans[q], c2=F.cnv.getContext('2d'); c2.imageSmoothingEnabled=false; c2.clearRect(0,0,48,48); var fr=_fanFrame(F.im,_mf,F.col,F.flip); if(fr){ if(F.flip){ c2.save(); c2.translate(48,0); c2.scale(-1,1); c2.drawImage(fr,0,0); c2.restore(); } else { c2.drawImage(fr,0,0); } } } },140); })();
      const tabs=mk('div','display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr auto;gap:3px;margin-bottom:7px;');
      const tExh=mk('button',SQBTN+'font-size:6px;padding:7px 2px;text-align:center;','EXHIBITION');
      const tTour=mk('button',SQBTN+'font-size:6px;padding:7px 2px;text-align:center;','TOURNAMENT');
      const tPrac=mk('button',SQBTN+'font-size:6px;padding:7px 2px;text-align:center;','PRACTICE'); const tRoyale=mk('button',SQBTN+'font-size:6px;padding:7px 2px;text-align:center;','ROYALE'); tRoyale.onclick=()=>{ if(!_firstDone()){ _lockMsg(); return; } mode='royale'; styleTabs(); renderBody(); }; const tHelp=mk('button',SQBTN+'font-size:6px;padding:7px 2px;text-align:center;line-height:1.5;','HOW TO PLAY'); tHelp.onclick=function(){ try{ showHowTo(false); }catch(e){} }; const tTrophy=mk('button',SQBTN+'padding:4px 8px;text-align:center;display:flex;align-items:center;justify-content:center;',''); (function(){ var _ti=document.createElement('img'); _ti.src='assets/generated/icon-trophy.png'; _ti.alt='Achievements'; _ti.style.cssText='width:18px;height:18px;image-rendering:pixelated;display:block;'; tTrophy.appendChild(_ti); })(); tTrophy.onclick=function(){ try{ openAchievements(); }catch(e){} };
      function styleTabs(){ var _lk=(typeof _firstDone==='function')&&!_firstDone(); [[tExh,'exhibition'],[tTour,'tournament'],[tPrac,'practice'],[tRoyale,'royale']].forEach(([b,m])=>{ const s=mode===m; b.style.background=s?'#c6e84a':'#0e0a16'; b.style.color=s?'#0b0910':'#8a7ea0'; b.style.borderColor=s?'#c6e84a':'#3a3050'; }); [tTour,tPrac,tRoyale].forEach(function(b){ if(b) b.style.opacity=_lk?'0.4':'1'; }); }
      const body=mk('div','');
      function renderBody(){ body.innerHTML=''; (mode==='tournament'?buildTourSetup:(mode==='practice'?buildPractice:(mode==='royale'?buildRoyaleSetup:buildExhibition)))(body); }
      tExh.onclick=()=>{ mode='exhibition'; styleTabs(); renderBody(); };
      tTour.onclick=()=>{ if(!_firstDone()){ _lockMsg(); return; } mode='tournament'; styleTabs(); renderBody(); };
      tPrac.onclick=()=>{ if(!_firstDone()){ _lockMsg(); return; } mode='practice'; styleTabs(); renderBody(); }; tabs.append(tExh,tTour,tRoyale,tPrac,tHelp,tTrophy); pad.appendChild(tabs); pad.appendChild(body);
      styleTabs(); renderBody();
      pre.appendChild(pad);
    }

        function startPenalty(vsCpu, diff, best){
      pen=null; winner=null;
      mode='penalty'; sideAb={red:[],blue:[]}; pendingAb=null; tacticsChosen=true;
      aiEnabled={red:false, blue:!!vsCpu}; aiLevel=diff||'med';
      matchLen=0; matchMs=0; timeUp=false; timerRunning=false; winTarget=999;
      score={red:0,blue:0}; shotTrail=[]; hitSparks=[]; banner=0; celebrated=false; scoring=false; moving=false; aiming=false;
      pen={ active:true, vsCpu:!!vsCpu, best:best||5, shooter:'red', defender:'blue', taken:{red:0,blue:0}, scored:{red:0,blue:0}, history:{red:[],blue:[]}, sudden:false, step:'commit', dive:null, keeperHit:false, flyFrames:0, over:false, winnerSide:null, tendency:{L:0,C:0,R:0} };
      phase='play'; paused=false; try{stopAnthem();}catch(e){}
      applyTactics(); updateHUD();
      var e0=el('ns_pen_over'); if(e0&&e0.parentNode) e0.parentNode.removeChild(e0);
      setStatus('PENALTY SHOOTOUT');
      penStartKick();
    }
    function penPlaceKick(){
      scoring=false; celebrated=false; moving=false; aiming=false; aimStart=null; aimNow=null; netBulge=0; banner=0; shotTrail=[]; hitSparks=[]; coin.spin=0; coin.vx=0; coin.vy=0; flickCount=0;
      var def=pen.defender, topGoal=(def==='blue');
      var gy = topGoal ? (NET_DEPTH+NAIL_R+2) : (H-NET_DEPTH-NAIL_R-2);
      nails=[{x:W/2, y:gy, team:def, goalie:true}];
      var penY = topGoal ? (NET_DEPTH+GOAL_AREA_D+8) : (H-NET_DEPTH-GOAL_AREA_D-8);
      coin.x=W/2; coin.y=penY;
    }
    function penKeeperGuess(){ var Z=['L','C','R']; var t=(pen&&pen.tendency)||{L:0,C:0,R:0}; var tot=t.L+t.C+t.R; var readP=aiLevel==='hard'?0.6:(aiLevel==='med'?0.3:0); if(tot>=2 && Math.random()<readP){ var best='C',bv=-1; for(var i=0;i<3;i++){ if(t[Z[i]]>bv){bv=t[Z[i]];best=Z[i];} } return best; } return Z[Math.floor(Math.random()*3)]; }
    function penStartKick(){
      if(!pen) return;
      if(pen.sudden && pen.taken.red===pen.best && pen.taken.blue===pen.best){ setStatus('SUDDEN DEATH!'); try{sfxSuddenDeath();}catch(e){} } pen.step='commit'; pen.dive=null; pen.keeperHit=false; pen.flyFrames=0;
      penPlaceKick(); current=pen.shooter; applyTactics();
      var defCpu=!!(aiEnabled&&aiEnabled[pen.defender]);
      if(defCpu){ pen.dive=penKeeperGuess(); pen.step='aim'; penShowShootPrompt(); }
      else { penShowDiveUI(); }
      updateHUD();
    }
    function penUpdateKeeper(){
      if(!nails||!nails.length) return;
      var g=null; for(var i=0;i<nails.length;i++){ if(nails[i].goalie){ g=nails[i]; break; } }
      if(!g) return;
      var gl=(W-GOAL_W)/2+NAIL_R, gr=(W+GOAL_W)/2-NAIL_R, third=GOAL_W/3, tx=W/2;
      if(pen.step==='flying' && pen.dive){
        var zmin,zmax;
        if(pen.dive==='L'){ zmin=(W-GOAL_W)/2; zmax=(W-GOAL_W)/2+third; }
        else if(pen.dive==='R'){ zmin=(W+GOAL_W)/2-third; zmax=(W+GOAL_W)/2; }
        else { zmin=(W-GOAL_W)/2+third; zmax=(W+GOAL_W)/2-third; }
        tx = Math.max(zmin, Math.min(zmax, coin.x));
      }
      tx=Math.max(gl,Math.min(gr,tx));
      var lf=(pen.step==='flying')?0.8:0.22;
      g.x += (tx-g.x)*lf;
    }
    function penTick(){
      if(!pen||!pen.active) return;
      if(pen.step==='aim' && moving){ pen.step='flying'; pen.flyFrames=0; pen.keeperHit=false; penHideDive(); }
      if(pen.step==='flying'){ pen.flyFrames++; if(pen.flyFrames>300 && moving && !scoring){ coin.vx=0; coin.vy=0; moving=false; endFlick(); } }
    }
    function penResolve(kind){
      if(!pen||!pen.active||pen.step==='result') return;
      pen.step='result';
      var s=pen.shooter, goal=(kind==='goal'); if(pen.tendency && !(aiEnabled&&aiEnabled[s])){ var _tx=coin.x, _t3=(_tx<W/2-GOAL_W/6)?'L':((_tx>W/2+GOAL_W/6)?'R':'C'); pen.tendency[_t3]=(pen.tendency[_t3]||0)+1; }
      pen.taken[s]++; pen.history[s].push(goal?'G':'X'); if(goal) pen.scored[s]++;
      score={red:pen.scored.red, blue:pen.scored.blue};
      if(goal){ setStatus('GOAL!'); } else if(kind==='save'){ setStatus('SAVED!'); try{sfxSave();}catch(e){} } else { setStatus('MISSED!'); try{sfxMiss();}catch(e){} }
      updateHUD(); penHideDive();
      var dec=penDecided();
      if(dec){
        pen.over=true; pen.winnerSide=(dec==='draw'?null:dec);
        if(dec!=='draw'){ try{ if(dec==='red') spAchUnlock('shootout'); }catch(e){} setTimeout(function(){ setStatus(teamKits[dec].name.toUpperCase()+' WIN THE SHOOTOUT!'); try{sfxWhistle();}catch(e){} try{sfxCheer();}catch(e){} },250); }
        setTimeout(function(){ if(!pen) return; if(_lkFromTour && dec && dec!=='draw'){ _lkFromTour=false; try{ if(_lkTourSave){ score={red:_lkTourSave.score.red,blue:_lkTourSave.score.blue}; if(sideAb) sideAb.red=(_lkTourSave.ab||[]).slice(); } }catch(e){} _lkTourSave=null; winner=dec; mode='tournament'; pen=null; try{ setStatus(teamKits[winner].name.toUpperCase()+' WIN!'); }catch(e){} setTimeout(function(){ try{ tourMatchEnd(); }catch(e){} },900); return; } penGameOver(dec); }, 1400);
      } else {
        setTimeout(function(){ if(!pen||!pen.active) return; var ns=(pen.shooter==='red')?'blue':'red'; pen.shooter=ns; pen.defender=(ns==='red')?'blue':'red'; penStartKick(); }, 1300);
      }
    }
    function penDecided(){
      var r=pen.scored.red, b=pen.scored.blue, tr=pen.taken.red, tb=pen.taken.blue, N=pen.best;
      if(!pen.sudden){
        var remR=Math.max(0,N-tr), remB=Math.max(0,N-tb);
        if(r>b+remB) return 'red';
        if(b>r+remR) return 'blue';
        if(tr>=N && tb>=N){ if(r>b) return 'red'; if(b>r) return 'blue'; pen.sudden=true; return null; }
        return null;
      }
      if(tr===tb && tr>N){ if(r>b) return 'red'; if(b>r) return 'blue'; }
      return null;
    }
    function penShowShootPrompt(){
      penHideDive();
      var shooterCpu=!!(aiEnabled&&aiEnabled[pen.shooter]);
      if(shooterCpu) setStatus(teamKits[pen.shooter].abbr+' SHOOTING...');
      else setStatus(teamKits[pen.shooter].abbr+' - DRAG TO SHOOT!');
    }
    function penHideDive(){ var e1=el('ns_pen_dive'); if(e1&&e1.parentNode) e1.parentNode.removeChild(e1); }
    function penShowDiveUI(){
      penHideDive();
      var stage=el('ns_stage'); if(!stage) return;
      var topGoal=(pen.defender==='blue');
      var wrap=mk('div','position:absolute;left:0;right:0;'+(topGoal?'top:8%;':'bottom:12%;')+'display:flex;flex-direction:column;align-items:center;gap:6px;z-index:8;'); wrap.id='ns_pen_dive';
      wrap.appendChild(mk('div',FS(8,'#ffe9a8')+'text-shadow:0 2px 0 #000;text-align:center;line-height:1.6;',teamKits[pen.defender].abbr+' KEEPER - PICK A DIVE'));
      var row=mk('div','display:flex;gap:8px;');
      var opts=[['L','< LEFT'],['C','CENTER'],['R','RIGHT >']];
      for(var i=0;i<opts.length;i++){ (function(o){ var b=mk('button',SQBTN+'font-size:8px;padding:11px 9px;',o[1]); b.onclick=function(){ if(!pen) return; pen.dive=o[0]; penHideDive(); pen.step='aim'; penShowShootPrompt(); }; row.appendChild(b); })(opts[i]); }
      wrap.appendChild(row); stage.appendChild(wrap);
    }
    function penGameOver(dec){
      var stage=el('ns_stage'); if(!stage) return; penHideDive();
      var ex=el('ns_pen_over'); if(ex&&ex.parentNode) ex.parentNode.removeChild(ex);
      var vs=pen?pen.vsCpu:false, rs=pen?pen.scored.red:0, bs=pen?pen.scored.blue:0;
      var win=(dec&&dec!=='draw');
      var ov=mk('div','position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;background:rgba(6,5,12,0.9);z-index:9;'); ov.id='ns_pen_over';
      ov.appendChild(mk('div',FS(12,'#c6e84a')+'text-shadow:0 3px 0 #1c1330;','SHOOTOUT'));
      if(win){ var fc=document.createElement('canvas'); fc.width=34; fc.height=22; fc.style.cssText='width:46px;height:30px;image-rendering:pixelated;'; try{ var fg=fc.getContext('2d'); fg.imageSmoothingEnabled=false; paintPattern(fg,0,0,34,22,teamKits[dec].kit); fg.strokeStyle='rgba(0,0,0,0.5)'; fg.strokeRect(0.5,0.5,33,21); }catch(e){} ov.appendChild(fc); var ti=document.createElement('img'); ti.src='assets/generated/icon-trophy.png'; ti.alt='trophy'; ti.style.cssText='width:44px;height:44px;image-rendering:pixelated;display:block;'; ov.appendChild(ti); }
      ov.appendChild(mk('div',FS(18,'#f4e9c8')+'text-shadow:0 3px 0 #1c1330;',win?(teamKits[dec].abbr+' WIN!'):'DRAW'));
      ov.appendChild(mk('div',FS(14,'#f4e9c8'),rs+' - '+bs));
      var brow=mk('div','display:flex;gap:10px;margin-top:8px;');
      var again=mk('button',SQBTN+'font-size:9px;padding:10px 12px;','REMATCH');
      again.onclick=function(){ if(ov.parentNode) ov.parentNode.removeChild(ov); startPenalty(vs, aiLevel, penBest); };
      var menu=mk('button',SQBTN+'font-size:9px;padding:10px 12px;','HOME');
      menu.onclick=function(){ if(ov.parentNode) ov.parentNode.removeChild(ov); pen=null; winner=null; mode='exhibition'; buildPre(); };
      brow.appendChild(again); brow.appendChild(menu); ov.appendChild(brow); stage.appendChild(ov);
    }
    function drawPenaltyHUD(){
      if(!pen) return;
      var N=pen.best, dotR=4, gap=11;
      function prow(side, cy){ var arr=pen.history[side], seg, total;
        if(pen.sudden){ var sd=arr.slice(N); var cyc=(sd.length===0)?0:(((sd.length-1)%N)+1); total=Math.max(1,cyc); seg=(cyc===0)?[]:sd.slice(sd.length-cyc); } else { total=N; seg=arr.slice(0,N); }
        var w=(total-1)*gap, x0=W/2-w/2;
        // dark pill behind the dots so they read on any pitch colour
        var padX=dotR+6, ph=dotR*2+10, px=x0-padX, pw=w+padX*2, py=cy-ph/2, pr=ph/2;
        ctx.beginPath(); ctx.moveTo(px+pr,py); ctx.arcTo(px+pw,py,px+pw,py+ph,pr); ctx.arcTo(px+pw,py+ph,px,py+ph,pr); ctx.arcTo(px,py+ph,px,py,pr); ctx.arcTo(px,py,px+pw,py,pr); ctx.closePath(); ctx.fillStyle='rgba(8,6,14,0.72)'; ctx.fill(); ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=1; ctx.stroke();
        for(var i=0;i<total;i++){ var x=x0+i*gap; ctx.beginPath(); ctx.arc(x,cy,dotR,0,Math.PI*2); if(i<seg.length){ ctx.fillStyle=(seg[i]==='G')?'#5dff5d':'#ff5a4a'; ctx.fill(); } else { ctx.fillStyle='rgba(255,255,255,0.14)'; ctx.fill(); ctx.strokeStyle='rgba(255,255,255,0.85)'; ctx.lineWidth=1; ctx.stroke(); } } }
      prow('blue', Math.round(H*0.30)); prow('red', Math.round(H*0.70)); if(pen.sudden){ ctx.save(); ctx.font="6px 'Press Start 2P', monospace"; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle='#ffd21a'; ctx.fillText('SUDDEN DEATH', W/2, Math.round(H*0.5)); ctx.restore(); }
    }
    function buildExhibition(host){ fmtRefreshers=[]; pitchStepper(host); var cols=mk('div','display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;'); var _rS=teamStepper('red','YOU','#c6e84a'); var _bS=teamStepper('blue','CPU','#c6e84a'); cols.appendChild(_rS); cols.appendChild(_bS); function updExhLabels(){ var twoP=(cpuSel!=='cpu'); if(_rS.firstChild) _rS.firstChild.textContent=twoP?'PLAYER 1':'YOU'; if(_bS.firstChild) _bS.firstChild.textContent=twoP?'PLAYER 2':'CPU'; } updExhLabels(); host.appendChild(cols); squadControls(host); var diffWrap=mk('div',''); segRow(host,'OPPONENT',[['off','2 PLAYERS'],['cpu','CPU']],function(){return cpuSel;},function(v){ cpuSel=v; updExhLabels(); diffWrap.style.display=v==='cpu'?'block':'none'; },2); segRow(diffWrap,'DIFFICULTY',[['easy','EASY'],['med','MEDIUM'],['hard','HARD']],function(){return exhLevel;},function(v){exhLevel=v;},3); diffWrap.style.display=cpuSel==='cpu'?'block':'none'; host.appendChild(diffWrap); segRow(host,'GOALS TO WIN',[[3,'3'],[5,'5'],[7,'7']],function(){return exhWin;},function(v){exhWin=v;},3); segRow(host,'PENALTY SHOOTOUT',[['on','ON'],['off','OFF']],function(){return _lkOn?'on':'off';},function(v){ _lkOn=(v==='on'); try{spSaveSettings();}catch(e){} },2); segRow(host,'COIN RUSH',[['off','OFF'],['on','ON']],function(){return _ecoOn?'on':'off';},function(v){ _ecoOn=(v==='on'); },2); host.appendChild(mk('div',FS(6,'#8a7ea0')+'text-align:center;line-height:1.7;margin:2px 0 4px;','Hit gold tokens to fill a shared pot; score to claim it and spend coins in the ability shop.')); var play=mk('button','margin-top:9px;width:100%;'+FS(11,'#0b1a0e')+'background:#c6e84a;border:2px solid #e6ff7a;padding:9px;cursor:pointer;','PLAY  ▸'); play.onclick=function(){ teamKits.red=resolveSel('red'); teamKits.blue=resolveSel('blue',teamKits.red); buildBoard(); buildCrowd(); mode='exhibition'; winTarget=exhWin; matchLen=0; aiLevel=exhLevel; aiEnabled={red:false,blue:cpuSel==='cpu'}; pre.style.display='none'; newMatch(); try{ showVsIntro(); }catch(e){} }; host.appendChild(play); } function buildPractice(host){ fmtRefreshers=[]; pitchStepper(host); var cols=mk('div','display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;'); cols.appendChild(teamStepper('red','TEAM 1','#c6e84a')); cols.appendChild(teamStepper('blue','TEAM 2','#c6e84a')); host.appendChild(cols); squadControls(host); var ptWrap=mk('div',''); segRow(host,'MATCH TYPE',[['normal','NORMAL'],['penalty','PENALTIES']],function(){return pracType;},function(v){ pracType=v; ptWrap.style.display=v==='penalty'?'block':'none'; },2); segRow(ptWrap,'BEST OF',[[3,'3 KICKS'],[5,'5 KICKS']],function(){return penBest;},function(v){penBest=v;},2); ptWrap.style.display=pracType==='penalty'?'block':'none'; host.appendChild(ptWrap); var play=mk('button','margin-top:8px;width:100%;'+FS(11,'#0b1a0e')+'background:#c6e84a;border:2px solid #e6ff7a;padding:9px;cursor:pointer;','PLAY  ▸'); play.onclick=function(){ teamKits.red=resolveSel('red'); teamKits.blue=resolveSel('blue',teamKits.red); buildBoard(); buildCrowd(); if(pracType==='penalty'){ aiLevel=exhLevel; pre.style.display='none'; startPenalty(false, exhLevel, penBest); return; } mode='practice'; winTarget=99; matchLen=0; aiLevel=exhLevel; aiEnabled={red:false,blue:false}; pendingAb=null; pre.style.display='none'; newMatch(); }; host.appendChild(play); } function buildRoyaleSetup(host){ fmtRefreshers=[]; host.appendChild(mk('div',FS(9,'#c6e84a')+'text-align:center;margin:6px 0 6px;letter-spacing:1px;','STADIUM ROYALE')); host.appendChild(mk('div',FS(8,'#9a8fb0')+'margin:2px 0 4px;','YOUR TEAM')); var trow=mk('div','display:flex;justify-content:center;'); trow.appendChild(teamStepper('red','TEAM','#c6e84a')); host.appendChild(trow); segRow(host,'DIFFICULTY',[['easy','EASY'],['med','MEDIUM'],['hard','HARD']],function(){return royaleLevel;},function(v){ royaleLevel=v; },3); host.appendChild(mk('div',FS(7,'#9a8fb0')+'text-align:center;line-height:1.8;margin:10px 0 2px;','9 stadiums, each with a wild twist that hits both sides. Win to advance — one loss ends the whole run. Can you go unbeaten through all 9?')); var start=mk('button','margin-top:10px;width:100%;'+FS(11,'#0b1a0e')+'background:#c6e84a;border:2px solid #e6ff7a;padding:11px;cursor:pointer;','START ROYALE  ▸'); start.onclick=function(){ teamKits.red=resolveSel('red'); buildCrowd(); startRoyale(PRESETS.indexOf(teamKits.red)); }; try{ spSetResume(start,'royale'); }catch(e){} host.appendChild(start); } function buildTourSetup(host){ fmtRefreshers=[]; host.appendChild(mk('div',FS(9,'#c6e84a')+'text-align:center;margin:6px 0 6px;letter-spacing:1px;','WORLD CUP')); host.appendChild(mk('div',FS(8,'#9a8fb0')+'margin:2px 0 4px;','YOUR TEAM')); var trow=mk('div','display:flex;justify-content:center;'); trow.appendChild(teamStepper('red','TEAM','#c6e84a')); host.appendChild(trow); segRow(host,'BRACKET',[[4,'4 TEAMS'],[8,'8 TEAMS'],[16,'16 TEAMS']],function(){return tourSize;},function(v){tourSize=v;},3); segRow(host,'DIFFICULTY',[['easy','EASY'],['med','MEDIUM'],['hard','HARD']],function(){return tourLevel;},function(v){ tourLevel=v; },3); squadControls(host,true); host.appendChild(mk('div',FS(7,'#9a8fb0')+'text-align:center;line-height:1.8;margin:9px 0 2px;','Start with no abilities. Win one for every goal — a roguelike run where you build a stronger ability loadout each round, surviving your way to the final to become champion. With all 3 slots full, each new ability you win can swap out an older one so you keep sharpening your build.')); var start=mk('button','margin-top:9px;width:100%;'+FS(11,'#0b1a0e')+'background:#c6e84a;border:2px solid #e6ff7a;padding:9px;cursor:pointer;','START CUP  ▸'); start.onclick=function(){ teamKits.red=resolveSel('red'); buildCrowd(); startCup(tourSize, PRESETS.indexOf(teamKits.red), tourLevel); }; try{ spSetResume(start,'tournament'); }catch(e){} host.appendChild(start); } function teamChip(idx,highlight){
      const p=PRESETS[idx], chip=mk('div','display:flex;align-items:center;gap:4px;');
      const c=document.createElement('canvas'); c.width=24; c.height=16; c.style.width='26px'; c.style.height='18px'; c.style.imageRendering='pixelated';
      const g=c.getContext('2d'); g.imageSmoothingEnabled=false; paintPattern(g,0,0,24,16,p.kit); g.strokeStyle='rgba(0,0,0,0.5)'; g.strokeRect(0.5,0.5,23,15);
      chip.appendChild(c); chip.appendChild(mk('span',FS(7,highlight?'#c6e84a':'#e8ddca'),p.abbr));
      return chip;
    }

    function drawTrophy(g,cx,cy,s){
      g.fillStyle='#eccb52'; g.strokeStyle='#eccb52'; g.lineWidth=1.4; g.lineCap='round';
      g.beginPath(); g.moveTo(cx-s,cy-s*1.1); g.lineTo(cx+s,cy-s*1.1); g.lineTo(cx+s*0.6,cy+s*0.2); g.lineTo(cx-s*0.6,cy+s*0.2); g.closePath(); g.fill();
      g.beginPath(); g.arc(cx-s*1.1,cy-s*0.6,s*0.6,Math.PI*0.5,Math.PI*1.4); g.stroke();
      g.beginPath(); g.arc(cx+s*1.1,cy-s*0.6,s*0.6,Math.PI*1.6,Math.PI*2.5); g.stroke();
      g.fillRect(cx-s*0.22,cy+s*0.2,s*0.44,s*0.5);
      g.fillRect(cx-s*0.7,cy+s*0.7,s*1.4,s*0.35);
    }
    function bracketFlag(g,fx,fy,fr,idx,hl){
      if(idx==null){ g.beginPath(); g.arc(fx,fy,fr,0,Math.PI*2); g.fillStyle='#181322'; g.fill(); g.lineWidth=1.4; g.strokeStyle='#37304c'; g.stroke(); return; }
      const p=PRESETS[idx];
      g.save(); g.beginPath(); g.arc(fx,fy,fr,0,Math.PI*2); g.clip();
      paintPattern(g,fx-fr,fy-fr,fr*2,fr*2,p.kit); g.restore();
      g.beginPath(); g.arc(fx,fy,fr,0,Math.PI*2); g.lineWidth=hl?2.6:1.4; g.strokeStyle=hl?'#ffd84a':'#0c0a12'; g.stroke();
    }
    function showBracket(){ try{spSaveRun();}catch(e){}
      pre.innerHTML=''; pre.style.display='block'; pre.scrollTop=0;
      const pad=mk('div','padding:14px 10px 16px;');
      pad.appendChild(mk('div',FS(12,'#f4e9c8')+'text-align:center;letter-spacing:1px;','WORLD CUP'));
      pad.appendChild(mk('div',FS(8,'#c6e84a')+'text-align:center;margin:6px 0 10px;',roundName(curRound().length)));
      const SZ=236, BH=236; const R0=tour.size>=16?9:12;
      const cv=document.createElement('canvas'); cv.width=SZ; cv.height=BH; cv.style.width='100%'; cv.style.height='auto'; cv.style.display='block'; cv.style.imageRendering='pixelated';
      pad.appendChild(cv);
      const g=cv.getContext('2d'); g.imageSmoothingEnabled=false;
      const L=Math.round(Math.log2(tour.size))+1, lvls=L-1, CXX=SZ/2;
      const teamAt=(l,j)=>{ const r=tour.rounds[l]; return r?r[j]:null; };
      const hlAt=(l,j)=>{ const r=tour.rounds[l]; return r&&r[j]===tour.playerPreset; };
      const perSide=tour.size/2, MARG=24, FINX=88;
      const TOPY=perSide<4?82:42, BOTY=perSide<4?178:218;
      const xAt=(l,left)=>{ const x=lvls<2?MARG:MARG+l*((FINX-MARG)/(lvls-1)); return left?x:SZ-x; };
      const rowY=i=>perSide===1?(TOPY+BOTY)/2:TOPY+i*((BOTY-TOPY)/(perSide-1));
      function posAt(l,j){ const n=tour.size>>l, left=j<n/2; if(l===0){ const i=left?j:j-n/2; return {x:xAt(0,left),y:rowY(i)}; } const a=posAt(l-1,2*j), b=posAt(l-1,2*j+1); return {x:xAt(l,left),y:(a.y+b.y)/2}; }
      // elbow connectors, player path in gold drawn on top
      const edges=[];
      for(let l=0;l<lvls-1;l++){ const n=tour.size>>l; for(let j=0;j<n;j++){ edges.push([l,j,hlAt(l,j)?1:0]); } }
      edges.sort((a,b)=>a[2]-b[2]);
      for(const [l,j,hl] of edges){ const a=posAt(l,j), b=posAt(l+1,j>>1); const xm=Math.round((a.x+b.x)/2)+0.5, ay=Math.round(a.y)+0.5, by=Math.round(b.y)+0.5; g.beginPath(); g.moveTo(a.x,ay); g.lineTo(xm,ay); g.lineTo(xm,by); g.lineTo(b.x,by); g.lineWidth=hl?2.4:1.6; g.strokeStyle=hl?'#ffd84a':'#39304e'; g.stroke(); }
      // round labels
      g.font='7px "Press Start 2P", monospace'; g.textAlign='center'; g.textBaseline='middle'; g.fillStyle='#7d719c';
      for(let l=0;l<lvls;l++){ const n=tour.size>>l, txt=n===2?'FINAL':n===4?'SEMIS':n===8?'QTRS':'R'+n; const ly=n===2?20:20+(l%2)*12; if(n===2){ g.fillText(txt,CXX,ly); } else { g.fillText(txt,xAt(l,true),ly); g.fillText(txt,xAt(l,false),ly); } }
      // flags: losers dimmed, your next opponent ringed
      const NODESB=[];
      for(let l=0;l<lvls;l++){ const n=tour.size>>l; for(let j=0;j<n;j++){ const t=teamAt(l,j), pos=posAt(l,j), nxt=tour.rounds[l+1]; if(t!=null) NODESB.push({x:pos.x,y:pos.y,t:t}); const out=(t!=null)&&nxt&&nxt.indexOf(t)<0; if(out) g.globalAlpha=0.35; bracketFlag(g,pos.x,pos.y,l===0?R0:10,t,hlAt(l,j)); g.globalAlpha=1; } }
      const lc=tour.rounds.length-1, oi=curRound().indexOf(currentOpponent());
      if(oi>=0 && !tour.eliminated){ const op=posAt(lc,oi); g.beginPath(); g.arc(op.x,op.y,(lc===0?R0:10)+2.5,0,Math.PI*2); g.lineWidth=2; g.strokeStyle='#e8ddca'; g.stroke(); }
      const midY=(posAt(lvls-1,0).y+posAt(lvls-1,1).y)/2;
      if(typeof NS_TROPHY!=='undefined'&&NS_TROPHY.complete&&NS_TROPHY.naturalWidth){ g.drawImage(NS_TROPHY,Math.round(CXX-14),Math.round(midY-14),28,28); } else { drawTrophy(g,CXX,midY,7); }
      function showCountryCard(idx){ var p=PRESETS[idx]; var old=el('ns_ccard'); if(old) old.remove(); var ov=mk('div','position:fixed;inset:0;z-index:40;display:flex;align-items:center;justify-content:center;background:rgba(6,4,10,0.78);padding:14px;box-sizing:border-box;'); ov.id='ns_ccard'; var panel=mk('div','width:100%;max-width:300px;background:linear-gradient(#1a1330,#0e0a18);border:2px solid #4a3a5e;border-radius:10px;padding:14px 12px;box-shadow:0 6px 20px rgba(0,0,0,0.6);'); try{ var _bk=p.name.toLowerCase(); if(typeof NS_VSBG!=='undefined'&&NS_VSBG[_bk]&&NS_VSBG[_bk].complete&&NS_VSBG[_bk].naturalWidth){ panel.style.background='linear-gradient(180deg,rgba(14,9,20,0.5),rgba(14,9,20,0.32) 45%,rgba(14,9,20,0.62)),url('+NS_VSBG[_bk].src+') center/cover'; } }catch(e){} var head=mk('div','display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:8px;'); var fc=document.createElement('canvas'); fc.width=24; fc.height=16; fc.style.cssText='width:26px;height:18px;image-rendering:pixelated;border:1px solid rgba(0,0,0,0.5);'; var fg=fc.getContext('2d'); fg.imageSmoothingEnabled=false; paintPattern(fg,0,0,24,16,p.kit); head.appendChild(fc); head.appendChild(mk('div',FS(10,'#f4e9c8'),p.name.toUpperCase())); panel.appendChild(head); var bd=BOARDS[COUNTRY_PITCH[p.name]]||BOARDS.grass; panel.appendChild(mk('div',FS(7,'#c6e84a')+'text-align:center;margin-bottom:7px;','HOME PITCH: '+bd.name)); var _isP=(idx===tour.playerPreset); var fmc=document.createElement('canvas'); fmc.width=W; fmc.height=H; fmc.style.cssText='width:132px;height:auto;image-rendering:pixelated;display:block;margin:0 auto 8px;border:2px solid #4a3a5e;border-radius:4px;'; var _oppStyle=(p.name===PRESETS[tour.playerPreset].name)?'away':'flag'; function paintFmc(){ try{ renderCountryField(fmc.getContext('2d'),p.name,p.kit,(_isP?((typeof kitStyle!=='undefined'&&kitStyle.red)?kitStyle.red:'jersey'):_oppStyle),(_isP?'red':'blue')); }catch(e){} } paintFmc(); panel.appendChild(mk('div',FS(7,'#c6e84a')+'text-align:center;margin-bottom:5px;','FORMATION')); panel.appendChild(fmc); function abRow(id){ var t=TACTIC_MAP[id]; if(!t) return; var row=mk('div','display:flex;align-items:center;gap:9px;margin-bottom:8px;'); var ic=mk('div','width:34px;height:34px;flex:0 0 auto;display:flex;align-items:center;justify-content:center;font-size:19px;'); if(ICON_IMG[id]&&ICON_IMG[id].ok){ var im=document.createElement('img'); im.src=ICON_SRC[id]; im.style.cssText='width:100%;height:100%;object-fit:contain;image-rendering:pixelated;'; ic.appendChild(im); } else { ic.textContent=t.icon; } var tx=mk('div','flex:1;'); tx.appendChild(mk('div',FS(7,'#c6e84a'),t.name)); tx.appendChild(mk('div','font-size:10px;line-height:1.45;color:#b9add0;',t.desc)); row.appendChild(ic); row.appendChild(tx); panel.appendChild(row); } if(idx===tour.playerPreset){ panel.appendChild(mk('div',FS(7,'#c6e84a')+'text-align:center;margin:2px 0 5px;','YOUR KIT')); var ksRow=mk('div','display:flex;gap:7px;justify-content:center;margin-bottom:10px;'); var ksItems=[]; ['flag','jersey','away'].forEach(function(stl){ var kb=mk('button','padding:2px;cursor:pointer;border:2px solid #3a3050;border-radius:6px;background:#0e0a16;line-height:0;'); var cvv=document.createElement('canvas'); cvv.width=30; cvv.height=30; cvv.style.cssText='width:30px;height:30px;image-rendering:pixelated;display:block;'; kb.appendChild(cvv); kb.onclick=function(e){ if(e&&e.stopPropagation)e.stopPropagation(); kitStyle.red=stl; paintKsC(); paintFmc(); }; ksItems.push({b:kb,cv:cvv,style:stl}); ksRow.appendChild(kb); }); function paintKsC(){ var cur=(kitStyle&&kitStyle.red)?kitStyle.red:'jersey'; ksItems.forEach(function(it){ var g2=it.cv.getContext('2d'); g2.imageSmoothingEnabled=false; g2.clearRect(0,0,30,30); try{ paintNail(g2,15,15,12,p.kit,false,resolveKit(p.kit,it.style)); }catch(e){} var on=cur===it.style; it.b.style.borderColor=on?'#c6e84a':'#3a3050'; it.b.style.background=on?'rgba(198,232,74,0.12)':'#0e0a16'; }); } paintKsC(); panel.appendChild(ksRow); panel.appendChild(mk('div',FS(7,'#c6e84a')+'text-align:center;margin:2px 0 6px;','YOUR ABILITIES')); var own=(tour.playerAb||[]).slice(0,3); if(own.length){ own.forEach(abRow); panel.appendChild(mk('div','font-size:10px;line-height:1.55;color:#b9add0;text-align:center;margin-top:2px;','Carried through the cup. Score with full slots to swap one.')); } else { panel.appendChild(mk('div','font-size:11px;line-height:1.6;color:#b9add0;text-align:center;','No abilities yet — win one on every goal, and they carry between matches.')); } } else { var cnt=tour.level==='easy'?1:tour.level==='med'?2:3; (COUNTRY_AB[p.name]||[]).slice(0,cnt).forEach(abRow); } ov.appendChild(panel); ov.addEventListener('click',function(e){ if(e.target===ov) ov.remove(); }); document.body.appendChild(ov); }
      cv.style.cursor='pointer';
      cv.addEventListener('click',function(e){ var rect=cv.getBoundingClientRect(); var mx=(e.clientX-rect.left)*SZ/rect.width, my=(e.clientY-rect.top)*BH/rect.height; for(var k=0;k<NODESB.length;k++){ var nd=NODESB[k]; if(Math.hypot(mx-nd.x,my-nd.y)<=15){ showCountryCard(nd.t); return; } } });
      // your next match caption
      const opp=currentOpponent();
      const cap=mk('div','display:flex;align-items:center;justify-content:center;gap:6px;margin-top:8px;');
      cap.appendChild(teamChip(tour.playerPreset,true)); cap.appendChild(mk('span',FS(7,'#8a7ea0'),'vs')); cap.appendChild(teamChip(opp,false));
      pad.appendChild(cap);
      pad.appendChild(mk('div',FS(6,'#8a7ea0')+'text-align:center;margin-top:7px;letter-spacing:1px;','TAP A FLAG TO SCOUT A TEAM'));
      const play=mk('button',"margin-top:12px;width:100%;"+FS(11,'#0b1a0e')+"background:#c6e84a;border:2px solid #e6ff7a;padding:9px;cursor:pointer;",'PLAY MATCH  ▸');
      play.onclick=startTourMatch; pad.appendChild(play);
      const quit=mk('button',"margin-top:8px;width:100%;"+FS(8,'#8a7ea0')+"background:#14101e;border:2px solid #3a3050;padding:8px;cursor:pointer;",'QUIT CUP');
      quit.onclick=()=>{ mode='exhibition'; try{tour=null;}catch(e){} try{spClearRun('tournament');}catch(e){} buildPre(); }; pad.appendChild(quit);
      pre.appendChild(pad);
    }

    function showTourResult(champ){ if(champ){ try{ setTimeout(function(){ try{sfxChampion();}catch(e){} },200); }catch(e){} } else { try{ setTimeout(function(){ try{sfxEliminated();}catch(e){} },200); }catch(e){} }
      pre.innerHTML=''; pre.style.display='block'; pre.scrollTop=0;
      if(champ){ if(!document.getElementById('ns_champstyle')){ var _cs=document.createElement('style'); _cs.id='ns_champstyle'; _cs.textContent='@keyframes nsChampSpin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}@keyframes nsChampPop{0%{transform:scale(0);}60%{transform:scale(1.25);}100%{transform:scale(1);}}@keyframes nsChampFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}@keyframes nsChampGlow{0%,100%{text-shadow:0 0 6px rgba(255,216,74,0.5),0 3px 0 #6b4a00;}50%{text-shadow:0 0 20px rgba(255,216,74,1),0 3px 0 #6b4a00;}}'; (document.head||document.documentElement).appendChild(_cs); } var fx=document.createElement('canvas'); fx.id='ns_champfx'; fx.width=360; fx.height=700; fx.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;'; pre.appendChild(fx); var fg=fx.getContext('2d'); var kcols=(PRESETS[tour.playerPreset].kit.colors||[]).concat(['#ffd84a','#f4e9c8']); var PTS=[]; function _cconf(){ if(PTS.length>420) return; PTS.push({x:Math.random()*fx.width,y:-6,vx:(Math.random()-0.5)*0.8,vy:1+Math.random()*1.7,g:0.012,life:260,sz:2+(Math.random()*3|0),c:kcols[Math.random()*kcols.length|0],tw:Math.random()*6.28}); } function _cburst(){ if(PTS.length>380) return; var bx=40+Math.random()*(fx.width-80), by=60+Math.random()*220; for(var i=0;i<24;i++){ var a=Math.random()*Math.PI*2,sp=1.2+Math.random()*2.8; PTS.push({x:bx,y:by,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,g:0.05,life:36+Math.random()*22,sz:2,c:kcols[Math.random()*kcols.length|0],tw:0}); } } (function _cloop(){ if(!fx.isConnected) return; requestAnimationFrame(_cloop); fg.clearRect(0,0,fx.width,fx.height); for(var i=0;i<3;i++) _cconf(); if(Math.random()<0.025) _cburst(); for(var i=PTS.length-1;i>=0;i--){ var q=PTS[i]; q.vy+=q.g; q.x+=q.vx+(q.tw?Math.sin((q.y+q.tw*60)*0.05)*0.6:0); q.y+=q.vy; q.life--; if(q.life<=0||q.y>fx.height+8){ PTS.splice(i,1); continue; } fg.globalAlpha=Math.max(0,Math.min(1,q.life/30)); fg.fillStyle=q.c; fg.fillRect(q.x|0,q.y|0,q.sz,q.sz); } fg.globalAlpha=1; })(); } 
      const pad=mk('div','position:relative;z-index:1;padding:22px 10px;display:flex;flex-direction:column;align-items:center;gap:12px;');
      pad.appendChild(mk('div',FS(14,champ?'#ffd84a':'#e05a4a')+'text-align:center;'+(champ?'animation:nsChampPop 0.6s cubic-bezier(0.34,1.56,0.64,1),nsChampGlow 1.6s 0.6s ease-in-out infinite;':''),champ?'CHAMPIONS!':'ELIMINATED')); if(champ){ var tw=mk('div','position:relative;width:132px;height:132px;display:flex;align-items:center;justify-content:center;'); var rays=mk('div','position:absolute;inset:-8px;border-radius:50%;background:repeating-conic-gradient(rgba(255,216,74,0.18) 0deg 12deg, rgba(255,216,74,0) 12deg 36deg);animation:nsChampSpin 10s linear infinite;'); tw.appendChild(rays); var tf=mk('div','position:relative;animation:nsChampFloat 2.8s 0.8s ease-in-out infinite;'); var tim=document.createElement('img'); tim.src='assets/generated/icon-trophy.png'; tim.style.cssText='width:92px;height:92px;image-rendering:pixelated;display:block;animation:nsChampPop 0.7s cubic-bezier(0.34,1.56,0.64,1);'; tf.appendChild(tim); tw.appendChild(tf); pad.appendChild(tw); try{ if(!muted) sfxWhistle(); }catch(e){} }
      const p=PRESETS[tour.playerPreset];
      const c=document.createElement('canvas'); c.width=64; c.height=42; c.style.width='96px'; c.style.height='63px'; c.style.imageRendering='pixelated'; c.style.border='2px solid #3a3050';
      const g=c.getContext('2d'); g.imageSmoothingEnabled=false; paintPattern(g,0,0,64,42,p.kit); pad.appendChild(c);
      pad.appendChild(mk('div',FS(10,'#f4e9c8')+'text-align:center;',p.name.toUpperCase()));
      pad.appendChild(mk('div',FS(7,'#9a8fb0')+'text-align:center;',champ?'YOU WON THE CUP':roundName(Math.max(2,curRound().length*2))+' EXIT')); if(tour.history&&tour.history.length){ var hist=mk('div','width:100%;max-width:280px;background:rgba(20,16,30,0.7);border:2px solid #3a3050;border-radius:8px;padding:8px 9px;margin-top:2px;'); hist.appendChild(mk('div',FS(7,'#9a8fb0')+'text-align:center;margin-bottom:7px;letter-spacing:1px;','YOUR RUN')); tour.history.forEach(function(h){ var row=mk('div','display:flex;align-items:center;gap:7px;margin-bottom:5px;'); row.appendChild(mk('div',FS(6,'#7d719c')+'width:32px;flex:0 0 auto;',h.round)); var fc=document.createElement('canvas'); fc.width=20; fc.height=13; fc.style.cssText='width:22px;height:14px;image-rendering:pixelated;border:1px solid rgba(0,0,0,0.5);flex:0 0 auto;'; try{ var fgg=fc.getContext('2d'); fgg.imageSmoothingEnabled=false; paintPattern(fgg,0,0,20,13,h.opp.kit); }catch(e){} row.appendChild(fc); row.appendChild(mk('div',FS(7,'#e8ddca')+'flex:1;text-align:left;','v '+h.opp.abbr)); row.appendChild(mk('div',FS(8,h.won?'#c6e84a':'#e05a4a')+'flex:0 0 auto;',h.ps+'-'+h.os)); hist.appendChild(row); }); pad.appendChild(hist); }
      const again=mk('button',"margin-top:6px;width:100%;"+FS(10,'#0b1a0e')+"background:#c6e84a;border:2px solid #e6ff7a;padding:10px;cursor:pointer;",'NEW CUP  ▸');
      again.onclick=()=>{ mode='tournament'; buildPre(); }; pad.appendChild(again);
      const menu=mk('button',"width:100%;"+FS(8,'#8a7ea0')+"background:#14101e;border:2px solid #3a3050;padding:8px;cursor:pointer;",'MENU');
      menu.onclick=()=>{ mode='exhibition'; buildPre(); }; pad.appendChild(menu);
      pre.appendChild(pad);
    }
    function teamStepper(side,label,accent){
      const box=mk('div',"background:#14101e;border:2px solid #4a3a5e;padding:5px 2px 5px;display:flex;flex-direction:column;align-items:center;gap:3px;overflow:hidden;");
      box.appendChild(mk('div',"font-family:'Press Start 2P',monospace;font-size:8px;color:"+accent+";",label));
      // arrows + kit swatch
      const row=mk('div','display:flex;align-items:center;gap:2px;');
      const sw=document.createElement('canvas'); sw.width=32; sw.height=24; sw.style.width='34px'; sw.style.height='26px'; sw.style.imageRendering='pixelated'; sw.style.display='block';
      row.appendChild(arrowBtn('◀',()=>{ const L=COUNTRIES.length; sel[side].i=(sel[side].i-1+L)%L; sel[side].rand=false; render(); }));
      const swWrap=mk('div','background:#0e0a16;border:2px solid #2a2438;padding:2px;line-height:0;'); swWrap.appendChild(sw);
      row.appendChild(swWrap);
      row.appendChild(arrowBtn('▶',()=>{ const L=COUNTRIES.length; sel[side].i=(sel[side].i+1)%L; sel[side].rand=false; render(); }));
      box.appendChild(row);
      const nm=mk('div',"font-family:'Press Start 2P',monospace;font-size:8px;color:#f4e9c8;text-align:center;",'');
      box.appendChild(nm); var _diceBtn=mk('button',FS(6,'#c9bce0')+'margin-top:3px;padding:4px 7px;cursor:pointer;border:1px solid #3a3050;border-radius:3px;background:#0e0a16;','🎲 RANDOM'); _diceBtn.onclick=function(e){ if(e&&e.preventDefault)e.preventDefault(); sel[side].rand=!sel[side].rand; render(); }; box.appendChild(_diceBtn);
      function render(){ var p=curPreset(side), g=sw.getContext('2d'); try{ var _tc=sel[side].rand?'#c6e84a':((p&&p.primary)||accent); box.style.borderColor='#4a3a5e'; }catch(e){} g.imageSmoothingEnabled=false; g.clearRect(0,0,32,24); if(sel[side].rand){ g.fillStyle='#1a1330'; g.fillRect(0,0,32,24); g.fillStyle=accent; g.font="13px 'Press Start 2P',monospace"; g.textAlign='center'; g.textBaseline='middle'; g.fillText('?',16,13); nm.textContent='RANDOM'; } else { paintPattern(g,0,0,32,24,p.kit); nm.textContent=p.abbr; } g.strokeStyle='rgba(0,0,0,0.5)'; g.strokeRect(0.5,0.5,31,23); if(typeof paintKs==='function') paintKs(); refreshPitch(); if(_diceBtn){ var _on=sel[side].rand; _diceBtn.style.background=_on?accent:'#0e0a16'; _diceBtn.style.color=_on?'#0b0910':'#c9bce0'; _diceBtn.style.borderColor=_on?accent:'#3a3050'; } }
      var _KS=['flag','jersey','away'];
      var ksRow=mk('div','display:flex;gap:5px;margin-top:4px;justify-content:center;');
      var ksItems=[];
      _KS.forEach(function(stl){ var kb=mk('button','padding:2px;cursor:pointer;border:2px solid #3a3050;border-radius:6px;background:#0e0a16;line-height:0;'); var cvv=document.createElement('canvas'); cvv.width=30; cvv.height=30; cvv.style.cssText='width:26px;height:26px;image-rendering:pixelated;display:block;'; kb.appendChild(cvv); kb.onclick=function(e){ if(e&&e.preventDefault)e.preventDefault(); kitStyle[side]=stl; render(); }; ksItems.push({b:kb,cv:cvv,style:stl}); ksRow.appendChild(kb); });
      function paintKs(){ if(!ksItems) return; var p=curPreset(side); var cur=(kitStyle&&kitStyle[side])?kitStyle[side]:'jersey'; ksItems.forEach(function(it){ var g2=it.cv.getContext('2d'); g2.imageSmoothingEnabled=false; g2.clearRect(0,0,30,30); try{ paintNail(g2,15,15,12,p.kit,false,resolveKit(p.kit,it.style)); }catch(e){} var on=cur===it.style; it.b.style.borderColor=on?accent:'#3a3050'; it.b.style.background=on?'rgba(255,255,255,0.1)':'#0e0a16'; }); }
      box.appendChild(mk('div',"font-family:'Press Start 2P',monospace;font-size:6px;color:#9a8fb0;text-align:center;letter-spacing:1px;margin-top:6px;",'KIT'));box.appendChild(ksRow);
      var fmtRow=mk('div','display:flex;gap:3px;margin-top:4px;justify-content:center;flex-wrap:wrap;'); var fmtBtns=[];
      function styleFmt(){ fmtBtns.forEach(function(x){ var on=formationName[side]===x[1]; x[0].style.background=on?accent:'#0e0a16'; x[0].style.color=on?'#0b0910':'#c9bce0'; x[0].style.borderColor=on?accent:'#3a3050'; }); }
      function buildFmt(){ fmtRow.innerHTML=''; fmtBtns=[]; if(!FORMATIONS[teamSize][formationName[side]]) formationName[side]=defaultFormation(teamSize); Object.keys(FORMATIONS[teamSize]).forEach(function(name){ var fb=mk('button',FS(6,'#c9bce0')+'padding:4px 3px;cursor:pointer;border:1px solid #3a3050;border-radius:3px;background:#0e0a16;',name); fb.onclick=function(e){ if(e&&e.preventDefault)e.preventDefault(); formationName[side]=name; styleFmt(); refreshPitch(); }; fmtBtns.push([fb,name]); fmtRow.appendChild(fb); }); styleFmt(); }
      buildFmt(); box.appendChild(mk('div',"font-family:'Press Start 2P',monospace;font-size:6px;color:#9a8fb0;text-align:center;letter-spacing:1px;margin-top:6px;",'FORMATION'));box.appendChild(fmtRow); if(typeof fmtRefreshers!=='undefined') fmtRefreshers.push(buildFmt);
      render();
      return box;
    }
    function openPre(){ timerRunning=false; try{stopAnthem();}catch(e){} buildPre();  } function leaveHome(){ if(!(phase==='play' && !winner)){ openPre(); return; } var stg=el('ns_stage'); if(!stg){ try{ newMatch(); }catch(e){} openPre(); return; } if(el('ns_leavecfm')) return; var ov=mk('div','position:absolute;inset:0;z-index:12;display:flex;align-items:center;justify-content:center;background:rgba(6,4,10,0.82);padding:16px;box-sizing:border-box;'); ov.id='ns_leavecfm'; var panel=mk('div','width:100%;max-width:260px;background:linear-gradient(#1a1330,#0e0a18);border:2px solid #4a3a5e;border-radius:10px;padding:16px 14px;text-align:center;box-shadow:0 6px 20px rgba(0,0,0,0.6);'); panel.appendChild(mk('div',FS(10,'#f4e9c8')+'letter-spacing:1px;margin-bottom:8px;','LEAVE MATCH?')); panel.appendChild(mk('div','font-size:11px;line-height:1.5;color:#b9add0;margin-bottom:14px;','Score and abilities will be cleared.')); var row=mk('div','display:flex;gap:8px;'); var no=mk('button',SQBTN+'flex:1;font-size:8px;padding:9px;','CANCEL'); var yes=mk('button',FS(8,'#2a0e0e')+'flex:1;background:#e05a4a;border:2px solid #ff8a7a;border-radius:6px;padding:9px;cursor:pointer;','LEAVE'); no.addEventListener('click',function(){ ov.remove(); }); yes.addEventListener('click',function(){ ov.remove(); try{ spClearMatch(); }catch(e){} try{ newMatch(); }catch(e){} openPre(); }); row.appendChild(no); row.appendChild(yes); panel.appendChild(row); ov.appendChild(panel); ov.addEventListener('click',function(e){ if(e.target===ov) ov.remove(); }); stg.appendChild(ov); }

