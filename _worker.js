// REELS — Cloudflare Pages "_worker.js" (arquivo solto na RAIZ do site, ao lado do index.html; sem pasta).
// Acrescenta UMA linha (o reels-loader.js) ao HTML antes de </body>. O index.html nunca é editado.
// Para desligar os Reels: apague este arquivo (_worker.js).
export default {
  async fetch(request, env) {
    const resp = await env.ASSETS.fetch(request);
    const tipo = resp.headers.get("content-type") || "";
    if (!tipo.includes("text/html")) return resp;
    const url = new URL(request.url);
    // só nas páginas principais (não dentro do próprio reels.html nem do criador/ADM)
    if (/reels\.html|criador|admin/i.test(url.pathname)) return resp;
    return new HTMLRewriter()
      .on("body", { element(el) { el.append('<script src="/reels-loader.js"></script>', { html: true }); } })
      .transform(resp);
  }
};
