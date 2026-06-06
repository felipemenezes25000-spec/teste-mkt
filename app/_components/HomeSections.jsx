'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { track } from '../_lib/analytics.js';

// Seções editoriais da Home: problema do viajante, como o produto decide, custo
// real (preview), comparação com OTAs e FAQ. Tudo client-side leve — animações
// só no FAQ (accordion). Copy intencionalmente concreta, sem "experiências
// incríveis": cada bloco tem alerta real e exemplo numérico.

const PROBLEMAS = [
  { icon: '🗂️', txt: '17 abas abertas comparando Booking, Skyscanner, blog, YouTube e Reddit — e ainda na dúvida.' },
  { icon: '📉', txt: 'O preço da vitrine muda toda hora. Quando você reserva, já não é mais aquele.' },
  { icon: '🎬', txt: 'O vídeo do TikTok romantizou — mas escondeu chuva, distância e fila.' },
  { icon: '🛏️', txt: 'Hotel “bem localizado” fica 40 minutos do centro e vira taxa de Uber.' },
  { icon: '🛬', txt: 'Voo barato chega 03h40 da manhã. O primeiro dia já começou perdendo.' },
  { icon: '🗺️', txt: 'Roteiro de Pinterest tem 12 pontos por dia. Você consegue viver 4.' },
  { icon: '💸', txt: 'Custos invisíveis (eSIM, seguro, passeio, bagagem) aparecem só no balcão.' },
];

const FATORES = [
  { titulo: 'Custo real', txt: 'Voo, hotel, comida, transporte, seguro, eSIM, visto, passeios e contingência — não só voo+hotel.' },
  { titulo: 'Clima', txt: 'Cruza melhor época com o mês escolhido. Se não fecha, sugere janela alternativa.' },
  { titulo: 'Visto', txt: 'Passaporte brasileiro: dias permitidos, tipo de visto e fila. Sem surpresa no check-in.' },
  { titulo: 'Segurança', txt: 'Índice por país e cidade. Reduz score quando há alerta consular real.' },
  { titulo: 'Cansaço', txt: 'Voo longo + escala ruim + horário de chegada penalizam o primeiro dia.' },
  { titulo: 'Ritmo', txt: 'Você tem 7 dias ou 21? O ranking muda — Tailândia raramente vence em 6 dias.' },
  { titulo: 'Perfil', txt: 'Casal, família, mochilão, solo — pesos diferentes para conforto, segurança e cultura.' },
  { titulo: 'Orçamento', txt: 'O destino só entra no top 3 se o custo total cabe — não só o voo.' },
];

const COMPARACAO = [
  { rotulo: 'Booking', papel: 'Vende hospedagem.', frase: 'Te mostra 200 hotéis sem dizer se aquele destino faz sentido pra você.' },
  { rotulo: 'Airbnb', papel: 'Vende estadia.', frase: 'Te dá o quarto. Não te dá o roteiro nem o custo do dia.' },
  { rotulo: 'Expedia / Decolar', papel: 'Vende pacote.', frase: 'Otimiza margem do pacote. Não otimiza a sua viagem.' },
  { rotulo: 'Google Flights', papel: 'Mostra voo.', frase: 'É excelente em preço de voo. Não fala de chegada, conexão ou primeiro dia.' },
  { rotulo: 'Mundo Sem Fim', papel: 'Decide antes da compra.', frase: 'Não vende a reserva. Diz se vale comprar — e o quanto a viagem inteira custa.', destaque: true },
];

const FAQ = [
  {
    q: 'Isso substitui o Booking ou o Airbnb?',
    a: 'Não. O Mundo Sem Fim é a camada que vem antes. A gente decide se vale ir e quanto a viagem inteira custa. Depois você reserva onde quiser — não temos comissão de hotel.',
  },
  {
    q: 'Os preços são exatos?',
    a: 'Não. São estimativas calibradas por país, perfil e mês, com fontes públicas (câmbio do BCB, dados de visto, custo médio diário). A função é evitar surpresa, não substituir o orçamento real da reserva.',
  },
  {
    q: 'Como vocês calculam o custo real?',
    a: 'Voo (cotado por rota e mês) + hospedagem por perfil + alimentação por padrão (mochila/médio/conforto) + transporte local + seguro viagem + eSIM + visto + passeios médios + 10% de contingência. A página /custo-real mostra item por item.',
  },
  {
    q: 'Posso usar para viagem de casal, família ou mochilão?',
    a: 'Sim. O perfil muda os pesos do score: conforto pesa mais em família, custo pesa mais em mochilão, segurança pesa mais em solo. Você troca o perfil em /decisao a qualquer momento.',
  },
  {
    q: 'O que tem no plano grátis?',
    a: 'Descobrir destinos pelo perfil, comparar 3 favoritos, planejar rota com estação × visto × fôlego, câmbio ao vivo. Sem cartão.',
  },
  {
    q: 'Qual a diferença pro Premium?',
    a: 'Premium: testar quantas versões da viagem quiser, custo real completo, alertas de preço de voo, exportar PDF. Pro: rota multi-país com cansaço otimizado, colaboração e suporte prioritário.',
  },
  {
    q: 'Funciona para viagem internacional e mochilão?',
    a: 'Sim. 205 países no catálogo, com visto pra passaporte BR. Mochilão tem perfil dedicado (custo↑, conforto↓) e funciona melhor com 14+ dias.',
  },
  {
    q: 'Vocês vendem passagem?',
    a: 'Não. Por isso o conselho é neutro. Quando achamos que não vale comprar agora, a gente fala — uma OTA jamais diria isso.',
  },
];

export function HomeSecaoProblema() {
  return (
    <section className="bg-paper2/40 border-y border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-3xl">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-clay">O problema</span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink leading-[1.08]">
            O problema não é falta de opção. É excesso de opção sem contexto.
          </h2>
          <p className="mt-3 text-inksoft">
            A maioria das viagens não dá errado no destino. Dá errado na decisão — antes de comprar a passagem.
          </p>
        </div>
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PROBLEMAS.map((p) => (
            <li key={p.txt} className="rounded-2xl border border-line bg-card p-4 flex gap-3">
              <span aria-hidden className="text-xl shrink-0">{p.icon}</span>
              <p className="text-sm text-ink leading-snug">{p.txt}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HomeSecaoComoDecide() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-pine">O motor</span>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink leading-[1.08]">
          Como o Mundo Sem Fim decide o que combina com você
        </h2>
        <p className="mt-3 text-inksoft">
          Oito fatores que mudam a resposta. Trocou o mês? Trocou o orçamento? O ranking refaz na hora.
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {FATORES.map((f) => (
          <div key={f.titulo} className="rounded-2xl border border-line bg-card p-4">
            <h3 className="font-display text-lg text-ink">{f.titulo}</h3>
            <p className="mt-1 text-sm text-inksoft leading-snug">{f.txt}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HomeSecaoCustoReal() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
      <div className="rounded-3xl border border-line bg-card p-6 sm:p-10 shadow-[var(--e-1)]">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 items-start">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-coral">Custo real</span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink leading-[1.08]">
              O preço de vitrine termina na compra. O custo real aparece durante a viagem.
            </h2>
            <p className="mt-3 text-inksoft">
              Exemplo real: 8 dias para o Peru, casal, perfil equilibrado.
            </p>
            <Link href="/custo-real" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-coral text-oncoral font-semibold px-4 py-2.5 hover:brightness-95 focusring">
              Abrir a calculadora →
            </Link>
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-line bg-paper2/60 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-inksoft">Preço de vitrine</div>
              <div className="mt-1 text-xs text-inksoft">Voo + hotel</div>
              <div className="mt-2 font-display text-3xl text-ink tnum">R$ 4.900</div>
            </div>
            <div className="rounded-2xl border border-warn-bd bg-warn-bg p-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-warn">Custo real</div>
              <div className="mt-1 text-xs text-warn">+ comida + transporte + seguro + eSIM + passeios + imprevistos</div>
              <div className="mt-2 font-display text-3xl text-warn tnum">R$ 7.280</div>
            </div>
            <div className="rounded-2xl border border-danger-bd bg-danger-bg p-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-danger">Diferença</div>
              <div className="mt-1 text-xs text-danger">Que normalmente aparece tarde demais</div>
              <div className="mt-2 font-display text-3xl text-danger tnum">+ R$ 2.380</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeSecaoOtas() {
  return (
    <section className="bg-paper2/40 border-y border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-pine">Onde a gente entra</span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink leading-[1.08]">
            Não somos uma OTA. Somos a camada de decisão antes dela.
          </h2>
          <p className="mt-3 text-inksoft">
            Cada ferramenta resolve uma parte. Falta quem te diga se vale a viagem inteira.
          </p>
        </div>
        <div className="mt-8 overflow-x-auto rounded-3xl border border-line bg-card shadow-[var(--e-1)]">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-inksoft">
                <th className="px-4 py-3">Ferramenta</th>
                <th className="px-4 py-3">O que ela faz</th>
                <th className="px-4 py-3">Onde para</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {COMPARACAO.map((c) => (
                <tr key={c.rotulo} className={c.destaque ? 'bg-pine/[0.06]' : ''}>
                  <td className="px-4 py-3">
                    <span className={`font-display text-lg ${c.destaque ? 'text-pine' : 'text-ink'}`}>{c.rotulo}</span>
                    {c.destaque && (
                      <span className="ml-2 align-middle text-[10px] font-bold uppercase tracking-wide bg-pine text-white rounded-full px-2 py-0.5">
                        decisão
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink">{c.papel}</td>
                  <td className="px-4 py-3 text-inksoft">{c.frase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function HomeSecaoFaq() {
  const [aberto, setAberto] = useState(0);
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
      <div className="text-center">
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-pine">FAQ</span>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink leading-[1.08]">Perguntas que todo viajante faz</h2>
      </div>
      <ul className="mt-8 space-y-2">
        {FAQ.map((item, i) => {
          const isOpen = aberto === i;
          return (
            <li key={item.q} className="rounded-2xl border border-line bg-card overflow-hidden">
              <button
                type="button"
                onClick={() => setAberto(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                className="w-full px-4 sm:px-5 py-4 flex items-center justify-between gap-3 text-left focusring"
              >
                <span className="font-display text-lg text-ink">{item.q}</span>
                <span aria-hidden className={`shrink-0 w-7 h-7 grid place-items-center rounded-full border border-line text-ink transition ${isOpen ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {isOpen && (
                <div id={`faq-${i}`} className="px-4 sm:px-5 pb-4 -mt-1 text-sm text-inksoft leading-relaxed">
                  {item.a}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// A/B test do CTA final. A = "Calcular minha viagem" (hipótese: ação concreta,
// pessoal). B = "Descobrir 3 viagens possíveis" (hipótese: número específico +
// promessa do simulador). Variante é sticky por usuário (localStorage) — não
// muda entre visitas — e enviada ao track no clique pra medir conversão.
//
// Sem framework de A/B: 50/50 via Math.random() na primeira visita, gravado.
// SSR seguro: renderiza A no servidor + remonta a variante real no client após
// hydrate. O CLS é mínimo (mesmo botão, só muda o texto).

const AB_KEY = 'mundosemfim.ab.cta-home.v1';
const VARIANTES = {
  A: { id: 'A', label: '🧠 Calcular minha viagem' },
  B: { id: 'B', label: '🧭 Descobrir 3 viagens possíveis' },
};

function lerVariante() {
  try {
    const salvo = localStorage.getItem(AB_KEY);
    if (salvo === 'A' || salvo === 'B') return salvo;
  } catch {}
  const escolhida = Math.random() < 0.5 ? 'A' : 'B';
  try { localStorage.setItem(AB_KEY, escolhida); } catch {}
  return escolhida;
}

export function HomeSecaoCtaFinal() {
  const [variante, setVariante] = useState('A');
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    setVariante(lerVariante());
    setHidratado(true);
  }, []);

  // Scroll-depth: dispara track 1x por sessão quando o usuário passa 50% e 90%
  // da altura total da home. Sinal de engagement com o conteúdo editorial.
  // Sessão = sessionStorage (reseta no fechar aba).
  useEffect(() => {
    let marc50 = false, marc90 = false;
    try {
      marc50 = sessionStorage.getItem('ms_scroll_50') === '1';
      marc90 = sessionStorage.getItem('ms_scroll_90') === '1';
    } catch {}
    if (marc50 && marc90) return;

    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const pct = window.scrollY / total;
      if (!marc50 && pct >= 0.5) {
        marc50 = true;
        try { sessionStorage.setItem('ms_scroll_50', '1'); } catch {}
        track('home_scroll_50', {});
      }
      if (!marc90 && pct >= 0.9) {
        marc90 = true;
        try { sessionStorage.setItem('ms_scroll_90', '1'); } catch {}
        track('home_scroll_90', {});
      }
      if (marc50 && marc90) window.removeEventListener('scroll', onScroll);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cta = VARIANTES[variante] || VARIANTES.A;

  function onClick() {
    track('cta_home_final_click', { variante: cta.id });
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="rounded-3xl bg-pine text-white p-8 sm:p-12 text-center shadow-[var(--e-2)]">
        <h2 className="font-display text-3xl sm:text-5xl leading-[1.05] max-w-3xl mx-auto">
          Antes de comprar a passagem, veja se essa viagem fecha a conta.
        </h2>
        <p className="mt-4 text-white/85 max-w-2xl mx-auto">
          Em 30 segundos: 3 destinos que combinam com seu perfil, mês e orçamento — com o custo real da viagem inteira, não só do voo.
        </p>
        <div className="mt-7 flex flex-wrap gap-3 justify-center">
          <Link
            href="/decisao"
            onClick={onClick}
            data-ab-variante={cta.id}
            className="inline-flex items-center gap-2 rounded-xl bg-coral text-oncoral font-semibold px-5 py-3 hover:brightness-95 focusring"
          >
            {cta.label}
          </Link>
          <Link href="/custo-real" className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 text-white font-semibold px-5 py-3 hover:bg-white/20 focusring">
            🧾 Abrir custo real
          </Link>
        </div>
        <p className="mt-5 text-xs text-white/70">
          Grátis para começar · sem cartão · conselho neutro (não vendemos a reserva).
        </p>
        {/* Marcador invisível pra debug/QA do A/B (não muda layout). */}
        {hidratado && (
          <span className="sr-only" data-ab-test="cta-home-final" data-ab-variante={cta.id}>
            Variante {cta.id} ativa
          </span>
        )}
      </div>
    </section>
  );
}
