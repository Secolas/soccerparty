    // ---- Dimensions: board coords (W,H) inside a larger canvas with crowd stands ----
    const PW=210, PH=330;
    const CROWD_TB=10, CROWD_LR=12;
    const W=PW, H=PH;
    const CW=W+CROWD_LR*2, CH=H+CROWD_TB*2;
    const OX=CROWD_LR, OY=CROWD_TB;
    const WALL=12;
    const GOAL_W=Math.round(W*0.32);
    const COIN_R=5, NAIL_R=5;
    const NET_DEPTH=13;

    let SCALE=2;
    canvas.width=CW; canvas.height=CH; ctx.imageSmoothingEnabled=false;
    function fit(){
      // measure the real chrome height (scorebug, status, controls, hint) so nothing is cut off
      // on narrow/mobile screens where the controls row wraps to multiple lines
      let chrome=250;
      try{
        const sb=el('ns_scorebug'), st=el('ns_status'), cn=el('ns_controls'), hn=el('ns_hint');
        chrome = sb.offsetHeight + st.offsetHeight + cn.offsetHeight + 24; var _t=el('ns_top'),_b=el('ns_bot'); if(_t) chrome+=_t.offsetHeight+8; if(_b) chrome+=_b.offsetHeight+8;
      }catch(e){}
      var _fs=!!(document.fullscreenElement||document.webkitFullscreenElement); try{ document.documentElement.classList.toggle('ns-capped', !_fs); }catch(e){}
      const availW=Math.min(window.innerWidth,_fs?960:460)-16, availH=window.innerHeight-chrome;
      const sf=Math.min(availW/CW, availH/CH, 3.4);
      SCALE=Math.max(0.6,sf);
      canvas.style.width=(CW*SCALE)+'px'; canvas.style.height=(CH*SCALE)+'px';
      sizeSB();
    }

    const COLORS={ coin:'#f4e9c8', coinEdge:'#b8a678' };

