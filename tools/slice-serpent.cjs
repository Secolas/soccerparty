const { PNG } = require('./node_modules/pngjs');
const fs=require('node:fs');
const SRC=__dirname + '/serpent-corner-source.png';
const OUT=__dirname + '/../assets/generated';
const src=PNG.sync.read(fs.readFileSync(SRC));
const {width:W,height:H,data}=src;
const COLS=3, ROWS=2, CW=Math.floor(W/COLS), CH=Math.floor(H/ROWS), SIZE=80;
function d2(r,g,b,r2,g2,b2){const a=r-r2,c=g-g2,d=b-b2;return a*a+c*c+d*d;}
let n=0;
for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
  // background = magenta (sample cell corners)
  const cx0=c*CW, cy0=r*CH;
  const corner=[[0,0],[CW-1,0],[0,CH-1],[CW-1,CH-1]].map(([x,y])=>{const i=((cy0+y)*W+(cx0+x))<<2;return [data[i],data[i+1],data[i+2]];});
  const bg=[0,1,2].map(k=>Math.round(corner.reduce((s,c)=>s+c[k],0)/4));
  const TOL2=110*110;
  // snake mask
  const mask=new Uint8Array(CW*CH);
  for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){ const i=((cy0+y)*W+(cx0+x))<<2; if(d2(data[i],data[i+1],data[i+2],bg[0],bg[1],bg[2])>TOL2) mask[y*CW+x]=1; }
  // largest connected component (4-conn)
  const lbl=new Int32Array(CW*CH).fill(0); let best=0,bestSize=0,cur=0;
  const st=[];
  for(let s=0;s<CW*CH;s++){ if(mask[s]&&!lbl[s]){ cur++; let size=0; st.push(s); lbl[s]=cur; while(st.length){ const p=st.pop(); size++; const px=p%CW, py=(p-px)/CW; const nb=[[1,0],[-1,0],[0,1],[0,-1]]; for(const[dx,dy]of nb){ const nx=px+dx,ny=py+dy; if(nx<0||ny<0||nx>=CW||ny>=CH)continue; const q=ny*CW+nx; if(mask[q]&&!lbl[q]){lbl[q]=cur;st.push(q);} } } if(size>bestSize){bestSize=size;best=cur;} } }
  // build cell with only largest comp, then erode 1px (defringe)
  const keep=new Uint8Array(CW*CH); for(let s=0;s<CW*CH;s++) keep[s]=(lbl[s]===best)?1:0;
  const er=keep.slice(); for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){ if(!keep[y*CW+x])continue; let edge=false; for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy; if(nx<0||ny<0||nx>=CW||ny>=CH||!keep[ny*CW+nx]){edge=true;break;}} if(edge)er[y*CW+x]=0; }
  // bbox
  let minx=CW,miny=CH,maxx=-1,maxy=-1; for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){ if(er[y*CW+x]){if(x<minx)minx=x;if(x>maxx)maxx=x;if(y<miny)miny=y;if(y>maxy)maxy=y;} }
  const bw=maxx-minx+1, bh=maxy-miny+1, pad=Math.round(SIZE*0.07), target=SIZE-pad*2, scale=target/Math.max(bw,bh);
  const dw=Math.max(1,Math.round(bw*scale)), dh=Math.max(1,Math.round(bh*scale)), offx=Math.floor((SIZE-dw)/2), offy=Math.floor((SIZE-dh)/2);
  const out=new PNG({width:SIZE,height:SIZE}); out.data.fill(0);
  for(let y=0;y<SIZE;y++){ if(y<offy||y>=offy+dh)continue; const sy=miny+Math.min(bh-1,Math.floor((y-offy)/scale));
    for(let x=0;x<SIZE;x++){ if(x<offx||x>=offx+dw)continue; const sx=minx+Math.min(bw-1,Math.floor((x-offx)/scale));
      if(!er[sy*CW+sx])continue; const si=((cy0+sy)*W+(cx0+sx))<<2, dp=(y*SIZE+x)<<2; out.data[dp]=data[si];out.data[dp+1]=data[si+1];out.data[dp+2]=data[si+2];out.data[dp+3]=255; } }
  n++; fs.writeFileSync(`${OUT}/serp-corner-${n}.png`, PNG.sync.write(out));
}
console.log('wrote',n);
