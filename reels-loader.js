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
  "#wpr-pega{position:fixed;left:50%;transform:translateX(-50%);z-index:9998;width:74px;height:20px;border-radius:37px 37px 0 0/20px 20px 0 0;touch-action:none;cursor:pointer;-webkit-tap-highlight-color:transparent;color:var(--muted,#8a8f9c)}"+
  "#wpr-pega *{pointer-events:none}"+
  "#wpr-pega svg.arco{position:absolute;left:50%;bottom:0;margin-left:-65px;width:130px;height:34px;display:block;overflow:visible}"+
  "#wpr-ponto{position:fixed;z-index:9999;width:13px;height:13px;margin:-6px 0 0 -6px;border-radius:50%;background:var(--accent,#e0a33c);box-shadow:0 0 0 4px color-mix(in srgb,var(--accent,#e0a33c) 30%,transparent);pointer-events:none;display:none}"+
  "#wpr-pano{position:fixed;inset:0;z-index:99999;background:var(--bg,#0d0f14);transform:translateY(100%);transition:transform .32s cubic-bezier(.2,.8,.2,1);visibility:hidden}"+
  "#wpr-pano.dentro{visibility:visible}#wpr-pano.arrasta{transition:none}#wpr-pano.aberto{transform:translateY(0)}"+
  "#wpr-pano iframe{width:100%;height:100%;border:0;background:var(--bg,#0d0f14)}";
  document.head.appendChild(css);

  var pega=document.createElement("div");pega.id="wpr-pega";pega.setAttribute("aria-label","Abrir Reels");
  pega.innerHTML=
   '<svg class="arco" viewBox="0 0 130 34"><path id="wpr-morro" d="M-2 35H24C40 35 46 18 65 18C84 18 90 35 106 35H132V36H-2Z" style="fill:var(--wpr-fundo,#0d0f14);stroke:none"/><text x="65" y="32" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="800" fill="currentColor">R</text></svg>';
  var pano=document.createElement("div");pano.id="wpr-pano";
  document.body.appendChild(pega);document.body.appendChild(pano);
  var ponto=document.createElement("div");ponto.id="wpr-ponto";document.body.appendChild(ponto);
  var anim=null,ultimo="";

  /* ---- SÓ NA PÁGINA INICIAL ----
     Início = endereço da raiz (/, /index.html, /index.php) E, se o menu inferior tiver separador ativo, que seja o do Início/Home
     (ou o primeiro). O site pode mandar a sua própria regra: window.WPR_NA_INICIAL = function(){ return true/false }. */
  function naInicial(){
    try{
      if(typeof window.WPR_NA_INICIAL==="function")return !!window.WPR_NA_INICIAL();
      var p=location.pathname.replace(/\/+$/,"").toLowerCase();
      if(p&&!/^\/(index(\.(html|php))?)?$/.test(p))return false;
      var nav=document.getElementById("bottomNav")||document.querySelector(".bottom-nav");
      if(!nav)return true;
      var at=nav.querySelector(".active,.on,.ativo,.selected,.atual,[aria-current]:not([aria-current=false]),[aria-selected=true]");
      if(!at)return true;
      var it=at;while(it.parentElement&&it.parentElement!==nav)it=it.parentElement;
      var txt=((it.id||"")+" "+(it.getAttribute("data-tab")||it.getAttribute("data-page")||it.getAttribute("data-go")||it.getAttribute("href")||"")+" "+(it.textContent||"")).toLowerCase();
      if(/in[ií]cio|inicio|home/.test(txt))return true;
      return it===nav.children[0];
    }catch(e){return true;}
  }
  function visibilidade(){
    var ok=naInicial();
    pega.style.display=ok?"":"none";
    if(!ok)ponto.style.display="none";
  }
  setInterval(visibilidade,300);
  addEventListener("popstate",function(){setTimeout(visibilidade,50);});
  addEventListener("hashchange",function(){setTimeout(visibilidade,50);});
  document.addEventListener("click",function(){setTimeout(visibilidade,80);},true);
  function demo(){
    if(visto()||!naInicial()){ponto.style.display="none";if(anim){anim.cancel();anim=null;ultimo="";}return;}
    if(!meio)return;
    var a=meio.getBoundingClientRect(),r=pega.getBoundingClientRect();
    var x=a.left+a.width/2,y0=a.top+a.height/2,y1=r.top+r.height*0.45,chave=[x,y0,y1].map(Math.round).join();
    if(chave===ultimo&&anim)return;ultimo=chave;if(anim)anim.cancel();
    ponto.style.left=x+"px";ponto.style.top=y0+"px";ponto.style.display="block";
    var d=y1-y0;
    anim=ponto.animate([{transform:"translateY(0) scale(.7)",opacity:0},{transform:"translateY(0) scale(1)",opacity:1,offset:.15},{transform:"translateY("+d+"px) scale(1)",opacity:1,offset:.7},{transform:"translateY("+d+"px) scale(.7)",opacity:0}],{duration:1500,iterations:Infinity,easing:"cubic-bezier(.4,0,.2,1)"});
  }
  setInterval(demo,800);

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
    if(aberto)return;aberto=true;marcarVisto();demo();
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
    el.addEventListener("pointerdown",function(e){if(!naInicial()){y0=null;return;}y0=e.clientY;x0=e.clientX;mov=false;arrastou=false;try{el.setPointerCapture(e.pointerId);}catch(x){}});
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
    el.addEventListener("touchmove",function(e){if(naInicial()&&e.cancelable)e.preventDefault();},{passive:false});
    // se foi um arrasto, não deixa o site tratar como clique (não muda de separador)
    el.addEventListener("click",function(e){if(arrastou){arrastou=false;e.stopImmediatePropagation();e.preventDefault();}},true);
  }
  ligar(pega,true);visibilidade();
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
