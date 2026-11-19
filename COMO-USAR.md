# WebPlay → HTML puro + Cloudflare Worker

Este pacote substitui os ficheiros PHP (`tmdb-cache.php`, `proxy.php`, `mega-proxy.php`) por um único Cloudflare Worker. O teu site fica 100% HTML + JavaScript.

---

## 1. Criar o Worker no Cloudflare (5 minutos)

### Opção A — Painel (mais fácil)

1. Entra em [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Workers & Pages** → **Create** → **Create Worker**
3. Nome: `webplay-proxy`
4. Apaga o código de exemplo e cola **todo** o conteúdo de `worker/worker.js`
5. **Deploy**
6. Copia a URL que aparece (ex.: `https://webplay-proxy.teu-user.workers.dev`)

### Opção B — Wrangler (linha de comando)

```bash
npm install -g wrangler
cd worker
wrangler login
wrangler deploy
```

---

## 2. (Recomendado) Ativar cache KV

Sem KV o Worker funciona, mas cada visita pode gastar quota da TMDB.  
Com KV, 1 pedido serve muitos utilizadores.

1. Cloudflare → **Workers & Pages** → **KV** → **Create a namespace**
2. Nome: `webplay-cache`
3. Copia o **Namespace ID**
4. No Worker → **Settings** → **Variables** → **KV Namespace Bindings**
5. Variable name: `CACHE`  |  Namespace: o que criaste
6. Guarda e faz **Deploy** de novo

Se usares `wrangler.toml`, descomenta as linhas do KV e cola o ID.

---

## 3. Ligar o teu site ao Worker

No teu `index.html` (e em qualquer JS que chame TMDB / SuperFlix / Mega), troca as URLs antigas:

| Antes (PHP) | Depois (Worker) |
|-------------|-----------------|
| `tmdb-cache.php?path=/movie/550` | `https://webplay-proxy.TEU-USER.workers.dev/tmdb?path=/movie/550` |
| `proxy.php?url=https://superflixapi.monster/...` | `https://webplay-proxy.TEU-USER.workers.dev/proxy?url=https://superflixapi.monster/...` |
| `mega-proxy.php?acao=status&...` | `https://webplay-proxy.TEU-USER.workers.dev/mega?acao=status&...` |

### Forma rápida (recomendado)

No início do teu JavaScript principal, define uma constante:

```js
const WP_PROXY = "https://webplay-proxy.TEU-USER.workers.dev";
```

Depois substitui:

```js
// TMDB
fetch(WP_PROXY + "/tmdb?path=" + encodeURIComponent("/movie/550"))

// SuperFlix
fetch(WP_PROXY + "/proxy?url=" + encodeURIComponent("https://superflixapi.monster/lista?category=filme"))

// Mega status
fetch(WP_PROXY + "/mega?acao=status&tipo=movie&imdb=tt0137523")
```

---

## 4. GitHub + Cloudflare (opcional)

1. Cria um repositório no GitHub
2. Sobe a pasta do site (HTML, JS, CSS, imagens) — **sem** os ficheiros PHP
3. No Cloudflare → **Workers & Pages** → **Create** → **Pages** → liga o repositório
4. Build: deixa em branco (site estático)
5. O Worker continua separado (o proxy)

Assim o site fica em `https://teu-projeto.pages.dev` e o proxy em `https://webplay-proxy.teu-user.workers.dev`.

---

## 5. O que podes apagar do servidor antigo

Depois de tudo a funcionar:

- `tmdb-cache.php`
- `proxy.php`
- `mega-proxy.php`
- pastas `cache_tmdb/`, `cache_sf/`, `cache_mega/`

O resto (idioma.js, firebase, atualizacao, temas, etc.) mantém-se.

---

## Rotas do Worker (resumo)

```
GET /tmdb?path=/tv/1396
GET /tmdb?path=/tv/1396/season/1&refresh=1
GET /proxy?url=https://superflixapi.monster/lista?category=filme
GET /mega?acao=status&tipo=movie&imdb=tt0137523
GET /mega?acao=status&tipo=tv&imdb=tt0903747&sea=1&epi=1
GET /mega?acao=ping&url=https://...
```

---

## Problemas comuns

| Sintoma | Solução |
|---------|---------|
| CORS error | Confirma que o Worker devolve `Access-Control-Allow-Origin: *` (já está no código) |
| TMDB 401/429 | Adiciona mais chaves no array `TMDB_KEYS` dentro do worker.js |
| Cache não grava | Confirma o binding KV com o nome exacto `CACHE` |
| SuperFlix vazio | Testa a URL no browser: `/proxy?url=https://superflixapi.monster/lista?category=filme` |

---

Qualquer dúvida, manda a URL do teu Worker e eu ajudo a ajustar o `index.html`.
