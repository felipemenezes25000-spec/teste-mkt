'use client';
import { useEffect, useState } from 'react';

// Internacionalização leve, sem framework. Suporta 4 idiomas hoje (pt, en, es, ja).
// Adicionar mais é só estender IDIOMAS + adicionar chave em STRINGS.
//
// Estratégia:
//   • SSR sempre renderiza pt-BR (default Brasil). Sem mismatch de hidratação.
//   • Client hidrata: lê localStorage; se não há, detecta navigator.language.
//   • Cookie `msf.lang` espelha localStorage para que o servidor possa, no futuro,
//     ler o idioma e renderizar variantes específicas (Next App Router).
//   • Mapa do destino usa o mesmo idioma via prop `idioma` no MapTiler.
//
// MVP: traduz só as strings de mais alta visibilidade (nav, hero, FAQ, CTAs).
// O restante segue pt-BR — quando o usuário troca pra outro idioma, ele vê uma
// mistura. Isso é honesto: melhor mostrar pt + EN-no-mapa do que esconder a
// feature até a tradução completa estar pronta.

export const IDIOMAS = [
  { code: 'pt', nome: 'Português', bandeira: '🇧🇷', mapTiler: 'pt' },
  { code: 'en', nome: 'English', bandeira: '🇺🇸', mapTiler: 'en' },
  { code: 'es', nome: 'Español', bandeira: '🇪🇸', mapTiler: 'es' },
  { code: 'ja', nome: '日本語', bandeira: '🇯🇵', mapTiler: 'ja' },
];

export const IDIOMA_PADRAO = 'pt';
const STORAGE_KEY = 'msf.lang.v1';

// Strings traduzidas. Chaves agrupadas por contexto.
// Para adicionar string nova: chave em pt, depois em en/es/ja. Se falta, cai pra pt.
export const STRINGS = {
  pt: {
    nav: {
      descobrir: 'Descobrir',
      decidir: 'Decidir',
      comparar: 'Comparar',
      custoReal: 'Custo real',
      planejar: 'Planejar',
      roteiro: 'Roteiro',
      voos: 'Voos',
      salvos: 'Salvos',
      precos: 'Preços',
      entrar: 'Entrar',
      menu: 'Menu',
    },
    home: {
      heroCTA: 'Decidir minha viagem',
      heroSubCTA: 'Explorar destinos',
      ctaFinalCalcular: 'Calcular minha viagem',
      ctaFinalDescobrir: 'Descobrir 3 viagens possíveis',
      gratisComecar: 'Grátis pra começar',
      semCartao: 'Sem cartão',
      conselhoNeutro: 'Conselho neutro',
    },
    destino: {
      pontosTuristicos: 'Pontos turísticos',
      cidadesBases: 'Cidades & bases',
      ondefica: 'Onde fica',
      verHistoria: 'Ver história de',
      lerArtigo: 'Ler o artigo completo',
      lerSobrePais: 'Ler sobre o país',
      abrirMapa: 'Abrir no Google Maps',
      fonteWiki: 'Fonte: Wikipédia',
      carregandoHistoria: 'Carregando história…',
    },
    map: {
      ampliar: 'Ver mapa maior',
    },
    geral: {
      voltar: 'Voltar',
      salvar: 'Salvar',
      comparar: 'Comparar',
      fechar: 'Fechar',
    },
  },
  en: {
    nav: {
      descobrir: 'Discover',
      decidir: 'Decide',
      comparar: 'Compare',
      custoReal: 'Real cost',
      planejar: 'Plan',
      roteiro: 'Itinerary',
      voos: 'Flights',
      salvos: 'Saved',
      precos: 'Pricing',
      entrar: 'Sign in',
      menu: 'Menu',
    },
    home: {
      heroCTA: 'Decide my trip',
      heroSubCTA: 'Explore destinations',
      ctaFinalCalcular: 'Calculate my trip',
      ctaFinalDescobrir: 'Discover 3 possible trips',
      gratisComecar: 'Free to start',
      semCartao: 'No card',
      conselhoNeutro: 'Neutral advice',
    },
    destino: {
      pontosTuristicos: 'Sights',
      cidadesBases: 'Cities & bases',
      ondefica: 'Where it is',
      verHistoria: 'See history of',
      lerArtigo: 'Read full article',
      lerSobrePais: 'Read about the country',
      abrirMapa: 'Open in Google Maps',
      fonteWiki: 'Source: Wikipedia',
      carregandoHistoria: 'Loading history…',
    },
    map: {
      ampliar: 'View larger map',
    },
    geral: {
      voltar: 'Back',
      salvar: 'Save',
      comparar: 'Compare',
      fechar: 'Close',
    },
  },
  es: {
    nav: {
      descobrir: 'Descubrir',
      decidir: 'Decidir',
      comparar: 'Comparar',
      custoReal: 'Coste real',
      planejar: 'Planificar',
      roteiro: 'Itinerario',
      voos: 'Vuelos',
      salvos: 'Guardados',
      precos: 'Precios',
      entrar: 'Entrar',
      menu: 'Menú',
    },
    home: {
      heroCTA: 'Decidir mi viaje',
      heroSubCTA: 'Explorar destinos',
      ctaFinalCalcular: 'Calcular mi viaje',
      ctaFinalDescobrir: 'Descubrir 3 viajes posibles',
      gratisComecar: 'Gratis para empezar',
      semCartao: 'Sin tarjeta',
      conselhoNeutro: 'Consejo neutral',
    },
    destino: {
      pontosTuristicos: 'Lugares turísticos',
      cidadesBases: 'Ciudades & bases',
      ondefica: 'Dónde está',
      verHistoria: 'Ver historia de',
      lerArtigo: 'Leer artículo completo',
      lerSobrePais: 'Leer sobre el país',
      abrirMapa: 'Abrir en Google Maps',
      fonteWiki: 'Fuente: Wikipedia',
      carregandoHistoria: 'Cargando historia…',
    },
    map: {
      ampliar: 'Ver mapa grande',
    },
    geral: {
      voltar: 'Atrás',
      salvar: 'Guardar',
      comparar: 'Comparar',
      fechar: 'Cerrar',
    },
  },
  ja: {
    nav: {
      descobrir: '発見',
      decidir: '決定',
      comparar: '比較',
      custoReal: '実費',
      planejar: '計画',
      roteiro: '旅程',
      voos: 'フライト',
      salvos: '保存',
      precos: '料金',
      entrar: 'ログイン',
      menu: 'メニュー',
    },
    home: {
      heroCTA: '旅を決める',
      heroSubCTA: '目的地を探す',
      ctaFinalCalcular: '旅費を計算',
      ctaFinalDescobrir: '3つの旅を発見',
      gratisComecar: '無料で開始',
      semCartao: 'カード不要',
      conselhoNeutro: '中立的なアドバイス',
    },
    destino: {
      pontosTuristicos: '観光スポット',
      cidadesBases: '都市と拠点',
      ondefica: '場所',
      verHistoria: '歴史を見る:',
      lerArtigo: '記事全文を読む',
      lerSobrePais: '国について読む',
      abrirMapa: 'Googleマップで開く',
      fonteWiki: '出典: ウィキペディア',
      carregandoHistoria: '歴史を読み込み中…',
    },
    map: {
      ampliar: '大きな地図を見る',
    },
    geral: {
      voltar: '戻る',
      salvar: '保存',
      comparar: '比較',
      fechar: '閉じる',
    },
  },
};

// Detecta idioma do browser, normalizando para os nossos 4 suportados.
// "pt-BR", "pt-PT" → pt. "en-US", "en-GB" → en. "es-AR", "es-MX" → es. "ja" → ja.
// Qualquer outro → pt (default Brasil).
function detectarIdiomaBrowser() {
  if (typeof navigator === 'undefined') return IDIOMA_PADRAO;
  const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
  for (const l of langs) {
    const prefixo = String(l).toLowerCase().slice(0, 2);
    if (IDIOMAS.some((i) => i.code === prefixo)) return prefixo;
  }
  return IDIOMA_PADRAO;
}

function lerStorage() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const v = localStorage.getItem(STORAGE_KEY);
    return IDIOMAS.some((i) => i.code === v) ? v : null;
  } catch { return null; }
}
function gravarStorage(code) {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, code);
    if (typeof document !== 'undefined') document.cookie = `${STORAGE_KEY}=${code}; path=/; max-age=31536000; samesite=lax`;
  } catch {}
}

// Hook React: devolve { idioma, definir, t } onde t(chavePath) → string traduzida.
// Inicializa com pt no SSR pra não dar hydration mismatch; troca após mount.
export function useIdioma() {
  const [idioma, setIdiomaState] = useState(IDIOMA_PADRAO);

  useEffect(() => {
    const salvo = lerStorage();
    const escolhido = salvo || detectarIdiomaBrowser();
    if (escolhido !== IDIOMA_PADRAO) setIdiomaState(escolhido);
    if (typeof document !== 'undefined') document.documentElement.lang = escolhido;
  }, []);

  function definir(code) {
    if (!IDIOMAS.some((i) => i.code === code)) return;
    setIdiomaState(code);
    gravarStorage(code);
    if (typeof document !== 'undefined') document.documentElement.lang = code;
    // Notifica outros componentes na mesma aba.
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('msf:lang', { detail: { code } }));
  }

  // Tradução de chave dot-notation: t('nav.decidir') → "Decidir" / "Decide" / etc.
  // Fallback automático: idioma → pt → string da própria chave (não estoura).
  function t(path) {
    const partes = String(path || '').split('.');
    const tentar = (dict) => {
      let cur = dict;
      for (const p of partes) {
        if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
        else return null;
      }
      return typeof cur === 'string' ? cur : null;
    };
    return tentar(STRINGS[idioma]) || tentar(STRINGS[IDIOMA_PADRAO]) || path;
  }

  return { idioma, definir, t };
}

// Para componentes server-side que só precisam ler o idioma do cookie.
export function idiomaDoCookie(cookieHeader) {
  if (!cookieHeader) return IDIOMA_PADRAO;
  const m = String(cookieHeader).match(/msf\.lang\.v1=([a-z]{2})/);
  return m && IDIOMAS.some((i) => i.code === m[1]) ? m[1] : IDIOMA_PADRAO;
}
