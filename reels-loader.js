/* ============================================================
   REELS LOADER — junta os Reels ao site SEM mexer no index.html.
   - Põe a "pegada" (cor do tema do site) por cima do menu inferior; puxar para cima (ou tocar) abre o /reels.html.
   - 1.ª vez: a pegada anima-se sozinha a mostrar o gesto "puxa para cima" (com dedo e seta), até a pessoa abrir os Reels.
   - Link /?reels=ID (usado pelos widgets do app) abre direto esse Reels.
   É injetado pelo functions/_middleware.js (Cloudflare Pages) ou pelo reels-injetor.php.
============================================================ */
(function(){
  if(window.__webplayReels) return; window.__webplayReels=true;
  var URL_REELS="reels.html", CH_VISTO="wpr_viu";
  function visto(){try{return localStorage.getItem(CH_VISTO)==="1";}catch(e){return true;}}
  function marcarVisto(){try{localStorage.setItem(CH_VISTO,"1");}catch(e){}}

  var css=document.createElement("style");
  css.textContent=
  "#wpr-pega{position:fixed;left:50%;transform:translateX(-50%);z-index:9998;width:130px;height:56px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;touch-action:none;cursor:pointer;-webkit-tap-highlight-color:transparent;color:var(--muted,#8a8f9c)}"+
  "#wpr-pega svg.arco{width:100px;height:30px;animation:wprb 2.2s ease-in-out infinite}"+
  "@keyframes wprb{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}"+
  /* demonstração da 1.ª vez */
  "#wpr-pega.treino{height:150px}"+
  "#wpr-pega.treino svg.arco{animation:wprs 1.7s cubic-bezier(.4,0,.2,1) infinite}"+
  "@keyframes wprs{0%{transform:translateY(0);opacity:.5}18%{opacity:1}70%{transform:translateY(-70px);opacity:1}100%{transform:translateY(-70px);opacity:0}}"+
  "#wpr-dedo,#wpr-dica{display:none}"+
  "#wpr-pega.treino #wpr-dedo{display:block;position:absolute;bottom:0;left:50%;margin-left:-14px;width:28px;height:28px;color:var(--ink,#eae6dd);animation:wprd 1.7s cubic-bezier(.4,0,.2,1) infinite}"+
  "@keyframes wprd{0%{transform:translateY(0) scale(1);opacity:0}12%{opacity:1;transform:translateY(0) scale(.88)}70%{transform:translateY(-70px) scale(.88);opacity:1}100%{transform:translateY(-70px) scale(1);opacity:0}}"+
  "#wpr-pega.treino #wpr-dica{display:block;position:absolute;top:0;left:50%;transform:translateX(-50%);white-space:nowrap;font:700 12px system-ui,sans-serif;padding:5px 11px;border-radius:999px;background:var(--panel,#161a22);color:var(--ink,#eae6dd);border:1px solid var(--line,#232833)}"+
  "#wpr-pano{position:fixed;inset:0;z-index:99999;background:var(--bg,#0d0f14);transform:translateY(100%);transition:transform .32s cubic-bezier(.2,.8,.2,1);visibility:hidden}"+
  "#wpr-pano.dentro{visibility:visible}#wpr-pano.arrasta{transition:none}#wpr-pano.aberto{transform:translateY(0)}"+
  "#wpr-pano iframe{width:100%;height:100%;border:0;background:var(--bg,#0d0f14)}";
  document.head.appendChild(css);

  var pega=document.createElement("div");pega.id="wpr-pega";pega.setAttribute("aria-label","Abrir Reels");
  pega.innerHTML=
   '<div id="wpr-dica">Puxa para cima</div>'+
   '<svg id="wpr-dedo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11V5.5a1.5 1.5 0 013 0V10m0-1.5a1.5 1.5 0 013 0V11m0-1a1.5 1.5 0 013 0v4.5a6.5 6.5 0 01-6.5 6.5h-1A6.5 6.5 0 017 15.5l-2.3-3.7a1.4 1.4 0 012.3-1.6L9 12.5"/></svg>'+
   '<svg class="arco" viewBox="0 0 100 30" overflow="visible" fill="none"><path d="M6 24 Q28 24 38 12 Q50 -2 62 12 Q72 24 94 24" stroke="currentColor" stroke-width="7" stroke-linecap="round"/><circle cx="6" cy="24" r="5" fill="currentColor"/><circle cx="94" cy="24" r="5" fill="currentColor"/><text x="50" y="22" text-anchor="middle" font-family="system-ui,sans-serif" font-size="15" font-weight="800" fill="currentColor">R</text></svg>';
  var pano=document.createElement("div");pano.id="wpr-pano";
  document.body.appendChild(pega);document.body.appendChild(pano);
  if(!visto())pega.classList.add("treino");

  function posicionar(){
    var nav=document.getElementById("bottomNav")||document.querySelector(".bottom-nav");
    pega.style.bottom=((nav?nav.getBoundingClientRect().height:0)+4)+"px";
  }
  posicionar();addEventListener("resize",posicionar);setInterval(posicionar,2000);

  var iframe=null,aberto=false;
  function criarIframe(hash){
    if(iframe)return;iframe=document.createElement("iframe");iframe.src=URL_REELS+(hash||"");
    iframe.allow="autoplay; fullscreen; encrypted-media";pano.appendChild(iframe);
  }
  function abrir(hash){
    if(aberto)return;aberto=true;marcarVisto();pega.classList.remove("treino");
    criarIframe(hash);
    pano.classList.add("dentro");requestAnimationFrame(function(){requestAnimationFrame(function(){pano.classList.add("aberto");});});
    try{history.pushState({wpReels:1},"");}catch(e){}
  }
  function fechar(deHistorico){
    if(!aberto)return;aberto=false;pano.classList.remove("aberto");
    setTimeout(function(){pano.classList.remove("dentro");if(iframe){iframe.remove();iframe=null;}},340);
    if(!deHistorico){try{if(history.state&&history.state.wpReels)history.back();}catch(e){}}
  }
  addEventListener("popstate",function(){if(aberto)fechar(true);});
  addEventListener("message",function(e){if(e.data&&e.data.webplayReels==="fechar")fechar();});

  // puxar para cima: o painel acompanha o dedo
  var y0=null,mov=false;
  pega.addEventListener("pointerdown",function(e){y0=e.clientY;mov=false;pega.setPointerCapture(e.pointerId);});
  pega.addEventListener("pointermove",function(e){
    if(y0===null)return;var d=y0-e.clientY;
    if(d>6){mov=true;if(!aberto){pano.classList.add("dentro","arrasta");criarIframe();pano.style.transform="translateY("+Math.max(0,innerHeight-d)+"px)";}}
  });
  function fim(e){
    if(y0===null)return;var d=y0-e.clientY;y0=null;pano.classList.remove("arrasta");pano.style.transform="";
    if(d>70||(!mov&&Math.abs(d)<6)){pano.classList.remove("aberto");aberto=false;abrir();}
    else if(!aberto){pano.classList.remove("dentro");if(iframe){iframe.remove();iframe=null;}}
  }
  pega.addEventListener("pointerup",fim);pega.addEventListener("pointercancel",fim);

  // link direto (widgets do app): /?reels=ID  → abre esse Reels; /?reels=1 → abre o início dos Reels
  try{
    var m=location.search.match(/[?&]reels=([^&]+)/);
    if(m){var id=decodeURIComponent(m[1]);setTimeout(function(){abrir(id&&id!=="1"?"#r="+encodeURIComponent(id):"");},400);}
  }catch(e){}
})();
