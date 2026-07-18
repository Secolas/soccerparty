const { PNG } = require('./node_modules/pngjs');
const fs = require('node:fs');
const SRC=__dirname + '/serpent-slither-source.png';
const OUT=__dirname + '/../assets/generated';
const src=PNG.sync.read(fs.readFileSync(SRC));
const {width:W,height:H,data}=src;
const COLS=10, ROWS=5, CW=Math.floor(W/COLS), CH=Math.floor(H/ROWS), SIZE=64;
const A=(x,y)=> data[((y*W+x)<<2)+3];
let frames=[];
for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
  const ox=c*CW, oy=r*CH;
  let minx=CW,miny=CH,maxx=-1,maxy=-1;
  for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){ if(A(ox+x,oy+y)>30){ if(x<minx)minx=x; if(x>maxx)maxx=x; if(y<miny)miny=y; if(y>maxy)maxy=y; } }
  if(maxx<0) continue;
  const bw=maxx-minx+1, bh=maxy-miny+1;
  const pad=Math.round(SIZE*0.08), target=SIZE-pad*2, scale=target/Math.max(bw,bh);
  const dw=Math.max(1,Math.round(bw*scale)), dh=Math.max(1,Math.round(bh*scale));
  const offx=Math.floor((SIZE-dw)/2), offy=Math.floor((SIZE-dh)/2);
  const out=new PNG({width:SIZE,height:SIZE}); out.data.fill(0);
  for(let y=0;y<SIZE;y++){ if(y<offy||y>=offy+dh) continue; const sy=miny+Math.min(bh-1,Math.floor((y-offy)/scale));
    for(let x=0;x<SIZE;x++){ if(x<offx||x>=offx+dw) continue; const sx=minx+Math.min(bw-1,Math.floor((x-offx)/scale));
      const sp=((oy+sy)*W+(ox+sx))<<2, dp=(y*SIZE+x)<<2;
      out.data[dp]=data[sp]; out.data[dp+1]=data[sp+1]; out.data[dp+2]=data[sp+2]; out.data[dp+3]=data[sp+3]; } }
  frames.push(PNG.sync.write(out));
}
console.log('non-empty frames:', frames.length);
frames.forEach((b,i)=> fs.writeFileSync(`${OUT}/serpslith-${i+1}.png`, b));
