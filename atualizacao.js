/* Aviso de atualização do aplicativo (WebPlay / Median).
   Lê a versão REAL instalada no aparelho (WebPlayBridge.versao ou median.deviceInfo) e compara com
   o nó Firebase "atualizacao" (projeto feed). Se o Firebase falhar, usa
   atualizacao.json como reserva.
   - Só aparece dentro do app (não no navegador).
   - Só some quando o app instalado tiver a versão pedida.
   - Tocar em "Atualizar" sem instalar NÃO apaga o aviso. */
(function(){
  var SESSAO = "webplay_upd_depois";
  // APK no último Release do GitHub (o link não muda: basta publicar um release novo com o ficheiro app.apk). Para outro endereço, põe o campo "apk" no nó "atualizacao".
  var APK_PADRAO = "https://github.com/xeprogramador-cmyk/Webplay-/releases/latest/download/app.apk";

  function urlApk(c){
    try { return new URL(c.apk || APK_PADRAO, location.href).href; } catch(e){ return APK_PADRAO; }
  }
  // Baixa o APK: app novo → DownloadManager do Android (ícone de download + instalador); app antigo → download pelo WebView.
  function baixarApp(c){
    try {
      if(window.WebPlayBridge && typeof WebPlayBridge.baixarApk === "function"){ WebPlayBridge.baixarApk(urlApk(c)); return; }
    } catch(e){}
    iniciarDownload(urlApk(c));
  }
  // Abre o link principal (ADM Play) no Chrome, fora do app.
  function abrirNaWeb(c){
    try {
      if(window.WebPlayBridge && typeof WebPlayBridge.abrirNavegador === "function"){ WebPlayBridge.abrirNavegador(c.link); return; }
    } catch(e){}
    try { window.open(c.link, "_blank", "noopener"); } catch(e){ location.href = c.link; }
  }
  function escolherModo(c, atual){
    var velha = document.getElementById("wpUpdEsc"); if(velha) velha.remove();
    if(!document.getElementById("wpUpdEscCss")){
      var css = document.createElement("style"); css.id = "wpUpdEscCss";
      css.textContent =
        "#wpUpdEsc{position:fixed;inset:0;z-index:2147483647;background:rgba(10,12,16,.92);display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui,sans-serif;color:#eae6dd;text-align:center}" +
        "#wpUpdEsc .cx{max-width:380px;width:100%;background:#161a22;border:1px solid #2a303c;border-radius:18px;padding:22px}" +
        "#wpUpdEsc h3{margin:0 0 6px;font-size:1.15rem}" +
        "#wpUpdEsc p{margin:0 0 16px;font-size:.88rem;line-height:1.4;color:#9097a5}" +
        "#wpUpdEsc button{display:block;width:100%;border:0;border-radius:14px;padding:13px;margin:8px 0 0;font-weight:bold;font-size:.95rem;cursor:pointer}" +
        "#wpUpdEsc .p{background:#e0a33c;color:#1a1305}#wpUpdEsc .s{background:#232833;color:#eae6dd}#wpUpdEsc .x{background:transparent;color:#9097a5;font-weight:normal}";
      document.head.appendChild(css);
    }
    var e = document.createElement("div"); e.id = "wpUpdEsc";
    var cx = document.createElement("div"); cx.className = "cx";
    var h = document.createElement("h3"); h.textContent = "Como queres atualizar?";
    var p = document.createElement("p"); p.textContent = "Versão nova: " + c.versao;
    var b1 = document.createElement("button"); b1.className = "p"; b1.textContent = "Atualizar no aplicativo";
    b1.addEventListener("click", function(){ e.remove(); telaAtualizando(c, atual); });
    var b2 = document.createElement("button"); b2.className = "s"; b2.textContent = "Atualizar pela web (Chrome)";
    b2.addEventListener("click", function(){ e.remove(); abrirNaWeb(c); });
    cx.appendChild(h); cx.appendChild(p); cx.appendChild(b1); cx.appendChild(b2);
    var b3 = document.createElement("button"); b3.className = "x"; b3.textContent = "Voltar";
    b3.addEventListener("click", function(){ e.remove(); });
    cx.appendChild(b3);
    e.appendChild(cx); document.body.appendChild(e);
  }

  function partes(v){ return String(v||"0").split(/[^0-9]+/).filter(Boolean).map(Number); }
  function menor(a, b){
    a = partes(a); b = partes(b);
    for(var i = 0; i < Math.max(a.length, b.length); i++){
      var x = a[i] || 0, y = b[i] || 0;
      if(x !== y) return x < y;
    }
    return false;
  }

  function infoApp(cb){
    // App nativo (WebPlay): a versão vem da ponte WebPlayBridge.versao()
    try {
      if(window.WebPlayBridge && typeof WebPlayBridge.versao === "function"){
        var v = WebPlayBridge.versao();
        if(v){ cb({ appVersion: String(v) }); return; }
      } else if(window.WebPlayBridge){
        // App WebPlay ANTIGO (anterior à 2.0.64): tem a ponte mas não sabe dizer a versão.
        // Conta como versão antiga, por isso recebe o aviso e passa a funcionar após instalar a nova.
        cb({ appVersion: "0.0.0" }); return;
      }
    } catch(e){}
    var tent = 0;
    (function tentar(){
      if(window.median && typeof median.deviceInfo === "function"){
        try {
          var r = median.deviceInfo();
          if(r && r.then){ r.then(function(info){ cb(info || null); }, function(){ cb(null); }); }
          else { cb(r || null); }
        } catch(e){ cb(null); }
        return;
      }
      // até ~10 s — o bridge do Median às vezes demora a aparecer
      if(++tent < 50) setTimeout(tentar, 200);
      else cb(null);
    })();
  }

  function dbFeedPronto(){
    try {
      if(typeof firebase === "undefined") return null;
      return firebase.app("feed").database();
    } catch(e){ return null; }
  }

  function lerConfig(cb){
    var feito = false;
    function usarJson(){
      fetch("atualizacao.json?_=" + Date.now(), { cache: "no-store" })
        .then(function(r){ return r.json(); }).then(function(c){ if(!feito){ feito = true; cb(c); } })
        .catch(function(){ if(!feito){ feito = true; cb(null); } });
    }
    function tentarFirebase(tentativa){
      var db = dbFeedPronto();
      if(!db){
        if((tentativa || 0) < 15) return setTimeout(function(){ tentarFirebase((tentativa || 0) + 1); }, 400);
        return usarJson();
      }
      var t = setTimeout(function(){ if(!feito){ feito = true; usarJson(); } }, 8000);
      db.ref("atualizacao").once("value").then(function(snap){
        if(feito) return; feito = true; clearTimeout(t);
        var c = snap.val();
        if(c) cb(c); else usarJson();
      }, function(){ if(feito) return; feito = true; clearTimeout(t); usarJson(); });
    }
    try { tentarFirebase(0); } catch(e){ usarJson(); }
  }

  infoApp(function(info){
    if(!info || !info.appVersion) return;
    lerConfig(function(c){
      if(!c || !c.ativo || !c.versao || !c.link) return;
      if(!menor(info.appVersion, c.versao)) return;
      try { if(!c.obrigatoria && sessionStorage.getItem(SESSAO) === String(c.versao)) return; } catch(e){}
      mostrar(c, info.appVersion);
    });
  });

  function iniciarDownload(link){
    try {
      var d = document.createElement("a");
      d.href = link; d.setAttribute("download", ""); d.rel = "noopener";
      d.style.display = "none"; document.body.appendChild(d); d.click();
      setTimeout(function(){ d.remove(); }, 1000);
    } catch(e){ location.href = link; }
  }

  function telaAtualizando(c, atual){
    var antiga = document.getElementById("wpUpdTela"); if(antiga) antiga.remove();
    if(!document.getElementById("wpUpdTelaCss")){
      var css = document.createElement("style"); css.id = "wpUpdTelaCss";
      css.textContent =
        "#wpUpdTela{position:fixed;inset:0;z-index:2147483647;background:#0d0f14;color:#eae6dd;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;animation:wpEnt .35s ease}" +
        "@keyframes wpEnt{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}" +
        "#wpUpdTela .cx{max-width:380px;width:100%}" +
        "#wpUpdTela svg.ic{width:64px;height:64px;stroke:#eae6dd;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;animation:wpDesce 1.6s ease-in-out infinite}" +
        "@keyframes wpDesce{0%,100%{transform:translateY(-4px)}50%{transform:translateY(5px)}}" +
        "#wpUpdTela h2{font-family:Georgia,serif;font-size:1.5rem;margin:18px 0 6px}" +
        "#wpUpdTela .v{color:#e0a33c;font-weight:700}" +
        "#wpUpdTela p{margin:0 0 14px;font-size:.92rem;line-height:1.45;color:#9097a5}" +
        "#wpUpdTela .bar{height:6px;border-radius:3px;background:#232833;overflow:hidden;margin:18px 0}" +
        "#wpUpdTela .bar i{display:block;height:100%;width:40%;border-radius:3px;background:#e0a33c;animation:wpBar 1.4s ease-in-out infinite}" +
        "#wpUpdTela .bar.ok i{animation:none;width:100%}" +
        "@keyframes wpBar{0%{margin-left:-40%}100%{margin-left:100%}}" +
        "#wpUpdTela button{border:0;border-radius:22px;padding:11px 20px;font-weight:bold;font-size:.9rem;margin:4px;cursor:pointer}" +
        "#wpUpdTela .p{background:#e0a33c;color:#1a1305}#wpUpdTela .s{background:transparent;color:#eae6dd;border:1px solid #555}";
      document.head.appendChild(css);
    }
    var t = document.createElement("div"); t.id = "wpUpdTela";
    t.innerHTML =
      '<div class="cx"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14"/></svg>' +
      '<h2>Atualizando para a versão <span class="v"></span></h2>' +
      '<p class="atual"></p><div class="bar"><i></i></div><p class="st">Baixando a atualização…</p>' +
      '<div class="ac"></div></div>';
    t.querySelector(".v").textContent = c.versao;
    t.querySelector(".atual").textContent = atual === "0.0.0" ? "Versão antiga instalada" : "Sua versão: " + atual;
    var ac = t.querySelector(".ac");
    var again = document.createElement("button"); again.className = "p"; again.textContent = "Baixar novamente";
    again.addEventListener("click", function(){ baixarApp(c); });
    ac.appendChild(again);
    if(!c.obrigatoria){
      var fechar = document.createElement("button"); fechar.className = "s"; fechar.textContent = "Fechar";
      fechar.addEventListener("click", function(){ t.remove(); });
      ac.appendChild(fechar);
    }
    document.body.appendChild(t);
    baixarApp(c);
    setTimeout(function(){
      var b = t.querySelector(".bar"); if(b) b.className = "bar ok";
      var st = t.querySelector(".st");
      if(st) st.textContent = "Quando o download terminar, o instalador abre sozinho: toca em Instalar.";
    }, 3500);
  }

  function mostrar(c, atual){
    if(document.getElementById("wpUpd")) return;
    var css = document.createElement("style");
    css.textContent =
      "#wpUpd{position:fixed;z-index:2147483647;font-family:system-ui,sans-serif;color:#eae6dd;}" +
      "#wpUpd.barra{left:0;right:0;bottom:0;background:#161a22;border-top:2px solid #e0a33c;padding:14px 16px;padding-bottom:calc(14px + env(safe-area-inset-bottom,0px));}" +
      "#wpUpd.tela{inset:0;background:rgba(10,12,16,.96);display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;}" +
      "#wpUpd .cx{max-width:420px;margin:0 auto;}" +
      "#wpUpd b{display:block;font-size:1.05rem;margin-bottom:6px;}" +
      "#wpUpd p{margin:0 0 12px;font-size:.9rem;line-height:1.4;opacity:.9;}" +
      "#wpUpd a.btn,#wpUpd button{display:inline-block;border:0;border-radius:22px;padding:11px 20px;font-weight:bold;font-size:.9rem;text-decoration:none;margin-right:8px;}" +
      "#wpUpd a.btn{background:#e0a33c;color:#1a1305;}" +
      "#wpUpd button{background:transparent;color:#eae6dd;border:1px solid #555;}";
    document.head.appendChild(css);

    var box = document.createElement("div");
    box.id = "wpUpd";
    box.className = c.obrigatoria ? "tela" : "barra";
    var cx = document.createElement("div"); cx.className = "cx";
    var t = document.createElement("b"); t.textContent = "Atualize o aplicativo";
    var p = document.createElement("p");
    p.textContent = (c.mensagem || "Há uma nova versão do aplicativo disponível.") +
                    (atual === "0.0.0" ? " (Nova versão: " + c.versao + ")" : " (Sua versão: " + atual + " → nova: " + c.versao + ")");
    var a = document.createElement("a"); a.className = "btn"; a.textContent = "Atualizar";
    a.href = c.link; a.rel = "noopener";
    a.addEventListener("click", function(e){ e.preventDefault(); escolherModo(c, atual); });
    cx.appendChild(t); cx.appendChild(p); cx.appendChild(a);
    if(!c.obrigatoria){
      var b = document.createElement("button"); b.textContent = "Agora não";
      b.addEventListener("click", function(){
        try { sessionStorage.setItem(SESSAO, String(c.versao)); } catch(e){}
        box.remove();
      });
      cx.appendChild(b);
    }
    box.appendChild(cx);
    document.body.appendChild(box);
  }
})();
