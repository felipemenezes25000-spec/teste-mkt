'use client';
import { useIdioma } from '../_lib/i18n.js';

// Bloco "Vale ir agora?" — pega o destino + (opcional) mês atual e dá um
// veredito prescritivo. NÃO é "compre agora": pode dizer "espere", "evite",
// "só com orçamento maior". É o oposto da OTA.
//
// Função PURA (vereditoIrAgora) → testável; render é só a embalagem.

const MES_NOMES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const PICO_GLOBAL = new Set([12, 1, 2, 7]);

export function vereditoIrAgora(destino, mes = new Date().getMonth() + 1) {
  const otimos = new Set(destino?.melhoresMeses || []);
  const ehOtimo = otimos.has(mes);
  const ehPico = PICO_GLOBAL.has(mes);
  const custoDia = Number(destino?.custoDia) || 0;
  const caro = custoDia >= 70;
  const barato = custoDia <= 30;

  if (ehOtimo && !ehPico) {
    return {
      tom: 'bom',
      titulo: 'Bom momento',
      texto: `${MES_NOMES[mes - 1]} cai dentro da melhor época de ${destino.nome} e não é pico global. Janela rara — preço + clima + experiência alinham.`,
    };
  }
  if (ehOtimo && ehPico) {
    return {
      tom: 'alerta',
      titulo: 'Só vale com orçamento maior',
      texto: `${MES_NOMES[mes - 1]} é ótimo para ${destino.nome}, mas é pico global: hospedagem e voo sobem ~20-30%. Se puder esperar pra fora do pico, rende muito mais.`,
    };
  }
  if (otimos.size > 0 && !ehOtimo && !ehPico) {
    const proximos = [...otimos].sort((a, b) => Math.abs(a - mes) - Math.abs(b - mes));
    const sugestao = proximos[0];
    return {
      tom: 'espere',
      titulo: 'Espere o próximo ciclo',
      texto: `${MES_NOMES[mes - 1]} não está na janela de ${destino.nome}. Janela mais próxima: ${MES_NOMES[sugestao - 1]} — vale planejar pra lá.`,
    };
  }
  if (ehPico && caro) {
    return {
      tom: 'evite',
      titulo: 'Evite este mês',
      texto: `Pico global + custo diário já alto em ${destino.nome}. A combinação cobra demais por uma viagem que pode render mais em outro mês.`,
    };
  }
  if (caro && !barato) {
    return {
      tom: 'condicional',
      titulo: 'Bom pra quem prioriza o destino, não o preço',
      texto: `${destino.nome} é destino de desejo, mas custo diário alto cobra calibragem. Vale com 10+ dias, orçamento confortável e roteiro pensado.`,
    };
  }
  if (barato) {
    return {
      tom: 'bom',
      titulo: 'Janela aberta para orçamento controlado',
      texto: `${destino.nome} é um dos destinos mais elásticos pra orçamento brasileiro. Quase qualquer mês fora do pico rende.`,
    };
  }
  return {
    tom: 'neutro',
    titulo: 'Decisão depende do seu perfil',
    texto: `${destino.nome} não tem janela fixa. Cruze com o seu perfil em /decisao pra ver se faz sentido agora.`,
  };
}

const TOM_UI = {
  bom: { borda: 'border-success-bd', bg: 'bg-success-bg', text: 'text-success', icon: '✅' },
  alerta: { borda: 'border-warn-bd', bg: 'bg-warn-bg', text: 'text-warn', icon: '⚠️' },
  espere: { borda: 'border-warn-bd', bg: 'bg-warn-bg', text: 'text-warn', icon: '⏳' },
  evite: { borda: 'border-danger-bd', bg: 'bg-danger-bg', text: 'text-danger', icon: '⛔' },
  condicional: { borda: 'border-line', bg: 'bg-paper2', text: 'text-ink', icon: '🤔' },
  neutro: { borda: 'border-line', bg: 'bg-paper2', text: 'text-ink', icon: '➡️' },
};

// Mapeia o `tom` (chave do TOM_UI) pra chave do dicionário i18n. O texto explicativo
// segue em pt — é gerado com nomes de destino e meses específicos, traduzir
// dinamicamente exigiria template multilíngue (próxima leva).
const TOM_TO_I18N = {
  bom: 'destino.valeBomMomento',
  alerta: 'destino.valeAlerta',
  espere: 'destino.valeEspere',
  evite: 'destino.valeEvite',
  condicional: 'destino.valeCondicional',
  neutro: 'destino.valeNeutro',
};

export function ValeIrAgora({ destino, mes }) {
  const { t } = useIdioma();
  const v = vereditoIrAgora(destino, mes);
  const ui = TOM_UI[v.tom] || TOM_UI.neutro;
  // Heurística: se tom é "bom" e texto começa com "Janela aberta", é valeBomBarato
  const tituloKey = v.titulo.startsWith('Janela') ? 'destino.valeBomBarato' : (TOM_TO_I18N[v.tom] || 'destino.valeNeutro');
  return (
    <section aria-labelledby="vale-ir-agora-titulo">
      <h2 id="vale-ir-agora-titulo" className="font-display text-2xl text-ink mb-3">⏱️ {t('destino.valeTitulo')}</h2>
      <div className={`rounded-3xl border ${ui.borda} ${ui.bg} p-5 sm:p-6`}>
        <div className="flex items-baseline gap-2">
          <span aria-hidden className="text-xl">{ui.icon}</span>
          <h3 className={`font-display text-xl ${ui.text}`}>{t(tituloKey)}</h3>
        </div>
        <p className={`mt-2 text-sm ${ui.text} opacity-90`}>{v.texto}</p>
      </div>
    </section>
  );
}
