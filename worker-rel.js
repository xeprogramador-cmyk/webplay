// REELS — worker-rel.js (nome diferente para NÃO substituir o teu _worker.js que já existe na raiz).
// Acrescenta UMA linha (o reels-loader.js) ao HTML antes de </body>. O index.html nunca é editado.
//
// COMO LIGAR (o Cloudflare Pages só executa o arquivo chamado _worker.js, por isso este se liga a ele):
//   No TEU _worker.js, no topo:
//       import { comReels } from "./worker-rel.js";
//   e onde ele devolve a resposta do site (resp), troca  return resp;  por:
//       return comReels(request, resp);
//
// Para desligar os Reels: tira essa chamada (ou apaga este arquivo e o import).
export function comReels(request, resp) {
  const tipo = resp.headers.get("content-type") || "";
  if (!tipo.includes("text/html")) return resp;
  const url = new URL(request.url);
  // não dentro do próprio Reels, do criador nem do admin
  if (/reels|criador|admin/i.test(url.pathname)) return resp;
  return new HTMLRewriter()
    .on("body", { element(el) { el.append('<script src="/reels-loader.js"></script>', { html: true }); } })
    .transform(resp);
}
export default { async fetch(request, env) { return comReels(request, await env.ASSETS.fetch(request)); } };
