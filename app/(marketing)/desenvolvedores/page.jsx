import { OPENAPI } from '../../_lib/plataforma/openapi.js';
import { T } from '../../_components/T.jsx';
import { Icon } from '../../_ui/Icon.jsx';
import { TestarApi } from './TestarApi.jsx';
import { ChavesApi } from './ChavesApi.jsx';

export const metadata = {
  title: 'API pública para desenvolvedores — Mundo Sem Fim',
  description: 'API REST somente leitura com 205 destinos: custo de referência, melhor época e visto para passaporte brasileiro. OpenAPI 3.1, CORS aberto, 30 req/min sem chave e 600 com chave.',
  alternates: { canonical: '/desenvolvedores' },
};

export default function DesenvolvedoresPage() {
  const rotas = Object.entries(OPENAPI.paths).map(([path, ops]) => ({ path, ...ops.get }));
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-12">
      <header className="mb-8 max-w-3xl">
        <div className="eyebrow mb-3"><T k="plat.devEy" fallback="API pública · v1" /></div>
        <h1 className="font-display text-4xl sm:text-6xl tracking-tightest leading-[.98] text-ink"><T k="plat.devH" fallback="Os dados do Mundo Sem Fim no seu produto." /></h1>
        <p className="mt-4 text-lg text-inksoft"><T k="plat.devP" fallback="REST somente leitura, JSON, CORS aberto. Cada resposta diz de onde veio o dado e quão fresco ele é — custo de referência não é cotação." /></p>
        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          <a href="/api/v1/openapi.json" className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-line bg-card text-ink font-medium focusring"><Icon name="download" size={16} /> openapi.json</a>
          <span className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-paper2 text-inksoft"><Icon name="key" size={16} /> <T k="plat.devLimites" fallback="Sem chave: 30/min · Com chave: 600/min" /></span>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_420px] gap-6 items-start">
        <section aria-labelledby="endpoints-h" className="space-y-4">
          <h2 id="endpoints-h" className="font-display text-2xl text-ink"><T k="plat.endpoints" fallback="Endpoints" /></h2>
          {rotas.map((r) => (
            <article key={r.path} className="rounded-2xl border border-line bg-card p-5">
              <p className="font-mono text-sm"><span className="rounded bg-pine/10 text-pine px-1.5 py-0.5 mr-2">GET</span><span className="text-ink">/api/v1{r.path}</span></p>
              <p className="mt-2 text-sm text-ink">{r.summary}</p>
              {r.parameters && r.parameters.length > 0 && (
                <table className="mt-3 w-full text-sm">
                  <thead><tr className="text-left text-xs text-inksoft"><th className="py-1 pr-3 font-medium"><T k="plat.param" fallback="Parâmetro" /></th><th className="py-1 pr-3 font-medium"><T k="plat.tipo" fallback="Tipo" /></th><th className="py-1 font-medium"><T k="plat.descricao" fallback="Descrição" /></th></tr></thead>
                  <tbody className="divide-y divide-line">
                    {r.parameters.map((p) => (
                      <tr key={p.name}>
                        <td className="py-1.5 pr-3 font-mono text-ink">{p.name}{p.required ? ' *' : ''}</td>
                        <td className="py-1.5 pr-3 font-mono text-inksoft">{p.schema.enum ? p.schema.enum.join(' | ') : p.schema.type}</td>
                        <td className="py-1.5 text-inksoft">{p.description || (p.example ? `ex.: ${p.example}` : '—')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </article>
          ))}
          <article className="rounded-2xl border border-line bg-card p-5 text-sm text-inksoft space-y-2">
            <h3 className="font-semibold text-ink"><T k="plat.regras" fallback="Regras de uso" /></h3>
            <p><T k="plat.regra1" fallback="Autenticação opcional pelo header x-api-key. Respostas trazem x-ratelimit-limit e x-ratelimit-remaining; ao estourar, 429 com Retry-After." /></p>
            <p><T k="plat.regra2" fallback="Atribuição obrigatória (“Dados: Mundo Sem Fim”) e link para a página do destino. Proibido revender o catálogo bruto." /></p>
            <p><T k="plat.regra3" fallback="Visto é referência para passaporte brasileiro — sempre oriente o usuário a confirmar no consulado." /></p>
          </article>
        </section>
        <aside className="space-y-4 lg:sticky lg:top-24">
          <TestarApi />
          <ChavesApi />
        </aside>
      </div>
    </main>
  );
}
