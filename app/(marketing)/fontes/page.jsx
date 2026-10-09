import Link from 'next/link';
import { PROVEDORES, ROTULO_ESTADO, VERIFICADO_EM } from '../../_lib/provedores.js';
import { GEO_META } from '../../_lib/geo.js';
import { FRESHNESS_INFO } from '../../_domain/evidence.js';
import { SourceTrust } from '../../_ui/SourceTrust.jsx';
import { Icon } from '../../_ui/Icon.jsx';

// Fontes e metodologia (OMEGA V4 §22/§27-28/§35): de onde vem cada dado, o que é ao
// vivo e o que é referência, e o estado REAL de cada integração — sem esconder
// bloqueios externos.
export const metadata = {
  title: 'Fontes e metodologia — Mundo Sem Fim',
  description: 'De onde vem cada dado do Mundo Sem Fim: o que é ao vivo, recente, estimativa ou histórico, e o estado de cada integração.',
  alternates: { canonical: '/fontes' },
};

const COR_ESTADO = {
  LIVE_VERIFIED: 'bg-success-bg text-success border-success-bd', SANDBOX_VERIFIED: 'bg-success-bg text-success border-success-bd',
  ADAPTER_READY: 'bg-pine/10 text-pine border-pine/25', KEY_REQUIRED: 'bg-warn-bg text-warn border-warn-bd', CONTRACT_REQUIRED: 'bg-warn-bg text-warn border-warn-bd',
  RESEARCHED: 'bg-paper2 text-inksoft border-line', MOCK_ONLY: 'bg-danger-bg text-danger border-danger-bd', DEGRADED: 'bg-warn-bg text-warn border-warn-bd', DISABLED: 'bg-paper2 text-inksoft border-line', UNRESEARCHED: 'bg-paper2 text-inksoft border-line',
};

export default function FontesPage() {
  const dominios = [...new Set(PROVEDORES.map((p) => p.dominio))];
  const t = GEO_META.totais;
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-14">
      <header className="max-w-3xl">
        <div className="eyebrow mb-3">Transparência</div>
        <h1 className="font-display text-4xl sm:text-6xl tracking-tightest leading-[.98] text-ink">Fontes e metodologia</h1>
        <p className="mt-4 text-lg text-inksoft">Cada número crítico no Mundo Sem Fim diz o que é. Aqui está de onde vem cada dado e o estado real de cada integração — inclusive o que ainda depende de contrato.</p>
      </header>

      <section className="mt-12" aria-labelledby="selos-h">
        <h2 id="selos-h" className="font-display text-3xl tracking-tighter text-ink">Os selos</h2>
        <dl className="mt-5 grid gap-px bg-line border border-line rounded-2xl overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(FRESHNESS_INFO).map(([k, v]) => (
            <div key={k} className="bg-card p-5">
              <dt><SourceTrust freshness={k} compacto /></dt>
              <dd className="mt-3 text-sm text-inksoft">{v.explica}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-3" aria-label="Dados do catálogo">
        {[
          ['Catálogo de destinos', '205 países (195 ONU + 10 territórios). Custo diário de referência, melhor época, cidades e regras de visto para passaporte brasileiro compilados em jun/2026.', 'HISTORICAL'],
          ['Preços de atrações e transporte', '2.871 atrações com preço de entrada/tour em USD e preços de transporte por país, de pesquisa em jun/2026. Convertidos para BRL pela taxa de referência do dia.', 'HISTORICAL'],
          [`Coordenadas (${GEO_META.geradoEm})`, `${t.atracoesComCoord.toLocaleString('pt-BR')} de ${t.atracoesComCoord + (t.atracoes - t.atracoesComCoord)} atrações e ${t.cidadesComCoord.toLocaleString('pt-BR')} de ${t.cidades.toLocaleString('pt-BR')} cidades com coordenada da Wikipedia/Wikidata, validada por distância ao país. Pontos são a referência do lugar, não a entrada.`, 'RECENT'],
        ].map(([tit, txt, f]) => (
          <div key={tit} className="rounded-2xl border border-line bg-card p-5">
            <SourceTrust freshness={f} compacto />
            <h3 className="mt-3 font-display text-xl text-ink">{tit}</h3>
            <p className="mt-2 text-sm text-inksoft leading-relaxed">{txt}</p>
          </div>
        ))}
      </section>

      <section className="mt-14" aria-labelledby="prov-h">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="prov-h" className="font-display text-3xl tracking-tighter text-ink">Integrações e provedores</h2>
          <span className="font-mono text-xs text-inksoft">verificado em {VERIFICADO_EM}</span>
        </div>
        {dominios.map((dom) => (
          <div key={dom} className="mt-6">
            <div className="eyebrow mb-2">{dom}</div>
            <div className="rounded-2xl border border-line bg-card divide-y divide-line overflow-hidden">
              {PROVEDORES.filter((p) => p.dominio === dom).map((p) => (
                <article key={p.id} className="p-4 sm:p-5 grid gap-3 md:grid-cols-[1.2fr_1fr_1fr]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-ink">{p.nome}</h3>
                      <span className={`font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${COR_ESTADO[p.estado]}`}>{ROTULO_ESTADO[p.estado]}</span>
                    </div>
                    <p className="mt-1 text-sm text-inksoft">{p.uso}</p>
                    {p.nota && <p className="mt-1 text-xs text-ink">{p.nota}</p>}
                  </div>
                  <dl className="text-xs space-y-1">
                    <div><dt className="inline text-inksoft">Acesso: </dt><dd className="inline text-ink">{p.auth} · {p.onde}</dd></div>
                    <div><dt className="inline text-inksoft">Limite: </dt><dd className="inline text-ink">{p.limite}</dd></div>
                    <div><dt className="inline text-inksoft">Custo: </dt><dd className="inline text-ink">{p.custo}</dd></div>
                  </dl>
                  <dl className="text-xs space-y-1">
                    <div><dt className="inline text-inksoft">Se falhar: </dt><dd className="inline text-ink">{p.fallback}</dd></div>
                    <div><dt className="inline text-inksoft">Atribuição: </dt><dd className="inline text-ink">{p.atribuicao}</dd></div>
                    {p.termos && p.termos.startsWith('http') && <div><a href={p.termos} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-pine hover:underline focusring">Termos <Icon name="external" size={12} /></a></div>}
                  </dl>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-14 rounded-2xl border border-line bg-card p-6" aria-labelledby="regras-h">
        <h2 id="regras-h" className="font-display text-2xl text-ink">Regras que seguimos</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-inksoft">
          <li className="flex gap-2"><Icon name="check" size={16} className="text-pine mt-0.5" />Nada é chamado de “ao vivo” sem ter sido consultado agora — e o selo envelhece sozinho.</li>
          <li className="flex gap-2"><Icon name="check" size={16} className="text-pine mt-0.5" />Comissão de parceiro nunca muda o ranking (há teste automatizado que garante isso).</li>
          <li className="flex gap-2"><Icon name="check" size={16} className="text-pine mt-0.5" />Sem regra de visto verificada, dizemos “consultar” — nunca “isento” por padrão.</li>
          <li className="flex gap-2"><Icon name="check" size={16} className="text-pine mt-0.5" />Foto que não é do lugar exato aparece marcada como ilustrativa.</li>
          <li className="flex gap-2"><Icon name="check" size={16} className="text-pine mt-0.5" />Reserva só fica “confirmada pelo fornecedor” com integração; importada por você fica rotulada.</li>
          <li className="flex gap-2"><Icon name="check" size={16} className="text-pine mt-0.5" />Voos sem provedor contratado aparecem como cenários estimados, sem nomes de companhias.</li>
        </ul>
        <p className="mt-5 text-sm text-inksoft">Achou um dado errado? <Link href="/conta" className="text-pine hover:underline">Fale com a gente pela sua conta</Link>.</p>
      </section>
    </main>
  );
}
