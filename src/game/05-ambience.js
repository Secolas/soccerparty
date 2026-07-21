    // ================= AMBIENCE (per-pitch scenery: beach umbrellas, snow, drones...) =================
    let ambient=[];
    // when the ball slams a pitch wall, nearby wildlife bolts. Physics reports the impact here
    // (in canvas coords); each hit lives a few frames and startles only critters close to it.
    var _wallHits=[];
    function nsWallHit(px,py){ try{ _wallHits.push({x:OX+px,y:OY+py,life:12}); if(_wallHits.length>10) _wallHits.shift(); }catch(e){} }
    function _fleeFrom(a,R){ var best=null,bd=1e9; for(var i=0;i<_wallHits.length;i++){ var wh=_wallHits[i]; if(wh.life<=0) continue; var d=Math.hypot(a.x-wh.x,a.y-wh.y); if(d<R&&d<bd){ bd=d; best=wh; } } if(best){ var dx=a.x-best.x,dy=a.y-best.y,dd=Math.hypot(dx,dy)||1; a.spook=Math.min(1,Math.max(a.spook||0,1-bd/R)); a.sx=dx/dd; a.sy=dy/dd; } a.spook=(a.spook||0)*0.93; return a.spook; }
    function buildAmbient(){
      ambient=[];
      const t=ambType();
      if(t==='stadium'||t==='arena'){ var _NC=window._FAN_NAT||{}; var _lt=(_NC[teamKits['blue']&&teamKits['blue'].name])||(teamKits['blue']&&teamKits['blue'].primary)||'#3b6fe0'; var _rt=(_NC[teamKits['red']&&teamKits['red'].name])||(teamKits['red']&&teamKits['red'].primary)||'#e0432b'; var _kl=(teamKits['blue']&&teamKits['blue'].kit&&teamKits['blue'].kit.colors)||[_lt]; var _kr=(teamKits['red']&&teamKits['red'].kit&&teamKits['red'].kit.colors)||[_rt]; var _pl=(window._FAN_PAL&&window._FAN_PAL[teamKits['blue']&&teamKits['blue'].name])||[_lt]; var _pr=(window._FAN_PAL&&window._FAN_PAL[teamKits['red']&&teamKits['red'].name])||[_rt]; var _rows=Math.max(7,Math.floor((H-16)/20)); for(var _sd=0;_sd<2;_sd++){ for(var _r=0;_r<_rows;_r++){ var _lft=(_sd===0); var _e=NS_FANS[Math.floor(Math.random()*NS_FANS.length)]; var _fp=(_lft?_pl:_pr); var _cc=_fp[Math.floor(Math.random()*_fp.length)]; var _cnm=_lft?(teamKits['blue']&&teamKits['blue'].name):(teamKits['red']&&teamKits['red'].name); var _tn=(_e&&_e.pose==='flag')?(window._flagTintFor?window._flagTintFor(_cnm,_cc):_cc):{c:_cc,hairTop:(_e&&(_e.pose==='standing'||_e.pose==='seated'))?15:0}; var _bx=(_lft?6:(OX+W+6))+(Math.random()-0.5)*1.5; var _by=OY+9+(_r+0.5)*((H-18)/_rows)+(Math.random()-0.5)*2.5; ambient.push({kind:'fan', img:(_e&&_e.img), x:_bx, y:_by, phase:Math.floor(Math.random()*9), spd:0.004+Math.random()*0.005, tint:_tn, flip:((_e&&_e.pose==='flag')?(_sd===0):(_sd===1))}); } } } if(t==='beach'){
        for(let i=0;i<5;i++) ambient.push({kind:'bird', x:Math.random()*CW, y:3+Math.random()*(OY-14), vx:0.18+Math.random()*0.22, phase:Math.random()*6.28});
        ambient.push({kind:'ship', x:Math.random()*CW, y:7, vx:0.06});
        ambient.push({kind:'ship', x:Math.random()*CW, y:CH-9, vx:-0.05, small:true});
      } else if(t==='winter'){
        for(let i=0;i<88;i++) ambient.push({kind:'snow', x:Math.random()*CW, y:Math.random()*CH, vy:0.12+Math.random()*0.28, drift:Math.random()*6.28, sz:Math.random()<0.3?2:1});
        // skaters gliding around the rink border
        const rinkSpots=[[0,OY*0.5,1],[0,CH-OY*0.5,1],[OX*0.5,0,0],[CW-OX*0.5,0,0]];
        for(let i=0;i<7;i++){ const horiz=Math.random()<0.6; ambient.push({kind:'skater', horiz, x:Math.random()*CW, y: horiz ? (Math.random()<0.5? OY*0.55 : CH-OY*0.55) : (OY+Math.random()*H), band: horiz?null:(Math.random()<0.5?'L':'R'), vx:(Math.random()<0.5?-1:1)*(0.22+Math.random()*0.26), phase:Math.random()*6.28, col:['#d94a5a','#4a7fd9','#e0a83a','#4cae74','#c86ad0'][i%5] }); }
      } else if(t==='cyber'){
        for(let i=0;i<3;i++) ambient.push({kind:'drone', x:Math.random()*CW, y:4+Math.random()*(OY-11), vx:(Math.random()<0.5?-1:1)*(0.14+Math.random()*0.18), phase:Math.random()*6.28});
        for(let i=0;i<4;i++) ambient.push({kind:'beam', x:Math.random()*CW, hue:['#2ff3ff','#ff5adc','#b06aff','#5aff9e'][i%4], sp:0.6+Math.random()*0.8, phase:Math.random()*6.28});
      } else if(t==='urban'){
        // cars driving along top & bottom roads
        const cols=['#d94a3a','#e0c33a','#4a7fd9','#e8e2d4','#4cae74','#c86ad0','#3a3d40'];
        for(let i=0;i<5;i++){ const top=Math.random()<0.5; ambient.push({kind:'car', top, x:Math.random()*CW, dir: top?1:-1, vx:0.3+Math.random()*0.4, col:cols[i%cols.length]}); }
      } else if(t==='desk'){
        // birds + hopping animals in the nature border
        for(let i=0;i<3;i++) ambient.push({kind:'bird', x:Math.random()*CW, y:3+Math.random()*(OY-16), vx:0.14+Math.random()*0.18, phase:Math.random()*6.28});
        ambient.push({kind:'rabbit', x:OX+20, y:OY*0.55, vx:0.14, hopP:0});
        ambient.push({kind:'rabbit', x:CW-40, y:CH-OY*0.5, vx:-0.12, hopP:2.1});
        ambient.push({kind:'deer', x:CW*0.5, y:CH-OY*0.42});
      } else if(t==='lisbon'){ for(var i=0;i<3;i++) ambient.push({kind:'bird', x:Math.random()*CW, y:3+Math.random()*(OY-14), vx:0.12+Math.random()*0.16, phase:Math.random()*6.28}); ambient.push({kind:'tram', x:Math.random()*CW, dir:1, vx:0.22}); } else if(t==='fiesta'){ var fcol=['#e0433a','#f2c23a','#3aa050','#e0559a']; for(var i=0;i<4;i++) ambient.push({kind:'dancer', x:(i<2? OX*0.5 : CW-OX*0.5), y:OY+18+ (i%2)*30, phase:Math.random()*6.28, col:fcol[i%4]}); for(var j=0;j<3;j++) ambient.push({kind:'bird', x:Math.random()*CW, y:3+Math.random()*(OY-14), vx:0.14+Math.random()*0.16, phase:Math.random()*6.28}); } else if(t==='arena'){ for(var i=0;i<14;i++) ambient.push({kind:'flash', x:OX+Math.random()*W, y:(Math.random()<0.5? OY*0.5 : CH-OY*0.5), t0:Math.random()*6.28}); } else if(t==='coast'){ for(var i=0;i<4;i++) ambient.push({kind:'bird', x:Math.random()*CW, y:3+Math.random()*(OY-14), vx:0.12+Math.random()*0.18, phase:Math.random()*6.28}); ambient.push({kind:'ship', x:Math.random()*CW, y:7, vx:0.05}); ambient.push({kind:'ship', x:Math.random()*CW, y:CH-9, vx:-0.045, small:true}); } else if(t==='safari'){ for(var i=0;i<4;i++) ambient.push({kind:'bird', x:Math.random()*CW, y:3+Math.random()*(OY-14), vx:0.12+Math.random()*0.16, phase:Math.random()*6.28}); ambient.push({kind:'antelope', x:Math.random()*CW, y:OY*0.55, vx:0.16}); ambient.push({kind:'antelope', x:Math.random()*CW, y:CH-OY*0.5, vx:-0.14}); } else if(t==='aquarium'){
        // big silhouette fish drifting in the surrounding tank water (hidden behind the opaque pitch)
        var _aqs=['rgba(10,60,86,0.85)','rgba(14,74,100,0.8)','rgba(8,46,68,0.85)'];
        for(var i=0;i<9;i++) ambient.push({kind:'bgfish', x:Math.random()*CW, y:(Math.random()<0.5? 3+Math.random()*(OY-6) : OY+H+3+Math.random()*(CH-OY-H-6)), vx:(Math.random()<0.5?-1:1)*(0.06+Math.random()*0.14), sz:4+Math.random()*5|0, col:_aqs[i%3], phase:Math.random()*6.28});
        for(var i=0;i<4;i++) ambient.push({kind:'bgfish', x:(Math.random()<0.5? 3+Math.random()*(OX-6) : OX+W+3+Math.random()*(CW-OX-W-6)), y:Math.random()*CH, vx:(Math.random()<0.5?-1:1)*(0.05+Math.random()*0.1), sz:4+Math.random()*4|0, col:_aqs[i%3], phase:Math.random()*6.28});
        for(var i=0;i<10;i++) ambient.push({kind:'tankbub', x:Math.random()*CW, y:Math.random()*CH, vy:0.1+Math.random()*0.22, sz:Math.random()<0.4?2:1, drift:Math.random()*6.28});
      }
      // a few birds share the sky on pitches that otherwise have none (reuses the beach bird)
      if(t==='stadium'||t==='arena'||t==='urban'){ for(var _bi=0;_bi<3;_bi++) ambient.push({kind:'bird', x:Math.random()*CW, y:3+Math.random()*(OY-14), vx:(Math.random()<0.5?-1:1)*(0.12+Math.random()*0.16), phase:Math.random()*6.28}); }
    }
    buildAmbient();

    // pixel-art scenery helpers
    function drawUmbrella(x,y,c1,c2){
      for(let r=0;r<4;r++){ const hw=2+r*2, yy=y+r; for(let dx=-hw;dx<hw;dx++){ ctx.fillStyle=((dx+hw)&2)?c2:c1; ctx.fillRect(x+dx,yy,1,1); } }
      ctx.fillStyle='rgba(70,52,34,0.95)'; ctx.fillRect(x,y+4,1,6);
      ctx.fillStyle=c1; ctx.fillRect(x,y-1,1,1);
    }
    function drawPalm(x,gy){
      ctx.fillStyle='#7a5230'; for(let i=0;i<8;i++) ctx.fillRect(x+Math.round(Math.sin(i*0.45)*1.4), gy-i, 1,1);
      const tx=x+Math.round(Math.sin(7*0.45)*1.4), ty=gy-7;
      ctx.fillStyle='#3fa04a';
      ctx.fillRect(tx-5,ty+1,3,1); ctx.fillRect(tx-3,ty,3,1); ctx.fillRect(tx+2,ty,3,1); ctx.fillRect(tx+3,ty+1,3,1);
      ctx.fillRect(tx-1,ty-2,1,2); ctx.fillRect(tx,ty-2,1,2); ctx.fillRect(tx-2,ty-1,4,1);
      ctx.fillStyle='#2e7d38'; ctx.fillRect(tx-4,ty+2,2,1); ctx.fillRect(tx+3,ty+2,2,1);
    }
    function drawSun(x,y){
      ctx.fillStyle='rgba(255,232,150,0.35)'; ctx.beginPath(); ctx.arc(x,y,6,0,6.283); ctx.fill();
      ctx.fillStyle='rgba(255,214,110,0.95)'; ctx.beginPath(); ctx.arc(x,y,3.2,0,6.283); ctx.fill();
    }
    function drawBird(x,y,phase,now){
      const f=Math.sin(now*0.02+phase)>0?0:1;
      ctx.fillStyle='rgba(238,240,246,0.92)';
      ctx.fillRect(x-2,y+f,1,1); ctx.fillRect(x-1,y-1+f,1,1); ctx.fillRect(x,y,1,1);
      ctx.fillRect(x+1,y-1+f,1,1); ctx.fillRect(x+2,y+f,1,1);
    }
    function drawDogWalker(x,y,now){
      ctx.fillStyle='#d8663f'; ctx.fillRect(x-1,y-4,2,3);
      ctx.fillStyle='#f0cba0'; ctx.fillRect(x-1,y-6,2,2);
      const s=Math.sin(now*0.02)>0?0:1;
      ctx.fillStyle='#2c2c34'; ctx.fillRect(x-1,y-1,1,2); ctx.fillRect(x,y-1+s,1,2);
      const dx=x+5;
      ctx.fillStyle='#8a5a3c'; ctx.fillRect(dx,y-2,3,2); ctx.fillRect(dx+3,y-3,1,2);
      ctx.fillStyle='#6f4630'; ctx.fillRect(dx-1,y-3,1,1);
      ctx.fillStyle='#8a5a3c'; ctx.fillRect(dx,y,1,1); ctx.fillRect(dx+2,y,1,1);
      ctx.strokeStyle='rgba(20,15,10,0.5)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(x+1,y-3); ctx.lineTo(dx,y-2); ctx.stroke();
    }
    function drawLamp(x,gy){
      ctx.fillStyle='#3a3d40'; ctx.fillRect(x,gy-11,1,11);
      ctx.fillRect(x,gy-11,4,1); ctx.fillStyle='#ffd86a'; ctx.fillRect(x+3,gy-11,2,2);
      ctx.fillStyle='rgba(255,216,106,0.18)'; ctx.beginPath(); ctx.arc(x+4,gy-9,5,0,6.283); ctx.fill();
    }
    function drawSnowman(x,gy){
      ctx.fillStyle='#eef4fa'; ctx.beginPath(); ctx.arc(x,gy-2,2.4,0,6.283); ctx.fill();
      ctx.beginPath(); ctx.arc(x,gy-5.5,1.7,0,6.283); ctx.fill();
      ctx.fillStyle='#d94a3a'; ctx.fillRect(x+1,gy-6,2,1);
      ctx.fillStyle='#1c1c22'; ctx.fillRect(x-1,gy-6,1,1); ctx.fillRect(x,gy-6,1,1);
    }
    function drawMug(x,gy){
      ctx.fillStyle='#e8e2d4'; ctx.fillRect(x-2,gy-4,4,4); ctx.fillRect(x+2,gy-3,1,2);
      ctx.fillStyle='#5a3a22'; ctx.fillRect(x-2,gy-4,4,1);
      ctx.fillStyle='rgba(230,225,215,0.35)'; ctx.fillRect(x-1,gy-7,1,2); ctx.fillRect(x,gy-8,1,2);
    }
    function drawDrone(x,y,phase,now){
      const b=Math.round(Math.sin(now*0.005+phase)*1.5);
      ctx.fillStyle='#1a1c30'; ctx.fillRect(x-2,y+b,4,2);
      ctx.fillStyle='#2ff3ff'; ctx.fillRect(x-3,y-1+b,1,1); ctx.fillRect(x+2,y-1+b,1,1);
      ctx.fillStyle='#ff5adc'; ctx.fillRect(x,y+1+b,1,1);
    }
    function drawShip(x,y,small){
      const s=small?1:1;
      ctx.fillStyle='#2c3542'; ctx.fillRect(x-4,y,9,2); ctx.fillRect(x-3,y+2,7,1);   // hull
      ctx.fillStyle='#e8e2d4'; ctx.fillRect(x-1,y-4,1,4);                              // mast
      ctx.fillStyle='#d9d3c4'; ctx.fillRect(x-4,y-3,3,3); ctx.fillRect(x+1,y-2,3,2);   // sails
      if(!small){ ctx.fillStyle='#c4bca8'; ctx.fillRect(x+4,y-1,1,1); }
    }
    function drawCar(x,y,dir,col){
      // body
      ctx.fillStyle=col; ctx.fillRect(x-4,y-2,9,3); ctx.fillRect(x-2,y-4,5,2);
      // windows
      ctx.fillStyle='rgba(180,220,240,0.85)'; ctx.fillRect(x-1,y-3,3,1);
      // wheels
      ctx.fillStyle='#161616'; ctx.fillRect(x-3,y+1,2,1); ctx.fillRect(x+2,y+1,2,1);
      // headlight glow in travel direction (on the road, behind the pitch)
      var hx=dir>0? x+5 : x-6, hy=y-1; ctx.save(); ctx.globalCompositeOperation='lighter'; var rgh=ctx.createRadialGradient(hx,hy,0,hx,hy,6); rgh.addColorStop(0,'rgba(255,238,170,0.85)'); rgh.addColorStop(1,'rgba(255,238,170,0)'); ctx.fillStyle=rgh; ctx.fillRect(hx-6,hy-4,12,8); ctx.restore(); ctx.fillStyle='#fff4c0'; ctx.fillRect(dir>0? x+4 : x-5, y-1, 1,1);
    }
    function drawSkater(x,y,phase,col,now){
      const glide=Math.sin(now*0.03+phase);
      ctx.fillStyle=col; ctx.fillRect(x-1,y-4,2,3);            // torso
      ctx.fillStyle='#f0cba0'; ctx.fillRect(x-1,y-6,2,2);      // head
      ctx.fillStyle='#2c2c34'; ctx.fillRect(x-1,y-1,1,2); ctx.fillRect(x,y-1,1,2); // legs
      ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fillRect(x-2,y+1,4,1);            // ice trail
      // arm swing
      ctx.fillStyle=col; ctx.fillRect(glide>0?x+1:x-2, y-3, 1,1);
    }
    function drawTree(x,gy){
      ctx.fillStyle='#5a3a22'; ctx.fillRect(x,gy-6,2,6);
      ctx.fillStyle='#2f7d3a'; ctx.beginPath(); ctx.arc(x+1,gy-8,4,0,6.283); ctx.fill();
      ctx.fillStyle='#3fa04a'; ctx.beginPath(); ctx.arc(x-1,gy-7,2.4,0,6.283); ctx.fill();
      ctx.beginPath(); ctx.arc(x+3,gy-9,2.4,0,6.283); ctx.fill();
    }
    function drawRabbit(x,y,hop){
      const up=hop?2:0;
      ctx.fillStyle='#d8d2c6'; ctx.fillRect(x,y-2-up,3,2);          // body
      ctx.fillStyle='#e8e4da'; ctx.fillRect(x+2,y-3-up,2,2);        // head
      ctx.fillStyle='#c9bfb0'; ctx.fillRect(x+3,y-5-up,1,2);        // ear
      ctx.fillStyle='#fff'; ctx.fillRect(x-1,y-2-up,1,1);           // tail
    }
    function drawDeer(x,gy){
      ctx.fillStyle='#a06a3c'; ctx.fillRect(x-3,gy-5,6,3);          // body
      ctx.fillStyle='#8a5730'; ctx.fillRect(x+2,gy-7,2,3);          // neck/head
      ctx.fillStyle='#6f4425'; ctx.fillRect(x+3,gy-9,1,2); ctx.fillRect(x+1,gy-9,1,2); // antlers
      ctx.fillStyle='#7a5030'; ctx.fillRect(x-2,gy-2,1,2); ctx.fillRect(x+1,gy-2,1,2); // legs
    }
    function drawDancer(x,y,phase,col,now){
      const sway=Math.round(Math.sin(now*0.02+phase)*1.4);
      const arm=Math.sin(now*0.02+phase)>0?1:0;
      ctx.fillStyle=col; ctx.fillRect(x-1+sway*0.3,y-4,2,3);       // torso
      ctx.fillStyle='#f0cba0'; ctx.fillRect(x-1+sway*0.3,y-6,2,2); // head
      ctx.fillStyle=col; ctx.fillRect(x+1+sway,y-6+arm*-1,1,2); ctx.fillRect(x-2-sway,y-5-arm,1,2); // arms up
      ctx.fillStyle='#2a2a30'; ctx.fillRect(x-1,y-1,1,2); ctx.fillRect(x,y-1,1,2);
    }
    function drawTram(x,y,dir){ ctx.fillStyle='#f2c23a'; ctx.fillRect(x-6,y-6,13,6); ctx.fillStyle='#e8e2d4'; ctx.fillRect(x-6,y-6,13,1); ctx.fillStyle='rgba(150,200,230,0.85)'; ctx.fillRect(x-5,y-5,3,2); ctx.fillRect(x-1,y-5,3,2); ctx.fillRect(x+3,y-5,2,2); ctx.fillStyle='#7a5a22'; ctx.fillRect(x-6,y,13,1); ctx.fillStyle='#161616'; ctx.fillRect(x-4,y,2,1); ctx.fillRect(x+3,y,2,1); ctx.fillStyle='#8a8f98'; ctx.fillRect(x,y-9,1,3); }
    function drawBunting(y,x0,x1,cols){ ctx.strokeStyle='rgba(40,30,20,0.5)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(x0,y); ctx.lineTo(x1,y+1); ctx.stroke(); var i=0; for(var x=x0;x<x1-4;x+=6){ ctx.fillStyle=cols[i%cols.length]; i++; for(var r=0;r<4;r++){ ctx.fillRect(x+r,y+1+r,Math.max(1,6-r*2),1); } } }
    function drawCactus(x,gy){ ctx.fillStyle='#3a7d3a'; ctx.fillRect(x,gy-9,2,9); ctx.fillRect(x-3,gy-6,2,1); ctx.fillRect(x-3,gy-8,1,3); ctx.fillRect(x+3,gy-7,2,1); ctx.fillRect(x+4,gy-9,1,3); ctx.fillStyle='#2e6e2e'; ctx.fillRect(x,gy-9,1,9); ctx.fillStyle='#e05aa0'; ctx.fillRect(x,gy-10,2,1); }
    function drawCypress(x,gy){ ctx.fillStyle='#5a3a22'; ctx.fillRect(x,gy-2,2,2); ctx.fillStyle='#25572e'; for(var i=0;i<12;i++){ var hw=Math.max(1,Math.round((1-i/12)*3)); ctx.fillRect(x+1-hw,gy-2-i,hw*2,1); } ctx.fillStyle='#317038'; ctx.fillRect(x,gy-13,1,10); }
    function drawAcacia(x,gy){ ctx.fillStyle='#6b4a2a'; ctx.fillRect(x,gy-7,2,7); ctx.fillRect(x-1,gy-9,1,2); ctx.fillRect(x+2,gy-9,1,2); ctx.fillStyle='#5a7d3a'; ctx.fillRect(x-5,gy-11,12,2); ctx.fillStyle='#6b923f'; ctx.fillRect(x-4,gy-12,10,1); }
    function drawGiraffe(x,gy){ ctx.fillStyle='#e0b050'; ctx.fillRect(x,gy-6,4,4); ctx.fillRect(x+3,gy-12,2,7); ctx.fillRect(x+3,gy-13,3,2); ctx.fillStyle='#8a5a28'; ctx.fillRect(x,gy-5,1,1); ctx.fillRect(x+2,gy-4,1,1); ctx.fillRect(x+4,gy-10,1,1); ctx.fillStyle='#c89040'; ctx.fillRect(x,gy-2,1,2); ctx.fillRect(x+3,gy-2,1,2); }
    function drawElephant(x,gy){ ctx.fillStyle='#9a9aa2'; ctx.fillRect(x,gy-5,7,4); ctx.fillRect(x-2,gy-4,3,3); ctx.fillStyle='#8a8a92'; ctx.fillRect(x-3,gy-2,1,2); ctx.fillRect(x-2,gy-1,1,1); ctx.fillRect(x+1,gy-1,1,2); ctx.fillRect(x+5,gy-1,1,2); ctx.fillRect(x-3,gy-6,2,2); }
    function drawAntelope(x,y,flip,now){ var s=Math.sin(now*0.03)>0?0:1; ctx.fillStyle='#c88a4a'; ctx.fillRect(x-2,y-3,5,2); ctx.fillRect(flip?x-3:x+2,y-4,2,2); ctx.fillStyle='#6b4020'; ctx.fillRect(flip?x-3:x+3,y-6,1,2); ctx.fillStyle='#a06a34'; ctx.fillRect(x-2,y-1,1,1+s); ctx.fillRect(x+1,y-1,1,2-s); }
    function _fanFrame(img,frame,tint,flip){ if(!img||!img.complete||!img.naturalWidth) return null; var fw=48, nf=Math.max(1,Math.floor(img.naturalWidth/fw)), f=((frame%nf)+nf)%nf; if(!window._fanCache) window._fanCache={}; var isFlag=(tint&&typeof tint==='object'&&!Array.isArray(tint)&&tint.flag); var isBody=(tint&&typeof tint==='object'&&!Array.isArray(tint)&&tint.c&&!tint.flag); var arr=(isFlag||isBody)?null:(Array.isArray(tint)?tint:(tint?[tint]:null)); var key=isFlag?((img.src||'')+'|'+f+'|F'+tint.dir+tint.flag.join(',')+'|'+(tint.shirt||'')+'|'+(flip?1:0)):(isBody?((img.src||'')+'|'+f+'|B'+tint.c+'|'+(tint.hairTop||0)):((img.src||'')+'|'+f+'|'+(arr?arr.join(','):''))); var cv=window._fanCache[key]; if(cv) return cv; cv=document.createElement('canvas'); cv.width=48; cv.height=48; var c=cv.getContext('2d'); c.imageSmoothingEnabled=false; c.drawImage(img,f*fw,0,fw,48,0,0,48,48); function _hx(h){ h=(''+h).replace('#',''); if(h.length===3) h=h.charAt(0)+h.charAt(0)+h.charAt(1)+h.charAt(1)+h.charAt(2)+h.charAt(2); return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; } if(isFlag){ try{ var id=c.getImageData(0,0,48,48), d=id.data; var fcols=tint.flag.map(_hx), scol=_hx(tint.shirt||tint.flag[0]), FY=20, n=fcols.length; var minx=48,maxx=0,miny=48,maxy=0,any=false; for(var i=0;i<d.length;i+=4){ if(d[i+3]<8) continue; var r=d[i],g=d[i+1],b=d[i+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b),sat=mx===0?0:(mx-mn)/mx,lum=(r+g+b)/3; if(sat<0.22&&lum>60&&lum<236){ var q=i/4, px=q%48, py=(q-px)/48; if(py<FY){ if(px<minx)minx=px; if(px>maxx)maxx=px; if(py<miny)miny=py; if(py>maxy)maxy=py; any=true; } } } var bw=Math.max(1,maxx-minx+1), bh=Math.max(1,maxy-miny+1); for(var j2=0;j2<d.length;j2+=4){ if(d[j2+3]<8) continue; var r2=d[j2],g2=d[j2+1],b2=d[j2+2],mx2=Math.max(r2,g2,b2),mn2=Math.min(r2,g2,b2),sat2=mx2===0?0:(mx2-mn2)/mx2,lum2=(r2+g2+b2)/3; if(!(sat2<0.22&&lum2>60&&lum2<236)) continue; var q2=j2/4, px2=q2%48, py2=(q2-px2)/48, col; if(py2<FY&&any){ var bi; if(tint.dir==='h'){ bi=Math.floor((py2-miny)/bh*n); } else { bi=Math.floor((px2-minx)/bw*n); if(flip) bi=n-1-bi; } if(bi<0)bi=0; if(bi>n-1)bi=n-1; col=fcols[bi]; } else { col=scol; } var k=Math.min(1.2,lum2/255+0.5); d[j2]=Math.min(255,Math.round(col[0]*k)); d[j2+1]=Math.min(255,Math.round(col[1]*k)); d[j2+2]=Math.min(255,Math.round(col[2]*k)); } c.putImageData(id,0,0); }catch(e){} } else if(isBody){ try{ var idb=c.getImageData(0,0,48,48), db=idb.data, bc=_hx(tint.c), ht=tint.hairTop||0; for(var ib=0;ib<db.length;ib+=4){ if(db[ib+3]<8) continue; var rb=db[ib],gb=db[ib+1],bb=db[ib+2],mxb=Math.max(rb,gb,bb),mnb=Math.min(rb,gb,bb),satb=mxb===0?0:(mxb-mnb)/mxb,lumb=(rb+gb+bb)/3; if(!(satb<0.22&&lumb>60&&lumb<236)) continue; var qb=ib/4, pxb=qb%48, pyb=(qb-pxb)/48; if(pyb<ht) continue; var kb=Math.min(1.25,lumb/255+0.42); db[ib]=Math.min(255,Math.round(bc[0]*kb)); db[ib+1]=Math.min(255,Math.round(bc[1]*kb)); db[ib+2]=Math.min(255,Math.round(bc[2]*kb)); } c.putImageData(idb,0,0); }catch(e){} } else if(arr){ try{ var cols=arr.map(_hx), n2=cols.length, sw=48/n2, id2=c.getImageData(0,0,48,48), dd=id2.data; for(var i3=0;i3<dd.length;i3+=4){ if(dd[i3+3]<8) continue; var r3=dd[i3],g3=dd[i3+1],b3=dd[i3+2], mx3=Math.max(r3,g3,b3), mn3=Math.min(r3,g3,b3), sat3=mx3===0?0:(mx3-mn3)/mx3, lum3=(r3+g3+b3)/3; if(sat3<0.22&&lum3>60&&lum3<236){ var px3=(i3/4)%48; var col2=cols[Math.min(n2-1,Math.floor(px3/sw))]; var k3=Math.min(1.25,lum3/255+0.42); dd[i3]=Math.min(255,Math.round(col2[0]*k3)); dd[i3+1]=Math.min(255,Math.round(col2[1]*k3)); dd[i3+2]=Math.min(255,Math.round(col2[2]*k3)); } } c.putImageData(id2,0,0); }catch(e){} } window._fanCache[key]=cv; return cv; } function _fanTint(img,x,y,sz,frame,tint,flip){ var cv=_fanFrame(img,frame,tint,flip); if(!cv) return; var dx=Math.round(x-sz/2), dy=Math.round(y-sz); if(flip){ ctx.save(); ctx.translate(dx+sz,dy); ctx.scale(-1,1); ctx.drawImage(cv,0,0,48,48,0,0,sz,sz); ctx.restore(); } else { ctx.drawImage(cv,0,0,48,48,dx,dy,sz,sz); } } function drawAmbient(now){
      const t=ambType();
      // age the wall-impact scares (the ball hitting a wall spooks only the wildlife right there)
      for(var _wi=0;_wi<_wallHits.length;_wi++) _wallHits[_wi].life--;
      while(_wallHits.length && _wallHits[0].life<=0) _wallHits.shift();
      // animated layer
      for(const a of ambient){
        if(a.kind==='bird'){ var _sp=_fleeFrom(a,66); a.x+=a.vx*(1+_sp*3)+(a.sx||0)*_sp*1.3; if(_sp>0.03){ a.y+=(a.sy||0)*_sp*1.1-_sp*0.5; if(a.y<2) a.y=2; } if(a.x>CW+3) a.x=-3; if(a.x<-3) a.x=CW+3; drawBird(Math.round(a.x),Math.round(a.y),a.phase,now); }
        else if(a.kind==='fan'){ _fanTint(a.img,a.x,a.y,17,Math.floor(now*a.spd+a.phase),a.tint,a.flip); }
        else if(a.kind==='snow'){ if(typeof royBlizzard==='function'&&royBlizzard()) continue; a.y+=a.vy; a.x+=Math.sin(now*0.003+a.drift)*0.2; if(a.y>CH+2){a.y=-2;a.x=Math.random()*CW;} ctx.fillStyle='rgba(240,248,255,0.9)'; ctx.fillRect(Math.round(a.x),Math.round(a.y),a.sz,a.sz); }
        else if(a.kind==='drone'){ a.x+=a.vx; if(a.x>CW+4)a.x=-4; if(a.x<-4)a.x=CW+4; drawDrone(Math.round(a.x),Math.round(a.y),a.phase,now); }
        else if(a.kind==='ship'){ a.x+=a.vx; if(a.x>CW+6)a.x=-6; if(a.x<-6)a.x=CW+6; drawShip(Math.round(a.x),a.y,a.small); }
        else if(a.kind==='car'){ a.x+=a.vx*a.dir; if(a.dir>0&&a.x>CW+6)a.x=-6; if(a.dir<0&&a.x<-6)a.x=CW+6; const y=a.top? OY*0.52 : CH-OY*0.5; drawCar(Math.round(a.x),Math.round(y),a.dir,a.col); }
        else if(a.kind==='skater'){ a.x+=a.vx; if(a.x>CW+4)a.x=-4; if(a.x<-4)a.x=CW+4; drawSkater(Math.round(a.x),Math.round(a.y),a.phase,a.col,now); }
        else if(a.kind==='rabbit'){ var _sp=_fleeFrom(a,60); a.hopP+=(_sp>0.05?0.24:0.08); const hop=Math.sin(a.hopP)>(_sp>0.05?0.1:0.6); if(hop) a.x+=a.vx*(1+_sp*3); a.x+=(a.sx||0)*_sp*1.2; if(a.x>CW-6)a.vx=-Math.abs(a.vx); if(a.x<6)a.vx=Math.abs(a.vx); drawRabbit(Math.round(a.x),Math.round(a.y),hop); }
        else if(a.kind==='beam'){ const bx=(a.x+Math.sin(now*0.001*a.sp+a.phase)*CW*0.4); ctx.save(); ctx.globalAlpha=0.14+0.06*Math.sin(now*0.004+a.phase); ctx.fillStyle=a.hue; ctx.beginPath(); ctx.moveTo(bx,0); ctx.lineTo(bx-14,CH); ctx.lineTo(bx+14,CH); ctx.closePath(); ctx.fill(); ctx.restore(); } else if(a.kind==='tram'){ a.x+=a.vx*a.dir; if(a.dir>0&&a.x>CW+8)a.x=-8; if(a.dir<0&&a.x<-8)a.x=CW+8; drawTram(Math.round(a.x), Math.round(OY*0.5), a.dir); } else if(a.kind==='dancer'){ drawDancer(Math.round(a.x),Math.round(a.y),a.phase,a.col,now); } else if(a.kind==='flash'){ if(Math.sin(now*0.02+a.t0)>0.95){ ctx.fillStyle='rgba(255,255,255,0.85)'; ctx.fillRect(Math.round(a.x),Math.round(a.y),1,1); } } else if(a.kind==='antelope'){ var _sp=_fleeFrom(a,66); a.x+=a.vx*(1+_sp*3)+(a.sx||0)*_sp*1.2; if(a.x>CW+4)a.x=-4; if(a.x<-4)a.x=CW+4; drawAntelope(Math.round(a.x),Math.round(a.y),a.vx<0,now); }
        else if(a.kind==='bgfish'){ a.x+=a.vx; a.y+=Math.sin(now*0.002+a.phase)*0.12; if(a.x>CW+a.sz*2)a.x=-a.sz*2; if(a.x<-a.sz*2)a.x=CW+a.sz*2; drawBgFish(Math.round(a.x),Math.round(a.y),a.sz,a.col,a.vx<0,a.phase,now); }
        else if(a.kind==='tankbub'){ a.y-=a.vy; a.x+=Math.sin(now*0.003+a.drift)*0.14; if(a.y<-2){a.y=CH+2;a.x=Math.random()*CW;} ctx.fillStyle='rgba(190,238,255,0.5)'; ctx.fillRect(Math.round(a.x),Math.round(a.y),a.sz,a.sz); }
      }
      // static scenery per pitch
      if(t==='beach'){
        drawSun(CW-7,6);
        drawPalm(6, OY-2); drawPalm(CW-6, CH-2);
        const uc=[['#e8544a','#f5f0e6'],['#3a8de0','#f5f0e6'],['#f5b83a','#f5f0e6'],['#3aa050','#f5f0e6'],['#e0559a','#f5f0e6']];
        for(let i=0;i<5;i++){ drawUmbrella(OX+14+i*36, 7, ...uc[i]); drawUmbrella(OX+30+i*36, OY+H+9, ...uc[(i+2)%5]); }
        const wx=OX+10+((now*0.028)%(W-20)); drawDogWalker(Math.round(wx), OY+H+CROWD_TB-5, now);
      } else if(t==='urban'){
        drawLamp(4, OY-3); drawLamp(CW-9, OY-3); drawLamp(4, CH-3); drawLamp(CW-9, CH-3);
      } else if(t==='winter'){
        drawSnowman(10, OY-2); drawSnowman(CW-10, CH-3);
      } else if(t==='desk'){
        drawTree(5, OY-3); drawTree(CW-9, OY-2); drawTree(4, CH-4); drawTree(CW-8, CH-3);
        drawDeer(CW*0.5, CH-OY*0.42+3);
      } else if(t==='lisbon'){ drawSun(CW-7,6); drawLamp(4,OY-3); drawLamp(CW-9,CH-3); var uc=[['#e8544a','#f5f0e6'],['#3a8de0','#f5f0e6'],['#f5b83a','#f5f0e6']]; for(var i=0;i<3;i++){ drawUmbrella(OX+22+i*40, OY+H+9, uc[i][0], uc[i][1]); } for(var k=0;k<3;k++){ drawMug(OX+34+k*40, OY+H+CROWD_TB-3); } var wx=OX+10+((now*0.026)%(W-20)); drawDogWalker(Math.round(wx), OY+H+CROWD_TB-5, now); } else if(t==='fiesta'){ drawSun(CW-7,6); drawBunting(3, OX, OX+W, ['#e0433a','#f2c23a','#3aa050','#3a8de0','#e0559a']); drawBunting(CH-6, OX, OX+W, ['#3a8de0','#e0559a','#f2c23a','#e0433a','#3aa050']); drawCactus(6, OY-1); drawCactus(CW-8, CH-2); } else if(t==='arena'){ drawBunting(3, OX, OX+W, ['#b22234','#f5f0e6','#3c3b6e']); drawBunting(CH-6, OX, OX+W, ['#3c3b6e','#f5f0e6','#b22234']); drawLamp(4,OY-3); drawLamp(CW-9,OY-3); } else if(t==='coast'){ drawSun(CW-7,6); drawCypress(6, OY-1); drawCypress(CW-8, OY-1); drawCypress(5, CH-2); drawCypress(CW-9, CH-2); } else if(t==='safari'){ drawSun(CW-7,6); drawAcacia(6,OY-1); drawAcacia(CW-7,CH-2); drawGiraffe(Math.round(CW*0.32),OY-1); drawElephant(Math.round(CW*0.6),OY-1); }
    }

