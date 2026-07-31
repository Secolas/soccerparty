    // ================= PHYSICS =================
    const FRICTION=0.984,STOP_V=0.09,RESTITUTION=0.75,NET_FRICTION=0.86,NET_STOP=0.25,MAX_STEP=3,NET_PULL=0.5;
    // Royale arena floor: friction delta added to the ball's per-frame slow-down.
    // ice = higher f (slippery, ball skates); (future) sand = lower f (ball dies fast).
    function royFloorFric(){ if(typeof royaleArena==='undefined'||!royaleArena) return 0; return (royaleArena.floor==='ice')?0.011:(_g1('slippery')?0.004:0); }
    // Greasy walls/players: ice arena on a medium/hard run makes every bounce slip a random amount.
    function royGreasy(){ return false; }
    // Ice puddles: greasy patches on the rink (medium/hard). Roll over one and the ball skids off a random amount.
    function rollPuddles(){ if((typeof royaleArena!=='undefined'&&royaleArena&&royaleArena.floor==='ice'&&typeof royaleLevel!=='undefined'&&(royaleLevel==='med'||royaleLevel==='hard'))||_g1('puddle')){ if(!royPuddles.length && !moving){ for(var _pp=0;_pp<3;_pp++){ var px,py,ok,tries=0;
    do{ ok=true; px=WALL+20+Math.random()*(W-2*WALL-40);
    py=NET_DEPTH+GOAL_AREA_D+16+Math.random()*(H-2*(NET_DEPTH+GOAL_AREA_D)-32);
    for(var _pq=0;_pq<royPuddles.length;_pq++){ if(Math.hypot(px-royPuddles[_pq].x,py-royPuddles[_pq].y)<PUDDLE_R*3){ ok=false;
    break; } } if(coin&&Math.hypot(px-coin.x,py-coin.y)<PUDDLE_R+COIN_R+14) ok=false;
    tries++; }while(!ok&&tries<50);
    royPuddles.push({x:px,y:py});
    } } } else if(royPuddles.length){ royPuddles=[];
    _puddleIn=-1; } }
    function royHitFx(freq,dur,type,vol,hap){ try{ if(typeof muted==='undefined'||!muted){ if(typeof tone==='function') tone(freq,dur||0.06,type||'square',vol||0.05);
    } }catch(e){} try{ if(hap && typeof haptic==='function') haptic(hap);
    }catch(e){} } var _mudWasIn=false,_orbitWasIn=false;
    function royPuddleStep(){ if(!royPuddles.length||!moving||scoring) return;
    var _in=-1; for(var _pp=0;_pp<royPuddles.length;_pp++){ if(Math.hypot(coin.x-royPuddles[_pp].x,coin.y-royPuddles[_pp].y)<PUDDLE_R+COIN_R){ _in=_pp;
    break; } } if(_in>=0){ var _sp=Math.hypot(coin.vx,coin.vy);
    if(_sp>0.5){ try{ splashPuddle(coin.x,coin.y,_sp>4.5?3:2,_sp>4.5);
    }catch(e){} } if(_in!==_puddleIn){ royHitFx(300,0.08,'sine',0.05,10);
    if(_sp>0.5){ var _sl=(Math.random()-0.5)*1.7,_c=Math.cos(_sl),_s=Math.sin(_sl),_nx=coin.vx*_c-coin.vy*_s,_ny=coin.vx*_s+coin.vy*_c;
    coin.vx=_nx; coin.vy=_ny;
    try{ spawnSparks(royPuddles[_in].x,royPuddles[_in].y,null,5);
    }catch(e){} } } } _puddleIn=_in;
    }
    function drawPuddles(now){ if(!royPuddles.length) return;
    for(var _pp=0;_pp<royPuddles.length;_pp++){ var p=royPuddles[_pp];
    ctx.save(); ctx.globalAlpha=0.42;
    ctx.fillStyle='#8fd0ff';
    ctx.beginPath(); ctx.ellipse(p.x,p.y,PUDDLE_R,PUDDLE_R*0.68,0,0,Math.PI*2);
    ctx.fill(); ctx.globalAlpha=0.7;
    ctx.strokeStyle='#dff2ff';
    ctx.lineWidth=1; ctx.stroke();
    ctx.restore(); } }
    // Bushes (savanna): shrubs scattered on the pitch. A ball rolling through one is grabbed
    // by the branches - it slows hard and kicks out on an unpredictable line, like a real ball
    // deflecting through a bush.
    function royBushArena(){ return (typeof royaleArena!=='undefined'&&royaleArena&&royaleArena.hazard==='bush')||_g1('bush'); }
    function rollBushes(){ if(royBushArena()){ if(!royBushes.length && !moving){ for(var _bb=0;_bb<4;_bb++){ var bx,by,ok,tries=0,br=BUSH_R+Math.random()*6;
    do{ ok=true; bx=WALL+22+Math.random()*(W-2*WALL-44);
    by=NET_DEPTH+GOAL_AREA_D+20+Math.random()*(H-2*(NET_DEPTH+GOAL_AREA_D)-40);
    for(var _bq=0;_bq<royBushes.length;_bq++){ if(Math.hypot(bx-royBushes[_bq].x,by-royBushes[_bq].y)<(br+royBushes[_bq].r)*1.6){ ok=false;
    break; } } if(coin&&Math.hypot(bx-coin.x,by-coin.y)<br+COIN_R+18) ok=false;
    if(ok&&typeof nails!=='undefined'&&nails){ for(var _bn2=0;_bn2<nails.length;_bn2++){ if(Math.hypot(bx-nails[_bn2].x,by-nails[_bn2].y)<br+NAIL_R+14){ ok=false;
    break; } } } if(Math.abs(bx-W/2)<GOAL_W*0.5 && (by<NET_DEPTH+GOAL_AREA_D+30||by>H-NET_DEPTH-GOAL_AREA_D-30)) ok=false;
    tries++; }while(!ok&&tries<60);
    royBushes.push({x:bx,y:by,r:br,rust:0});
    } } } else if(royBushes.length){ royBushes=[];
    _bushIn=-1; } }
    function royBushStep(){ if(!royBushes.length||!moving||scoring) return;
    if((typeof ghosting!=='undefined'&&ghosting)||(typeof TAC!=='undefined'&&TAC&&TAC.ghost&&typeof ghostUsed!=='undefined'&&!ghostUsed)){ _bushIn=-1;
    return; } var _in=-1; for(var _b=0;_b<royBushes.length;_b++){ if(Math.hypot(coin.x-royBushes[_b].x,coin.y-royBushes[_b].y)<royBushes[_b].r+COIN_R){ _in=_b;
    break; } } if(_in>=0){ var _spd=Math.hypot(coin.vx,coin.vy);
    var _drag=_spd>10?0.965:(_spd>5?0.94:0.90);
    coin.vx*=_drag; coin.vy*=_drag;
    royBushes[_in].rust=Math.max(royBushes[_in].rust, Math.min(1.6, 0.35+_spd*0.14));
    if(_in!==_bushIn){ royHitFx(175,0.08,'sawtooth',0.045,10);
    if(_spd>0.4){ var _dmax=_spd>10?0.5:(_spd>5?1.1:1.7), _a=(Math.random()-0.5)*_dmax,_c=Math.cos(_a),_s=Math.sin(_a),_nx=coin.vx*_c-coin.vy*_s,_ny=coin.vx*_s+coin.vy*_c;
    coin.vx=_nx; coin.vy=_ny;
    } try{ spawnSparks(royBushes[_in].x,royBushes[_in].y,'#7ab648',7);
    }catch(e){} } } _bushIn=_in;
    }
    function drawBushes(now){ if(!royBushes.length) return;
    ctx.save(); var _bf=(typeof NS_BUSH!=='undefined'&&NS_BUSH.length);
    for(var _b=0;_b<royBushes.length;_b++){ var p=royBushes[_b], r=p.r;
    if(p.rust>0){ p.rust-=0.045;
    if(p.rust<0)p.rust=0; } var _rustling=p.rust>0.02;
    var _ballIn=(typeof coin!=='undefined'&&coin)?(Math.hypot(coin.x-p.x,coin.y-p.y)<p.r+COIN_R):false;
    ctx.globalAlpha=0.20; ctx.fillStyle='#000';
    ctx.beginPath(); ctx.ellipse(p.x,p.y+r*0.5,r*0.85,r*0.32,0,0,6.283);
    ctx.fill(); ctx.globalAlpha=1;
    var _jit=_rustling?Math.sin(now*0.06+_b*2)*3.6*Math.min(1.5,p.rust):0;
    var _im=_bf?NS_BUSH[(p.rust>0.5)?(Math.floor(now/60)%NS_BUSH.length):1]:null;
    ctx.globalAlpha=_ballIn?0.68:1;
    if(_im&&_im.complete&&_im.naturalWidth){ var _sz=r*1.9;
    ctx.drawImage(_im, Math.round(p.x-_sz/2+_jit), Math.round(p.y-_sz*0.58), _sz, _sz);
    } else { var lobes=[[0,0,
    r],[-r*0.55,r*0.12,r*0.6],
    [r*0.55,r*0.06,r*0.6],[0,
    -r*0.5,r*0.55]]; ctx.fillStyle='#345c24';
    for(var i=0;i<lobes.length;i++){ ctx.beginPath();
    ctx.arc(p.x+lobes[i][0]+_jit,p.y+lobes[i][1],lobes[i][2],0,6.283);
    ctx.fill(); } ctx.fillStyle='#528a3a';
    for(var i2=0;i2<lobes.length;i2++){ ctx.beginPath();
    ctx.arc(p.x+lobes[i2][0]-1+_jit,p.y+lobes[i2][1]-1.5,lobes[i2][2]*0.62,0,6.283);
    ctx.fill(); } } } ctx.restore();
    }
    // Mud lake (savanna, medium+): sticky bog pools. A ball rolling in bogs down under
    // heavy viscous drag - predictable, no random skid (NOT a puddle) - so a soft pass can
    // stall out in it while a hard/cannon shot plows through. Ghost phases through.
    function royMudArena(){ return (typeof royaleArena!=='undefined'&&royaleArena&&royaleArena.hazard==='bush'&&typeof royaleLevel!=='undefined'&&(royaleLevel==='med'||royaleLevel==='hard'))||_g1('mud');
    }
    function rollMud(){ if(royMudArena()){ if(!royMud.length && !moving){ for(var _mm=0;_mm<2;_mm++){ var mx,my,ok,tries=0,rx=MUD_R+Math.random()*6,ry=MUD_R*0.7+Math.random()*4;
    do{ ok=true; mx=WALL+rx+8+Math.random()*(W-2*WALL-2*rx-16);
    my=NET_DEPTH+GOAL_AREA_D+ry+16+Math.random()*(H-2*(NET_DEPTH+GOAL_AREA_D)-2*ry-32);
    for(var _mq=0;_mq<royMud.length;_mq++){ if(Math.hypot(mx-royMud[_mq].x,my-royMud[_mq].y)<(rx+royMud[_mq].rx)*1.8){ ok=false;
    break; } } if(coin&&Math.hypot(mx-coin.x,my-coin.y)<rx+COIN_R+22) ok=false;
    if(ok&&royBushes&&royBushes.length){ for(var _mb=0;_mb<royBushes.length;_mb++){ if(Math.hypot(mx-royBushes[_mb].x,my-royBushes[_mb].y)<(rx+royBushes[_mb].r)*1.5){ ok=false;
    break; } } } if(ok&&typeof nails!=='undefined'&&nails){ for(var _mn=0;_mn<nails.length;_mn++){ if(Math.hypot(mx-nails[_mn].x,my-nails[_mn].y)<rx+NAIL_R+12){ ok=false;
    break; } } } tries++; }while(!ok&&tries<60);
    royMud.push({x:mx,y:my,rx:rx,ry:ry});
    } } } else if(royMud.length){ royMud=[];
    } }
    function _mudIn(bx,by,p){ var dx=(bx-p.x)/(p.rx+COIN_R*0.6), dy=(by-p.y)/(p.ry+COIN_R*0.6); return dx*dx+dy*dy<1; }
    function royMudStep(){ if(!royMud.length||!moving||scoring){ _mudWasIn=false;
    return; } if((typeof ghosting!=='undefined'&&ghosting)||(typeof TAC!=='undefined'&&TAC&&TAC.ghost&&typeof ghostUsed!=='undefined'&&!ghostUsed)){ _mudWasIn=false;
    return; } var _nowIn=false;
    for(var _m=0;_m<royMud.length;_m++){ if(_mudIn(coin.x,coin.y,royMud[_m])){ _nowIn=true;
    var _spd=Math.hypot(coin.vx,coin.vy);
    var _drag=_spd>11?0.96:(_spd>6?0.93:0.85);
    coin.vx*=_drag; coin.vy*=_drag;
    break; } } if(_nowIn && !_mudWasIn){ royHitFx(105,0.13,'sine',0.06,[0,
    18,26,18]); try{ spawnSparks(coin.x,coin.y,'#6b4a2a',5);
    }catch(e){} } _mudWasIn=_nowIn;
    }
    function drawMud(now){ if(!royMud.length) return;
    var _im=(typeof NS_MUD!=='undefined')?NS_MUD:null;
    for(var _m=0;_m<royMud.length;_m++){ var p=royMud[_m];
    ctx.save(); ctx.globalAlpha=0.20;
    ctx.fillStyle='#000'; ctx.beginPath();
    ctx.ellipse(p.x,p.y+2,p.rx,p.ry,0,0,6.283);
    ctx.fill(); ctx.globalAlpha=1;
    var _pu=1+Math.sin(now*0.0016+_m*2.1)*0.03;
    if(_im&&_im.complete&&_im.naturalWidth){ var _w=p.rx*2.1*_pu, _h=p.ry*2.1*_pu;
    ctx.drawImage(_im, Math.round(p.x-_w/2), Math.round(p.y-_h/2), _w, _h);
    } else { ctx.fillStyle='#5a3a1e';
    ctx.beginPath(); ctx.ellipse(p.x,p.y,p.rx,p.ry,0,0,6.283);
    ctx.fill(); } ctx.beginPath();
    ctx.ellipse(p.x,p.y,p.rx*0.9,p.ry*0.9,0,0,6.283);
    ctx.clip(); for(var _bk=0;_bk<3;_bk++){ var _bt=((now*0.0006)+_bk*0.37+_m*0.2)%1, _bx=p.x+Math.sin(_bk*2.3+_m)*p.rx*0.42, _by=p.y+p.ry*0.5-_bt*p.ry*1.15, _ba=Math.sin(_bt*Math.PI);
    ctx.globalAlpha=0.32*_ba;
    ctx.fillStyle='#caa070';
    ctx.beginPath(); ctx.arc(_bx,_by,1+_ba*1.2,0,6.283);
    ctx.fill(); } ctx.restore();
    } }
    // SANDSTORM desert ladder (hazard:'sand'). EASY: cacti dotted about that the ball bounces off
    // and loses speed on (prickly, not springy). MEDIUM: sand geysers that erupt on a timer and
    // launch a ball caught over them. HARD: a roaming dust-devil that whirls a nearby ball and
    // flings it out sideways. All ignore player tokens; ghost phases through.
    function roySandArena(){ return (typeof royaleArena!=='undefined'&&royaleArena&&royaleArena.hazard==='sand')||_g1('cacti'); }
    function _sandBlocked(x,y,rr){ var i;
    for(i=0;i<royCacti.length;i++){ if(Math.hypot(x-royCacti[i].x,y-royCacti[i].y)<rr+royCacti[i].r+9) return true;
    } for(i=0;i<royGeysers.length;i++){ if(Math.hypot(x-royGeysers[i].x,y-royGeysers[i].y)<rr+royGeysers[i].r+9) return true;
    } if(typeof nails!=='undefined'&&nails){ for(i=0;i<nails.length;i++){ if(Math.hypot(x-nails[i].x,y-nails[i].y)<rr+NAIL_R+10) return true;
    } } if(typeof coin!=='undefined'&&coin&&Math.hypot(x-coin.x,y-coin.y)<rr+COIN_R+20) return true;
    return false; }
    function rollCacti(){ if(roySandArena()){ if(!royCacti.length && !moving){ var _lvl=(typeof royaleLevel!=='undefined'?royaleLevel:'med');
    var _n=(_lvl==='easy')?4:3;
    for(var _cc=0;_cc<_n;_cc++){ var cx,cy,ok=false,tries=0,cr=CACTUS_R;
    while(!ok&&tries<80){ tries++;
    cx=WALL+16+Math.random()*(W-2*WALL-32);
    cy=NET_DEPTH+GOAL_AREA_D+18+Math.random()*(H-2*(NET_DEPTH+GOAL_AREA_D)-36);
    if(Math.abs(cx-W/2)<GOAL_W*0.5 && (cy<NET_DEPTH+GOAL_AREA_D+26||cy>H-NET_DEPTH-GOAL_AREA_D-26)) continue;
    if(_sandBlocked(cx,cy,cr)) continue;
    ok=true; } if(ok) royCacti.push({x:cx,y:cy,r:cr,hit:0});
    } } } else if(royCacti.length){ royCacti=[];
    } }
    function royCactiStep(){ if(!royCacti.length||!moving||scoring) return;
    if((typeof ghosting!=='undefined'&&ghosting)||(typeof TAC!=='undefined'&&TAC&&TAC.ghost&&typeof ghostUsed!=='undefined'&&!ghostUsed)) return;
    for(var _c=0;_c<royCacti.length;_c++){ var p=royCacti[_c];
    var dx=coin.x-p.x, dy=coin.y-p.y, d=Math.hypot(dx,dy), R=p.r+COIN_R;
    if(d<R && d>0.001){ var nx=dx/d, ny=dy/d, vn=coin.vx*nx+coin.vy*ny;
    if(vn<0){ coin.vx-=2*vn*nx;
    coin.vy-=2*vn*ny; } coin.x=p.x+nx*R;
    coin.y=p.y+ny*R; coin.vx*=0.66;
    coin.vy*=0.66; p.hit=1; try{ spawnSparks(p.x+nx*p.r,p.y+ny*p.r,'#cfe08a',6);
    }catch(e){} try{ if(typeof haptic==='function') haptic(18);
    }catch(e){} try{ if(!muted){ if(typeof sfxWall==='function') sfxWall();
    else if(typeof sfxCurl==='function') sfxCurl();
    } }catch(e){} break; } } }
    function drawCacti(now){ if(!royCacti.length) return;
    var _im=(typeof NS_CACTUS!=='undefined')?NS_CACTUS:null;
    ctx.save(); for(var _c=0;_c<royCacti.length;_c++){ var p=royCacti[_c], r=p.r;
    if(p.hit>0){ p.hit-=0.08;
    if(p.hit<0)p.hit=0; } var _jit=p.hit>0.02?Math.sin(now*0.05+_c)*2.4*p.hit:0;
    ctx.globalAlpha=0.24; ctx.fillStyle='#000';
    ctx.beginPath(); ctx.ellipse(p.x,p.y+r*0.62,r*0.9,r*0.34,0,0,6.283);
    ctx.fill(); ctx.globalAlpha=1;
    if(_im&&_im.complete&&_im.naturalWidth){ var _sz=r*3.1;
    ctx.imageSmoothingEnabled=false;
    ctx.drawImage(_im, Math.round(p.x-_sz/2+_jit), Math.round(p.y-_sz*0.72), _sz, _sz);
    } else { ctx.fillStyle='#3f7a34';
    ctx.beginPath(); ctx.arc(p.x+_jit,p.y,r,0,6.283);
    ctx.fill(); } } ctx.restore();
    }
    function royGeyserArena(){ return (roySandArena()&&typeof royaleLevel!=='undefined'&&(royaleLevel==='med'||royaleLevel==='hard')&&!_g1('cacti'))||_g1('geyser'); }
    function rollGeysers(){ if(royGeyserArena()){ if(!royGeysers.length && !moving){ for(var _gg=0;_gg<2;_gg++){ var gx,gy,ok=false,tries=0,gr=13;
    while(!ok&&tries<80){ tries++;
    gx=WALL+18+Math.random()*(W-2*WALL-36);
    gy=NET_DEPTH+GOAL_AREA_D+20+Math.random()*(H-2*(NET_DEPTH+GOAL_AREA_D)-40);
    if(Math.abs(gx-W/2)<GOAL_W*0.5 && (gy<NET_DEPTH+GOAL_AREA_D+28||gy>H-NET_DEPTH-GOAL_AREA_D-28)) continue;
    if(_sandBlocked(gx,gy,gr)) continue;
    ok=true; } if(ok) royGeysers.push({x:gx,y:gy,r:gr,period:150+Math.floor(Math.random()*70),t:Math.floor(Math.random()*150),erupt:false,fired:false});
    } } } else if(royGeysers.length){ royGeysers=[];
    } }
    function royGeyserTick(dt){ if(!royGeysers.length) return;
    var _st=dt/16.67; if(_st>3)_st=3;
    for(var _g=0;_g<royGeysers.length;_g++){ var p=royGeysers[_g];
    p.t+=_st; if(p.t>=p.period){ p.t=0;
    p.fired=false; } p.erupt=(p.t<26);
    } }
    function royGeyserStep(){ if(!royGeysers.length||!moving||scoring) return;
    if((typeof ghosting!=='undefined'&&ghosting)||(typeof TAC!=='undefined'&&TAC&&TAC.ghost&&typeof ghostUsed!=='undefined'&&!ghostUsed)) return;
    for(var _g=0;_g<royGeysers.length;_g++){ var p=royGeysers[_g];
    if(!p.erupt||p.fired) continue;
    var dx=coin.x-p.x, dy=coin.y-p.y, d=Math.hypot(dx,dy);
    if(d<p.r+COIN_R){ var _a=(d>0.001)?Math.atan2(dy,dx):(Math.random()*6.2832);
    var _spd=Math.hypot(coin.vx,coin.vy);
    var _out=6.5+_spd*0.3; coin.vx=Math.cos(_a)*_out;
    coin.vy=Math.sin(_a)*_out;
    coin.air=22; coin.air0=22;
    p.fired=true; try{ spawnSparks(p.x,p.y,'#f2ddab',14);
    }catch(e){} try{ if(typeof haptic==='function') haptic([0,
    26,18,30]); }catch(e){} try{ if(!muted){ if(typeof sfxWall==='function') sfxWall();
    else if(typeof sfxCurl==='function') sfxCurl();
    } }catch(e){} break; } } }
    function drawGeysers(now){ if(!royGeysers.length) return;
    ctx.save(); for(var _g=0;_g<royGeysers.length;_g++){ var p=royGeysers[_g], r=p.r;
    ctx.globalAlpha=0.9; ctx.fillStyle='#7a5a30';
    ctx.beginPath(); ctx.ellipse(p.x,p.y,r*0.85,r*0.5,0,0,6.283);
    ctx.fill(); ctx.fillStyle='#5a3f1e';
    ctx.beginPath(); ctx.ellipse(p.x,p.y,r*0.5,r*0.28,0,0,6.283);
    ctx.fill(); ctx.globalAlpha=1;
    if(p.erupt){ var _e=1-(p.t/26);
    for(var _k=0;_k<14;_k++){ var _pt=(_k/14), _rise=(_pt+ (now*0.02)%1)%1;
    var _px=p.x+Math.sin(_k*2.1+now*0.02)*r*0.5*(1-_rise), _py=p.y-_rise*r*3.0*_e, _pr=1+ (1-_rise)*1.8;
    ctx.globalAlpha=(1-_rise)*0.85*_e;
    ctx.fillStyle=_k%2?'#f2ddab':'#d9bd82';
    ctx.beginPath(); ctx.arc(_px,_py,_pr,0,6.283);
    ctx.fill(); } ctx.globalAlpha=1;
    } } ctx.restore(); }
    function royDevilArena(){ return (roySandArena()&&typeof royaleLevel!=='undefined'&&royaleLevel==='hard'&&!_g1('cacti'))||_g1('devil'); }
    function rollDevil(){ if(royDevilArena()){ if(!royDevil){ royDevil={x:W*0.5,y:H*0.32,tx:W*0.5,ty:H*0.5,phase:0,spin:(Math.random()<0.5?1:-1),hasBall:false,cd:0,eatT:0,eatDur:42};
    _devilRetarget(); } } else if(royDevil){ royDevil=null;
    } }
    function _devilRetarget(){ if(!royDevil) return; royDevil.tx=WALL+34+Math.random()*(W-2*WALL-68); royDevil.ty=NET_DEPTH+GOAL_AREA_D+30+Math.random()*(H-2*(NET_DEPTH+GOAL_AREA_D)-60); }
    function royDevilTick(dt){ if(!royDevil||royDevil.hasBall) return;
    if(royDevil._aftShock) return;   // AFTERSHOCK froze it mid-spin
    var _st=dt/16.67; if(_st>3)_st=3;
    if(_st<0.2)_st=0.2; var s=royDevil;
    s.phase+=0.18*_st*s.spin;
    var dx=s.tx-s.x, dy=s.ty-s.y, d=Math.hypot(dx,dy)||1;
    if(d<6){ _devilRetarget();
    } else { var sp=0.75*_st;
    s.x+=(dx/d)*sp; s.y+=(dy/d)*sp;
    } }
    function royDevilStep(){ if(!royDevil||!moving||scoring) return;
    if((typeof ghosting!=='undefined'&&ghosting)||(typeof TAC!=='undefined'&&TAC&&TAC.ghost&&typeof ghostUsed!=='undefined'&&!ghostUsed)) return;
    var s=royDevil;
      if(s.hasBall){ /* ball is caught: spin it up the funnel from base to top, then spit it out */ s.eatT++;
      var p=Math.min(1,s.eatT/s.eatDur);
      var ang=s.eatT*0.55, rad=DEVIL_R*(0.5-p*0.3), baseY=s.y+DEVIL_R*0.35, topY=s.y-DEVIL_R*1.25, yc=baseY+(topY-baseY)*p;
      coin.x=s.x+Math.cos(ang)*rad;
      coin.y=yc+Math.sin(ang)*rad*0.4;
      coin.vx=0; coin.vy=0; coin.air=20;
      coin.air0=20; if(s.eatT%4===0){ try{ spawnSparks(coin.x,coin.y,'#f2ddab',2);
      }catch(e){} } if(s.eatT%8===0){ try{ if(typeof haptic==='function') haptic(8);
      }catch(e){} } if(s.eatT>=s.eatDur){ /* spit from the top to a random spot on the pitch */ var tx=WALL+22+Math.random()*(W-2*WALL-44), ty=NET_DEPTH+GOAL_AREA_D+22+Math.random()*(H-2*(NET_DEPTH+GOAL_AREA_D)-44);
      var _dx=tx-coin.x, _dy=ty-coin.y, _dd=Math.hypot(_dx,_dy)||1, _spd=Math.max(6,Math.min(15,_dd*0.09));
      coin.vx=(_dx/_dd)*_spd; coin.vy=(_dy/_dd)*_spd;
      coin.air=30; coin.air0=30;
      s.hasBall=false; s.cd=80;
      try{ spawnSparks(coin.x,coin.y,'#f2ddab',16);
      }catch(e){} try{ if(!muted&&typeof sfxGuided==='function') sfxGuided();
      }catch(e){} try{ if(typeof haptic==='function') haptic([0,
      30,40,60]); }catch(e){} } return;
      }
      if(s.cd>0){ s.cd--; return; }
      if(s._aftShock) return;   // a shocked devil cannot catch
      var dx=coin.x-s.x, dy=coin.y-s.y, d=Math.hypot(dx,dy), R=DEVIL_R*0.5+COIN_R;
      // AFTERSHOCK: a charged shot cannot be eaten — it ZAPS the devil instead, freezing it for a flick
      if(d<R && TAC.aftershock && !aftUsed){ try{ aftShock([s], s.x, s.y, Math.hypot(coin.vx,coin.vy), false); }catch(e){}
      s.cd=60; return; }
      if(d<R){ s.hasBall=true;
      s.eatT=0; s.eatDur=42; try{ spawnSparks(s.x,s.y,'#f2ddab',12);
      }catch(e){} try{ if(!muted&&typeof sfxGuided==='function') sfxGuided();
      }catch(e){} try{ if(typeof haptic==='function') haptic([0,
      10,16,12]); }catch(e){} } }
    function drawDevil(now){ if(!royDevil) return;
    var s=royDevil, _by=s.y+DEVIL_R*0.42;
    ctx.save(); ctx.imageSmoothingEnabled=false;
    ctx.globalAlpha=0.22; ctx.fillStyle='#000';
    ctx.beginPath(); ctx.ellipse(s.x,_by,DEVIL_R*0.3,DEVIL_R*0.14,0,0,6.283);
    ctx.fill(); ctx.globalAlpha=1;
    for(var _l=0;_l<6;_l++){ var _t=_l/5, ry=DEVIL_R*(0.14+_t*0.76), yy=_by-_t*DEVIL_R*1.7, wob=Math.sin(s.phase*2+_l)*ry*0.3;
    ctx.globalAlpha=0.4+_t*0.42;
    ctx.fillStyle=_l%2?'#e8c88a':'#cfa863';
    ctx.beginPath(); ctx.ellipse(s.x+wob,yy,ry,ry*0.42,0,0,6.283);
    ctx.fill(); } ctx.globalAlpha=0.72;
    ctx.strokeStyle='#f2ddab';
    ctx.lineWidth=1.4; for(var _a=0;_a<2;_a++){ ctx.beginPath();
    for(var _p=0;_p<16;_p++){ var _pt=_p/15, ang=s.phase*2+_a*3.14+_pt*8, rad=DEVIL_R*(0.14+_pt*0.72), xx=s.x+Math.cos(ang)*rad, yy2=_by-_pt*DEVIL_R*1.62;
    if(_p===0) ctx.moveTo(xx,yy2);
    else ctx.lineTo(xx,yy2);
    } ctx.stroke(); } ctx.globalAlpha=1;
    ctx.restore(); }
    // NEON GRID. EASY is portals only (handled by the portal fns above). MEDIUM adds laser gates:
    // two horizontal neon beams that pulse on and off; while a beam is lit, a ball crossing it is
    // bounced straight back. HARD adds a light wall: a vertical neon bar that sweeps left-right,
    // bouncing off the side walls, and shoves any ball it overtakes aside in its travel direction.
    // Both ignore the player tokens; ghost phases through.
    function royNeonArena(){ return (typeof royaleArena!=='undefined'&&royaleArena&&royaleArena.cust==='portals'); }
    function royLaserArena(){ return royNeonArena()&&typeof royaleLevel!=='undefined'&&(royaleLevel==='med'||royaleLevel==='hard'); }
    function royWallArena(){ return royNeonArena()&&typeof royaleLevel!=='undefined'&&royaleLevel==='hard'; }
    function rollLasers(){ if(royLaserArena()){ if(!royLasers.length){ royLasers=[{y:Math.round(H*0.34),off:0,on:false,cd:0},
    {y:Math.round(H*0.66),off:130,on:false,cd:0}];
    royLaserT=0; } } else if(royLasers.length){ royLasers=[];
    } }
    function royLaserTick(dt){ if(!royLasers.length) return;
    var _st=dt/16.67; if(_st>3)_st=3;
    royLaserT+=_st; for(var _i=0;_i<royLasers.length;_i++){ var g=royLasers[_i];
    g.on=(((royLaserT+g.off)%260)<110);
    } }
    function royLaserStep(){ if(!royLasers.length||!moving||scoring||!royLaserArena()) return;
    if((typeof ghosting!=='undefined'&&ghosting)||(typeof TAC!=='undefined'&&TAC&&TAC.ghost&&typeof ghostUsed!=='undefined'&&!ghostUsed)) return;
    for(var _i=0;_i<royLasers.length;_i++){ var g=royLasers[_i];
    if(g.cd>0){ g.cd--; continue;
    } if(!g.on) continue; if(Math.abs(coin.y-g.y)<COIN_R+1.5 && Math.abs(coin.vy)>0.35){ coin.vy=-coin.vy*0.92;
    coin.y=g.y+((coin.vy>0)?1:-1)*(COIN_R+2.5);
    g.cd=10; try{ if(typeof sfxPortal==='function') sfxPortal();
    }catch(e){} try{ spawnSparks(coin.x,g.y,'#7fdcff',9);
    }catch(e){} try{ if(typeof haptic==='function') haptic([0,
    10,8,10]); }catch(_h){} break;
    } } }
    function drawLasers(now){ if(!royLasers.length) return;
    var left=WALL+1, right=W-WALL-1;
    ctx.save(); for(var _i=0;_i<royLasers.length;_i++){ var g=royLasers[_i], y=g.y;
    if(g.on){ var pul=0.7+Math.sin((now||0)*0.02)*0.3;
    ctx.globalAlpha=0.22*pul;
    ctx.strokeStyle='#7fdcff';
    ctx.lineWidth=6; ctx.beginPath();
    ctx.moveTo(left,y); ctx.lineTo(right,y);
    ctx.stroke(); ctx.globalAlpha=0.85;
    ctx.strokeStyle='#7fdcff';
    ctx.lineWidth=2.6; ctx.beginPath();
    ctx.moveTo(left,y); ctx.lineTo(right,y);
    ctx.stroke(); ctx.globalAlpha=0.95;
    ctx.strokeStyle='#e6faff';
    ctx.lineWidth=1.4; ctx.beginPath();
    ctx.moveTo(left,y); ctx.lineTo(right,y);
    ctx.stroke(); } else { ctx.globalAlpha=0.3;
    ctx.strokeStyle='#4a7fa0';
    ctx.lineWidth=1; ctx.setLineDash([4,
    5]); ctx.beginPath(); ctx.moveTo(left,y);
    ctx.lineTo(right,y); ctx.stroke();
    ctx.setLineDash([]); } ctx.globalAlpha=1;
    ctx.fillStyle=g.on?'#e6faff':'#2a4a5c';
    ctx.beginPath(); ctx.arc(left,y,2.4,0,6.283);
    ctx.arc(right,y,2.4,0,6.283);
    ctx.fill(); } ctx.restore();
    }
    function rollWall(){ if(royWallArena()){ if(!royWall){ royWall={x:Math.round(W*0.5),dir:(Math.random()<0.5?1:-1)}; } } else if(royWall){ royWall=null; } }
    function royWallTick(dt){ if(!royWall) return;
    var _st=dt/16.67; if(_st>3)_st=3;
    var s=royWall, lo=WALL+16, hi=W-WALL-16;
    s.x+=s.dir*1.15*_st; if(s.x<=lo){ s.x=lo;
    s.dir=1; } else if(s.x>=hi){ s.x=hi;
    s.dir=-1; } }
    function royWallStep(){ if(!royWall||!moving||scoring||!royWallArena()) return;
    if((typeof ghosting!=='undefined'&&ghosting)||(typeof TAC!=='undefined'&&TAC&&TAC.ghost&&typeof ghostUsed!=='undefined'&&!ghostUsed)) return;
    var s=royWall, hw=ROY_WALL_HW, pty=NET_DEPTH+COIN_R, pby=H-NET_DEPTH-COIN_R;
    if(coin.y<pty||coin.y>pby) return;
    var dx=coin.x-s.x; if(Math.abs(dx)>=hw+COIN_R) return;
    var side=(dx>=0)?1:-1; coin.x=s.x+side*(hw+COIN_R+0.5);
    if((side>0&&coin.vx<0)||(side<0&&coin.vx>0)) coin.vx=-coin.vx*0.82;
    coin.vx+=s.dir*1.3; var _tv=Math.hypot(coin.vx,coin.vy);
    if(_tv>26){ var _k=26/_tv;
    coin.vx*=_k; coin.vy*=_k;
    } try{ if(typeof sfxWall==='function') sfxWall();
    }catch(e){} try{ spawnSparks(s.x,coin.y,'#c89bff',7);
    }catch(e){} try{ if(typeof haptic==='function') haptic(16);
    }catch(e){} }
    function drawWall(now){ if(!royWall) return;
    var s=royWall, hw=ROY_WALL_HW, ty=NET_DEPTH, by=H-NET_DEPTH;
    ctx.save(); var pul=0.7+Math.sin((now||0)*0.015)*0.3;
    ctx.globalAlpha=0.16*pul;
    ctx.fillStyle='#c89bff';
    ctx.fillRect(s.x-hw-2,ty,(hw+2)*2,by-ty);
    ctx.globalAlpha=0.85; ctx.fillStyle='#3a1f5c';
    ctx.fillRect(s.x-hw,ty,hw*2,by-ty);
    ctx.globalAlpha=0.7; ctx.strokeStyle='#c89bff';
    ctx.lineWidth=1; var _off=((now||0)*0.05)%14;
    for(var yy=ty+_off; yy<by; yy+=14){ ctx.beginPath();
    ctx.moveTo(s.x-hw,yy); ctx.lineTo(s.x+hw,yy);
    ctx.stroke(); } ctx.globalAlpha=0.95;
    ctx.strokeStyle='#e6c8ff';
    ctx.lineWidth=1.4; ctx.beginPath();
    ctx.moveTo(s.x,ty); ctx.lineTo(s.x,by);
    ctx.stroke(); ctx.globalAlpha=1;
    ctx.fillStyle='#e6c8ff';
    var ay=Math.round(H*0.5), ax=s.x+s.dir*(hw+4);
    ctx.beginPath(); ctx.moveTo(ax,ay);
    ctx.lineTo(ax-s.dir*5,ay-4);
    ctx.lineTo(ax-s.dir*5,ay+4);
    ctx.closePath(); ctx.fill();
    ctx.restore(); }
    // BLACKOUT ALLEY. EASY drops the pitch into darkness, lighting only a soft pool around the
    // ball. MEDIUM adds a flickering streetlamp: the light stutters out in bursts. HARD adds street
    // drains — grates that swallow the ball and drop it back out of a random drain, mostly killing
    // its speed. The darkness is a vision handicap (drawn as an overlay); the drains are physical
    // and ignore the player tokens, ghost phases through.
    function royBlackoutArena(){ return (typeof royaleArena!=='undefined'&&royaleArena&&royaleArena.cust==='blackout'); }
    function royLampArena(){ return royBlackoutArena()&&typeof royaleLevel!=='undefined'&&(royaleLevel==='med'||royaleLevel==='hard'); }
    function royDrainArena(){ return royBlackoutArena()&&typeof royaleLevel!=='undefined'&&royaleLevel==='hard'; }
    function _lampOut(now){ if(!royLampArena()) return 0; var t=(now||0)*0.001, d=Math.sin(t*0.85)+Math.sin(t*1.9+0.8); return (d>1.0)?1:((d>0.6)?(d-0.6)/0.4:0); }
    var _darkCv=null,_darkCtx=null;
    function drawBlackout(now){ if(!royBlackoutArena()||scoring) return;
    var play=(phase==='play');
    var lo=play?_lampOut(now):0;
    var baseA=(play?0.96:0.9)+lo*0.035;
    if(!_darkCv){ _darkCv=document.createElement('canvas');
    _darkCv.width=W; _darkCv.height=H;
    _darkCtx=_darkCv.getContext('2d');
    } var g=_darkCtx; g.setTransform(1,0,0,1,0,0);
    g.globalCompositeOperation='source-over';
    g.clearRect(0,0,W,H); g.fillStyle='rgba(4,4,9,'+baseA.toFixed(3)+')';
    g.fillRect(0,0,W,H); g.globalCompositeOperation='destination-out';
    function pool(x,y,R,inF){ inF=inF||0.26;
    var rg=g.createRadialGradient(x,y,R*inF,x,y,R);
    rg.addColorStop(0,'rgba(0,0,0,1)');
    rg.addColorStop(0.68,'rgba(0,0,0,0.72)');
    rg.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle=rg; g.fillRect(x-R,y-R,R*2,R*2);
    } var _cx=(typeof coin!=='undefined'&&coin)?coin.x:W/2, _cy=(typeof coin!=='undefined'&&coin)?coin.y:H/2;
    if(play){ var R=(aiming?56:44);
    R=R*(1-lo)+(COIN_R+3)*lo;
    var innF=0.26+0.46*lo; pool(_cx,_cy,R,innF);
    } else { pool(_cx,_cy,38);
    if(typeof nails!=='undefined'&&nails) for(var _i=0;_i<nails.length;_i++){ pool(nails[_i].x,nails[_i].y,24);
    } } g.globalCompositeOperation='source-over';
    ctx.save(); ctx.imageSmoothingEnabled=true;
    ctx.drawImage(_darkCv,0,0,W,H);
    ctx.restore(); }
    function royDrainPts(){ var lx=WALL+20, rx=W-WALL-20, my=Math.round(H/2); return [{x:lx,y:my-46},{x:rx,y:my-46},{x:lx,y:my+46},{x:rx,y:my+46}]; }
    function royDrainStep(){ if(!royDrainArena()||!moving||scoring) return;
    if((typeof ghosting!=='undefined'&&ghosting)||(typeof TAC!=='undefined'&&TAC&&TAC.ghost&&typeof ghostUsed!=='undefined'&&!ghostUsed)) return;
    if(drainCD>0){ drainCD--;
    return; } var pts=royDrainPts();
    for(var i=0;i<pts.length;i++){ if(Math.hypot(coin.x-pts[i].x,coin.y-pts[i].y)<DRAIN_R+COIN_R){ var j;
    do{ j=Math.floor(Math.random()*pts.length);
    }while(j===i); var sp=Math.hypot(coin.vx,coin.vy), keep=Math.min(sp,4)*0.55, ang=Math.random()*6.2832;
    coin.x=pts[j].x; coin.y=pts[j].y;
    coin.vx=Math.cos(ang)*keep;
    coin.vy=Math.sin(ang)*keep;
    drainCD=16; try{ if(typeof sfxPortal==='function') sfxPortal();
    }catch(e){} try{ spawnSparks(pts[i].x,pts[i].y,'#5a636e',9);
    spawnSparks(pts[j].x,pts[j].y,'#5a636e',9);
    }catch(e){} try{ if(typeof haptic==='function') haptic([0,
    18,26,14]); }catch(_h){} return;
    } } }
    function drawDrains(now){ if(!royDrainArena()) return;
    var pts=royDrainPts(); ctx.save();
    for(var i=0;i<pts.length;i++){ var p=pts[i], r=DRAIN_R;
    ctx.globalAlpha=0.95; ctx.fillStyle='#0c0d12';
    ctx.beginPath(); ctx.arc(p.x,p.y,r+1,0,6.283);
    ctx.fill(); ctx.fillStyle='#1c2028';
    ctx.beginPath(); ctx.arc(p.x,p.y,r,0,6.283);
    ctx.fill(); ctx.strokeStyle='#3a4048';
    ctx.lineWidth=1; for(var b=-2;b<=2;b++){ var yy=p.y+b*(r*0.42);
    ctx.beginPath(); ctx.moveTo(p.x-r*0.78,yy);
    ctx.lineTo(p.x+r*0.78,yy);
    ctx.stroke(); } ctx.strokeStyle='#4a525c';
    ctx.lineWidth=1.2; ctx.beginPath();
    ctx.arc(p.x,p.y,r,0,6.283);
    ctx.stroke(); ctx.globalAlpha=1;
    } ctx.restore(); }
    // WEB WAREHOUSE. EASY is the webs (handled by rollTraps/trapHit above). MEDIUM adds a skittering
    // spider that roams the floor, re-arms webs it crawls over (so a web can catch again in the same
    // flick), and snatches the ball dead on contact. HARD adds falling crates that crash down on a
    // timer, knocking the ball off its line, then sit as solid boxes for a beat before fading. Both
    // ignore the player tokens; ghost phases through.
    function royWebArena(){ return (typeof royaleArena!=='undefined'&&royaleArena&&royaleArena.cust==='traps')||_g1('web'); }
    function roySpiderArena(){ return (royWebArena()&&typeof royaleLevel!=='undefined'&&(royaleLevel==='med'||royaleLevel==='hard')&&!_g1('web'))||_g1('spider'); }
    function royCrateArena(){ return (royWebArena()&&typeof royaleLevel!=='undefined'&&royaleLevel==='hard'&&!_g1('web'))||_g1('crate'); }
    function _spiderRetarget(){ if(!roySpider) return; roySpider.tx=WALL+22+Math.random()*(W-2*WALL-44); roySpider.ty=NET_DEPTH+GOAL_AREA_D+18+Math.random()*(H-2*(NET_DEPTH+GOAL_AREA_D)-36); }
    // a web spot is clear only if it doesn't overlap a player token or another web
    function _webClear(px,py){ if(typeof nails!=='undefined'&&nails){ for(var i=0;i<nails.length;i++){ if(Math.hypot(px-nails[i].x,py-nails[i].y)<NAIL_R+TRAP_R+6) return false;
    } } if(typeof rtraps!=='undefined'&&rtraps){ for(var j=0;j<rtraps.length;j++){ if(Math.hypot(px-rtraps[j].x,py-rtraps[j].y)<TRAP_R*3) return false;
    } } return true; }
    function _newWebSpot(){ var _g=NET_DEPTH+GOAL_AREA_D+12;
    for(var _t=0;_t<60;_t++){ var px=WALL+16+Math.random()*(W-2*WALL-32), py=_g+Math.random()*(H-2*_g);
    if(!_webClear(px,py)) continue;
    if(typeof coin!=='undefined'&&coin && Math.hypot(px-coin.x,py-coin.y)<TRAP_R+COIN_R+10) continue;
    return {x:px,y:py}; } return null;
    }
    function _spiderCap(){ return (typeof royaleLevel!=='undefined'&&royaleLevel==='hard')?11:9; }
    function rollSpider(){ if(roySpiderArena()){ if(!roySpider){ roySpider={x:Math.round(W*0.5),y:Math.round(H*0.28),tx:W*0.5,ty:H*0.4,ph:0,webT:50,legT:0,mode:'walk',wT:0,wx:0,wy:0,step:0};
    _spiderRetarget(); } } else if(roySpider){ roySpider=null;
    } }
    // The spider roams the floor, and every so often it STOPS and spins a web up on the spot (a
    // visible build: strands radiate out, then the rings fill in) before walking on. It tops the
    // warehouse up toward a cap. Webs are consumed (disappear) when the ball hits one, so it keeps
    // re-stocking them.
    function roySpiderTick(dt){ if(!roySpider) return;
    var _st=dt/16.67; if(_st>3)_st=3;
    var s=roySpider; s.legT+=_st;
    if(s.mode==='weave'){ s.wT+=_st;
    if(s.wT>=SPIDER_WEAVE_DUR){ if(rtraps.length<_spiderCap() && _webClear(s.wx,s.wy)) rtraps.push({x:s.wx,y:s.wy});
    try{ spawnSparks(s.wx,s.wy,'#e8e4f0',7);
    }catch(e){} s.mode='walk';
    s.webT=70+Math.random()*70;
    _spiderRetarget(); } return;
    } var dx=s.tx-s.x, dy=s.ty-s.y, d=Math.hypot(dx,dy)||1;
    if(d<5){ _spiderRetarget();
    } else { var sp=1.05*_st;
    s.x+=(dx/d)*sp; s.y+=(dy/d)*sp;
    s.ph=Math.atan2(dy,dx); s.step=(s.step||0)+sp;
    } if(roySpiderArena()&&!scoring){ s.webT-=_st;
    if(s.webT<=0){ if(rtraps.length<_spiderCap() && _webClear(s.x,s.y) && (typeof coin==='undefined'||!coin||Math.hypot(coin.x-s.x,coin.y-s.y)>TRAP_R+COIN_R+12)){ s.mode='weave';
    s.wT=0; s.wx=s.x; s.wy=s.y;
    } else { s.webT=20; } } } }
    function drawSpider(now){ if(!roySpider) return;
    var s=roySpider, R=SPIDER_R, _wv=(s.mode==='weave'), lw=Math.sin(s.legT*(_wv?0.9:0.4))*(_wv?2.2:1.4);
    ctx.save(); ctx.imageSmoothingEnabled=false;
    if(_wv){ var p=Math.min(1,s.wT/SPIDER_WEAVE_DUR), WR=COIN_R+1, spk=8;
    ctx.save(); ctx.globalAlpha=0.3+0.62*p;
    ctx.strokeStyle='#e8e4f0';
    ctx.lineWidth=0.7; ctx.lineCap='round';
    for(var _a=0;_a<spk;_a++){ var th=_a*(6.283/spk);
    ctx.beginPath(); ctx.moveTo(s.wx,s.wy);
    ctx.lineTo(s.wx+Math.cos(th)*WR*p,s.wy+Math.sin(th)*WR*p);
    ctx.stroke(); } if(p>0.4){ var rp=Math.min(1,(p-0.4)/0.6);
    for(var _rg=1;_rg<=2;_rg++){ var rr=WR*_rg/2*rp;
    ctx.beginPath(); for(var _a2=0;_a2<=spk;_a2++){ var th2=_a2*(6.283/spk), x=s.wx+Math.cos(th2)*rr, y=s.wy+Math.sin(th2)*rr;
    if(_a2===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y); } ctx.closePath();
    ctx.stroke(); } } ctx.restore();
    } ctx.globalAlpha=0.22; ctx.fillStyle='#000';
    ctx.beginPath(); ctx.ellipse(s.x,s.y+2,R*0.95,R*0.5,0,0,6.283);
    ctx.fill(); ctx.globalAlpha=1;
    ctx.save(); ctx.translate(s.x,s.y);
    ctx.rotate(s.ph+Math.PI/2);
    var _gait=(s.step||0)*0.75, _LG=[[1.55,
    -1.05],[1.8,-0.4],[1.8,0.35],
    [1.55,1.0]]; ctx.strokeStyle='#8a8496';
    ctx.lineWidth=1.5; ctx.lineCap='round';
    ctx.lineJoin='round'; for(var k=0;k<4;k++){ for(var sd=-1;sd<=1;sd+=2){ var _ph=_gait+k*1.1+(sd>0?Math.PI:0), _sw=Math.sin(_ph), _lift=Math.max(0,Math.cos(_ph));
    var _bx=_LG[k][0], _by=_LG[k][1], _ay=(_by<0?-R*0.35:R*0.35), _ax=sd*R*0.4, _kx=sd*R*_bx*0.55, _ky=R*_by*0.52+_sw*R*0.12, _fx=sd*R*_bx*(1-_lift*0.26), _fy=R*_by+_sw*R*0.34;
    ctx.beginPath(); ctx.moveTo(_ax,_ay);
    ctx.lineTo(_kx,_ky); ctx.lineTo(_fx,_fy);
    ctx.stroke(); } } ctx.fillStyle='#cbc8d6';
    ctx.beginPath(); ctx.ellipse(0,R*0.28,R*0.72,R*0.92,0,0,6.283);
    ctx.fill(); ctx.fillStyle='#e4e0ec';
    ctx.beginPath(); ctx.arc(0,-R*0.52,R*0.46,0,6.283);
    ctx.fill(); ctx.fillStyle='#4a4452';
    ctx.beginPath(); ctx.arc(-R*0.2,-R*0.64,1.1,0,6.283);
    ctx.arc(R*0.2,-R*0.64,1.1,0,6.283);
    ctx.fill(); ctx.restore();
    ctx.restore(); }
    function _spawnCrate(){ if(royCrates.length>=3) return;
    var x,y,ok=false,tr=0; while(!ok&&tr<40){ tr++;
    x=WALL+20+Math.random()*(W-2*WALL-40);
    y=NET_DEPTH+GOAL_AREA_D+16+Math.random()*(H-2*(NET_DEPTH+GOAL_AREA_D)-32);
    ok=true; if(typeof nails!=='undefined'&&nails){ for(var i=0;i<nails.length;i++){ if(Math.hypot(x-nails[i].x,y-nails[i].y)<CRATE_HALF+NAIL_R+4){ ok=false;
    break; } } } } if(!ok) return;
    royCrates.push({x:x,y:y,phase:'fall',fall:0,dropDur:26,t:0,solidDur:110,fadeDur:20,impact:false});
    }
    function royCrateTick(dt){ if(!royCrateArena()){ if(royCrates.length) royCrates=[];
    return; } var _st=dt/16.67;
    if(_st>3)_st=3; if(moving&&!scoring){ crateT-=_st;
    if(crateT<=0){ crateT=40+Math.random()*45;
    _spawnCrate(); } } for(var i=royCrates.length-1;i>=0;i--){ var c=royCrates[i];
    c.t+=_st; if(c.phase==='fall'){ c.fall+=_st;
    if(c.fall>=c.dropDur){ c.phase='land';
    c.t=0; c.impact=true; } } else if(c.phase==='land'){ if(c.t>c.solidDur){ c.phase='fade';
    c.t=0; } } else if(c.phase==='fade'){ if(c.t>c.fadeDur){ royCrates.splice(i,1);
    } } } }
    function royCrateStep(){ if(!royCrateArena()||!moving||scoring||!royCrates.length) return;
    if((typeof ghosting!=='undefined'&&ghosting)||(typeof TAC!=='undefined'&&TAC&&TAC.ghost&&typeof ghostUsed!=='undefined'&&!ghostUsed)) return;
    var h=CRATE_HALF; for(var i=0;i<royCrates.length;i++){ var c=royCrates[i];
    if(c.phase==='fall') continue;
    if(c.impact){ c.impact=false;
    var dx=coin.x-c.x, dy=coin.y-c.y, d=Math.hypot(dx,dy);
    if(d<h+COIN_R+7){ var a=(d>0.01)?Math.atan2(dy,dx):(Math.random()*6.2832), spd=Math.hypot(coin.vx,coin.vy), out=5+spd*0.4;
    coin.vx=Math.cos(a)*out;
    coin.vy=Math.sin(a)*out;
    coin.air=10; coin.air0=10;
    try{ if(typeof sfxWall==='function') sfxWall();
    }catch(e){} try{ spawnSparks(c.x,c.y,'#c8944e',13);
    }catch(e){} try{ if(typeof haptic==='function') haptic([0,
    32,18,14]); }catch(e){} } } if(c.phase==='land' && !(coin.air>0)){ var nx=Math.max(c.x-h,Math.min(c.x+h,coin.x)), ny=Math.max(c.y-h,Math.min(c.y+h,coin.y)), ddx=coin.x-nx, ddy=coin.y-ny, dd=Math.hypot(ddx,ddy);
    if(dd<COIN_R && dd>0.001){ var pen=COIN_R-dd, ux=ddx/dd, uy=ddy/dd;
    coin.x+=ux*pen; coin.y+=uy*pen;
    var vn=coin.vx*ux+coin.vy*uy;
    if(vn<0){ coin.vx-=2*vn*ux;
    coin.vy-=2*vn*uy; coin.vx*=0.9;
    coin.vy*=0.9; } } else if(dd<=0.001){ if(Math.abs(coin.x-c.x)>Math.abs(coin.y-c.y)){ coin.x=c.x+((coin.x<c.x)?-1:1)*(h+COIN_R);
    coin.vx=-coin.vx*0.9; } else { coin.y=c.y+((coin.y<c.y)?-1:1)*(h+COIN_R);
    coin.vy=-coin.vy*0.9; } } } } }
    function _drawCrateBox(cx,cy,h){ ctx.fillStyle='#8a5e2e';
    ctx.fillRect(cx-h,cy-h,h*2,h*2);
    ctx.fillStyle='#a9743a';
    ctx.fillRect(cx-h+1.5,cy-h+1.5,h*2-3,h*2-3);
    ctx.strokeStyle='#5e3d1c';
    ctx.lineWidth=1.4; ctx.strokeRect(cx-h,cy-h,h*2,h*2);
    ctx.beginPath(); ctx.moveTo(cx-h,cy-h);
    ctx.lineTo(cx+h,cy+h); ctx.moveTo(cx+h,cy-h);
    ctx.lineTo(cx-h,cy+h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-h,cy-h*0.42);
    ctx.lineTo(cx+h,cy-h*0.42);
    ctx.moveTo(cx-h,cy+h*0.42);
    ctx.lineTo(cx+h,cy+h*0.42);
    ctx.stroke(); }
    function drawCrates(now){ if(!royCrates.length) return;
    ctx.save(); ctx.imageSmoothingEnabled=false;
    for(var i=0;i<royCrates.length;i++){ var c=royCrates[i], h=CRATE_HALF;
    if(c.phase==='fall'){ var p=c.fall/c.dropDur;
    ctx.globalAlpha=0.18+0.22*p;
    ctx.fillStyle='#000'; ctx.beginPath();
    ctx.ellipse(c.x,c.y,h*(0.45+0.55*p),h*0.5*(0.45+0.55*p),0,0,6.283);
    ctx.fill(); ctx.globalAlpha=1;
    _drawCrateBox(c.x,c.y-(1-p)*72,h*(0.82+0.18*p));
    } else { var a=(c.phase==='fade')?(1-c.t/c.fadeDur):1;
    ctx.globalAlpha=0.28*a; ctx.fillStyle='#000';
    ctx.beginPath(); ctx.ellipse(c.x,c.y+h*0.75,h,h*0.4,0,0,6.283);
    ctx.fill(); ctx.globalAlpha=a;
    _drawCrateBox(c.x,c.y,h);
    } } ctx.globalAlpha=1; ctx.restore();
    }
    // THE FORTRESS. EASY is the three walls + anchor keeper (handled by royWallRects/collideStep
    // and the anchor ability). MEDIUM adds a PORTCULLIS: an iron grate that slides down over each
    // goal on a timer and blocks shots while it's lowered — shoot through the window when it lifts.
    // HARD adds a BOULDER: a heavy stone that rolls back and forth across midfield, bouncing off the
    // side walls and shoving the ball. Both let ghost phase through.
    function royFortArena(){ return (typeof royaleArena!=='undefined'&&royaleArena&&royaleArena.cust==='fortress'); }
    function royPortcArena(){ return royFortArena()&&typeof royaleLevel!=='undefined'&&royaleLevel==='hard'; }
    function royBoulderArena(){ return royFortArena()&&typeof royaleLevel!=='undefined'&&(royaleLevel==='med'||royaleLevel==='hard'); }
    function _portcOpen(){ return 0.5-0.5*Math.cos(royPortcT*0.028); } // 0 = fully closed, 1 = fully open
    function _portcLen(){ return (1-_portcOpen())*30; }
    function royPortcTick(dt){ if(!royPortcArena()) return; var _st=dt/16.67; if(_st>3)_st=3; royPortcT+=_st; }
    function royPortcStep(){ if(!royPortcArena()||!moving||scoring) return;
    if((typeof ghosting!=='undefined'&&ghosting)||(typeof TAC!=='undefined'&&TAC&&TAC.ghost&&typeof ghostUsed!=='undefined'&&!ghostUsed)) return;
    var len=_portcLen(); if(len<COIN_R) return;
    var _pr=goalAreaRect('blue'), bx=Math.round(_pr.x), span=Math.round(_pr.w), yFT=NET_DEPTH+_pr.h, yFB=H-NET_DEPTH-_pr.h;
    var rects=[{x:bx,y:yFT-len,w:span,h:len},
    {x:bx,y:yFB,w:span,h:len}];
    for(var i=0;i<rects.length;i++){ var r=rects[i], bxx=r.x, byy=r.y, bww=r.w, bhh=r.h, cyb=byy+bhh/2;
    if(coin.x>bxx-COIN_R && coin.x<bxx+bww+COIN_R && Math.abs(coin.y-cyb)<COIN_R+bhh/2){ var oL=coin.x-(bxx-COIN_R), oR=(bxx+bww+COIN_R)-coin.x, oT=coin.y-(byy-COIN_R), oB=(byy+bhh+COIN_R)-coin.y, m=Math.min(oL,oR,oT,oB), hf=null;
    if(m===oT&&coin.vy>0) hf='T';
    else if(m===oB&&coin.vy<0) hf='B';
    else if(m===oL&&coin.vx>0) hf='L';
    else if(m===oR&&coin.vx<0) hf='R';
    if(hf==='T'){ coin.y=byy-COIN_R;
    coin.vy=-coin.vy*RESTITUTION;
    coin.vx*=0.98; } else if(hf==='B'){ coin.y=byy+bhh+COIN_R;
    coin.vy=-coin.vy*RESTITUTION;
    coin.vx*=0.98; } else if(hf==='L'){ coin.x=bxx-COIN_R;
    coin.vx=-coin.vx*RESTITUTION;
    coin.vy*=0.98; } else if(hf==='R'){ coin.x=bxx+bww+COIN_R;
    coin.vx=-coin.vx*RESTITUTION;
    coin.vy*=0.98; } if(hf){ spawnSparks(coin.x,coin.y,null,6);
    royHitFx(240,0.07,'square',0.06,16);
    } } } }
    function drawPortcullis(now){ if(!royPortcArena()) return;
    var _pr=goalAreaRect('blue'), len=_portcLen(), bx=Math.round(_pr.x), span=Math.round(_pr.w), yFT=NET_DEPTH+_pr.h, yFB=H-NET_DEPTH-_pr.h;
    ctx.save(); ctx.imageSmoothingEnabled=false;
    var goals=[{ry:yFT,d:-1},
    {ry:yFB,d:1}]; for(var gi=0;gi<goals.length;gi++){ var ry=goals[gi].ry, d=goals[gi].d;
    ctx.fillStyle='#4a4f57';
    ctx.fillRect(bx-2, ry-1, span+4, 2);
    if(len<1) continue; var tipY=ry+d*len;
    ctx.strokeStyle='#767c85';
    ctx.lineWidth=1.6; ctx.lineCap='round';
    for(var tx=bx+3; tx<=bx+span-3; tx+=6){ ctx.beginPath();
    ctx.moveTo(tx,ry); ctx.lineTo(tx,tipY);
    ctx.stroke(); ctx.fillStyle='#767c85';
    ctx.beginPath(); ctx.moveTo(tx-1.6,tipY);
    ctx.lineTo(tx+1.6,tipY);
    ctx.lineTo(tx,tipY+d*2.6);
    ctx.closePath(); ctx.fill();
    } ctx.strokeStyle='#5a6068';
    ctx.lineWidth=1.3; var midY=ry+d*len*0.55;
    ctx.beginPath(); ctx.moveTo(bx+2,midY);
    ctx.lineTo(bx+span-2,midY);
    ctx.stroke(); } ctx.restore();
    }
    function rollBoulder(){ if(royBoulderArena()){ if(!royBoulder){ royBoulder={x:Math.round(W*0.5),y:Math.round(H*0.5),dir:(Math.random()<0.5?1:-1),roll:0};
    } } else if(royBoulder){ royBoulder=null;
    } }
    function royBoulderTick(dt){ if(!royBoulder) return;
    if(royBoulder._aftShock) return;   // AFTERSHOCK: the boulder stops rolling for a flick
    var _st=dt/16.67; if(_st>3)_st=3;
    var s=royBoulder, lo=WALL+BOULDER_R, hi=W-WALL-BOULDER_R, spd=1.25*_st;
    s.x+=s.dir*spd; s.roll+=s.dir*spd/BOULDER_R;
    if(s.x<=lo){ s.x=lo; s.dir=1;
    } else if(s.x>=hi){ s.x=hi;
    s.dir=-1; } }
    function royBoulderStep(){ if(!royBoulder||!moving||scoring||!royBoulderArena()) return;
    if((typeof ghosting!=='undefined'&&ghosting)||(typeof TAC!=='undefined'&&TAC&&TAC.ghost&&typeof ghostUsed!=='undefined'&&!ghostUsed)) return;
    var s=royBoulder, dx=coin.x-s.x, dy=coin.y-s.y, d=Math.hypot(dx,dy), min=BOULDER_R+COIN_R;
    if(d<min && d>0.001){ var ux=dx/d, uy=dy/d;
    coin.x=s.x+ux*min; coin.y=s.y+uy*min;
    var vn=coin.vx*ux+coin.vy*uy;
    if(vn<0){ coin.vx-=2*vn*ux;
    coin.vy-=2*vn*uy; } coin.vx=coin.vx*0.92+s.dir*1.5;
    var _tv=Math.hypot(coin.vx,coin.vy);
    if(_tv>26){ var _k=26/_tv;
    coin.vx*=_k; coin.vy*=_k;
    } try{ if(typeof sfxWall==='function') sfxWall();
    }catch(e){} try{ spawnSparks(s.x+ux*BOULDER_R,s.y+uy*BOULDER_R,'#8a8078',10);
    }catch(e){} try{ if(typeof haptic==='function') haptic([0,
    24,14,24]); }catch(e){} if(TAC.aftershock && !aftUsed){ try{ aftShock([s], s.x+ux*BOULDER_R, s.y+uy*BOULDER_R, _tv||4, false); }catch(e){} } } }
    function drawBoulder(now){ if(!royBoulder) return;
    var s=royBoulder, R=BOULDER_R;
    ctx.save(); ctx.imageSmoothingEnabled=false;
    ctx.globalAlpha=0.28; ctx.fillStyle='#000';
    ctx.beginPath(); ctx.ellipse(s.x,s.y+R*0.55,R*0.95,R*0.4,0,0,6.283);
    ctx.fill(); ctx.globalAlpha=1;
    ctx.fillStyle='#6b6660';
    ctx.beginPath(); ctx.arc(s.x,s.y,R,0,6.283);
    ctx.fill(); ctx.fillStyle='#7c776f';
    ctx.beginPath(); ctx.arc(s.x-R*0.26,s.y-R*0.26,R*0.66,0,6.283);
    ctx.fill(); ctx.save(); ctx.translate(s.x,s.y);
    ctx.rotate(s.roll); ctx.strokeStyle='#48443e';
    ctx.lineWidth=1.2; ctx.lineCap='round';
    for(var i=0;i<3;i++){ var a=i*2.1;
    ctx.beginPath(); ctx.moveTo(Math.cos(a)*R*0.15,Math.sin(a)*R*0.15);
    ctx.lineTo(Math.cos(a)*R*0.82,Math.sin(a)*R*0.82);
    ctx.stroke(); } ctx.restore();
    ctx.strokeStyle='#48443e';
    ctx.lineWidth=1; ctx.beginPath();
    ctx.arc(s.x,s.y,R,0,6.283);
    ctx.stroke(); ctx.restore();
    }
    // Bush ambush serpent (savanna, hard): the first-generation rear-up serpent art. One serpent
    // hides inside each bush; when a ball passes near a bush the serpent rears up out of the
    // foliage and strikes, shoving the ball away. It ignores the player tokens. Ghost phases through.
    function roySerpArena(){ return (typeof royaleArena!=='undefined'&&royaleArena&&royaleArena.hazard==='bush'&&typeof royaleLevel!=='undefined'&&royaleLevel==='hard')||_g1('snake'); }
    function rollSerp(){ if(roySerpArena()){ if(roySerp.length!==royBushes.length){ roySerp=[];
    for(var _s=0;_s<royBushes.length;_s++){ roySerp.push({bush:_s,strike:0,gx:0,gy:0,cd:0,armed:true});
    } } } else if(roySerp.length){ roySerp=[];
    } }
    function roySerpStep(){ if(!roySerp.length||!royBushes.length||!moving||scoring) return;
    if((typeof ghosting!=='undefined'&&ghosting)||(typeof TAC!=='undefined'&&TAC&&TAC.ghost&&typeof ghostUsed!=='undefined'&&!ghostUsed)) return;
    for(var _s=0;_s<roySerp.length;_s++){ var sp=roySerp[_s];
    var b=royBushes[sp.bush];
    if(!b) continue; var _dx=coin.x-b.x, _dy=coin.y-b.y, _d=Math.hypot(_dx,_dy);
    if(_d>SERP_STRIKE_R+COIN_R+8) sp.armed=true;
    /* ball left the bush — re-arm so it can strike again next time */ if(sp.cd>0||sp.armed===false) continue;
    /* just caught this ball: let it go, don't re-grab until it escapes */ var _spd=Math.hypot(coin.vx,coin.vy);
    if(_spd<0.8) continue; /* ignore a resting ball */ if(_d<SERP_STRIKE_R+COIN_R && _d>0.001){ sp.strike=1;
    sp.cd=45; sp.armed=false;
    sp.gx=coin.x; sp.gy=coin.y;
    coin.x=b.x+(Math.random()-0.5)*b.r*0.5;
    coin.y=b.y+(Math.random()-0.5)*b.r*0.5;
    coin.vx=0; coin.vy=0; b.rust=Math.min(1.6,1.2);
    try{ spawnSparks(b.x,b.y,'#6ab04a',12);
    }catch(e){} try{ if(typeof haptic==='function') haptic([0,
    20,16,20]); }catch(_h){} try{ if(!muted&&typeof sfxCurl==='function') sfxCurl();
    }catch(e){} break; } } }
    function drawSerp(now){ if(!roySerp.length||!royBushes.length) return;
    var _NS=(typeof NS_LUNGE!=='undefined'&&NS_LUNGE.length)?NS_LUNGE:((typeof NS_SERP!=='undefined'&&NS_SERP.length)?NS_SERP:null);
    for(var _s=0;_s<roySerp.length;_s++){ var sp=roySerp[_s];
    if(sp.strike>0){ sp.strike-=0.06;
    if(sp.strike<0) sp.strike=0;
    } if(sp.cd>0) sp.cd--; var b=royBushes[sp.bush];
    if(!b) continue; var _d=(typeof coin!=='undefined'&&coin)?Math.hypot(coin.x-b.x,coin.y-b.y):999;
    var _mv=(typeof moving!=='undefined'&&moving&&typeof coin!=='undefined'&&coin), _spd2=_mv?Math.hypot(coin.vx,coin.vy):0, _appr=_mv&&_spd2>=0.8&&sp.armed!==false&&((coin.x-b.x)*coin.vx+(coin.y-b.y)*coin.vy)<0;
    var _al=(sp.cd>0&&sp.strike<0.02)||!_appr?0:Math.max(0,1-_d/SERP_ALERT_R);
    var _out=Math.max(_al,sp.strike);
    if(_out<0.02) continue; /* hidden inside the bush */ var _bx=(typeof coin!=='undefined'&&coin)?coin.x:b.x, _by=(typeof coin!=='undefined'&&coin)?coin.y:b.y;
    var _tx=(sp.strike>0.02)?sp.gx:_bx, _ty=(sp.strike>0.02)?sp.gy:_by;
    var _ang=Math.atan2(_ty-b.y,_tx-b.x);
    var _lun=Math.sin(Math.max(0,sp.strike)*Math.PI)*10;
    var _sc=0.78+_out*0.42; var _stg=(sp.strike>0.35)?3:(_out>0.62?2:(_out>0.3?1:0));
    var _im=_NS?(_NS[_stg]||_NS[0]):null;
    ctx.save(); ctx.imageSmoothingEnabled=false;
    ctx.translate(b.x+Math.cos(_ang)*_lun, b.y+Math.sin(_ang)*_lun);
    ctx.rotate(_ang+Math.PI/2);
    if(_im&&_im.complete&&_im.naturalWidth){ var _w=17*_sc, _h=_w*(_im.naturalHeight/_im.naturalWidth);
    ctx.drawImage(_im, Math.round(-_w/2), Math.round(-_h*0.78), _w, _h);
    } else { ctx.fillStyle='#4a7a34';
    ctx.beginPath(); ctx.arc(0,-6*_sc,6*_sc,0,6.283);
    ctx.fill(); } ctx.restore();
    } }
    // Pinball table (cobbles). Small token-sized bumpers POP the ball on contact (all levels).
    // MEDIUM adds orbit lanes: arrowed fast paths that accelerate the ball along them. HARD adds
    // two flippers near mid-pitch that sweep back and forth in random directions and whack the
    // ball. Every object is placed clear of the others and of the player tokens. They ignore the
    // tokens; ghost phases through.
    function royBumperArena(){ return (typeof royaleArena!=='undefined'&&royaleArena&&royaleArena.hazard==='bumper'); }
    function _roySegT(px,py,ax,ay,bx,by){ var dx=bx-ax, dy=by-ay, l2=dx*dx+dy*dy; if(l2<0.0001) return 0; var t=((px-ax)*dx+(py-ay)*dy)/l2; return t<0?0:(t>1?1:t); }
    function _roySegDist(px,py,ax,ay,bx,by){ var t=_roySegT(px,py,ax,ay,bx,by); return Math.hypot(px-(ax+(bx-ax)*t), py-(ay+(by-ay)*t)); }
    // true if a circle (x,y,rr) would overlap any already-placed pinball object or a player token
    function _pinBlocked(x,y,rr){ var i;
    for(i=0;i<royFlippers.length;i++){ var f=royFlippers[i];
    if(Math.hypot(x-f.px,y-f.py)<rr+f.len+f.w+6) return true;
    } for(i=0;i<royOrbits.length;i++){ var o=royOrbits[i];
    if(_roySegDist(x,y,o.ax,o.ay,o.bx,o.by)<rr+o.w+7) return true;
    } for(i=0;i<royBumpers.length;i++){ var b=royBumpers[i];
    if(Math.hypot(x-b.x,y-b.y)<rr+b.r+7) return true;
    } if(typeof nails!=='undefined'&&nails){ for(i=0;i<nails.length;i++){ if(Math.hypot(x-nails[i].x,y-nails[i].y)<rr+NAIL_R+8) return true;
    } } if(typeof coin!=='undefined'&&coin&&Math.hypot(x-coin.x,y-coin.y)<rr+COIN_R+16) return true;
    return false; }
    function rollFlippers(){ if(!royBumperArena()||royFlippers.length) return;
    var _lvl=(typeof royaleLevel!=='undefined'?royaleLevel:'med');
    if(_lvl!=='hard') return;
    var defs=[{px:W*0.5-48,py:H*0.5,base:0},
    {px:W*0.5+48,py:H*0.5,base:Math.PI}];
    for(var _f=0;_f<defs.length;_f++){ var d=defs[_f];
    royFlippers.push({px:d.px,py:d.py,base:d.base,len:18,w:4,amp:0.95,ang:d.base,spin:(Math.random()<0.5?1:-1)*0.05,t:20+Math.floor(Math.random()*30),flash:0});
    } }
    function rollOrbits(){ if(!royBumperArena()||royOrbits.length) return;
    var _lvl=(typeof royaleLevel!=='undefined'?royaleLevel:'med');
    if(_lvl!=='med'&&_lvl!=='hard') return;
    var lanes=[{ax:WALL+14,ay:H*0.59,bx:WALL+14,by:H*0.41},
    {ax:W-WALL-14,ay:H*0.41,bx:W-WALL-14,by:H*0.59}];
    for(var _o=0;_o<lanes.length;_o++){ var l=lanes[_o], dx=l.bx-l.ax, dy=l.by-l.ay, ln=Math.hypot(dx,dy)||1;
    royOrbits.push({ax:l.ax,ay:l.ay,bx:l.bx,by:l.by,ux:dx/ln,uy:dy/ln,w:7});
    } }
    function rollBumpers(){ if(royBumperArena()){ if(!royBumpers.length && !moving){ var _hues=['#e8443c',
    '#3ca6e8']; for(var _side=0;_side<2;_side++){ var bx,by,ok=false,tries=0,br=BUMPER_R;
    while(!ok&&tries<90){ tries++;
    if(_side===0) bx=WALL+20+Math.random()*(W/2-16-(WALL+20));
    else bx=W/2+16+Math.random()*(W-WALL-20-(W/2+16));
    by=NET_DEPTH+GOAL_AREA_D+18+Math.random()*(H-2*(NET_DEPTH+GOAL_AREA_D)-36);
    if(_pinBlocked(bx,by,br)) continue;
    ok=true; } if(ok){ royBumpers.push({x:bx,y:by,r:br,flash:0,hue:_hues[_side]});
    } } } } else if(royBumpers.length||royOrbits.length||royFlippers.length){ royBumpers=[];
    royOrbits=[]; royFlippers=[];
    } }
    // per-rendered-frame flipper motion (runs even between turns so the paddles keep flapping)
    function royFlipperTick(dt){ if(!royFlippers.length) return;
    var _st=dt/16.67; if(_st>3)_st=3;
    if(_st<0.2)_st=0.2; for(var _f=0;_f<royFlippers.length;_f++){ var f=royFlippers[_f];
    if(f.flash>0){ f.flash-=0.09*_st;
    if(f.flash<0)f.flash=0; } f.ang+=f.spin*_st;
    var lo=f.base-f.amp, hi=f.base+f.amp;
    if(f.ang<lo){ f.ang=lo; f.spin=Math.abs(f.spin);
    } else if(f.ang>hi){ f.ang=hi;
    f.spin=-Math.abs(f.spin);
    } f.t-=_st; if(f.t<=0){ f.t=15+Math.floor(Math.random()*35);
    f.spin=(Math.random()<0.5?1:-1)*(0.035+Math.random()*0.06);
    } } }
    function royOrbitStep(){ if(!royOrbits.length||!moving||scoring){ _orbitWasIn=false;
    return; } if((typeof ghosting!=='undefined'&&ghosting)||(typeof TAC!=='undefined'&&TAC&&TAC.ghost&&typeof ghostUsed!=='undefined'&&!ghostUsed)){ _orbitWasIn=false;
    return; } var _nowIn=false;
    for(var _o=0;_o<royOrbits.length;_o++){ var o=royOrbits[_o];
    var t=_roySegT(coin.x,coin.y,o.ax,o.ay,o.bx,o.by);
    var cx=o.ax+(o.bx-o.ax)*t, cy=o.ay+(o.by-o.ay)*t;
    if(Math.hypot(coin.x-cx,coin.y-cy)<o.w+COIN_R){ _nowIn=true;
    coin.vx+=o.ux*0.4; coin.vy+=o.uy*0.4;
    coin.vx+=(cx-coin.x)*0.06;
    coin.vy+=(cy-coin.y)*0.06;
    } } if(_nowIn && !_orbitWasIn){ royHitFx(520,0.09,'triangle',0.045,14);
    } _orbitWasIn=_nowIn; }
    function royFlipperStep(){ if(!royFlippers.length||!moving||scoring) return;
    if((typeof ghosting!=='undefined'&&ghosting)||(typeof TAC!=='undefined'&&TAC&&TAC.ghost&&typeof ghostUsed!=='undefined'&&!ghostUsed)) return;
    for(var _f=0;_f<royFlippers.length;_f++){ var f=royFlippers[_f];
    var tx=f.px+Math.cos(f.ang)*f.len, ty=f.py+Math.sin(f.ang)*f.len;
    var t=_roySegT(coin.x,coin.y,f.px,f.py,tx,ty);
    var cx=f.px+(tx-f.px)*t, cy=f.py+(ty-f.py)*t;
    var dx=coin.x-cx, dy=coin.y-cy, d=Math.hypot(dx,dy), R=f.w+COIN_R;
    if(d<R && d>0.001){ var nx=dx/d, ny=dy/d, vn=coin.vx*nx+coin.vy*ny;
    if(vn<0){ coin.vx-=2*vn*nx;
    coin.vy-=2*vn*ny; } coin.x=cx+nx*R;
    coin.y=cy+ny*R; var _pv=f.spin*(t*f.len)*4;
    if(_pv>3.2)_pv=3.2; else if(_pv<-3.2)_pv=-3.2;
    coin.vx+=-Math.sin(f.ang)*_pv;
    coin.vy+=Math.cos(f.ang)*_pv;
    f.flash=1; try{ spawnSparks(cx,cy,'#8fe0ff',7);
    }catch(e){} try{ if(typeof haptic==='function') haptic([0,
    16,14,22]); }catch(e){} try{ if(!muted){ if(typeof sfxWall==='function') sfxWall();
    else if(typeof sfxCurl==='function') sfxCurl();
    } }catch(e){} break; } } }
    function royBumperStep(){ if(!royBumpers.length||!moving||scoring) return;
    if((typeof ghosting!=='undefined'&&ghosting)||(typeof TAC!=='undefined'&&TAC&&TAC.ghost&&typeof ghostUsed!=='undefined'&&!ghostUsed)) return;
    for(var _b=0;_b<royBumpers.length;_b++){ var p=royBumpers[_b];
    var dx=coin.x-p.x, dy=coin.y-p.y, d=Math.hypot(dx,dy), R=p.r+COIN_R;
    if(d<R && d>0.001){ var nx=dx/d, ny=dy/d, vn=coin.vx*nx+coin.vy*ny;
    if(vn<0){ coin.vx-=2*vn*nx;
    coin.vy-=2*vn*ny; } coin.x=p.x+nx*R;
    coin.y=p.y+ny*R; var _lvl=(typeof royaleLevel!=='undefined'?royaleLevel:'med');
    var _kick=(_lvl==='hard')?2.6:(_lvl==='med'?2.1:1.7);
    coin.vx+=nx*_kick; coin.vy+=ny*_kick;
    p.flash=1; try{ spawnSparks(p.x+nx*p.r,p.y+ny*p.r,'#ffe066',8);
    }catch(e){} try{ if(typeof haptic==='function') haptic([0,
    14,16,20]); }catch(e){} try{ if(!muted){ if(typeof sfxWall==='function') sfxWall();
    else if(typeof sfxCurl==='function') sfxCurl();
    } }catch(e){} break; } } }
    function drawOrbits(now){ if(!royOrbits.length) return;
    ctx.save(); ctx.lineCap='round';
    for(var _o=0;_o<royOrbits.length;_o++){ var o=royOrbits[_o];
    ctx.globalAlpha=1; ctx.strokeStyle='rgba(90,170,235,0.22)';
    ctx.lineWidth=o.w*2; ctx.beginPath();
    ctx.moveTo(o.ax,o.ay); ctx.lineTo(o.bx,o.by);
    ctx.stroke(); ctx.strokeStyle='rgba(150,220,255,0.45)';
    ctx.lineWidth=1.4; ctx.setLineDash([4,
    4]); ctx.beginPath(); ctx.moveTo(o.ax,o.ay);
    ctx.lineTo(o.bx,o.by); ctx.stroke();
    ctx.setLineDash([]); var len=Math.hypot(o.bx-o.ax,o.by-o.ay), ux=o.ux, uy=o.uy, px=-uy, py=ux, _ph=(now*0.05)%16;
    for(var s=-16;s<len;s+=16){ var pos=s+_ph;
    if(pos<3||pos>len-3) continue;
    var mx=o.ax+ux*pos, my=o.ay+uy*pos;
    ctx.strokeStyle='rgba(190,240,255,0.95)';
    ctx.lineWidth=2; ctx.beginPath();
    ctx.moveTo(mx-ux*3+px*3,my-uy*3+py*3);
    ctx.lineTo(mx,my); ctx.lineTo(mx-ux*3-px*3,my-uy*3-py*3);
    ctx.stroke(); } } ctx.restore();
    }
    function drawFlippers(now){ if(!royFlippers.length) return;
    ctx.save(); ctx.lineCap='round';
    for(var _f=0;_f<royFlippers.length;_f++){ var f=royFlippers[_f], tx=f.px+Math.cos(f.ang)*f.len, ty=f.py+Math.sin(f.ang)*f.len;
    ctx.globalAlpha=0.25; ctx.strokeStyle='#000';
    ctx.lineWidth=(f.w+2)*2;
    ctx.beginPath(); ctx.moveTo(f.px,f.py+1.5);
    ctx.lineTo(tx,ty+1.5); ctx.stroke();
    ctx.globalAlpha=1; ctx.strokeStyle=f.flash>0.02?'#ffffff':'#d84a6a';
    ctx.lineWidth=f.w*2; ctx.beginPath();
    ctx.moveTo(f.px,f.py); ctx.lineTo(tx,ty);
    ctx.stroke(); ctx.strokeStyle='rgba(255,255,255,0.5)';
    ctx.lineWidth=1.4; ctx.beginPath();
    ctx.moveTo(f.px,f.py); ctx.lineTo(tx,ty);
    ctx.stroke(); ctx.fillStyle='#2a2030';
    ctx.beginPath(); ctx.arc(f.px,f.py,f.w+2,0,6.283);
    ctx.fill(); ctx.fillStyle='#ffd84a';
    ctx.beginPath(); ctx.arc(f.px,f.py,f.w-0.5,0,6.283);
    ctx.fill(); } ctx.restore();
    }
    function drawBumpers(now){ if(!royBumpers.length) return;
    ctx.save(); for(var _b=0;_b<royBumpers.length;_b++){ var p=royBumpers[_b], r=p.r;
    if(p.flash>0){ p.flash-=0.08;
    if(p.flash<0)p.flash=0; } var _lit=p.flash;
    ctx.globalAlpha=0.28; ctx.fillStyle='#000';
    ctx.beginPath(); ctx.ellipse(p.x,p.y+r*0.55,r*0.95,r*0.4,0,0,6.283);
    ctx.fill(); ctx.globalAlpha=1;
    ctx.fillStyle='#1c2028';
    ctx.beginPath(); ctx.arc(p.x,p.y,r+1.5,0,6.283);
    ctx.fill(); ctx.fillStyle=p.hue;
    ctx.beginPath(); ctx.arc(p.x,p.y,r,0,6.283);
    ctx.fill(); ctx.globalAlpha=0.55;
    ctx.fillStyle='#ffffff';
    ctx.beginPath(); ctx.arc(p.x-r*0.28,p.y-r*0.30,r*0.5,0,6.283);
    ctx.fill(); ctx.globalAlpha=1;
    ctx.fillStyle=_lit>0.02?'#ffffff':'#ffe9a8';
    ctx.beginPath(); ctx.arc(p.x,p.y,r*0.4,0,6.283);
    ctx.fill(); if(_lit>0.02){ ctx.globalAlpha=_lit*0.8;
    ctx.strokeStyle='#fff6c0';
    ctx.lineWidth=2+_lit*2; ctx.beginPath();
    ctx.arc(p.x,p.y,r+(1-_lit)*10,0,6.283);
    ctx.stroke(); ctx.globalAlpha=1;
    } } ctx.restore(); }
    // Blizzard (hard ice): a crosswind that pulses calm->gust->calm; you time your flick for the calm window.
    function royBlizzard(){ return (typeof royaleArena!=='undefined'&&royaleArena&&royaleArena.floor==='ice'&&typeof royaleLevel!=='undefined'&&royaleLevel==='hard')||_g1('blizzard'); }
    // Foreground blizzard snow drawn ON TOP of the pitch so the sideways gust is clearly visible.
    // shaped gust: 0 for most of the cycle (rare), a brief eased pulse when it kicks up.
    function royGust(){ if(!royBlizzard()) return 0; var _r=Math.sin(royGustPhase); return _r>0.82?Math.pow((_r-0.82)/0.18,1.3):0; }
    // foreground snow — the original visible look: soft round flakes with a dark navy
    // halo so they read against the ice. Snow drifts down gently at all times and only
    // streaks sideways when a (rare) gust blows. No indicator/arrow.
    function drawFrost(now){ if(!_g1('slippery')) return;
    ctx.save(); ctx.beginPath();
    ctx.rect(WALL,WALL,W-WALL*2,H-WALL*2);
    ctx.clip(); ctx.fillStyle='rgba(200,225,255,0.06)';
    ctx.fillRect(WALL,WALL,W-WALL*2,H-WALL*2);
    for(var i=0;i<26;i++){ var hx=Math.sin(i*12.9)*9999,hs=hx-Math.floor(hx);
    var hy=Math.sin(i*41.7)*5555,ho=hy-Math.floor(hy);
    var tw=0.4+0.6*Math.abs(Math.sin(now*0.003+i*1.7));
    var fx=WALL+hs*(W-WALL*2), fy=WALL+((ho*(H-WALL*2))+now*0.012)%(H-WALL*2);
    ctx.fillStyle='rgba(236,246,255,'+(tw*0.5).toFixed(2)+')';
    ctx.fillRect(fx|0,fy|0,1,1);
    if(i%4===0){ ctx.fillRect((fx|0)-1,fy|0,1,1);
    ctx.fillRect(fx|0,(fy|0)-1,1,1);
    } } ctx.restore(); }
    function drawBlizzard(now){ if(!royBlizzard()) return;
    var _s=royGust(), wx=Math.cos(royGustDir), wy=Math.sin(royGustDir);
    if(!roySnow.length){ for(var _i=0;_i<70;_i++) roySnow.push({x:Math.random()*W,y:Math.random()*H,z:0.7+Math.random()*1.2});
    } ctx.save(); for(var _i=0;_i<roySnow.length;_i++){ var p=roySnow[_i];
    var gspd=_s*6*p.z; p.x+=wx*gspd+Math.sin(now*0.003+p.z*3)*0.15;
    p.y+=wy*gspd+0.5*p.z; if(p.x<-4)p.x=W+4;
    else if(p.x>W+4)p.x=-4; if(p.y<-4)p.y=H+4;
    else if(p.y>H+4)p.y=-4; var r=p.z*(0.55+_s*0.3);
    ctx.globalAlpha=0.1+_s*0.18;
    ctx.fillStyle='#3f5a74';
    ctx.beginPath(); ctx.arc(p.x,p.y,r+0.8,0,6.283);
    ctx.fill(); ctx.globalAlpha=0.62+_s*0.3;
    ctx.fillStyle='#f2f8ff';
    ctx.beginPath(); ctx.arc(p.x,p.y,r,0,6.283);
    ctx.fill(); } ctx.restore();
    }
    // STORM (THUNDERDOME) — additive weather: easy crosswind gusts / med +hydroplane puddles / hard +lightning.
    // Gusts blow in intermittent bursts from a random direction (telegraphed by the slanting rain),
    // then go calm. stormWindStr (0..1) drives both the push and the rain-slant visual.
    var stormWindAng=1.7, stormGust=null, stormGustCD=180, stormWindStr=0, puddleDrops=[];
    // kick up a little spray of water droplets (arc out + fall) when the ball hits a puddle
    function splashPuddle(x,y,n,strong){ try{ if(typeof sfxSplash==='function') sfxSplash();
    }catch(e){} for(var i=0;i<n;i++){ var a=Math.random()*Math.PI*2, s=(strong?1.1:0.5)+Math.random()*(strong?1.7:0.9);
    puddleDrops.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-(strong?1.5:0.8),life:11+Math.random()*9,max:20,r:1.0+Math.random()*(strong?1.6:1.0)});
    } }
    // CANDY (SUGAR RUSH) — additive: easy jelly pads (launch over players) / med +caramel bog / hard +gumballs.
    // candyPatches = jelly trampoline pads (launch the ball airborne so it hops over players); candyBog = sticky caramel.
    var candyPatches=[], candyBog=[], gumCD=0;
    function initCandy(){ candyPatches=[];
    candyBog=[]; gumballs=[];
    var t=hzTier(); var occ=[];
    try{ for(var i=0;i<nails.length;i++) occ.push({x:nails[i].x,y:nails[i].y,r:NAIL_R});
    }catch(e){} try{ if(coin) occ.push({x:coin.x,y:coin.y,r:COIN_R});
    }catch(e){} var xs=[0.24,
    0.4,0.56,0.72], ys=[0.28,
    0.42,0.56,0.7], cands=[];
    for(var xi=0;xi<xs.length;xi++){ for(var yi=0;yi<ys.length;yi++){ cands.push([WALL+xs[xi]*(W-WALL*2),
    WALL+ys[yi]*(H-WALL*2)]);
    } } for(var s=cands.length-1;s>0;s--){ var j=Math.floor(Math.random()*(s+1)),tm=cands[s];
    cands[s]=cands[j];cands[j]=tm;
    } function place(n,r){ var got=[];
    for(var c=0;c<cands.length&&got.length<n;c++){ var x=cands[c][0],y=cands[c][1];
    if(y<NET_DEPTH+GOAL_AREA_D+r||y>H-NET_DEPTH-GOAL_AREA_D-r) continue;
    var ok=true; for(var k=0;k<occ.length;k++){ if(Math.hypot(x-occ[k].x,y-occ[k].y)<r+occ[k].r+6){ ok=false;
    break; } } if(!ok) continue;
    got.push({x:x,y:y,r:r});
    occ.push({x:x,y:y,r:r});
    } return got; } candyPatches=place(3, 12);
    if(t>=1) candyBog=place(3, 12);
    if(t>=2){ var gbdefs=place(3, 7), cols=['#ff5a8a',
    '#5ad0ff','#ffc21e','#5ae08a',
    '#c86aff']; for(var g=0;g<gbdefs.length;g++){ var a=Math.random()*6.283, sp=0.5+Math.random()*0.15;
    gumballs.push({x:gbdefs[g].x,y:gbdefs[g].y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:6,col:cols[g%5]});
    } } }
    // BASEBALL (THE DIAMOND, Season 3) — ADDITIVE by difficulty, NO power/speed scaling:
    //   EASY: one bat at each home plate (mirrored). It RESTS and only swings when a ball enters its
    //         zone. The swing is the SAME speed at every difficulty and the barrel sweeps its arc, so
    //         a hard flick blows past before the barrel arrives — a "strike". A connect launches the
    //         ball toward that bat's OPPOSITE goal at a fixed power.
    //   MED : + a pitching machine firing a stray ball in from a random side / diagonal.
    //   HARD: + ONE catcher's glove on the pitcher's mound, which claims only a ball that has already
    //         slowed below BB_CATCH_MAX — a live shot blows straight through it.
    // Every effect only touches a MOVING ball, so the ball still settles and turns end.
    var bbBats=[], bbPitchBalls=[], bbPitchCD=0, bbPitchOn=false, bbGloves=[], bbGlovesOn=false;
    var BB_RZ=40, BB_SWING=14, BB_ARC=Math.PI, BB_POWER=5.6, BB_REACH=27, BB_BARREL=12;
    // A glove only claims a ball that is already dying. A real shot beats it, so the hazard reads as
    // "do not leave it short through the middle" — a skill test, not a random confiscation.
    var BB_CATCH_MAX=3.2;   /* a ball still rolling this slowly through the mound is claimed; a live shot blows through */
    function initBaseball(){ var t=hzTier();
    // one bat guards each goal: a ball rolling close gets cleared toward the FAR goal, unless a hard
    // flick strikes past the swing. Top bat clears downfield, bottom bat clears upfield.
    // The bat stands AT home plate, which the board art draws NET_DEPTH+32 out from each goal —
    // it used to float at H*0.20 / H*0.80, matching nothing on the pitch, which is why the swing
    // read as random. Now it is the last line in front of the keeper: a soft shot gets cleared,
    // a hard flick strikes past it.
    var _hp=NET_DEPTH+32;
    // isTop picks which half the 180-degree sweep arcs through: the top bat sweeps across its
    // downfield side, the bottom bat across its upfield side, so each always swings out over the
    // pitch and never back into its own net.
    bbBats=[{x:W/2,y:_hp,rest:-1.03,tgt:H,isTop:1,swing:false,swT:0,cd:0,start:0,dir:1},
    {x:W/2,y:H-_hp,rest:2.11,tgt:0,isTop:0,swing:false,swT:0,cd:0,start:0,dir:1}];
    bbPitchOn=(t>=1); bbGlovesOn=(t>=2);
    bbPitchBalls=[]; bbPitchCD=90; bbGloves=[];
    // ONE glove, on the pitcher's mound. Four of them — sat at coordinates matching no drawn base —
    // turned midfield into four ball-traps that ate any shot passing through. It starts disarmed so
    // the kickoff ball, which sits inside it, has to leave once before it can ever be claimed.
    if(bbGlovesOn) bbGloves.push({x:W/2,y:H/2,r:13,flash:0,armed:false,caught:false,catchT:0,openT:0});
    }
    // BASKETBALL (THE HARDWOOD, Season 3) — ADDITIVE by difficulty, no power/speed scaling:
    //   EASY: the ball DRIBBLES — while it is running through midcourt it hops on a fixed beat, and on
    //         the up-beat it sails clean over outfield players. The hop is confined to midcourt ON
    //         PURPOSE: going airborne skips every nail collision including the GOALIE (see collideStep),
    //         so letting it hop near the goals would let shots float past the keeper at random.
    //   MED : + backboards angled beside each goal — bank a shot off one and it deflects goalwards.
    //   HARD: + a shot clock; the longer one possession runs, the more the ball is hurried along.
    var bkOn=false, bkBoards=[], bkBoardFlash=0, bkTramps=[], bkTrampOn=false;
    var bkRims=[], bkRimOn=false, bkRimPass={red:false,blue:false}, bkNoBasket=0, bkLastScore=-1;
    var bkPrev={x:0,y:0};
    /* BK_RIM_HALF: the hoop's half-gap. The ball is COIN_R=5 across the middle, so 8 gives a 16px
       mouth — a bit over 1.5 balls wide. Coin-tight would be a luck check once anything deflects. */
    var BK_BOARD_R=4, BK_TRAMP_R=11, BK_HOP=16, BK_RIM_HALF=8, BK_POST_R=2.4;
    // pick a spot that does not sit on a player, the ball, or another prop
    function _bkFree(x,y,r,extra){ try{ for(var i=0;i<nails.length;i++){ if(Math.hypot(x-nails[i].x,y-nails[i].y)<r+NAIL_R+7) return false; }
    }catch(e){} try{ if(coin&&Math.hypot(x-coin.x,y-coin.y)<r+COIN_R+9) return false; }catch(e){}
    for(var b=0;b<bkBoards.length;b++){ var _b=bkBoards[b];
    if(Math.hypot(x-(_b.x1+_b.x2)/2,y-(_b.y1+_b.y2)/2)<r+16) return false; }
    for(var t=0;t<bkTramps.length;t++){ if(Math.hypot(x-bkTramps[t].x,y-bkTramps[t].y)<r+BK_TRAMP_R+8) return false; }
    for(var m=0;m<bkRims.length;m++){ if(Math.hypot(x-bkRims[m].x,y-bkRims[m].y)<r+BK_RIM_HALF+12) return false; }
    if(extra) for(var e=0;e<extra.length;e++){ if(Math.hypot(x-extra[e].x,y-extra[e].y)<r+extra[e].r) return false; }
    return true; }
    // HARD rims: THREE fixed hoops — left, centre and right — set across each penalty area, mouths
    // facing that goal. A shot only counts if it went through one of them (see bkGoalDenied). They sit
    // at fixed, mirrored spots rather than being re-thrown each goal: you learn the three lanes and
    // pick one, and the layout stays symmetric for both teams.
    // The three hoops stand ON the penalty-area border — the line the box closes with, furthest from
    // goal — spread across its width. Each still FACES the goal centre, so the two wing hoops are
    // angled diagonally while the centre one squares up.
    function bkSpawnRims(){ bkRims=[];
    if(!bkRimOn) return;
    var ends=[{team:'red',gy:NET_DEPTH,box:goalAreaRect('blue'),into:1},
    {team:'blue',gy:H-NET_DEPTH,box:goalAreaRect('red'),into:-1}];
    for(var e=0;e<ends.length;e++){ var en=ends[e], gx=W/2, gy=en.gy;
    var by=gy+GOAL_AREA_D*en.into;              // the border line of the box
    for(var s=0;s<3;s++){ var px=en.box.x+en.box.w*(0.2+0.3*s), py=by;
    var fx=gx-px, fy=gy-py, fl=Math.hypot(fx,fy)||1;
    bkRims.push({x:px,y:py,fx:fx/fl,fy:fy/fl,half:BK_RIM_HALF,for:en.team,flash:0}); } } }
    // the hoop the AI should shoot through: the one closest to its natural line at goal
    // One predicate per borrowed arena, so SPORTS DAY can switch its hazards on without every call site knowing.
    function cgArena(){ return (typeof boardKey!=='undefined')&&(boardKey==='minigolf'||_pd('water')||_pd('cups'))&&(typeof stadiumHazards==='function')&&stadiumHazards(); }
    function bkArena(){ return (typeof boardKey!=='undefined')&&(boardKey==='court'||_pd('hoops'))&&(typeof stadiumHazards==='function')&&stadiumHazards(); }
    function tnArena(){ return (typeof boardKey!=='undefined')&&(boardKey==='tennis'||_pd('net'))&&(typeof stadiumHazards==='function')&&stadiumHazards(); }
    function bkAimTarget(team){ if(!(bkArena()&&bkRimOn)) return null;
    if(!bkRims.length){ try{ initCourt(); }catch(e){} }
    var gy=(team==='red')?NET_DEPTH:(H-NET_DEPTH), gx=W/2;
    var vx=gx-coin.x, vy=gy-coin.y, vl=Math.hypot(vx,vy)||1; vx/=vl; vy/=vl;
    var best=null, bestD=1e9;
    for(var i=0;i<bkRims.length;i++){ var r=bkRims[i]; if(r.for!==team) continue;
    var dx=r.x-coin.x, dy=r.y-coin.y, along=dx*vx+dy*vy;
    if(along<=2) continue;                                    // must be ahead of the ball
    var perp=Math.abs(dx*(-vy)+dy*vx);                        // how far off the natural line it sits
    if(perp<bestD){ bestD=perp; best=r; } }
    return best; }
    function initCourt(){ var t=hzTier();
    // On SPORTS DAY only the hoops are borrowed — no backboards, no trampolines.
    var _pH=_pd('hoops');
    bkOn=true; bkTrampOn=_pH?false:(t>=1); bkRimOn=_pH?true:(t>=2);
    bkBoards=[]; bkTramps=[]; bkRims=[];
    bkRimPass={red:false,blue:false}; bkNoBasket=0;
    var gL=Math.round((W-GOAL_W)/2), gR=Math.round((W+GOAL_W)/2), _o=13, _d=17;
    // EASY backboards: one angled board outside each post, canted to turn a bank shot goalwards
    if(!_pH){ bkBoards.push({x1:gL-_o,y1:NET_DEPTH+2,x2:gL-_o-_d,y2:NET_DEPTH+2+_d});
    bkBoards.push({x1:gR+_o,y1:NET_DEPTH+2,x2:gR+_o+_d,y2:NET_DEPTH+2+_d});
    bkBoards.push({x1:gL-_o,y1:H-NET_DEPTH-2,x2:gL-_o-_d,y2:H-NET_DEPTH-2-_d});
    bkBoards.push({x1:gR+_o,y1:H-NET_DEPTH-2,x2:gR+_o+_d,y2:H-NET_DEPTH-2-_d}); }
    if(bkTrampOn){ for(var n=0;n<3;n++){ for(var tryN=0;tryN<70;tryN++){
    var ty=NET_DEPTH+GOAL_AREA_D+18+Math.random()*(H-2*(NET_DEPTH+GOAL_AREA_D)-36);
    var tx=WALL+20+Math.random()*(W-WALL*2-40);
    if(_bkFree(tx,ty,BK_TRAMP_R)){ bkTramps.push({x:tx,y:ty,r:BK_TRAMP_R,flash:0}); break; } } } }
    bkSpawnRims(); }
    // TENNIS (CENTRE COURT, Season 3) — ADDITIVE by difficulty:
    //   EASY: the NET across midfield plus the RACKETS. The net is solid to anything on the ground,
    //         however hard it is struck. The only ways across are in the air — run onto a racket and
    //         be lobbed over, or Chip — or round the open lanes at either end of the net.
    //   MED : the rackets FLIP on a loop — green lobs you over, red swats you back. Phases are
    //         staggered so there is nearly always a live one, and an amber tell precedes each flip.
    //   HARD: + sliding gates that shut BOTH side lanes on a loop, extending from each net post out
    //         to the wall. While they are out the ground is shut completely and the only ways across
    //         are a racket lob or Chip.
    var tnOn=false, tnNetFlash=0, tnPrevY=0, tnRackets=[], tnFlipOn=false, tnDoors=[], tnDoorOn=false, tnT=0;
    var TN_RACK_R=11, TN_RACK_AIR=24, TN_RACK_MAX=4.0;
    var TN_FLIP=170, TN_GREEN=105;
    // sliding gates that shut the side lanes: open hold -> slide out -> closed hold -> slide back.
    var TN_DOOR=210, TN_D_OPEN=70, TN_D_SLIDE=25, TN_D_SHUT=90;
    function tnDoorExt(d){ if(!tnDoorOn) return 0;
    var p=(tnT+d.off)%TN_DOOR;
    if(p<TN_D_OPEN) return 0;
    p-=TN_D_OPEN; if(p<TN_D_SLIDE) return p/TN_D_SLIDE;
    p-=TN_D_SLIDE; if(p<TN_D_SHUT) return 1;
    p-=TN_D_SHUT; return Math.max(0,1-p/TN_D_SLIDE); }
    // a racket is live (green, lobs you over) for most of its cycle and dead (red, swats you back)
    // for the rest. Phases are staggered so there is almost always a live one to run onto.
    function tnRackLive(r){ return !tnFlipOn || (((tnT+r.off)%TN_FLIP)<TN_GREEN); }
    function tnRackWarn(r){ if(!tnFlipOn) return false; var p=(tnT+r.off)%TN_FLIP;
    return p<TN_GREEN && p>TN_GREEN-26; }   /* amber tell just before it goes red */
    // The net spans exactly the blue court and its posts stand on the sidelines, so the open lane
    // round each end is the green apron outside the court. A function (not a var) because the board
    // art in 03-boards.js calls it while painting, which happens before this file's vars are assigned.
    // The apron is 22px so the lane leaves roughly a 12px window for a 10px ball — threadable with a
    // curve or a placed flick, not free. At the original 14px it was a 4px window: effectively shut.
    function tnApron(){ return 22; }
    function tnNetX0(){ return WALL+tnApron(); }
    function tnNetX1(){ return W-WALL-tnApron(); }
    function initTennis(){ var t=hzTier();
    tnOn=true; tnNetFlash=0; tnT=0; tnPrevY=(typeof coin!=='undefined'&&coin)?coin.y:H/2;
    // On SPORTS DAY only the net + rackets are borrowed — the red-racket flip and the sliding gates stay home.
    var _pN=_pd('net');
    tnFlipOn=_pN?false:(t>=1); tnDoorOn=_pN?false:(t>=2);
    // rackets: two per half, sitting just short of the net so you can run onto one and be lobbed over
    tnRackets=[]; var n=0; for(var s=-1;s<=1;s+=2){ for(var i=0;i<2;i++){
    tnRackets.push({x:W*(i?0.68:0.32),y:H/2+s*34,r:TN_RACK_R,flash:0,ang:(i?-0.6:0.6)*s,off:n*Math.round(TN_FLIP/4)});
    n++; } }
    // sliding gates, one per side lane, extending from the net post out to the wall
    // Both gates share a phase so they seal TOGETHER. Antiphase was tried first and it guaranteed
    // one lane was always open, which read as "the gates do nothing" — you could just switch sides.
    // In phase there are real windows where the ground is shut and the only ways over are a racket
    // lob or Chip, which is the point of the tier.
    tnDoors=[]; if(tnDoorOn){ tnDoors.push({side:-1,off:0,flash:0});
    tnDoors.push({side:1,off:0,flash:0}); }
    }
    // ball-kids shuffle along their line from the draw loop so they move between shots
    function tennisTick(){ if(!(tnArena())) return;
    if(!tnOn){ try{ initTennis(); }catch(e){} }
    if(tnNetFlash>0) tnNetFlash--;
    tnT++;
    for(var r=0;r<tnRackets.length;r++){ if(tnRackets[r].flash>0) tnRackets[r].flash--; }
    for(var v=0;v<tnDoors.length;v++){ if(tnDoors[v].flash>0) tnDoors[v].flash--; } }
    // the x range a gate currently covers, or null when it is open
    function tnDoorSpan(d){ var e=tnDoorExt(d); if(e<=0.02) return null;
    var lane=tnApron();
    if(d.side<0){ var p0=tnNetX0(); return {x0:p0-e*lane,x1:p0}; }
    var p1=tnNetX1(); return {x0:p1,x1:p1+e*lane}; }
    // Does the net (or a closed gate) block a ground crossing at this x? Used by the AI so it can
    // tell "must go over" from "there is a lane open".
    function tnBlocksAt(x){ if(!(tnArena())) return false;
    if(!tnOn){ try{ initTennis(); }catch(e){} }
    if(x>tnNetX0()&&x<tnNetX1()) return true;
    for(var i=0;i<tnDoors.length;i++){ var sp=tnDoorSpan(tnDoors[i]);
    if(sp&&x>sp.x0-COIN_R*0.4&&x<sp.x1+COIN_R*0.4) return true; }
    return false; }
    // Where should the CPU aim on CENTRE COURT? Returns a waypoint, or null to just shoot at goal.
    //   - has Chip        -> null (shoot at goal; aiMaybeChip lifts it over the net in flight)
    //   - a lane is open  -> hug that lane, so a curve/banana can bend round the net
    //   - else a live racket that is roughly on the way -> run onto it and get lobbed over
    function tnAimPlan(team){ if(!(tnArena())) return null;
    if(!tnOn){ try{ initTennis(); }catch(e){} }
    var ny=H/2, gy=(team==='red')?NET_DEPTH:(H-NET_DEPTH);
    var mustCross=((coin.y-ny)*(gy-ny)<0);      // ball and target goal on opposite sides of the net
    if(!mustCross) return null;
    var ab=(typeof sideAb!=='undefined'&&sideAb[team])?sideAb[team]:[];
    if(ab.indexOf('chip')>=0&&(typeof chipUsed==='undefined'||!chipUsed)) return null;
    var lanes=[{x:(WALL+tnNetX0())/2},{x:(tnNetX1()+W-WALL)/2}];
    // sample across the ball's width, not just its centre: mid-slide a shutter can already overlap
    // the edge of the ball while the centre line still looks clear
    var openLanes=[]; for(var l=0;l<lanes.length;l++){ var lx=lanes[l].x;
    if(!tnBlocksAt(lx)&&!tnBlocksAt(lx-COIN_R)&&!tnBlocksAt(lx+COIN_R)) openLanes.push(lanes[l]); }
    if(openLanes.length){ openLanes.sort(function(a,b){ return Math.abs(a.x-coin.x)-Math.abs(b.x-coin.x); });
    return {x:openLanes[0].x,y:gy,kind:'lane'}; }
    var best=null,bd=1e9;
    for(var r=0;r<tnRackets.length;r++){ var rk=tnRackets[r];
    if(!tnRackLive(rk)) continue;
    if((rk.y-ny)*(coin.y-ny)<=0) continue;      // must be on the ball's own side of the net
    var d=Math.hypot(rk.x-coin.x,rk.y-coin.y);
    if(d<bd){ bd=d; best=rk; } }
    if(best) return {x:best.x,y:best.y,kind:'racket'};
    return null; }
    // CRAZY GOLF (Season 3) — FOOTGOLF: a golf hole whose cup is a goal.
    //
    // This is the fourth design for arena 4 and the first that is not a pile of props. The three that
    // failed all made the same mistake in different costumes — a row of obstacles ACROSS midfield (a
    // fence, something to survive), a cup that punished ordinary play, and springy bank rails (which
    // measured perfectly and were still wrong, because a deflector puts the ball where the GEOMETRY
    // chose rather than where the PLAYER chose). What none of them had was a SHAPE.
    //
    // A golf hole is not obstacles scattered on a fairway. It is a shape: hazards placed so the direct
    // line is dead, leaving routes that curve. The skill is choosing a line, not surviving a barrier —
    // and crucially the hazards are landmarks you steer BY, not things that push you around. So:
    //   WATER  — your shot dies at the bank. Never redirects, never teleports you: it just ends there,
    //            and it is a big obvious blue thing you had every chance to avoid. Sits dead centre of
    //            each approach, which is what kills the straight line to goal.
    //   SAND   — extra drag, not a wall. A firm strike ploughs through and a chip flies over, while a
    //            soft one dies in it. So the bunker is a SHORTCUT you can buy with power.
    //   TREES  — a tree kills the ball. No bounce, no deflection: golf's oldest joke is that a tree is
    //            90% air and you always hit it. One guards each goal so the last shot has to come from
    //            an angle rather than straight down the middle.
    //   CUPS   — hole out for one more flick (hard). The two flank routes end at them, so running the
    //            long way round pays.
    // Every one of these only ever REMOVES energy, so none of them can stop the ball settling and the
    // turn ending — the invariant that every earlier arena needed special-casing to keep.
    //
    // The layout is 180-degree ROTATIONALLY symmetric, not mirrored: rotating the top half about the
    // centre spot gives the bottom half, so both sides face the identical hole with water on the same
    // hand. A reflection would have handed one side the easier approach.
    var cgOn=false, cgT=0, cgWater=[], cgSand=[], cgTrees=[], cgCups=[];
    var cgCupOn=false, cgSplash=0, cgSplashX=0, cgSplashY=0, cgHoled=null, cgBonus=false;
    // Water drown sequence: the ball sinks where it went in, then is dropped back onto the grass shore for
    // the next flick. Deliberately unhurried (SINK then DROP frames) so it reads as real water physics
    // rather than the ball being snapped to the bank. null = idle; while set, stepPhysics only ticks it.
    var cgDrown=null, CG_DROWN_SINK=50, CG_DROWN_DROP=34;
    // Hole-out reward: stamina is REFRESHED to 100% at the hole, then decreases again with each following
    // flick — it does NOT stay pinned at 100% for the rest of the turn. cgStamBase records the flick count
    // at the hole so staminaMul counts stamina forward from there. The hole-out still COUNTS as a flick
    // (the tally keeps ticking down) and keeps the turn. Reset to 0 when the turn passes.
    var cgStamBase=0;
    var cgPrevX=0, cgPrevY=0;   // last frame's ball position, so a splash can be traced to the shore crossed
    /* THE SHAPE, in board units (W=210, H=330). Everything is placed for the TOP half and rotated.
       The two flank lanes are what makes this a hole rather than a wall, so their width is the number
       that matters: WALL(12) to the pond's left edge is 29px, and the bunker's right edge to the far
       wall is 32px. A ball is 10px across, so that is an 19-22px window for its centre — wider than
       CENTRE COURT's side lanes, which play fine. */
    /* SMALLER AND SYMMETRIC. The first layout put a big pond on one flank and a bunker on the other, then
       ROTATED it 180 for the far half — so the dark rough sat left-of-centre up top and right-of-centre
       below, and the whole pitch read as skewed even though it was perfectly centred (confirmed with
       ?nohz=1: the bare pitch is square). The hole is now built SYMMETRIC about the centre line: a single
       central pond per half, a matched pair of flank bunkers, and a tree pair either side of the goal.
       Everything is smaller too. Because each piece is symmetric about W/2, the 180 rotation to the far
       half is identical to a vertical mirror, so the pitch is balanced on BOTH axes. */
    /* PLACEMENT: one hazard cluster per half, in the middle of that half — NOT at midfield. The midfield
       version left the attacking third open (scoreable) but sat right where both teams' formations meet,
       so the peg-clearing squeezed every outfield token into the centre and the setup looked clustered.
       A cluster per half (y=92, mirrored to y=238) keeps midfield clear so the formation spreads normally,
       and keeps the centre spot clear for kickoff. It is closer to the goal than the midfield belt, so the
       attacking approach is tighter — the pond does not cover the goalmouth, so a shot from the side of it
       still scores, but it is a real golf hole again rather than an open midfield. */
    var CG_POND_X=105, CG_POND_Y=92, CG_POND_RX=24, CG_POND_RY=18;   // pond in the middle of each half
    var CG_SAND_DX=57, CG_SAND_Y=100, CG_SAND_RX=13, CG_SAND_RY=11;  // bunkers flanking, just below the pond
    var CG_TREE_DX=46, CG_TREE_Y=88, CG_TREE_R=6;                    // trees at the pond's shoulders
    /* CG_SAND_DRAG. The first value, 0.70, gave a combined factor of 0.689 and a roll of only v*2.21px:
       measured, EVERY strike from 4 to 10 died inside the 40px bunker, so the bunker was not a hazard
       with a price, it was a second pond. At 0.86 the combined factor is 0.846 and the roll is v*5.49,
       which splits the outcomes the way a bunker should:
         - landing in it costs you the shot, and you play OUT of it next turn (escaping the ~20px to the
           lip needs only v>3.6, about a third of a flick — golf-true: you chop out and lose distance);
         - carrying clean through the full 40px needs to enter at v>7.3, i.e. a near-max strike from
           close range. Possible, rare, and worth going for.
       Drag can only ever remove speed, so sand can never stop the ball settling and the turn ending. */
    var CG_SAND_DRAG=0.86, CG_TREE_KILL=0.10;
    /* A cup has no pin in it, so the whole 7px is reachable (the mistake in the cut version was a solid
       post keeping the ball 8px away, forcing the cup wider than the thing it was meant to catch).
       CG_CUP_V keeps it a skill target: a firm putt skips the lip, only a dying ball drops. */
    var CG_CUP=7, CG_CUP_V=2.6;
    /* THE PIN IS SOLID. Requiring the ball to come to REST inside a 7px hole made the cup a lottery: you
       had to stop dead on it, which is not how you hole a putt. A solid flagstick gives you something to
       AIM AT — arrive at the pin softly and it drops, which is exactly the shot a golfer plays. Hit it
       hard instead and the pin kills the ball's pace and it stays out, so power is the wrong answer.
       CG_PIN is deliberately thin (a flagstick is thin) but the ball is COIN_R=5, so contact happens at
       7px — the same size target as the hole itself, just reachable while still moving. */
    var CG_PIN=2, CG_PIN_KILL=0.35;
    /* The payoff for holing out is ONE FULL-POWER FLICK: aim only, the power is given to you. An ordinary
       extra flick was too quiet a reward for a target this small. */
    var cgFullFlick_=false;
    function initMinigolf(){ var t=hzTier();
    // On SPORTS DAY only the borrowed piece exists: the pond on easy, the cups on hard — never golf's full field.
    var _pW=_pd('water'), _pC=_pd('cups'), _pod=(_pW||_pC);
    cgOn=true; cgT=0; cgHoled=null; cgBonus=false; cgSplash=0; cgFullFlick_=false; cgDrown=null; cgStamBase=0;
    cgCupOn=_pod?_pC:(t>=2);
    // rot(p) is the 180-degree rotation about the centre spot: the bottom half IS the top half turned round
    var rot=function(x,y){ return {x:W-x,y:H-y}; };
    cgWater=[]; cgSand=[]; cgTrees=[]; cgCups=[];
    // HAZARD TIERS: the pond is on at EVERY difficulty (easy is just the pond, to learn the routing);
    // bunkers + trees add on MEDIUM (the full hazard field); the cups add on HARD (cgCupOn, below).
    // WATER: a central pond in the midfield belt — EASY and up (and the podium's easy borrow).
    if(!_pod||_pW) cgWater.push({x:CG_POND_X,y:CG_POND_Y,rx:CG_POND_RX,ry:CG_POND_RY,flash:0,pl:cgProfile(),pr:cgProfile()});
    // TREES: a symmetric pair flanking the midfield belt — MEDIUM and up. Never borrowed by the podium.
    if(t>=1&&!_pod){ cgTrees.push({x:CG_POND_X-CG_TREE_DX,y:CG_TREE_Y,r:CG_TREE_R,flash:0});
    cgTrees.push({x:CG_POND_X+CG_TREE_DX,y:CG_TREE_Y,r:CG_TREE_R,flash:0}); }
    // SAND: a matched pair of bunkers flanking the pond — MEDIUM and up. Never borrowed by the podium.
    if(t>=1&&!_pod){ cgSand.push({x:CG_POND_X-CG_SAND_DX,y:CG_SAND_Y,rx:CG_SAND_RX,ry:CG_SAND_RY,pl:cgProfile(),pr:cgProfile()});
    cgSand.push({x:CG_POND_X+CG_SAND_DX,y:CG_SAND_Y,rx:CG_SAND_RX,ry:CG_SAND_RY,pl:cgProfile(),pr:cgProfile()}); }
    // Mirror the whole top-half set to the bottom. Every piece above is symmetric about W/2, so the 180
    // rotation and a vertical mirror give the same result — the pitch ends up balanced on both axes.
    var _wN=cgWater.length, _sN=cgSand.length, _tN=cgTrees.length;
    for(var _wi=0;_wi<_wN;_wi++){ var _w=cgWater[_wi], _rw=rot(_w.x,_w.y);
    cgWater.push({x:_rw.x,y:_rw.y,rx:_w.rx,ry:_w.ry,flash:0,pl:cgProfile(),pr:cgProfile()}); }
    for(var _si=0;_si<_sN;_si++){ var _s=cgSand[_si], _rs=rot(_s.x,_s.y);
    cgSand.push({x:_rs.x,y:_rs.y,rx:_s.rx,ry:_s.ry,pl:cgProfile(),pr:cgProfile()}); }
    for(var _ti=0;_ti<_tN;_ti++){ var _t=cgTrees[_ti], _rt=rot(_t.x,_t.y);
    cgTrees.push({x:_rt.x,y:_rt.y,r:_t.r,flash:0}); }
    // CUPS: the far corners of each attacking third — hole out to play on with refreshed stamina (HARD).
    if(cgCupOn){ for(var c=0;c<2;c++){ var cy=c?(H-NET_DEPTH-27):(NET_DEPTH+27);
    cgCups.push({x:34,y:cy,for:c?'blue':'red',flash:0,armed:true});
    cgCups.push({x:W-34,y:cy,for:c?'blue':'red',flash:0,armed:true}); } } }
    /* IRREGULAR OUTLINES. A perfect ellipse reads as programmer art, and a pond or bunker on a real
       course is a wobbly organic shape. Each hazard therefore carries two edge profiles — one for its
       left side, one for its right — sampled smoothly down its height, and BOTH the collision test and
       the drawing read the same profiles, so the water that is visible is exactly the water that drowns
       you. Profile values are capped at 1.0 so the wobbled shape always sits INSIDE its base ellipse,
       which is what lets the water push-out (which normalises in ellipse space) stay safe. */
    function cgProfile(){ var a=[]; for(var i=0;i<7;i++) a.push(0.84+Math.random()*0.16); a.push(a[0]); return a; }
    function cgEdge(pr,t){ if(!pr||!pr.length) return 1;
    var n=pr.length, u=Math.max(0,Math.min(1,t))*(n-1), i=Math.floor(u), f=u-i;
    var p0=pr[Math.min(i,n-1)], p1=pr[Math.min(i+1,n-1)];
    return p0+(p1-p0)*(f*f*(3-2*f)); }
    // the shape's left and right half-widths at this y, or null when y is outside it
    function cgSpan(e,y){ var ny=(y-e.y)/e.ry; if(ny<-1||ny>1) return null;
    var sq=Math.sqrt(Math.max(0,1-ny*ny)), t=(ny+1)/2;
    return {l:e.rx*sq*cgEdge(e.pl,t), r:e.rx*sq*cgEdge(e.pr,t)}; }
    function cgIn(e,x,y){ var sp=cgSpan(e,y); if(!sp) return false;
    var dx=x-e.x; return (dx<0)?(-dx<=sp.l):(dx<=sp.r); }
    /* Nudge a PLAYER off a hazard. The formation lays pieces out on a grid that knows nothing about this
       board, so pieces were being placed standing in the pond and on the bunkers — which looks broken and
       is unfair on whoever drew that spot. Pushes radially clear of whichever hazard the piece is on and
       re-checks, since shoving a piece out of the water can land it in a bunker. Goalies are left alone:
       the green measures 100% clear, so a keeper on its line is never on a hazard. */
    function cgClearSpot(x,y,rad){ if(!(cgArena())) return null;
    if(!cgOn){ try{ initMinigolf(); }catch(e){} }
    var R=rad||NAIL_R, lists=[cgWater,cgSand];
    for(var pass=0;pass<4;pass++){ var moved=false;
    for(var L=0;L<lists.length;L++){ for(var i=0;i<lists[L].length;i++){ var e=lists[L][i];
    if(!cgIn(e,x,y)) continue;
    var dx=x-e.x, dy=y-e.y, d=Math.hypot(dx,dy);
    if(d<0.001){ dx=1; dy=0; d=1; }
    var k=Math.max(e.rx,e.ry)+R+2;
    x=e.x+(dx/d)*k; y=e.y+(dy/d)*k; moved=true; } }
    for(var t=0;t<cgTrees.length;t++){ var tr=cgTrees[t];
    var tdx=x-tr.x, tdy=y-tr.y, td=Math.hypot(tdx,tdy);
    if(td>=tr.r+R+2) continue;
    if(td<0.001){ tdx=1; tdy=0; td=1; }
    x=tr.x+(tdx/td)*(tr.r+R+2); y=tr.y+(tdy/td)*(tr.r+R+2); moved=true; }
    if(!moved) break; }
    x=Math.max(WALL+R,Math.min(W-WALL-R,x));
    y=Math.max(WALL+R,Math.min(H-WALL-R,y));
    /* Pushing radially is not enough on its own. The pond's right edge is at x=109 and the bunker's left
       edge at x=114, so a peg shoved out of the water lands in the sand, gets shoved back into the water,
       and the loop above just runs out of passes leaving it standing in the pond — which is exactly the
       one peg that survived the first version. So if it is still on a hazard, search outward from where it
       started and take the nearest point that is genuinely clear of everything. */
    if(cgHazardAt(x,y,R)){ var found=null;
    for(var rad=R+3;rad<=70&&!found;rad+=4){ for(var a=0;a<16&&!found;a++){
    var an=a/16*Math.PI*2, tx2=x+Math.cos(an)*rad, ty2=y+Math.sin(an)*rad;
    if(tx2<WALL+R||tx2>W-WALL-R||ty2<WALL+R||ty2>H-WALL-R) continue;
    if(!cgHazardAt(tx2,ty2,R)) found={x:tx2,y:ty2}; } }
    if(found){ x=found.x; y=found.y; } }
    return {x:x,y:y}; }
    // read + spend the free full-power flick, from either flick path (13-input and 09-ai)
    function cgFullFlick(){ return !!(cgFullFlick_&&cgArena()); }
    function cgSpendFullFlick(){ cgFullFlick_=false; }
    function cgHoleOut(cup){ cgHoled=current; coin.x=cup.x; coin.y=cup.y;
    coin.vx=0; coin.vy=0; cup.flash=34;
    try{ if(typeof sfxJackpot==='function') sfxJackpot(); }catch(e){}
    try{ spawnSparks(cup.x,cup.y,current,18,true); }catch(e){}
    try{ shake=Math.max(shake||0,4); }catch(e){} }
    function cgHazardAt(x,y,R){ for(var i=0;i<cgWater.length;i++){ if(cgIn(cgWater[i],x,y)) return true; }
    for(var j=0;j<cgSand.length;j++){ if(cgIn(cgSand[j],x,y)) return true; }
    for(var t=0;t<cgTrees.length;t++){ if(Math.hypot(x-cgTrees[t].x,y-cgTrees[t].y)<cgTrees[t].r+(R||0)+2) return true; }
    return false; }
    function cgSandAt(x,y){ for(var i=0;i<cgSand.length;i++){ if(cgIn(cgSand[i],x,y)) return cgSand[i]; } return null; }
    function cgWaterAt(x,y){ for(var i=0;i<cgWater.length;i++){ if(cgIn(cgWater[i],x,y)) return cgWater[i]; } return null; }
    // a cup is live only for the side attacking that end, so you can never hole out into your own half
    /* Any cup is usable by whoever is playing. It used to be gated to cup.for===current (red owned the top
       cups, blue the bottom), which just made it unclear which holes you could actually sink — and one of
       your two "own" cups sat in your own defensive corner where holing out is nearly useless. Now every
       cup pays whoever holes it, still capped at one hole-out per possession by cgBonus. The 'for' field
       is kept only for the pennant/collar tint. */
    function cgCupLive(cup){ return true; }
    // the two flank lanes: WALL to the pond's edge, and the bunker's edge to the far wall
    function cgLaneX(side){ return (side<0)?((WALL+(CG_POND_X-CG_POND_RX))/2):(W-(WALL+(CG_POND_X-CG_POND_RX))/2); }
    function minigolfTick(){ if(!(cgArena())) return;
    if(!cgOn){ try{ initMinigolf(); }catch(e){} }
    cgT++; if(cgSplash>0) cgSplash--;
    if(!moving&&typeof coin!=='undefined'&&coin){ cgPrevX=coin.x; cgPrevY=coin.y; }
    /* Sweep the pegs off the hazards from HERE, every frame the ball is still. Doing it only inside
       rebuildFormations was not enough: formations are laid out before the arena's board is applied, so
       boardKey was not yet 'minigolf' and cgClearSpot bailed out of its own guard — one peg was still
       measuring as standing in the pond. This runs with the board definitely set and the pegs definitely
       built, and it re-runs after a goal rebuilds the formation. The peg being dragged is skipped so it
       does not fight the player's finger. */
    if(!moving&&typeof nails!=='undefined'&&nails){ for(var ni=0;ni<nails.length;ni++){ var nn=nails[ni];
    if(nn.goalie) continue;
    if(typeof dragNail!=='undefined'&&dragNail===nn) continue;
    if(!cgHazardAt(nn.x,nn.y,NAIL_R)) continue;
    var fix=cgClearSpot(nn.x,nn.y,NAIL_R);
    if(fix){ nn.x=fix.x; nn.y=fix.y; } } }
    for(var i=0;i<cgTrees.length;i++){ if(cgTrees[i].flash>0) cgTrees[i].flash--; }
    for(var w=0;w<cgWater.length;w++){ if(cgWater[w].flash>0) cgWater[w].flash--; }
    for(var c=0;c<cgCups.length;c++){ if(cgCups[c].flash>0) cgCups[c].flash--; }
    /* Re-ARM a cup once the ball is clear of its pin. Without this a HARD shot at the flagstick still went
       in: the pin killed its pace, and the now-slow ball was still touching the pin, so it qualified as a
       soft arrival on the very next frame. Holing requires the ball to have been away from the pin first,
       so a hard hit has to leave and come back softly — which is the whole point of a solid pin. */
    if(typeof coin!=='undefined'&&coin){ for(var ca=0;ca<cgCups.length;ca++){ var cu2=cgCups[ca];
    if(Math.hypot(coin.x-cu2.x,coin.y-cu2.y)>CG_PIN+COIN_R+3) cu2.armed=true; } } }
    /* What the CPU has to learn here. Unlike the arenas built out of props, the hazards are landmarks,
       so there is exactly one real lesson: DO NOT SHOOT INTO THE POND. Left to itself the CPU fires at
       the goal centre every turn, which on this layout is the middle of the water — it would drown its
       own possession over and over and the arena would read as broken rather than hard.
         - if the line to goal crosses water or a tree, aim through the nearer open flank lane instead,
           picking the point on the GOAL LINE whose straight line runs through that lane (aiming at the
           lane itself only earns a short flick that dies in it — learned the hard way on THE LINKS);
         - a live cup within 58px is worth a turn, since it pays an extra flick. That needs a soft putt,
           which is below the CPU's speed floor, so the plan carries soft:true and aiFlick lowers it. */
    // Trace a segment for the hazards that ruin a shot: water (drown) and trees (dead stop) are fatal,
    // and sand (heavy drag) is worth dodging too. Used to reject a blocked line to goal and to confirm a
    // cup is actually reachable before committing a putt to it.
    function cgLineBlocked(x0,y0,x1,y1){ var dx=x1-x0, dy=y1-y0;
    for(var st=1;st<=24;st++){ var px=x0+dx*st/24, py=y0+dy*st/24;
    if(cgWaterAt(px,py)) return true;
    if(cgSandAt(px,py)) return true;
    for(var tr=0;tr<cgTrees.length;tr++){ if(Math.hypot(px-cgTrees[tr].x,py-cgTrees[tr].y)<cgTrees[tr].r+COIN_R) return true; } }
    return false; }
    function cgAimPlan(team){ if(!(cgArena())) return null;
    if(!cgOn){ try{ initMinigolf(); }catch(e){} }
    var gy=(team==='red')?NET_DEPTH:(H-NET_DEPTH);
    // REACH THE HOLE: a live cup within putt range whose line is clear pays a bonus flick, so it is
    // usually the best turn on offer. Commit to it more readily on the harder tiers; any cup counts now
    // (cgCupLive), not just this side's. Skip a cup whose approach crosses water/sand/trees.
    if(cgCupOn){ var bc=null,bd=1e9;
    for(var i=0;i<cgCups.length;i++){ var cu=cgCups[i];
    var d=Math.hypot(cu.x-coin.x,cu.y-coin.y);
    if(d<64&&d>12&&d<bd&&!cgLineBlocked(coin.x,coin.y,cu.x,cu.y)){ bd=d; bc=cu; } }
    var pTake=(aiLevel==='hard')?0.9:(aiLevel==='med'?0.65:0.4);
    if(bc&&Math.random()<pTake) return {x:bc.x,y:bc.y,soft:true,kind:'cup'}; }
    // AVOID WATER/SAND/TREES: if the straight line to goal is clear, shoot it. If it is blocked, route
    // through an open flank lane, aiming at the point on the GOAL LINE whose straight line runs through
    // that lane (aiming at the lane itself only earns a short flick that dies in it).
    if(!cgLineBlocked(coin.x,coin.y,W/2,gy)) return null;
    var mid=(coin.y+gy)/2;
    if(Math.abs(mid-coin.y)<10) return null;
    var lanes=[cgLaneX(-1),cgLaneX(1)];
    lanes.sort(function(a,b){ return Math.abs(a-coin.x)-Math.abs(b-coin.x); });
    var sc=(gy-coin.y)/(mid-coin.y), chosen=null, first=null;
    for(var li=0;li<lanes.length;li++){ var ax=Math.max(WALL+COIN_R,Math.min(W-WALL-COIN_R,coin.x+(lanes[li]-coin.x)*sc));
    if(first===null) first=ax;
    if(!cgLineBlocked(coin.x,coin.y,ax,gy)){ chosen=ax; break; } }
    return {x:(chosen!==null?chosen:first),y:gy,soft:false,kind:'lane'}; }
    // ================= THE END ZONE (gridiron) =================
    // ROAMING DEFENCE — the tokens themselves. When a shot goes live, the DEFENDING side's nearest N outfield
    // tokens break formation and PATROL left<->right in their lanes, bouncing off the walls and off any token
    // they meet. When a moving ball comes close to one inside a defensive third, that token CLEARS it back
    // toward midfield. When the ball settles they jog back to the spots they were placed on. No new sprites —
    // the real player nails do it. Settle-safe: they only patrol/clear on a moving ball, the clear sends it
    // out of the third, and while jogging home they never enter a resting ball's space, so the turn ends.
    // Tiers: easy 2 roam, med 4, hard all.
    // Breathing goal is now a pair of MOVING objects per mouth: each half-gap oscillates under its own
    // velocity (not a pure sinusoid) so it can BOUNCE off its mouth's keeper nail, and while it slides it
    // CARRIES the ball sideways like a paddle. Per-mouth: [top,bottom]. gridGapV is the signed px/frame it
    // moved this frame (used for the carry push).
    var gridOn=false, _gridPrevMoving=false, gridGap=[23,23], gridGapDir=[-1,-1], gridGapV=[0,0];
    var GRID_POST_HALF=2, GRID_POST_H=7, GRID_PUSH=1.6;   // post half-width / half-height, and sideways carry gain
    function gridArena(){ return (typeof boardKey!=='undefined')&&(boardKey==='gridiron'||_pd('roam'))&&(typeof stadiumHazards==='function')&&stadiumHazards(); }
    function gridCfg(){ var t=(typeof hzTier==='function')?hzTier():1;   // 0 easy / 1 med / 2 hard
    // ADDITIVE tiers, fixed intensities — a tier adds a CONDITION, it never turns the same knob up:
    //   easy  ROAMING DEFENCE only (they break formation and patrol, so they are moving blockers)
    //   med   + CLEARANCE      (a roamer now boots a ball that strays into its third back to midfield)
    //   hard  + BREATHING GOAL (the posts slide, carry the ball and bounce off their keeper)
    var _pR=_pd('roam');   // SPORTS DAY borrows the roaming defence alone — no clearance, no breathing goal
    return { roamN:4, roamSpd:1.35, returnSpd:1.4, gate:1.0,
    clearR:NAIL_R+COIN_R+6, clear:_pR?false:(t>=1), clearCap:6.0, cd:42,
    breathing:_pR?false:(t>=2), breathBase:23, breathAmp:15, breathFreq:0.02 }; }
    // current breathing-goal half-gap for a mouth (HARD only) — 0 when off. Shared by physics + renderer.
    function gridBreathGap(e){ var c=gridCfg(); return c.breathing?(gridGap[e|0]||0):0; }
    // this mouth's keeper — the goalie nail nearest that goal line. Posts bounce off it.
    function gridKeeperFor(gy){ if(typeof nails==='undefined'||!nails) return null; var best=null,bd=1e9;
    for(var i=0;i<nails.length;i++){ var n=nails[i]; if(!n.goalie) continue; var d=Math.abs(n.y-gy); if(d<bd){ bd=d; best=n; } } return best; }
    // advance each mouth's breathing gap by its velocity; reverse at the amplitude limits, and BOUNCE BACK
    // early if the closing (inner-moving) post reaches its keeper nail. Runs every render frame from the tick.
    function gridBreatheStep(c){ var lo=c.breathBase-c.breathAmp, hi=c.breathBase+c.breathAmp, spd=c.breathAmp*c.breathFreq;
    for(var e=0;e<2;e++){ var gy=e?(H-NET_DEPTH-1):(NET_DEPTH+1), prev=gridGap[e], g=prev+gridGapDir[e]*spd, bounced=false;
    if(gridGapDir[e]<0){ var kp=gridKeeperFor(gy);   // only the inward stroke can run the post into the keeper
    if(kp){ var side=(kp.x>=W/2)?1:-1, postX=W/2+side*g;   // the post on the keeper's side of centre
    if(Math.abs(postX-kp.x)<(NAIL_R+GRID_POST_HALF) && Math.abs(gy-kp.y)<(GRID_POST_H+NAIL_R)){ g=prev; gridGapDir[e]=1; bounced=true; } } }
    if(!bounced){ if(g<=lo){ g=lo; gridGapDir[e]=1; } else if(g>=hi){ g=hi; gridGapDir[e]=-1; } }
    gridGapV[e]=g-prev; gridGap[e]=g;
    if(bounced){ try{ spawnSparks(W/2+((kp&&kp.x>=W/2)?1:-1)*g,gy,null,4); }catch(_e){} try{ if(!muted&&typeof sfxBump==='function') sfxBump(5); }catch(_e2){} } } }
    function initGridiron(){ if(!gridArena()) return; gridOn=true; _gridPrevMoving=false;
    gridGap=[23,23]; gridGapDir=[-1,-1]; gridGapV=[0,0]; }
    // Jog a nail toward its snapshotted home, capped, on the pitch, never entering a resting ball's space.
    function _gridHomeNail(n,spd){ if(!n._gridHome) return; var dx=n._gridHome.x-n.x, dy=n._gridHome.y-n.y, d=Math.hypot(dx,dy)||1;
    var nx=n.x, ny=n.y; if(d>spd){ nx+=dx/d*spd; ny+=dy/d*spd; } else { nx=n._gridHome.x; ny=n._gridHome.y; }
    var bx=nx-coin.x, by=ny-coin.y, bd=Math.hypot(bx,by), R=NAIL_R+COIN_R+1;
    if(bd<R && bd>0.001){ nx=coin.x+bx/bd*R; ny=coin.y+by/bd*R; }
    n.x=Math.max(WALL+NAIL_R,Math.min(W-WALL-NAIL_R,nx)); n.y=Math.max(WALL+NAIL_R,Math.min(H-WALL-NAIL_R,ny)); }
    // roaming defence — every render frame. At a shot's start the nearest N defenders are tagged to roam and
    // their homes snapshotted; while the ball is live they patrol their lane; once it is too slow to roam they
    // HOLD as solid obstacles, and only jog home after the ball has fully settled.
    function gridironTick(){ if(!gridArena()) return; if(!gridOn) initGridiron();
    if(typeof nails==='undefined'||!nails||typeof coin==='undefined'||!coin) return;
    var c=gridCfg(), sp=Math.hypot(coin.vx||0,coin.vy||0), fast=(moving && sp>c.gate && !scoring && (!coin.air||coin.air<=0));
    if(c.breathing) gridBreatheStep(c);
    var def=(current==='red')?'blue':'red';
    if(moving && !_gridPrevMoving){ var pool=[];
    for(var i=0;i<nails.length;i++){ var n=nails[i]; n._gridHome={x:n.x,y:n.y}; n._gridRoam=false; n._gridCd=0;
    if(n.team===def && !n.goalie) pool.push(n); }
    pool.sort(function(a,b){ return Math.hypot(a.x-coin.x,a.y-coin.y)-Math.hypot(b.x-coin.x,b.y-coin.y); });
    var N=(c.roamN>=99)?pool.length:Math.min(c.roamN,pool.length);
    for(var p=0;p<N;p++){ pool[p]._gridRoam=true; pool[p]._gridDir=(pool[p].x<W/2)?1:-1; } }
    _gridPrevMoving=moving;
    var lft=WALL+NAIL_R, rgt=W-WALL-NAIL_R, gap=NAIL_R*2;
    for(var i2=0;i2<nails.length;i2++){ var r=nails[i2]; if(!r._gridRoam) continue;
    if(r._aftShock) continue;   // AFTERSHOCK: a shocked roamer stands where it was zapped
    if(r._gridCd>0) r._gridCd--;
    if(fast && !(typeof dragNail!=='undefined'&&dragNail===r)){
    r.x+=r._gridDir*c.roamSpd;
    if(r.x<lft){ r.x=lft; r._gridDir=1; } else if(r.x>rgt){ r.x=rgt; r._gridDir=-1; }
    for(var j=0;j<nails.length;j++){ if(j===i2) continue; var o=nails[j];   // bounce off any token in the lane
    if(Math.abs(r.y-o.y)<gap && Math.abs(r.x-o.x)<gap){ var side=(r.x>=o.x)?1:-1; r.x=o.x+side*gap; r._gridDir=side; } }
    r.x=Math.max(lft,Math.min(rgt,r.x));
    } else if(!moving){ _gridHomeNail(r,c.returnSpd); }
    /* else: ball still in play but too slow to roam — HOLD, standing as a solid obstacle. Jogging home here
       would make the return-path anti-overlap dodge a slow ball, so a defender looked like it fled on contact.
       Only jog home once the ball has fully settled (!moving). */ } }
    // clearance — physics rate, only on a moving ball. Fires a hair before contact (clearR > the ball<->token
    // contact radius) so a roaming defender launches the ball clear instead of the plain reflection.
    function gridironStep(){ if(!gridArena()||!moving||scoring) return;
    if(typeof ghosting!=='undefined'&&ghosting) return;
    if(!gridOn||typeof nails==='undefined'||!nails) return;
    var c=gridCfg(), sp=Math.hypot(coin.vx,coin.vy), air=(!coin.air||coin.air<=0);
    if(c.clear && air && sp>0.8){ var dz=NET_DEPTH+GOAL_AREA_D+34, inDef=(coin.y<dz)||(coin.y>H-dz);
    if(inDef){ for(var i=0;i<nails.length;i++){ var r=nails[i]; if(!r._gridRoam || r._gridCd>0 || r._aftShock) continue;
    var dx=coin.x-r.x, dy=coin.y-r.y, d=Math.hypot(dx,dy);
    if(d<c.clearR && d>0.001){ r._gridCd=c.cd;
    // clear at the pace the ball ARRIVED (tiny nudge so it leaves the third), capped — not a fixed boost,
    // so a soft ball gets a soft clear and a firm shot a firm clear, redirected away from the near goal.
    var _out=Math.min(sp*1.05, c.clearCap), away=(coin.y<H/2)?1:-1, la=(Math.random()-0.5)*0.5, vy=away*Math.cos(la), vx=Math.sin(la)*(Math.random()<0.5?-1:1), m=Math.hypot(vx,vy)||1;
    coin.vx=vx/m*_out; coin.vy=vy/m*_out;
    coin.x=r.x+dx/d*(NAIL_R+COIN_R+1); coin.y=r.y+dy/d*(NAIL_R+COIN_R+1);
    try{ spawnSparks(r.x,r.y,r.team,10); }catch(e){} try{ if(!muted){ if(typeof sfxWall==='function') sfxWall(); else if(typeof sfxBump==='function') sfxBump(6); } }catch(e){}
    try{ setStatus('CLEARANCE!'); }catch(e){} try{ if(typeof haptic==='function') haptic([0,14,16,20]); }catch(e){} break; } } } }
    // BREATHING GOAL (HARD): posts at each mouth are MOVING objects. A shot into a post reflects; and because
    // the post is sliding, it also CARRIES the ball sideways (gridGapV = px it moved this frame) like a paddle,
    // so a post sweeping across the ball shoves it along. Only ever acts on a moving ball, and the carry is a
    // few tenths of a px/frame, so friction still settles it and the turn ends.
    if(c.breathing){ for(var e=0;e<2;e++){ var gp=gridGap[e], gy=e?(H-NET_DEPTH-1):(NET_DEPTH+1), pv=gridGapV[e];
    for(var s=-1;s<=1;s+=2){ var px=W/2+s*gp, pdx=coin.x-px, pdy=coin.y-gy, pd=Math.hypot(pdx,pdy), R2=GRID_POST_HALF+1+COIN_R;
    if(pd<R2 && pd>0.001){ var nx=pdx/pd, ny=pdy/pd, vn=coin.vx*nx+coin.vy*ny;
    if(vn<0){ coin.vx-=(1+RESTITUTION)*vn*nx; coin.vy-=(1+RESTITUTION)*vn*ny; }
    coin.vx+=s*pv*GRID_PUSH;   // the slide of the post carries the ball with it
    coin.x=px+nx*R2; coin.y=gy+ny*R2;
    try{ spawnSparks(px,gy,null,5); }catch(e){} try{ if(!muted&&typeof sfxWall==='function') sfxWall(); }catch(e){} } } } } }
    // ===== THE ALLEY (bowling) — arena 6 hazards ===============================================================
    // Signature mechanic: a RACK OF PINS guards each goal, so you must BOWL THROUGH them to score. Each pin
    // bleeds a little pace, so a firm strike ploughs through while a soft shot dies in the rack; a chip flies
    // clean over (air ball). Pins persist across turns and re-rack on a goal. Med+ adds the RAKE GATE (a bar
    // spanning the mouth that rises to open and falls to block) and real GUTTERS (a coin-width side channel
    // that captures the ball and rolls it to a stop — a lost shot). All settle-safe: everything acts only on a
    // MOVING grounded ball, knocked pins leave collision at once, and a guttered ball rolls to rest and the
    // turn passes through the normal settle.
    var bowlOn=false, _bowlPrevMoving=false, bowlPins=[], bowlRakePh=0, bowlGutter=null;
    function bowlArena(){ return (typeof boardKey!=='undefined')&&(boardKey==='bowling'||_pd('rake'))&&(typeof stadiumHazards==='function')&&stadiumHazards(); }
    function bowlCfg(){ var t=(typeof hzTier==='function')?hzTier():1;   // 0 easy / 1 med / 2 hard
    // ADDITIVE tiers, fixed intensities — the 6-pin rack and the rake never change size or speed:
    //   easy  6-PIN RACK, sides are BUMPERS (they bounce you back in, no loss)
    //   med   + RAKE GATE (bumpers still up)
    //   hard  + GUTTERS   (the bumpers come off, so a wall touch is a lost ball)
    var _pK=_pd('rake');   // SPORTS DAY borrows the rake gate alone — no rack, no bumpers, no gutters
    return { rows:_pK?0:3, pinLoss:0.86,
    bumpers:_pK?false:(t<2), gutter:_pK?false:(t>=2), rake:_pK?true:(t>=1), rakeW:56, rakeFreq:0.04, rakeCloseTh:0.5, gate:0.4 }; }
    // THE RAKE gate: a bar spanning the goal mouth that rises and falls along the lane. DOWN (in front of the
    // pins) it blocks the whole mouth; UP (lifted toward the goal line) it is open and you can score. Timed on
    // bowlRakePh — the vertical motion is the tell. bowlRakeClosed(): 1 = fully down/block, 0 = fully up/open.
    function bowlRakeDownY(end){ return end?(H-(NET_DEPTH+GOAL_AREA_D)-6):((NET_DEPTH+GOAL_AREA_D)+6); }
    function bowlRakeClosed(){ return 0.5+0.5*Math.cos(bowlRakePh); }
    function bowlRakeBarY(end,closed){ var down=bowlRakeDownY(end), lift=36; return end?(down+lift*(1-closed)):(down-lift*(1-closed)); }
    // (re)build the triangle in front of each goal, apex toward centre (the 1-pin the ball meets first).
    function bowlRerack(){ var c=bowlCfg(), dx=9, dy=8, pinR=2.6; bowlPins=[];
    for(var end=0;end<2;end++){ var dir=end?1:-1, apexY=end?(H-(NET_DEPTH+GOAL_AREA_D)+4):((NET_DEPTH+GOAL_AREA_D)-4);
    for(var r=0;r<c.rows;r++){ var py=apexY+dir*r*dy, cnt=r+1, x0=W/2-(cnt-1)*dx/2;
    for(var p=0;p<cnt;p++){ bowlPins.push({x:x0+p*dx, y:py, r:pinR, down:false, end:end, sx:0, sy:0, t:0}); } } } }
    function initBowling(){ if(!bowlArena()) return; bowlOn=true; _bowlPrevMoving=false; bowlRerack(); bowlRakePh=0; bowlGutter=null; }
    // every render frame: advance the rake gate, drift knocked pins (visual scatter only), and clear the
    // gutter flag once the ball has settled. The rack does NOT re-rack per flick — pins you knock down stay
    // down across turns; it only re-racks when a goal is scored (bowlRerack from finalizeGoal).
    function bowlingTick(){ if(!bowlArena()) return; if(!bowlOn) initBowling();
    if(typeof coin==='undefined'||!coin) return;
    var c=bowlCfg();
    if(c.rake) bowlRakePh+=c.rakeFreq;
    if(!moving) bowlGutter=null;
    for(var i=0;i<bowlPins.length;i++){ var pn=bowlPins[i]; if(!pn.down) continue; pn.t++; pn.x+=pn.sx; pn.y+=pn.sy; pn.sx*=0.86; pn.sy*=0.86; } }
    // physics rate, moving grounded ball only. Gutter captures + rolls the ball; pins knock + bleed pace; the rake gate blocks when down.
    function bowlingStep(){ if(!bowlArena()||!moving||scoring) return; if(!bowlOn) initBowling();
    if(typeof ghosting!=='undefined'&&ghosting) return;
    var c=bowlCfg(), sp=Math.hypot(coin.vx,coin.vy), air=(!coin.air||coin.air<=0);
    if(!air) return;   // a chip in the air flies over the rack (and clears the gutters)
    // GUTTER (med+) — a coin-width channel down each side. Touch a side wall and the ball is CAPTURED into the
    // gutter: its outward speed is killed and it ROLLS down the channel on its own momentum (real physics, no
    // freeze), friction bringing it to rest — a lost shot, so the turn passes normally when it settles. The
    // sides are gutters, not bumpers: keep it down the lane. A chip flies clean over.
    if(c.gutter){ var inL=coin.x<=WALL+COIN_R+1, inR=coin.x>=W-WALL-COIN_R-1;
    if(inL||inR){ if(!bowlGutter){ bowlGutter={side:inL?0:1};   // first contact — announce the gutter ball
    try{ setStatus('GUTTER BALL!'); }catch(e){} try{ if(!muted){ if(typeof sfxWhoosh==='function') sfxWhoosh(); else if(typeof sfxBump==='function') sfxBump(3); } }catch(e){}
    try{ if(typeof haptic==='function') haptic([0,18,26,34]); }catch(e){} }
    coin.x=inL?(WALL+COIN_R):(W-WALL-COIN_R); coin.vx=0;   // pinned to the channel; only rolls along the lane
    return; } }
    // PINS — knock any standing pin the ball reaches; it scatters, the ball loses a little pace and deflects.
    for(var i=0;i<bowlPins.length;i++){ var pn=bowlPins[i]; if(pn.down) continue;
    var dx=coin.x-pn.x, dy=coin.y-pn.y, d=Math.hypot(dx,dy), R=COIN_R+pn.r;
    if(d<R && d>0.001){ var nx=dx/d, ny=dy/d, vn=coin.vx*nx+coin.vy*ny;
    pn.down=true; pn.t=0; pn.sx=coin.vx*0.28+nx*0.6; pn.sy=coin.vy*0.28+ny*0.6;
    if(vn<0){ coin.vx-=(1+0.2)*vn*nx*0.5; coin.vy-=(1+0.2)*vn*ny*0.5; }   // slight deflection off the pin
    coin.vx*=c.pinLoss; coin.vy*=c.pinLoss;
    coin.x=pn.x+nx*R; coin.y=pn.y+ny*R;
    try{ spawnSparks(pn.x,pn.y,null,4); }catch(e){} try{ if(!muted&&typeof sfxBump==='function') sfxBump(4); }catch(e){} } }
    // THE RAKE GATE (med+) — the bar spans the mouth and only BLOCKS while it is DOWN (closed>threshold, in
    // front of the pins); when it lifts UP toward the goal the gate is open and a shot passes to score. The
    // ball bounces cleanly off the bar when it is down. Moving grounded ball only.
    if(c.rake){ var closed=bowlRakeClosed();
    if(closed>c.rakeCloseTh){ var TH=2.6, bxL=W/2-c.rakeW/2, bxR=W/2+c.rakeW/2;
    for(var e=0;e<2;e++){ var by=bowlRakeBarY(e,closed);
    if(Math.abs(coin.y-by)<COIN_R+TH && coin.x>bxL-COIN_R && coin.x<bxR+COIN_R){ var side=(coin.y<by)?-1:1;
    if(coin.vy*side<0){ coin.vy=-coin.vy*0.92; coin.y=by+side*(COIN_R+TH);
    try{ spawnSparks(coin.x,by,null,5); }catch(e){} try{ if(!muted&&typeof sfxWall==='function') sfxWall(); }catch(e){} } } } } } }

    // ===== THE GRAND PRIX (raceway) — arena 7 hazards =========================================================
    // Hazards: OIL slicks (spin off-line, a splash, and an oily TRAIL the ball drags after it), springy TYRE
    // stacks on the PENALTY-AREA corners (bounce + recoil), GRAVEL run-off in the pitch corners (drags a wide
    // ball down, kicking up dust), and the START-LIGHTS gate — release on GREEN for your full stamina, miss it
    // and the flick is worth HALF. All act only on a MOVING grounded ball, are bounded/capped, and never trap
    // the turn; a chip clears the track.
    var rcOn=false, rcOils=[], rcTyres=[], rcGravels=[], rcLightT=0, rcLightFlash=0, rcDust=[], rcSmear=[], rcRuts=[];
    var RC_TYRE_R=8, RC_OIL_R=8, RC_GRAVEL_D=30, RC_LIGHT_P=170, RC_LIGHT_BUILD=40, RC_LIGHT_HOLD=25;
    var RC_WET_DRY=260, RC_OILY=40;   // frames a spilt patch stays wet / frames the ball keeps carrying oil
    function _rcRnd(i){ var x=Math.sin(i*12.9898)*43758.5453; return x-Math.floor(x); }
    /* The tyre stack is a PIXEL SPRITE too — a rubber donut on the integer grid: dithered outer rim, flat black
       carcass, a ring of lighter TREAD notches, a hub hole, and a highlight up-left for volume. Built once and
       shared by all four stacks (identical furniture, so they must read identically). Shades:
       0 = rubber, 1 = tread notch, 2 = dithered rim, 3 = hub hole, 4 = highlight. */
    var _rcTyrePx=null;
    function rcTyreShape(){ if(_rcTyrePx) return _rcTyrePx; var pts=[], R=RC_TYRE_R;
    for(var dy=-R;dy<=R;dy++){ for(var dx=-R;dx<=R;dx++){
    var d=Math.hypot(dx,dy); if(d>R) continue;   // SOLID silhouette — a dithered outline bit holes out of the
                                                 // stack's edge at this size, which read as gaps, not softening
    var a=Math.atan2(dy,dx), sh;
    if(d<2.8) sh=3;                                                      // hub hole (the track showing through)
    else if(d>R-1.3) sh=2;                                               // dark outer wall
    else if(d>R-3.6){ sh=(Math.round((a+Math.PI)/(Math.PI/4))%2===0)?1:5; }   // TREAD band, 8 notches
    else sh=0;                                                           // inner carcass
    // one deliberate specular highlight: a contiguous arc on the upper-left of the tread, not scattered specks
    if((sh===1||sh===5) && Math.abs(_rcAngDiff(a,-2.36))<0.55) sh=4;
    pts.push([dx,dy,sh]); } }
    return (_rcTyrePx=pts); }
    function _rcAngDiff(a,b){ var d=a-b; while(d>Math.PI) d-=Math.PI*2; while(d<-Math.PI) d+=Math.PI*2; return d; }
    /* The slick is a PIXEL SPRITE, not a circle: a lobed blob built once per spill on the integer grid, so it
       matches the game's pixel-art idiom (flat bands + 1x1 dither) instead of an anti-aliased arc. Shades:
       0 = core, 1 = sheen (up-left), 2 = dithered rim. Stable per seed, so a slick never shimmers. */
    function rcOilShape(seed){ var pts=[], R=RC_OIL_R;
    for(var dy=-R-1;dy<=R+1;dy++){ for(var dx=-R-1;dx<=R+1;dx++){
    var d=Math.hypot(dx,dy*1.12)||0.001, a=Math.atan2(dy,dx);
    var lobe=0.78+0.30*_rcRnd(seed+Math.round((a+Math.PI)*2.7));
    var lim=R*lobe; if(d>lim) continue;
    var rim=(d>lim-1.7), sheen=(!rim && dx+dy<-2 && _rcRnd(seed+dx*7.1+dy*3.3)>0.45);
    if(rim && ((dx+dy)&1) && _rcRnd(seed+dx*2.3+dy*5.7)>0.55) continue;   // 1x1 dither on the edge
    pts.push([dx,dy,rim?2:(sheen?1:0)]); } }
    return pts; }
    function rcArena(){ return (typeof boardKey!=='undefined')&&(boardKey==='raceway'||_pd('oil')||_pd('lights'))&&(typeof stadiumHazards==='function')&&stadiumHazards(); }
    function rcCfg(){ var t=(typeof hzTier==='function')?hzTier():1;   // 0 easy / 1 med / 2 hard
    // ADDITIVE tiers, fixed intensities — nothing gets turned up, each tier adds a CONDITION:
    //   easy  TYRE WALLS only
    //   med   + OIL SLICKS + GRAVEL RUN-OFF
    //   hard  + START-LIGHTS (miss the green and the flick is worth half its stamina)
    // Oil is always the symmetric PAIR when it is on — a single slick would favour one end.
    // SPORTS DAY borrows ONE of these at a time — the oil (med) or the start-lights (hard) — and never the
    // tyre walls or the gravel, which belong to the raceway's own layout.
    var _pO=_pd('oil'), _pL=_pd('lights'), _prc=(_pO||_pL);
    return { oil:_prc?_pO:(t>=1), oilN:(_prc?(_pO?2:0):(t>=1?2:0)), oilSpin:2.0,
    tyres:!_prc, tyreRest:1.0, tyreCap:12,
    gravel:_prc?false:(t>=1), gravelDrag:0.90,
    lights:_prc?_pL:(t>=2), lightMiss:0.5, lightGreen:28, gate:0.4 }; }
    function initRaceway(){ if(!rcArena()) return; rcOn=true; var c=rcCfg();
    // Two slicks max, placed 180deg-rotationally symmetric about the centre so neither end is favoured.
    rcOils=[]; if(c.oilN>=1){ rcOils.push({x:Math.round(W/2+28),y:Math.round(H*0.36),cd:0,sp:0,px:rcOilShape(3.7)}); }
    if(c.oilN>=2){ rcOils.push({x:Math.round(W/2-28),y:Math.round(H*0.64),cd:0,sp:0,px:rcOilShape(11.3)}); }
    // TYRE stacks on the OUTER corners of each penalty area (the box corners facing midfield), so they guard
    // the approach instead of sitting in the dead pitch corners.
    // Only when the stacks are actually ON: SPORTS DAY borrows the oil/lights without them, and an invisible
    // stack still shoved the pegs off their formation via rcSweepNails.
    rcTyres=[]; if(c.tyres) try{ var _br=goalAreaRect('blue'), _rr=goalAreaRect('red'), _bF=NET_DEPTH+_br.h, _rF=H-NET_DEPTH-_rr.h;
    rcTyres.push({x:Math.round(_br.x),y:Math.round(_bF),hit:0,nx:0,ny:0});
    rcTyres.push({x:Math.round(_br.x+_br.w),y:Math.round(_bF),hit:0,nx:0,ny:0});
    rcTyres.push({x:Math.round(_rr.x),y:Math.round(_rF),hit:0,nx:0,ny:0});
    rcTyres.push({x:Math.round(_rr.x+_rr.w),y:Math.round(_rF),hit:0,nx:0,ny:0}); }catch(e){}
    rcGravels=[]; if(c.gravel){ var gD=RC_GRAVEL_D; rcGravels=[ {x:WALL,y:WALL,w:gD,h:gD}, {x:W-WALL-gD,y:WALL,w:gD,h:gD}, {x:WALL,y:H-WALL-gD,w:gD,h:gD}, {x:W-WALL-gD,y:H-WALL-gD,w:gD,h:gD} ]; }
    rcLightT=0; rcLightFlash=0; rcDust=[]; rcSmear=[]; rcRuts=[]; }
    // Pegs are laid out BEFORE the arena's board is applied, so a formation nail can land inside a tyre stack.
    // Nudge any overlapping nail out to the stack's edge while the ball is at rest (the golf sweep's precedent).
    function rcSweepNails(){ if(moving||typeof nails==='undefined'||!nails) return;
    for(var i=0;i<nails.length;i++){ var n=nails[i];
    for(var t=0;t<rcTyres.length;t++){ var ty=rcTyres[t], dx=n.x-ty.x, dy=n.y-ty.y, d=Math.hypot(dx,dy), R=RC_TYRE_R+NAIL_R+1;
    if(d<R){ if(d<0.001){ dx=1; dy=0; d=1; }
    n.x=Math.max(WALL+NAIL_R,Math.min(W-WALL-NAIL_R,ty.x+dx/d*R));
    n.y=Math.max(WALL+NAIL_R,Math.min(H-WALL-NAIL_R,ty.y+dy/d*R)); } } } }
    // draw-loop: advance the start-lights cycle, the oil splash / tyre recoil timers, the gravel dust puffs and
    // the fading oil smears, and keep pegs out of the tyre stacks.
    function racewayTick(){ if(!rcArena()) return; if(!rcOn) initRaceway();
    if(rcCfg().lights) rcLightT=(rcLightT+1)%RC_LIGHT_P;
    if(rcLightFlash>0) rcLightFlash--;
    for(var j=0;j<rcOils.length;j++){ if(rcOils[j].cd>0) rcOils[j].cd--; if(rcOils[j].sp>0) rcOils[j].sp--; }
    for(var t=0;t<rcTyres.length;t++){ if(rcTyres[t].hit>0) rcTyres[t].hit--; }
    if(!_rcTyrePx) try{ rcTyreShape(); }catch(e){}
    for(var d=rcDust.length-1;d>=0;d--){ var du=rcDust[d]; du.x+=du.vx; du.y+=du.vy; du.vx*=du.puff?0.94:0.90; du.vy*=du.puff?0.94:0.90;
    if(du.puff) du.r+=0.26; if(--du.life<=0) rcDust.splice(d,1); }
    for(var s=rcSmear.length-1;s>=0;s--){ var _sm=rcSmear[s]; if(_sm.cd>0) _sm.cd--; if(--_sm.life<=0) rcSmear.splice(s,1); }
    for(var r=rcRuts.length-1;r>=0;r--){ if(--rcRuts[r].life<=0) rcRuts.splice(r,1); }
    try{ rcSweepNails(); }catch(e){} }
    // START-LIGHTS: the flick's power multiplier at the current phase — full on GREEN, HALF if you miss it. So
    // green pays your normal stamina for that flick (100%, then 75%, then 50%…) and a miss halves it.
    function rcLaunchMul(){ if(!rcArena()) return 1; var c=rcCfg(); if(!c.lights) return 1;
    return rcInGreen()?1:c.lightMiss; }
    function rcInGreen(){ if(!rcArena()) return false; var c=rcCfg(); if(!c.lights) return false;
    var on=RC_LIGHT_BUILD+RC_LIGHT_HOLD; return rcLightT>=on && rcLightT<on+c.lightGreen; }
    // Called at the moment of release (human + CPU) — returns the multiplier and plays the feedback.
    function rcLaunchApply(){ if(!rcArena()) return 1; var c=rcCfg(); if(!c.lights) return 1;
    var g=rcInGreen(); rcLightFlash=g?16:12;
    try{ setStatus(g?'GREEN LIGHT — FULL POWER!':'JUMP START — HALF POWER'); }catch(e){}
    try{ if(!muted){ if(g&&typeof sfxWhoosh==='function') sfxWhoosh(); else if(!g&&typeof sfxBlocked==='function') sfxBlocked(); } }catch(e){}
    return g?1:c.lightMiss; }
    // physics rate, moving grounded ball only. Oil injects (bounded) spin + a splash + a trail; tyres bounce and
    // recoil; gravel run-off drags a wide ball and kicks up dust.
    function racewayStep(){ if(!rcArena()||!moving||scoring) return; if(!rcOn) initRaceway();
    if(typeof ghosting!=='undefined'&&ghosting) return;
    var c=rcCfg(), sp=Math.hypot(coin.vx,coin.vy), air=(!coin.air||coin.air<=0);
    if(!air) return;   // airborne clears the track hazards
    // GRAVEL run-off — extra drag in the corner boxes; stray wide and the ball bogs down. Only slows, so safe.
    // Throws a couple of pebbles/dust motes per frame while the ball is ploughing through it.
    var _inGrv=false;
    for(var g=0;g<rcGravels.length;g++){ var gv=rcGravels[g];
    if(coin.x>gv.x && coin.x<gv.x+gv.w && coin.y>gv.y && coin.y<gv.y+gv.h){ _inGrv=true;
    coin.vx*=c.gravelDrag; coin.vy*=c.gravelDrag;
    if(sp>c.gate){ var _back=Math.atan2(-coin.vy,-coin.vx);
    // the moment it goes off-track: a hard spray of stones + a dust cloud, like a car hitting the run-off
    if(!coin._rcGrv){ for(var q0=0;q0<9;q0++){ var a0=_back+(Math.random()-0.5)*2.0, m0=1.1+Math.random()*2.2;
    rcDust.push({x:coin.x,y:coin.y,vx:Math.cos(a0)*m0,vy:Math.sin(a0)*m0,life:16+(Math.random()*12|0),max:28,r:1}); }
    for(var q1=0;q1<3;q1++){ rcDust.push({x:coin.x+(Math.random()-0.5)*4,y:coin.y+(Math.random()-0.5)*4,vx:Math.cos(_back)*(0.3+Math.random()*0.5),vy:Math.sin(_back)*(0.3+Math.random()*0.5),life:26+(Math.random()*10|0),max:36,r:2.5+Math.random()*2,puff:true});
    }
    try{ if(!muted&&typeof sfxBump==='function') sfxBump(3); }catch(e){} }
    // and a steady trickle of stones + a rut gouged in the surface while it ploughs on
    if(rcDust.length<52){ for(var q=0;q<2;q++){ var a=_back+(Math.random()-0.5)*1.5, m=0.5+Math.random()*1.3;
    rcDust.push({x:coin.x,y:coin.y,vx:Math.cos(a)*m,vy:Math.sin(a)*m,life:12+(Math.random()*10|0),max:22,r:1}); }
    if(Math.random()<0.5) rcDust.push({x:coin.x,y:coin.y,vx:Math.cos(_back)*0.25,vy:Math.sin(_back)*0.25,life:22,max:32,r:2+Math.random()*1.6,puff:true}); }
    if(rcRuts.length<80) rcRuts.push({x:coin.x,y:coin.y,a:Math.atan2(coin.vy,coin.vx),life:70,max:70});
    }
    break; } }
    coin._rcGrv=_inGrv;
    // OIL spills — inject spin so the ball curves off-line (Magnus does the bending). Spin is bounded; friction
    // still settles the ball, so this never traps a turn. Arms the splash and coats the ball so it SMEARS oil
    // along its path for a short while afterwards.
    for(var j=0;j<rcOils.length;j++){ var ol=rcOils[j];
    if(ol.cd<=0 && sp>c.gate && Math.hypot(coin.x-ol.x,coin.y-ol.y)<RC_OIL_R+COIN_R){ coin.spin=Math.max(-4,Math.min(4,(coin.spin||0)+((coin.x>=ol.x)?1:-1)*c.oilSpin)); ol.cd=30; ol.sp=26;
    ol.hx=coin.x; ol.hy=coin.y; coin._rcOily=RC_OILY;   // frames of oil still on the ball
    try{ spawnSparks(ol.x,ol.y,null,4); }catch(e){} try{ if(!muted&&typeof sfxWhoosh==='function') sfxWhoosh(); }catch(e){} } }
    // The oily ball SMEARS the track behind it, and those patches stay WET for a while (RC_WET_DRY frames)
    // before they dry off — so the circuit gets progressively oily as a rally runs on. Laid down at a spacing
    // in px (not per frame) so a slow ball doesn't pile up a blob and a fast one still leaves a continuous line.
    if(coin._rcOily>0){ coin._rcOily--;
    if(sp>c.gate){ var _lastS=rcSmear.length?rcSmear[rcSmear.length-1]:null;
    if(!_lastS || Math.hypot(coin.x-_lastS.x,coin.y-_lastS.y)>2.6){
    if(rcSmear.length>=90) rcSmear.shift();
    rcSmear.push({x:coin.x,y:coin.y,seed:rcSmear.length*3.1+coin.x*0.7,life:RC_WET_DRY,max:RC_WET_DRY,cd:14}); } } }
    // Drive back through a patch that is still WET and the ball picks the oil up again — the trail carries on,
    // with a small slip nudge (a fraction of a fresh slick, bounded and on a per-patch cooldown, so a single
    // patch can never pump the spin up). A dried patch is inert.
    else if(sp>c.gate){ for(var w=0;w<rcSmear.length;w++){ var wsm=rcSmear[w];
    if(wsm.cd<=0 && Math.hypot(coin.x-wsm.x,coin.y-wsm.y)<COIN_R+2){ coin._rcOily=Math.round(RC_OILY*0.55); wsm.cd=26;
    coin.spin=Math.max(-4,Math.min(4,(coin.spin||0)+((coin.x>=wsm.x)?1:-1)*c.oilSpin*0.3));
    break; } } }
    // TYRE walls — springy bounce (restitution up to 1.15 on hard), capped so it can't run away. Arms the recoil
    // animation (the stack is knocked along the impact normal and springs back).
    if(c.tyres) for(var t2=0;t2<rcTyres.length;t2++){ var ty=rcTyres[t2], tdx=coin.x-ty.x, tdy=coin.y-ty.y, td=Math.hypot(tdx,tdy), TR=RC_TYRE_R+COIN_R;
    if(td<TR && td>0.001){ var tnx=tdx/td, tny=tdy/td, tvn=coin.vx*tnx+coin.vy*tny;
    if(tvn<0){ coin.vx-=(1+c.tyreRest)*tvn*tnx; coin.vy-=(1+c.tyreRest)*tvn*tny;
    var tsp=Math.hypot(coin.vx,coin.vy); if(tsp>c.tyreCap){ var kk=c.tyreCap/tsp; coin.vx*=kk; coin.vy*=kk; }
    ty.hit=18; ty.nx=-tnx; ty.ny=-tny; ty.pow=Math.min(1,Math.abs(tvn)/7); }
    coin.x=ty.x+tnx*TR; coin.y=ty.y+tny*TR;
    try{ spawnSparks(ty.x,ty.y,null,5); }catch(e){} try{ if(!muted&&typeof sfxBump==='function') sfxBump(5); }catch(e){} } } }
    // ===== THE RING (boxing) — arena 8 hazards ================================================================
    // ADDITIVE tiers, fixed intensities:
    //   easy  ROPES        — the side walls are fully elastic and hand the ball back WITH INTEREST
    //   med   + HEAVY BAGS — sand-filled bags that ABSORB a shot instead of bouncing it (a hit dies on them),
    //                        and SHIFT a little on every hit and stay put, so the pitch layout drifts as the
    //                        match goes on
    //   hard  + SPRUNG GLOVES — four spring-loaded boxing gloves in the end frames (two per end) that punch out
    //                        into the pitch on a fixed, staggered LOOP. They swat a shot away from goal and
    //                        leave the ball WOBBLING on the next flick.
    // Settle-safe: the ropes only add interest above a speed gate and are capped (friction across the pitch
    // dominates, so a rally converges), the bag absorbs rather than adds, and a glove can only ever strike a
    // MOVING ball (ringStep returns unless `moving`), so nothing can stop a ball settling and ending the turn.
    //
    // Gloves LOOP rather than track the ball on purpose: the standing telegraph rule is that a hazard has to be
    // readable BEFORE it acts, and a glove that homed in could not be dodged, only suffered. A fixed rhythm with
    // a visible wind-up can be learned and shot around.
    var rgOn=false, rgBags=[], rgRope=[{t:0,y:0,s:0},{t:0,y:0,s:0}], rgT=0, rgScuff=[], rgGloves=[];
    var rgWobPend=0, _rgPrevMoving=false;
    var RG_BAG_R=6, RG_ZONE_R=26, RG_ROPE_FLEX=16;
    function rgArena(){ return (typeof boardKey!=='undefined')&&(boardKey==='ring'||_pd('ropes')||_pd('gloves'))&&(typeof stadiumHazards==='function')&&stadiumHazards(); }
    function rgCfg(){ var t=(typeof hzTier==='function')?hzTier():1;   // 0 easy / 1 med / 2 hard
    var _pP=_pd('ropes'), _pG=_pd('gloves'), _pRg=(_pP||_pG);   // SPORTS DAY borrows one of the two, never the bags
    return { ropes:_pRg?_pP:true, ropeRest:1.08, ropeGate:1.2, ropeCap:11,
    bag:_pRg?false:(t>=1), bagAbsorb:0.26, bagSlide:0.30, bagShove:2.2, bagShoveMax:6,
    gloves:_pRg?_pG:(t>=2), gloveReach:26, glovePow:4.6, gloveCap:11, gate:0.4 }; }
    // The glove's punch cycle, in frames: wind up (cocks back), snap out, hold at full stretch, retract, idle.
    // Returns 0..1 = how far out of the frame the glove is, and whether it is live (able to connect).
    // RG_GLOVE_R is the strike radius AND the art's radius — the glove is a touch wider than the ball (COIN_R*2)
    // so it reads as a real mitt. HOLD is deliberately long: with four gloves on a 17% duty cycle and a narrow
    // corridor, a first pass at 12 frames of hold almost never connected, which made the whole condition inert.
    var RG_GLOVE_R=7;
    var RG_GL_P=112, RG_GL_WIND=24, RG_GL_OUT=10, RG_GL_HOLD=20, RG_GL_BACK=20;
    function rgGlovePhase(ph){ var t=((rgT+ph)%RG_GL_P);
    if(t<RG_GL_WIND) return { ext:-0.18*Math.sin(t/RG_GL_WIND*Math.PI), live:false, wind:t/RG_GL_WIND };
    t-=RG_GL_WIND; if(t<RG_GL_OUT) return { ext:t/RG_GL_OUT, live:true, wind:1 };
    t-=RG_GL_OUT; if(t<RG_GL_HOLD) return { ext:1, live:true, wind:1 };
    t-=RG_GL_HOLD; if(t<RG_GL_BACK) return { ext:1-t/RG_GL_BACK, live:false, wind:0 };
    return { ext:0, live:false, wind:0 }; }
    // The x of the INNERMOST rope strand on a side (0=left,1=right) — the same line the ball collides on, and
    // the same math the board art uses, so the bounce always lands visually on the rope.
    function rgRopeX(side){ return side?(W-WALL-COIN_R):(WALL+COIN_R); }
    /* The speed-bag is a PIXEL SPRITE: a solid leather blob, slightly pear-shaped (wider low), with a lighter
       top-left face, a dark underside and a lace seam. Solid silhouette — no edge dither, which at this size
       reads as holes rather than softening (the tyre stack's lesson). Shades: 0 leather, 1 lit face, 2 shadow,
       3 lace. Built once and shared by both bags. */
    var _rgBagPx=null;
    function rgBagShape(){ if(_rgBagPx) return _rgBagPx; var pts=[], R=RG_BAG_R;
    for(var dy=-R;dy<=R;dy++){ for(var dx=-R;dx<=R;dx++){
    var sy=dy*(dy<0?1.15:0.95);                       // pear: tapers toward the top, fuller at the bottom
    if(Math.hypot(dx,sy)>R) continue;
    var sh=0;
    if(dx+dy<-3) sh=1; else if(dx+dy>4) sh=2;
    if(dx===0 && dy>-3 && dy<4) sh=3;                  // lace seam down the middle
    pts.push([dx,dy,sh]); } }
    return (_rgBagPx=pts); }
    function initRing(){ if(!rgArena()) return; rgOn=true; rgT=0; rgScuff=[];
    rgRope=[{t:0,y:0,s:0},{t:0,y:0,s:0}];
    // a 180deg-rotationally symmetric PAIR of bags, so neither end is favoured. tx/ty is where a bag is being
    // shoved to; x/y eases toward it, then it just stays there — every hit nudges it again.
    rgBags=[ {x:Math.round(W/2), y:Math.round(H*0.30), tx:Math.round(W/2), ty:Math.round(H*0.30), hit:0, nx:0, ny:0},
    {x:Math.round(W/2), y:Math.round(H*0.70), tx:Math.round(W/2), ty:Math.round(H*0.70), hit:0, nx:0, ny:0} ];
    // FOUR gloves — two per end frame, either side of the goal mouth, 180deg-rotationally symmetric so neither
    // end is favoured. Phases are staggered around the loop so they read as a rhythm rather than a single beat.
    var _gL=Math.round((W-GOAL_W)/2), _gx=[Math.round((WALL+_gL)/2), W-Math.round((WALL+_gL)/2)];
    rgGloves=[ {x:_gx[0], base:WALL, dir:1, ph:0, hit:0},
    {x:_gx[1], base:WALL, dir:1, ph:Math.round(RG_GL_P*0.5)},
    {x:_gx[1], base:H-WALL, dir:-1, ph:Math.round(RG_GL_P*0.25), hit:0},
    {x:_gx[0], base:H-WALL, dir:-1, ph:Math.round(RG_GL_P*0.75), hit:0} ];
    for(var g=0;g<rgGloves.length;g++){ rgGloves[g].hit=0; rgGloves[g].ext=0; }
    rgWobPend=0; rgWobOn=false; _rgPrevMoving=false; }
    // Retracted, the glove sits ON the pitch wall — its back flush to the boundary and its whole body inside the
    // play area, rather than half-buried in the timber frame. It extends inward from there.
    function rgGloveY(g,ext){ return g.base+g.dir*(RG_GLOVE_R+ext*rgCfg().gloveReach); }
    /* The glove is a hand-authored PIXEL SPRITE rather than a procedural blob — at 11x11 the silhouette matters
       more than any formula, so it is drawn as a little bitmap: cuff + white trim at the wrist, a swelling
       knuckle mass, a thumb bump on one side, and a lace seam. Laid out punching DOWN (+y); mirrored vertically
       for the gloves in the bottom frame. Legend: K outline, R body, L lit, D shade, W cuff trim, S lace. */
    var RG_GLOVE_ART=[
    '.....KKKKK.....',
    '....KWWWWWK....',
    '...KKWWWWWKK...',
    '...KWWWWWWWK...',
    '..KKRRRRRRRKK..',
    '..KRLRRRRRDRK..',
    '.KKRLRRRRRDRKK.',
    'KKRRLRRRRRDRRK.',
    'KRRRLRRRRRDRRK.',
    'KKRRRRRRRRRDRK.',
    '.KKRRRSSSRRRRK.',
    '..KRRRSSSRRRK..',
    '..KKRRRRRRRKK..',
    '...KKRRRRRKK...',
    '.....KKKKK.....'];
    var _rgGlovePx=null;
    function rgGloveShape(){ if(_rgGlovePx) return _rgGlovePx; var up=[], dn=[], H2=RG_GLOVE_ART.length, W2=RG_GLOVE_ART[0].length;
    for(var r=0;r<H2;r++){ for(var cx=0;cx<W2;cx++){ var ch=RG_GLOVE_ART[r].charAt(cx); if(ch==='.') continue;
    var dx=cx-((W2-1)/2), dy=r-((H2-1)/2);
    dn.push([dx,dy,ch]); up.push([dx,-dy,ch]); } }
    return (_rgGlovePx={down:dn, up:up}); }
    // True while a punch is pending, i.e. the NEXT flick will wobble — the aim guide asks this so it can draw
    // the rattled trajectory instead of a clean one.
    function rgWobArmed(){ return !!(rgArena() && rgCfg().gloves && rgWobPend>0); }
    // A bag can be shoved around midfield but never into a goal area — a bag parked in the box would wall the
    // goal off for the rest of the match.
    function rgBagClampX(x){ return Math.max(WALL+COIN_R+RG_BAG_R+2, Math.min(W-WALL-COIN_R-RG_BAG_R-2, x)); }
    function rgBagClampY(y){ var m=NET_DEPTH+GOAL_AREA_D+RG_BAG_R+4; return Math.max(m, Math.min(H-m, y)); }
    // draw-loop: swing the bags, decay the rope flex + scuff puffs.
    function ringTick(){ if(!rgArena()) return; if(!rgOn) initRing();
    var c=rgCfg(); rgT++;
    // the bags do not roam — they only ease into wherever the last hit shoved them, and stay
    for(var i=0;i<rgBags.length;i++){ var b=rgBags[i];
    b.x+=(b.tx-b.x)*0.18; b.y+=(b.ty-b.y)*0.18;
    if(Math.abs(b.tx-b.x)<0.05) b.x=b.tx; if(Math.abs(b.ty-b.y)<0.05) b.y=b.ty;
    if(b.hit>0) b.hit--; }
    for(var r=0;r<2;r++){ if(rgRope[r].t>0) rgRope[r].t--; }
    for(var g2=0;g2<rgGloves.length;g2++){ var gv=rgGloves[g2];
    var gp=rgGlovePhase(gv.ph); gv.ext=c.gloves?gp.ext:0; gv.live=c.gloves&&gp.live; gv.wind=gp.wind;
    if(gv.hit>0) gv.hit--; }
    // A punched ball comes back RATTLED: the next shot is thrown off exactly the way the DRUNK debuff does it —
    // the launch angle takes a random kick of up to DRUNK_SPREAD at the moment of release. Applied here, at the
    // idle->moving transition, so it covers the human and the CPU with one hook.
    if(moving && !_rgPrevMoving && rgWobPend>0){ rgWobPend=0;
    var _rj=(Math.random()-0.5)*DRUNK_SPREAD, _rc=Math.cos(_rj), _rs=Math.sin(_rj);
    var _rvx=coin.vx*_rc-coin.vy*_rs, _rvy=coin.vx*_rs+coin.vy*_rc;
    coin.vx=_rvx; coin.vy=_rvy;
    // No status text: the swaying aim guide already reads as a drunk shot, so announcing it is noise.
    try{ if(!muted&&typeof sfxDrunk==='function') sfxDrunk(); }catch(e){} }
    _rgPrevMoving=moving;
    try{ rgSeparate(); }catch(e){}
    for(var s2=rgScuff.length-1;s2>=0;s2--){ var sc=rgScuff[s2]; sc.x+=sc.vx; sc.y+=sc.vy; sc.vx*=0.9; sc.vy*=0.9; if(--sc.life<=0) rgScuff.splice(s2,1); } }
    // A bag eases into wherever it was shoved, so it can drift onto a resting ball or a peg. While the ball is
    // at REST, push whatever is overlapping a bag back out to its edge — the bag never displaces play by
    // sliding, it just occupies the space it was pushed into.
    function rgSeparate(){ if(!rgCfg().bag) return;
    for(var i=0;i<rgBags.length;i++){ var b=rgBags[i];
    if(!moving && typeof coin!=='undefined' && coin){ var dx=coin.x-b.x, dy=coin.y-b.y, d=Math.hypot(dx,dy), R=RG_BAG_R+COIN_R+1;
    if(d<R){ if(d<0.001){ dx=1; dy=0; d=1; }
    coin.x=Math.max(WALL+COIN_R,Math.min(W-WALL-COIN_R,b.x+dx/d*R));
    coin.y=Math.max(WALL+COIN_R,Math.min(H-WALL-COIN_R,b.y+dy/d*R)); } }
    if(typeof nails!=='undefined'&&nails){ for(var n=0;n<nails.length;n++){ var q=nails[n];
    var ndx=q.x-b.x, ndy=q.y-b.y, nd=Math.hypot(ndx,ndy), NR=RG_BAG_R+NAIL_R+1;
    if(nd<NR){ if(nd<0.001){ ndx=1; ndy=0; nd=1; }
    q.x=Math.max(WALL+NAIL_R,Math.min(W-WALL-NAIL_R,b.x+ndx/nd*NR));
    q.y=Math.max(WALL+NAIL_R,Math.min(H-WALL-NAIL_R,b.y+ndy/nd*NR)); } } } }
    // a glove punches outward into the pitch, so it can reach a ball that has come to rest in its lane
    if(!moving && rgCfg().gloves && typeof coin!=='undefined' && coin){ for(var gi2=0;gi2<rgGloves.length;gi2++){ var gg=rgGloves[gi2];
    var ggy=rgGloveY(gg,gg.ext||0), gx2=coin.x-gg.x, gy2=coin.y-ggy, gd2=Math.hypot(gx2,gy2), GR2=RG_GLOVE_R+COIN_R+1;
    if(gd2<GR2){ if(gd2<0.001){ gx2=0; gy2=gg.dir; gd2=1; }
    coin.x=Math.max(WALL+COIN_R,Math.min(W-WALL-COIN_R,gg.x+gx2/gd2*GR2));
    coin.y=Math.max(WALL+COIN_R,Math.min(H-WALL-COIN_R,ggy+gy2/gd2*GR2)); } } } }
    // Called from the side-wall bounce in collideStep: the ropes hand the ball back with interest above a speed
    // gate (a dying ball keeps the normal restitution so it still settles), and the strand flexes where it hit.
    function rgRopeRest(vabs,cy,side){ var c=rgCfg(); if(!c.ropes) return RESTITUTION;
    rgRope[side]={t:RG_ROPE_FLEX, y:cy, s:Math.min(1,vabs/8)};
    try{ if(!muted&&typeof sfxBounce==='function') sfxBounce(vabs); }catch(e){}
    return (vabs>c.ropeGate)?c.ropeRest:RESTITUTION; }
    // physics rate, moving grounded ball only. Bags punch; the canvas centre drags.
    function ringStep(){ if(!rgArena()||!moving||scoring) return; if(!rgOn) initRing();
    if(typeof ghosting!=='undefined'&&ghosting) return;
    var c=rgCfg(), sp=Math.hypot(coin.vx,coin.vy), air=(!coin.air||coin.air<=0);
    if(!air) return;   // a chip flies over the bags and clears the canvas
    // HEAVY BAGS — sand inside, so a shot DIES on them instead of bouncing: the component driving into the bag
    // is killed outright (no rebound) and only a little of the sideways slide survives, so the ball thuds and
    // slumps beside it. Every hit also SHOVES the bag along the shot's line, by an amount that scales with how
    // hard it was struck, and the bag simply stays there — so the pitch layout drifts over the match.
    if(c.bag){ for(var i=0;i<rgBags.length;i++){ var b=rgBags[i];
    var dx=coin.x-b.x, dy=coin.y-b.y, d=Math.hypot(dx,dy), R=RG_BAG_R+COIN_R;
    if(d<R && d>0.001){ var nx=dx/d, ny=dy/d, vn=coin.vx*nx+coin.vy*ny;
    if(vn<0){ var tvx=coin.vx-vn*nx, tvy=coin.vy-vn*ny;   // split off the sideways slide, drop the rest
    coin.vx=tvx*c.bagSlide; coin.vy=tvy*c.bagSlide;
    var imp=Math.min(1,Math.abs(vn)/8);                  // how hard it landed, 0..1
    b.tx=rgBagClampX(b.tx-nx*c.bagShove*(0.4+imp)); b.ty=rgBagClampY(b.ty-ny*c.bagShove*(0.4+imp));
    b.hit=16; b.nx=-nx; b.ny=-ny; b.imp=imp;
    try{ if(!muted&&typeof sfxBump==='function') sfxBump(Math.min(7,2+imp*5)); }catch(e){}
    try{ if(typeof haptic==='function') haptic(Math.round(8+imp*10)); }catch(e){} }
    coin.x=b.x+nx*R; coin.y=b.y+ny*R;
    coin.vx*=c.bagAbsorb; coin.vy*=c.bagAbsorb; } } }
    // SPRUNG GLOVES — while a glove is at full stretch it swats a MOVING ball away from its goal and rattles it
    // for the next flick. Only ever acts on a moving ball, and the result is capped.
    // The glove is a SOLID object whether or not it is mid-punch — it sits on the wall, so a ball that reaches it
    // always bounces. Only a LIVE glove (out or holding) adds the punch and rattles the ball for the next flick.
    if(c.gloves){ for(var gi=0;gi<rgGloves.length;gi++){ var g=rgGloves[gi];
    var gy=rgGloveY(g,g.ext||0), gdx=coin.x-g.x, gdy=coin.y-gy, gd=Math.hypot(gdx,gdy), GR=RG_GLOVE_R+COIN_R;
    if(gd<GR && gd>0.001){ var gnx=gdx/gd, gny=gdy/gd, gvn=coin.vx*gnx+coin.vy*gny;
    if(gvn<0){ coin.vx-=(1+RESTITUTION)*gvn*gnx; coin.vy-=(1+RESTITUTION)*gvn*gny; }
    coin.x=g.x+gnx*GR; coin.y=gy+gny*GR;
    if(g.live){ coin.vy+=g.dir*c.glovePow;                     // the punch itself, straight down its travel
    var gs=Math.hypot(coin.vx,coin.vy); if(gs>c.gloveCap){ var gk=c.gloveCap/gs; coin.vx*=gk; coin.vy*=gk; }
    g.hit=14; rgWobPend=1;
    try{ spawnSparks(g.x,gy,null,8); }catch(e){} try{ if(!muted&&typeof sfxBump==='function') sfxBump(8); }catch(e){}
    try{ setStatus('PUNCHED!'); }catch(e){} try{ if(typeof haptic==='function') haptic([0,18,24,30]); }catch(e){}
    } else { g.hit=Math.max(g.hit,6);                          // a dead glove just thuds
    try{ if(!muted&&typeof sfxBump==='function') sfxBump(4); }catch(e){} }
    break; } } } }
    function bkGoalDenied(side){ return bkArena()&&bkRimOn&&!bkRimPass[side]; }
    function _bbSpawnPitch(){ var e=Math.floor(Math.random()*4), pad=WALL+8, sx,sy;
    if(e===0){ sx=WALL+2; sy=pad+Math.random()*(H-2*pad); }
    else if(e===1){ sx=W-WALL-2; sy=pad+Math.random()*(H-2*pad); }
    else if(e===2){ sx=pad+Math.random()*(W-2*pad); sy=WALL+2; }
    else { sx=pad+Math.random()*(W-2*pad); sy=H-WALL-2; }
    var tx=WALL+Math.random()*(W-2*WALL), ty=WALL+Math.random()*(H-2*WALL);
    var dx=tx-sx, dy=ty-sy, d=Math.hypot(dx,dy)||1, sp=2.6+Math.random()*0.9;
    bbPitchBalls.push({x:sx,y:sy,vx:dx/d*sp,vy:dy/d*sp,r:5});
    }
    // advance the pitching machine + glove flashes from the draw loop so they animate between shots.
    // The bat swing state machine runs from stepPhysics (it is triggered by and acts on the ball).
    function baseballTick(){ if(!((typeof boardKey!=='undefined')&&boardKey==='baseball'&&(typeof stadiumHazards==='function')&&stadiumHazards())) return;
    if(bbBats.length===0){ try{ initBaseball(); }catch(e){} }
    if(bbPitchOn){ for(var _pmi=bbPitchBalls.length-1;_pmi>=0;_pmi--){ var _pm=bbPitchBalls[_pmi];
    _pm.x+=_pm.vx; _pm.y+=_pm.vy;
    if(_pm.x>W-WALL+10||_pm.x<WALL-10||_pm.y<WALL-10||_pm.y>H-WALL+10) bbPitchBalls.splice(_pmi,1);
    } if(bbPitchCD>0){ bbPitchCD--; } else if(bbPitchBalls.length<2){ _bbSpawnPitch();
    bbPitchCD=130+Math.floor(Math.random()*80);
    try{ if(typeof sfxWhoosh==='function') sfxWhoosh(); }catch(e){} } }
    if(bbGlovesOn){ for(var _gf=0;_gf<bbGloves.length;_gf++){ var _gg=bbGloves[_gf];
    if(_gg.flash>0) _gg.flash--; if(_gg.catchT>0) _gg.catchT--;
    if(_gg.openT>0) _gg.openT--; } }
    }
    // hazard difficulty tier (0 easy / 1 med / 2 hard) — scales counts + intensity
    function hzTier(){ var l;
    if((typeof mode!=='undefined'&&mode==='royale')&&(typeof royaleLevel!=='undefined'&&royaleLevel)){ l=royaleLevel;
    } else { l=(typeof aiLevel!=='undefined'&&aiLevel)?aiLevel:'med';
    } return l==='hard'?2:(l==='easy'?0:1);
    }
    function stadiumHazards(){ return (typeof mode!=='undefined' && mode==='royale'); }
    // STORM: puddles (drag pools) + lightning strikes (scatter near the ball)
    var stormStrikeT=120, stormStrike=null;
    var STORM_PUD=[[0.3,0.35],[0.65,0.6],[0.5,0.5],[0.35,0.72],[0.7,0.3],[0.52,0.82]];
    function stormPuddles(){ if(hzTier()<1) return [];
    var n=4, out=[]; for(var i=0;i<n;i++){ out.push({x:WALL+STORM_PUD[i][0]*(W-WALL*2), y:WALL+STORM_PUD[i][1]*(H-WALL*2), r:11+(i%2)*3});
    } return out; }
    // advance the crosswind gust state machine (calm -> gust -> calm); runs from the draw loop so wind
    // blows and shows even between shots. stormWindStr eases toward the gust's ramp for a smooth visual.
    function stormGustTick(){ if(!((typeof boardKey!=='undefined')&&(boardKey==='storm'||boardKey==='turf')&&(typeof stadiumHazards==='function')&&stadiumHazards())) return;
    if(typeof phase!=='undefined'&&phase!=='play') return;
    if(stormGust){ stormGust.t++;
    if(stormGust.t>=stormGust.dur){ stormGust=null;
    stormGustCD=300+Math.floor(Math.random()*240);
    } } else { stormGustCD--;
    if(stormGustCD<=0){ stormGust={ang:Math.random()*6.283, t:0, dur:55+Math.floor(Math.random()*45), mag:0.06+Math.random()*0.04};
    stormWindAng=stormGust.ang;
    try{ if(typeof sfxWhoosh==='function') sfxWhoosh();
    }catch(e){} } } var _tgt=stormGust?Math.sin(stormGust.t/stormGust.dur*Math.PI):0;
    stormWindStr+=(_tgt-stormWindStr)*0.15;
    if(stormWindStr<0.002) stormWindStr=0;
    }
    // lightning runs on its own timer from the draw loop (like the rain) — it keeps striking whether or
    // not the ball is moving. The knockback only lands when the ball is actually in motion near a strike.
    function stormStrikeTick(){ if(!((typeof boardKey!=='undefined')&&(boardKey==='storm'||boardKey==='turf')&&(typeof stadiumHazards==='function')&&stadiumHazards())) return;
    if(typeof phase!=='undefined'&&phase!=='play') return;
    if(hzTier()<2) return; if(stormStrike){ stormStrike.ph++;
    if(stormStrike.ph===30){ var _R=32,_im=4,_dd3=Math.hypot(coin.x-stormStrike.x,coin.y-stormStrike.y);
    if(moving&&!scoring&&_dd3<_R){ var _ux3=(coin.x-stormStrike.x)/(_dd3||1),_uy3=(coin.y-stormStrike.y)/(_dd3||1),_f3=(1-_dd3/_R);
    coin.vx+=_ux3*_im*_f3; coin.vy+=_uy3*_im*_f3;
    } try{ if(typeof sfxCannon==='function') sfxCannon(70);
    }catch(e){} try{ shake=Math.max(shake||0,4);
    }catch(e){} } if(stormStrike.ph>38){ stormStrike=null;
    stormStrikeT=110; } } else { stormStrikeT--;
    if(stormStrikeT<=0){ stormStrike={x:Math.max(WALL+8,Math.min(W-WALL-8,coin.x+(Math.random()-0.5)*90)), y:Math.max(NET_DEPTH+8,Math.min(H-NET_DEPTH-8,coin.y+(Math.random()-0.5)*90)), ph:0};
    } } }
    // CANDY: caramel sticky patches + rolling gumballs
    var gumballs=[];
    // CASINO: roulette wheel (capture → spin → launch), rolling dice boxes, shuffle walls (hard)
    var ROUL_R=30, ROUL_BASE=-2.0943951, rouletteCap=null, rouletteLastN=0, rouletteFlash=0, rouletteCD=0, rouletteAng=0, rouletteShot=false, rouletteBox=null, _numTblF=1;
    var dice=[], numBoxes=[], skateCD=0, skateTube=null, jungleCD=0, aqCurAng=0, beachWaveT=0, beachBalls=[], beachCrabs=[], beachWaveDir=0, beachWaveCyc=-1, _beInited=false;
    // JUNGLE (VINE RUINS) — additive: easy vines / med +slippery bananas / hard +rolling logs
    var jungleBananas=[], bananaCD=0, bananaSlip=0, jungleLogs=[], jungleLogCD=90, _jgInited=false, jungleGrab=null;
    function initJungleLogs(){ jungleLogs=[];
    var _pad=NET_DEPTH+GOAL_AREA_D+24, _span=H-2*_pad, _spx=W-2*WALL;
    jungleLogs.push({x:WALL+8, y:_pad+_span*0.22, ax:6, ay:16, vx:0.8, vy:0, roll:0});
    jungleLogs.push({x:WALL+_spx*0.66, y:_pad+8, ax:16, ay:6, vx:0, vy:0.9, roll:0});
    }
    function _jgEnsure(){ if(_jgInited) return; try{ if(nails&&nails.length){ if(hzTier()>=1) initJungleBananas(); if(hzTier()>=2) initJungleLogs(); _jgInited=true; } }catch(e){} }
    // logs roll continuously and wrap around the pitch (never vanish); reverse off a player token
    function jungleLogsTick(){ if(!((typeof boardKey!=='undefined')&&boardKey==='jungle'&&(typeof stadiumHazards==='function')&&stadiumHazards()&&hzTier()>=2)) return;
    if(typeof phase!=='undefined'&&phase!=='play') return;
    if(!jungleLogs.length) _jgEnsure();
    for(var _li=0;_li<jungleLogs.length;_li++){ var _lg=jungleLogs[_li];
    _lg.x+=_lg.vx; _lg.y+=_lg.vy;
    _lg.roll+=(_lg.vx+_lg.vy)*0.2;
    var _rev=false; try{ for(var _ni=0;_ni<nails.length;_ni++){ var _nl=nails[_ni];
    if(Math.abs(_nl.x-_lg.x)<_lg.ax+NAIL_R && Math.abs(_nl.y-_lg.y)<_lg.ay+NAIL_R){ _rev=true;
    break; } } }catch(e){} if(_rev){ _lg.vx=-_lg.vx;
    _lg.vy=-_lg.vy; _lg.x+=_lg.vx*2.4;
    _lg.y+=_lg.vy*2.4; } if(_lg.vx!==0){ if(_lg.x<WALL+_lg.ax){ _lg.x=WALL+_lg.ax;
    _lg.vx=Math.abs(_lg.vx);
    } else if(_lg.x>W-WALL-_lg.ax){ _lg.x=W-WALL-_lg.ax;
    _lg.vx=-Math.abs(_lg.vx);
    } } if(_lg.vy!==0){ var _tb=NET_DEPTH+GOAL_AREA_D+_lg.ay, _bb=H-NET_DEPTH-GOAL_AREA_D-_lg.ay;
    if(_lg.y<_tb){ _lg.y=_tb;
    _lg.vy=Math.abs(_lg.vy);
    } else if(_lg.y>_bb){ _lg.y=_bb;
    _lg.vy=-Math.abs(_lg.vy);
    } } } }
    function initJungleBananas(){ jungleBananas=[];
    var occ=[]; try{ for(var i=0;i<nails.length;i++) occ.push({x:nails[i].x,y:nails[i].y,r:NAIL_R});
    }catch(e){} try{ if(coin) occ.push({x:coin.x,y:coin.y,r:COIN_R});
    }catch(e){} try{ var _vp=jungleVines();
    for(var _vk=0;_vk<_vp.length;_vk++) occ.push({x:_vp[_vk].x,y:_vp[_vk].y,r:16});
    }catch(e){} var cand=[[0.3,
    0.42],[0.72,0.36],[0.5,0.5],
    [0.3,0.6],[0.68,0.62],[0.5,
    0.3],[0.5,0.72],[0.7,0.5]], want=[0,
    2,3][hzTier()]||0, r=7; for(var c=0;c<cand.length&&jungleBananas.length<want;c++){ var x=WALL+cand[c][0]*(W-WALL*2), y=WALL+cand[c][1]*(H-WALL*2), ok=true;
    if(y<NET_DEPTH+GOAL_AREA_D+r||y>H-NET_DEPTH-GOAL_AREA_D-r) continue;
    for(var k=0;k<occ.length&&ok;k++){ if(Math.hypot(x-occ[k].x,y-occ[k].y)<occ[k].r+r+6) ok=false;
    } if(!ok) continue; jungleBananas.push({x:x,y:y,r:r,a:(c*1.7)%6.283});
    occ.push({x:x,y:y,r:r});
    } }
    // BEACH — additive: easy waves / med +crabs / hard +beach balls.
    // crabs & beach balls are placed clear of nails, the coin and each other.
    function _beOcc(){ var occ=[];
    try{ for(var i=0;i<nails.length;i++) occ.push({x:nails[i].x,y:nails[i].y,r:NAIL_R});
    }catch(e){} try{ if(coin) occ.push({x:coin.x,y:coin.y,r:COIN_R});
    }catch(e){} try{ for(var c=0;c<beachCrabs.length;c++) occ.push({x:beachCrabs[c].x,y:beachCrabs[c].y,r:9});
    }catch(e){} try{ for(var b=0;b<beachBalls.length;b++) occ.push({x:beachBalls[b].x,y:beachBalls[b].y,r:beachBalls[b].r});
    }catch(e){} return occ; }
    function _bePick(cands,r,pad){ var occ=_beOcc();
    for(var i=0;i<cands.length;i++){ var x=WALL+cands[i][0]*(W-WALL*2), y=WALL+cands[i][1]*(H-WALL*2);
    if(y<NET_DEPTH+GOAL_AREA_D+r||y>H-NET_DEPTH-GOAL_AREA_D-r) continue;
    var ok=true; for(var k=0;k<occ.length&&ok;k++){ if(Math.hypot(x-occ[k].x,y-occ[k].y)<occ[k].r+r+(pad||6)) ok=false;
    } if(ok) return {x:x,y:y};
    } return null; }
    function initBeachCrabs(){ beachCrabs=[];
    var cn=[0,1,2][hzTier()]||0, cand=[[0.28,
    0.40],[0.72,0.60],[0.5,0.5],
    [0.3,0.66],[0.7,0.34]]; for(var i=0;i<cn;i++){ var p=_bePick(cand,10,8);
    if(!p) continue; var a=Math.random()*6.283, sp=0.3+Math.random()*0.2;
    beachCrabs.push({x:p.x,y:p.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,sp:sp,turn:40+Math.floor(Math.random()*60)});
    } }
    function initBeachBalls(){ beachBalls=[];
    var n=[0,0,2][hzTier()]||0, cand=[[0.5,
    0.34],[0.5,0.66],[0.32,0.5],
    [0.68,0.5],[0.5,0.5]]; for(var i=0;i<n;i++){ var p=_bePick(cand,8,8);
    if(!p) continue; beachBalls.push({x:p.x,y:p.y,vx:0,vy:0,r:8,spin:0});
    } }
    function _beEnsure(){ if(_beInited) return; try{ if(nails&&nails.length){ if(hzTier()>=1) initBeachCrabs(); if(hzTier()>=2) initBeachBalls(); _beInited=true; } }catch(e){} }
    // wave band shared by physics push and rendering; direction rotates each cycle
    // one wave sweeps during the first `per` units of each `cycle`, then the water rests
    // (returns null) for the remainder so waves aren't constantly on screen
    function beachWave(){ var cycle=540, per=190, t=beachWaveT%cycle;
    if(t>=per) return null; var wp=t/per, span, pos, dir=beachWaveDir;
    if(dir<=1){ span=H-2*NET_DEPTH;
    pos=(dir===0)?(NET_DEPTH+wp*span):((H-NET_DEPTH)-wp*span);
    return {axis:'h', pos:pos, px:0, py:(dir===0?1:-1), wp:wp};
    } span=W-2*WALL; pos=(dir===2)?(WALL+wp*span):((W-WALL)-wp*span);
    return {axis:'v', pos:pos, px:(dir===2?1:-1), py:0, wp:wp};
    }
    // integrate crabs (patrol) and beach balls (roll + friction until they settle); runs from the draw loop so motion continues between shots
    function beachTick(){ if(!((typeof boardKey!=='undefined')&&boardKey==='beach'&&(typeof stadiumHazards==='function')&&stadiumHazards())) return;
    if(typeof phase!=='undefined'&&phase!=='play') return;
    _beEnsure(); var _bt=hzTier();
    if(_bt>=1){ var _cyT=NET_DEPTH+GOAL_AREA_D+12, _cyB=H-NET_DEPTH-GOAL_AREA_D-12;
    for(var _ci=0;_ci<beachCrabs.length;_ci++){ var _cr=beachCrabs[_ci];
    if(_cr._aftShock) continue;   // AFTERSHOCK: a zapped crab stops scuttling for a flick
    if((_cr.turn=(_cr.turn||0)-1)<=0){ var _na=Math.atan2(_cr.vy,_cr.vx)+(Math.random()-0.5)*2.2;
    _cr.vx=Math.cos(_na)*_cr.sp;
    _cr.vy=Math.sin(_na)*_cr.sp;
    _cr.turn=40+Math.floor(Math.random()*60);
    } _cr.x+=_cr.vx; _cr.y+=_cr.vy;
    if(_cr.x<WALL+12){_cr.x=WALL+12;
    _cr.vx=Math.abs(_cr.vx);
    } else if(_cr.x>W-WALL-12){_cr.x=W-WALL-12;
    _cr.vx=-Math.abs(_cr.vx);
    } if(_cr.y<_cyT){_cr.y=_cyT;
    _cr.vy=Math.abs(_cr.vy);
    } else if(_cr.y>_cyB){_cr.y=_cyB;
    _cr.vy=-Math.abs(_cr.vy);
    } for(var _nk=0;_nk<nails.length;_nk++){ var _nn=nails[_nk];
    var _cdx=_cr.x-_nn.x,_cdy=_cr.y-_nn.y,_cd=Math.hypot(_cdx,_cdy),_cmn=NAIL_R+8;
    if(_cd>0&&_cd<_cmn){ var _cux=_cdx/_cd,_cuy=_cdy/_cd;
    _cr.x=_nn.x+_cux*_cmn; _cr.y=_nn.y+_cuy*_cmn;
    var _cdot=_cr.vx*_cux+_cr.vy*_cuy;
    if(_cdot<0){ _cr.vx-=2*_cdot*_cux;
    _cr.vy-=2*_cdot*_cuy; } } else if(_cd===0){ _cr.x+=_cmn;
    } } if((typeof moving==='undefined'||!moving)&&typeof coin!=='undefined'&&coin){ var _odx=_cr.x-coin.x,_ody=_cr.y-coin.y,_od=Math.hypot(_odx,_ody),_omn=COIN_R+8;
    if(_od>0&&_od<_omn){ var _oux=_odx/_od,_ouy=_ody/_od;
    _cr.x=coin.x+_oux*_omn; _cr.y=coin.y+_ouy*_omn;
    var _odot=_cr.vx*_oux+_cr.vy*_ouy;
    if(_odot<0){ _cr.vx-=2*_odot*_oux;
    _cr.vy-=2*_odot*_ouy; } } } } } if(_bt>=2){ var _bwv=beachWave();
    for(var _bi=0;_bi<beachBalls.length;_bi++){ var _bb=beachBalls[_bi];
    if(_bwv&&Math.hypot(_bb.vx,_bb.vy)<0.7){ if(_bwv.axis==='h'){ if(Math.abs(_bb.y-_bwv.pos)<16){ _bb.vy+=0.08*_bwv.py;
    _bb.vx+=(Math.sin(_bb.x*0.3)*0.03);
    } } else { if(Math.abs(_bb.x-_bwv.pos)<16){ _bb.vx+=0.08*_bwv.px;
    _bb.vy+=(Math.sin(_bb.y*0.3)*0.03);
    } } } if(_bb.vx!==0||_bb.vy!==0){ _bb.x+=_bb.vx;
    _bb.y+=_bb.vy; _bb.spin+=(_bb.vx+_bb.vy)*0.04;
    if(_bb.x<WALL+_bb.r){_bb.x=WALL+_bb.r;
    _bb.vx=Math.abs(_bb.vx);
    } if(_bb.x>W-WALL-_bb.r){_bb.x=W-WALL-_bb.r;
    _bb.vx=-Math.abs(_bb.vx);
    } if(_bb.y<NET_DEPTH+_bb.r){_bb.y=NET_DEPTH+_bb.r;
    _bb.vy=Math.abs(_bb.vy);
    } if(_bb.y>H-NET_DEPTH-_bb.r){_bb.y=H-NET_DEPTH-_bb.r;
    _bb.vy=-Math.abs(_bb.vy);
    } _bb.vx*=0.965; _bb.vy*=0.965;
    if(Math.hypot(_bb.vx,_bb.vy)<0.12){ _bb.vx=0;
    _bb.vy=0; } } } for(var _cci=0;_cci<beachCrabs.length;_cci++){ var _cc=beachCrabs[_cci];
    for(var _bj=0;_bj<beachBalls.length;_bj++){ var _b2=beachBalls[_bj];
    var _dx=_b2.x-_cc.x,_dy=_b2.y-_cc.y,_dd=Math.hypot(_dx,_dy),_mn=9+_b2.r;
    if(_dd<_mn&&_dd>0){ var _ux=_dx/_dd,_uy=_dy/_dd,_ov=_mn-_dd;
    _b2.x+=_ux*_ov; _b2.y+=_uy*_ov;
    _b2.vx+=_ux*(_cc.sp*1.5+0.35);
    _b2.vy+=_uy*(_cc.sp*1.5+0.35);
    var _cap=Math.hypot(_b2.vx,_b2.vy);
    if(_cap>4){ _b2.vx*=4/_cap;
    _b2.vy*=4/_cap; } } } } for(var _bk=0;_bk<beachBalls.length;_bk++){ var _bl=beachBalls[_bk];
    for(var _nk=0;_nk<nails.length;_nk++){ var _nn=nails[_nk];
    var _ndx=_bl.x-_nn.x,_ndy=_bl.y-_nn.y,_nd=Math.hypot(_ndx,_ndy),_nmn=NAIL_R+_bl.r;
    if(_nd>0&&_nd<_nmn){ var _nux=_ndx/_nd,_nuy=_ndy/_nd,_nov=_nmn-_nd;
    _bl.x+=_nux*_nov; _bl.y+=_nuy*_nov;
    var _ndot=_bl.vx*_nux+_bl.vy*_nuy;
    if(_ndot<0){ _bl.vx-=1.6*_ndot*_nux;
    _bl.vy-=1.6*_ndot*_nuy; } } else if(_nd===0){ _bl.x+=NAIL_R+_bl.r;
    } } } } }
    function aqBubbles(){ var n=[0,
    2,3][hzTier()]||1, P=[[0.3,
    0.34],[0.7,0.66],[0.5,0.5]], out=[];
    for(var i=0;i<n&&i<P.length;i++) out.push({x:WALL+P[i][0]*(W-WALL*2), y:WALL+P[i][1]*(H-WALL*2)});
    return out; }
    function aqWhirl(){ var n=[0,
    0,1][hzTier()]||0, P=[[0.34,
    0.42],[0.66,0.6]], out=[];
    for(var i=0;i<n&&i<P.length;i++) out.push({x:WALL+P[i][0]*(W-WALL*2), y:WALL+P[i][1]*(H-WALL*2), r:42});
    return out; }
    function spacePlates(){ var P=[[0.28,0.30],[0.72,0.30],[0.28,0.70],[0.72,0.70]], out=[]; for(var i=0;i<P.length;i++) out.push({x:WALL+P[i][0]*(W-WALL*2), y:WALL+P[i][1]*(H-WALL*2)}); return out; }
    // SPACE (ORBIT LAB) — additive: easy gravity wells / med +drifting asteroids / hard +black hole
    var spaceAsteroids=[], _spInited=false, bhCD=0;
    function initSpaceAsteroids(){ spaceAsteroids=[];
    var want=[0,2,3][hzTier()]||0, pad=NET_DEPTH+GOAL_AREA_D+18;
    for(var i=0;i<want;i++){ var a=Math.random()*6.283, sp=0.6+Math.random()*0.5;
    spaceAsteroids.push({x:WALL+24+Math.random()*(W-2*WALL-48), y:pad+Math.random()*(H-2*pad), vx:Math.cos(a)*sp, vy:Math.sin(a)*sp, r:7+(i%2)*2, spin:0});
    } }
    function _spEnsure(){ if(_spInited) return; try{ if(nails&&nails.length){ if(hzTier()>=1) initSpaceAsteroids(); _spInited=true; } }catch(e){} }
    // asteroids drift continuously and bounce off the walls (driven from the draw loop)
    function spaceAsteroidsTick(){ if(!((typeof boardKey!=='undefined')&&boardKey==='space'&&(typeof stadiumHazards==='function')&&stadiumHazards()&&hzTier()>=1)) return;
    if(typeof phase!=='undefined'&&phase!=='play') return;
    if(!spaceAsteroids.length) _spEnsure();
    for(var i=0;i<spaceAsteroids.length;i++){ var a=spaceAsteroids[i];
    a.x+=a.vx; a.y+=a.vy; a.spin+=0.02;
    if(a.x<WALL+a.r){a.x=WALL+a.r;
    a.vx=Math.abs(a.vx);} if(a.x>W-WALL-a.r){a.x=W-WALL-a.r;
    a.vx=-Math.abs(a.vx);} if(a.y<NET_DEPTH+a.r){a.y=NET_DEPTH+a.r;
    a.vy=Math.abs(a.vy);} if(a.y>H-NET_DEPTH-a.r){a.y=H-NET_DEPTH-a.r;
    a.vy=-Math.abs(a.vy);} } }
    // SKATE (skate-park) hazards — ADDITIVE by difficulty:
    //  easy  : flowing S/curve guide tracks (coin-wide; run over players if they cross;
    //          only grab the ball when it's flicked IN or OUT along the track)
    //  med   : + side walls are curved half-pipe transitions (no hard bounce; soft flick rolls
    //          up and back, strong flick launches as a chip shot that returns faster)
    //  hard  : + dash-shaped kicker humps (flick hard over one = launch airborne; roll slow = pass over)
    var skateTrackPts=[], skateBumpList=[], _skInited=false;
    function _skBez(p0,p1,p2,p3,n){ var out=[];
    for(var i=0;i<=n;i++){ var t=i/n,u=1-t;
    out.push({x:u*u*u*p0.x+3*u*u*t*p1.x+3*u*t*t*p2.x+t*t*t*p3.x, y:u*u*u*p0.y+3*u*u*t*p1.y+3*u*t*t*p2.y+t*t*t*p3.y});
    } return out; }
    function initSkateHaz(){ skateTrackPts=[];
    skateBumpList=[]; var pad=NET_DEPTH+GOAL_AREA_D+14, x0=WALL+16, x1=W-WALL-16;
    for(var k=0;k<2;k++){ var up=(k===0), yMouth=up?H*0.44:H*0.56, yGoal=up?pad:(H-pad), lane=up?(0.20+Math.random()*0.10):(0.70+Math.random()*0.10), cx=x0+(x1-x0)*lane, amp=(x1-x0)*0.16*(0.7+Math.random()*0.6), s1=(Math.random()<0.5?1:-1), s2=(Math.random()<0.5?1:-1);
    var p0={x:cx,y:yMouth}, p1={x:cx+s1*amp,y:yMouth+(yGoal-yMouth)*0.34}, p2={x:cx+s2*amp,y:yMouth+(yGoal-yMouth)*0.66}, p3={x:cx+(s1===s2?s1*amp*0.3:0),y:yGoal};
    var pts=_skBez(p0,p1,p2,p3,26);
    for(var i=0;i<pts.length;i++){ pts[i].x=Math.max(x0,Math.min(x1,pts[i].x));
    } skateTrackPts.push({pts:pts});
    } var cand=[[0.5,0.24],[0.5,
    0.76],[0.18,0.5],[0.82,0.5],
    [0.5,0.38],[0.5,0.62],[0.18,
    0.66],[0.82,0.34],[0.32,
    0.84],[0.68,0.16],[0.18,
    0.34],[0.82,0.66]], r=11;
    for(var c=0;c<cand.length&&skateBumpList.length<3;c++){ var x=WALL+cand[c][0]*(W-WALL*2), y=WALL+cand[c][1]*(H-WALL*2), ok=true;
    if(y<pad||y>H-pad) continue;
    if(Math.hypot(x-W/2,y-H/2)<COIN_R+14) continue;
    for(var t2=0;t2<skateTrackPts.length&&ok;t2++){ var pp=skateTrackPts[t2].pts;
    for(var q=0;q<pp.length;q++){ if(Math.hypot(x-pp[q].x,y-pp[q].y)<r+COIN_R*1.5+2){ ok=false;
    break; } } } if(!ok) continue;
    try{ for(var nn=0;nn<nails.length&&ok;nn++){ if(Math.hypot(x-nails[nn].x,y-nails[nn].y)<NAIL_R+r+4) ok=false;
    } }catch(e){} if(!ok) continue;
    for(var o=0;o<skateBumpList.length&&ok;o++){ if(Math.hypot(x-skateBumpList[o].x,y-skateBumpList[o].y)<r*2.8) ok=false;
    } if(!ok) continue; skateBumpList.push({x:x,y:y,w:24,h:9});
    } try{ relocateNailsOffTracks();
    }catch(e){} }
    function _skEnsure(){ if(!_skInited){ try{ if(nails&&nails.length){ initSkateHaz(); _skInited=true; } }catch(e){ initSkateHaz(); _skInited=true; } } }
    // players never overlap a track — nudge any that do off to the nearest clear side (AI recommend)
    function relocateNailsOffTracks(){ if(typeof nails==='undefined'||!nails||!skateTrackPts.length) return;
    var _cl=1.5*COIN_R+NAIL_R+5;
    for(var _ni=0;_ni<nails.length;_ni++){ var _n=nails[_ni];
    if(_n.goalie) continue; for(var _it=0;_it<8;_it++){ var _bd=1e9,_bnx=1,_bny=0;
    for(var _ti=0;_ti<skateTrackPts.length;_ti++){ var _pp=skateTrackPts[_ti].pts;
    for(var _q=0;_q<_pp.length-1;_q++){ var _ax=_pp[_q].x,_ay=_pp[_q].y,_ex=_pp[_q+1].x-_ax,_ey=_pp[_q+1].y-_ay,_l2=(_ex*_ex+_ey*_ey)||1,_tp=Math.max(0,Math.min(1,((_n.x-_ax)*_ex+(_n.y-_ay)*_ey)/_l2)),_px=_ax+_ex*_tp,_py=_ay+_ey*_tp,_dd=Math.hypot(_n.x-_px,_n.y-_py);
    if(_dd<_bd){ _bd=_dd; var _el=Math.hypot(_ex,_ey)||1, _nlx=-_ey/_el, _nly=_ex/_el, _sd=((_n.x-_px)*_nlx+(_n.y-_py)*_nly)>=0?1:-1;
    _bnx=_nlx*_sd; _bny=_nly*_sd;
    } } } if(_bd>=_cl) break;
    _n.x+=_bnx*(_cl-_bd+1); _n.y+=_bny*(_cl-_bd+1);
    _n.x=Math.max(WALL+NAIL_R+1,Math.min(W-WALL-NAIL_R-1,_n.x));
    _n.y=Math.max(WALL+NAIL_R+1,Math.min(H-WALL-NAIL_R-1,_n.y));
    try{ if(typeof resolveSpot==='function'){ var _sp=resolveSpot(_n.x,_n.y,_n);
    _n.x=_sp.x; _n.y=_sp.y; } }catch(e){} } } }
    function skateTracks(){ _skEnsure(); return skateTrackPts; }
    function skateBumps(){ _skEnsure(); return skateBumpList; }
    // A track is a WALLED channel: the ball can only get on it through a mouth (front, aligned);
    // anywhere else its body is a solid wall the ball bounces off — so it can't snag from the side.
    function skateTrackStep(){ if(!((typeof boardKey!=='undefined')&&boardKey==='skate'&&(typeof stadiumHazards==='function')&&stadiumHazards())) return;
    if(coin.air>0||skateTube) return;
    _skEnsure(); var _HW=1.5*COIN_R, _sp=Math.hypot(coin.vx,coin.vy), _vhx=_sp>0.001?coin.vx/_sp:0, _vhy=_sp>0.001?coin.vy/_sp:0;
    for(var _ti=0;_ti<skateTrackPts.length;_ti++){ var _pp=skateTrackPts[_ti].pts, _lst=_pp.length-1;
    var _bd=1e9,_bpx=0,_bpy=0;
    for(var _q=0;_q<_lst;_q++){ var _ax=_pp[_q].x,_ay=_pp[_q].y,_ex=_pp[_q+1].x-_ax,_ey=_pp[_q+1].y-_ay,_l2=(_ex*_ex+_ey*_ey)||0.0001,_tpr=((coin.x-_ax)*_ex+(coin.y-_ay)*_ey)/_l2;
    _tpr=Math.max(0,Math.min(1,_tpr));
    var _px=_ax+_ex*_tpr,_py=_ay+_ey*_tpr,_dd=Math.hypot(coin.x-_px,coin.y-_py);
    if(_dd<_bd){ _bd=_dd; _bpx=_px;
    _bpy=_py; } } var _dE0=Math.hypot(coin.x-_pp[0].x,coin.y-_pp[0].y), _dEL=Math.hypot(coin.x-_pp[_lst].x,coin.y-_pp[_lst].y), _nearMouth=(Math.min(_dE0,_dEL)<COIN_R*5);
    if(_nearMouth && _sp>1.0){ var _useE0=(_dE0<=_dEL), _E=_useE0?_pp[0]:_pp[_lst], _Nb=_useE0?_pp[1]:_pp[_lst-1], _tx=_Nb.x-_E.x, _ty=_Nb.y-_E.y, _tl=Math.hypot(_tx,_ty)||1;
    _tx/=_tl; _ty/=_tl; var _vx2=coin.x-_E.x, _vy2=coin.y-_E.y, _along=-(_vx2*_tx+_vy2*_ty), _perp=Math.abs(_vx2*(-_ty)+_vy2*_tx);
    var _mb=false; try{ for(var _mn=0;_mn<nails.length;_mn++){ var _mnn=nails[_mn];
    if(_mnn.goalie) continue;
    var _mdx=_mnn.x-_E.x,_mdy=_mnn.y-_E.y,_man=-(_mdx*_tx+_mdy*_ty),_mpn=Math.abs(_mdx*(-_ty)+_mdy*_tx);
    if(_man>-COIN_R && _man<20 && _mpn<NAIL_R+COIN_R){ _mb=true;
    break; } } }catch(e){} if(!_mb && _along>-COIN_R*1.6 && _along<18 && _perp<COIN_R*1.9 && (_vhx*_tx+_vhy*_ty)>0.35){ skateTube={ti:_ti, v:(_useE0?_sp:-_sp)};
    try{ if(typeof sfxGuided==='function') sfxGuided();
    }catch(e){} return; } } if(_bd>0.01 && _bd<_HW+COIN_R){ var _nx=(coin.x-_bpx)/_bd,_ny=(coin.y-_bpy)/_bd,_pen=(_HW+COIN_R)-_bd;
    coin.x+=_nx*_pen; coin.y+=_ny*_pen;
    var _vn=coin.vx*_nx+coin.vy*_ny;
    if(_vn<0){ coin.vx-=1.75*_vn*_nx;
    coin.vy-=1.75*_vn*_ny; if(Math.hypot(coin.vx,coin.vy)>1.1){ try{ if(typeof sfxBounce==='function') sfxBounce(Math.abs(_vn));
    }catch(e){} try{ spawnSparks(coin.x,coin.y,null,4,true);
    }catch(e){} } } return; } } }
    // side-wall transition (med+): soft flick rolls up and back with almost no energy loss;
    // a strong flick launches as a chip shot (airborne) that returns faster.
    function skateTransition(){ var _sv=Math.abs(coin.vx);
    if(_sv>3.4 && (!coin.air||coin.air<=0)){ coin.air=18;
    coin.air0=18; coin.vx=-coin.vx*1.16;
    coin.vy*=1.05; try{ if(typeof sfxGuided==='function') sfxGuided();
    }catch(e){} try{ setStatus('AIR!');
    }catch(e){} } else { coin.vx=-coin.vx*0.97;
    } try{ spawnSparks(coin.x,coin.y,current,6);
    }catch(e){} }
    // curved half-pipe frame wall (med+): the ball rolls onto the wall and, if it lacks the
    // speed to reach the top, slides back down; a strong hit pops to air and returns faster.
    function skateWallStep(){ if(!((typeof boardKey!=='undefined')&&boardKey==='skate'&&(typeof stadiumHazards==='function')&&stadiumHazards()&&hzTier()>=1)) return;
    if(coin.air>0||skateTube) return;
    var _lft=WALL+COIN_R, _rgt=W-WALL-COIN_R, _wl=4, _wr=W-4, _K=0.12;
    if(coin.x<_lft){ coin.vx+=_K*(_lft-coin.x);
    if(coin.x<=_wl){ coin.x=_wl;
    var _vi=Math.abs(coin.vx);
    if(coin.vx<0){ if(_vi>2.6){ coin.air=18;
    coin.air0=18; coin.vx=_vi*1.22+1;
    coin.vy*=1.04; try{ if(typeof sfxGuided==='function') sfxGuided();
    }catch(e){} try{ setStatus('AIR!');
    }catch(e){} } else { coin.vx=_vi*0.9+0.3;
    } try{ spawnSparks(coin.x,coin.y,current,5);
    }catch(e){} } } } else if(coin.x>_rgt){ coin.vx-=_K*(coin.x-_rgt);
    if(coin.x>=_wr){ coin.x=_wr;
    var _vi2=Math.abs(coin.vx);
    if(coin.vx>0){ if(_vi2>2.6){ coin.air=18;
    coin.air0=18; coin.vx=-(_vi2*1.22+1);
    coin.vy*=1.04; try{ if(typeof sfxGuided==='function') sfxGuided();
    }catch(e){} try{ setStatus('AIR!');
    }catch(e){} } else { coin.vx=-(_vi2*0.9+0.3);
    } try{ spawnSparks(coin.x,coin.y,current,5);
    }catch(e){} } } } }
    function jungleVines(){ var n=[1,
    2,3][hzTier()]||1, P=[[0.26,
    0.32],[0.72,0.46],[0.44,
    0.66]], out=[]; for(var i=0;i<n&&i<P.length;i++) out.push({x:WALL+P[i][0]*(W-WALL*2), y:WALL+P[i][1]*(H-WALL*2), dir:(i%2?1:-1)});
    return out; }
    function diceFaces(){ var o=[]; for(var i=0;i<dice.length;i++) o.push(dice[i].t); return o; }
    // a valid cube orientation: top t, north n, east e (no two are equal or opposite/sum-7)
    function diceOrient(){ var t=1+Math.floor(Math.random()*6), opts=[];
    for(var v=1;v<=6;v++){ if(v!==t&&v!==7-t) opts.push(v);
    } var n=opts[Math.floor(Math.random()*opts.length)];
    var eo=[]; for(var w=1;w<=6;w++){ if(w!==t&&w!==7-t&&w!==n&&w!==7-n) eo.push(w);
    } var e=eo[Math.floor(Math.random()*eo.length)];
    return {t:t,n:n,e:e}; }
    // static dice dropped at kickoff on clear spots (not on the wheel, goal boxes, nails or the ball)
    function initDice(){ dice=[];
    if(hzTier()<1) return; var cands=[[0.26,
    0.42],[0.74,0.42],[0.26,
    0.58],[0.74,0.58],[0.5,0.3],
    [0.5,0.7],[0.32,0.5],[0.68,
    0.5],[0.4,0.36],[0.6,0.64]], scored=[];
    for(var si=0;si<cands.length;si++){ var x=WALL+cands[si][0]*(W-WALL*2), y=WALL+cands[si][1]*(H-WALL*2);
    if(Math.hypot(x-W/2,y-H/2)<ROUL_R+16) continue;
    if(y<NET_DEPTH+GOAL_AREA_D+12||y>H-NET_DEPTH-GOAL_AREA_D-12) continue;
    var clr=1e9; try{ if(coin) clr=Math.min(clr,Math.hypot(x-coin.x,y-coin.y));
    }catch(e){} try{ for(var ni=0;ni<nails.length;ni++){ clr=Math.min(clr,Math.hypot(x-nails[ni].x,y-nails[ni].y));
    } }catch(e){} scored.push({x:x,y:y,clr:clr});
    } scored.sort(function(a,b){ return b.clr-a.clr;
    }); for(var k=0;k<scored.length&&dice.length<2;k++){ if(dice.length&&Math.hypot(scored[k].x-dice[0].x,scored[k].y-dice[0].y)<30) continue;
    var o=diceOrient(); dice.push({x:scored[k].x,y:scored[k].y,sz:8,tumble:0,t:o.t,n:o.n,e:o.e,face:o.t});
    } }
    function initNumBoxes(){ numBoxes=[];
    rouletteBox=null; if(hzTier()<2) return;
    var x0=WALL+3, x1=W-WALL-3, y0=NET_DEPTH+GOAL_AREA_D+1, y1=H-NET_DEPTH-GOAL_AREA_D-1, COLS=3, ROWS=6, cw=(x1-x0)/COLS, ch=(y1-y0)/ROWS, total=COLS*ROWS, nums=[];
    for(var i=0;i<total;i++) nums.push(1+(i%6));
    for(var s=total-1;s>0;s--){ var j=Math.floor(Math.random()*(s+1)), t=nums[s];
    nums[s]=nums[j]; nums[j]=t;
    } var idx=0; for(var r=0;r<ROWS;r++){ for(var c=0;c<COLS;c++){ numBoxes.push({x:x0+cw*(c+0.5),y:y0+ch*(r+0.5),n:nums[idx++],w:cw,h:ch,r:r,c:c});
    } } for(var _wb=0;_wb<numBoxes.length;_wb++){ var _wbb=numBoxes[_wb], _wcy=Math.max(_wbb.y-_wbb.h/2,Math.min(H/2,_wbb.y+_wbb.h/2));
    if(Math.abs(_wbb.x-W/2)<_wbb.w*0.5-2 && Math.abs(_wcy-H/2)<ROUL_R+COIN_R) _wbb.n=0;
    } try{ if(typeof dice!=='undefined'){ for(var _dd=0;_dd<dice.length;_dd++){ var _dx=dice[_dd].x,_dy=dice[_dd].y;
    for(var _bx=0;_bx<numBoxes.length;_bx++){ var _bb=numBoxes[_bx];
    if(Math.abs(_dx-_bb.x)<=_bb.w/2&&Math.abs(_dy-_bb.y)<=_bb.h/2){ _bb.n=0;
    break; } } } } }catch(e){} }
    /* SPORTS DAY — the season-3 final. Like THE FINAL (S1) and THE TURF (S2) it does not invent hazards: it
       BORROWS them, by widening each source arena's predicate with || _pd('key') so that arena's existing
       roll/step/draw code fires on the podium board. Each tier is a different trio of events at matching
       severity — a decathlon, not the same arenas turned up:
         easy  WATER (golf)   + ROPES (ring)   + ROAMING DEFENCE (gridiron)   — a place to avoid, a changed
                                                                                wall, a living obstacle; none
                                                                                of them can deny a goal
         med   OIL (prix)     + RAKE GATE (alley) + NET & RACKETS (tennis)
         hard  HOOPS (court)  + GLOVES (ring)  + START-LIGHTS (prix)
       The hard trio is deliberately one denial + one redirect + one TAX: the lights never stop a goal, they
       charge for a mistimed release, so the final stays winnable. (The golf CUPS sat in this slot first —
       a second swallow-the-ball denial next to the hoops, and on an athletics infield a sprint start reads
       far better than a putting green. The 'cups' key still works if we ever want them back.) */
    function _podHaz(){ if(!((typeof boardKey!=='undefined')&&boardKey==='podium'&&(typeof stadiumHazards==='function')&&stadiumHazards())) return null;
    var t=(typeof hzTier==='function')?hzTier():1;
    return [['water','ropes','roam'],['oil','rake','net'],['hoops','gloves','lights']][t]; }
    function _pd(n){ var h=_podHaz(); return !!(h&&h.indexOf(n)>=0); }
    // GRASS FINAL — season-1 gauntlet. THE FINAL (royaleArena.gauntlet) pulls one hazard per tier from
    // clean-porting Season 1 stadiums. Each stadium's arena predicate is generalized with || _g1('x'),
    // so the existing roll/step/draw all fire on the grass final for exactly the active tier's hazard.
    function _gHaz(){ if(!((typeof royaleArena!=='undefined')&&royaleArena&&royaleArena.gauntlet&&(typeof stadiumHazards==='function')&&stadiumHazards())) return null;
    var t=hzTier(); return [['bush',
    'cacti','web','slippery'],
    ['mud','geyser','web','spider',
    'puddle'],['bush','snake',
    'devil','crate','blizzard']][t];
    }
    function _g1(n){ var g=_gHaz(); return !!(g&&g.indexOf(n)>=0); }
    // TURF FINAL — season-2 gauntlet. The final's difficulty picks the TIER of hazard pulled from
    // 4 stadiums (Thunderdome / Orbit Lab / Vine Ruins / The Shore): easy=each stadium's easy hazard,
    // medium=each medium hazard, hard=each hard hazard. Exactly 4 hazards active at once.
    function _tHaz(){ if(!((typeof boardKey!=='undefined')&&boardKey==='turf'&&(typeof stadiumHazards==='function')&&stadiumHazards())) return null;
    var t=hzTier(); return { storm:['gust',
    'puddle','lightning'][t], space:['gravity',
    'asteroid','blackhole'][t], jungle:['vine',
    'banana','log'][t], beach:['wave',
    'crab','beachball'][t] };
    }
    function turfStep(){ var Hz=_tHaz(); if(!Hz||scoring) return; var _air=(!coin.air||coin.air<=0);
      // STORM
      if(Hz.storm==='gust'){ if(typeof stormGust!=='undefined'&&stormGust){ var _e=Math.sin(stormGust.t/stormGust.dur*Math.PI),_m=stormGust.mag*_e;
      if(Math.hypot(coin.vx,coin.vy)>0.5){ coin.vx+=Math.cos(stormGust.ang)*_m;
      coin.vy+=Math.sin(stormGust.ang)*_m;
      } } }
      else if(Hz.storm==='puddle'&&_air){ var _pd=stormPuddles();
      for(var _pi=0;_pi<_pd.length;_pi++){ var _p=_pd[_pi];
      if(Math.hypot(coin.x-_p.x,coin.y-_p.y)<_p.r){ var _s=Math.hypot(coin.vx,coin.vy);
      if(_s>0.5){ try{ splashPuddle(coin.x,coin.y,_s>4.5?3:2,_s>4.5);
      }catch(e){} } if(_s>4.5){ coin.vx*=0.985;
      coin.vy*=0.985; } else { coin.vx*=0.78;
      coin.vy*=0.78; } break; } } }
      // SPACE
      if(Hz.space==='gravity'){ var _pl=spacePlates();
      for(var _gi=0;_gi<_pl.length;_gi++){ var _dx=_pl[_gi].x-coin.x,_dy=_pl[_gi].y-coin.y,_d=Math.hypot(_dx,_dy);
      if(_d<54&&_d>0.5){ var _f=(1-_d/54)*0.08;
      coin.vx+=(_dx/_d)*_f; coin.vy+=(_dy/_d)*_f;
      } } }
      else if(Hz.space==='asteroid'&&_air){ for(var _ai=0;_ai<spaceAsteroids.length;_ai++){ var _as=spaceAsteroids[_ai],_adx=coin.x-_as.x,_ady=coin.y-_as.y,_add=Math.hypot(_adx,_ady),_amn=COIN_R+_as.r;
      if(_add<_amn&&_add>0){ var _aux=_adx/_add,_auy=_ady/_add;
      coin.x+=_aux*(_amn-_add);
      coin.y+=_auy*(_amn-_add);
      var _adot=coin.vx*_aux+coin.vy*_auy;
      if(_adot<0){ coin.vx-=1.8*_adot*_aux;
      coin.vy-=1.8*_adot*_auy;
      } _as.vx-=_aux*0.5; _as.vy-=_auy*0.5;
      var _ac=Math.hypot(_as.vx,_as.vy);
      if(_ac>2.2){ _as.vx*=2.2/_ac;
      _as.vy*=2.2/_ac; } try{ if(typeof sfxBump==='function') sfxBump(4);
      }catch(e){} } } }
      else if(Hz.space==='blackhole'){ if(bhCD>0){ bhCD--;
      } else { var _bx=W/2,_by=H/2,_bdx=_bx-coin.x,_bdy=_by-coin.y,_bd=Math.hypot(_bdx,_bdy);
      if(_bd<72&&_bd>0.5){ var _bf=(1-_bd/72)*0.14,_bux=_bdx/_bd,_buy=_bdy/_bd;
      coin.vx+=_bux*_bf-_buy*_bf*0.55;
      coin.vy+=_buy*_bf+_bux*_bf*0.55;
      if(_bd<11){ var _ea=Math.atan2(coin.vy,coin.vx)+2.3;
      coin.vx=Math.cos(_ea)*9;
      coin.vy=Math.sin(_ea)*9;
      coin.x=_bx+Math.cos(_ea)*14;
      coin.y=_by+Math.sin(_ea)*14;
      bhCD=48; try{ spawnSparks(_bx,_by,current,12);
      }catch(e){} try{ if(typeof sfxPortal==='function') sfxPortal();
      }catch(e){} } } } }
      // JUNGLE
      if(Hz.jungle==='vine'){ if(jungleCD>0) jungleCD--;
      var _vs=jungleVines(); for(var _vi=0;_vi<_vs.length;_vi++){ if(Math.hypot(coin.x-_vs[_vi].x,coin.y-_vs[_vi].y)<COIN_R+12){ coin.vx*=0.85;
      coin.vy*=0.85; jungleGrab={vx:_vs[_vi].x,vy:_vs[_vi].y,bx:coin.x,by:coin.y,life:12};
      if(jungleCD<=0){ try{ if(typeof sfxBump==='function') sfxBump(3);
      }catch(e){} jungleCD=10;
      } break; } } }
      else if(Hz.jungle==='banana'&&_air){ if(bananaCD>0) bananaCD--;
      if(bananaSlip>0) bananaSlip--;
      if(bananaCD<=0){ for(var _bi=0;_bi<jungleBananas.length;_bi++){ var _bn=jungleBananas[_bi];
      if(Math.hypot(coin.x-_bn.x,coin.y-_bn.y)<COIN_R+_bn.r){ var _da=(Math.random()-0.5)*1.1,_dc=Math.cos(_da),_ds=Math.sin(_da),_nvx=coin.vx*_dc-coin.vy*_ds,_nvy=coin.vx*_ds+coin.vy*_dc;
      coin.vx=_nvx*1.08; coin.vy=_nvy*1.08;
      bananaSlip=34; bananaCD=14;
      try{ if(typeof sfxCurl==='function') sfxCurl();
      }catch(e){} try{ setStatus('SLIP!');
      }catch(e){} break; } } } }
      else if(Hz.jungle==='log'&&_air){ for(var _li=0;_li<jungleLogs.length;_li++){ var _lg=jungleLogs[_li];
      if(Math.abs(coin.x-_lg.x)<_lg.ax+COIN_R&&Math.abs(coin.y-_lg.y)<_lg.ay+COIN_R){ if(_lg.vx!==0){ var _dir=(_lg.vx>=0?1:-1);
      coin.vx=_dir*Math.max(Math.abs(coin.vx),5.5);
      coin.vy+=(coin.y-_lg.y)*0.05;
      coin.x=_lg.x+_dir*(_lg.ax+COIN_R+1);
      } else { var _diry=(_lg.vy>=0?1:-1);
      coin.vy=_diry*Math.max(Math.abs(coin.vy),5.5);
      coin.vx+=(coin.x-_lg.x)*0.05;
      coin.y=_lg.y+_diry*(_lg.ay+COIN_R+1);
      } try{ if(typeof sfxBump==='function') sfxBump(7);
      }catch(e){} break; } } }
      // BEACH
      if(Hz.beach==='wave'&&_air){ var _wv=beachWave();
      if(_wv){ if(_wv.axis==='h'){ if(Math.abs(coin.y-_wv.pos)<20){ coin.vy+=0.10*_wv.py;
      coin.vx+=(Math.random()-0.5)*0.05;
      } } else { if(Math.abs(coin.x-_wv.pos)<20){ coin.vx+=0.10*_wv.px;
      coin.vy+=(Math.random()-0.5)*0.05;
      } } } }
      else if(Hz.beach==='crab'&&_air){ for(var _ci=0;_ci<beachCrabs.length;_ci++){ var _cr=beachCrabs[_ci],_crdx=coin.x-_cr.x,_crdy=coin.y-_cr.y,_crd=Math.hypot(_crdx,_crdy);
      if(_crd<COIN_R+9&&_crd>0){ coin.vx+=(_crdx/_crd)*2.6;
      coin.vy+=(_crdy/_crd)*2.6;
      try{ if(typeof sfxBump==='function') sfxBump(5);
      }catch(e){} if(TAC.aftershock&&!aftUsed){ try{ aftShock([_cr],_cr.x,_cr.y,4,false); }catch(e){} } } } }
      else if(Hz.beach==='beachball'&&_air){ for(var _bbi=0;_bbi<beachBalls.length;_bbi++){ var _bb=beachBalls[_bbi],_dxb=coin.x-_bb.x,_dyb=coin.y-_bb.y,_ddb=Math.hypot(_dxb,_dyb),_mnb=COIN_R+_bb.r;
      if(_ddb<_mnb&&_ddb>0){ var _uxb=_dxb/_ddb,_uyb=_dyb/_ddb;
      coin.x+=_uxb*(_mnb-_ddb);
      coin.y+=_uyb*(_mnb-_ddb);
      var _dotb=coin.vx*_uxb+coin.vy*_uyb;
      if(_dotb<0){ coin.vx-=1.7*_dotb*_uxb;
      coin.vy-=1.7*_dotb*_uyb;
      } var _imp=Math.max(0,-_dotb);
      _bb.vx-=_uxb*(_imp*0.55+0.5);
      _bb.vy-=_uyb*(_imp*0.55+0.5);
      var _bcap=Math.hypot(_bb.vx,_bb.vy);
      if(_bcap>5){ _bb.vx*=5/_bcap;
      _bb.vy*=5/_bcap; } try{ sfxBump(4);
      }catch(e){} } } }
    }
    function stepPhysics(){
      if(!moving){ if(typeof skateTube!=='undefined') skateTube=null;
      return; }
      if(cgDrown){ try{ cgDrownTick(); }catch(e){} return; }   // drowning: freeze play, just run the sink/drop
      if(coin&&coin.air>0) coin.air--;
      if((typeof boardKey!=='undefined')&&boardKey==='casino'&&!scoring&&stadiumHazards()){ if(rouletteFlash>0) rouletteFlash--;
      if(rouletteCD>0) rouletteCD--;
      if(!rouletteCap&&rouletteCD<=0&&moving&&(!coin.air||coin.air<=0)&&Math.hypot(coin.x-W/2,coin.y-H/2)<ROUL_R*0.55&&Math.hypot(coin.vx,coin.vy)>0.9){ rouletteCap={t:0,dur:64,ko:false};
      coin.vx=0; coin.vy=0; try{ if(typeof sfxCoinSpin==='function') sfxCoinSpin();
      }catch(e){} } if(rouletteCap){ if(rouletteCap.spin===undefined){ var _rt=hzTier(), _f=diceFaces(), _N, _box=null;
      if(_rt>=2){ var _oppGY=(current==='red')?NET_DEPTH:(H-NET_DEPTH), _cand=[];
      if(_f.length>=2){ for(var _q=0;_q<2;_q++){ for(var _bi=0;_bi<numBoxes.length;_bi++){ if(numBoxes[_bi].n===_f[_q]) _cand.push(numBoxes[_bi]);
      } } } if(!_cand.length){ for(var _bj=0;_bj<numBoxes.length;_bj++){ if(numBoxes[_bj].n>0) _cand.push(numBoxes[_bj]);
      } } var _wst=-1; for(var _ci=0;_ci<_cand.length;_ci++){ var _dq=Math.abs(_cand[_ci].y-_oppGY);
      if(_dq>_wst){_wst=_dq;_box=_cand[_ci];
      } } _N=_box?_box.n:(1+Math.floor(Math.random()*6));
      } else if(_rt===1&&_f.length>=2){ _N=_f[(Math.random()<0.5)?0:1];
      } else { _N=1+Math.floor(Math.random()*6);
      } var _st=rouletteAng; rouletteCap.N=_N;
      rouletteCap.box=_box; rouletteCap.startAng=_st;
      rouletteCap.spin=4*6.283+Math.random()*6.283;
      } rouletteCap.t++; var _rp=Math.min(1,rouletteCap.t/rouletteCap.dur), _re=1-Math.pow(1-_rp,3);
      rouletteAng=rouletteCap.startAng+rouletteCap.spin*_re;
      coin.x=W/2; coin.y=H/2; coin.vx=0;
      coin.vy=0; if(rouletteCap.t>=rouletteCap.dur){ rouletteAng=rouletteCap.startAng+rouletteCap.spin;
      var _rt2=hzTier(), _N2=rouletteCap.N;
      rouletteLastN=_N2; rouletteFlash=30;
      rouletteCD=30; if(_rt2>=2){ var _tb=rouletteCap.box;
      rouletteBox=_tb; if(_tb){ coin.x=_tb.x;
      coin.y=_tb.y; for(var _rn=0;_rn<4;_rn++){ for(var _ni2=0;_ni2<nails.length;_ni2++){ var _rdx=coin.x-nails[_ni2].x,_rdy=coin.y-nails[_ni2].y,_rds=Math.hypot(_rdx,_rdy),_rmn=COIN_R+NAIL_R+2;
      if(_rds<_rmn&&_rds>0){ coin.x+=(_rdx/_rds)*(_rmn-_rds);
      coin.y+=(_rdy/_rds)*(_rmn-_rds);
      } } } coin.x=Math.max(WALL+COIN_R+1,Math.min(W-WALL-COIN_R-1,coin.x));
      coin.y=Math.max(NET_DEPTH+GOAL_AREA_D+COIN_R+1,Math.min(H-NET_DEPTH-GOAL_AREA_D-COIN_R-1,coin.y));
      } coin.vx=0; coin.vy=0; rouletteShot=false;
      try{ if(typeof sfxSlotLand==='function') sfxSlotLand();
      }catch(e){} try{ spawnSparks(coin.x,coin.y,current,16);
      }catch(e){} var _wasKo=!!rouletteCap.ko;
      moving=false; if(!_wasKo){ try{ endFlick();
      }catch(e){} } } else { var _phiN=rouletteAng+((_N2-0.5)/6)*6.283, _exx=Math.cos(_phiN), _eyy=Math.sin(_phiN), _rsp=8.5+_rt2*1.0;
      coin.vx=_exx*_rsp; coin.vy=_eyy*_rsp;
      coin.x=W/2+_exx*(ROUL_R+COIN_R+3);
      coin.y=H/2+_eyy*(ROUL_R+COIN_R+3);
      rouletteShot=true; try{ if(typeof sfxSlotLand==='function') sfxSlotLand();
      }catch(e){} try{ spawnSparks(coin.x,coin.y,current,16);
      }catch(e){} } rouletteCap=null;
      } return; } } if((typeof boardKey!=='undefined')&&boardKey==='turf'&&!scoring&&stadiumHazards()){ try{ turfStep();
      }catch(e){} } if(wallCD>0) wallCD--;
      if(nails){for(var _bi=0;_bi<nails.length;_bi++){ if(nails[_bi]._bcd>0) nails[_bi]._bcd--;
      if(nails[_bi]._acd>0) nails[_bi]._acd--;
      }} if(TAC.slowmo&&!scoring){ slowPhase^=1;
      if(slowPhase) return; } if(TAC.portal && !portalUsed && !scoring){ var _pp=portalPts(current);
      if(Math.hypot(coin.x-_pp.ex,coin.y-_pp.ey)<PORTAL_R+COIN_R){ portalUsed=true;
      var _sp=Math.hypot(coin.vx,coin.vy)||1;
      coin.x=_pp.xx+(coin.vx/_sp)*(PORTAL_R+COIN_R+1);
      coin.y=_pp.xy+(coin.vy/_sp)*(PORTAL_R+COIN_R+1);
      spawnSparks(_pp.ex,_pp.ey,null,14);
      spawnSparks(_pp.xx,_pp.xy,null,14);
      try{sfxPortal();}catch(e){} } }
      const speed=Math.hypot(coin.vx,coin.vy);
      // Magnus effect: a spinning ball curves perpendicular to its travel
      if(coin.spin&&speed>0.4&&!scoring){ const px=-coin.vy/speed, py=coin.vx/speed;
      coin.vx+=px*coin.spin*speed*0.05;
      coin.vy+=py*coin.spin*speed*0.05;
      var _cm=Math.hypot(coin.vx,coin.vy)||1;
      coin.vx=coin.vx/_cm*speed;
      coin.vy=coin.vy/_cm*speed;
      coin.spin*=0.984; if(Math.abs(coin.spin)<0.003) coin.spin=0;
      }
      if(speed>0.35){ shotTrail.push({x:coin.x,y:coin.y,life:18,max:18,curl:!!coin.spin,wet:!!TAC.wet}); if(shotTrail.length>18) shotTrail.shift(); }
      const subs=Math.max(1,Math.ceil(speed/MAX_STEP));
      // advance each sub-step by the CURRENT velocity, so a mid-frame wall/player
      // bounce immediately redirects the remaining sub-steps away instead of
      // re-hitting the wall (which used to drain sideways speed and glue the ball to it)
      for(let i=0;i<subs&&moving;i++){ if(TAC.serpent&&!scoring){ var _ssp=Math.hypot(coin.vx,coin.vy);
      if(_ssp>0.5){ var _sang=serpentBase+serpentDir*SERPENT_SWING*Math.cos(serpentPhase);
      coin.vx=Math.cos(_sang)*_ssp;
      coin.vy=Math.sin(_sang)*_ssp;
      serpentPhase+=SERPENT_FREQ;
      } } if(TAC.wet&&!TAC.serpent&&!TAC.curve&&!scoring){ var _wwsp=Math.hypot(coin.vx,coin.vy);
      if(_wwsp>0.5){ var _wwang=wetBase+WET_WOBBLE*Math.cos(wetPhase);
      coin.vx=Math.cos(_wwang)*_wwsp;
      coin.vy=Math.sin(_wwang)*_wwsp;
      wetPhase+=WET_WFREQ; } } var _sInt=(TAC.serpent&&!scoring)?Math.atan2(coin.vy,coin.vx):0;
      coin.x+=coin.vx/subs; coin.y+=coin.vy/subs;
      var _wp=0,_wpa=0; if((TAC.wet||royGreasy())&&!scoring){ _wp=Math.hypot(coin.vx,coin.vy);
      _wpa=Math.atan2(coin.vy,coin.vx);
      } collideStep(); if(TAC.wet&&moving&&!scoring&&_wp>0.6){ var _na=Math.atan2(coin.vy,coin.vx), _dfa=Math.atan2(Math.sin(_na-_wpa),Math.cos(_na-_wpa));
      if(Math.abs(_dfa)>0.25){ var _wspd=(Math.hypot(coin.vx,coin.vy)||1)*WET_REDIRECT_KEEP, _woy=(current==='red')?(NET_DEPTH+COIN_R+1):(H-NET_DEPTH-COIN_R-1), _wgh=Math.atan2(_woy-coin.y,(W/2)-coin.x), _wch=Math.atan2(coin.vy,coin.vx), _wd=Math.atan2(Math.sin(_wgh-_wch),Math.cos(_wgh-_wch)), _wbi=_wch+_wd*0.55+(Math.random()-0.5)*1.4;
      coin.vx=Math.cos(_wbi)*_wspd;
      coin.vy=Math.sin(_wbi)*_wspd;
      wetBase=Math.atan2(coin.vy,coin.vx)-WET_WOBBLE*Math.cos(wetPhase);
      } } if(royGreasy()&&!TAC.wet&&moving&&!scoring&&_wp>0.6){ var _gna=Math.atan2(coin.vy,coin.vx), _gdf=Math.atan2(Math.sin(_gna-_wpa),Math.cos(_gna-_wpa));
      if(Math.abs(_gdf)>0.25){ var _gsl=(Math.random()-0.5)*1.7,_gc=Math.cos(_gsl),_gs=Math.sin(_gsl),_gx=coin.vx*_gc-coin.vy*_gs,_gy=coin.vx*_gs+coin.vy*_gc;
      coin.vx=_gx; coin.vy=_gy;
      } } if(TAC.serpent&&!scoring&&moving){ var _sh=Math.atan2(coin.vy,coin.vx), _sdf=Math.atan2(Math.sin(_sh-_sInt),Math.cos(_sh-_sInt));
      if(Math.abs(_sdf)>0.15){ serpentDir=-serpentDir;
      serpentBase=_sh-serpentDir*SERPENT_SWING*Math.cos(serpentPhase);
      } } if(!scoring) skateTrackStep();
      if(!scoring) skateWallStep();
      if(!scoring) royPortalStep();
      if(!scoring) royLaserStep();
      if(!scoring) royWallStep();
      if(!scoring) royDrainStep();
      if(!scoring) royCrateStep();
      if(!scoring) royPortcStep();
      if(!scoring) royBoulderStep();
      if(!scoring) royPuddleStep();
      if(!scoring) royBushStep();
      if(!scoring) royMudStep();
      if(!scoring) roySerpStep();
      if(!scoring) royBumperStep();
      if(!scoring) royOrbitStep();
      if(!scoring) royFlipperStep();
      if(!scoring) royCactiStep();
      if(!scoring) royGeyserStep();
      if(!scoring) royDevilStep();
      if(!scoring){ try{ ecoStep();
      }catch(e){} } if(!scoring&&trapHit()) break;
      }
      if(rportCD>0) rportCD--;
      if(royaleArena && royaleArena.cust==='wind' && moving && !scoring){ royWindT--;
      if(royWindT<=0){ royWindAng=Math.random()*6.2832;
      royWindMag=(Math.random()<0.35)?0:(0.14+Math.random()*0.22);
      royWindT=30+Math.floor(Math.random()*55);
      } if(royWindMag>0){ coin.vx+=Math.cos(royWindAng)*royWindMag;
      coin.vy+=Math.sin(royWindAng)*royWindMag;
      } } if((typeof boardKey!=='undefined')&&boardKey==='storm'&&moving&&!scoring&&stadiumHazards()){ if(stormGust){ var _genv=Math.sin(stormGust.t/stormGust.dur*Math.PI), _gm=stormGust.mag*_genv;
      if(Math.hypot(coin.vx,coin.vy)>0.5){ coin.vx+=Math.cos(stormGust.ang)*_gm;
      coin.vy+=Math.sin(stormGust.ang)*_gm;
      } } }if((typeof boardKey!=='undefined')&&boardKey==='storm'&&moving&&!scoring&&stadiumHazards()){ if(hzTier()>=1&&(!coin.air||coin.air<=0)){ var _spd2=stormPuddles();
      for(var _pi2=0;_pi2<_spd2.length;_pi2++){ var _pp=_spd2[_pi2];
      if(Math.hypot(coin.x-_pp.x,coin.y-_pp.y)<_pp.r){ var _psp0=Math.hypot(coin.vx,coin.vy);
      if(_psp0>0.5){ try{ splashPuddle(coin.x,coin.y,_psp0>4.5?3:2,_psp0>4.5);
      }catch(e){} } if(_psp0>4.5){ coin.vx*=0.985;
      coin.vy*=0.985; var _pj=(Math.random()-0.5)*0.09,_pjc=Math.cos(_pj),_pjs=Math.sin(_pj),_pnx=coin.vx*_pjc-coin.vy*_pjs,_pny=coin.vx*_pjs+coin.vy*_pjc;
      coin.vx=_pnx; coin.vy=_pny;
      } else { coin.vx*=0.78; coin.vy*=0.78;
      } break; } } } } if((typeof boardKey!=='undefined')&&boardKey==='candy'&&!scoring&&stadiumHazards()){ if(candyPatches.length===0) initCandy();
      if(gumCD>0) gumCD--; for(var _gi=0;_gi<gumballs.length;_gi++){ var _gb=gumballs[_gi];
      _gb.x+=_gb.vx; _gb.y+=_gb.vy;
      if(_gb.x<WALL+_gb.r){_gb.x=WALL+_gb.r;
      _gb.vx=Math.abs(_gb.vx);
      } if(_gb.x>W-WALL-_gb.r){_gb.x=W-WALL-_gb.r;
      _gb.vx=-Math.abs(_gb.vx);
      } if(_gb.y<NET_DEPTH+_gb.r){_gb.y=NET_DEPTH+_gb.r;
      _gb.vy=Math.abs(_gb.vy);
      } if(_gb.y>H-NET_DEPTH-_gb.r){_gb.y=H-NET_DEPTH-_gb.r;
      _gb.vy=-Math.abs(_gb.vy);
      } if(moving&&(!coin.air||coin.air<=0)){ var _dx4=coin.x-_gb.x,_dy4=coin.y-_gb.y,_dd4=Math.hypot(_dx4,_dy4),_mn4=COIN_R+_gb.r;
      if(_dd4<_mn4&&_dd4>0){ var _ux4=_dx4/_dd4,_uy4=_dy4/_dd4,_ov4=_mn4-_dd4;
      coin.x+=_ux4*_ov4; coin.y+=_uy4*_ov4;
      var _dot4=coin.vx*_ux4+coin.vy*_uy4;
      if(_dot4<0){ coin.vx-=1.7*_dot4*_ux4;
      coin.vy-=1.7*_dot4*_uy4;
      } _gb.vx-=_ux4*0.4; _gb.vy-=_uy4*0.4;
      try{sfxBump(4);}catch(e){} } } } if(moving&&(!coin.air||coin.air<=0)){ var _csp=Math.hypot(coin.vx,coin.vy);
      if(gumCD<=0){ for(var _ji=0;_ji<candyPatches.length;_ji++){ if(Math.hypot(coin.x-candyPatches[_ji].x,coin.y-candyPatches[_ji].y)<candyPatches[_ji].r && _csp>1.0){ coin.air=20;
      coin.air0=20; coin.vx*=1.05;
      coin.vy*=1.05; gumCD=16;
      try{ if(typeof sfxBumperHit==='function') sfxBumperHit();
      }catch(e){} try{ spawnSparks(candyPatches[_ji].x,candyPatches[_ji].y,current,10,true);
      }catch(e){} try{ nsKick(5);
      }catch(e){} break; } } } for(var _ci=0;_ci<candyBog.length;_ci++){ if(Math.hypot(coin.x-candyBog[_ci].x,coin.y-candyBog[_ci].y)<candyBog[_ci].r){ coin.vx*=0.85;
      coin.vy*=0.85; break; } } } } if((typeof boardKey!=='undefined')&&boardKey==='baseball'&&!scoring&&stadiumHazards()){ if(bbBats.length===0) initBaseball();
      var _bbsp=Math.hypot(coin.vx,coin.vy), _bbmov=(moving&&(!coin.air||coin.air<=0));
      // HARD glove: the mound glove claims a DYING ball that enters it. It re-arms only once the ball
      // has left, so the ball you flick off the mound is never re-caught in place.
      // This runs whether or not the coin is moving ON PURPOSE: gated behind the `moving` check it
      // missed the most common case — a ball that rolls in and STOPS inside the glove stops being
      // checked the moment it settles, so it just sat on the mound uncaught. The lower speed bound is
      // gone for the same reason (a decelerating ball could skip the old 0.5-2.2 window between
      // frames). The kickoff ball is still safe: the glove spawns disarmed and only arms once the
      // ball has left it.
      for(var _gci=0;_gci<bbGloves.length;_gci++){ var _gc=bbGloves[_gci];
      var _gin=Math.hypot(coin.x-_gc.x,coin.y-_gc.y)<_gc.r+COIN_R;
      if(!_gin){ _gc.armed=true;
      if(_gc.caught){ _gc.caught=false; _gc.openT=12;   /* the ball just left — spring back open */
      try{ if(typeof sfxWhoosh==='function') sfxWhoosh(); }catch(e){} }
      continue; }
      if(_gc.armed&&_bbsp<BB_CATCH_MAX&&(!coin.air||coin.air<=0)){ coin.x=_gc.x; coin.y=_gc.y;
      coin.vx=0; coin.vy=0; _bbsp=0;
      _gc.armed=false; _gc.caught=true; _gc.flash=22; _gc.catchT=14; _gc.openT=0;
      try{ if(typeof sfxBump==='function') sfxBump(6);
      }catch(e){} try{ shake=Math.max(shake||0,3);
      }catch(e){} break; } }
      if(_bbmov){
      // MED+ pitching machine: a stray ball crossing the pitch deflects the moving ball (never traps it)
      for(var _pci=0;_pci<bbPitchBalls.length&&_bbsp>0.5;_pci++){ var _pc=bbPitchBalls[_pci];
      var _pcx=coin.x-_pc.x,_pcy=coin.y-_pc.y,_pcd=Math.hypot(_pcx,_pcy),_pcm=COIN_R+_pc.r;
      if(_pcd<_pcm&&_pcd>0){ var _pcux=_pcx/_pcd,_pcuy=_pcy/_pcd;
      coin.x+=_pcux*(_pcm-_pcd); coin.y+=_pcuy*(_pcm-_pcd);
      var _pcdot=coin.vx*_pcux+coin.vy*_pcuy; if(_pcdot<0){ coin.vx-=1.6*_pcdot*_pcux;
      coin.vy-=1.6*_pcdot*_pcuy; } coin.vx+=_pc.vx*0.5;
      coin.vy+=_pc.vy*0.5; try{ if(typeof sfxBump==='function') sfxBump(5);
      }catch(e){} break; } } }
      // EASY+ reactive bats: rest until a moving ball rolls into the zone, then swing at a fixed
      // speed. The barrel SWEEPS through its arc and connects the instant it overlaps the ball — so
      // a slow ball is hit reliably, but a hard flick blows past before the barrel arrives (a strike).
      // A connect launches the ball toward that bat's opposite goal at a fixed power (no scaling).
      // The bat also swings at a PITCHED ball that comes near and cracks it away down the pitch —
      // the batter doing what a batter is for. It is cosmetic for the match (a struck baseball still
      // only ever deflects a moving coin) but it makes the two hazards play off each other.
      for(var _bbi=0;_bbi<bbBats.length;_bbi++){ var _bb=bbBats[_bbi];
      if(_bb.cd>0){ _bb.cd--; continue; }
      if(!_bb.swing){ var _btrig=(_bbmov&&_bbsp>0.5&&Math.hypot(coin.x-_bb.x,coin.y-_bb.y)<BB_RZ), _btx=coin.x;
      if(!_btrig){ for(var _bpi=0;_bpi<bbPitchBalls.length;_bpi++){ var _bp0=bbPitchBalls[_bpi];
      if(!_bp0.struck&&Math.hypot(_bp0.x-_bb.x,_bp0.y-_bb.y)<BB_RZ){ _btrig=true; _btx=_bp0.x; break; } } }
      if(_btrig){ _bb.swing=true; _bb.swT=0; _bb.hit=false;
      // swing FROM the side the ball is on, sweeping a full 180 degrees across the bat's own front,
      // so the barrel always travels through the ball instead of away from it
      var _bR=(_btx>=_bb.x); _bb.start=_bR?0:Math.PI;
      _bb.dir=(_bR===!!_bb.isTop)?1:-1;
      } continue; }
      _bb.swT++; var _bang=_bb.start+_bb.dir*(_bb.swT/BB_SWING)*BB_ARC;
      var _bhx=_bb.x+Math.cos(_bang)*BB_REACH, _bhy=_bb.y+Math.sin(_bang)*BB_REACH;
      if(!_bb.hit&&_bbmov&&Math.hypot(coin.x-_bhx,coin.y-_bhy)<COIN_R+BB_BARREL){ var _bax=(W/2)-coin.x, _bay=_bb.tgt-coin.y, _bad=Math.hypot(_bax,_bay)||1;
      coin.vx=_bax/_bad*BB_POWER; coin.vy=_bay/_bad*BB_POWER;
      _bb.hit=true; try{ if(typeof sfxBumperHit==='function') sfxBumperHit();
      }catch(e){} try{ spawnSparks(_bhx,_bhy,current,12,true);
      }catch(e){} try{ shake=Math.max(shake||0,4);
      }catch(e){} }
      for(var _bsi=0;_bsi<bbPitchBalls.length;_bsi++){ var _bp=bbPitchBalls[_bsi];
      if(_bp.struck) continue;
      if(Math.hypot(_bp.x-_bhx,_bp.y-_bhy)<_bp.r+BB_BARREL){ var _pax=(W/2)-_bp.x, _pay=_bb.tgt-_bp.y, _pad=Math.hypot(_pax,_pay)||1;
      _bp.vx=_pax/_pad*4.6; _bp.vy=_pay/_pad*4.6;
      _bp.struck=true; try{ if(typeof sfxBumperHit==='function') sfxBumperHit();
      }catch(e){} try{ spawnSparks(_bhx,_bhy,current,8,true);
      }catch(e){} } }
      if(_bb.swT>=BB_SWING){ _bb.swing=false; _bb.cd=16; } }
      } if(bkArena()&&!scoring){ if(!bkOn) initCourt();
      var _ksp=Math.hypot(coin.vx,coin.vy), _kmov=(moving&&(!coin.air||coin.air<=0));
      // the hoops are fixed furniture now; only the "went through one" flag resets between attempts
      if(!moving){ bkRimPass.red=false; bkRimPass.blue=false; }
      if(bkNoBasket>0) bkNoBasket--;
      // HARD rim: crossing the hoop mouth toward its goal arms that goal; the posts are solid, so
      // clipping one rims you out instead
      for(var _rmi=0;_rmi<bkRims.length;_rmi++){ var _rm=bkRims[_rmi];
      if(_rm.flash>0) _rm.flash--;
      if(_kmov){ var _d0=(bkPrev.x-_rm.x)*_rm.fx+(bkPrev.y-_rm.y)*_rm.fy;
      var _d1=(coin.x-_rm.x)*_rm.fx+(coin.y-_rm.y)*_rm.fy;
      if(_d0<0&&_d1>=0){ var _lat=(coin.x-_rm.x)*(-_rm.fy)+(coin.y-_rm.y)*_rm.fx;
      if(Math.abs(_lat)<_rm.half-COIN_R*0.35){ bkRimPass[_rm.for]=true; _rm.flash=20;
      try{ if(typeof sfxBumperHit==='function') sfxBumperHit();
      }catch(e){} try{ spawnSparks(_rm.x,_rm.y,current,10,true); }catch(e){} } }
      for(var _pk=-1;_pk<=1;_pk+=2){ var _px=_rm.x+(-_rm.fy)*_rm.half*_pk, _py=_rm.y+_rm.fx*_rm.half*_pk;
      var _pdx=coin.x-_px, _pdy=coin.y-_py, _pd=Math.hypot(_pdx,_pdy), _pmin=COIN_R+BK_POST_R;
      if(_pd<_pmin&&_pd>0){ var _pux=_pdx/_pd, _puy=_pdy/_pd;
      coin.x+=_pux*(_pmin-_pd); coin.y+=_puy*(_pmin-_pd);
      var _pdot=coin.vx*_pux+coin.vy*_puy;
      if(_pdot<0){ coin.vx-=1.7*_pdot*_pux; coin.vy-=1.7*_pdot*_puy; }
      try{ if(typeof sfxBump==='function') sfxBump(4); }catch(e){} } } } }
      // MED trampoline: a BAD hop — it throws the ball up AND kicks it off its line, so unlike the
      // candy jelly pad (which launches you helpfully along your travel) it costs you control
      if(_kmov&&_ksp>0.9){ for(var _tri=0;_tri<bkTramps.length;_tri++){ var _tr=bkTramps[_tri];
      if(_tr.flash>0) _tr.flash--;
      if(Math.hypot(coin.x-_tr.x,coin.y-_tr.y)<_tr.r+COIN_R*0.5){ coin.air=BK_HOP; coin.air0=BK_HOP;
      var _tang=Math.atan2(coin.vy,coin.vx)+(Math.random()-0.5)*1.15, _tsp=_ksp*0.86;
      coin.vx=Math.cos(_tang)*_tsp; coin.vy=Math.sin(_tang)*_tsp;
      _tr.flash=14; try{ if(typeof sfxBumperHit==='function') sfxBumperHit();
      }catch(e){} try{ spawnSparks(_tr.x,_tr.y,current,9,true);
      }catch(e){} try{ nsKick(4); }catch(e){} break; } } }
      else { for(var _tf=0;_tf<bkTramps.length;_tf++){ if(bkTramps[_tf].flash>0) bkTramps[_tf].flash--; } }
      // EASY backboards: bank a shot off the angled board beside a post
      if(_kmov&&_ksp>0.6){ for(var _kbi=0;_kbi<bkBoards.length;_kbi++){ var _kb=bkBoards[_kbi];
      var _kdx=_kb.x2-_kb.x1, _kdy=_kb.y2-_kb.y1, _kl2=_kdx*_kdx+_kdy*_kdy;
      var _kt=_kl2?((coin.x-_kb.x1)*_kdx+(coin.y-_kb.y1)*_kdy)/_kl2:0;
      _kt=Math.max(0,Math.min(1,_kt));
      var _kqx=_kb.x1+_kdx*_kt, _kqy=_kb.y1+_kdy*_kt, _kd=Math.hypot(coin.x-_kqx,coin.y-_kqy);
      if(_kd<COIN_R+BK_BOARD_R&&_kd>0){ var _knx=-_kdy/Math.sqrt(_kl2), _kny=_kdx/Math.sqrt(_kl2);
      if(coin.vx*_knx+coin.vy*_kny>0){ _knx=-_knx; _kny=-_kny; }   /* face the incoming ball */
      var _kdot=coin.vx*_knx+coin.vy*_kny;
      coin.vx-=2*_kdot*_knx; coin.vy-=2*_kdot*_kny;
      coin.vx*=1.06; coin.vy*=1.06;
      var _kpush=(COIN_R+BK_BOARD_R)-_kd;
      coin.x+=(coin.x-_kqx)/_kd*_kpush; coin.y+=(coin.y-_kqy)/_kd*_kpush;
      bkBoardFlash=10; try{ if(typeof sfxBumperHit==='function') sfxBumperHit();
      }catch(e){} try{ spawnSparks(_kqx,_kqy,current,7,true);
      }catch(e){} break; } } }
      bkPrev.x=coin.x; bkPrev.y=coin.y;
      } if(tnArena()&&!scoring){ if(!tnOn) initTennis();
      var _tsp=Math.hypot(coin.vx,coin.vy), _tair=(coin.air>0), _tmov=(moving&&!_tair);
      // EASY the net: a lob clears it; a hard grounded shot punches through and loses pace off the
      // cord; anything slower is stopped at the net and knocked back the way it came
      // EASY rackets: run onto one and it lobs the ball into the air, carrying it over the net —
      // the way past without the Chip ability. Capped speed so the lob lands before the goal
      // (an airborne ball reaching the net is rejected as a goal, which would just read as broken).
      if(_tmov&&_tsp>0.8){ for(var _ri=0;_ri<tnRackets.length;_ri++){ var _rk=tnRackets[_ri];
      var _rdx=coin.x-_rk.x, _rdy=coin.y-_rk.y, _rd=Math.hypot(_rdx,_rdy);
      if(_rd<_rk.r+COIN_R*0.6){
      if(tnRackLive(_rk)){ var _rs=Math.min(_tsp,TN_RACK_MAX)||1;   // GREEN: lob it over the net
      var _ra=Math.atan2(coin.vy,coin.vx);
      coin.vx=Math.cos(_ra)*_rs; coin.vy=Math.sin(_ra)*_rs;
      coin.air=TN_RACK_AIR; coin.air0=TN_RACK_AIR;
      _tair=true; _tmov=false; _rk.flash=16;
      try{ if(typeof sfxBumperHit==='function') sfxBumperHit();
      }catch(e){} try{ spawnSparks(_rk.x,_rk.y,current,9,true);
      }catch(e){} try{ nsKick(4); }catch(e){}
      } else { var _rl=_rd||1, _rux=_rdx/_rl, _ruy=_rdy/_rl;   // RED: swat it straight back
      coin.x=_rk.x+_rux*(_rk.r+COIN_R*0.6+0.5); coin.y=_rk.y+_ruy*(_rk.r+COIN_R*0.6+0.5);
      var _rsp=Math.max(1.6,Math.min(_tsp,5)*0.9);
      coin.vx=_rux*_rsp; coin.vy=_ruy*_rsp;
      _rk.flash=16; try{ if(typeof sfxBump==='function') sfxBump(6);
      }catch(e){} try{ spawnSparks(_rk.x,_rk.y,current,9,true);
      }catch(e){} try{ shake=Math.max(shake||0,3); }catch(e){} }
      break; } } }
      var _ny=H/2, _was=tnPrevY-_ny, _now=coin.y-_ny;
      var _inNet=(coin.x>tnNetX0()&&coin.x<tnNetX1());   // the lanes either side are open
      // The net is SOLID to anything on the ground, however hard it is struck — there is no punching
      // through it. The only ways across are in the air (a racket lob or Chip) or round the open
      // lanes at either end, so no loadout is ever locked out of attacking.
      // A kickoff sits the ball exactly ON the net line, so the opening flick would otherwise be
      // knocked straight back. A ball leaving the centre spot is treated as a SERVE and allowed
      // through; after that the net is absolute. (Do not lean on _was===0 for this — it only holds
      // while the ball has not moved a single frame.)
      var _serve=Math.abs(tnPrevY-_ny)<=2.5;
      // HARD gates: while a gate is out it seals its lane, so that crossing is blocked exactly like
      // the net. Ground balls only — a lob still clears a gate, same as it clears the net.
      var _inDoor=false;
      for(var _di=0;_di<tnDoors.length;_di++){ var _sp=tnDoorSpan(tnDoors[_di]);
      if(_sp&&coin.x>_sp.x0-COIN_R*0.4&&coin.x<_sp.x1+COIN_R*0.4){ _inDoor=true;
      if(moving&&_was*_now<0&&!_tair&&!_serve) tnDoors[_di].flash=14;
      break; } }
      var _blocked=(_inNet||_inDoor);
      if(moving&&_was*_now<0&&_blocked&&!_tair&&!_serve){ coin.y=_ny+(_was>0?1:-1)*(COIN_R+1.5);
      coin.vy=-coin.vy*0.45; coin.vx*=0.6;
      tnNetFlash=14; try{ if(typeof sfxBump==='function') sfxBump(5);
      }catch(e){} try{ spawnSparks(coin.x,_ny,current,6,true); }catch(e){} }
      // belt and braces: a grounded ball must never come to sit INSIDE a blocked band, or the next
      // frame's crossing test has nothing to compare against and it slips through
      else if(_blocked&&!_tair&&Math.abs(coin.y-_ny)<COIN_R+1.5&&!_serve){
      var _side=(_was>=0?1:-1); coin.y=_ny+_side*(COIN_R+1.5);
      if(coin.vy*_side<0) coin.vy=-coin.vy*0.45; }
      tnPrevY=coin.y;
      } if(gridArena()&&!scoring){ try{ gridironStep(); }catch(e){} }
      if(bowlArena()&&!scoring){ try{ bowlingStep(); }catch(e){} }
      if(rcArena()&&!scoring){ try{ racewayStep(); }catch(e){} }
      if(rgArena()&&!scoring){ try{ ringStep(); }catch(e){} }
      if(cgArena()&&!scoring){ if(!cgOn) initMinigolf();
      var _gsp=Math.hypot(coin.vx,coin.vy), _ggr=(!coin.air||coin.air<=0);
      // SAND: extra drag, never a wall. Landing in it costs you the shot and you play out of it next
      // turn; a near-max strike from close range carries clean through, and a chip flies over. See
      // CG_SAND_DRAG for the numbers and for what the first value got wrong.
      if(_ggr&&_gsp>0.01&&cgSandAt(coin.x,coin.y)){ coin.vx*=CG_SAND_DRAG;
      coin.vy*=CG_SAND_DRAG; }
      // TREES: a tree KILLS the ball. Deliberately not a bounce — a deflector puts the ball where the
      // geometry chose, and that is the mistake the bank rails made. This just ends the shot on the spot,
      // which is both what a tree does on a real course and completely predictable.
      if(_ggr&&moving&&_gsp>0.3){ for(var _gti=0;_gti<cgTrees.length;_gti++){ var _gt=cgTrees[_gti];
      var _tdx=coin.x-_gt.x, _tdy=coin.y-_gt.y, _td=Math.hypot(_tdx,_tdy), _tmn=_gt.r+COIN_R;
      if(_td<_tmn&&_td>0.001){ coin.x=_gt.x+(_tdx/_td)*_tmn;
      coin.y=_gt.y+(_tdy/_td)*_tmn;
      coin.vx*=CG_TREE_KILL; coin.vy*=CG_TREE_KILL;
      _gt.flash=16; try{ if(typeof sfxBump==='function') sfxBump(7);
      }catch(e){} try{ spawnSparks(coin.x,coin.y,current,9);
      }catch(e){} try{ shake=Math.max(shake||0,3);
      }catch(e){} break; } } }
      // WATER: the shot dies at the bank. It never redirects and never teleports the ball across the
      // pitch — the ball is set down on the shore it crossed and that is the end of the turn. Airborne
      // balls carry clean over, so Chip is a real answer to the pond, exactly as it is in golf.
      if(_ggr&&moving&&_gsp>0.05){ for(var _gwi=0;_gwi<cgWater.length;_gwi++){ var _gw=cgWater[_gwi];
      if(!cgIn(_gw,coin.x,coin.y)) continue;
      /* Put the ball down where it ENTERED the water: walk the path it actually travelled this frame and
         take the last point still on dry land. The first version pushed it to the nearest point on the bank
         in ellipse space, and for a hard strike (a Cannon shot covers ~20px in a frame and lands well
         inside) that threw the ball sideways or out the far side — it read as being grabbed and flung.
         Three guards, because measurement found all three failing:
           - the previous point is only usable if it was on dry land AND close enough to be this frame's
             position (a kickoff, VAR or rewind teleports the ball, leaving a stale previous point);
           - otherwise fall back to the radial push, out to 1.10x the base ellipse;
           - and then VERIFY. A push that lands in another hazard, or fails, is stepped outward until the
             point is genuinely clear. One measured case left the ball sitting in the pond. */
      var _wpx=coin.x, _wpy=coin.y, _wgot=false;
      var _wjump=Math.hypot(coin.x-cgPrevX,coin.y-cgPrevY);
      if(_wjump<=34&&!cgIn(_gw,cgPrevX,cgPrevY)){ var _wex=cgPrevX, _wey=cgPrevY;
      for(var _wk=1;_wk<=16;_wk++){ var _wf=_wk/16;
      var _wqx=cgPrevX+(coin.x-cgPrevX)*_wf, _wqy=cgPrevY+(coin.y-cgPrevY)*_wf;
      if(cgIn(_gw,_wqx,_wqy)) break;
      _wex=_wqx; _wey=_wqy; }
      if(!cgHazardAt(_wex,_wey,0)){ _wpx=_wex; _wpy=_wey; _wgot=true; } }
      if(!_wgot){ var _wnx=(coin.x-_gw.x)/_gw.rx, _wny=(coin.y-_gw.y)/_gw.ry, _wnl=Math.hypot(_wnx,_wny)||0.0001;
      for(var _ws=1.10;_ws<=1.9;_ws+=0.08){ var _wtx=_gw.x+(_wnx/_wnl)*_gw.rx*_ws, _wty=_gw.y+(_wny/_wnl)*_gw.ry*_ws;
      if(_wtx<WALL+COIN_R||_wtx>W-WALL-COIN_R||_wty<WALL+COIN_R||_wty>H-WALL-COIN_R) continue;
      if(!cgHazardAt(_wtx,_wty,0)){ _wpx=_wtx; _wpy=_wty; _wgot=true; break; } } }
      coin.x=Math.max(WALL+COIN_R,Math.min(W-WALL-COIN_R,_wpx));
      coin.y=Math.max(WALL+COIN_R,Math.min(H-WALL-COIN_R,_wpy));
      coin.vx=0; coin.vy=0; coin.air=0; _gsp=0;
      // DROWN: sink where it went in (a little into the pond from the shore it crossed), then drop the ball
      // back onto the grass at coin's rest spot for the next flick. cgDrown holds the turn — stepPhysics
      // only ticks it — until the drop lands, then it releases into endFlick.
      var _sinkx=coin.x+(_gw.x-coin.x)*0.4, _sinky=coin.y+(_gw.y-coin.y)*0.4;
      cgDrown={t:0, sx:_sinkx, sy:_sinky, gx:coin.x, gy:coin.y};
      _gw.flash=26; cgSplash=26; cgSplashX=_sinkx; cgSplashY=_sinky;   // impact splash at the sink point
      try{ setStatus('IN THE WATER'); }catch(e){}
      try{ if(typeof sfxSplash==='function') sfxSplash(); }catch(e){}
      try{ spawnSparks(_sinkx,_sinky,null,12); }catch(e){}
      break; } }
      // CUPS (HARD): hole out for ONE MORE FLICK. Claims only a DYING ball, so a firm putt skips the
      // lip, and only in the end this side is attacking. Missing costs nothing.
      // cgBonus caps it at one per possession: without that, an extra flick played from inside the hole
      // could drop straight back in and hand out turns for ever.
      // THE PIN: solid on every cup, and on a LIVE one a soft arrival drops. This is the shot the arena is
      // for — you aim at the flagstick rather than trying to stop dead on a 7px hole. A hard arrival is
      // killed by the pin and stays out, so power is the wrong answer.
      if(cgCupOn&&_ggr&&!cgHoled){ for(var _gpi=0;_gpi<cgCups.length;_gpi++){ var _gp=cgCups[_gpi];
      var _pdx=coin.x-_gp.x, _pdy=coin.y-_gp.y, _pd=Math.hypot(_pdx,_pdy), _pmn=CG_PIN+COIN_R;
      if(_pd>=_pmn) continue;
      if(_gp.armed&&cgCupLive(_gp)&&!cgBonus&&!(pen&&pen.active)&&_gsp<CG_CUP_V){ cgHoleOut(_gp); _gsp=0; break; }
      if(_pd<0.001){ _pdx=1; _pdy=0; _pd=1; }
      var _pux=_pdx/_pd, _puy=_pdy/_pd;
      coin.x=_gp.x+_pux*_pmn; coin.y=_gp.y+_puy*_pmn;
      // Remove the component driving the ball INTO the pin rather than reflecting it — a flagstick stops a
      // ball dead and it drops beside the hole, it does not spring off like a bumper.
      var _pdot=coin.vx*_pux+coin.vy*_puy;
      if(_pdot<0){ coin.vx-=_pdot*_pux; coin.vy-=_pdot*_puy; }
      coin.vx*=CG_PIN_KILL; coin.vy*=CG_PIN_KILL; _gsp*=CG_PIN_KILL;
      _gp.armed=false; _gp.flash=10;
      try{ if(typeof sfxBump==='function') sfxBump(5); }catch(e){}
      break; } }
      // and the original route stays: a ball that simply dies in the hole is holed too
      if(cgCupOn&&_ggr&&!cgHoled&&!cgBonus&&!(pen&&pen.active)&&_gsp<CG_CUP_V){ for(var _gci=0;_gci<cgCups.length;_gci++){ var _gc=cgCups[_gci];
      if(!cgCupLive(_gc)||!_gc.armed) continue;
      if(Math.hypot(coin.x-_gc.x,coin.y-_gc.y)>=CG_CUP) continue;
      cgHoleOut(_gc); _gsp=0; break; } }
      cgPrevX=coin.x; cgPrevY=coin.y;
      } if((typeof boardKey!=='undefined')&&boardKey==='casino'&&!scoring&&stadiumHazards()){ if(hzTier()>=1&&dice.length===0) initDice();
      if(hzTier()>=2&&numBoxes.length===0) initNumBoxes();
      for(var _di=0;_di<dice.length;_di++){ var _d=dice[_di];
      if(_d.tumble>0) _d.tumble--;
      if(moving&&(!coin.air||coin.air<=0)){ var _ddx=coin.x-_d.x,_ddy=coin.y-_d.y,_ex=_d.sz+COIN_R-Math.abs(_ddx),_ey=_d.sz+COIN_R-Math.abs(_ddy);
      if(_ex>0&&_ey>0){ var _rolled=false, _tt=_d.t;
      if(_ex<_ey){ coin.x+=(_ddx<0?-_ex:_ex);
      coin.vx=(_ddx<0?-1:1)*Math.abs(coin.vx)*0.92;
      if(_d.tumble<=0){ if(_ddx<0){ _d.t=7-_d.e;
      _d.e=_tt; } else { _d.t=_d.e;
      _d.e=7-_tt; } _rolled=true;
      } } else { coin.y+=(_ddy<0?-_ey:_ey);
      coin.vy=(_ddy<0?-1:1)*Math.abs(coin.vy)*0.92;
      if(_d.tumble<=0){ if(_ddy<0){ _d.t=_d.n;
      _d.n=7-_tt; } else { _d.t=7-_d.n;
      _d.n=_tt; } _rolled=true;
      } } if(_rolled){ _d.face=_d.t;
      _d.tumble=12; try{ if(typeof sfxBump==='function') sfxBump(5);
      }catch(e){} try{ spawnSparks(_d.x,_d.y,current,8);
      }catch(e){} try{ nsKick(4);
      }catch(e){} } } } } } if((typeof boardKey!=='undefined')&&boardKey==='space'&&moving&&!scoring&&stadiumHazards()){ var _spt=hzTier();
      _spEnsure(); var _spl=spacePlates();
      for(var _si=0;_si<_spl.length;_si++){ var _pdx=_spl[_si].x-coin.x,_pdy=_spl[_si].y-coin.y,_pd=Math.hypot(_pdx,_pdy);
      if(_pd<54&&_pd>0.5){ var _pf=(1-_pd/54)*0.08;
      coin.vx+=(_pdx/_pd)*_pf;
      coin.vy+=(_pdy/_pd)*_pf;
      } } if(_spt>=1 && (!coin.air||coin.air<=0)){ for(var _ai=0;_ai<spaceAsteroids.length;_ai++){ var _as=spaceAsteroids[_ai], _adx=coin.x-_as.x,_ady=coin.y-_as.y,_add=Math.hypot(_adx,_ady),_amn=COIN_R+_as.r;
      if(_add<_amn&&_add>0){ var _aux=_adx/_add,_auy=_ady/_add,_aov=_amn-_add;
      coin.x+=_aux*_aov; coin.y+=_auy*_aov;
      var _adot=coin.vx*_aux+coin.vy*_auy;
      if(_adot<0){ coin.vx-=1.8*_adot*_aux;
      coin.vy-=1.8*_adot*_auy;
      } _as.vx-=_aux*0.5; _as.vy-=_auy*0.5;
      var _acap=Math.hypot(_as.vx,_as.vy);
      if(_acap>2.2){ _as.vx*=2.2/_acap;
      _as.vy*=2.2/_acap; } try{ if(typeof sfxBump==='function') sfxBump(4);
      }catch(e){} } } } if(_spt>=2){ if(bhCD>0){ bhCD--;
      } else { var _bhx=W/2,_bhy=H/2,_bdx=_bhx-coin.x,_bdy=_bhy-coin.y,_bhd=Math.hypot(_bdx,_bdy);
      if(_bhd<72&&_bhd>0.5){ var _bf=(1-_bhd/72)*0.14, _bux=_bdx/_bhd,_buy=_bdy/_bhd;
      coin.vx+=_bux*_bf-_buy*_bf*0.55;
      coin.vy+=_buy*_bf+_bux*_bf*0.55;
      if(_bhd<11){ var _ea=Math.atan2(coin.vy,coin.vx)+2.3,_ej=9;
      coin.vx=Math.cos(_ea)*_ej;
      coin.vy=Math.sin(_ea)*_ej;
      coin.x=_bhx+Math.cos(_ea)*14;
      coin.y=_bhy+Math.sin(_ea)*14;
      bhCD=48; try{ spawnSparks(_bhx,_bhy,current,12);
      }catch(e){} try{ if(typeof sfxPortal==='function') sfxPortal();
      }catch(e){} } } } } } if((typeof boardKey!=='undefined')&&boardKey==='skate'&&moving&&!scoring&&stadiumHazards()){ _skEnsure();
      if(!coin.air||coin.air<=0){ if(skateTube){ var _tp2=skateTrackPts[skateTube.ti];
      if(!_tp2){ skateTube=null;
      } else { var _pp2=_tp2.pts, _nseg=_pp2.length-1, _bd=1e9,_btx=0,_bty=0,_bpx=coin.x,_bpy=coin.y,_bq=0,_bfr=0;
      for(var _q=0;_q<_nseg;_q++){ var _ax=_pp2[_q].x,_ay=_pp2[_q].y,_ex=_pp2[_q+1].x-_ax,_ey=_pp2[_q+1].y-_ay,_l2=(_ex*_ex+_ey*_ey)||0.0001,_tpr=((coin.x-_ax)*_ex+(coin.y-_ay)*_ey)/_l2;
      _tpr=Math.max(0,Math.min(1,_tpr));
      var _px=_ax+_ex*_tpr,_py=_ay+_ey*_tpr,_dd=Math.hypot(coin.x-_px,coin.y-_py);
      if(_dd<_bd){ _bd=_dd; var _el=Math.hypot(_ex,_ey)||1;
      _btx=_ex/_el; _bty=_ey/_el;
      _bpx=_px; _bpy=_py; _bq=_q;
      _bfr=_tpr; } } var _prog=(_bq+_bfr)/_nseg, _v=skateTube.v;
      _v += -0.34*Math.cos(_prog*Math.PI);
      _v *= 0.986; if(Math.abs(_v)<0.14){ _v=(_prog<0.5?-0.45:0.45);
      } skateTube.v=_v; var _av=Math.abs(_v), _sg=(_v>=0?1:-1);
      coin.vx=_btx*_sg*_av; coin.vy=_bty*_sg*_av;
      coin.x+=(_bpx-coin.x)*0.6;
      coin.y+=(_bpy-coin.y)*0.6;
      if((_prog<=0.03 && _v<0) || (_prog>=0.97 && _v>0)){ skateTube=null;
      } else if(skateCD<=0){ try{ spawnSparks(coin.x,coin.y,current,3);
      }catch(e){} skateCD=5; } } } } if(skateCD>0) skateCD--;
      if(hzTier()>=2&&!skateTube){ var _bmp=skateBumps();
      for(var _bi=0;_bi<_bmp.length;_bi++){ var _bp=_bmp[_bi];
      if(Math.abs(coin.x-_bp.x)<_bp.w/2+COIN_R && Math.abs(coin.y-_bp.y)<_bp.h/2+COIN_R){ var _bsp=Math.hypot(coin.vx,coin.vy);
      if(_bsp>4 && (!coin.air||coin.air<=0)){ coin.air=16;
      coin.air0=16; coin.vx*=1.06;
      coin.vy*=1.06; try{ spawnSparks(_bp.x,_bp.y,current,10);
      }catch(e){} try{ if(typeof sfxBump==='function') sfxBump(4);
      }catch(e){} try{ nsKick(4);
      }catch(e){} } else if(!coin.air||coin.air<=0){ coin.vx*=0.97;
      coin.vy*=0.97; } break; } } } } if((typeof boardKey!=='undefined')&&boardKey==='jungle'&&moving&&!scoring&&stadiumHazards()){ var _jt=hzTier();
      _jgEnsure(); if(jungleCD>0) jungleCD--;
      var _vs=jungleVines(); for(var _vi=0;_vi<_vs.length;_vi++){ var _vdx=coin.x-_vs[_vi].x,_vdy=coin.y-_vs[_vi].y;
      if(Math.hypot(_vdx,_vdy)<COIN_R+12){ coin.vx*=0.85;
      coin.vy*=0.85; jungleGrab={vx:_vs[_vi].x, vy:_vs[_vi].y, bx:coin.x, by:coin.y, life:12};
      if(jungleCD<=0){ try{ if(typeof sfxBump==='function') sfxBump(3);
      }catch(e){} try{ spawnSparks(_vs[_vi].x,_vs[_vi].y,current,6);
      }catch(e){} jungleCD=10;
      } break; } } if(_jt>=1){ if(bananaCD>0) bananaCD--;
      if(bananaSlip>0) bananaSlip--;
      if((!coin.air||coin.air<=0)&&bananaCD<=0){ for(var _bi=0;_bi<jungleBananas.length;_bi++){ var _bn=jungleBananas[_bi];
      if(Math.hypot(coin.x-_bn.x,coin.y-_bn.y)<COIN_R+_bn.r){ var _da=(Math.random()-0.5)*1.1,_dc=Math.cos(_da),_ds=Math.sin(_da),_nvx=coin.vx*_dc-coin.vy*_ds,_nvy=coin.vx*_ds+coin.vy*_dc;
      coin.vx=_nvx*1.08; coin.vy=_nvy*1.08;
      bananaSlip=34; bananaCD=14;
      try{ if(typeof sfxCurl==='function') sfxCurl();
      }catch(e){} try{ spawnSparks(_bn.x,_bn.y,current,6);
      }catch(e){} try{ setStatus('SLIP!');
      }catch(e){} break; } } } } if(_jt>=2){ for(var _li2=0;_li2<jungleLogs.length;_li2++){ var _lg2=jungleLogs[_li2];
      if((!coin.air||coin.air<=0) && Math.abs(coin.x-_lg2.x)<_lg2.ax+COIN_R && Math.abs(coin.y-_lg2.y)<_lg2.ay+COIN_R){ if(_lg2.vx!==0){ var _dir=(_lg2.vx>=0?1:-1);
      coin.vx=_dir*Math.max(Math.abs(coin.vx),5.5);
      coin.vy+=(coin.y-_lg2.y)*0.05;
      coin.x=_lg2.x+_dir*(_lg2.ax+COIN_R+1);
      } else { var _diry=(_lg2.vy>=0?1:-1);
      coin.vy=_diry*Math.max(Math.abs(coin.vy),5.5);
      coin.vx+=(coin.x-_lg2.x)*0.05;
      coin.y=_lg2.y+_diry*(_lg2.ay+COIN_R+1);
      } try{ if(typeof sfxBump==='function') sfxBump(7);
      }catch(e){} try{ spawnSparks(coin.x,coin.y,current,10);
      }catch(e){} try{ nsKick(6);
      }catch(e){} break; } } } } if((typeof boardKey!=='undefined')&&boardKey==='aquarium'&&moving&&!scoring&&stadiumHazards()){ var _aqt=hzTier();
      aqCurAng+=0.008; var _cm=0.045;
      if(Math.hypot(coin.vx,coin.vy)>0.6){ coin.vx+=Math.cos(aqCurAng)*_cm;
      coin.vy+=Math.sin(aqCurAng)*_cm;
      } if(!coin.air||coin.air<=0){ var _bj=aqBubbles();
      for(var _bi=0;_bi<_bj.length;_bi++){ var _bdx=coin.x-_bj[_bi].x,_bdy=coin.y-_bj[_bi].y,_bd=Math.hypot(_bdx,_bdy);
      if(_bd<17&&_bd>0.5){ var _bf=(1-_bd/17)*0.5;
      coin.vx+=(_bdx/_bd)*_bf;
      coin.vy+=(_bdy/_bd)*_bf;
      try{ if(typeof sfxBubble==='function') sfxBubble();
      }catch(e){} } } var _wl=aqWhirl();
      for(var _wi=0;_wi<_wl.length;_wi++){ var _w=_wl[_wi],_wdx=_w.x-coin.x,_wdy=_w.y-coin.y,_wd=Math.hypot(_wdx,_wdy);
      if(_wd<_w.r&&_wd>1){ var _wf=(1-_wd/_w.r);
      coin.vx+=(_wdx/_wd)*_wf*0.11+(-_wdy/_wd)*_wf*0.15;
      coin.vy+=(_wdy/_wd)*_wf*0.11+(_wdx/_wd)*_wf*0.15;
      if(_wd<9){ var _ea=aqCurAng*2.7,_ej=8;
      coin.vx=Math.cos(_ea)*_ej;
      coin.vy=Math.sin(_ea)*_ej;
      coin.x=_w.x+Math.cos(_ea)*11;
      coin.y=_w.y+Math.sin(_ea)*11;
      try{ spawnSparks(_w.x,_w.y,current,10);
      }catch(e){} try{ if(typeof sfxPortal==='function') sfxPortal();
      }catch(e){} } } } } } if((typeof boardKey!=='undefined')&&boardKey==='beach'&&!scoring&&stadiumHazards()){ var _bet=hzTier();
      _beEnsure(); if(!coin.air||coin.air<=0){ if(_bet>=2){ for(var _bbi=0;_bbi<beachBalls.length;_bbi++){ var _bb=beachBalls[_bbi];
      var _dxb=coin.x-_bb.x,_dyb=coin.y-_bb.y,_ddb=Math.hypot(_dxb,_dyb),_mnb=COIN_R+_bb.r;
      if(_ddb<_mnb&&_ddb>0){ var _uxb=_dxb/_ddb,_uyb=_dyb/_ddb,_ovb=_mnb-_ddb;
      coin.x+=_uxb*_ovb; coin.y+=_uyb*_ovb;
      var _dotb=coin.vx*_uxb+coin.vy*_uyb;
      if(_dotb<0){ coin.vx-=1.7*_dotb*_uxb;
      coin.vy-=1.7*_dotb*_uyb;
      } var _imp=Math.max(0,-_dotb);
      _bb.vx-=_uxb*(_imp*0.55+0.5);
      _bb.vy-=_uyb*(_imp*0.55+0.5);
      var _bcap=Math.hypot(_bb.vx,_bb.vy);
      if(_bcap>5){ _bb.vx*=5/_bcap;
      _bb.vy*=5/_bcap; } try{sfxBump(4);
      }catch(e){} } } } var _wv=beachWave();
      if(_wv){ if(_wv.axis==='h'){ if(Math.abs(coin.y-_wv.pos)<20){ coin.vy+=0.10*_wv.py;
      coin.vx+=(Math.random()-0.5)*0.05;
      } } else { if(Math.abs(coin.x-_wv.pos)<20){ coin.vx+=0.10*_wv.px;
      coin.vy+=(Math.random()-0.5)*0.05;
      } } } if(_bet>=1){ for(var _cri=0;_cri<beachCrabs.length;_cri++){ var _cr=beachCrabs[_cri],_crdx=coin.x-_cr.x,_crdy=coin.y-_cr.y,_crd=Math.hypot(_crdx,_crdy);
      if(_crd<COIN_R+9&&_crd>0){ var _crf=2.6;
      coin.vx+=(_crdx/_crd)*_crf;
      coin.vy+=(_crdy/_crd)*_crf;
      try{ if(typeof sfxBump==='function') sfxBump(5);
      }catch(e){} if(TAC.aftershock&&!aftUsed){ try{ aftShock([_cr],_cr.x,_cr.y,4,false); }catch(e){} } } } } } } if(royBlizzard() && moving && !scoring){ var _gst=royGust()*ROY_GUST_MAX;
      coin.vx+=Math.cos(royGustDir)*_gst;
      coin.vy+=Math.sin(royGustDir)*_gst;
      } const f=scoring?NET_FRICTION:Math.min(0.995,(FRICTION+TAC.glide+royFloorFric()+((typeof boardKey!=='undefined'&&stadiumHazards())?((boardKey==='space')?0.007:(boardKey==='skate'?0.005:(boardKey==='minigolf'?-0.006:0))):0)+((typeof bananaSlip!=='undefined'&&bananaSlip>0)?0.012:0)));
      /* GRASS DRAG on CRAZY GOLF: a golf course rolls slower than a hard pitch, and the arena's ability
         pool includes Cannon (1.5x power -> launches up to ~15 px/frame), which on the standard 0.984
         friction rockets around for ~2.8s and is hard to track. The -0.006 delta (f~=0.978) settles a
         cannon shot in ~1.9s and still lets a normal flick roll the length of the pitch, so scoring is
         unaffected but the ball is followable. */
      coin.vx*=f; coin.vy*=f; if(TAC.backspin&&moving&&!scoring){ if(!backspinPhase){ coin.vx*=0.92;
      coin.vy*=0.92; var _bfv=coin.vx*backspinFx+coin.vy*backspinFy;
      if(_bfv<0.4){ coin.vx=-backspinFx*3.0;
      coin.vy=-backspinFy*3.0;
      backspinPhase=1; if(TAC.serpent){ serpentBase+=Math.PI;
      serpentDir=-serpentDir; } try{ if(!muted) sfxCurl();
      }catch(e){} } } else { coin.vx*=0.90;
      coin.vy*=0.90; } } if(bumpPending){ coin.vx*=1.5;
      coin.vy*=1.5; bumpPending=false;
      } var _tv=Math.hypot(coin.vx,coin.vy);
      if(_tv>26){ var _tk=26/_tv;
      coin.vx*=_tk; coin.vy*=_tk;
      } if(moving&&!scoring){ for(var _mk=0;_mk<2;_mk++){ var _mt=_mk?'blue':'red';
      if(current===_mt) continue;
      if((sideAb[_mt]||[]).indexOf('magnet')<0) continue;
      var _mg=null; for(var _mi=0;_mi<nails.length;_mi++){ if(nails[_mi].team===_mt&&nails[_mi].goalie){ _mg=nails[_mi];
      break; } } if(!_mg||_mg._aftShock) continue;
      var _mdx=_mg.x-coin.x, _mdy=_mg.y-coin.y, _md=Math.hypot(_mdx,_mdy)||1, _mR=GOAL_W*0.95;
      var _mgl=(_mt==='red')?(H-NET_DEPTH-COIN_R):(NET_DEPTH+COIN_R);
      var _mtow=(_mt==='red')?(coin.vy>0.05):(coin.vy<-0.05), _mon=false;
      if(_mtow){ var _mtt=(_mgl-coin.y)/coin.vy;
      if(_mtt>0){ var _mxa=coin.x+coin.vx*_mtt;
      _mon=Math.abs(_mxa-W/2)<GOAL_W/2+COIN_R;
      } } if(_md<_mR && _mon && Math.hypot(coin.vx,coin.vy)>0.15){ var _f=1-_md/_mR;
      var _pux=(_mdx/_md)*(0.05+0.11*_f), _puy=(_mdy/_md)*(0.05+0.11*_f);
      var _mown=(_mt==='red')?1:-1;
      if(_puy*_mown>0) _puy=0;
      coin.vx+=_pux; coin.vy+=_puy;
      var _drag=0.985-0.06*_f;
      coin.vx*=_drag; coin.vy*=_drag;
      } } }
        if(TAC.boomerang&&moving&&!scoring){ var _bmid=H/2, _bfwd=(current==='red')?(coin.y<_bmid-6):(coin.y>_bmid+6), _bback=(current==='red')?(coin.y>_bmid+6):(coin.y<_bmid-6);
        if(_bfwd) _boomFwd=true;
        if(_boomFwd&&!_boomUsed&&_bback){ var _bsp=Math.hypot(coin.vx,coin.vy);
        if(_bsp>1.1){ var _bgy=(current==='red')?(NET_DEPTH+2):(H-NET_DEPTH-2), _bdx=W/2-coin.x, _bdy=_bgy-coin.y, _bd=Math.hypot(_bdx,_bdy)||1, _bs=Math.max(_bsp,4.4);
        coin.vx=(_bdx/_bd)*_bs; coin.vy=(_bdy/_bd)*_bs;
        _boomUsed=true; try{sfxCurl();
        }catch(e){} try{ spawnSparks(coin.x,coin.y,current,12);
        }catch(e){} try{ setStatus('BOOMERANG!');
        }catch(e){} try{ abilitySlotPop(current,'boomerang',1.5);
        }catch(e){} try{ syncSlots();
        }catch(e){} } } } if(TAC.guided&&moving&&!scoring&&steerHold!=null&&steerBudget>0){ var _sd=steerHold-coin.x;
        coin.vx+=Math.max(-0.18,Math.min(0.18,_sd*0.02));
        steerBudget--; }
      if(scoring){
        scoreFrames++;
        const atBack=scoringTeam==='red'?coin.y<=COIN_R+2.5:coin.y>=H-COIN_R-2.5;
        if((celebrated&&atBack&&Math.abs(coin.vy)<NET_STOP&&Math.abs(coin.vx)<NET_STOP)||scoreFrames>40){
          const t=scoringTeam; coin.vx=0; coin.vy=0; moving=false; scoring=false;
          if(!celebrated){ celebrated=true; netBulge=3; netBulgeX=coin.x; netHold=10; hitStop=2; celebrate(t,6); }
          finalizeGoal(t);
        }
      } else if(!cgDrown && !(typeof royDevil!=='undefined'&&royDevil&&royDevil.hasBall) && !(typeof skateTube!=='undefined'&&skateTube) && Math.hypot(coin.vx,coin.vy)<STOP_V){ coin.vx=0;
      coin.vy=0; separateCoin();
      moving=false; endFlick();
      }
    }
    // Advance the water drown: sink (SINK frames), then drop onto the grass (DROP frames). The ball already
    // rests at cgDrown.gx/gy; this only paces the turn — the render (drawCgDrown) shows sink + drop. When the
    // drop lands, release the turn through endFlick (a water death is not a keep, so possession passes).
    function cgDrownTick(){ if(!cgDrown) return;
    cgDrown.t++;
    if(cgDrown.t>=CG_DROWN_SINK+CG_DROWN_DROP){ cgDrown=null;
    coin.vx=0; coin.vy=0; coin.air=0; moving=false;
    try{ separateCoin(); }catch(e){}   // nudge off any peg it landed on, as the normal stop path would
    try{ endFlick(); }catch(e){} } }
    function syncSpecialNails(){ nails=nails.filter(function(n){ return !n.striker && !n.defender;
    }); for(var qi=0;qi<nails.length;qi++){ nails[qi].damp=false;
    nails[qi].bike=false; nails[qi].clearer=false;
    } var playTop=WALL+NET_DEPTH+NAIL_R+2, playBot=H-WALL-NET_DEPTH-NAIL_R-2, span=playBot-playTop;
    ['red','blue'].forEach(function(tm){ var ab=sideAb[tm]||[];
    if(ab.indexOf('striker')>=0){ var isRed=(tm==='red');
    var sy=isRed?(playTop+span*0.30):(playBot-span*0.30);
    var sn={x:W/2,y:sy,team:tm,goalie:false,striker:true};
    try{ var sp=resolveSpot(sn.x,sn.y,sn);
    sn.x=sp.x; sn.y=sp.y; }catch(e){} nails.push(sn);
    } if(ab.indexOf('defender')>=0){ var isRedD=(tm==='red');
    var dyD=isRedD?(playBot-span*0.24):(playTop+span*0.24);
    var dn={x:W/2,y:dyD,team:tm,goalie:false,defender:true};
    try{ var dsp=resolveSpot(dn.x,dn.y,dn);
    dn.x=dsp.x; dn.y=dsp.y; }catch(e){} nails.push(dn);
    } if(ab.indexOf('anchor')>=0){ var own=nails.filter(function(n){ return n.team===tm && !n.goalie && !n.striker;
    }); own.sort(function(a,b){ return (tm==='red')?(b.y-a.y):(a.y-b.y);
    }); if(own[0]) own[0].damp=true;
    } if(ab.indexOf('clearance')>=0){ var _owc=nails.filter(function(n){ return n.team===tm && !n.goalie && !n.striker && !n.damp;
    }); if(!_owc.length) _owc=nails.filter(function(n){ return n.team===tm && !n.goalie && !n.striker;
    }); _owc.sort(function(a,b){ return (tm==='red')?(b.y-a.y):(a.y-b.y);
    }); if(_owc[0]) _owc[0].clearer=true;
    } if(ab.indexOf('volley')>=0){ var _fwd=nails.filter(function(n){ return n.team===tm && !n.goalie;
    }); _fwd.sort(function(a,b){ return (tm==='red')?(a.y-b.y):(b.y-a.y);
    }); if(_fwd[0]) _fwd[0].bike=true;
    } }); } function phasingOverlap(){ for(var i=0;i<nails.length;i++){ var n=nails[i];
    if(n.goalie) continue; if(Math.hypot(coin.x-n.x,coin.y-n.y)<COIN_R+NAIL_R) return true;
    } var ov=false; ['red','blue'].forEach(function(tm){ if(ov) return;
    if((sideAb[tm]||[]).indexOf('wall')<0) return;
    var _h=(wallHP[tm]==null)?WALL_MAX:wallHP[tm];
    if(_h<=0) return; var bw=Math.round(GOAL_W*0.30), bh=24, bx=Math.round(W/2-bw/2), isTop=(tm==='blue'), by=isTop?(NET_DEPTH+GOAL_AREA_D-Math.round(bh/2)):(H-NET_DEPTH-GOAL_AREA_D-Math.round(bh/2)), cyb=by+bh/2;
    if(coin.x>bx-COIN_R && coin.x<bx+bw+COIN_R && Math.abs(coin.y-cyb)<COIN_R+bh/2) ov=true;
    }); return ov; } function portalPts(tm){ var lx=WALL+11, rx=W-WALL-11, ty=WALL+11, by=H-WALL-11;
    if(tm==='red') return {ex:lx,ey:by,xx:rx,xy:ty};
    return {ex:rx,ey:ty,xx:lx,xy:by};
    } function rollTraps(){ if((typeof royaleArena!=='undefined' && royaleArena && royaleArena.cust==='traps')||_g1('web')){ if(!moving){ var _wbase=(typeof royaleLevel!=='undefined'&&royaleLevel==='easy')?6:5;
    var _wg=0; while(rtraps.length<_wbase && _wg<50){ _wg++;
    var _ws=_newWebSpot(); if(_ws) rtraps.push(_ws);
    else break; } } } else if(rtraps.length){ rtraps=[];
    } for(var _k=0;_k<2;_k++){ var tm=_k?'blue':'red';
    if((sideAb[tm]||[]).indexOf('trap')<0){ trapPos[tm]=null;
    trapUsed[tm]=false; continue;
    } trapUsed[tm]=false; if(trapPos[tm]||moving) continue;
    var px,py,ok,tries=0; do{ ok=true;
    px=WALL+18+Math.random()*(W-2*WALL-36);
    var _g=NET_DEPTH+GOAL_AREA_D+12, _y0=(tm==='red')?(H/2):_g, _y1=(tm==='red')?(H-_g):(H/2);
    py=_y0+Math.random()*(_y1-_y0);
    if(nails){ for(var i=0;i<nails.length;i++){ if(Math.hypot(px-nails[i].x,py-nails[i].y)<NAIL_R+TRAP_R+6){ ok=false;
    break; } } } if(coin && Math.hypot(px-coin.x,py-coin.y)<TRAP_R+COIN_R+10) ok=false;
    tries++; }while(!ok&&tries<40);
    trapPos[tm]={x:px,y:py};
    } } function trapHit(){ for(var _k=0;_k<2;_k++){ var tm=_k?'blue':'red';
    if(current===tm) continue;
    if(trapUsed[tm]||!trapPos[tm]) continue;
    if((sideAb[tm]||[]).indexOf('trap')<0) continue;
    var p=trapPos[tm]; if(Math.hypot(coin.x-p.x,coin.y-p.y)<TRAP_R+COIN_R){ if(ghosting || (TAC.ghost && !ghostUsed)){ ghostUsed=true;
    ghosting=false; trapUsed[tm]=true;
    try{sfxTrapSnap();}catch(e){} trapFx={x:p.x,y:p.y,team:tm,life:TRAP_FX_DUR};
    spawnSparks(p.x,p.y,tm,10);
    continue; } trapFx={x:p.x,y:p.y,team:tm,life:TRAP_FX_DUR};
    trapUsed[tm]=true; try{sfxTrapSnap();
    }catch(e){} coin.vx=0; coin.vy=0;
    coin.x=p.x; coin.y=p.y; spawnSparks(p.x,p.y,tm,10);
    return true; } } if(typeof rtraps!=='undefined' && rtraps.length && current!=='blue'){ for(var _ri=rtraps.length-1;_ri>=0;_ri--){ var rt=rtraps[_ri];
    if(Math.hypot(coin.x-rt.x,coin.y-rt.y)<TRAP_R+COIN_R){ if(ghosting || (TAC.ghost && !ghostUsed)){ ghostUsed=true;
    ghosting=false; rtraps.splice(_ri,1);
    try{sfxTrapSnap();}catch(e){} trapFx={x:rt.x,y:rt.y,team:null,life:TRAP_FX_DUR};
    spawnSparks(rt.x,rt.y,null,10);
    try{ if(typeof haptic==='function') haptic([0,
    14,10,10]); }catch(_h){} continue;
    } rtraps.splice(_ri,1); try{sfxTrapSnap();
    }catch(e){} trapFx={x:rt.x,y:rt.y,team:null,life:TRAP_FX_DUR};
    coin.vx=0; coin.vy=0; coin.x=rt.x;
    coin.y=rt.y; spawnSparks(rt.x,rt.y,null,10);
    return true; } } } return false;
    } function drawTraps(now){ for(var _k=0;_k<2;_k++){ var tm=_k?'blue':'red';
    if((sideAb[tm]||[]).indexOf('trap')<0) continue;
    if(trapUsed[tm]||!trapPos[tm]) continue;
    var p=trapPos[tm], R=COIN_R+1, col='#eaf1f6';
    ctx.save(); ctx.translate(p.x,p.y);
    ctx.globalAlpha=0.28; ctx.fillStyle='#0f0a14';
    ctx.beginPath(); ctx.arc(0,0,R+1,0,Math.PI*2);
    ctx.fill(); ctx.globalAlpha=0.92;
    ctx.strokeStyle=col; ctx.lineWidth=0.7;
    ctx.lineCap='round'; var spokes=8;
    for(var a=0;a<spokes;a++){ var th=a*(Math.PI*2/spokes);
    ctx.beginPath(); ctx.moveTo(0,0);
    ctx.lineTo(Math.cos(th)*R,Math.sin(th)*R);
    ctx.stroke(); } for(var ring=1;ring<=2;ring++){ var rr=R*ring/2;
    ctx.beginPath(); for(var a2=0;a2<=spokes;a2++){ var th2=a2*(Math.PI*2/spokes), x=Math.cos(th2)*rr, y=Math.sin(th2)*rr;
    if(a2===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y); } ctx.closePath();
    ctx.stroke(); } ctx.globalAlpha=1;
    ctx.fillStyle=col; ctx.beginPath();
    ctx.arc(0,0,1,0,Math.PI*2);
    ctx.fill(); ctx.restore();
    } if(typeof rtraps!=='undefined' && rtraps.length){ for(var _rri=0;_rri<rtraps.length;_rri++){ var rt=rtraps[_rri];
    royDrawWeb(rt.x,rt.y); } } } function royDrawWeb(px,py){ var R=COIN_R+1, col='#e8e4f0';
    ctx.save(); ctx.translate(px,py);
    ctx.globalAlpha=0.28; ctx.fillStyle='#0f0a14';
    ctx.beginPath(); ctx.arc(0,0,R+1,0,Math.PI*2);
    ctx.fill(); ctx.globalAlpha=0.92;
    ctx.strokeStyle=col; ctx.lineWidth=0.7;
    ctx.lineCap='round'; var spokes=8;
    for(var a=0;a<spokes;a++){ var th=a*(Math.PI*2/spokes);
    ctx.beginPath(); ctx.moveTo(0,0);
    ctx.lineTo(Math.cos(th)*R,Math.sin(th)*R);
    ctx.stroke(); } for(var ring=1;ring<=2;ring++){ var rr=R*ring/2;
    ctx.beginPath(); for(var a2=0;a2<=spokes;a2++){ var th2=a2*(Math.PI*2/spokes), x=Math.cos(th2)*rr, y=Math.sin(th2)*rr;
    if(a2===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y); } ctx.closePath();
    ctx.stroke(); } ctx.globalAlpha=1;
    ctx.fillStyle=col; ctx.beginPath();
    ctx.arc(0,0,1,0,Math.PI*2);
    ctx.fill(); ctx.restore();
    } function drawTrapFx(now){ if(!trapFx) return;
    var f=trapFx, p=Math.max(0,f.life/TRAP_FX_DUR);
    var osc=Math.sin((1-p)*Math.PI*3)*p;
    var R=(COIN_R+2)*(1+osc*0.45);
    var col=(f.team==='red')?'#ffb0b0':(f.team==='blue')?'#a9d4ff':'#e8e4f0';
    var spokes=9; ctx.save();
    ctx.translate(f.x,f.y); ctx.globalAlpha=Math.min(1,0.3+p);
    ctx.strokeStyle=col; ctx.lineWidth=0.9;
    ctx.lineCap='round'; for(var a=0;a<spokes;a++){ var th=a*(Math.PI*2/spokes);
    ctx.beginPath(); ctx.moveTo(0,0);
    ctx.lineTo(Math.cos(th)*R,Math.sin(th)*R);
    ctx.stroke(); } for(var ring=1;ring<=2;ring++){ var rr=R*ring/2;
    ctx.beginPath(); for(var a2=0;a2<=spokes;a2++){ var th2=a2*(Math.PI*2/spokes), x=Math.cos(th2)*rr, y=Math.sin(th2)*rr;
    if(a2===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y); } ctx.closePath();
    ctx.stroke(); } ctx.restore();
    f.life--; if(f.life<=0) trapFx=null;
    } function shieldHit(tm){ if((sideAb[tm]||[]).indexOf('shield')<0||shieldUsed[tm]) return false;
    shieldUsed[tm]=true; try{sfxShield();
    }catch(e){} var into=(tm==='blue')?1:-1, sp=Math.max(3,Math.abs(coin.vy)*0.9);
    coin.vy=sp*into; coin.vx*=0.6;
    coin.y=(tm==='blue')?(NET_DEPTH+COIN_R+2):(H-NET_DEPTH-COIN_R-2);
    shieldFx={team:tm,life:SHIELD_FX_DUR,y:(tm==='blue')?NET_DEPTH:(H-NET_DEPTH)};
    spawnSparks(coin.x,coin.y,tm,20);
    try{syncSlots();}catch(e){} return true;
    } function drawMagnetPull(now){ if(!coin||!moving||scoring) return;
    for(var _mk=0;_mk<2;_mk++){ var _mt=_mk?'blue':'red';
    if(current===_mt) continue;
    if((sideAb[_mt]||[]).indexOf('magnet')<0) continue;
    var _mg=null; for(var _mi=0;_mi<nails.length;_mi++){ if(nails[_mi].team===_mt&&nails[_mi].goalie){ _mg=nails[_mi];
    break; } } if(!_mg||_mg._aftShock) continue;
    if(Math.hypot(_mg.x-coin.x,_mg.y-coin.y)>=GOAL_W*0.95) continue;
    var col=(_mt==='red')?'rgba(255,90,90,0.5)':'rgba(120,180,255,0.55)';
    ctx.save(); ctx.strokeStyle=col;
    ctx.lineWidth=1; ctx.setLineDash([3,
    3]); ctx.lineDashOffset=-((now||0)*0.02);
    ctx.beginPath(); ctx.moveTo(coin.x,coin.y);
    ctx.lineTo(_mg.x,_mg.y);
    ctx.stroke(); ctx.restore();
    } } function drawShield(now){ var gL=(W-GOAL_W)/2, gR=(W+GOAL_W)/2;
    for(var _k=0;_k<2;_k++){ var tm=_k?'blue':'red';
    if((sideAb[tm]||[]).indexOf('shield')<0||shieldUsed[tm]) continue;
    var gy=(tm==='blue')?NET_DEPTH:(H-NET_DEPTH), dir=(tm==='blue')?1:-1, col=(tm==='red')?'#ff7a7a':'#7ab8ff';
    ctx.save(); ctx.globalAlpha=0.16;
    ctx.fillStyle=col; ctx.beginPath();
    ctx.moveTo(gL,gy); ctx.quadraticCurveTo(W/2,gy+dir*11,gR,gy);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha=0.5; ctx.strokeStyle=col;
    ctx.lineWidth=1.3; ctx.beginPath();
    ctx.moveTo(gL,gy); ctx.quadraticCurveTo(W/2,gy+dir*11,gR,gy);
    ctx.stroke(); ctx.restore();
    } if(shieldFx){ var f=shieldFx, p=Math.max(0,f.life/SHIELD_FX_DUR), dir2=(f.team==='blue')?1:-1, col2=(f.team==='red')?'#ffb0b0':'#a9d4ff';
    ctx.save(); ctx.globalAlpha=p;
    ctx.strokeStyle=col2; ctx.lineWidth=2.2*p+0.5;
    ctx.beginPath(); ctx.moveTo(gL,f.y);
    ctx.quadraticCurveTo(W/2,f.y+dir2*(11+(1-p)*16),gR,f.y);
    ctx.stroke(); for(var i=0;i<6;i++){ var sx=gL+(gR-gL)*(i+0.5)/6, sh=(1-p);
    ctx.globalAlpha=p*0.9; ctx.beginPath();
    ctx.moveTo(sx,f.y+dir2*11);
    ctx.lineTo(sx+(i-2.5)*3*sh, f.y+dir2*(6+sh*22));
    ctx.stroke(); } ctx.restore();
    f.life--; if(f.life<=0) shieldFx=null;
    } }
    /* AFTERSHOCK — the shot carries a charge: the FIRST opponent piece it strikes is SHOCKED for the
       REST of the shooter's turn (lifecycle lives in trioReset; the stun dies at the turn handover). What
       a shock means depends on what was hit, but it is always "stops doing its job, stays a body":
         keeper            stops tracking / sweeping / magnet-catching; still physically blocks
         outfield token    its tricks are off — no clearance lunge, no anchor damp, no gridiron roam/punt
         roaming hazard    (dust devil, boulder, crabs) freezes on the spot
       Off a KEEPER the rebound additionally keeps AFT_KEEP of the arrival speed, as a FLOOR not a cap, so
       the riposte ball comes back out far enough to keep the turn alive — that pace floor is what makes
       the intended combo playable: shock the keeper, catch the rebound on your own token, then shoot at a
       keeper that cannot move for the rest of your turn. Once per flick (aftUsed), so nothing here can
       stop the ball settling — and successive flicks MERGE into one stun set rather than replacing it,
       because a replaced entity would keep its _aftShock flag with nobody left to clear it. */
    function aftShock(list,hx,hy,pre,isKeeper){ if(aftUsed||!list||!list.length) return; aftUsed=true;
    for(var _si=0;_si<list.length;_si++){ list[_si]._aftShock=true; }
    if(aftStun && aftStun.by===current){ for(var _mi2=0;_mi2<list.length;_mi2++){ if(aftStun.list.indexOf(list[_mi2])<0) aftStun.list.push(list[_mi2]); } }
    else { aftClearStun(); aftStun={by:current,list:list.slice()}; }
    if(isKeeper){ var _an=Math.hypot(coin.vx,coin.vy), want=(pre||0)*AFT_KEEP;
    if(want>0.2){ if(_an<0.05){ var ux2=coin.x-hx, uy2=coin.y-hy, ul=Math.hypot(ux2,uy2)||1;
    coin.vx=(ux2/ul)*want; coin.vy=(uy2/ul)*want;
    } else if(_an<want){ var k=want/_an; coin.vx*=k; coin.vy*=k; } } }
    aftFx={x:hx,y:hy,life:AFT_FX_DUR,team:current};
    try{ spawnSparks(hx,hy,current,16); }catch(e){}
    try{ if(typeof nsKick==='function') nsKick(Math.min(9,(pre||4)*1.2)); }catch(e){}
    try{ setStatus(isKeeper?'AFTERSHOCK - KEEPER SHOCKED!':'AFTERSHOCK - SHOCKED!'); }catch(e){}
    try{ if(typeof sfxAftershock==='function') sfxAftershock(pre); }catch(e){}
    try{ if(typeof abilitySlotPop==='function') abilitySlotPop(current,'aftershock',1.3); }catch(e){}
    }
    function aftClearStun(){ if(!aftStun) return;
    try{ for(var _ci=0;_ci<aftStun.list.length;_ci++){ aftStun.list[_ci]._aftShock=false; } }catch(e){}
    aftStun=null; }
    /* Impact ring (expanding PIXEL ring + debris, the oil-splash idiom) plus the stun tell: jittering
       bolt pixels over every shocked piece for as long as the stun lasts, so both players can see exactly
       what is frozen and for how long. */
    function drawAftershock(now){ if(aftFx){ var f=aftFx, p=1-(f.life/AFT_FX_DUR), a=Math.max(0,f.life/AFT_FX_DUR);
    var R=3+Math.round(p*AFT_R), big=(p<0.4);
    ctx.save();
    ctx.fillStyle='rgba(255,232,150,'+(0.85*a).toFixed(3)+')';
    for(var k=0;k<20;k++){ var ang=k/20*Math.PI*2;
    var rx=Math.round(f.x+Math.cos(ang)*R), ry=Math.round(f.y+Math.sin(ang)*R);
    if(_cgRnd(k+0.3)>0.2) ctx.fillRect(rx,ry,big?2:1,big?2:1); }
    ctx.fillStyle='rgba(246,138,44,'+(0.7*a).toFixed(3)+')';
    for(var d2=0;d2<10;d2++){ var a2=(d2/10)*Math.PI*2+_cgRnd(d2)*0.5, dd=R*(0.55+_cgRnd(d2+0.4)*0.4);
    ctx.fillRect(Math.round(f.x+Math.cos(a2)*dd),Math.round(f.y+Math.sin(a2)*dd),1,1); }
    if(p<0.5){ ctx.fillStyle='rgba(255,250,225,'+(0.75*a).toFixed(3)+')';
    ctx.fillRect(Math.round(f.x)-2,Math.round(f.y)-2,4,4); }
    ctx.restore();
    f.life--; if(f.life<=0) aftFx=null; }
    if(aftStun&&aftStun.list){ var _ph=Math.floor((now||0)/90)%3;
    ctx.save();
    for(var _ti=0;_ti<aftStun.list.length;_ti++){ var t=aftStun.list[_ti];
    if(!t||!t._aftShock||t.x==null) continue;
    var bx=Math.round(t.x), by=Math.round(t.y)-NAIL_R-5;
    // a tiny 3-step lightning zigzag, hopping between three poses so it reads as crackling
    ctx.fillStyle='#ffe98a';
    if(_ph===0){ ctx.fillRect(bx-2,by-3,1,2); ctx.fillRect(bx-1,by-1,1,2); ctx.fillRect(bx-2,by+1,1,1); }
    else if(_ph===1){ ctx.fillRect(bx+1,by-3,1,2); ctx.fillRect(bx,by-1,1,2); ctx.fillRect(bx+1,by+1,1,1); }
    else { ctx.fillRect(bx-1,by-2,1,2); ctx.fillRect(bx,by,1,1); ctx.fillRect(bx+1,by-3,1,1); }
    ctx.fillStyle='rgba(255,250,225,0.9)'; ctx.fillRect(bx+((_ph===1)?-2:2),by-1,1,1);
    }
    ctx.restore(); }
    } function drawPortals(now){ var _t=(now||0)*0.006;
    ['red','blue'].forEach(function(tm){ if((sideAb[tm]||[]).indexOf('portal')<0) return;
    var pp=portalPts(tm); [[pp.ex,
    pp.ey,'#7fdcff','#173a55'],
    [pp.xx,pp.xy,'#d79bff','#3a1f5c']].forEach(function(p){ var R=PORTAL_R+1.5;
    ctx.save(); ctx.translate(p[0],p[1]);
    ctx.beginPath(); ctx.arc(0,0,R-1,0,Math.PI*2);
    ctx.fillStyle=p[3]; ctx.fill();
    ctx.rotate(_t); ctx.strokeStyle='rgba(255,255,255,0.92)';
    ctx.lineWidth=1.1; ctx.lineCap='round';
    for(var a=0;a<2;a++){ ctx.beginPath();
    var base=a*Math.PI; for(var s=0;s<=1.001;s+=0.13){ var rr=(R-0.6)*s, th=base+s*Math.PI*1.9, x=Math.cos(th)*rr, y=Math.sin(th)*rr;
    if(s===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y); } ctx.stroke();
    } ctx.rotate(-_t); ctx.strokeStyle=p[2];
    ctx.lineWidth=1.6; ctx.beginPath();
    ctx.arc(0,0,R,0,Math.PI*2);
    ctx.stroke(); ctx.fillStyle='#ffffff';
    ctx.beginPath(); ctx.arc(0,0,1,0,Math.PI*2);
    ctx.fill(); ctx.restore();
    }); }); if(typeof royaleArena!=='undefined' && royaleArena && royaleArena.cust==='portals'){ var _pp=royPortalPts();
    for(var _pi=0;_pi<_pp.length;_pi++) royDrawPortal(_pp[_pi].x,_pp[_pi].y,now);
    } } function royPortalPts(){ var lx=WALL+13, rx=W-WALL-13, ty=WALL+13, by=H-WALL-13;
    return [{x:lx,y:ty},{x:rx,y:ty},
    {x:lx,y:by},{x:rx,y:by},
    {x:Math.round(W/2),y:Math.round(H/2)}];
    } function royDrawPortal(px,py,now){ var _t=(now||0)*0.006, R=PORTAL_R+2;
    ctx.save(); ctx.translate(px,py);
    ctx.beginPath(); ctx.arc(0,0,R-1,0,Math.PI*2);
    ctx.fillStyle='#2a1f5c';
    ctx.fill(); ctx.rotate(_t);
    ctx.strokeStyle='rgba(215,155,255,0.95)';
    ctx.lineWidth=1.1; ctx.lineCap='round';
    for(var a=0;a<2;a++){ ctx.beginPath();
    var base=a*Math.PI; for(var sp=0;sp<=1.001;sp+=0.13){ var rr=(R-0.6)*sp, th=base+sp*Math.PI*1.9, x=Math.cos(th)*rr, y=Math.sin(th)*rr;
    if(sp===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y); } ctx.stroke();
    } ctx.rotate(-_t*1.6); ctx.strokeStyle='rgba(127,220,255,0.9)';
    for(var a2=0;a2<2;a2++){ ctx.beginPath();
    var base2=a2*Math.PI+1.2;
    for(var s2=0;s2<=1.001;s2+=0.16){ var rr2=(R-1.4)*s2, th2=base2+s2*Math.PI*1.6, x2=Math.cos(th2)*rr2, y2=Math.sin(th2)*rr2;
    if(s2===0) ctx.moveTo(x2,y2);
    else ctx.lineTo(x2,y2); } ctx.stroke();
    } ctx.restore(); } function royPortalStep(){ if(!(typeof royaleArena!=='undefined' && royaleArena && royaleArena.cust==='portals')) return;
    if(rportCD>0) return; var pts=royPortalPts();
    for(var i=0;i<pts.length;i++){ if(Math.hypot(coin.x-pts[i].x,coin.y-pts[i].y)<PORTAL_R+COIN_R){ var j;
    do{ j=Math.floor(Math.random()*pts.length);
    }while(j===i); var sp=Math.hypot(coin.vx,coin.vy)||1, ux=coin.vx/sp, uy=coin.vy/sp;
    coin.x=pts[j].x+ux*(PORTAL_R+COIN_R+3);
    coin.y=pts[j].y+uy*(PORTAL_R+COIN_R+3);
    rportCD=10; try{ if(typeof sfxPortal==='function') sfxPortal();
    }catch(e){} spawnSparks(pts[i].x,pts[i].y,null,10);
    spawnSparks(pts[j].x,pts[j].y,null,10);
    try{ if(typeof haptic==='function') haptic([0,
    12,22,14]); }catch(_h){} return;
    } } } function collideStep(){
      // THE ALLEY bumpers (easy/med): the raised rail fills the coin-width channel, so the ball must bounce off
      // its INNER FACE, not the wall hidden behind it — inset the side boundary by the rail width. Hard has no
      // bumper (inset 0), so the ball reaches the wall and the gutter capture takes it.
      var _bInset=((typeof bowlArena==='function')&&bowlArena()&&bowlCfg().bumpers)?(COIN_R*2+1):0;
      const left=WALL+COIN_R+_bInset,right=W-WALL-COIN_R-_bInset,gL=(W-GOAL_W)/2,gR=(W+GOAL_W)/2;
      if(scoring){
        const pl=gL+COIN_R,pr=gR-COIN_R;
        if(coin.x<pl){coin.x=pl;coin.vx=0;} if(coin.x>pr){coin.x=pr;coin.vx=0;}
        let impactV=Math.abs(coin.vy);
        if(scoringTeam==='red'){ const back=COIN_R+2,line=NET_DEPTH+COIN_R;
        if(coin.y>back) coin.vy-=NET_PULL;
        if(coin.y<=back){coin.y=back;
        coin.vy=0;} if(coin.y>line){coin.y=line;
        if(coin.vy>0) coin.vy=0;
        } }
        else { const back=H-COIN_R-2,line=H-NET_DEPTH-COIN_R; if(coin.y<back) coin.vy+=NET_PULL; if(coin.y>=back){coin.y=back;coin.vy=0;} if(coin.y<line){coin.y=line; if(coin.vy<0) coin.vy=0;} }
        if(!celebrated){ celebrated=true;
        netBulge=Math.min(11,impactV*0.95+3.5);
        netBulgeX=coin.x; netHold=10;
        netVel=0; hitStop=Math.min(6,2+Math.round(impactV*0.35));
        celebrate(scoringTeam,4+impactV*0.95);
        }
        return;
      }
      if(coin.y-COIN_R<NET_DEPTH&&coin.x>gL&&coin.x<gR){ if((coin.air>0||rouletteShot)&&!(pen&&pen.active)){ coin.y=NET_DEPTH+COIN_R+1;
      coin.vy=Math.abs(coin.vy)*0.55+0.6;
      return; } if(pen&&pen.active&&pen.shooter!=='red'){ coin.vx=0;
      coin.vy=0;moving=false; penResolve(pen.keeperHit?'save':'miss');
      return; } if(pen&&pen.active){ var _t3=(coin.x<gL+GOAL_W/3)?'L':((coin.x>gR-GOAL_W/3)?'R':'C');
      if(_t3===pen.dive){ pen.keeperHit=true;
      coin.y=NET_DEPTH+COIN_R+1.5;
      coin.vy=Math.abs(coin.vy)*0.5+0.7;
      coin.vx*=0.4; spawnSparks(coin.x,NET_DEPTH+2,pen.defender,10);
      try{sfxBump(4);}catch(e){} return;
      } } if(shieldHit('blue')) return;
      if('red'!==current && (sideAb[current]||[]).indexOf('varcheck')>=0 && !varUsed[current]){ varDeny();
      return; } if(bkGoalDenied('red')){ coin.y=NET_DEPTH+COIN_R+1;
      coin.vy=Math.abs(coin.vy)*0.55+0.6; coin.vx*=0.6;
      bkNoBasket=80; try{ sfxWhistle(); }catch(e){}
      try{ spawnSparks(coin.x,NET_DEPTH+2,'red',10); }catch(e){}
      return; } scoring=true; scoringTeam='red';
      scoreFrames=0; spawnSparks(coin.x,NET_DEPTH,'red',18);
      return; }
      if(coin.y+COIN_R>H-NET_DEPTH&&coin.x>gL&&coin.x<gR){ if((coin.air>0||rouletteShot)&&!(pen&&pen.active)){ coin.y=H-NET_DEPTH-COIN_R-1;
      coin.vy=-(Math.abs(coin.vy)*0.55+0.6);
      return; } if(pen&&pen.active&&pen.shooter!=='blue'){ coin.vx=0;
      coin.vy=0;moving=false; penResolve(pen.keeperHit?'save':'miss');
      return; } if(pen&&pen.active){ var _t3=(coin.x<gL+GOAL_W/3)?'L':((coin.x>gR-GOAL_W/3)?'R':'C');
      if(_t3===pen.dive){ pen.keeperHit=true;
      coin.y=H-NET_DEPTH-COIN_R-1.5;
      coin.vy=-(Math.abs(coin.vy)*0.5+0.7);
      coin.vx*=0.4; spawnSparks(coin.x,H-NET_DEPTH-2,pen.defender,10);
      try{sfxBump(4);}catch(e){} return;
      } } if(shieldHit('red')) return;
      if('blue'!==current && (sideAb[current]||[]).indexOf('varcheck')>=0 && !varUsed[current]){ varDeny();
      return; } if(bkGoalDenied('blue')){ coin.y=H-NET_DEPTH-COIN_R-1;
      coin.vy=-(Math.abs(coin.vy)*0.55+0.6); coin.vx*=0.6;
      bkNoBasket=80; try{ sfxWhistle(); }catch(e){}
      try{ spawnSparks(coin.x,H-NET_DEPTH-2,'blue',10); }catch(e){}
      return; } scoring=true; scoringTeam='blue';
      scoreFrames=0; spawnSparks(coin.x,H-NET_DEPTH,'blue',18);
      return; }
      var _skRamp=((typeof boardKey!=='undefined')&&boardKey==='skate'&&(typeof stadiumHazards==='function')&&stadiumHazards()&&hzTier()>=1);
      // THE ALLEY gutters (med+): a side wall CAPTURES the ball instead of bouncing it — done here, at the
      // collision point, so even a fast cannon shot is caught (the once-per-frame gutter check missed it after
      // the bounce had already flung it back inward). Kill outward speed; it then rolls down the channel.
      var _bowlGut=((typeof bowlArena==='function')&&bowlArena()&&bowlCfg().gutter&&(!coin.air||coin.air<=0));
      // THE RING: the side walls ARE the ropes — elastic, so they hand the ball back with interest (rgRopeRest
      // also arms the strand's flex animation). Grounded ball only; a chip sails over them.
      var _rgRope=((typeof rgArena==='function')&&rgArena()&&(!coin.air||coin.air<=0));
      if(coin.x<left&&!_skRamp){ if(_bowlGut){ coin.x=left; coin.vx=0; coin.spin=0;
      if(!bowlGutter){ bowlGutter={side:0};
      try{ setStatus('GUTTER BALL!');
      }catch(e){} try{ if(!muted){ if(typeof sfxWhoosh==='function') sfxWhoosh();
      else if(typeof sfxBump==='function') sfxBump(3);
      } }catch(e){} try{ if(typeof haptic==='function') haptic([0,
      18,26,34]); }catch(e){} }
      } else { coin.x=left;
      var _rL=_rgRope?rgRopeRest(Math.abs(coin.vx),coin.y,0):RESTITUTION;
      coin.vx=-coin.vx*_rL;
      if(_rgRope){ var _sL=Math.hypot(coin.vx,coin.vy), _cL=rgCfg().ropeCap; if(_sL>_cL){ var _kL=_cL/_sL; coin.vx*=_kL; coin.vy*=_kL; } }
      if(coin.spin) coin.spin*=0.35;
      _achBounces++; if((sideAb[current]||[]).indexOf('ricochet')>=0 && !ricochetUsed){ ricochetUsed=true;
      coin.vx*=1.5; coin.vy*=1.2;
      spawnSparks(coin.x,coin.y,current,10);
      } if(Math.abs(coin.vx)>1.1){ spawnSparks(coin.x,coin.y,null,6,true);
      try{ sfxBounce(Math.abs(coin.vx));
      }catch(e){} try{ nsKick(Math.abs(coin.vx));
      }catch(e){} try{ nsWallHit(coin.x,coin.y);
      }catch(e){} } }}
      if(coin.x>right&&!_skRamp){ if(_bowlGut){ coin.x=right; coin.vx=0; coin.spin=0;
      if(!bowlGutter){ bowlGutter={side:1};
      try{ setStatus('GUTTER BALL!');
      }catch(e){} try{ if(!muted){ if(typeof sfxWhoosh==='function') sfxWhoosh();
      else if(typeof sfxBump==='function') sfxBump(3);
      } }catch(e){} try{ if(typeof haptic==='function') haptic([0,
      18,26,34]); }catch(e){} }
      } else { coin.x=right;
      var _rR=_rgRope?rgRopeRest(Math.abs(coin.vx),coin.y,1):RESTITUTION;
      coin.vx=-coin.vx*_rR;
      if(_rgRope){ var _sR=Math.hypot(coin.vx,coin.vy), _cR=rgCfg().ropeCap; if(_sR>_cR){ var _kR=_cR/_sR; coin.vx*=_kR; coin.vy*=_kR; } }
      if(coin.spin) coin.spin*=0.35;
      _achBounces++; if((sideAb[current]||[]).indexOf('ricochet')>=0 && !ricochetUsed){ ricochetUsed=true;
      coin.vx*=1.5; coin.vy*=1.2;
      spawnSparks(coin.x,coin.y,current,10);
      } if(Math.abs(coin.vx)>1.1){ spawnSparks(coin.x,coin.y,null,6,true);
      try{ sfxBounce(Math.abs(coin.vx));
      }catch(e){} try{ nsKick(Math.abs(coin.vx));
      }catch(e){} try{ nsWallHit(coin.x,coin.y);
      }catch(e){} } }}
      const top=WALL+COIN_R,bottom=H-WALL-COIN_R;
      if(coin.y<top&&!(coin.x>gL&&coin.x<gR)){coin.y=top;
      coin.vy=-coin.vy*RESTITUTION;
      if(coin.spin) coin.spin*=0.35;
      _achBounces++; if(Math.abs(coin.vy)>1.1){ spawnSparks(coin.x,coin.y,null,6,true);
      try{ sfxBounce(Math.abs(coin.vy));
      }catch(e){} try{ nsKick(Math.abs(coin.vy));
      }catch(e){} try{ nsWallHit(coin.x,coin.y);
      }catch(e){} }}
      if(coin.y>bottom&&!(coin.x>gL&&coin.x<gR)){coin.y=bottom;
      coin.vy=-coin.vy*RESTITUTION;
      if(coin.spin) coin.spin*=0.35;
      _achBounces++; if(Math.abs(coin.vy)>1.1){ spawnSparks(coin.x,coin.y,null,6,true);
      try{ sfxBounce(Math.abs(coin.vy));
      }catch(e){} try{ nsKick(Math.abs(coin.vy));
      }catch(e){} try{ nsWallHit(coin.x,coin.y);
      }catch(e){} }}
      for(const n of nails){ if(coin.air>0||(typeof skateTube!=='undefined'&&skateTube)) break;
      const dx=coin.x-n.x,dy=coin.y-n.y,dist=Math.hypot(dx,dy),nr=(n.goalie&&pen&&pen.active)?NAIL_R+3:((n.goalie&&((sideAb[n.team]||[]).indexOf('bigkeeper')>=0))?NAIL_R+3:NAIL_R),min=COIN_R+nr;
      if(dist<min&&dist>0){ var _gAvail=(!n.goalie) && (ghosting || (TAC.ghost && !ghostUsed && n.team!==current));
      var _isAnc=(n.damp && n.team!==current);
      if(_gAvail && _isAnc){ ghostUsed=true;
      ghosting=false; coin.vx*=0.18;
      coin.vy*=0.18; spawnSparks(n.x,n.y,n.team,12);
      continue; } if(_gAvail){ if(!ghosting){ ghostUsed=true;
      ghosting=true; spawnSparks(n.x,n.y,n.team,8);
      try{sfxGhost();}catch(e){} } continue;
      } if(TAC.drill && !drillUsed && !n.goalie && n.team!==current){ drillUsed=true;
      if(!n._drillHome){ n._drillHome={x:n.x,y:n.y};
      if(_drillDisp.indexOf(n)<0) _drillDisp.push(n);
      } var _dn=(dist>0.0001)?dist:0.0001, _dux=dx/_dn, _duy=dy/_dn, _dvn=coin.vx*_dux+coin.vy*_duy;
      coin.vx+=(-0.2*_dvn)*_dux;
      coin.vy+=(-0.2*_dvn)*_duy;
      coin.x+=_dux*(min-dist);
      coin.y+=_duy*(min-dist);
      var _dpush=Math.max(9,Math.min(30,Math.abs(_dvn)*2.6));
      n.x+=-_dux*_dpush; n.y+=-_duy*_dpush;
      try{ var _dc=clampToPitch(n.x,n.y);
      n.x=_dc.x; n.y=_dc.y; }catch(e){} spawnSparks(n.x,n.y,current,14);
      try{ if(!muted) sfxClash(Math.abs(_dvn));
      }catch(e){} continue; } const _dd=(dist<0.0001)?0.0001:dist, ov=min-dist,ux=dx/_dd,uy=dy/_dd;
      coin.x+=ux*ov; coin.y+=uy*ov;
      var _cv=Math.hypot(coin.vx,coin.vy);
      if(_cv>1.3){ try{ sfxClash(_cv);
      }catch(e){} try{ nsKick(_cv);
      }catch(e){} } if(n.bike && n.team===current && !bikeUsed && moving){ bikeUsed=true;
      var _gy=(current==='red')?NET_DEPTH:H-NET_DEPTH;
      var _vk=null; for(var _vi=0;_vi<nails.length;_vi++){ if(nails[_vi].team!==current&&nails[_vi].goalie){ _vk=nails[_vi];
      break; } } var _vtx=W/2;
      if(_vk){ var _vpl=(W-GOAL_W)/2+COIN_R+1, _vpr=(W+GOAL_W)/2-COIN_R-1;
      _vtx=(Math.abs(_vk.x-_vpl)>Math.abs(_vk.x-_vpr))?_vpl:_vpr;
      } var _gx=_vtx-n.x, _gdy=_gy-n.y, _gd=Math.hypot(_gx,_gdy)||1;
      var _bsp=Math.max(Math.hypot(coin.vx,coin.vy)*1.25,6.5);
      coin.x=n.x+(_gx/_gd)*(min+0.6);
      coin.y=n.y+(_gdy/_gd)*(min+0.6);
      coin.vx=(_gx/_gd)*_bsp; coin.vy=(_gdy/_gd)*_bsp;
      coin.spin=0; spawnSparks(n.x,n.y,current,16);
      try{sfxFlick(40);}catch(e){} struck=true;
      hitOwn=true; if(!n.goalie && typeof ecoAssist!=='undefined') ecoAssist=true;
      turnFlash=Math.max(turnFlash,14);
      continue; } const dot=coin.vx*ux+coin.vy*uy;
      if(dot<0){ var _tvx=coin.vx-dot*ux, _tvy=coin.vy-dot*uy;
      coin.vx=_tvx-dot*ux*RESTITUTION;
      coin.vy=_tvy-dot*uy*RESTITUTION;
      } if(n.goalie&&pen&&pen.active) pen.keeperHit=true;
      // AFTERSHOCK: the first opponent token the shot strikes — keeper or outfielder — takes the shock.
      // _cv is the speed the ball arrived with, captured above before the bounce reversed it.
      if(TAC.aftershock && !aftUsed && n.team!==current && _cv>1.2 && !(pen&&pen.active)){
      try{ aftShock([n], n.x+ux*NAIL_R, n.y+uy*NAIL_R, _cv, !!n.goalie); }catch(e){} }
      if(n.damp && n.team!==current && !TAC.wet && !n._aftShock){ coin.vx*=0.18;
      coin.vy*=0.18; if(!n._acd){ try{sfxAnchorHit();
      }catch(e){} n._acd=8; } } spawnSparks(n.x+ux*NAIL_R,n.y+uy*NAIL_R,n.team,n.team===current?16:9);
      struck=true; if(n.team!==current && typeof _clrSt!=='undefined' && _clrSt[n.team] && _clrSt[n.team].n===n){ _clrBlocked=true;
      } if(n.team===current){ if(!n.goalie && typeof ecoAssist!=='undefined') ecoAssist=true;
      if((sideAb[current]||[]).indexOf('bumper')>=0){ if(!n._bcd){ spawnSparks(n.x,n.y,current,12,true);
      n._bcd=8; bumpPending=true;
      try{sfxBumperHit();}catch(e){} } } hitOwn=true;
      turnFlash=Math.max(turnFlash,14);
      if(TAC.trio && !n.goalie && !n._trioHit && !_trioDone){ n._trioHit=true;
      _trioN++; var _tfire=(_trioN>=3);
      if(_tfire){ _trioDone=true;
      var _tsp=Math.hypot(coin.vx,coin.vy)||1, _tb=Math.max(FLICK_MAX*(TAC.power||1), _tsp);
      coin.vx=(coin.vx/_tsp)*_tb;
      coin.vy=(coin.vy/_tsp)*_tb;
      coin.spin=0; spawnSparks(n.x,n.y,current,18);
      try{ if(!muted) sfxFlick(60);
      }catch(e){} turnFlash=Math.max(turnFlash,20);
      } try{ trioBump(_trioN,_tfire);
      }catch(e){} } } } } ['red',
      'blue'].forEach(function(tm){ if((sideAb[tm]||[]).indexOf('wall')<0) return;
      var _hp=(wallHP[tm]==null)?WALL_MAX:wallHP[tm];
      if(_hp<=0) return; var bw=Math.round(GOAL_W*0.30), bh=24, bx=Math.round(W/2-bw/2), isTop=(tm==='blue'), by=isTop?(NET_DEPTH+GOAL_AREA_D-Math.round(bh/2)):(H-NET_DEPTH-GOAL_AREA_D-Math.round(bh/2)), cyb=by+bh/2;
      if(coin.x>bx-COIN_R && coin.x<bx+bw+COIN_R && Math.abs(coin.y-cyb)<COIN_R+bh/2){ var oL=coin.x-(bx-COIN_R), oR=(bx+bw+COIN_R)-coin.x, oT=coin.y-(by-COIN_R), oB=(by+bh+COIN_R)-coin.y, m=Math.min(oL,oR,oT,oB), hf=null;
      if(m===oT&&coin.vy>0) hf='T';
      else if(m===oB&&coin.vy<0) hf='B';
      else if(m===oL&&coin.vx>0) hf='L';
      else if(m===oR&&coin.vx<0) hf='R';
      if(hf){ if(ghosting || (TAC.ghost && !ghostUsed && current!==tm)){ if(!ghosting){ ghostUsed=true;
      ghosting=true; spawnSparks(coin.x,coin.y,null,8);
      try{sfxGhost();}catch(e){} } } else { var broke=false;
      if(wallCD<=0 && current!==tm && !TAC.ghost){ var dmg=((sideAb[current]||[]).indexOf('cannon')>=0)?2:1;
      _hp-=dmg; wallHP[tm]=_hp;
      wallCD=6; if(_hp<=0){ wallHP[tm]=0;
      broke=true; breakWall(coin.x,coin.y,tm);
      } try{syncSlots();}catch(e){} } if(true){ if(hf==='T'){ coin.y=by-COIN_R;
      coin.vy=-coin.vy*RESTITUTION;
      coin.vx*=0.98; } else if(hf==='B'){ coin.y=by+bh+COIN_R;
      coin.vy=-coin.vy*RESTITUTION;
      coin.vx*=0.98; } else if(hf==='L'){ coin.x=bx-COIN_R;
      coin.vx=-coin.vx*RESTITUTION;
      coin.vy*=0.98; } else { coin.x=bx+bw+COIN_R;
      coin.vx=-coin.vx*RESTITUTION;
      coin.vy*=0.98; } spawnSparks(coin.x,coin.y,null,6);
      } } } } }); if(typeof royaleArena!=='undefined' && royaleArena && royaleArena.cust==='fortress'){ var _fw=royWallRects();
      for(var _fi=0;_fi<_fw.length;_fi++){ var r=_fw[_fi], bx=r.x, by=r.y, bw=r.w, bh=r.h, cyb=by+bh/2;
      if(coin.x>bx-COIN_R && coin.x<bx+bw+COIN_R && Math.abs(coin.y-cyb)<COIN_R+bh/2){ var oL=coin.x-(bx-COIN_R), oR=(bx+bw+COIN_R)-coin.x, oT=coin.y-(by-COIN_R), oB=(by+bh+COIN_R)-coin.y, m=Math.min(oL,oR,oT,oB), hf=null;
      if(m===oT&&coin.vy>0) hf='T';
      else if(m===oB&&coin.vy<0) hf='B';
      else if(m===oL&&coin.vx>0) hf='L';
      else if(m===oR&&coin.vx<0) hf='R';
      if(hf==='T'){ coin.y=by-COIN_R;
      coin.vy=-coin.vy*RESTITUTION;
      coin.vx*=0.98; } else if(hf==='B'){ coin.y=by+bh+COIN_R;
      coin.vy=-coin.vy*RESTITUTION;
      coin.vx*=0.98; } else if(hf==='L'){ coin.x=bx-COIN_R;
      coin.vx=-coin.vx*RESTITUTION;
      coin.vy*=0.98; } else if(hf==='R'){ coin.x=bx+bw+COIN_R;
      coin.vx=-coin.vx*RESTITUTION;
      coin.vy*=0.98; } if(hf) spawnSparks(coin.x,coin.y,null,6);
      } } } if(ghosting && !phasingOverlap()) ghosting=false;
    }
    function endFlick(){ var _wasCleared=_clrBlocked;
    try{ trioReset(); }catch(e){} if(winner) return;
    if(pen&&pen.active){ penResolve(pen.keeperHit?'save':'miss');
    return; } if(_lkToPen) return;
    if(_lkActive){ _lkFlicks--;
    if(_lkFlicks<=0){ winner=_lkLeader;
    _lkActive=false; try{ if(mode==='exhibition') _markFirstDone();
    }catch(e){} timerRunning=false;
    try{ sfxWhistle(); }catch(e){} try{ stopAnthem();
    }catch(e){} try{ sfxCheer();
    }catch(e){} setStatus('');
    try{ updateComebackHUD();
    }catch(e){} setTimeout(function(){ try{ if(mode==='tournament') tourMatchEnd();
    else if(mode==='royale') royaleMatchEnd();
    else showMatchEnd(_lkLeader);
    }catch(e){} },1700); flickCount=0;
    hitOwn=false; if(window.__nsTurn) window.__nsTurn(current);
    return; } current=_lkTeam;
    if(typeof cgStamBase!=='undefined') cgStamBase=0;
    turnFlash=24; try{ sfxTurn();
    }catch(e){} try{ _turnBanner={t:0,dur:42,team:current,cpu:!!(aiEnabled&&aiEnabled[current])}; }catch(_tb){}
    try{ updateComebackHUD();
    }catch(e){} flickCount=0;
    hitOwn=false; if(window.__nsTurn) window.__nsTurn(current);
    return; } var _fcap=(debuffActive(current,'injury')?2:FLICK_CAP);
    // CRAZY GOLF: holed out. The payoff is ONE MORE FLICK, played from the hole the ball is sitting in.
    // Deliberately ahead of the FLICK_CAP branches below: this was earned by sinking a 7px target, not
    // by running down a clock, so the flick cap must not be able to swallow it.
    if((typeof cgHoled!=='undefined')&&cgHoled){ var _cgw=cgHoled;
    cgHoled=null; cgBonus=true; cgStamBase=flickCount; current=_cgw;
    coin.vx=0; coin.vy=0; coin.air=0;
    // Holing out KEEPS possession and the hole-out COUNTS as a flick — the tally keeps ticking down (so a
    // hole on your first flick leaves you 2). The reward is that stamina is REFRESHED to 100% at the hole
    // (cgStamBase = the current count) and then decreases again with each following flick — it is not
    // pinned at 100% for the rest of the turn. You keep the turn whether or not the shot touched your own
    // players; cgBonus caps it at one hole-out per possession.
    hitOwn=false; struck=false;
    turnFlash=24; setStatus('HOLED OUT — PLAY ON');
    try{ sfxCheer(); }catch(e){} try{ spawnSparks(coin.x,coin.y,current,16,true);
    }catch(e){} if(window.__nsTurn) window.__nsTurn(current);
    applyTactics(); updateHUD(); return; }
    if(hitOwn && flickCount<_fcap){ sfxOwn();
    try{ tutHook('keep'); }catch(e){} if(window.__nsTurn) window.__nsTurn(current);
    } else if(_wasCleared && flickCount<_fcap && !hitOwn){ setStatus('CLEARED — PLAY ON');
    sfxOwn(); if(window.__nsTurn) window.__nsTurn(current);
    } else if(TAC.sticky && struck && !stickyUsed && !hitOwn){ stickyUsed=true;
    sfxOwn(); try{ syncSlots();
    }catch(e){} if(window.__nsTurn) window.__nsTurn(current);
    } else if((function(){ try{ return tutBlockTurnLoss();
    }catch(e){ return false;
    } })()){ try{ tutHook('lose');
    }catch(e){} flickCount=0;
    hitOwn=false; if(window.__nsTurn) window.__nsTurn(current);
    } else { try{ tutHook('lose');
    }catch(e){} current=current==='red'?'blue':'red';
    if(typeof cgBonus!=='undefined'){ cgBonus=false; cgFullFlick_=false; cgStamBase=0; }   /* CRAZY GOLF: hole-out bonus + stamina refresh last one possession */
    turnFlash=24; sfxTurn();
    try{ _turnBanner={t:0,dur:42,team:current,cpu:!!(aiEnabled&&aiEnabled[current])}; }catch(_tb){}
    try{ ecoSpawnTokens(); }catch(e){} try{ if(_matchTurns>=1){ _matchTurns++;
    try{stopAnthem();}catch(e){} } }catch(e){} if(window.__nsTurn) window.__nsTurn(current);
    stickyUsed=false; flickCount=0;
    bikeUsed=false; clearUsed={red:false,blue:false};
    try{syncSlots();}catch(e){} } hitOwn=false;
    struck=false; applyTactics();
    updateHUD(); }
    function makeIconEl(id, px){ var d=document.createElement('div');
    d.style.cssText="width:"+px+"px;height:"+px+"px;image-rendering:pixelated;display:flex;align-items:center;justify-content:center;";
    var t=(typeof TACTIC_MAP!=='undefined')?TACTIC_MAP[id]:null;
    if(typeof ICON_IMG!=='undefined'&&ICON_IMG[id]&&ICON_IMG[id].ok&&typeof ICON_SRC!=='undefined'&&ICON_SRC[id]){ d.style.backgroundImage="url("+ICON_SRC[id]+")";
    d.style.backgroundSize="contain";
    d.style.backgroundRepeat="no-repeat";
    d.style.backgroundPosition="center";
    } else if(t){ d.textContent=t.icon;
    d.style.fontSize=Math.round(px*0.72)+"px";
    } return d; } function flyTo(elm, fromX, fromY, toEl, opts, cb){ opts=opts||{};
    var dur=opts.dur||620, hold=(opts.hold!=null?opts.hold:360), endScale=(opts.endScale!=null?opts.endScale:0.42);
    var vw=window.innerWidth, vh=window.innerHeight;
    var tr=toEl?toEl.getBoundingClientRect():null;
    var toX=tr?(tr.left+tr.width/2):vw/2, toY=tr?(tr.top+tr.height/2):vh/2;
    elm.style.position='fixed';
    elm.style.left='0'; elm.style.top='0';
    elm.style.zIndex='92'; elm.style.pointerEvents='none';
    elm.style.transform="translate("+fromX+"px,"+fromY+"px) translate(-50%,-50%) scale(1)";
    elm.style.transition="transform "+dur+"ms cubic-bezier(.45,0,.25,1), opacity .2s";
    elm.style.opacity='0'; document.body.appendChild(elm);
    requestAnimationFrame(function(){ elm.style.opacity='1';
    }); setTimeout(function(){ elm.style.transform="translate("+toX+"px,"+toY+"px) translate(-50%,-50%) scale("+endScale+")";
    }, hold); setTimeout(function(){ elm.style.opacity='0';
    }, hold+dur-140); setTimeout(function(){ if(elm.parentNode) elm.parentNode.removeChild(elm);
    if(toEl){ try{ var _op=toEl.style.transform||'';
    toEl.style.transition='transform .14s';
    toEl.style.transform=_op+' scale(1.25)';
    setTimeout(function(){ toEl.style.transform=_op;
    }, 150); }catch(e){} } if(cb) cb();
    }, hold+dur+30); } function boostForDeficit(d){ return d>=2 ? Math.min(1, 0.6+0.2*(d-2)) : 0;
    } function showLastChance(side, cb){ cb=cb||function(){};
    try{ paused=true; }catch(e){} try{ if(typeof sfxWhistle==='function') sfxWhistle();
    }catch(e){} try{ if(typeof haptic==='function') haptic([0,
    40,50,80]); }catch(e){} var _hs=(mode==='exhibition'||mode==='practice')&&typeof aiEnabled!=='undefined'&&aiEnabled&&!aiEnabled.red&&!aiEnabled.blue;
    var ov=document.createElement('div');
    ov.style.cssText='position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;pointer-events:none;background:rgba(6,4,12,0.5);opacity:0;transition:opacity .25s;';
    var card=document.createElement('div');
    card.style.cssText='display:flex;flex-direction:column;align-items:center;gap:9px;padding:18px 22px;border-radius:14px;background:linear-gradient(#1a1330,#0e0a18);border:2px solid #a9c94b;box-shadow:0 8px 26px rgba(0,0,0,0.6);transform:translateY(16px) scale(0.9);opacity:0;transition:transform .38s cubic-bezier(.2,1.3,.4,1),opacity .3s;';
    var emo=document.createElement('div');
    emo.style.cssText='width:48px;height:48px;background:url(assets/generated/icon-lastchance.png) center/contain no-repeat;image-rendering:pixelated;';
    var big=document.createElement('div');
    big.textContent='LAST CHANCE!';
    big.style.cssText="font-family:'Press Start 2P',monospace;font-size:15px;color:#a9c94b;text-align:center;text-shadow:0 2px 0 #12210a;";
    var sub=document.createElement('div');
    sub.textContent=(teamKits[side]?teamKits[side].name.toUpperCase()+' ':'')+'get 3 flicks to tie it and force penalties!';
    sub.style.cssText="font-family:'Press Start 2P',monospace;font-size:7px;line-height:1.7;color:#f4e9c8;text-align:center;max-width:230px;";
    card.appendChild(emo); card.appendChild(big);
    card.appendChild(sub); var okb=document.createElement('button');
    okb.textContent='GOT IT';
    okb.style.cssText="margin-top:4px;pointer-events:auto;font-family:'Press Start 2P',monospace;font-size:9px;color:#0b1a0e;background:#a9c94b;border:2px solid #e6ff7a;border-radius:8px;padding:9px 22px;cursor:pointer;";
    card.appendChild(okb); ov.appendChild(card);
    document.body.appendChild(ov);
    requestAnimationFrame(function(){ ov.style.opacity='1';
    card.style.opacity='1'; card.style.transform='translateY(0) scale(1)';
    }); var vw=window.innerWidth, vh=window.innerHeight;
    var _done=false; okb.onclick=function(){ if(_done) return;
    _done=true; ov.style.opacity='0';
    try{ updateComebackHUD();
    }catch(e){} var bar=el(side==='blue'?'ns_top':'ns_bot');
    var pill=bar?bar.querySelector('.ns_lktag'):null;
    var fly=document.createElement('div');
    fly.style.cssText='width:42px;height:42px;background:url(assets/generated/icon-lastchance.png) center/contain no-repeat;image-rendering:pixelated;';
    try{ flyTo(fly, vw/2, vh/2, pill||bar, {hold:40,dur:640,endScale:0.34}, function(){ try{ paused=false;
    }catch(e){} cb(); }); }catch(e){ try{ paused=false;
    }catch(e){} cb(); } setTimeout(function(){ if(ov.parentNode) ov.parentNode.removeChild(ov);
    }, 340); }; } function showComeback(side, cb){ try{ paused=true;
    }catch(e){} try{ if(typeof sfxWhistle==='function') sfxWhistle();
    }catch(e){} try{ if(typeof haptic==='function') haptic([0,
    30,40,60]); }catch(e){} var _hs=(mode==='exhibition'||mode==='practice')&&typeof aiEnabled!=='undefined'&&aiEnabled&&!aiEnabled.red&&!aiEnabled.blue;
    var ov=document.createElement('div');
    ov.style.cssText="position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;pointer-events:none;background:rgba(6,4,12,0.5);opacity:0;transition:opacity .25s;";
    var card=document.createElement('div');
    card.style.cssText="display:flex;flex-direction:column;align-items:center;gap:9px;padding:18px 22px;border-radius:14px;background:linear-gradient(#1a1330,#0e0a18);border:2px solid #a9c94b;box-shadow:0 8px 26px rgba(0,0,0,0.6);transform:translateY(16px) scale(0.9);opacity:0;transition:transform .38s cubic-bezier(.2,1.3,.4,1),opacity .3s;";
    var emo=document.createElement('div');
    emo.style.cssText="width:46px;height:46px;background:url(assets/generated/icon-flex.png) center/contain no-repeat;image-rendering:pixelated;";
    var big=document.createElement('div');
    big.textContent='COMEBACK BOOST!';
    big.style.cssText="font-family:'Press Start 2P',monospace;font-size:15px;color:#f2c14e;text-align:center;text-shadow:0 2px 0 #7c5714;";
    var sub=document.createElement('div');
    sub.textContent=(teamKits[side]?teamKits[side].name.toUpperCase()+' ':'')+'is behind — a FREE random ability incoming, with boosted odds of a rare one!';
    sub.style.cssText="font-family:'Press Start 2P',monospace;font-size:7px;line-height:1.7;color:#f4e9c8;text-align:center;max-width:230px;";
    card.appendChild(emo); card.appendChild(big);
    card.appendChild(sub); var okb=document.createElement('button');
    okb.textContent='GOT IT';
    okb.style.cssText="margin-top:4px;pointer-events:auto;font-family:'Press Start 2P',monospace;font-size:9px;color:#3a1400;background:#ffd23c;border:2px solid #ffe27a;border-radius:8px;padding:9px 22px;cursor:pointer;";
    card.appendChild(okb); ov.appendChild(card);
    document.body.appendChild(ov);
    requestAnimationFrame(function(){ ov.style.opacity='1';
    card.style.opacity='1'; card.style.transform='translateY(0) scale(1)';
    }); var vw=window.innerWidth, vh=window.innerHeight;
    var _done=false; okb.onclick=function(){ if(_done) return;
    _done=true; ov.style.opacity='0';
    var bar=el(side==='blue'?'ns_top':'ns_bot');
    var pill=bar?bar.querySelector('.ns_cbtag'):null;
    var fly=document.createElement('div');
    fly.style.cssText="width:44px;height:44px;background:url(assets/generated/icon-flex.png) center/contain no-repeat;image-rendering:pixelated;";
    try{ flyTo(fly, vw/2, vh/2, pill||bar, {hold:40,dur:660,endScale:0.34}, function(){ if(cb) cb();
    }); }catch(e){ if(cb) cb();
    } setTimeout(function(){ if(ov.parentNode) ov.parentNode.removeChild(ov);
    }, 340); }; } function grantComeback(side, boost, onDone){ onDone=onDone||function(){};
    try{ sfxComeback(); }catch(e){} var arr=(sideAb&&sideAb[side])||[];
    if(arr.length<3){ grantRandomAbility(side,onDone,boost);
    return; } if(!(typeof aiEnabled!=='undefined'&&aiEnabled&&aiEnabled[side])){ offerReplaceAbility(side,onDone,boost);
    return; } var pool=abPool(side, arr);
    if(!pool.length){ onDone();
    return; } var pick=weightedPick(pool, boost);
    var wi=0,ww=-1; for(var i=0;i<arr.length;i++){ var w=abWeight(arr[i]);
    if(w>ww){ ww=w; wi=i; } } paused=true;
    var slot=el('ns_slot_'+side+'_'+wi);
    spinSlot(slot, pick, function(){ arr[wi]=pick.id;
    sideAb[side]=arr; try{applyTactics();
    }catch(e){} try{syncSpecialNails();
    }catch(e){} try{resolveSwap();
    }catch(e){} try{updateScoreboards();
    }catch(e){} try{syncSlots();
    }catch(e){} try{ var _fi=makeIconEl(pick.id,50);
    flyTo(_fi, window.innerWidth/2, window.innerHeight/2, slot, {hold:120,dur:620,endScale:0.42}, function(){ paused=false;
    onDone(); }); }catch(e){ paused=false;
    onDone(); } }); } function showMatchEnd(winSide){ try{ if(document.getElementById('ns_matchend')) return;
    var st=el('ns_stage')||document.body;
    var ov=mk('div','position:absolute;left:0;right:0;top:70%;z-index:75;display:flex;gap:10px;justify-content:center;pointer-events:auto;');
    ov.id='ns_matchend'; var again=mk('button',SQBTN+'font-size:9px;padding:11px 15px;border:2px solid #f0d089;border-radius:8px;background:linear-gradient(#f2c14e,#d79a2c);color:#0b1a0e;box-shadow:0 3px 0 #7c5714;','REMATCH');
    again.onclick=function(){ if(ov.parentNode) ov.parentNode.removeChild(ov);
    winner=null; _lkActive=false;
    _lkStarted=false; _lkToPen=false;
    try{ newMatch(); }catch(e){} try{ showVsIntro();
    }catch(e){} }; var home=mk('button',SQBTN+'font-size:9px;padding:11px 15px;border:2px solid #f0d089;border-radius:8px;background:linear-gradient(#f2c14e,#d79a2c);color:#0b1a0e;box-shadow:0 3px 0 #7c5714;','HOME');
    home.onclick=function(){ if(ov.parentNode) ov.parentNode.removeChild(ov);
    winner=null; pen=null; _lkActive=false;
    _lkStarted=false; _lkToPen=false;
    mode='exhibition'; try{ buildPre();
    }catch(e){} }; ov.appendChild(again);
    ov.appendChild(home); st.appendChild(ov);
    }catch(e){} } function updateComebackHUD(){ try{ ['red',
    'blue'].forEach(function(sd){ var bar=el(sd==='blue'?'ns_top':'ns_bot');
    if(!bar) return; var opp=(sd==='red')?'blue':'red';
    var behind=(typeof score!=='undefined'&&score)?((score[opp]||0)-(score[sd]||0)):0;
    var on=((typeof winner==='undefined')||!winner)&&((typeof phase==='undefined')||phase==='play')&&behind>=2&&mode!=='penalty'&&mode!=='royale'&&(((sideAb&&sideAb[sd])||[]).length<3)&&!(mode==='tournament'&&typeof aiEnabled!=='undefined'&&aiEnabled&&aiEnabled[sd]);
    var _lkon=(typeof _lkActive!=='undefined')&&_lkActive&&(_lkTeam===sd)&&!winner;
    var lkt=bar.querySelector('.ns_lktag');
    if(_lkon){ if(!lkt){ lkt=document.createElement('div');
    lkt.className='ns_lktag';
    lkt.style.cssText="position:absolute;top:-8px;left:50%;transform:translateX(-50%);background:linear-gradient(#a9c94b,#7db51e);color:#0b1a0e;font-family:'Press Start 2P',monospace;font-size:6px;letter-spacing:1px;padding:2px 6px;border-radius:7px;box-shadow:0 1px 3px rgba(0,0,0,0.6);white-space:nowrap;pointer-events:none;z-index:10;";
    var _lki=document.createElement('span');
    _lki.style.cssText='display:inline-block;width:10px;height:10px;vertical-align:-1px;margin-right:3px;background:url(assets/generated/icon-lastchance.png) center/contain no-repeat;image-rendering:pixelated;';
    lkt.appendChild(_lki); var _lc0=document.createElement('span');
    _lc0.className='ns_lkc';
    lkt.appendChild(_lc0); bar.appendChild(lkt);
    } var _lc=lkt.querySelector('.ns_lkc');
    if(_lc) _lc.textContent='LAST CHANCE '+_lkFlicks;
    lkt.style.display='block';
    } else if(lkt){ lkt.style.display='none';
    } var tag=bar.querySelector('.ns_cbtag');
    if(on){ if(!tag){ tag=document.createElement('div');
    tag.className='ns_cbtag';
    var _fl=document.createElement('span');
    _fl.style.cssText="display:inline-block;width:8px;height:8px;vertical-align:-1px;margin-right:2px;background:url(assets/generated/icon-flex.png) center/contain no-repeat;image-rendering:pixelated;";
    tag.appendChild(_fl); tag.appendChild(document.createTextNode('COMEBACK'));
    tag.style.cssText="position:absolute;top:-9px;left:50%;transform:translateX(-50%);background:linear-gradient(#f2c14e,#d79a2c);color:#0b1a0e;border:1px solid #f0d089;font-family:'Press Start 2P',monospace;font-size:5px;letter-spacing:0.5px;padding:1px 5px;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,0.6);white-space:nowrap;pointer-events:none;z-index:9;";
    bar.appendChild(tag); } tag.style.display='block';
    } else if(tag){ tag.style.display='none';
    } }); }catch(e){} } function trioReset(){ _trioN=0;
    _trioDone=false; _boomFwd=false;
    _boomUsed=false; chipUsed=false;
    _clrBlocked=false; drillUsed=false;
    aftUsed=false;
    /* AFTERSHOCK stun lifecycle: the stun lives exactly as long as its owner's turn. Every flick start
       checks the owner — the first flick that is not theirs (the turn switched hands) clears everything,
       so a stun can never reach into the opponent's turn or a later turn of the shocker's own. */
    try{ if(aftStun && current!==aftStun.by){ aftClearStun(); } }catch(e){}
    if(typeof coin!=='undefined'&&coin) coin.air=0;
    if(typeof nails!=='undefined'&&nails){ for(var _tri=0;_tri<nails.length;_tri++) nails[_tri]._trioHit=false;
    } try{ var _tb=document.querySelectorAll('.ns_triob');
    for(var _q=0;_q<_tb.length;_q++) _tb[_q].style.display='none';
    }catch(e){} try{ syncSlots();
    }catch(e){} }
    function abilitySlotPop(side,id,scale){ try{ var idx=(sideAb[side]||[]).indexOf(id);
    if(idx<0) return; var w=el('ns_slot_'+side+'_'+idx);
    if(!w) return; var t=w.querySelector('img')||w;
    t.style.transition='transform .16s cubic-bezier(.2,1.6,.4,1)';
    t.style.transform='scale('+(scale||1.5)+')';
    setTimeout(function(){ t.style.transform='scale(1)';
    }, 220); try{ castFx=14;
    castCol=(typeof abTier==='function'&&abTier(id))?abTier(id).col:'#e6ff7a';
    }catch(e2){} }catch(e){} }
    function trioBump(n, fire){ try{ var idx=(sideAb[current]||[]).indexOf('trio');
    if(idx<0) return; var w=el('ns_slot_'+current+'_'+idx);
    if(!w) return; w.style.position='relative';
    var bd=w.querySelector('.ns_triob');
    if(!bd){ bd=document.createElement('div');
    bd.className='ns_triob';
    bd.style.cssText='position:absolute;right:-3px;bottom:-3px;min-width:11px;height:11px;padding:0 1px;background:#a9c94b;color:#0b0910;font-family:\"Press Start 2P\",monospace;font-size:7px;line-height:11px;text-align:center;border-radius:3px;box-shadow:0 1px 2px rgba(0,0,0,0.7);pointer-events:none;box-sizing:border-box;';
    w.appendChild(bd); } bd.textContent=n;
    bd.style.display='block';
    abilitySlotPop(current,'trio',fire?1.6:1.28);
    }catch(e){} }
    function showVarOverlay(side, done){ done=done||function(){};
    try{ paused=true; }catch(e){} try{ abilitySlotPop(side,'varcheck',1.7);
    }catch(e){} var ov=document.createElement('div');
    ov.style.cssText='position:fixed;inset:0;z-index:82;display:flex;align-items:center;justify-content:center;pointer-events:none;background:rgba(6,4,12,0.6);opacity:0;transition:opacity .25s;';
    var card=document.createElement('div');
    card.style.cssText='display:flex;flex-direction:column;align-items:center;gap:8px;padding:20px 26px;border-radius:14px;background:linear-gradient(#2a1030,#140a18);border:2px solid #ff5a5a;box-shadow:0 8px 28px rgba(0,0,0,0.65);transform:scale(0.6);opacity:0;transition:transform .36s cubic-bezier(.2,1.5,.4,1),opacity .3s;';
    var emo=document.createElement('div');
    emo.textContent='📺'; emo.style.cssText='font-size:44px;line-height:1.1;';
    var big=document.createElement('div');
    big.textContent='NO GOAL!';
    big.style.cssText="font-family:'Press Start 2P',monospace;font-size:18px;color:#ff6a6a;text-align:center;text-shadow:0 3px 0 #300;";
    var sub=document.createElement('div');
    sub.textContent='VAR CHECK: OWN GOAL RULED OUT';
    sub.style.cssText="font-family:'Press Start 2P',monospace;font-size:7px;line-height:1.7;color:#f4d0d0;text-align:center;max-width:250px;";
    card.appendChild(emo); card.appendChild(big);
    card.appendChild(sub); ov.appendChild(card);
    document.body.appendChild(ov);
    requestAnimationFrame(function(){ ov.style.opacity='1';
    card.style.opacity='1'; card.style.transform='scale(1)';
    }); setTimeout(function(){ ov.style.opacity='0';
    card.style.transform='scale(0.9)';
    setTimeout(function(){ if(ov.parentNode) ov.parentNode.removeChild(ov);
    },300); try{ paused=false;
    lastT=performance.now();
    }catch(e){} done(); }, 1600);
    }
    function useRewind(sd){ if(rewindUsed[sd]){ setStatus('REWIND USED');
    try{sfxBlocked();}catch(e){} return;
    } if(sd!==current){ setStatus('WAIT FOR YOUR TURN');
    try{sfxBlocked();}catch(e){} return;
    } if(winner||moving||scoring||(pen&&pen.active)){ try{sfxBlocked();
    }catch(e){} return; } var s=_rwSnap;
    if(!s || s.team!==sd){ setStatus('NOTHING TO REWIND');
    try{sfxBlocked();}catch(e){} return;
    } var _rwCap=(debuffActive(sd,'injury')?2:FLICK_CAP);
    if(s.flickCount>=_rwCap-1){ setStatus('NO REWIND ON LAST FLICK');
    try{sfxBlocked();}catch(e){} return;
    } /* the final flick ends the turn — can't rewind at the hand-off */ rewindUsed[sd]=true;
    _rwSnap=null; paused=true;
    aiming=false; aimStart=null;
    aimNow=null; aiPending=false;
    try{ abilitySlotPop(sd,'rewind',1.6);
    }catch(e){} try{ if(!muted) sfxWhistle();
    }catch(e){} var fx=coin.x, fy=coin.y, t0=null;
    function step(ts){ if(t0==null) t0=ts;
    var p=Math.min(1,(ts-t0)/520), e=1-Math.pow(1-p,3);
    coin.x=fx+(s.x-fx)*e; coin.y=fy+(s.y-fy)*e;
    coin.vx=0; coin.vy=0; if(Math.floor(p*8)%2===0){ try{ spawnSparks(coin.x,coin.y,sd,3);
    }catch(e2){} } try{ draw(ts);
    }catch(e3){} if(p<1){ requestAnimationFrame(step);
    } else { coin.x=s.x; coin.y=s.y;
    coin.vx=0; coin.vy=0; current=sd;
    flickCount=s.flickCount;
    moving=false; scoring=false;
    struck=false; hitOwn=false;
    try{ applyTactics(); }catch(e4){} try{ if(window.__nsTurn) window.__nsTurn(sd);
    }catch(e5){} try{ syncSlots();
    }catch(e6){} try{ updateHUD();
    }catch(e7){} setStatus('REWIND!');
    paused=false; lastT=performance.now();
    } } requestAnimationFrame(step);
    }
    function varDeny(){ varUsed[current]=true;
    coin.vx=0; coin.vy=0; moving=false;
    scoring=false; scoringTeam=null;
    celebrated=false; try{ sfxWhistle();
    }catch(e){} try{ if(typeof haptic==='function') haptic([0,
    40,50,80]); }catch(e){} try{ syncSlots();
    }catch(e){} showVarOverlay(current, function(){ coin={x:W/2,y:H/2,vx:0,vy:0};
    netBulge=0; netHold=0; try{ updateHUD();
    }catch(e){} try{ endFlick();
    }catch(e){} }); }
    function finalizeGoal(scorer){ if(pen&&pen.active){ penResolve('goal'); return; }
      _rwSnap=null;
      try{ if(typeof bowlArena==='function'&&bowlArena()&&typeof bowlRerack==='function') bowlRerack(); }catch(e){}   // THE ALLEY: fresh rack each point
      score[scorer]++; try{ tutHook('goal',scorer);
      }catch(e){} try{ ecoOnGoal(scorer);
      }catch(e){} try{ if(scorer==='red' && mode!=='practice'){ var _ag=spAchGet();
      _ag.goals=(_ag.goals||0)+1;
      spAchSave(_ag); if(_ag.goals>=50) spAchUnlock('goals50');
      if(score.red>=3) spAchUnlock('hat');
      if(score.red>=5) spAchUnlock('rush');
      if(_achBounces>=3) spAchUnlock('trick');
      } if(score.blue-score.red>=2) _achWasDown=true;
      }catch(e){} try{ if(scorer==='blue' && current==='red' && mode!=='practice') spAchUnlock('owngoal');
      }catch(e){} if(score.red===score.blue){ comebackDone.red=false;
      comebackDone.blue=false;
      } updateHUD(); parkedTeam=scorer;
      if(scorer==='red'){ coin.x=clampGoalX(coin.x); coin.y=COIN_R+2; } else { coin.x=clampGoalX(coin.x); coin.y=H-COIN_R-2; }
      if(score[scorer]>=winTarget || (timeUp && score.red!==score.blue)){ var _lkOth=(scorer==='red'?'blue':'red');
      if(score[scorer]>=winTarget && _lkActive && score.red===score.blue){ _lkActive=false;
      _lkToPen=true; if(mode==='tournament'){ _lkFromTour=true;
      _lkTourSave={score:{red:score.red,blue:score.blue}, ab:((sideAb&&sideAb.red)||[]).slice()};
      } try{ if(mode==='exhibition') _markFirstDone();
      }catch(e){} timerRunning=false;
      try{ sfxWhistle(); }catch(e){} try{ stopAnthem();
      }catch(e){} setStatus('TIED! GOING TO PENALTIES');
      setTimeout(function(){ _lkToPen=false;
      try{ startPenalty(!!(aiEnabled&&aiEnabled.blue), aiLevel, 5);
      }catch(e){} },1300); return;
      } if(score[scorer]>=winTarget && !_lkActive && !_lkStarted && (mode==='exhibition'||mode==='tournament') && _lkOn && (score[scorer]-score[_lkOth])===1){ _lkActive=true;
      _lkStarted=true; _lkLeader=scorer;
      _lkTeam=_lkOth; _lkFlicks=3;
      } else { _lkActive=false;
      winner=scorer; try{ if(mode==='exhibition') _markFirstDone();
      }catch(e){} try{ if(scorer==='red'&&timeUp) spAchUnlock('golden');
      }catch(e){} try{ if(winner==='red'){ spAchUnlock('firstwin');
      if(score.red-score.blue>=5) spAchUnlock('demolition');
      if(score.blue===0) spAchUnlock('clean');
      if(_achWasDown && mode!=='royale') spAchUnlock('comeback');
      var _cz=0; try{ if(debuffActive('red','freeze'))_cz++;
      if(debuffActive('red','fog'))_cz++;
      if(debuffActive('red','drunk'))_cz++;
      }catch(e){} if(_cz>=2) spAchUnlock('cursed');
      } }catch(e){} timerRunning=false;
      sfxWhistle(); try{ stopAnthem();
      }catch(e){} try{ sfxCheer();
      }catch(e){} setStatus('');
      if(mode==='tournament') setTimeout(tourMatchEnd,1700);
      else if(mode==='royale') setTimeout(royaleMatchEnd,1700);
      else setTimeout(function(){ try{ showMatchEnd(scorer);
      }catch(e){} },1700); return;
      } }
      const conc=scorer==='red'?'blue':'red';
      var _gs=el('ns_status'); if(_gs) _gs.textContent='GOAL — '+teamKits[scorer].abbr+'!';
      setTimeout(function(){ var afterScorer=function(){ var cd=(score[scorer]||0)-(score[conc]||0);
      if(mode!=='practice' && mode!=='royale' && cd>=2 && !comebackDone[conc] && ((sideAb[conc]||[]).length<3) && !(mode==='tournament'&&typeof aiEnabled!=='undefined'&&aiEnabled&&aiEnabled[conc])){ comebackDone[conc]=true;
      showComeback(conc, function(){ grantComeback(conc, boostForDeficit(cd), function(){ kickoff(conc);
      }); }); } else if(_lkActive && _lkTeam===conc){ showLastChance(conc, function(){ kickoff(conc);
      }); } else { kickoff(conc);
      } }; if(mode==='practice' || mode==='royale' || (mode==='tournament' && aiEnabled[scorer])){ afterScorer();
      } else if((sideAb[scorer]&&sideAb[scorer].length>=3) && !aiEnabled[scorer] && (mode==='tournament'||(mode==='exhibition'&&_ecoOn))){ offerReplaceAbility(scorer, afterScorer);
      } else if(mode==='exhibition'||mode==='tournament'){ draftAbility(scorer, afterScorer);
      } else { grantRandomAbility(scorer, afterScorer);
      } },950);
    }
    function clampGoalX(x){ const gL=(W-GOAL_W)/2+COIN_R,gR=(W+GOAL_W)/2-COIN_R; return Math.max(gL,Math.min(gR,x)); }
    function onTimeUp(){ if(winner) return;
    if(score.red===score.blue){ sfxWhistle();
    setStatus('FULL TIME — GOLDEN GOAL!');
    try{sfxSuddenDeath();}catch(e){} } else { const w=score.red>score.blue?'red':'blue';
    winner=w; try{ if(mode==='exhibition') _markFirstDone();
    }catch(e){} try{ if(winner==='red'){ spAchUnlock('firstwin');
    if(score.red-score.blue>=5) spAchUnlock('demolition');
    if(score.blue===0) spAchUnlock('clean');
    if(_achWasDown && mode!=='royale') spAchUnlock('comeback');
    var _cz=0; try{ if(debuffActive('red','freeze'))_cz++;
    if(debuffActive('red','fog'))_cz++;
    if(debuffActive('red','drunk'))_cz++;
    }catch(e){} if(_cz>=2) spAchUnlock('cursed');
    } }catch(e){} timerRunning=false;
    sfxWhistle(); try{ stopAnthem();
    }catch(e){} try{ sfxCheer();
    }catch(e){} setStatus('');
    if(mode==='tournament') setTimeout(tourMatchEnd,1700);
    else if(mode==='royale') setTimeout(royaleMatchEnd,1700);
    } }

