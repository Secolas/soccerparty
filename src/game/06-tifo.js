    // ================= TIFO (giant crowd banners behind each goal) =================
    const tifoCache={red:null,blue:null,redKey:'',blueKey:''};
    function buildTifo(side){
      const kit=teamKits[side].kit, abbr=teamKits[side].abbr;
      const w=GOAL_W-12, h=CROWD_TB-2;
      const cvs=document.createElement('canvas'); cvs.width=w; cvs.height=h;
      const g=cvs.getContext('2d'); g.imageSmoothingEnabled=false;
      paintPattern(g,0,0,w,h,kit);
      // seam shading so it reads as fabric
      g.fillStyle='rgba(0,0,0,0.12)'; for(let x=0;x<w;x+=4) g.fillRect(x,0,1,h);
      g.fillStyle='rgba(255,255,255,0.08)'; g.fillRect(0,0,w,1);
      // dark rim
      g.strokeStyle='rgba(0,0,0,0.7)'; g.lineWidth=2; g.strokeRect(1,1,w-2,h-2);
      tifoCache[side]=cvs; tifoCache[side+'Key']=abbr+kit.type+kit.colors.join('');
    }
    function drawTifo(side,cx,cy,now){
      const k=teamKits[side], key=k.abbr+k.kit.type+k.kit.colors.join('');
      if(tifoCache[side+'Key']!==key) buildTifo(side);
      const cvs=tifoCache[side]; if(!cvs) return;
      const w=cvs.width,h=cvs.height, x0=Math.round(cx-w/2), y0=Math.round(cy-h/2);
      const amp=banner>0?2.4:1.1;
      // hold the tifo aloft with a slow cloth ripple (per-column vertical shift)
      for(let sx=0;sx<w;sx++){
        const off=Math.sin(now*0.005 + sx*0.4)*amp;
        ctx.drawImage(cvs, sx,0,1,h, x0+sx, y0+off, 1, h);
      }
    }
    // A single NEUTRAL banner used on BOTH goal ends, so the two ends match
    // instead of showing each team's colours. Dark stadium cloth with a gold
    // accent band, tuned to sit with the PAL chrome.
    function buildTifoNeutral(){
      const w=GOAL_W-12, h=CROWD_TB-2;
      const cvs=document.createElement('canvas'); cvs.width=w; cvs.height=h;
      const g=cvs.getContext('2d'); g.imageSmoothingEnabled=false;
      const lg=g.createLinearGradient(0,0,0,h); lg.addColorStop(0,'#241a38'); lg.addColorStop(1,'#140f22'); g.fillStyle=lg; g.fillRect(0,0,w,h);
      // subtle alternating fabric stripes
      for(let x=0;x<w;x+=6){ g.fillStyle=(Math.floor(x/6)%2)?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.10)'; g.fillRect(x,0,3,h); }
      // gold accent band echoing the game's CTA/coin gold
      g.fillStyle='rgba(242,193,78,0.9)'; g.fillRect(0,Math.floor(h/2)-1,w,2);
      g.fillStyle='rgba(240,208,137,0.5)'; g.fillRect(0,Math.floor(h/2)-2,w,1);
      // seam shading + top sheen + dark rim (matches buildTifo)
      g.fillStyle='rgba(0,0,0,0.12)'; for(let x2=0;x2<w;x2+=4) g.fillRect(x2,0,1,h);
      g.fillStyle='rgba(255,255,255,0.08)'; g.fillRect(0,0,w,1);
      g.strokeStyle='rgba(0,0,0,0.7)'; g.lineWidth=2; g.strokeRect(1,1,w-2,h-2);
      tifoCache.neutral=cvs;
    }
    function drawTifoNeutral(cx,cy,now){
      if(!tifoCache.neutral) buildTifoNeutral();
      const cvs=tifoCache.neutral; if(!cvs) return;
      const w=cvs.width,h=cvs.height, x0=Math.round(cx-w/2), y0=Math.round(cy-h/2);
      const amp=banner>0?2.4:1.1;
      for(let sx=0;sx<w;sx++){
        const off=Math.sin(now*0.005 + sx*0.4)*amp;
        ctx.drawImage(cvs, sx,0,1,h, x0+sx, y0+off, 1, h);
      }
    }

