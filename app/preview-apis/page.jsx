/* PRÉVIA (mockup) — como o Mundo Sem Fim fica com as APIs conectadas.
   Rota isolada, fora de produção, REMOVÍVEL. Reusa o design system real
   (tokens.css + Fraunces/Hanken + padrão TOM_UI). Dados são ILUSTRATIVOS. */

export const metadata = { robots: { index: false } };

function LiveBadge({ children, tone = 'live' }) {
  const map = {
    live: 'bg-success-bg text-success border-success-bd',
    money: 'bg-solar/25 text-amberx border-solar/50',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${map[tone]}`}>
      {tone === 'live' && <span className="w-2 h-2 rounded-full bg-success" />}
      {children}
    </span>
  );
}

function SecaoHeader({ rota, titulo, sub, badge }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-inksoft">{rota}</div>
        <h2 className="font-display text-2xl sm:text-3xl text-ink mt-0.5">{titulo}</h2>
        {sub && <p className="text-sm text-inksoft mt-1">{sub}</p>}
      </div>
      {badge}
    </div>
  );
}

/* ---------- TELA 1: VOOS (Aviasales/Kiwi via Travelpayouts) ---------- */
const TENDENCIA = [
  { m: 'Jan', v: 72 }, { m: 'Fev', v: 64 }, { m: 'Mar', v: 58 }, { m: 'Abr', v: 49 },
  { m: 'Mai', v: 40, best: true }, { m: 'Jun', v: 55 }, { m: 'Jul', v: 88 }, { m: 'Ago', v: 92 },
  { m: 'Set', v: 61 }, { m: 'Out', v: 53 }, { m: 'Nov', v: 57 }, { m: 'Dez', v: 95 },
];

const VOOS = [
  { companhia: 'Qatar Airways', partida: '01:35', chegada: '18:20', duracao: '22h 45m', escalas: '1 escala (DOH)', preco: 510, pct: 38, score: 82, tom: 'bom', destaque: true, nota: 'Melhor custo-benefício: chega de tarde e escala curta em Doha.' },
  { companhia: 'LATAM', partida: '23:10', chegada: '15:40', duracao: '24h 30m', escalas: 'Direto*', preco: 540, pct: 40, score: 88, tom: 'bom', nota: 'Chega em horário civilizado e salva o primeiro dia.' },
  { companhia: 'Emirates', partida: '02:50', chegada: '04:15', duracao: '31h 10m', escalas: '2 escalas', preco: 495, pct: 36, score: 58, tom: 'alerta', nota: 'Mais barato, mas chega de madrugada e 31h em trânsito.' },
];

const TOM = {
  bom: { faixa: 'bg-success-bg text-success border-success-bd', n: 'text-pine', icon: '✅', label: 'Recomendado' },
  alerta: { faixa: 'bg-warn-bg text-warn border-warn-bd', n: 'text-warn', icon: '⚠️', label: 'Atenção' },
  ruim: { faixa: 'bg-danger-bg text-danger border-danger-bd', n: 'text-danger', icon: '⛔', label: 'Evite' },
};

function TelaVoos() {
  return (
    <section className="mb-16">
      <SecaoHeader
        rota="/voos"
        titulo="Voos GRU → Bangkok"
        sub="14 dias · ida e volta · 1 pessoa"
        badge={<LiveBadge>● Preços ao vivo · Aviasales (Travelpayouts)</LiveBadge>}
      />

      {/* Veredito comprar/esperar — agora REAL (substitui o mock) */}
      <div className="rounded-2xl border border-solar/50 bg-solar/15 p-5 sm:p-6 mb-6 flex flex-wrap items-center gap-4">
        <div className="text-4xl">⏳</div>
        <div className="grow min-w-[260px]">
          <div className="font-display text-xl text-ink">Espere pra comprar</div>
          <p className="text-sm text-inksoft mt-0.5">O preço desta rota costuma <strong>cair ~12% nas próximas 3 semanas</strong>. Histórico de 12 meses via Aviasales Data API.</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-inksoft">agora</div>
          <div className="font-display text-2xl text-ink tnum line-through opacity-60">US$ 510</div>
          <div className="text-xs text-success font-semibold">previsto ~US$ 450</div>
        </div>
      </div>

      {/* Gráfico de tendência de preço por mês */}
      <div className="rounded-2xl border border-line bg-card p-5 mb-6">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="font-semibold text-ink">Quando voar é mais barato</h3>
          <span className="text-xs text-inksoft">calendário de preços · 12 meses</span>
        </div>
        <div className="flex items-end gap-2 h-40">
          {TENDENCIA.map((t) => (
            <div key={t.m} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              {t.best && <span className="text-[10px] font-bold text-amberx whitespace-nowrap">US$ 412</span>}
              <div
                className={`w-full rounded-t-md ${t.best ? 'bg-solar' : 'bg-pine/30'}`}
                style={{ height: `${t.v}%` }}
              />
              <span className={`text-[10px] ${t.best ? 'text-amberx font-bold' : 'text-inksoft'}`}>{t.m}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-inksoft mt-3">🟡 <strong>Maio</strong> é o melhor mês desta rota — ~19% abaixo da média anual.</p>
      </div>

      {/* Ofertas de voo (FlightScoreCard real + CTA de reserva monetizado) */}
      <div className="space-y-3">
        {VOOS.map((v) => {
          const ui = TOM[v.tom];
          return (
            <article key={v.companhia} className={`rounded-2xl border bg-card overflow-hidden ${v.destaque ? 'border-pine ring-1 ring-pine/20 shadow-[var(--e-1)]' : 'border-line'}`}>
              <div className="p-4 sm:p-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                <div className="w-32 shrink-0">
                  <div className="font-semibold text-ink">{v.companhia}</div>
                  {v.destaque && <span className="text-[11px] font-bold text-pine">Melhor custo-benefício</span>}
                </div>
                <div className="text-sm text-ink tnum">{v.partida} → {v.chegada}</div>
                <div className="text-xs text-inksoft">{v.duracao}</div>
                <div className="text-xs text-inksoft">{v.escalas}</div>
                <div className="ml-auto text-right">
                  <div className="font-display text-2xl text-ink tnum">US$ {v.preco}</div>
                  <div className="text-[11px] text-inksoft tnum">{v.pct}% do orçamento</div>
                </div>
                <div className="flex flex-col items-center px-2">
                  <span className={`tnum font-display text-3xl ${ui.n}`}>{v.score}</span>
                  <span className="text-[10px] uppercase tracking-wider text-inksoft font-bold">/100</span>
                </div>
                <a className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-1.5 rounded-xl bg-coral text-oncoral font-semibold px-5 py-2.5 hover:brightness-95 transition">
                  Reservar no Kiwi →
                </a>
              </div>
              <div className={`px-4 sm:px-5 py-2.5 border-t ${ui.faixa} flex items-center gap-2 text-sm`}>
                <span>{ui.icon}</span><strong>{ui.label}:</strong><span>{v.nota}</span>
              </div>
            </article>
          );
        })}
      </div>
      <p className="text-[11px] text-inksoft mt-3">💰 Cada reserva paga ~3% de comissão (Kiwi via Travelpayouts) · *“Direto” quando disponível na rota.</p>
    </section>
  );
}

/* ---------- TELA 2: DESTINO — Passeios & ingressos (Viator) + Hotel (Booking) ---------- */
const PASSEIOS = [
  { nome: 'Grande Palácio + Templo do Buda de Esmeralda', preco: 45, rating: 4.8, reviews: '2.341', dur: '3h', tags: ['Cancelamento grátis', 'Guia PT/EN'], disp: 'Amanhã, 09:00', grad: 'from-amberx to-clay' },
  { nome: 'Mercado Flutuante Damnoen Saduak', preco: 38, rating: 4.6, reviews: '1.077', dur: 'Meio-dia', tags: ['Cancelamento grátis', 'Transporte incluído'], disp: 'Amanhã, 07:30', grad: 'from-sage to-pine' },
  { nome: 'Jantar-cruzeiro no Rio Chao Phraya', preco: 52, rating: 4.7, reviews: '3.980', dur: '2h', tags: ['Mais vendido', 'Buffet incluído'], disp: 'Hoje, 19:30', grad: 'from-pine to-pinedk' },
];

function TelaDestino() {
  return (
    <section className="mb-16">
      <SecaoHeader
        rota="/destino/tailandia"
        titulo="Passeios & ingressos em Bangkok"
        sub="Preço e disponibilidade em tempo real"
        badge={<LiveBadge>● Catálogo ao vivo · Viator</LiveBadge>}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {PASSEIOS.map((p) => (
          <article key={p.nome} className="rounded-2xl border border-line bg-card overflow-hidden flex flex-col">
            <div className={`h-32 bg-gradient-to-br ${p.grad} relative`}>
              <span className="absolute top-2 right-2 bg-card/90 text-ink text-xs font-bold px-2 py-1 rounded-full tnum">⭐ {p.rating}</span>
            </div>
            <div className="p-4 flex flex-col grow">
              <h3 className="font-semibold text-ink leading-snug">{p.nome}</h3>
              <div className="text-[11px] text-inksoft mt-1">{p.reviews} avaliações · {p.dur}</div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {p.tags.map((t) => <span key={t} className="text-[10px] font-semibold text-pine bg-pine/8 border border-pine/15 px-2 py-0.5 rounded-full">{t}</span>)}
              </div>
              <div className="mt-3 text-[11px] text-success font-semibold">Próx.: {p.disp}</div>
              <div className="mt-3 pt-3 border-t border-line flex items-end justify-between gap-2">
                <div>
                  <div className="text-[10px] text-inksoft">a partir de</div>
                  <div className="font-display text-xl text-ink tnum">US$ {p.preco}</div>
                </div>
                <a className="inline-flex items-center gap-1.5 rounded-xl bg-coral text-oncoral font-semibold text-sm px-4 py-2 hover:brightness-95 transition">Reservar</a>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-8">
        <LiveBadge tone="money">💰 Você ganha 8% por reserva · cookie 30 dias</LiveBadge>
        <span className="text-xs text-inksoft">via Viator Partner API</span>
      </div>

      {/* Hospedagem (Booking) */}
      <div className="rounded-2xl border border-line bg-paper2/50 p-5 flex flex-wrap items-center gap-4">
        <div className="text-3xl">🏨</div>
        <div className="grow min-w-[240px]">
          <div className="font-display text-lg text-ink">Onde ficar em Bangkok</div>
          <p className="text-sm text-inksoft">328 hotéis disponíveis nas suas datas · <strong className="text-ink tnum">a partir de US$ 28/noite</strong></p>
        </div>
        <a className="inline-flex items-center gap-1.5 rounded-xl bg-pine text-white font-semibold px-5 py-2.5 hover:bg-pinedk transition">Ver hotéis no Booking →</a>
      </div>
    </section>
  );
}

/* ---------- TELA 3: ROTEIRO com CTAs monetizados ---------- */
const DIA = [
  { hora: '09:00', cat: 'passeio', tit: 'Grande Palácio & Wat Phra Kaew', desc: 'Reserve cedo — fila grande depois das 10h.', cta: { label: 'Reservar passeio · Viator', icon: '🎟️', tom: 'coral' } },
  { hora: '13:00', cat: 'comida', tit: 'Almoço: Pad Thai na Thip Samai', desc: 'O melhor pad thai da cidade. ~US$ 4.', cta: null },
  { hora: '16:00', cat: 'transporte', tit: 'Barco pelo Chao Phraya até Icon Siam', desc: 'Express boat — US$ 0,50. Vista do rio.', cta: { label: 'Como chegar', icon: '🧭', tom: 'ghost' } },
  { hora: '20:00', cat: 'hospedagem', tit: 'Check-in · Riva Surya Bangkok', desc: 'Beira-rio, 4★. Cancelamento grátis até amanhã.', cta: { label: 'Reservar · Booking', icon: '🏨', tom: 'pine' } },
];

function CtaBtn({ cta }) {
  if (!cta) return null;
  const cls = {
    coral: 'bg-coral text-oncoral',
    pine: 'bg-pine text-white',
    ghost: 'border border-line bg-card text-ink',
  }[cta.tom];
  return <a className={`inline-flex items-center gap-1.5 rounded-xl font-semibold text-sm px-4 py-2 hover:brightness-95 transition ${cls}`}>{cta.icon} {cta.label}</a>;
}

function TelaRoteiro() {
  return (
    <section className="mb-12">
      <SecaoHeader
        rota="/roteiro"
        titulo="Dia 3 · Bangkok"
        sub="Cada parada já vira reserva — sem sair do roteiro"
        badge={<LiveBadge tone="money">💰 CTAs monetizados</LiveBadge>}
      />
      <div className="space-y-3">
        {DIA.map((it) => (
          <div key={it.hora} className="rounded-2xl border border-line bg-card p-4 flex flex-wrap items-center gap-4">
            <div className="font-display text-lg text-pine tnum w-14 shrink-0">{it.hora}</div>
            <div className="grow min-w-[200px]">
              <div className="font-semibold text-ink">{it.tit}</div>
              <p className="text-sm text-inksoft">{it.desc}</p>
            </div>
            <CtaBtn cta={it.cta} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function PreviewApis() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <header className="mb-10 text-center">
          <div className="font-display text-3xl sm:text-4xl text-ink">Mundo Sem Fim — com as APIs conectadas</div>
          <p className="text-sm text-inksoft mt-2 max-w-2xl mx-auto">
            Prévia das telas com <strong>Travelpayouts</strong> (voos/hotéis), <strong>Viator</strong> (passeios),
            <strong> Booking</strong> (hospedagem) e <strong>Aviasales/Kiwi</strong> (preços de voo) ligados.
          </p>
          <p className="text-[11px] text-inksoft mt-2 inline-block bg-warn-bg text-warn border border-warn-bd rounded-full px-3 py-1">
            ⚠️ Mockup — dados ilustrativos, mesmo design do site real
          </p>
        </header>
        <TelaVoos />
        <TelaDestino />
        <TelaRoteiro />
        <footer className="text-center text-xs text-inksoft border-t border-line pt-6">
          Os botões de reserva já existem no código (<code>links.js</code> / <code>linkPorCategoria</code>) — falta só a chave de afiliado.
          Voos e passeios viriam de <code>/api/voos</code> e <code>/api/passeios</code> (proxy seguro, chave no servidor).
        </footer>
      </div>
    </main>
  );
}
