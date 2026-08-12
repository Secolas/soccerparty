    // ================= CROWD =================
    let crowd=[];
    const SKINS=['#e8b98f','#c98a5e','#8a5a3c','#f0cba0','#a06a44'];
    function vary(hex){ const c=hex.replace('#','');
    const n=(Math.random()*0.5-0.18);
    let r=parseInt(c.substr(0,2),16),g=parseInt(c.substr(2,2),16),b=parseInt(c.substr(4,2),16);
    const cl=v=>Math.max(0,Math.min(255,Math.round(v*(1+n))));
    return 'rgb('+cl(r)+','+cl(g)+','+cl(b)+')';
    }
    const BEACH_SHIRTS=['#e86a4a','#4aa3e0','#f2c14e','#4cb469','#e0559a','#f0f0e6','#5ac8c8','#f08a3c'];
    // Crowd fans removed — pitch surrounds are scenery-only now (nature + man-made props, see
    // buildAmbient). buildCrowd stays as a no-op so its many call sites keep working unchanged.
    function buildCrowd(){ crowd=[]; }
    buildCrowd();

