/* ============================================================
   REELS LOADER — junta os Reels ao site SEM mexer no index.html.
   - Põe a "pegada" (cor do tema do site) por cima do menu inferior; puxar para cima (ou tocar) abre o /reels.html.
   - 1.ª vez: a pegada anima-se sozinha a mostrar o gesto "puxa para cima" (com dedo e seta), até a pessoa abrir os Reels.
   - Link /?reels=ID (usado pelos widgets do app) abre direto esse Reels.
   É injetado pelo functions/_middleware.js (Cloudflare Pages) ou pelo reels-injetor.php.
============================================================ */
(function(){
  try{if(window.top!==window.self||/reels|criador|admin/i.test(location.pathname))return;}catch(e){return;}
  if(window.__webplayReels) return; window.__webplayReels=true;
  var URL_REELS="reels.html", CH_VISTO="wpr_viu";
  function visto(){try{return localStorage.getItem(CH_VISTO)==="1";}catch(e){return true;}}
  function marcarVisto(){try{localStorage.setItem(CH_VISTO,"1");}catch(e){}}

  var css=document.createElement("style");
  css.textContent=
  "#wpr-pega{position:fixed;left:50%;transform:translateX(-50%);z-index:9998;width:180px;height:70px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;touch-action:none;cursor:pointer;-webkit-tap-highlight-color:transparent;color:var(--muted,#8a8f9c)}"+
  "#wpr-pega svg.arco{width:130px;height:34px;display:block;overflow:visible}"+
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
   '<svg class="arco" viewBox="0 0 130 34"><path id="wpr-morro" d="M-2 35H24C40 35 46 18 65 18C84 18 90 35 106 35H132V36H-2Z" style="fill:var(--wpr-fundo,#0d0f14);stroke:none"/><text x="65" y="32" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="800" fill="currentColor">R</text></svg>';
  var pano=document.createElement("div");pano.id="wpr-pano";
  document.body.appendChild(pega);document.body.appendChild(pano);
  if(!visto())pega.classList.add("treino");

  function posicionar(){
    var nav=document.getElementById("bottomNav")||document.querySelector(".bottom-nav");
    pega.style.bottom=((nav?nav.getBoundingClientRect().height:0)-1)+"px";
    try{var c=nav?getComputedStyle(nav).backgroundColor:"";
      if(!c||/rgba?\(0,\s*0,\s*0,\s*0\)|transparent/.test(c)){c=getComputedStyle(document.body).getPropertyValue("--panel")||"#0d0f14";}
      pega.style.setProperty("--wpr-fundo",c);
    }catch(e){}
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

  // puxar para cima: o painel acompanha o dedo.
  // No R: tocar OU puxar abre os Reels. No ícone do meio do menu (Séries): tocar vai ao separador do site, só PUXAR PARA CIMA abre os Reels.
  function ligar(el,tocaAbre){
    var y0=null,x0=0,mov=false,arrastou=false;
    el.addEventListener("pointerdown",function(e){y0=e.clientY;x0=e.clientX;mov=false;arrastou=false;try{el.setPointerCapture(e.pointerId);}catch(x){}});
    el.addEventListener("pointermove",function(e){
      if(y0===null)return;var d=y0-e.clientY;
      if(d>6&&d>Math.abs(e.clientX-x0)){mov=true;if(!aberto){pano.classList.add("dentro","arrasta");criarIframe();pano.style.transform="translateY("+Math.max(0,innerHeight-d)+"px)";}}
    });
    function fim(e){
      if(y0===null)return;var d=y0-e.clientY;y0=null;pano.classList.remove("arrasta");pano.style.transform="";
      if(mov)arrastou=true;
      if((mov&&d>40)||(tocaAbre&&!mov&&Math.abs(d)<10)){pano.classList.remove("aberto");aberto=false;abrir();}
      else if(!aberto){pano.classList.remove("dentro");if(iframe){iframe.remove();iframe=null;}}
    }
    el.addEventListener("pointerup",fim);el.addEventListener("pointercancel",fim);
    el.addEventListener("touchmove",function(e){if(e.cancelable)e.preventDefault();},{passive:false});
    // se foi um arrasto, não deixa o site tratar como clique (não muda de separador)
    el.addEventListener("click",function(e){if(arrastou){arrastou=false;e.stopImmediatePropagation();e.preventDefault();}},true);
  }
  ligar(pega,true);
  var meio=null;
  function ligarMeio(){
    var nav=document.getElementById("bottomNav")||document.querySelector(".bottom-nav");if(!nav)return;
    var cx=innerWidth/2,melhor=null,bd=1e9;
    Array.prototype.forEach.call(nav.children,function(it){var r=it.getBoundingClientRect();if(r.width<=0)return;var d=Math.abs(r.left+r.width/2-cx);if(d<bd){bd=d;melhor=it;}});
    if(melhor&&melhor!==meio&&!melhor.__wpr){meio=melhor;melhor.__wpr=1;melhor.style.touchAction="none";ligar(melhor,false);}
  }
  ligarMeio();setInterval(ligarMeio,1500);

  // link direto (widgets do app): /?reels=ID  → abre esse Reels; /?reels=1 → abre o início dos Reels
  try{
    var m=location.search.match(/[?&]reels=([^&]+)/);
    if(m){var id=decodeURIComponent(m[1]);setTimeout(function(){abrir(id&&id!=="1"?"#r="+encodeURIComponent(id):"");},400);}
  }catch(e){}
})();
