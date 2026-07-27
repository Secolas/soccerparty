    // ---- Dimensions: board coords (W,H) inside a larger canvas with crowd stands ----
    const PW=210, PH=330;
    // The side stands are wide enough to hold the fan sprites at their NATIVE
    // authored size (FAN_PX below) in two columns. Drawing a sprite at the size
    // it was drawn at is the whole point: squeezing a 48px sheet into 17px was a
    // non-integer reduction that dropped pixels irregularly and shredded the
    // faces, which is the "low quality" the promo video doesn't have.
    const FAN_PX=32;                     // authored size of fan-*-sheet.png frames
    const CROWD_TB=10, CROWD_LR=36;
    const W=PW, H=PH;
    const CW=W+CROWD_LR*2, CH=H+CROWD_TB*2;
    const OX=CROWD_LR, OY=CROWD_TB;
    // How much stand must stay on screen when the viewport is too narrow for the
    // full width. The pitch is never scaled down to make the stands fit — the
    // stands are cropped instead, so phones keep the desktop crowd, just less of
    // it (see fit()).
    const MIN_SIDE=10;
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
      const availW=Math.min(window.innerWidth,_fs?1100:640)-16, availH=window.innerHeight-chrome;
      // Scale off the PITCH plus a strip of stand, not the full canvas width.
      // Sizing to CW would shrink the pitch on a phone just to fit stands that
      // are decoration; this keeps the pitch as large as it has always been and
      // lets the extra stand width run off the edges instead.
      const sf=Math.min(availW/(W+MIN_SIDE*2), availH/CH, 3.4);
      SCALE=Math.max(0.6,sf);
      const cssW=CW*SCALE, cssH=CH*SCALE;
      canvas.style.width=cssW+'px'; canvas.style.height=cssH+'px';
      // Crop the stands evenly left and right. #ns_stage is overflow:hidden, so
      // pinning it to the visible width and nudging the canvas left by half the
      // overflow takes the same bite out of each stand. On a wide screen there is
      // no overflow and this is a no-op.
      try{
        const stage=el('ns_stage'), showW=Math.min(cssW,availW);
        if(stage){ stage.style.width=showW+'px'; stage.style.height=cssH+'px'; }
        canvas.style.marginLeft=Math.round(-(cssW-showW)/2)+'px';
      }catch(e){}
      sizeSB();
    }

    const COLORS={ coin:'#f4e9c8', coinEdge:'#b8a678' };

