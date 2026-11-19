/**
 * Cola isto no TEU index.html (no início do JavaScript principal)
 * e muda só a URL do Worker.
 *
 * Depois procura no código:
 *   - "tmdb-cache.php"  → usa tmdbUrl()
 *   - "proxy.php"       → usa proxyUrl()
 *   - "mega-proxy.php"  → usa megaUrl()
 */

const WP_PROXY = "https://shrill-wildflower-8161.xeprogramador.workers.dev"; // ← muda aqui

function tmdbUrl(path) {
  // path deve começar com /  ex: "/movie/550" ou "/tv/1396/season/1"
  return WP_PROXY + "/tmdb?path=" + encodeURIComponent(path);
}

function proxyUrl(targetUrl) {
  // targetUrl = URL completa da SuperFlixAPI
  return WP_PROXY + "/proxy?url=" + encodeURIComponent(targetUrl);
}

function megaUrl(params) {
  // params = string de query  ex: "acao=status&tipo=movie&imdb=tt0137523"
  return WP_PROXY + "/mega?" + params;
}

/* ===== Exemplos de uso =====

// Antes:
fetch("tmdb-cache.php?path=/movie/550")

// Depois:
fetch(tmdbUrl("/movie/550"))


// Antes:
fetch("proxy.php?url=" + encodeURIComponent("https://superflixapi.monster/lista?category=filme"))

// Depois:
fetch(proxyUrl("https://superflixapi.monster/lista?category=filme"))


// Antes:
fetch("mega-proxy.php?acao=status&tipo=movie&imdb=tt0137523")

// Depois:
fetch(megaUrl("acao=status&tipo=movie&imdb=tt0137523"))

*/
