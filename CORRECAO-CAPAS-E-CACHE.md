# WebPlay — Correção das capas (séries / animes / doramas) + cache

## O que estava a falhar

As listas da SuperFlixAPI (`/lista?category=serie|anime|dorama|filme`) eram pedidas **direto do navegador**.

- O navegador bloqueia isso por **CORS**.
- O código tentava proxies públicos de terceiros (instáveis).
- O **proxy do Cloudflare Worker** já existia (`OWN_PROXY`), mas **não era usado**.

Resultado: filmes às vezes apareciam (cache antigo ou um proxy público que respondia), mas **séries, animes e doramas ficavam sem capas / vazios**.

A pesquisa também sofria: sem lista de IDs da SuperFlix, o cruzamento “TMDB × catálogo disponível” falhava e a busca demorava ou vinha incompleta.

---

## O que foi corrigido

### 1. `index.html` — `fetchJSON`

Ordem dos pedidos à SuperFlixAPI:

1. **Cloudflare Worker** (`/proxy?url=...`) — principal, sem CORS  
2. Pedido direto (só se a API permitir)  
3. Proxies públicos (reserva)  
4. **Cache local** (mesmo antigo) — para o catálogo não ficar em branco  

Timeout aumentado para 12 s.

### 2. Cache no telemóvel / navegador (`index.html`)

| Tipo | Tempo |
|------|--------|
| Detalhes (capa, sinopse) | 7 dias |
| Pesquisa por nome | 12 horas |
| Listas SuperFlix | 1 hora |
| Temporadas / episódios | 30 min (backup; episódios vão sempre à rede) |

Se o utilizador (ou outro no mesmo aparelho) já pesquisou o mesmo título, a resposta sai do cache — **mais rápido e menos quota da TMDB**.

### 3. `worker.js` — cache no Cloudflare (partilhado entre todos os utilizadores)

| Tipo | TTL no Worker |
|------|----------------|
| Pesquisa `/search/...` | 6 horas (query normalizada em minúsculas) |
| Detalhes `/movie/ID`, `/tv/ID` | 24 horas |
| Discover (plano B das listas) | 3 horas |
| Lista SuperFlix `/lista` | 1 hora |
| Temporadas | 30 min |

**Importante:** com **KV** ligado no Worker, o 1.º utilizador que pesquisa “Breaking Bad” grava no cache; o 2.º, o 3.º, etc. **recebem HIT** sem gastar quota da TMDB de novo.

---

## O que tens de fazer (obrigatório)

### A) Atualizar o Worker no Cloudflare

1. Abre [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages**  
2. Abre o Worker `shrill-wildflower-8161` (ou o teu)  
3. Cola o conteúdo **novo** de `worker.js`  
4. **Deploy**

### B) (Recomendado) Ativar KV — cache partilhado

Sem KV o Worker funciona, mas cada visita pode ir de novo à TMDB.

1. Cloudflare → **Workers & Pages** → **KV** → **Create a namespace** → nome `webplay-cache`  
2. No Worker → **Settings** → **Variables** → **KV Namespace Bindings**  
3. Variable name: `CACHE` | Namespace: o que criaste  
4. Deploy de novo  

### C) Subir o site

Sobe **todos** os ficheiros desta pasta **na mesma pasta raiz** (sem subpastas):

- `index.html` (já com a correção do proxy)
- `worker.js` (código do Worker — só para colares no Cloudflare)
- `idioma.js`, `traducao-google.js`, `firebase-config.js`, …
- imagens, `atualizacao.js`, etc.

Confirma no `index.html` que esta linha aponta para o **teu** Worker:

```js
const WP_PROXY = "https://shrill-wildflower-8161.xeprogramador.workers.dev";
```

---

## Como testar

1. Abre o site (Ctrl+F5 para limpar cache antigo do browser).  
2. Aba **Séries**, **Animes**, **Doramas** — as capas devem aparecer.  
3. Pesquisa um título — deve ser rápida na 2.ª vez.  
4. No DevTools (F12) → Rede, procura pedidos a:
   - `...workers.dev/tmdb?path=...`
   - `...workers.dev/proxy?url=...superflixapi...`
5. Se tiveres KV: o 2.º pedido igual deve vir com cabeçalho `X-Cache: HIT`.

---

## Pesquisa rápida (resumo)

- A pesquisa usa a TMDB (`/search/movie` + `/search/tv`) **via Worker** (com cache de 6 h no servidor e 12 h no aparelho).  
- Só mostra o que a SuperFlixAPI listou (IDs disponíveis) — por isso o proxy das listas **tem** de funcionar (já corrigido).  
- Pedidos em paralelo limitados (fila) para não levar 429 da TMDB.

---

## Ficheiros que podes apagar no servidor antigo

- `tmdb-cache.php`, `proxy.php`, `mega-proxy.php`  
- pastas `cache_tmdb/`, `cache_sf/`, `cache_mega/`  

Tudo isso foi substituído pelo Worker.

---

## Se ainda falhar

| Sintoma | O que verificar |
|---------|------------------|
| Continua sem capas em séries | O `index.html` novo foi mesmo enviado? Worker com o `worker.js` novo? |
| CORS no console | Os pedidos têm de ir para `workers.dev/proxy` e `workers.dev/tmdb`, não para `superflixapi.monster` direto |
| TMDB 401/429 | Adiciona outra chave em `TMDB_KEYS` no `worker.js` e faz Deploy |
| Cache não partilha entre utilizadores | Binding KV com o nome exacto `CACHE` |

Qualquer dúvida: manda a URL do site e do Worker.
