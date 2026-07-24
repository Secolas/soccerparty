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
        {id:'move',  t:'MOVE YOUR PLAYERS', b:'Drag one of YOUR players to a better spot before kickoff.', go:'move', fx:'players'},
        {id:'kick',  t:'KICK OFF',          b:'Line-up ready? Hit PLAY to start the match.', go:'play'},
        {id:'flick', t:'FLICK TO SHOOT',    b:'Drag BACK from the ball and let go — like a slingshot. The longer you pull, the harder it goes.', go:'flick', fx:'ball'},
        {id:'keep',  t:'KEEP YOUR TURN',    b:'Hit one of YOUR OWN players and you keep the turn — up to 3 flicks. Miss, and the turn passes over.', go:'keep', fx:'ball'},
        {id:'score', t:'NOW SCORE',         b:'Put it in the far goal. First to 3 goals wins the match.', go:'goal', fx:'goal'},
        {id:'ab',    t:'YOU EARNED AN ABILITY', b:'Score and you get a drop of three — you keep ONE. Pick the one you want.', go:'abpick'},
        {id:'abuse', t:'USE YOUR ABILITY',  b:'It sits in a slot on your scoreboard. Tap the slot to read it, or to switch it on and off.', go:'tap'},
        {id:'win',   t:'FINISH THE JOB',    b:'That is everything. Score 3 goals to take the win — good luck!', go:'tap'}
      ];
    }

    function tutStart(kind){
      if(tutSeen(kind)) return;
      TUT={kind:kind, i:0, over:false, steps:tutScript(kind), nudged:false};
      if(kind==='exh'){ try{ winTarget=3; }catch(e){} }   // tutorial match is always first-to-3
      _tutWireStart();
      tutRender();
    }

    function tutStop(){ if(!TUT) return; var k=TUT.kind; TUT.over=true; tutMarkSeen(k); TUT=null; var p=el('ns_tutpanel'); if(p&&p.parentNode) p.parentNode.removeChild(p); }

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
      if(ev==='lose' && st.go==='keep'){ tutNudge('Turn lost — that is the cost of missing. Try again: clip one of YOUR players.'); return; }
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
      var st=TUT.steps[TUT.i]; if(!st||!st.fx) return;
      _tutFx++;
      var t=(_tutFx%90)/90, pulse=0.5+0.5*Math.sin(_tutFx*0.09);
      ctx.save();
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
