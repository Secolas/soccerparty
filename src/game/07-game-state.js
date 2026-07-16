    // ================= GAME STATE =================
    let coin,nails,current,score,aiming,aimStart,aimNow,moving,winner,hitOwn;
    let scoring=false,scoringTeam=null,netBulge=0,netBulgeX=0,netHold=0,netVel=0,scoreFrames=0,parkedTeam=null,celebrated=false;
    let phase='setup',dragNail=null; let steerHold=null,steerBudget=0,slowPhase=0; let wallHP={red:null,blue:null},WALL_MAX=3,wallCD=0,ghostUsed=false,ghosting=false,portalUsed=false,PORTAL_R=COIN_R,trapUsed={red:false,blue:false},trapPos={red:null,blue:null},TRAP_R=COIN_R,trapFx=null,TRAP_FX_DUR=42,shieldUsed={red:false,blue:false},shieldFx=null,SHIELD_FX_DUR=34,ricochetUsed=false,serpentPhase=0,SERPENT_TURN=0.16,SERPENT_FREQ=1.2,DRUNK_SPREAD=0.5,swapStolen={red:null,blue:null},swapSpent={red:{},blue:{}},flickCount=0,bumpPending=false,FLICK_CAP=3; let bikeUsed=false,strategistUsed={red:false,blue:false},strategistArm=null,pmDrag=false,medicUsed={red:false,blue:false},cleansed={red:[],blue:[]},comebackDone={red:false,blue:false},varUsed={red:false,blue:false},_trioN=0,_trioDone=false,rewindUsed={red:false,blue:false},_rwSnap=null,_boomFwd=false,_boomUsed=false,clearUsed={red:false,blue:false},_clrSt={red:null,blue:null},chipUsed=false,_clrBlocked=false;
    const GOAL_AREA_D=34;
    let useBall=false;
    // AI + modes
    let aiEnabled={red:false,blue:false}, aiLevel='med';
    const AI_NOISE={easy:0.62,med:0.30,hard:0.14}, AI_ACC={easy:0.55,med:0.80,hard:0.96};
    // Shared flick tuning: full-power ball speed for BOTH player and CPU. Cannon x2, Freeze x0.5 derive from it.
    const FLICK_MAX=10, FLICK_POWER=70;
    let aiPending=false, aiDelay=0;
    let mode='exhibition', winTarget=5, tour=null, cpuSel='cpu', exhLevel='med';
    let exhWin=5, exhTimer=0; let pracCpu='off', practiceAb={red:[],blue:[]}, pendingAb=null; let pen=null, penBest=5, pracType='normal'; var _lkOn=true,_lkActive=false,_lkStarted=false,_lkFlicks=0,_lkLeader=null,_lkTeam=null,_lkToPen=false,_lkFromTour=false,_lkTourSave=null; var _ecoOn=false;   // exhibition: goals to win, match length (s; 0=untimed)
    // squad presets
    let teamSize=5, formationName={red:'1-2-1', blue:'1-2-1'}, kitStyle={red:'flag', blue:'flag'};
    const FORMATIONS={
      5:{ '1-2-1':[{d:0.20,xs:[0.5]},{d:0.34,xs:[0.28,0.72]},{d:0.46,xs:[0.5]}], '2-2':[{d:0.22,xs:[0.32,0.68]},{d:0.44,xs:[0.38,0.62]}], '1-3':[{d:0.20,xs:[0.5]},{d:0.44,xs:[0.24,0.5,0.76]}] },
      7:{ '2-3-1':[{d:0.16,xs:[0.28,0.72]},{d:0.30,xs:[0.22,0.5,0.78]},{d:0.46,xs:[0.5]}], '3-2-1':[{d:0.16,xs:[0.24,0.5,0.76]},{d:0.32,xs:[0.32,0.68]},{d:0.46,xs:[0.5]}], '3-3':[{d:0.20,xs:[0.24,0.5,0.76]},{d:0.44,xs:[0.28,0.5,0.72]}] }
    };
    const defaultFormation=size=>Object.keys(FORMATIONS[size])[0];
    // extra FX
    let shotTrail=[], hitSparks=[], turnFlash=0, frameTick=0;

    // timer
    let matchMs=0,timerRunning=false,lastT=performance.now();
    let matchLen=0, timeUp=false;   // matchLen seconds (0 = untimed count-up)

