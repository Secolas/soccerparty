    // ================= INTERACTIVE TUTORIAL =================
    // A scripted, action-gated coach that teaches the core loop by making the
    // player actually do each thing. Unlike showOnboarding (a passive slide
    // carousel) each step here blocks until the player performs the action, so
    // a step repeats until they get it. Two separate scripts:
    //   'exh' — first exhibition: move players, kick off, flick, keep the turn,
    //           score, then a forced 3-card ability drop and how to use it.
    //   'roy' — first Royale stadium: hazards, the boss's abilities, one loss ends it.
    // Hooks live in the input/physics/draw code and funnel through tutHook().
    var TUT=null, _tutFx=0, _tutStartBtnWired=false;

    function tutSeen(kind){ try{ return !!localStorage.getItem('sp_tut_'+kind); }catch(e){ return false; } }
    function tutMarkSeen(kind){ try{ localStorage.setItem('sp_tut_'+kind,'1'); }catch(e){} }
    function tutActive(){ return !!(TUT&&!TUT.over); }
    function tutStepId(){ return (TUT&&TUT.steps&&TUT.steps[TUT.i])?TUT.steps[TUT.i].id:''; }

    // --- the two scripts -------------------------------------------------
    function tutScript(kind){
      if(kind==='roy'){
        return [
          {id:'r_intro', t:'STADIUM ROYALE', b:'Nine stadiums, one run. Win to advance — a single loss ends the whole run.', go:'tap'},
          {id:'r_haz',   t:'THE PITCH FIGHTS BACK', b:'Every stadium has its own hazards, and they hit BOTH sides. Read the conditions before you shoot.', go:'tap'},
          {id:'r_boss',  t:'THE HOME BOSS', b:'Each opponent brings abilities of their own — more of them on higher difficulty. Check their slots up top.', go:'tap'},
          {id:'r_go',    t:'GOOD LUCK', b:'Clear Season 1 to unlock Season 2, and clear a difficulty to unlock the next. Now go win it.', go:'tap'}
        ];
      }
      return [
        {id:'boards', t:'THE TWO BOARDS', b:'YOUR board is the one at the BOTTOM. Your opponent is at the TOP. Each board shows that team’s score and its ability slots.', go:'tap', hl:['ns_bot','ns_top']},
        {id:'flickmeter', t:'YOUR FLICKS LEFT', b:'The boot icon on your board counts the flicks you have left this turn — three per turn.', go:'tap', hl:['ns_flick_red','ns_flicknum_red']},
        {id:'move',  t:'MOVE YOUR PLAYERS', b:'Drag one of YOUR players to a better spot before kickoff.', go:'move', fx:'players'},
        {id:'kick',  t:'KICK OFF',          b:'Line-up ready? Hit PLAY to start the match.', go:'play'},
        {id:'flick', t:'FLICK TO SHOOT',    b:'Drag BACK from the ball and let go — like a slingshot. The longer you pull, the harder it goes.', go:'flick', fx:'ball'},
        {id:'keep',  t:'KEEP YOUR TURN',    b:'Hit one of YOUR OWN players and you keep the turn — up to 3 flicks. Miss, and the turn passes over.', go:'keep', fx:'ball'},
        {id:'score', t:'NOW SCORE',         b:'Put it in the far goal. First to 3 goals wins the match.', go:'goal', fx:'goal'},
        {id:'ab',    t:'YOU EARNED AN ABILITY', b:'A drop of three — you keep ONE. Take SNIPER (badged PICK THIS): it draws a long aim line, so lining up a shot is far easier.', go:'abpick', rec:'sniper'},
        {id:'abuse', t:'USE YOUR ABILITY',  b:'It now sits in a slot on YOUR board. Tap that slot to read it, or to switch it on and off.', go:'tap', hl:['ns_slot_red_0']},
        {id:'win',   t:'FINISH THE JOB',    b:'That is everything. Score 3 goals to take the win — good luck!', go:'tap'}
      ];
    }

    function tutStart(kind){
      if(tutSeen(kind)) return;
      TUT={kind:kind, i:0, over:false, steps:tutScript(kind), nudged:false};
      if(kind==='exh'){ try{ winTarget=3; }catch(e){} }   // tutorial match is always first-to-3
      try{ _tutWireStart(); }catch(e){}
      tutRender();
    }

    function tutStop(){ if(!TUT) return; var k=TUT.kind; TUT.over=true; tutMarkSeen(k); TUT=null; try{ tutHighlight(null); }catch(e){} var p=el('ns_tutpanel'); if(p&&p.parentNode) p.parentNode.removeChild(p); }

    function tutAdvance(){
      if(!tutActive()) return;
      TUT.i++; TUT.nudged=false;
      if(TUT.i>=TUT.steps.length){ tutStop(); return; }
      tutRender();
    }

    // Fired from the game. An event only advances the step that waits on it,
    // so any other action simply leaves the step up — it repeats until done.
    function tutHook(ev,arg){
      if(!tutActive()) return;
      var st=TUT.steps[TUT.i]; if(!st) return;
      if(ev==='lose' && st.go==='keep'){ tutNudge('Missed — normally that hands the turn over. Kept it for you: flick again and clip one of YOUR players.'); return; }
      if(ev==='goal' && arg && arg!=='red') return;           // only the player's goals count
      if(ev==='abopen' && st.go!=='abpick') return;
      if(ev===st.go) tutAdvance();
    }

    // Does the pending step want the forced 3-card drop? draftAbility asks this.
    function tutForceOpts(){
      if(!tutActive()) return null;
      if(TUT.steps[TUT.i].go!=='abpick') return null;
      try{
        var ids=['cannon','sniper','bigkeeper'], out=[];
        for(var i=0;i<ids.length;i++){ var c=TACTIC_MAP[ids[i]]; if(c && (sideAb.red||[]).indexOf(c.id)<0) out.push(c); }
        return out.length?out:null;
      }catch(e){ return null; }
    }

    // The tutorial match always kicks off with the player (Brazil).
    function tutForceToss(){ try{ if(mode==='exhibition' && !tutSeen('exh')) return 'red'; }catch(e){} return null; }
    // Which card the ability drop should badge as the guided pick.
    function tutRecommendAb(){ if(!tutActive()) return null; var st=TUT.steps[TUT.i]; return (st&&st.rec)?st.rec:null; }
    // On the KEEP step the turn may not pass — the player retries until they
    // clip their own player, so the lesson cannot be skipped by missing.
    function tutBlockTurnLoss(){ if(!tutActive()) return false; var st=TUT.steps[TUT.i]; return !!(st&&st.go==='keep'); }
    function tutNudge(msg){
      if(!tutActive()) return;
      TUT.nudged=true;
      var sub=el('ns_tutsub'); if(sub){ sub.textContent=msg; sub.style.display='block'; }
      try{ if(typeof haptic==='function') haptic(18); }catch(e){}
    }

    // --- the coach panel (non-blocking: the player has to act) -----------
    function tutRender(){
      if(!tutActive()) return;
      var st=TUT.steps[TUT.i], stage=el('ns_stage'); if(!stage) return;
      var p=el('ns_tutpanel');
      if(!p){
        p=mk('div','position:absolute;left:8px;right:8px;bottom:8px;z-index:45;box-sizing:border-box;padding:10px 12px;border-radius:10px;background:rgba(10,8,18,0.94);border:2px solid #a9c94b;box-shadow:0 4px 16px rgba(0,0,0,0.55);');
        p.id='ns_tutpanel';
        var head=mk('div','display:flex;align-items:center;gap:8px;margin-bottom:5px;');
        head.appendChild(mk('div',FS(6,'#8a7ea0')+'flex:0 0 auto;letter-spacing:1px;','')); head.firstChild.id='ns_tutstep';
        head.appendChild(mk('div',FS(8,'#a9c94b')+'flex:1;letter-spacing:1px;line-height:1.5;','')); head.childNodes[1].id='ns_tuttitle';
        var skip=mk('div',FS(6,'#8a7ea0')+'flex:0 0 auto;padding:4px 8px;border-radius:6px;background:rgba(0,0,0,0.35);cursor:pointer;','SKIP');
        skip.onclick=function(){ tutStop(); };
        head.appendChild(skip);
        p.appendChild(head);
        p.appendChild(mk('div','font-size:11px;line-height:1.6;color:#f4e9c8;font-family:-apple-system,BlinkMacSystemFont,sans-serif;','')); p.childNodes[1].id='ns_tutbody';
        p.appendChild(mk('div','font-size:10px;line-height:1.6;color:#ffd84a;margin-top:5px;display:none;font-family:-apple-system,BlinkMacSystemFont,sans-serif;','')); p.childNodes[2].id='ns_tutsub';
        var go=mk('button',FS(8,'#0a0812')+'margin-top:8px;width:100%;background:#a9c94b;border:none;border-radius:7px;padding:9px;cursor:pointer;letter-spacing:1px;','GOT IT');
        go.id='ns_tutgo'; go.onclick=function(){ tutHook('tap'); };
        p.appendChild(go);
        stage.appendChild(p);
      }
      var _n=el('ns_tutstep'), _t=el('ns_tuttitle'), _b=el('ns_tutbody'), _s=el('ns_tutsub'), _g=el('ns_tutgo');
      if(_n) _n.textContent=(TUT.i+1)+'/'+TUT.steps.length;
      if(_t) _t.textContent=st.t;
      if(_b) _b.textContent=st.b;
      if(_s){ _s.style.display='none'; _s.textContent=''; }
      if(_g) _g.style.display=(st.go==='tap')?'block':'none';
      tutHighlight(st.hl);
      tutPlace();
    }

    // Ring the DOM element a step is talking about, and clear the previous one.
    var _tutHl=[];
    function tutHighlight(ids){
      for(var i=0;i<_tutHl.length;i++){ var o=_tutHl[i]; try{ o.el.style.outline=o.ol; o.el.style.outlineOffset=o.oo; o.el.style.borderRadius=o.br; }catch(e){} }
      _tutHl=[];
      if(!ids||!ids.length) return;
      for(var k=0;k<ids.length;k++){
        var e2=el(ids[k]); if(!e2) continue;
        _tutHl.push({el:e2, ol:e2.style.outline, oo:e2.style.outlineOffset, br:e2.style.borderRadius});
        e2.style.outline='2px solid #ffd84a'; e2.style.outlineOffset='2px'; e2.style.borderRadius='6px';
      }
    }

    // Keep the coach panel clear of the ball: it sits at the bottom, but hops to
    // the top while the ball is in the lower half, and hides entirely while the
    // ability picker (a full-screen overlay) is open.
    function tutPlace(){
      var p=el('ns_tutpanel'); if(!p) return;
      var drafting=!!el('ns_abdraft');
      p.style.display=drafting?'none':'block';
      if(drafting) return;
      var low=false;
      try{ low=(typeof coin!=='undefined'&&coin&&typeof phase!=='undefined'&&phase!=='setup'&&coin.y>H*0.55); }catch(e){}
      if(low){ p.style.bottom='auto'; p.style.top='8px'; }
      else { p.style.top='auto'; p.style.bottom='8px'; }
    }

    function _tutWireStart(){
      if(_tutStartBtnWired) return;
      var b=el('ns_start'); if(!b) return;
      _tutStartBtnWired=true;
      b.addEventListener('click',function(){ try{ tutHook('play'); }catch(e){} });
    }

    // --- canvas hint animation (game coords, drawn at the end of draw()) --
    function drawTutFx(now){
      if(!tutActive()) return;
      try{ tutPlace(); }catch(e){}
      var st=TUT.steps[TUT.i]; if(!st||!st.fx) return;
      _tutFx++;
      var t=(_tutFx%90)/90, pulse=0.5+0.5*Math.sin(_tutFx*0.09);
      ctx.save();
      ctx.translate(OX,OY);   // draw() has already restored the pitch transform by here
      if(st.fx==='players'){
        // ring the player's outfield nails so it's obvious what to drag
        var shown=0;
        for(var i=0;i<nails.length&&shown<3;i++){
          var n=nails[i]; if(!n||n.goalie||n.team!=='red') continue; shown++;
          ctx.strokeStyle='rgba(198,232,74,'+(0.35+pulse*0.5).toFixed(2)+')';
          ctx.lineWidth=1.6; ctx.beginPath(); ctx.arc(n.x,n.y,NAIL_R+3+pulse*2.5,0,6.283); ctx.stroke();
        }
      } else if(st.fx==='ball'||st.fx==='goal'){
        if(typeof coin==='undefined'||!coin) { ctx.restore(); return; }
        ctx.strokeStyle='rgba(255,216,74,'+(0.4+pulse*0.5).toFixed(2)+')';
        ctx.lineWidth=1.6; ctx.beginPath(); ctx.arc(coin.x,coin.y,COIN_R+3+pulse*3,0,6.283); ctx.stroke();
        if(st.fx==='ball'&&!moving){
          // looping "pull back" arrow: away from the goal the player attacks
          var dir=(typeof current!=='undefined'&&current==='blue')?-1:1;
          var len=15+t*13, bx=coin.x, by=coin.y+dir*(COIN_R+3), ey=by+dir*len;
          ctx.globalAlpha=0.85*(1-t*0.6);
          ctx.strokeStyle='rgba(255,246,214,0.95)'; ctx.lineWidth=2; ctx.lineCap='round';
          ctx.setLineDash([3,3]); ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(bx,ey); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle='rgba(255,246,214,0.95)'; ctx.beginPath();
          ctx.moveTo(bx,ey+dir*4); ctx.lineTo(bx-3.4,ey-dir*2); ctx.lineTo(bx+3.4,ey-dir*2); ctx.closePath(); ctx.fill();
          ctx.globalAlpha=1;
        }
        if(st.fx==='goal'){
          // flash the goal mouth being attacked
          var gy=(typeof current!=='undefined'&&current==='blue')?(H-NET_DEPTH):NET_DEPTH;
          ctx.globalAlpha=0.25+pulse*0.4; ctx.strokeStyle='#ffd84a'; ctx.lineWidth=2.5;
          ctx.beginPath(); ctx.moveTo(W/2-GOAL_W/2,gy); ctx.lineTo(W/2+GOAL_W/2,gy); ctx.stroke(); ctx.globalAlpha=1;
        }
      }
      ctx.restore();
    }

    // --- scripted setup screen -------------------------------------------
    // Until the tutorial is done the exhibition tab offers no choices: the
    // match is fixed at Brazil (you, first flick) vs Argentina, 5-a-side,
    // first-to-3, easy CPU, so every step of the script is reproducible.
    function tutForceExhConfig(){
      try{
        var ci=function(nm){ for(var i=0;i<COUNTRIES.length;i++){ if(COUNTRIES[i]&&COUNTRIES[i].name===nm) return i; } return -1; };
        var br=ci('Brazil'), ar=ci('Argentina');
        if(br>=0) sel.red={i:br,rand:false};
        if(ar>=0) sel.blue={i:ar,rand:false};
        teamSize=5; formationName={red:defaultFormation(5),blue:defaultFormation(5)};
        exhWin=3; cpuSel='cpu'; exhLevel='easy';
      }catch(e){}
    }

    function buildTutorialSetup(host){
      tutForceExhConfig();
      host.appendChild(mk('div',FS(9,'#a9c94b')+'text-align:center;margin:6px 0 4px;letter-spacing:1px;','TUTORIAL'));
      host.appendChild(mk('div',FS(7,'#9a8fb0')+'text-align:center;line-height:1.9;margin-bottom:8px;','Learn the flick in one short match. Everything is set up for you.'));
      // the fixed match-up
      var vs=mk('div','display:flex;align-items:center;justify-content:center;gap:10px;margin:2px 0 10px;');
      try{
        var _rp=COUNTRIES[sel.red.i], _bp=COUNTRIES[sel.blue.i];
        var side=function(p,lab,col){ var w=mk('div','display:flex;flex-direction:column;align-items:center;gap:3px;');
          try{ w.appendChild(royFlag(p,26,18)); }catch(e){}
          w.appendChild(mk('div',FS(6,col),(p&&p.abbr)||'?'));
          w.appendChild(mk('div',FS(5,'#8a7ea0'),lab)); return w; };
        vs.appendChild(side(_rp,'YOU','#a9c94b'));
        vs.appendChild(mk('div',FS(9,'#ffd84a'),'VS'));
        vs.appendChild(side(_bp,'CPU','#e89a8a'));
      }catch(e){}
      host.appendChild(vs);
      // read-only summary of the locked settings
      var box=mk('div','display:flex;flex-direction:column;gap:4px;margin-bottom:9px;');
      [['SQUAD','5 A-SIDE'],['GOALS TO WIN','3'],['OPPONENT','CPU · EASY'],['FIRST FLICK','YOU (BRAZIL)']].forEach(function(r){
        var row=mk('div','display:flex;align-items:center;padding:6px 9px;border-radius:7px;background:#14101e;border:1px solid #2a2438;');
        row.appendChild(mk('div',FS(6,'#8a7ea0')+'flex:1;text-align:left;',r[0]));
        row.appendChild(mk('div',FS(6,'#f4e9c8')+'flex:0 0 auto;',r[1]));
        box.appendChild(row);
      });
      host.appendChild(box);
      var play=mk('button','margin-top:2px;width:100%;'+FS(11,'#0b1a0e')+'background:#a9c94b;border:2px solid #e6ff7a;padding:11px;cursor:pointer;','START TUTORIAL  ▸');
      play.onclick=function(){
        tutForceExhConfig();
        teamKits.red=resolveSel('red'); teamKits.blue=resolveSel('blue',teamKits.red);
        buildBoard(); buildCrowd();
        mode='exhibition'; winTarget=3; matchLen=0; aiLevel='easy';
        aiEnabled={red:false,blue:true};        // newMatch() sets current='red', so Brazil flicks first
        pre.style.display='none'; newMatch();
        try{ showVsIntro(); }catch(e){}
        try{ setTimeout(function(){ tutStart('exh'); },2300); }catch(e){}
      };
      host.appendChild(play);
      // never trap a player who does not want it
      var skip=mk('div',FS(6,'#8a7ea0')+'text-align:center;margin-top:9px;padding:7px;cursor:pointer;letter-spacing:1px;','SKIP TUTORIAL');
      skip.onclick=function(){ tutMarkSeen('exh'); host.innerHTML=''; buildExhibition(host); };
      host.appendChild(skip);
    }
