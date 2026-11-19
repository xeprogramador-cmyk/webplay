/**
 * WebPlay — Cloudflare Worker
 * Substitui: tmdb-cache.php + proxy.php + mega-proxy.php
 *
 * Rotas:
 *   /tmdb?path=/movie/550
 *   /tmdb?path=/tv/1396/season/1
 *   /tmdb?path=/search/movie?query=matrix
 *   /proxy?url=https://superflixapi.monster/lista?category=filme
 *   /mega?acao=status&tipo=movie&imdb=tt0137523
 *   /mega?acao=status&tipo=tv&imdb=tt0903747&sea=1&epi=1
 *   /mega?acao=ping&url=...
 *
 * Deploy: wrangler deploy  (ou painel Cloudflare → Workers)
 */

const TMDB_KEYS = [
  "1acb1965653f5c352ae66fdab15f5a09",
  "2eb588cabfd607f4abfa001a72e65fcb",
];

const SUPERFLIX_ALLOWED = ["superflixapi.monster"];
const MEGA_BASE = "https://megaembedapi.site";

const TTL = {
  season: 30 * 60,         // 30 min — episódios mudam
  search: 6 * 60 * 60,     // 6 h — pesquisas iguais partilham cache entre utilizadores
  details: 24 * 60 * 60,   // 24 h — capas/sinopses quase não mudam
  discover: 3 * 60 * 60,   // 3 h — listas "mais recentes"
  default: 6 * 60 * 60,    // 6 h
  lista: 60 * 60,          // 1 h — SuperFlix /lista (filmes, séries, animes, doramas)
  megaExiste: 12 * 60 * 60,
  megaNao: 1 * 60 * 60,
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    try {
      if (path === "/tmdb" || path.startsWith("/tmdb/")) {
        return await handleTmdb(url, env, ctx);
      }
      if (path === "/proxy" || path.startsWith("/proxy/")) {
        return await handleProxy(url, env, ctx);
      }
      if (path === "/mega" || path.startsWith("/mega/")) {
        return await handleMega(url, env, ctx);
      }
      return json({ ok: true, service: "webplay-proxy", routes: ["/tmdb", "/proxy", "/mega"] });
    } catch (err) {
      return json({ erro: String(err && err.message ? err.message : err) }, 500);
    }
  },
};

/* ===================== TMDB ===================== */

function tmdbTtl(path) {
  if (/\/season\/\d+/.test(path) || /\/episode\/\d+/.test(path)) return TTL.season;
  if (path.includes("/search/")) return TTL.search;
  if (path.includes("/discover/")) return TTL.discover;
  if (/^\/(movie|tv)\/\d+/.test(path)) return TTL.details;
  return TTL.default;
}

/** Normaliza path de pesquisa para o mesmo cache servir "Matrix" e "matrix". */
function normalizeCachePath(path) {
  try {
    if (!path.includes("/search/")) return path;
    const i = path.indexOf("?");
    if (i < 0) return path;
    const base = path.slice(0, i);
    const qs = new URLSearchParams(path.slice(i + 1));
    if (qs.has("query")) qs.set("query", String(qs.get("query") || "").trim().toLowerCase());
    const ordered = [];
    [...qs.keys()].sort().forEach((k) => ordered.push(k + "=" + qs.get(k)));
    return base + "?" + ordered.join("&");
  } catch (e) {
    return path;
  }
}

async function handleTmdb(url, env, ctx) {
  let path = (url.searchParams.get("path") || "").trim();
  if (!path || path[0] !== "/") {
    return json({ erro: 'Parâmetro "path" em falta ou inválido (deve começar com /).' }, 400);
  }
  if (path.includes("..") || path.length > 500) {
    return json({ erro: "Path não permitido." }, 400);
  }

  const refresh = url.searchParams.get("refresh") === "1";
  const pathNorm = normalizeCachePath(path);
  const cacheKey = "tmdb:" + pathNorm;
  const ttl = tmdbTtl(path);

  if (!refresh && env.CACHE) {
    const cached = await env.CACHE.get(cacheKey);
    if (cached) {
      return new Response(cached, {
        headers: {
          ...CORS,
          "Content-Type": "application/json; charset=utf-8",
          "X-Cache": "HIT",
          "Cache-Control": `public, max-age=${ttl}`,
        },
      });
    }
  }

  let lastError = null;
  for (const key of TMDB_KEYS) {
    const sep = path.includes("?") ? "&" : "?";
    const apiUrl = `https://api.themoviedb.org/3${path}${sep}api_key=${encodeURIComponent(key)}&language=pt-BR`;
    try {
      const res = await fetch(apiUrl, {
        headers: { Accept: "application/json", "User-Agent": "WebPlayCache/1.0" },
      });
      const body = await res.text();
      if (res.ok) {
        if (env.CACHE) {
          ctx.waitUntil(env.CACHE.put(cacheKey, body, { expirationTtl: ttl }));
        }
        return new Response(body, {
          headers: {
            ...CORS,
            "Content-Type": "application/json; charset=utf-8",
            "X-Cache": "MISS",
            "Cache-Control": `public, max-age=${ttl}`,
          },
        });
      }
      lastError = `HTTP ${res.status}`;
      if (res.status === 429 || res.status === 401) continue;
      return json({ erro: `TMDB ${res.status}`, detalhe: body.slice(0, 200) }, res.status);
    } catch (e) {
      lastError = String(e);
    }
  }
  return json({ erro: "Todas as chaves TMDB falharam", detalhe: lastError }, 502);
}

/* ===================== SuperFlix proxy ===================== */

async function handleProxy(url, env, ctx) {
  const target = (url.searchParams.get("url") || "").trim();
  if (!target) return json({ erro: 'Parâmetro "url" em falta.' }, 400);

  let parsed;
  try {
    parsed = new URL(target);
  } catch {
    return json({ erro: "URL inválida." }, 400);
  }

  const host = parsed.hostname.toLowerCase();
  const allowed = SUPERFLIX_ALLOWED.some(
    (d) => host === d || host.endsWith("." + d)
  );
  if (!allowed || !["http:", "https:"].includes(parsed.protocol)) {
    return json({ erro: "Domínio não permitido neste proxy." }, 403);
  }

  const isLista = parsed.pathname.includes("/lista");
  const refresh = url.searchParams.get("refresh") === "1";
  const cacheKey = "sf:" + target;

  if (isLista && !refresh && env.CACHE) {
    const cached = await env.CACHE.get(cacheKey);
    if (cached) {
      return new Response(cached, {
        headers: {
          ...CORS,
          "Content-Type": "application/json; charset=utf-8",
          "X-Cache": "HIT",
        },
      });
    }
  }

  const res = await fetch(target, {
    headers: {
      Accept: "application/json, text/html;q=0.8, */*;q=0.5",
      "User-Agent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36",
    },
  });
  const body = await res.text();

  if (isLista && res.ok && env.CACHE) {
    ctx.waitUntil(env.CACHE.put(cacheKey, body, { expirationTtl: TTL.lista }));
  }

  return new Response(body, {
    status: res.status,
    headers: {
      ...CORS,
      "Content-Type": res.headers.get("Content-Type") || "application/json; charset=utf-8",
      "X-Cache": "MISS",
    },
  });
}

/* ===================== MegaEmbed ===================== */

async function handleMega(url, env, ctx) {
  const acao = url.searchParams.get("acao") || "";

  if (acao === "status") {
    const tipo = url.searchParams.get("tipo") || "movie";
    const imdb = (url.searchParams.get("imdb") || "").trim();
    const sea = url.searchParams.get("sea") || "";
    const epi = url.searchParams.get("epi") || "";

    if (!imdb) return json({ erro: "imdb em falta" }, 400);

    let apiPath;
    if (tipo === "tv" || tipo === "serie") {
      apiPath = `/status/tv?imdb=${encodeURIComponent(imdb)}&sea=${encodeURIComponent(sea)}&epi=${encodeURIComponent(epi)}`;
    } else {
      apiPath = `/status/movie?imdb=${encodeURIComponent(imdb)}`;
    }

    const cacheKey = "mega:" + apiPath;
    if (env.CACHE) {
      const cached = await env.CACHE.get(cacheKey);
      if (cached) {
        return new Response(cached, {
          headers: { ...CORS, "Content-Type": "application/json; charset=utf-8", "X-Cache": "HIT" },
        });
      }
    }

    const res = await fetch(MEGA_BASE + apiPath, {
      headers: { Accept: "application/json", "User-Agent": "WebPlayMega/1.0" },
    });
    const body = await res.text();
    let existe = false;
    try {
      const j = JSON.parse(body);
      existe = !!(j && (j.status === "ok" || j.exists || j.available));
    } catch {}

    if (env.CACHE) {
      const ttl = existe ? TTL.megaExiste : TTL.megaNao;
      ctx.waitUntil(env.CACHE.put(cacheKey, body, { expirationTtl: ttl }));
    }

    return new Response(body, {
      status: res.status,
      headers: { ...CORS, "Content-Type": "application/json; charset=utf-8", "X-Cache": "MISS" },
    });
  }

  if (acao === "ping") {
    const target = (url.searchParams.get("url") || "").trim();
    if (!target) return json({ erro: "url em falta" }, 400);
    try {
      const res = await fetch(target, {
        method: "GET",
        redirect: "follow",
        headers: { "User-Agent": "Mozilla/5.0 WebPlayPing/1.0" },
      });
      return json({
        status: res.status,
        xFrame: res.headers.get("x-frame-options"),
        csp: res.headers.get("content-security-policy"),
      });
    } catch (e) {
      return json({ erro: String(e) }, 502);
    }
  }

  return json({ erro: 'Ação inválida. Use acao=status ou acao=ping' }, 400);
}

/* ===================== helpers ===================== */

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" },
  });
}
