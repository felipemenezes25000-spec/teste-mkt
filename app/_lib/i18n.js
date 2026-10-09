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
// Dicionários por idioma em ./i18n/{pt,en,es,ja}.js (paridade testada). Só o pt
// entra no bundle; en/es/ja carregam sob demanda quando o idioma é escolhido (V5 F10).

export const IDIOMAS = [
  { code: 'pt', nome: 'Português', bandeira: '🇧🇷', mapTiler: 'pt' },
  { code: 'en', nome: 'English', bandeira: '🇺🇸', mapTiler: 'en' },
  { code: 'es', nome: 'Español', bandeira: '🇪🇸', mapTiler: 'es' },
  { code: 'ja', nome: '日本語', bandeira: '🇯🇵', mapTiler: 'ja' },
];

export const IDIOMA_PADRAO = 'pt';
// Locale BCP 47 para datas e números de cada idioma da interface.
export const LOCALES = { pt: 'pt-BR', en: 'en-US', es: 'es-ES', ja: 'ja-JP' };
import PT from './i18n/pt.js';
const STORAGE_KEY = 'msf.lang.v1';

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

/** Substitui {chave} por vars.chave. */
export function interpolar(str, vars) {
  if (!vars) return str;
  return String(str).replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? String(vars[k]) : m));
}

// Dicionários carregados (pt sempre; os demais entram quando pedidos).
export const STRINGS = { pt: PT };
const CARREGADORES = {
  en: () => import('./i18n/en.js'),
  es: () => import('./i18n/es.js'),
  ja: () => import('./i18n/ja.js'),
};
const pendentes = {};
/** Carrega o dicionário de um idioma (idempotente). */
export function carregarIdioma(code) {
  if (STRINGS[code] || !CARREGADORES[code]) return Promise.resolve(STRINGS[code] || null);
  if (!pendentes[code]) pendentes[code] = CARREGADORES[code]().then((m) => { STRINGS[code] = m.default; return m.default; });
  return pendentes[code];
}

// Hook React: devolve { idioma, definir, t } onde t(chavePath) → string traduzida.
// Inicializa com pt no SSR pra não dar hydration mismatch; troca após mount.
export function useIdioma() {
  const [idioma, setIdiomaState] = useState(IDIOMA_PADRAO);
  const [, setVersao] = useState(0);
  // idioma sem dicionário carregado: busca e re-renderiza (enquanto isso, cai no pt)
  useEffect(() => {
    if (STRINGS[idioma]) return undefined;
    let vivo = true;
    carregarIdioma(idioma).then(() => { if (vivo) setVersao((v) => v + 1); });
    return () => { vivo = false; };
  }, [idioma]);

  useEffect(() => {
    const salvo = lerStorage();
    const escolhido = salvo || detectarIdiomaBrowser();
    if (escolhido !== IDIOMA_PADRAO) setIdiomaState(escolhido);
    if (typeof document !== 'undefined') document.documentElement.lang = escolhido;
    // troca feita em OUTRO componente (seletor) ou outra aba: todos acompanham
    const onLang = (e) => { const c = e.detail && e.detail.code; if (c) setIdiomaState(c); };
    const onStorage = (e) => { if (e.key === STORAGE_KEY && e.newValue) setIdiomaState(e.newValue); };
    window.addEventListener('msf:lang', onLang);
    window.addEventListener('storage', onStorage);
    return () => { window.removeEventListener('msf:lang', onLang); window.removeEventListener('storage', onStorage); };
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
  // t com interpolação: tf('exp.destinos', { n: 3 })
  const tf = (path, vars) => interpolar(t(path), vars);

  const locale = LOCALES[idioma] || 'pt-BR';
  return { idioma, definir, t, tf, locale };
}

// Para componentes server-side que só precisam ler o idioma do cookie.
export function idiomaDoCookie(cookieHeader) {
  if (!cookieHeader) return IDIOMA_PADRAO;
  const m = String(cookieHeader).match(/msf\.lang\.v1=([a-z]{2})/);
  return m && IDIOMAS.some((i) => i.code === m[1]) ? m[1] : IDIOMA_PADRAO;
}
