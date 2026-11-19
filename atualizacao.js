/* Aviso de atualização do aplicativo (Median).
   Lê a versão REAL instalada no aparelho (median.deviceInfo) e compara com atualizacao.json.
   - Só aparece dentro do app (não no navegador).
   - Só some quando o app instalado tiver a versão pedida. Tocar em "Atualizar" não apaga o aviso.
   - Depois de atualizar de verdade, não volta a aparecer. */
(function(){
  var SESSAO = "webplay_upd_depois";   // "Agora não": esconde só até fechar o app

  function partes(v){ return String(v||"0").split(/[^0-9]+/).filter(Boolean).map(Number); }
  function menor(a, b){                 // a < b ? (ex.: 1.0.0 < 1.0.1)
    a = partes(a); b = partes(b);
    for(var i = 0; i < Math.max(a.length, b.length); i++){
      var x = a[i] || 0, y = b[i] || 0;
      if(x !== y) return x < y;
    }
    return false;
  }

  function infoApp(cb){                 // espera o bridge do Median ficar pronto (até ~5 s)
    var tent = 0;
    (function tentar(){
      if(window.median && typeof median.deviceInfo === "function"){
        try {
          var r = median.deviceInfo();
          if(r && r.then){ r.then(cb, function(){}); } else { cb(r); }
        } catch(e){}
        return;
      }
      if(++tent < 25) setTimeout(tentar, 200);
    })();
  }

  // Lê a configuração: primeiro do Firebase do feed (nó "atualizacao", gravado pelo ADM Play);
  // se não houver, usa o ficheiro atualizacao.json como reserva.
  function lerConfig(cb){
    var feito = false;
    function usarJson(){
      fetch("atualizacao.json?_=" + Date.now(), { cache: "no-store" })
        .then(function(r){ return r.json(); }).then(cb).catch(function(){});
    }
    try {
      var t = setTimeout(function(){ if(!feito){ feito = true; usarJson(); } }, 6000);
      firebase.app("feed").database().ref("atualizacao").once("value").then(function(snap){
        if(feito) return; feito = true; clearTimeout(t);
        var c = snap.val();
        if(c) cb(c); else usarJson();
      }, function(){ if(feito) return; feito = true; clearTimeout(t); usarJson(); });
    } catch(e){ usarJson(); }
  }

  infoApp(function(info){
    if(!info || !info.appVersion) return;           // fora do app: não mostra nada
    lerConfig(function(c){
      if(!c || !c.ativo || !c.versao || !c.link) return;
      if(!menor(info.appVersion, c.versao)) return;   // já tem esta versão (ou mais nova)
      try { if(!c.obrigatoria && sessionStorage.getItem(SESSAO) === String(c.versao)) return; } catch(e){}
      mostrar(c, info.appVersion);
    });
  });

  // Tela "Atualizando para a versão X": abre ao tocar em Atualizar e começa o download sozinha.
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
    t.querySelector(".atual").textContent = "Sua versão: " + atual;
    var ac = t.querySelector(".ac");
    var again = document.createElement("button"); again.className = "p"; again.textContent = "Baixar novamente";
    again.addEventListener("click", function(){ iniciarDownload(c.link); });
    ac.appendChild(again);
    if(!c.obrigatoria){
      var fechar = document.createElement("button"); fechar.className = "s"; fechar.textContent = "Fechar";
      fechar.addEventListener("click", function(){ t.remove(); });
      ac.appendChild(fechar);
    }
    document.body.appendChild(t);
    iniciarDownload(c.link);   // começa sozinho
    setTimeout(function(){
      var b = t.querySelector(".bar"); if(b) b.className = "bar ok";
      var st = t.querySelector(".st");
      if(st) st.textContent = "Download iniciado. Quando terminar, abra o arquivo baixado e toque em Instalar.";
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
                    " (Sua versão: " + atual + " → nova: " + c.versao + ")";
    var a = document.createElement("a"); a.className = "btn"; a.textContent = "Atualizar";
    a.href = c.link; a.rel = "noopener";
    a.addEventListener("click", function(e){ e.preventDefault(); telaAtualizando(c, atual); });
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
