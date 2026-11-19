/* WebPlay – tradução automática do site pela Google (o mesmo "Google Tradutor de sites").
   Como usar: uma única linha, logo a seguir ao idioma.js, no index (novo ou antigo):
       <script src="idioma.js"></script>
       <script src="traducao-google.js"></script>
   - Português (idioma original do site): não faz nada, o site fica como está.
   - Qualquer outro idioma (escolha guardada em "webplay_idioma", ou "Auto" = idioma do aparelho):
     liga a tradução da Google sozinha, sem barra nem menu da Google à vista.
   - Ao mudar o idioma, o idioma.js recarrega a página e este ficheiro volta a decidir. */
(function(){
  var ORIGEM = "pt";                      // idioma em que o site está escrito
  var LS = "webplay_idioma";              // mesma chave do idioma.js
  var SUPORTADOS = ["en","es","fr"];      // idiomas que o menu do site oferece

  function escolha(){ try{ return localStorage.getItem(LS) || "auto"; }catch(e){ return "auto"; } }
  function alvo(){
    var e = escolha();
    if(e !== "auto") return e;
    var l = ((navigator.languages && navigator.languages[0]) || navigator.language || ORIGEM).slice(0,2).toLowerCase();
    return SUPORTADOS.indexOf(l) >= 0 || l === ORIGEM ? l : "en";   // sem tradução própria → inglês (igual ao idioma.js)
  }

  /* o cookie "googtrans" é o que diz à Google para traduzir logo ao abrir */
  function cookie(valor){
    var exp = valor ? "" : "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    var base = "googtrans=" + (valor || "") + exp + "; path=/";
    try{
      document.cookie = base;
      var h = location.hostname, partes = h.split(".");
      if(partes.length > 1){
        document.cookie = base + "; domain=" + h;
        document.cookie = base + "; domain=." + partes.slice(-2).join(".");
      }
    }catch(e){}
  }

  var L = alvo();
  if(L === ORIGEM){                       // português: garante que não fica tradução antiga ligada
    if(/(?:^|;\s*)googtrans=/.test(document.cookie)) cookie("");
    return;
  }

  cookie("/" + ORIGEM + "/" + L);
  window.WPGT = { lang: L };              // outros scripts podem saber que a Google está a traduzir

  var css = document.createElement("style");
  css.textContent =
    "body{top:0 !important;position:static !important;}" +
    ".goog-te-banner-frame,.goog-te-banner-frame.skiptranslate,iframe.goog-te-banner-frame,.VIpgJd-ZVi9od-ORHb-OEVmcd,.VIpgJd-ZVi9od-aZ2wEe-wOHMyf,.VIpgJd-ZVi9od-aZ2wEe-OiiCO{display:none !important;visibility:hidden !important;height:0 !important;}" +
    "#goog-gt-tt,.goog-te-balloon-frame,.goog-tooltip,.goog-tooltip:hover{display:none !important;}" +
    ".goog-text-highlight{background:none !important;box-shadow:none !important;}" +
    "#google_translate_element{position:absolute;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;}";
  (document.head || document.documentElement).appendChild(css);

  window.googleTranslateElementInit = function(){
    try{
      new google.translate.TranslateElement({
        pageLanguage: ORIGEM,
        includedLanguages: SUPORTADOS.join(","),
        autoDisplay: false
      }, "google_translate_element");
    }catch(e){}
  };

  function iniciar(){
    var box = document.createElement("div");
    box.id = "google_translate_element";
    box.setAttribute("translate", "no");
    box.className = "notranslate";
    document.body.appendChild(box);
    var s = document.createElement("script");
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    document.head.appendChild(s);
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
})();
