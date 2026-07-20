    // ================= TEAM PRESETS (kits) =================
    // kit.type patterns painted on nail heads + flag swatches
    const PRESETS=[
      {cat:'country',name:'Brazil',abbr:'BRA',primary:'#ffd400',kit:{type:'brazil',colors:['#009c3b','#ffdf00','#2b2f8f']}},
      {cat:'country',name:'Argentina',abbr:'ARG',primary:'#74acdf',kit:{type:'argentina',colors:['#74acdf','#ffffff']}},
      {cat:'country',name:'France',abbr:'FRA',primary:'#0055a4',kit:{type:'tricolor-v',colors:['#0055a4','#ffffff','#ef4135']}},
      {cat:'country',name:'Spain',abbr:'ESP',primary:'#c60b1e',kit:{type:'spain',colors:['#c60b1e','#ffc400']}},
      {cat:'country',name:'Germany',abbr:'GER',primary:'#dd0000',kit:{type:'tricolor-h',colors:['#1a1a1a','#dd0000','#ffce00']}},
      {cat:'country',name:'England',abbr:'ENG',primary:'#cf142b',kit:{type:'cross',colors:['#ffffff','#cf142b']}},
      {cat:'country',name:'Portugal',abbr:'POR',primary:'#da291c',kit:{type:'portugal',colors:['#0a6b34','#da291c']}},
      {cat:'country',name:'Netherlands',abbr:'NED',primary:'#f36c21',kit:{type:'tricolor-h',colors:['#ae1c28','#ffffff','#21468b']}},
      {cat:'country',name:'Italy',abbr:'ITA',primary:'#0a8a45',kit:{type:'tricolor-v',colors:['#0a8a45','#ffffff','#ce2b37']}},
      {cat:'country',name:'Belgium',abbr:'BEL',primary:'#f9d616',kit:{type:'tricolor-v',colors:['#1a1a1a','#f9d616','#e30613']}},
      {cat:'country',name:'Croatia',abbr:'CRO',primary:'#ff0000',kit:{type:'croatia',colors:['#ff0000','#ffffff','#171796']}},
      {cat:'country',name:'Japan',abbr:'JPN',primary:'#bc002d',kit:{type:'dot',colors:['#ffffff','#bc002d']}},
      {cat:'country',name:'USA',abbr:'USA',primary:'#3c3b6e',kit:{type:'usflag',colors:['#b22234','#3c3b6e','#ffffff']}},
      {cat:'country',name:'Mexico',abbr:'MEX',primary:'#0a6847',kit:{type:'mexico',colors:['#0a6847','#ffffff','#ce1126']}},
      {cat:'country',name:'Iceland',abbr:'ISL',primary:'#02529c',kit:{type:'nordic',colors:['#02529c','#ffffff','#dc1e35']}},
      {cat:'country',name:'Senegal',abbr:'SEN',primary:'#1a9c4b',kit:{type:'senegal',colors:['#1a9c4b','#fcd116','#e31b23']}},
      {cat:'club',name:'Reds',abbr:'RED',primary:'#d64b3a',kit:{type:'solid',colors:['#d64b3a']}},
      {cat:'club',name:'Blues',abbr:'BLU',primary:'#3f74c7',kit:{type:'solid',colors:['#3f74c7']}},
      {cat:'club',name:'Stripes',abbr:'STR',primary:'#1a1a1a',kit:{type:'vstripes',colors:['#1a1a1a','#ffffff']}},
      {cat:'club',name:'Hoops',abbr:'HOP',primary:'#0a8f3c',kit:{type:'hbands',colors:['#0a8f3c','#ffffff']}},
      {cat:'club',name:'Sash',abbr:'SAS',primary:'#d1122c',kit:{type:'sash',colors:['#ffffff','#d1122c']}},
      {cat:'club',name:'Royals',abbr:'ROY',primary:'#5b2a86',kit:{type:'vhalves',colors:['#5b2a86','#f2c200']}},
      {cat:'club',name:'Sky',abbr:'SKY',primary:'#5aa0d8',kit:{type:'hbands',colors:['#5aa0d8','#ffffff']}},
      {cat:'club',name:'Ravens',abbr:'RAV',primary:'#111111',kit:{type:'sash',colors:['#111111','#e8b84a']}}
    ]
    var KIT_ALT={BRA:[{type:'hbands',colors:['#ffdf00','#009c3b']},{type:'sash',colors:['#2b2f8f','#ffdf00']}], ARG:[{type:'vstripes',colors:['#74acdf','#ffffff']},{type:'sash',colors:['#111827','#ffffff']}], FRA:[{type:'hbands',colors:['#0055a4','#ffffff']},{type:'sash',colors:['#ef4135','#ffffff']}], ESP:[{type:'vstripes',colors:['#c60b1e','#ffc400']},{type:'sash',colors:['#14205a','#ffc400']}], GER:[{type:'hhalves',colors:['#1a1a1a','#dd0000']},{type:'sash',colors:['#ffce00','#1a1a1a']}], ENG:[{type:'vstripes',colors:['#cf142b','#ffffff']},{type:'sash',colors:['#1b3a6b','#ffffff']}], POR:[{type:'hbands',colors:['#da291c','#0a6b34']},{type:'sash',colors:['#046a38','#da291c']}], NED:[{type:'vstripes',colors:['#f36c21','#ffffff']},{type:'sash',colors:['#21468b','#f36c21']}], ITA:[{type:'hbands',colors:['#0a8a45','#ffffff']},{type:'sash',colors:['#1f3d7a','#ffffff']}], BEL:[{type:'hhalves',colors:['#f9d616','#e30613']},{type:'sash',colors:['#e30613','#1a1a1a']}], CRO:[{type:'checker',colors:['#ff0000','#ffffff']},{type:'sash',colors:['#171796','#ffffff']}], JPN:[{type:'vstripes',colors:['#bc002d','#ffffff']},{type:'sash',colors:['#0b2c66','#ffffff']}], USA:[{type:'hbands',colors:['#b22234','#ffffff']},{type:'vstripes',colors:['#3c3b6e','#ffffff']}], MEX:[{type:'hhalves',colors:['#0a6847','#ce1126']},{type:'sash',colors:['#ce1126','#ffffff']}], ISL:[{type:'hbands',colors:['#02529c','#ffffff']},{type:'sash',colors:['#dc1e35','#ffffff']}], SEN:[{type:'vstripes',colors:['#fcd116','#1a9c4b']},{type:'sash',colors:['#e31b23','#fcd116']}], RED:[{type:'hbands',colors:['#d64b3a','#ffffff']},{type:'sash',colors:['#2a2a2a','#d64b3a']}], BLU:[{type:'vstripes',colors:['#3f74c7','#ffffff']},{type:'sash',colors:['#e8952f','#12203a']}], STR:[{type:'hbands',colors:['#1a1a1a','#ffffff']},{type:'sash',colors:['#c8102e','#1a1a1a']}], HOP:[{type:'vstripes',colors:['#0a8f3c','#ffffff']},{type:'sash',colors:['#23408f','#ffffff']}], SAS:[{type:'vstripes',colors:['#d1122c','#ffffff']},{type:'hbands',colors:['#1a2f66','#ffffff']}], ROY:[{type:'quarters',colors:['#5b2a86','#f2c200']},{type:'sash',colors:['#f2c200','#5b2a86']}], SKY:[{type:'vstripes',colors:['#5aa0d8','#ffffff']},{type:'sash',colors:['#d94f2b','#173a5e']}], RAV:[{type:'hbands',colors:['#111111','#e8b84a']},{type:'vstripes',colors:['#e8b84a','#111111']}]};
    var KIT_EMBLEM={BRA:{sym:'ball',fg:'#009c3b'}, ARG:{sym:'sun',fg:'#f6b40e'}, FRA:{sym:'eagle',fg:'#0055a4'}, ESP:{sym:'crown',fg:'#c60b1e'}, GER:{sym:'shield',fg:'#1a1a1a'}, ENG:{sym:'shield',fg:'#cf142b'}, POR:{sym:'shield',fg:'#0a6b34'}, NED:{sym:'crown',fg:'#f36c21'}, ITA:{sym:'star',fg:'#0a8a45'}, BEL:{sym:'diamond',fg:'#e6b800'}, CRO:{sym:'checker',fg:'#c8102e'}, JPN:{sym:'disc',fg:'#bc002d'}, USA:{sym:'star',fg:'#3c3b6e'}, MEX:{sym:'eagle',fg:'#0a6847'}, ISL:{sym:'ring',fg:'#02529c'}, SEN:{sym:'star',fg:'#e31b23'}, RED:{sym:'ring',fg:'#d64b3a'}, BLU:{sym:'diamond',fg:'#3f74c7'}, STR:{sym:'bolt',fg:'#1a1a1a'}, HOP:{sym:'leaf',fg:'#0a8f3c'}, SAS:{sym:'cross',fg:'#d1122c'}, ROY:{sym:'crown',fg:'#5b2a86'}, SKY:{sym:'wave',fg:'#2f7bbf'}, RAV:{sym:'star6',fg:'#111111'}}; for(var _ka=0;_ka<PRESETS.length;_ka++){ var _kp=PRESETS[_ka]; if(KIT_ALT[_kp.abbr]) _kp.kit.alt=KIT_ALT[_kp.abbr]; if(KIT_EMBLEM[_kp.abbr] && _kp.kit.alt && _kp.kit.alt[1]) _kp.kit.alt[1].emblem=KIT_EMBLEM[_kp.abbr]; };
    const byName=n=>PRESETS.findIndex(p=>p.name===n);
    const COUNTRIES=PRESETS.filter(p=>p.cat==='country');
    const CLUBS=PRESETS.filter(p=>p.cat==='club');
    const catList=c=>c==='country'?COUNTRIES:CLUBS;
    let teamKits={ red:COUNTRIES[0], blue:COUNTRIES[1] };
    const primary=side=>teamKits[side].primary;

    // paint a rectangular region with a kit pattern
    function paintPattern(g,x,y,w,h,kit){
      const c=kit.colors, t=kit.type;
      g.fillStyle=c[0]; g.fillRect(x,y,w,h);
      if(t==='solid') return;
      if(t==='vhalves'){ g.fillStyle=c[1]; g.fillRect(x+Math.round(w/2),y,Math.ceil(w/2),h); }
      else if(t==='hhalves'){ g.fillStyle=c[1]; g.fillRect(x,y+Math.round(h/2),w,Math.ceil(h/2)); }
      else if(t==='vstripes'){ const n=4; for(let i=0;i<n;i++){ g.fillStyle=i%2?c[1]:c[0]; g.fillRect(x+Math.round(i*w/n),y,Math.ceil(w/n)+1,h);} }
      else if(t==='hbands'){ const n=4; for(let i=0;i<n;i++){ g.fillStyle=i%2?c[1]:c[0]; g.fillRect(x,y+Math.round(i*h/n),w,Math.ceil(h/n)+1);} }
      else if(t==='band'){ g.fillStyle=c[1]; g.fillRect(x,y+Math.round(h*0.36),w,Math.round(h*0.28)); }
      else if(t==='sash'){ g.save(); g.beginPath(); g.rect(x,y,w,h); g.clip(); g.strokeStyle=c[1]; g.lineWidth=Math.max(2,w*0.34); g.beginPath(); g.moveTo(x-2,y+h+2); g.lineTo(x+w+2,y-2); g.stroke(); g.restore(); }
      else if(t==='tricolor-v'){ for(let i=0;i<3;i++){ g.fillStyle=c[i]; g.fillRect(x+Math.round(i*w/3),y,Math.ceil(w/3)+1,h);} }
      else if(t==='tricolor-h'){ for(let i=0;i<3;i++){ g.fillStyle=c[i]; g.fillRect(x,y+Math.round(i*h/3),w,Math.ceil(h/3)+1);} }
      else if(t==='cross'){ g.fillStyle=c[1]; g.fillRect(x+Math.round(w*0.4),y,Math.max(2,Math.round(w*0.2)),h); g.fillRect(x,y+Math.round(h*0.4),w,Math.max(2,Math.round(h*0.2))); } else if(t==='nordic'){ var vx=x+Math.round(w*0.34), vw=Math.max(2,Math.round(w*0.20)), hy=y+Math.round(h*0.40), hh=Math.max(2,Math.round(h*0.20)); g.fillStyle=c[1]; g.fillRect(vx,y,vw,h); g.fillRect(x,hy,w,hh); var iw=Math.max(1,Math.round(vw*0.5)), ih=Math.max(1,Math.round(hh*0.5)); g.fillStyle=c[2]||c[1]; g.fillRect(vx+Math.round((vw-iw)/2),y,iw,h); g.fillRect(x,hy+Math.round((hh-ih)/2),w,ih); } else if(t==='senegal'){ for(var si=0;si<3;si++){ g.fillStyle=c[si]; g.fillRect(x+Math.round(si*w/3),y,Math.ceil(w/3)+1,h); } g.save(); g.translate(x+w/2,y+h/2); g.fillStyle=c[0]; var SR=Math.min(w,h)*0.17; g.beginPath(); for(var sp=0;sp<10;sp++){ var sa=-Math.PI/2+sp*Math.PI/5, sr=(sp%2?SR*0.42:SR); g.lineTo(Math.cos(sa)*sr,Math.sin(sa)*sr); } g.closePath(); g.fill(); g.restore(); }
      else if(t==='dot'){ g.fillStyle=c[1]; g.beginPath(); g.arc(x+w/2,y+h/2,Math.min(w,h)*0.28,0,Math.PI*2); g.fill(); }
      else if(t==='quarters'){ g.fillStyle=c[1]; g.fillRect(x+Math.round(w/2),y,Math.ceil(w/2),Math.round(h/2)); g.fillRect(x,y+Math.round(h/2),Math.round(w/2),Math.ceil(h/2)); }
      else if(t==='checker'){ const n=4; for(let ry=0;ry<n;ry++){ for(let rx=0;rx<n;rx++){ g.fillStyle=((rx+ry)%2)?c[1]:c[0]; g.fillRect(x+Math.round(rx*w/n),y+Math.round(ry*h/n),Math.ceil(w/n)+1,Math.ceil(h/n)+1); } } } else if(t==='usflag'){ g.fillStyle='#ffffff'; g.fillRect(x,y,w,h); const n=7; for(let i=0;i<n;i++){ if(i%2===0){ const y0=y+Math.round(i*h/n), y1=y+Math.round((i+1)*h/n); g.fillStyle='#b22234'; g.fillRect(x,y0,w,Math.max(1,y1-y0)); } } const cW=Math.round(w*0.44), cH=Math.round(h*0.54); g.fillStyle='#3c3b6e'; g.fillRect(x,y,cW,cH); g.fillStyle='#ffffff'; const sd=Math.max(1,Math.round(w*0.05)); for(let ry=0;ry<3;ry++){ const off=(ry%2)?0.5:0; for(let rx=0;rx<3;rx++){ const px=x+(rx+0.7+off)*(cW/3.6), py=y+(ry+0.85)*(cH/3.5); if(px<x+cW-1.5&&py<y+cH-1.5) g.fillRect(Math.round(px),Math.round(py),sd,sd); } } } else if(t==='brazil'){
        g.fillStyle='#009c3b'; g.fillRect(x,y,w,h);
        g.fillStyle='#ffdf00'; g.beginPath();
        g.moveTo(x+w/2,y+h*0.13); g.lineTo(x+w*0.87,y+h/2); g.lineTo(x+w/2,y+h*0.87); g.lineTo(x+w*0.13,y+h/2); g.closePath(); g.fill();
        g.fillStyle='#2b2f8f'; g.beginPath(); g.arc(x+w/2,y+h/2,Math.min(w,h)*0.17,0,Math.PI*2); g.fill();
        // little white stars on the globe
        g.fillStyle='#ffffff'; const R=Math.min(w,h)*0.17; const sd=Math.max(1,Math.round(w*0.02));
        g.fillRect(Math.round(x+w/2-R*0.4),Math.round(y+h/2-R*0.3),sd,sd);
        g.fillRect(Math.round(x+w/2+R*0.3),Math.round(y+h/2+R*0.1),sd,sd);
        g.fillRect(Math.round(x+w/2),Math.round(y+h/2+R*0.45),sd,sd);
      }
      else if(t==='argentina'){
        g.fillStyle='#74acdf'; g.fillRect(x,y,w,h);
        g.fillStyle='#ffffff'; g.fillRect(x,y+Math.round(h/3),w,Math.round(h/3)+1);
        // Sun of May: rays + disc
        const ex=x+w/2, ey=y+h/2, R=Math.max(1.3,Math.min(w,h)*0.12);
        g.strokeStyle='#f6b40e'; g.lineWidth=Math.max(1,R*0.5);
        const rays=8; for(let i=0;i<rays;i++){ const a=i/rays*Math.PI*2+0.2; g.beginPath(); g.moveTo(ex+Math.cos(a)*R*1.15,ey+Math.sin(a)*R*1.15); g.lineTo(ex+Math.cos(a)*R*1.95,ey+Math.sin(a)*R*1.95); g.stroke(); }
        g.fillStyle='#f6b40e'; g.beginPath(); g.arc(ex,ey,R,0,Math.PI*2); g.fill();
      }
      else if(t==='spain'){
        g.fillStyle=c[0]; g.fillRect(x,y,w,h);                                   // red
        g.fillStyle=c[1]; g.fillRect(x,y+Math.round(h*0.25),w,Math.round(h*0.5)); // yellow middle band
        // coat of arms, left of centre
        const ex=x+Math.round(w*0.31), ey=y+Math.round(h*0.5);
        const sw=Math.max(2,Math.round(w*0.14)), sh=Math.max(3,Math.round(h*0.3));
        g.fillStyle='#8a1420'; g.fillRect(Math.round(ex-sw/2),Math.round(ey-sh/2),sw,sh);      // shield
        g.fillStyle='#c8102e'; g.fillRect(Math.round(ex-sw/2)+1,Math.round(ey-sh/2)+1,Math.max(1,sw-2),Math.max(1,Math.round(sh*0.42)));
        g.fillStyle='#f2c200'; g.fillRect(Math.round(ex-sw/2),Math.round(ey-sh/2)-Math.max(1,Math.round(h*0.07)),sw,Math.max(1,Math.round(h*0.07))); // crown
      }
      else if(t==='portugal'){
        g.fillStyle=c[0]; g.fillRect(x,y,w,h);                                   // green
        g.fillStyle=c[1]; g.fillRect(x+Math.round(w*0.4),y,Math.ceil(w*0.6)+1,h); // red 60%
        // armillary sphere + shield on the division
        const ex=x+Math.round(w*0.4), ey=y+Math.round(h*0.5), R=Math.max(2,Math.min(w,h)*0.24);
        g.strokeStyle='#f2c200'; g.lineWidth=Math.max(1,R*0.26);
        g.beginPath(); g.arc(ex,ey,R,0,Math.PI*2); g.stroke();                    // gold sphere ring
        g.beginPath(); g.ellipse?g.ellipse(ex,ey,R,R*0.45,0,0,Math.PI*2):g.arc(ex,ey,R*0.7,0,Math.PI*2); g.stroke();
        g.fillStyle='#ffffff'; g.fillRect(Math.round(ex-R*0.34),Math.round(ey-R*0.5),Math.max(1,Math.round(R*0.68)),Math.max(2,Math.round(R))); // white shield
        g.fillStyle='#c8102e'; g.fillRect(Math.round(ex-R*0.18),Math.round(ey-R*0.3),Math.max(1,Math.round(R*0.36)),Math.max(1,Math.round(R*0.6)));
      }
      else if(t==='croatia'){
        for(let i=0;i<3;i++){ g.fillStyle=c[i]; g.fillRect(x,y+Math.round(i*h/3),w,Math.ceil(h/3)+1); }  // red/white/blue
        // checkerboard shield (šahovnica)
        const cw2=Math.max(4,Math.round(w*0.32)), ch2=Math.max(4,Math.round(h*0.42));
        const ex=Math.round(x+w/2-cw2/2), ey=Math.round(y+h/2-ch2/2), cells=4, cs=cw2/cells, rs=ch2/cells;
        for(let ry=0;ry<cells;ry++) for(let rx=0;rx<cells;rx++){ g.fillStyle=((rx+ry)%2)?'#c8102e':'#ffffff'; g.fillRect(Math.round(ex+rx*cs),Math.round(ey+ry*rs),Math.ceil(cs),Math.ceil(rs)); }
        g.strokeStyle='#ffffff'; g.lineWidth=1; g.strokeRect(ex+0.5,ey+0.5,cw2,ch2);
      }
      else if(t==='mexico'){
        for(let i=0;i<3;i++){ g.fillStyle=c[i]; g.fillRect(x+Math.round(i*w/3),y,Math.ceil(w/3)+1,h); }  // green/white/red
        // eagle-on-cactus emblem hint
        const ex=x+w/2, ey=y+h/2, s=Math.max(1.4,Math.min(w,h)*0.13);
        g.fillStyle='#0a6847'; g.fillRect(Math.round(ex-s*1.1),Math.round(ey+s*0.7),Math.round(s*2.2),Math.max(1,Math.round(s*0.6))); // wreath base
        g.fillStyle='#6b4a2b'; g.beginPath(); g.arc(ex,ey,s,0,Math.PI*2); g.fill();                       // eagle body
        g.fillStyle='#3a2a18'; g.fillRect(Math.round(ex+s*0.4),Math.round(ey-s*0.6),Math.max(1,Math.round(s*0.7)),Math.max(1,Math.round(s*0.5))); // wing
      }
    }
    const JERSEY={ brazil:{type:'band',colors:['#ffdf00','#009c3b']}, argentina:{type:'vstripes',colors:['#74acdf','#ffffff']}, spain:{type:'sash',colors:['#c60b1e','#f6b40e']}, portugal:{type:'band',colors:['#a5121a','#046a38']}, croatia:{type:'checker',colors:['#ff0000','#ffffff']}, dot:{type:'band',colors:['#0b2c66','#ffffff']}, usflag:{type:'hbands',colors:['#bf0a30','#ffffff']}, mexico:{type:'tricolor-v',colors:['#0a6847','#ffffff','#ce1126']} }; function kitPattern(kit){ var j=JERSEY[kit.type]; return j?{type:j.type,colors:j.colors}:kit; } function _starPath(g,cx,cy,n,ro,ri){ for(var i=0;i<n*2;i++){ var a=-Math.PI/2+i*Math.PI/n, rad=(i%2)?ri:ro; var x=cx+Math.cos(a)*rad,y=cy+Math.sin(a)*rad; if(i===0)g.moveTo(x,y); else g.lineTo(x,y);} g.closePath(); }
    function drawEmblem(g,cx,cy,r,em){ if(!em||r<3.2) return; var rr=Math.max(2.6,r*0.62); g.save(); g.beginPath(); g.arc(cx,cy,rr,0,Math.PI*2); g.fillStyle=em.bg||'rgba(247,242,229,0.96)'; g.fill(); g.lineWidth=Math.max(0.8,r*0.09); g.strokeStyle='rgba(0,0,0,0.5)'; g.stroke(); var s=rr*0.82, fg=em.fg; g.fillStyle=fg; g.strokeStyle=fg; var sym=em.sym; g.lineJoin='round'; if(sym==='star'){ g.beginPath(); _starPath(g,cx,cy,5,s,s*0.42); g.fill(); } else if(sym==='star6'){ g.beginPath(); _starPath(g,cx,cy,6,s,s*0.5); g.fill(); } else if(sym==='disc'){ g.beginPath(); g.arc(cx,cy,s*0.72,0,Math.PI*2); g.fill(); } else if(sym==='ring'){ g.beginPath(); g.arc(cx,cy,s*0.7,0,Math.PI*2); g.lineWidth=Math.max(1.4,r*0.17); g.stroke(); } else if(sym==='diamond'){ g.beginPath(); g.moveTo(cx,cy-s); g.lineTo(cx+s*0.78,cy); g.lineTo(cx,cy+s); g.lineTo(cx-s*0.78,cy); g.closePath(); g.fill(); } else if(sym==='cross'){ var t=s*0.32; g.fillRect(cx-t,cy-s*0.95,2*t,2*s*0.95); g.fillRect(cx-s*0.95,cy-t,2*s*0.95,2*t); } else if(sym==='sun'){ var i,a; g.lineWidth=Math.max(1.2,r*0.12); for(i=0;i<8;i++){ a=i*Math.PI/4; g.beginPath(); g.moveTo(cx+Math.cos(a)*s*0.52,cy+Math.sin(a)*s*0.52); g.lineTo(cx+Math.cos(a)*s,cy+Math.sin(a)*s); g.stroke(); } g.beginPath(); g.arc(cx,cy,s*0.48,0,Math.PI*2); g.fill(); } else if(sym==='ball'){ g.beginPath(); g.arc(cx,cy,s*0.8,0,Math.PI*2); g.fillStyle='#ffffff'; g.fill(); g.lineWidth=Math.max(0.7,r*0.06); g.strokeStyle=fg; g.stroke(); g.fillStyle=fg; g.beginPath(); _starPath(g,cx,cy,5,s*0.34,s*0.15); g.fill(); var k; for(k=0;k<5;k++){ var aa=-Math.PI/2+k*2*Math.PI/5; g.beginPath(); g.arc(cx+Math.cos(aa)*s*0.55,cy+Math.sin(aa)*s*0.55,s*0.12,0,Math.PI*2); g.fill(); } } else if(sym==='checker'){ var m=s*0.72, cs=m/2, ox=cx-m, oy=cy-m, gx,gy; for(gy=0;gy<4;gy++){ for(gx=0;gx<4;gx++){ g.fillStyle=((gx+gy)%2)?fg:'#ffffff'; g.fillRect(ox+gx*cs,oy+gy*cs,cs+0.5,cs+0.5); } } } else if(sym==='crown'){ var b=s*0.85; g.beginPath(); g.moveTo(cx-b,cy+s*0.5); g.lineTo(cx-b,cy-s*0.15); g.lineTo(cx-b*0.45,cy+s*0.15); g.lineTo(cx,cy-s*0.55); g.lineTo(cx+b*0.45,cy+s*0.15); g.lineTo(cx+b,cy-s*0.15); g.lineTo(cx+b,cy+s*0.5); g.closePath(); g.fill(); } else if(sym==='shield'){ var w=s*0.82; g.beginPath(); g.moveTo(cx-w,cy-s*0.8); g.lineTo(cx+w,cy-s*0.8); g.lineTo(cx+w,cy+s*0.1); g.quadraticCurveTo(cx+w,cy+s*0.7,cx,cy+s); g.quadraticCurveTo(cx-w,cy+s*0.7,cx-w,cy+s*0.1); g.closePath(); g.fill(); } else if(sym==='eagle'){ g.beginPath(); g.moveTo(cx,cy-s*0.55); g.quadraticCurveTo(cx+s*0.5,cy-s,cx+s,cy-s*0.15); g.quadraticCurveTo(cx+s*0.45,cy-s*0.1,cx+s*0.28,cy+s*0.15); g.lineTo(cx+s*0.18,cy+s*0.75); g.lineTo(cx,cy+s*0.5); g.lineTo(cx-s*0.18,cy+s*0.75); g.lineTo(cx-s*0.28,cy+s*0.15); g.quadraticCurveTo(cx-s*0.45,cy-s*0.1,cx-s,cy-s*0.15); g.quadraticCurveTo(cx-s*0.5,cy-s,cx,cy-s*0.55); g.closePath(); g.fill(); } else if(sym==='bolt'){ g.beginPath(); g.moveTo(cx+s*0.2,cy-s); g.lineTo(cx-s*0.45,cy+s*0.15); g.lineTo(cx-s*0.02,cy+s*0.15); g.lineTo(cx-s*0.2,cy+s); g.lineTo(cx+s*0.5,cy-s*0.2); g.lineTo(cx+s*0.05,cy-s*0.2); g.closePath(); g.fill(); } else if(sym==='leaf'){ g.beginPath(); g.moveTo(cx,cy-s); g.quadraticCurveTo(cx+s*0.9,cy-s*0.2,cx+s*0.35,cy+s*0.1); g.quadraticCurveTo(cx+s*0.7,cy+s*0.5,cx,cy+s); g.quadraticCurveTo(cx-s*0.7,cy+s*0.5,cx-s*0.35,cy+s*0.1); g.quadraticCurveTo(cx-s*0.9,cy-s*0.2,cx,cy-s); g.closePath(); g.fill(); } else if(sym==='wave'){ g.lineWidth=Math.max(1.2,r*0.13); var wy; for(wy=-1;wy<=1;wy++){ g.beginPath(); g.moveTo(cx-s*0.85,cy+wy*s*0.45); g.quadraticCurveTo(cx-s*0.4,cy+wy*s*0.45-s*0.3,cx,cy+wy*s*0.45); g.quadraticCurveTo(cx+s*0.4,cy+wy*s*0.45+s*0.3,cx+s*0.85,cy+wy*s*0.45); g.stroke(); } } else { g.beginPath(); g.arc(cx,cy,s*0.6,0,Math.PI*2); g.fill(); } g.restore(); }
    function paintNail(g,cx,cy,r,kit,active,resolved){
      cx=Math.round(cx); cy=Math.round(cy);   // snap to pixel grid so every disc rasterizes identically
      g.save();
      g.fillStyle='rgba(0,0,0,0.35)'; g.beginPath(); g.arc(cx+1,cy+1.5,r,0,Math.PI*2); g.fill();
      g.beginPath(); g.arc(cx,cy,r,0,Math.PI*2); g.clip();
      paintPattern(g,cx-r,cy-r,r*2,r*2,resolved||kitPattern(kit));
      // SNES sprite shading (clipped to the disc): dark lens lower-right, light lens upper-left
      var _P2=Math.PI*2;
      g.fillStyle='rgba(6,3,14,0.32)'; g.beginPath(); g.arc(cx+r*0.55,cy+r*0.72,r*1.15,0,_P2); g.fill();
      g.fillStyle='rgba(255,252,235,0.32)'; g.beginPath(); g.arc(cx-r*0.5,cy-r*0.62,r*0.82,0,_P2); g.fill();
      g.restore();
      g.beginPath(); g.arc(cx,cy,r,0,Math.PI*2); g.lineWidth=1; g.strokeStyle='rgba(0,0,0,0.55)'; g.stroke();
      // bright top-inner rim + specular dab
      g.strokeStyle='rgba(255,252,235,0.5)'; g.lineWidth=1; g.beginPath(); g.arc(cx,cy,Math.max(1,r-1),Math.PI*1.05,Math.PI*1.72); g.stroke();
      g.fillStyle='rgba(255,255,250,0.85)'; g.beginPath(); g.arc(cx-r*0.38,cy-r*0.42,Math.max(0.8,r*0.18),0,Math.PI*2); g.fill();
      var _rez=resolved||kitPattern(kit); if(_rez&&_rez.emblem) drawEmblem(g,cx,cy,r,_rez.emblem);
      if(active){ g.beginPath(); g.arc(cx,cy,r+2,0,Math.PI*2); g.strokeStyle='rgba(255,255,255,0.6)'; g.lineWidth=1; g.stroke(); }
    }
    // A menu badge that keeps the real FLAG design (drawn raw — no jersey swap,
    // no emblem overlay) but wears the coin token's glossy polish: soft drop
    // shadow, dark lens lower-right, light lens upper-left, bright top rim and a
    // specular dab. hl draws the gold "up next" ring. Used by the bracket & royale.
    function flagCoin(g,cx,cy,r,kit,hl){
      cx=Math.round(cx); cy=Math.round(cy);
      g.save();
      g.fillStyle='rgba(0,0,0,0.30)'; g.beginPath(); g.arc(cx+1,cy+1.5,r,0,Math.PI*2); g.fill();
      g.beginPath(); g.arc(cx,cy,r,0,Math.PI*2); g.clip();
      paintPattern(g,cx-r,cy-r,r*2,r*2,kit);
      var _P2=Math.PI*2;
      g.fillStyle='rgba(6,3,14,0.28)'; g.beginPath(); g.arc(cx+r*0.55,cy+r*0.72,r*1.15,0,_P2); g.fill();
      g.fillStyle='rgba(255,252,235,0.28)'; g.beginPath(); g.arc(cx-r*0.5,cy-r*0.62,r*0.82,0,_P2); g.fill();
      g.restore();
      g.strokeStyle='rgba(255,252,235,0.5)'; g.lineWidth=1; g.beginPath(); g.arc(cx,cy,Math.max(1,r-1),Math.PI*1.05,Math.PI*1.72); g.stroke();
      g.fillStyle='rgba(255,255,250,0.8)'; g.beginPath(); g.arc(cx-r*0.38,cy-r*0.42,Math.max(0.8,r*0.16),0,Math.PI*2); g.fill();
      g.beginPath(); g.arc(cx,cy,r+(hl?1.5:0),0,Math.PI*2); g.lineWidth=hl?2.6:1.2; g.strokeStyle=hl?'#ffd84a':'rgba(0,0,0,0.6)'; g.stroke();
    }
    function resolveKit(baseKit,style){ if(style==='flag') return baseKit; if(baseKit&&baseKit.alt){ if(style==='jersey') return baseKit.alt[0]; if(style==='away') return baseKit.alt[1]; } if(style==='away'){ var c=(baseKit&&baseKit.colors)?baseKit.colors.slice():['#dddddd']; if(c.length<2) c=[c[0]||'#dddddd','#f4f4f4']; return {type:'vstripes',colors:[c[0],c[1]]}; } return kitPattern(baseKit); } function domBucket(kit){ var col=(kit&&kit.colors&&kit.colors[0])||'#888888'; var h=col.replace('#',''); if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2]; var r=parseInt(h.slice(0,2),16)/255,g=parseInt(h.slice(2,4),16)/255,b=parseInt(h.slice(4,6),16)/255; var mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn,l=(mx+mn)/2; if(d<0.12) return l>0.6?'white':(l<0.28?'black':'gray'); var hue; if(mx===r)hue=((g-b)/d)%6; else if(mx===g)hue=(b-r)/d+2; else hue=(r-g)/d+4; hue*=60; if(hue<0)hue+=360; if(hue<20||hue>=345)return 'red'; if(hue<45)return 'orange'; if(hue<70)return 'yellow'; if(hue<160)return 'green'; if(hue<200)return 'cyan'; if(hue<255)return 'blue'; if(hue<290)return 'purple'; return 'red'; }
    function effStyle(side){ var st=(typeof kitStyle!=='undefined'&&kitStyle[side])?kitStyle[side]:'jersey'; if(side!=='blue'||!teamKits.red||!teamKits.blue) return st; if(st==='away') return st; var _autoK=((typeof mode!=='undefined')&&mode==='tournament')||((typeof aiEnabled!=='undefined')&&aiEnabled&&aiEnabled.blue); if(!_autoK) return st; var rSt=((typeof kitStyle!=='undefined')&&kitStyle.red)?kitStyle.red:'jersey'; var rb=domBucket(resolveKit(teamKits.red.kit,rSt)); if(domBucket(resolveKit(teamKits.blue.kit,st))!==rb) return st; var order=(st==='jersey')?['flag','jersey']:['jersey','flag']; for(var i=0;i<order.length;i++){ if(domBucket(resolveKit(teamKits.blue.kit,order[i]))!==rb) return order[i]; } return (st==='jersey')?'flag':'jersey'; } function formationFor(cname,asTeam){ var pi=byName(cname); if(pi<0) return []; var _tk=teamKits[asTeam]; var _hadAi=(typeof aiEnabled!=='undefined')&&aiEnabled; var _ai=_hadAi?aiEnabled[asTeam]:undefined; var _m=mode; try{ teamKits[asTeam]=PRESETS[pi]; if(typeof aiEnabled==='undefined'||!aiEnabled) aiEnabled={red:false,blue:false}; aiEnabled[asTeam]=(asTeam==='blue'); mode='tournament'; return formation(asTeam).map(function(n){return {x:n.x,y:n.y,goalie:!!n.goalie};}); } finally { teamKits[asTeam]=_tk; if(_hadAi) aiEnabled[asTeam]=_ai; mode=_m; } } function renderCountryField(g,cname,kit,style,asTeam,pitchKey){ var prevKey=boardKey; try{ var key=pitchKey||(typeof COUNTRY_PITCH!=='undefined'&&COUNTRY_PITCH[cname])||'grass'; if(!BOARDS[key]) key='grass'; boardKey=key; buildBoard(); g.imageSmoothingEnabled=false; g.clearRect(0,0,W,H); g.drawImage(boardCanvas,0,0); g.strokeStyle=board.line; g.lineWidth=1.8; g.beginPath(); g.moveTo(WALL,Math.round(H/2)+0.5); g.lineTo(W-WALL,Math.round(H/2)+0.5); g.stroke(); g.beginPath(); g.arc(W/2,H/2,22,0,Math.PI*2); g.stroke(); g.fillStyle=board.line; g.fillRect(Math.round(W/2)-1,Math.round(H/2)-1,3,3); try{ drawEndMarks(g,'red',1.8); drawEndMarks(g,'blue',1.8); }catch(e){} var pts=formationFor(cname,asTeam||'blue'); var rk=resolveKit(kit,style||'jersey'); for(var i=0;i<pts.length;i++){ var px=pts[i].x, py=pts[i].y; if((asTeam||'blue')==='blue') py=H-py; try{ paintNail(g,px,py,NAIL_R,kit,false,rk); }catch(e){} } g.beginPath(); g.arc(W/2,H/2,COIN_R,0,Math.PI*2); g.fillStyle='#fbfbf6'; g.fill(); g.lineWidth=1; g.strokeStyle='#a9a99f'; g.stroke(); } finally { boardKey=prevKey; try{ buildBoard(); }catch(e){} } } function renderClashField(g){ g.imageSmoothingEnabled=false; g.clearRect(0,0,W,H); g.drawImage(boardCanvas,0,0); g.strokeStyle=board.line; g.lineWidth=1.8; g.beginPath(); g.moveTo(WALL,Math.round(H/2)+0.5); g.lineTo(W-WALL,Math.round(H/2)+0.5); g.stroke(); g.beginPath(); g.arc(W/2,H/2,22,0,Math.PI*2); g.stroke(); g.fillStyle=board.line; g.fillRect(Math.round(W/2)-1,Math.round(H/2)-1,3,3); try{ drawEndMarks(g,'red',1.8); drawEndMarks(g,'blue',1.8); }catch(e){} ['blue','red'].forEach(function(t){ if(!teamKits[t]) return; var kit=teamKits[t].kit, rk=resolveKit(kit,effStyle(t)); try{ formation(t).forEach(function(n){ paintNail(g,n.x,n.y,(n.goalie&&((sideAb[t]||[]).indexOf('bigkeeper')>=0))?NAIL_R+3:NAIL_R,kit,false,rk); }); }catch(e){} }); g.beginPath(); g.arc(W/2,H/2,COIN_R,0,Math.PI*2); g.fillStyle='#fbfbf6'; g.fill(); g.lineWidth=1; g.strokeStyle='#a9a99f'; g.stroke(); }

