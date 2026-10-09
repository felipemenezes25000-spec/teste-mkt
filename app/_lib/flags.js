// Bandeira do destino a partir do código ISO-2 (`code`). Os 205 países do catálogo
// usam a bandeira OFICIAL da Wikimedia Commons servida pelo próprio site
// (public/bandeiras, gerada por scripts/midia/gerar-midia.mjs) — rápida, offline e
// sem depender de CDN. Outros códigos caem no SVG do flagcdn (emoji de bandeira não
// renderiza no Windows/Chrome).
const LOCAIS = new Set('AD AE AF AG AL AM AO AR AT AU AW AZ BA BB BD BE BF BG BH BI BJ BN BO BR BS BT BW BY BZ CA CD CF CG CH CI CK CL CM CN CO CR CU CV CW CY CZ DE DJ DK DM DO DZ EC EE EG ER ES ET FI FJ FM FR GA GB GD GE GH GM GN GQ GR GT GW GY HK HN HR HT HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KI KM KN KP KR KW KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MG MH MK ML MM MN MO MR MT MU MV MW MX MY MZ NA NC NE NG NI NL NO NP NR NZ OM PA PE PF PG PH PK PL PR PS PT PW PY QA RO RS RU RW SA SB SC SD SE SG SI SK SL SM SN SO SR SS ST SV SY SZ TD TG TH TJ TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VN VU WS XK YE ZA ZM ZW'.split(' '));

export function flagUrl(code) {
  if (!code || !/^[A-Za-z]{2}$/.test(code)) return null;
  const c = code.toUpperCase();
  return LOCAIS.has(c) ? `/bandeiras/${c}.png` : `https://flagcdn.com/${code.toLowerCase()}.svg`;
}
