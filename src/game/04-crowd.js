    // ================= CROWD =================
    let crowd=[];
    const SKINS=['#e8b98f','#c98a5e','#8a5a3c','#f0cba0','#a06a44'];
    function vary(hex){ const c=hex.replace('#',''); const n=(Math.random()*0.5-0.18); let r=parseInt(c.substr(0,2),16),g=parseInt(c.substr(2,2),16),b=parseInt(c.substr(4,2),16); const cl=v=>Math.max(0,Math.min(255,Math.round(v*(1+n)))); return 'rgb('+cl(r)+','+cl(g)+','+cl(b)+')'; }
    const BEACH_SHIRTS=['#e86a4a','#4aa3e0','#f2c14e','#4cb469','#e0559a','#f0f0e6','#5ac8c8','#f08a3c'];
    function buildCrowd(){
      crowd=[];
      const t=ambType();
      const beachy=t==='beach';
      // only the grass stadium is packed; every other pitch has just a few onlookers
      const skip = (t==='stadium'||t==='arena') ? 0 : (beachy ? 0.62 : (t==='fiesta'||t==='lisbon') ? 0.5 : 0.76);
      function band(x0,y0,bw,bh,side,cols,rows){
        for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
          if(skip && Math.random()<skip) continue;
          const px=x0+(c+0.5)*(bw/cols)+(Math.random()-0.5)*2;
          const py=y0+(r+0.5)*(bh/rows)+(Math.random()-0.5)*1.5;
          const fanSide = side==='mix' ? (c%2?'red':'blue') : side;
          const kc=teamKits[fanSide].kit.colors;
          crowd.push({x:px,y:py,side:fanSide,shirt: beachy?BEACH_SHIRTS[Math.floor(Math.random()*BEACH_SHIRTS.length)]:vary(primary(fanSide)),skin:SKINS[(r*cols+c)%SKINS.length],phase:Math.random()*6.28,hop:0,hv:0,
            flag: (t==='stadium'||t==='arena')&&(Math.random()<0.32), flagCol: kc[Math.floor(Math.random()*Math.min(2,kc.length))]||primary(fanSide)});
        }
      }
      const nearRing = (t==='urban');   // pedestrians hug the sidewalk, off the road
      if(nearRing){
        // thin ring of onlookers right beside the pitch (sidewalk), clear of the car lanes
        band(OX-11, OY+8, 7, H-16, 'blue', 1, 16);
        band(OX+W+4, OY+8, 7, H-16, 'red', 1, 16);
      } else {
        // deep bands, inset so no one ever overlaps the pitch frame (gravity: feet stay on the surround)
                // top = blue fans
          // bottom = red fans
        band(3, OY+6, CROWD_LR-9, H-12, 'mix', 2, 15);         // left mixed
        band(OX+W+6, OY+6, CROWD_LR-9, H-12, 'mix', 2, 15);    // right mixed
      }
    }
    buildCrowd();

