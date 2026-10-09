'use client';
import { useCambioBRL } from '../_lib/cambioClient.js';
import { useIdioma } from '../_lib/i18n.js';
import { Icon } from '../_ui/Icon.jsx';

// Bloco "Como se locomove" — tabela de preços REAIS de transporte do país:
// Uber/app, táxi, ônibus urbano, metrô, aluguel de carro, combustível e voo
// doméstico. Valores em USD (pesquisa) convertidos pra BRL ao vivo (cambioClient).
//
// `precos` vem como PROP do Server Component (página de destino) — a tabela
// mundial (precosTransporte.js) fica no bundle do servidor; só a fatia do país
// é serializada no HTML.
//
// Cada linha só renderiza se o serviço existe no país (null = oculto). A nota (obs)
// dá o contexto que o número sozinho não dá (qual app domina, se tem metrô, etc).

const LABELS = {
  pt: {
    titulo: 'Como se locomove', sub: 'Preços médios de referência. O número sozinho engana — leia a nota.',
    uberKm: 'App (Uber/Bolt/Grab)', taxiKm: 'Táxi', onibusUrb: 'Ônibus urbano', metroUrb: 'Metrô',
    aluguelDia: 'Aluguel de carro', combustivelL: 'Gasolina', voo: 'Voo doméstico',
    porKm: '/km', porDia: '/dia', porL: '/litro', porViagem: '/viagem', estimativa: 'voo médio capital 2ª cidade',
    nota: 'Estimativas de mercado (2025-2026) — confirme no local. Conversão pelo câmbio atual.',
  },
  en: {
    titulo: 'Getting around', sub: 'Average reference prices. The number alone misleads — read the note.',
    uberKm: 'App (Uber/Bolt/Grab)', taxiKm: 'Taxi', onibusUrb: 'City bus', metroUrb: 'Metro',
    aluguelDia: 'Car rental', combustivelL: 'Gasoline', voo: 'Domestic flight',
    porKm: '/km', porDia: '/day', porL: '/liter', porViagem: '/ride', estimativa: 'avg flight capital 2nd city',
    nota: 'Market estimates (2025-2026) — confirm locally. Converted at current exchange rate.',
  },
  es: {
    titulo: 'Cómo moverse', sub: 'Precios medios de referencia. El número solo engaña — lee la nota.',
    uberKm: 'App (Uber/Bolt/Grab)', taxiKm: 'Taxi', onibusUrb: 'Autobús urbano', metroUrb: 'Metro',
    aluguelDia: 'Alquiler de coche', combustivelL: 'Gasolina', voo: 'Vuelo doméstico',
    porKm: '/km', porDia: '/día', porL: '/litro', porViagem: '/viaje', estimativa: 'vuelo medio capital 2ª ciudad',
    nota: 'Estimaciones de mercado (2025-2026) — confirma en el lugar. Convertido al cambio actual.',
  },
  ja: {
    titulo: '移動手段', sub: '平均参考価格。数字だけでは誤解する — 注記を読んでください。',
    uberKm: 'アプリ (Uber/Bolt/Grab)', taxiKm: 'タクシー', onibusUrb: '市バス', metroUrb: '地下鉄',
    aluguelDia: 'レンタカー', combustivelL: 'ガソリン', voo: '国内線',
    porKm: '/km', porDia: '/日', porL: '/リットル', porViagem: '/乗車', estimativa: '首都第2都市の平均運賃',
    nota: '市場推定 (2025-2026) — 現地で確認を。現在の為替レートで換算。',
  },
};

function fmt(usd, brl) {
  if (usd === null || usd === undefined) return null;
  const r = Math.round(usd * brl * 100) / 100;
  const rStr = r >= 100 ? `R$ ${Math.round(r).toLocaleString('pt-BR')}` : `R$ ${r.toFixed(2).replace('.', ',')}`;
  const uStr = usd >= 100 ? `US$ ${Math.round(usd)}` : `US$ ${usd.toFixed(2)}`;
  return { rStr, uStr };
}

export function ComoSeLocomove({ precos = null }) {
  const p = precos;
  const cambio = useCambioBRL();
  const { idioma } = useIdioma();
  const L = LABELS[idioma] || LABELS.pt;
  if (!p) return null;

  const linhas = [
    { k: 'uberKm', icon: '🚗', valor: p.uberKm, unidade: L.porKm },
    { k: 'taxiKm', icon: '🚕', valor: p.taxiKm, unidade: L.porKm },
    { k: 'onibusUrb', icon: '🚌', valor: p.onibusUrb, unidade: L.porViagem },
    { k: 'metroUrb', icon: '🚇', valor: p.metroUrb, unidade: L.porViagem },
    { k: 'aluguelDia', icon: '🔑', valor: p.aluguelDia, unidade: L.porDia },
    { k: 'combustivelL', icon: '⛽', valor: p.combustivelL, unidade: L.porL },
    { k: 'voo', icon: '✈️', valor: p.voo, unidade: '', extra: L.estimativa },
  ].filter((l) => l.valor !== null && l.valor !== undefined);

  return (
    <section aria-labelledby="como-locomove-titulo">
      <h2 id="como-locomove-titulo" className="font-display text-2xl text-ink mb-1"><Icon emoji="🚐" /> {L.titulo}</h2>
      <p className="text-sm text-inksoft mb-4 max-w-2xl">{L.sub}</p>
      <div className="rounded-3xl border border-line bg-card overflow-hidden shadow-[var(--e-1)]">
        <ul className="divide-y divide-line">
          {linhas.map((l) => {
            const f = fmt(l.valor, cambio.brl);
            if (!f) return null;
            return (
              <li key={l.k} className="flex items-center gap-3 px-4 sm:px-5 py-3">
                <span aria-hidden className="text-xl shrink-0"><Icon emoji={l.icon} /></span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-ink">{L[l.k]}</div>
                  {l.extra && <div className="text-[11px] text-inksoft">{l.extra}</div>}
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-ink tnum">{f.rStr}<span className="text-[11px] text-inksoft font-normal">{l.unidade}</span></div>
                  <div className="text-[11px] text-inksoft tnum">{f.uStr}</div>
                </div>
              </li>
            );
          })}
        </ul>
        {p.obs && (
          <div className="px-4 sm:px-5 py-3 border-t border-line bg-paper2/50 text-xs text-inksoft">
            <Icon emoji="💡" /> {p.obs}
          </div>
        )}
      </div>
      <p className="mt-2 text-[11px] text-inksoft">{L.nota}</p>
    </section>
  );
}
