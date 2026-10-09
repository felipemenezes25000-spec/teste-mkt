// Serviço de mídia (OMEGA V4 §11-13) — SOMENTE servidor.
// Resolve arquivos do Wikimedia Commons em ImageAsset: URL de thumbnail em largura
// PADRÃO que existe de verdade (≤ largura do original → nunca 400/429), dimensões,
// autor, licença, link da página e status de direitos. Lotes de 50 títulos por
// requisição, cache de 7 dias, timeout e degradação segura (null = fallback honesto).
import crypto from 'node:crypto';
import { LARGURAS_PADRAO, arquivoWikimedia } from './wikiThumb.js';

const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'MundoSemFim/0.2 (https://github.com/felipemenezes25000-spec/teste-mkt; planejador de viagem)';
const SEMANA = 7 * 86400;

/**
 * @typedef {{ id: string, provider: 'wikimedia-commons', providerAssetId: string, url: string,
 *   width: number, height: number, originalWidth: number, mimeType?: string,
 *   attribution: string|null, photographer: string|null, license: string|null, licenseUrl: string|null,
 *   pageUrl: string, rightsStatus: 'VERIFIED'|'PENDING'|'RESTRICTED', fetchedAt: string }} ImageAsset
 */

const limpaHtml = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/\s+/g, ' ').trim();

/** Largura padrão segura: a menor ≥ desejada que caiba no original; senão a maior que caiba. */
export function larguraSegura(desejada, original) {
  const cabem = LARGURAS_PADRAO.filter((l) => l <= original);
  if (!cabem.length) return null; // original menor que 120 px: usar o próprio original
  return cabem.find((l) => l >= desejada) || cabem[cabem.length - 1];
}

/** URL de thumbnail do Commons (caminho por md5 do nome, regra do MediaWiki). */
export function urlThumbCommons(arquivo, largura) {
  const nome = arquivo.replace(/ /g, '_');
  const h = crypto.createHash('md5').update(nome).digest('hex');
  const enc = encodeURIComponent(nome).replace(/%2C/g, ',').replace(/%28/g, '(').replace(/%29/g, ')');
  const ext = /\.(svg|tiff?|pdf|djvu|webm|ogv)$/i.test(nome) ? '.png' : '';
  const sufixo = /\.(tiff?)$/i.test(nome) ? `lossy-page1-${largura}px-${enc}.jpg` : `${largura}px-${enc}${ext}`;
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${h[0]}/${h.slice(0, 2)}/${enc}/${sufixo}`;
}

const LICENCAS_OK = /^(CC0|CC BY|CC BY-SA|Public domain|PD|GFDL|Attribution|FAL)/i;

function paraAsset(p, larguraDesejada) {
  const ii = p.imageinfo && p.imageinfo[0];
  if (!ii || p.missing) return null;
  const meta = ii.extmetadata || {};
  const arquivo = p.title.replace(/^File:/, '').replace(/ /g, '_');
  const w = larguraSegura(larguraDesejada, ii.width);
  const url = w ? urlThumbCommons(arquivo, w) : ii.url;
  const altura = w ? Math.round((ii.height * w) / ii.width) : ii.height;
  const licenca = limpaHtml(meta.LicenseShortName && meta.LicenseShortName.value) || null;
  const autor = limpaHtml(meta.Artist && meta.Artist.value).slice(0, 160) || null;
  // srcset em larguras padrão que cabem no original (o browser escolhe pelo viewport)
  const srcSet = LARGURAS_PADRAO.filter((l) => l <= ii.width && l >= 330 && l <= 1920).map((l) => `${urlThumbCommons(arquivo, l)} ${l}w`).join(', ') || undefined;
  return {
    id: `commons:${arquivo}`,
    srcSet,
    provider: 'wikimedia-commons',
    providerAssetId: arquivo,
    url,
    width: w || ii.width,
    height: altura,
    originalWidth: ii.width,
    mimeType: ii.mime,
    attribution: autor ? `${autor}${licenca ? ` · ${licenca}` : ''}` : licenca,
    photographer: autor,
    license: licenca,
    licenseUrl: (meta.LicenseUrl && meta.LicenseUrl.value) || null,
    pageUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(arquivo)}`,
    rightsStatus: licenca && LICENCAS_OK.test(licenca) ? 'VERIFIED' : licenca ? 'RESTRICTED' : 'PENDING',
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Resolve vários arquivos/URLs do Commons. Retorna Map(arquivoNormalizado → ImageAsset|null).
 * @param {string[]} entradas nomes de arquivo ("Foo.jpg") ou URLs do Wikimedia
 * @param {{ largura?: number, revalidate?: number }} [opts]
 */
export async function resolverImagens(entradas, { largura = 960, revalidate = SEMANA } = {}) {
  const arquivos = [...new Set(entradas.map((e) => (/^https?:/.test(e || '') ? arquivoWikimedia(e) : (e || '').replace(/ /g, '_'))).filter(Boolean))];
  const out = new Map();
  for (let i = 0; i < arquivos.length; i += 50) {
    const lote = arquivos.slice(i, i + 50);
    const params = new URLSearchParams({
      action: 'query', format: 'json', formatversion: '2', prop: 'imageinfo',
      iiprop: 'url|size|mime|extmetadata', iiextmetadatafilter: 'Artist|LicenseShortName|LicenseUrl',
      titles: lote.map((a) => 'File:' + a).join('|'), origin: '*',
    });
    try {
      const r = await fetch(`${API}?${params}`, {
        headers: { 'user-agent': UA, accept: 'application/json' },
        next: { revalidate }, signal: AbortSignal.timeout(9000),
      });
      if (!r.ok) throw new Error(String(r.status));
      const d = await r.json();
      const norm = new Map(((d.query && d.query.normalized) || []).map((n) => [n.to.replace(/^File:/, '').replace(/ /g, '_'), n.from.replace(/^File:/, '').replace(/ /g, '_')]));
      for (const p of (d.query && d.query.pages) || []) {
        const chave = p.title.replace(/^File:/, '').replace(/ /g, '_');
        const asset = paraAsset(p, largura);
        out.set(chave, asset);
        if (norm.has(chave)) out.set(norm.get(chave), asset);
      }
    } catch {
      for (const a of lote) if (!out.has(a)) out.set(a, null);
    }
  }
  return out;
}

/** Atalho para um único arquivo/URL. */
export async function resolverImagem(entrada, opts) {
  if (!entrada) return null;
  const m = await resolverImagens([entrada], opts);
  const chave = /^https?:/.test(entrada) ? arquivoWikimedia(entrada) : entrada.replace(/ /g, '_');
  return (chave && m.get(chave)) || null;
}
