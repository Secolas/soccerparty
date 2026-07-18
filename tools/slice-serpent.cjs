const { PNG } = require('./node_modules/pngjs');
const fs=require('node:fs');
const SRC=__dirname + '/serpent-corner-source.png';
const OUT=__dirname + '/../assets/generated';
const src=PNG.sync.read(fs.readFileSync(SRC));
const {width:W,height:H,data}=src;
const COLS=4, CW=Math.floor(W/COLS);
function d2(r,g,b,r2,g2,b2){const a=r-r2,c=g-g2,e=b-b2;return a*a+c*c+e*e;}
const TOL2=110*110;
// pass 1: per cell keyed mask (largest comp) + bbox
const cells=[];
for(let c=0;c<COLS;c++){
  const ox=c*CW;
  const corners=[[0,0],[CW-1,0],[0,H-1],[CW-1,H-1]].map(([x,y])=>{const i=((y)*W+(ox+x))<<2;return [data[i],data[i+1],data[i+2]];});
  const bg=[0,1,2].map(k=>Math.round(corners.reduce((s,q)=>s+q[k],0)/4));
  const mask=new Uint8Array(CW*H);
  for(let y=0;y<H;y++)for(let x=0;x<CW;x++){ const i=((y)*W+(ox+x))<<2; if(d2(data[i],data[i+1],data[i+2],bg[0],bg[1],bg[2])>TOL2) mask[y*CW+x]=1; }
  // largest comp
  const lbl=new Int32Array(CW*H); let best=0,bs=0,cur=0,st=[];
  for(let s=0;s<CW*H;s++){ if(mask[s]&&!lbl[s]){ cur++; let sz=0; st.push(s); lbl[s]=cur; while(st.length){ const p=st.pop(); sz++; const px=p%CW,py=(p-px)/CW; for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=px+dx,ny=py+dy; if(nx<0||ny<0||nx>=CW||ny>=H)continue; const q=ny*CW+nx; if(mask[q]&&!lbl[q]){lbl[q]=cur;st.push(q);}}} if(sz>bs){bs=sz;best=cur;} } }
  const keep=new Uint8Array(CW*H); for(let s=0;s<CW*H;s++) keep[s]=(lbl[s]===best)?1:0;
  // erode 1px
  const er=keep.slice(); for(let y=0;y<H;y++)for(let x=0;x<CW;x++){ if(!keep[y*CW+x])continue; let edge=false; for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy; if(nx<0||ny<0||nx>=CW||ny>=H||!keep[ny*CW+nx]){edge=true;break;}} if(edge)er[y*CW+x]=0; }
  let minx=CW,miny=H,maxx=-1,maxy=-1; for(let y=0;y<H;y++)for(let x=0;x<CW;x++){ if(er[y*CW+x]){if(x<minx)minx=x;if(x>maxx)maxx=x;if(y<miny)miny=y;if(y>maxy)maxy=y;} }
  // base center-x: center-x of bottom 18% rows of content
  let bxs=0,bxn=0; const bt=Math.floor(maxy-(maxy-miny)*0.18);
  for(let y=bt;y<=maxy;y++)for(let x=0;x<CW;x++){ if(er[y*CW+x]){bxs+=x;bxn++;} }
  const baseCx=bxn?bxs/bxn:(minx+maxx)/2;
  cells.push({ox,er,minx,miny,maxx,maxy,baseCx});
}
const maxH=Math.max(...cells.map(c=>c.maxy-c.miny+1));
const G=128/maxH;
// canvas dims: width from widest (relative to baseCx) so base is centered
let leftMax=0,rightMax=0;
for(const c of cells){ leftMax=Math.max(leftMax,(c.baseCx-c.minx)); rightMax=Math.max(rightMax,(c.maxx-c.baseCx)); }
const Wc=Math.ceil((leftMax+rightMax)*G)+6, Hc=Math.ceil(maxH*G)+2;
const baseX=Math.round(leftMax*G)+3; // where baseCx maps in output
console.log('G',G.toFixed(3),'canvas',Wc+'x'+Hc,'baseX',baseX);
cells.forEach((c,i)=>{
  const out=new PNG({width:Wc,height:Hc}); out.data.fill(0);
  const ch=c.maxy-c.miny+1, cw=c.maxx-c.minx+1;
  const dh=Math.round(ch*G), dw=Math.round(cw*G);
  const destBottom=Hc-1, destTop=destBottom-dh+1;
  const destBaseX=baseX;
  const destLeft=Math.round(destBaseX-(c.baseCx-c.minx)*G);
  for(let y=0;y<dh;y++){ const sy=c.miny+Math.min(ch-1,Math.floor(y/G)); const oy=destTop+y; if(oy<0||oy>=Hc)continue;
    for(let x=0;x<dw;x++){ const sx=c.minx+Math.min(cw-1,Math.floor(x/G)); const oxp=destLeft+x; if(oxp<0||oxp>=Wc)continue;
      if(!c.er[sy*CW+sx])continue; const si=((sy)*W+(c.ox+sx))<<2, dp=(oy*Wc+oxp)<<2; out.data[dp]=data[si];out.data[dp+1]=data[si+1];out.data[dp+2]=data[si+2];out.data[dp+3]=255; } }
  fs.writeFileSync(`${OUT}/serp-corner-${i+1}.png`, PNG.sync.write(out));
});
console.log('wrote',cells.length,'frames',Wc+'x'+Hc);
