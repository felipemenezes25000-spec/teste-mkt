/* =============================================================================
   DADOS DE REFERÊNCIA
   ---------------------------------------------------------------------------
   Custos diários e melhores meses são ESTIMATIVAS (perfil mochileiro). As
   regras de visto variam por NACIONALIDADE (passaporte) e foram revisadas em
   junho/2026 a partir de fontes públicas — ainda assim são REFERÊNCIAS: mudam
   por ponto de entrada e política do país. Confira sempre na fonte oficial.
   Tudo é editável no app.
   ========================================================================== */

import { PAISES_EXTRA, VISTOS_EXTRA_BR, MOEDAS_EXTRA, FX_EXTRA } from './paisesMundo.js';

export const STORAGE_KEY = 'mundosemfim.plan.v3';
export const REVISADO_EM = 'junho de 2026';

export { MESES_PT, MESES_PT_LONGO } from './meses.js';

// Custo/dia em US$ (referência; cada trecho pode usar a moeda que quiser).
// coords = [lng, lat] da cidade-hub (p/ o mapa). iata = aeroporto principal (p/ links de voo).
// fotoQuery = título na Wikipedia que rende uma boa foto. cidades/comidas = curadoria (editável).
const PAISES_BASE = [
  { code:'TH', nome:'Tailândia',     regiao:'Sudeste Asiático', custoDia:28, moeda:'THB', melhoresMeses:[11,12,1,2,3], estacao:'Seca: nov–mar (monção mai–out)', iata:'BKK', cidadePrincipal:'Bangkok', coords:[100.50,13.75], fotoQuery:'Bangkok', cidades:['Bangkok','Chiang Mai','Phuket','Krabi'], comidas:['Pad Thai','Tom Yum','Curry verde','Mango sticky rice'] },
  { code:'VN', nome:'Vietnã',        regiao:'Sudeste Asiático', custoDia:26, moeda:'VND', melhoresMeses:[10,11,12,1,2,3], estacao:'Varia N/S; seca out–abr', iata:'HAN', cidadePrincipal:'Hanói', coords:[105.85,21.03], fotoQuery:'Baía de Ha Long', cidades:['Hanói','Ho Chi Minh','Hoi An','Da Nang'], comidas:['Pho','Banh mi','Bun cha','Café vietnamita'] },
  { code:'KH', nome:'Camboja',       regiao:'Sudeste Asiático', custoDia:25, moeda:'USD', melhoresMeses:[11,12,1,2], estacao:'Seca: nov–fev', iata:'PNH', cidadePrincipal:'Phnom Penh', coords:[104.92,11.56], fotoQuery:'Angkor Wat', cidades:['Siem Reap','Phnom Penh','Sihanoukville'], comidas:['Amok','Lok lak','Num banh chok'] },
  { code:'LA', nome:'Laos',          regiao:'Sudeste Asiático', custoDia:24, moeda:'LAK', melhoresMeses:[11,12,1,2], estacao:'Seca: nov–fev', iata:'VTE', cidadePrincipal:'Vientiane', coords:[102.60,17.97], fotoQuery:'Luang Prabang', cidades:['Luang Prabang','Vientiane','Vang Vieng'], comidas:['Larb','Arroz pegajoso','Khao soi'] },
  { code:'ID', nome:'Indonésia',     regiao:'Sudeste Asiático', custoDia:30, moeda:'IDR', melhoresMeses:[4,5,6,7,8,9,10], estacao:'Seca: abr–out (Bali/Java)', iata:'DPS', cidadePrincipal:'Bali (Denpasar)', coords:[115.21,-8.67], fotoQuery:'Bali', cidades:['Bali','Yogyakarta','Jacarta','Lombok'], comidas:['Nasi goreng','Satay','Rendang','Mie goreng'] },
  { code:'MY', nome:'Malásia',       regiao:'Sudeste Asiático', custoDia:30, moeda:'MYR', melhoresMeses:[1,2,3,4,5,6,7], estacao:'Varia por costa (monção a leste nov–fev)', iata:'KUL', cidadePrincipal:'Kuala Lumpur', coords:[101.69,3.14], fotoQuery:'Kuala Lumpur', cidades:['Kuala Lumpur','Penang','Malaca','Bornéu'], comidas:['Nasi lemak','Laksa','Roti canai','Satay'] },
  { code:'PH', nome:'Filipinas',     regiao:'Sudeste Asiático', custoDia:30, moeda:'PHP', melhoresMeses:[12,1,2,3,4], estacao:'Seca: dez–abr', iata:'MNL', cidadePrincipal:'Manila', coords:[120.98,14.60], fotoQuery:'Palawan', cidades:['Manila','Cebu','Palawan','Boracay'], comidas:['Adobo','Sinigang','Lechon','Halo-halo'] },
  { code:'IN', nome:'Índia',         regiao:'Sul da Ásia',      custoDia:22, moeda:'INR', melhoresMeses:[11,12,1,2,3], estacao:'Inverno seco: nov–mar', iata:'DEL', cidadePrincipal:'Délhi', coords:[77.21,28.61], fotoQuery:'Taj Mahal', cidades:['Délhi','Jaipur','Varanasi','Goa'], comidas:['Thali','Curry','Biryani','Dosa'] },
  { code:'NP', nome:'Nepal',         regiao:'Sul da Ásia',      custoDia:22, moeda:'NPR', melhoresMeses:[10,11,3,4], estacao:'Out–nov e mar–abr (trekking)', iata:'KTM', cidadePrincipal:'Katmandu', coords:[85.32,27.71], fotoQuery:'Katmandu', cidades:['Katmandu','Pokhara','Chitwan'], comidas:['Dal bhat','Momos','Thukpa'] },
  { code:'LK', nome:'Sri Lanka',     regiao:'Sul da Ásia',      custoDia:25, moeda:'LKR', melhoresMeses:[12,1,2,3], estacao:'Seca varia por costa', iata:'CMB', cidadePrincipal:'Colombo', coords:[79.86,6.93], fotoQuery:'Sigiria', cidades:['Colombo','Kandy','Ella','Galle'], comidas:['Rice & curry','Hoppers','Kottu'] },
  { code:'PE', nome:'Peru',          regiao:'América do Sul',   custoDia:28, moeda:'PEN', melhoresMeses:[5,6,7,8,9], estacao:'Seca andina: mai–set', iata:'LIM', cidadePrincipal:'Lima', coords:[-77.04,-12.05], fotoQuery:'Machu Picchu', cidades:['Lima','Cusco','Arequipa','Máncora'], comidas:['Ceviche','Lomo saltado','Ají de gallina','Anticuchos'] },
  { code:'BO', nome:'Bolívia',       regiao:'América do Sul',   custoDia:22, moeda:'BOB', melhoresMeses:[5,6,7,8,9], estacao:'Seca: mai–set', iata:'LPB', cidadePrincipal:'La Paz', coords:[-68.15,-16.50], fotoQuery:'Salar de Uyuni', cidades:['La Paz','Uyuni','Sucre','Copacabana'], comidas:['Salteñas','Silpancho','Pique macho'] },
  { code:'CO', nome:'Colômbia',      regiao:'América do Sul',   custoDia:28, moeda:'COP', melhoresMeses:[12,1,2,3,7,8], estacao:'Seco dez–mar e jul–ago', iata:'BOG', cidadePrincipal:'Bogotá', coords:[-74.07,4.71], fotoQuery:'Cartagena das Índias', cidades:['Bogotá','Medellín','Cartagena','Cali'], comidas:['Bandeja paisa','Arepas','Ajiaco','Empanadas'] },
  { code:'AR', nome:'Argentina',     regiao:'América do Sul',   custoDia:35, moeda:'ARS', melhoresMeses:[3,4,10,11], estacao:'Outono e primavera amenos', iata:'EZE', cidadePrincipal:'Buenos Aires', coords:[-58.38,-34.60], fotoQuery:'Buenos Aires', cidades:['Buenos Aires','Bariloche','Mendoza','Salta'], comidas:['Asado','Empanadas','Milanesa','Alfajores'] },
  { code:'CL', nome:'Chile',         regiao:'América do Sul',   custoDia:38, moeda:'CLP', melhoresMeses:[10,11,12,3,4], estacao:'Varia muito por região', iata:'SCL', cidadePrincipal:'Santiago', coords:[-70.65,-33.45], fotoQuery:'Torres del Paine', cidades:['Santiago','Valparaíso','San Pedro de Atacama','Patagônia'], comidas:['Empanadas','Completo','Pastel de choclo','Cazuela'] },
  { code:'MX', nome:'México',        regiao:'América Central e Norte', custoDia:35, moeda:'MXN', melhoresMeses:[11,12,1,2,3,4], estacao:'Seca: nov–abr', iata:'MEX', cidadePrincipal:'Cidade do México', coords:[-99.13,19.43], fotoQuery:'Chichén Itzá', cidades:['Cidade do México','Oaxaca','Cancún','San Cristóbal'], comidas:['Tacos','Tamales','Mole','Chiles en nogada'] },
  { code:'GT', nome:'Guatemala',     regiao:'América Central e Norte', custoDia:25, moeda:'GTQ', melhoresMeses:[11,12,1,2,3], estacao:'Seca: nov–abr', iata:'GUA', cidadePrincipal:'Cidade da Guatemala', coords:[-90.51,14.63], fotoQuery:'Tikal', cidades:['Antígua','Lago Atitlán','Flores (Tikal)'], comidas:['Pepián','Tamales','Rellenitos'] },
  { code:'PT', nome:'Portugal',      regiao:'Europa',           custoDia:55, moeda:'EUR', melhoresMeses:[4,5,6,9,10], estacao:'Primavera e outono', iata:'LIS', cidadePrincipal:'Lisboa', coords:[-9.14,38.72], fotoQuery:'Lisboa', cidades:['Lisboa','Porto','Sintra','Lagos'], comidas:['Bacalhau','Pastel de nata','Francesinha','Caldo verde'] },
  { code:'GE', nome:'Geórgia',       regiao:'Cáucaso e Oriente Médio', custoDia:30, moeda:'GEL', melhoresMeses:[5,6,7,9,10], estacao:'Mai–out', iata:'TBS', cidadePrincipal:'Tbilisi', coords:[44.80,41.72], fotoQuery:'Tbilisi', cidades:['Tbilisi','Kazbegi','Batumi'], comidas:['Khachapuri','Khinkali','Churchkhela'] },
  { code:'TR', nome:'Turquia',       regiao:'Cáucaso e Oriente Médio', custoDia:32, moeda:'TRY', melhoresMeses:[4,5,6,9,10], estacao:'Primavera e outono', iata:'IST', cidadePrincipal:'Istambul', coords:[28.98,41.01], fotoQuery:'Capadócia', cidades:['Istambul','Capadócia','Antália','Pamukkale'], comidas:['Kebab','Meze','Baklava','Pide'] },
  { code:'MA', nome:'Marrocos',      regiao:'África',           custoDia:28, moeda:'MAD', melhoresMeses:[3,4,5,9,10], estacao:'Primavera e outono', iata:'RAK', cidadePrincipal:'Marraquexe', coords:[-7.98,31.63], fotoQuery:'Marraquexe', cidades:['Marraquexe','Fez','Chefchaouen','Essaouira'], comidas:['Tagine','Cuscuz','Pastilla','Chá de menta'] },
  { code:'ZA', nome:'África do Sul', regiao:'África',           custoDia:35, moeda:'ZAR', melhoresMeses:[5,6,7,8,9], estacao:'Inverno seco (melhor p/ safári)', iata:'CPT', cidadePrincipal:'Cidade do Cabo', coords:[18.42,-33.92], fotoQuery:'Cidade do Cabo', cidades:['Cidade do Cabo','Joanesburgo','Kruger','Garden Route'], comidas:['Braai','Bobotie','Biltong','Bunny chow'] },
];

// Catálogo final = 22 países curados + catálogo mundial gerado (base vence em conflito).
export const PAISES_REF = [...PAISES_BASE, ...PAISES_EXTRA];

export function refDe(code) { return PAISES_REF.find(p => p.code === code); }

export const PASSAPORTES = { BR:'Brasileiro 🇧🇷', US:'Americano 🇺🇸', UE:'UE / Portugal 🇪🇺', generico:'Outro / genérico' };

// Regras de visto turístico por passaporte → país. { tipo, dias, nota }.
export const VISTOS = {
  BR: {
    ...VISTOS_EXTRA_BR,
    TH:{tipo:'isento',dias:90,nota:'Acordo bilateral Brasil–Tailândia: isenção de ~90d p/ turismo. Vacina de febre amarela (CIVP) exigida.'},
    VN:{tipo:'e-visa',dias:90,nota:'e-visa obrigatório (evisa.gov.vn), até 90d (~US$25). Preencha o Arrival Card antes de embarcar.'},
    KH:{tipo:'e-visa',dias:30,nota:'e-visa ou visto on-arrival ~30d, extensível.'},
    LA:{tipo:'on-arrival',dias:30,nota:'Visto on-arrival ~30d (taxa em dólares).'},
    ID:{tipo:'isento',dias:30,nota:'Isento p/ turismo 30d (desde jul/2025); ou e-VOA ~US$35, estende +30d. Taxa turística de Bali à parte.'},
    MY:{tipo:'isento',dias:90,nota:'Isenção de visto p/ turismo ~90d (confirme no embarque).'},
    PH:{tipo:'isento',dias:30,nota:'Isenção ~30d, prorrogável na imigração local.'},
    IN:{tipo:'e-visa',dias:90,nota:'e-visa de turismo até 90d (múltiplas entradas). Vacina de febre amarela exigida.'},
    NP:{tipo:'on-arrival',dias:90,nota:'Visto on-arrival por faixa: 15d US$30, 30d US$50, 90d US$125. Febre amarela exigida.'},
    LK:{tipo:'e-visa',dias:30,nota:'ETA eletrônica ~30d.'},
    PE:{tipo:'isento',dias:90,nota:'Mercosul: entra com RG; ~90d, prorrogável (até ~183d/ano).'},
    BO:{tipo:'isento',dias:30,nota:'Mercosul: entra com RG; ~30d, prorrogável na imigração.'},
    CO:{tipo:'isento',dias:90,nota:'Entra com RG; ~90d, prorrogável até 180d/ano.'},
    AR:{tipo:'isento',dias:90,nota:'Mercosul: entra com RG; ~90d.'},
    CL:{tipo:'isento',dias:90,nota:'Mercosul: entra com RG; ~90d.'},
    MX:{tipo:'isento',dias:180,nota:'Isento; até ~180d a critério do oficial (FMM). Pode pedir comprovantes.'},
    GT:{tipo:'isento',dias:90,nota:'Zona CA-4 (~90d compartilhados com Honduras, El Salvador e Nicarágua).'},
    PT:{tipo:'isento',dias:90,nota:'Schengen: 90 dias dentro de 180 (todo o bloco somado). ETIAS previsto ~out/2026 (€20).'},
    GE:{tipo:'isento',dias:365,nota:'Isenção de até 365d. Seguro de saúde de viagem obrigatório a partir de 2026 (mín. ~30.000 GEL).'},
    TR:{tipo:'isento',dias:90,nota:'Isenção de visto p/ turismo até 90d (não precisa e-visa).'},
    MA:{tipo:'isento',dias:90,nota:'Isenção ~90d (passaporte válido por 6+ meses).'},
    ZA:{tipo:'isento',dias:90,nota:'Isenção ~90d.'},
  },
  US: {
    TH:{tipo:'isento',dias:60,nota:'Isenção de visto ~60d (extensível +30d). Cartão de chegada digital (TDAC) obrigatório.'},
    VN:{tipo:'e-visa',dias:90,nota:'e-visa obrigatório, até 90d (~US$25 entrada única).'},
    KH:{tipo:'e-visa',dias:30,nota:'e-visa/on-arrival ~30d, extensível.'},
    LA:{tipo:'on-arrival',dias:30,nota:'Visto on-arrival ~30d.'},
    ID:{tipo:'on-arrival',dias:30,nota:'e-VOA ~US$35, 30d, estende +30d (B1).'},
    MY:{tipo:'isento',dias:90,nota:'Isenção ~90d.'},
    PH:{tipo:'isento',dias:30,nota:'Isenção ~30d, prorrogável.'},
    IN:{tipo:'e-visa',dias:90,nota:'e-visa de turismo (30d / 1 ano / 5 anos); estadia contínua limitada.'},
    NP:{tipo:'on-arrival',dias:90,nota:'Visto on-arrival 15/30/90d (paga por faixa).'},
    LK:{tipo:'e-visa',dias:30,nota:'ETA eletrônica ~30d.'},
    PE:{tipo:'isento',dias:90,nota:'Isenção; ~90d, até ~183d/ano a critério da imigração.'},
    BO:{tipo:'isento',dias:90,nota:'Isento desde dez/2025: ~90d/ano para turismo (antes exigia visto).'},
    CO:{tipo:'isento',dias:90,nota:'Isenção ~90d, até 180d/ano.'},
    AR:{tipo:'isento',dias:90,nota:'Isenção ~90d.'},
    CL:{tipo:'isento',dias:90,nota:'Isenção ~90d.'},
    MX:{tipo:'isento',dias:180,nota:'Isento; até ~180d a critério do oficial (FMM).'},
    GT:{tipo:'isento',dias:90,nota:'Zona CA-4 (~90d compartilhados).'},
    PT:{tipo:'isento',dias:90,nota:'Schengen 90/180. ETIAS previsto ~out/2026 (€20).'},
    GE:{tipo:'isento',dias:365,nota:'Isenção de até 365d. Seguro de viagem obrigatório a partir de 2026.'},
    TR:{tipo:'isento',dias:90,nota:'Isenção ~90d em 180 (e-visa não mais exigido).'},
    MA:{tipo:'isento',dias:90,nota:'Isenção ~90d.'},
    ZA:{tipo:'isento',dias:90,nota:'Isenção ~90d.'},
  },
  UE: {
    TH:{tipo:'isento',dias:60,nota:'Cidadãos da UE: isenção ~60d (extensível +30d). TDAC obrigatório.'},
    VN:{tipo:'e-visa',dias:90,nota:'Portugal não está na isenção de 45d; use e-visa até 90d.'},
    KH:{tipo:'e-visa',dias:30,nota:'e-visa/on-arrival ~30d.'},
    LA:{tipo:'on-arrival',dias:30,nota:'Visto on-arrival ~30d.'},
    ID:{tipo:'on-arrival',dias:30,nota:'e-VOA ~US$35, 30d, estende +30d.'},
    MY:{tipo:'isento',dias:90,nota:'Isenção ~90d.'},
    PH:{tipo:'isento',dias:30,nota:'Isenção ~30d, prorrogável.'},
    IN:{tipo:'e-visa',dias:90,nota:'e-visa de turismo até 90d.'},
    NP:{tipo:'on-arrival',dias:90,nota:'Visto on-arrival 15/30/90d.'},
    LK:{tipo:'e-visa',dias:30,nota:'ETA eletrônica ~30d.'},
    PE:{tipo:'isento',dias:90,nota:'Isenção ~90d.'},
    BO:{tipo:'isento',dias:90,nota:'Isenção ~90d.'},
    CO:{tipo:'isento',dias:90,nota:'Isenção ~90d, até 180d/ano.'},
    AR:{tipo:'isento',dias:90,nota:'Isenção ~90d.'},
    CL:{tipo:'isento',dias:90,nota:'Isenção ~90d.'},
    MX:{tipo:'isento',dias:180,nota:'Isento; até ~180d a critério do oficial.'},
    GT:{tipo:'isento',dias:90,nota:'Zona CA-4 (~90d).'},
    PT:{tipo:'isento',dias:3650,nota:'País de cidadania / livre circulação na UE: sem limite de permanência como turista.'},
    GE:{tipo:'isento',dias:365,nota:'Isenção de até 365d. Seguro de viagem obrigatório a partir de 2026.'},
    TR:{tipo:'isento',dias:90,nota:'Isenção ~90d em 180.'},
    MA:{tipo:'isento',dias:90,nota:'Isenção ~90d.'},
    ZA:{tipo:'isento',dias:90,nota:'Isenção ~90d.'},
  },
  generico: {
    TH:{tipo:'isento',dias:30,nota:'Isenção turística ~30d (varia muito por nacionalidade).'},
    VN:{tipo:'e-visa',dias:90,nota:'e-visa eletrônico até ~90d.'},
    KH:{tipo:'e-visa',dias:30,nota:'e-visa/on-arrival ~30d, extensível.'},
    LA:{tipo:'on-arrival',dias:30,nota:'Visto on-arrival ~30d.'},
    ID:{tipo:'on-arrival',dias:30,nota:'VOA ~30d, extensível +30d.'},
    MY:{tipo:'isento',dias:90,nota:'Isenção ~90d comum.'},
    PH:{tipo:'isento',dias:30,nota:'Isenção ~30d, extensível.'},
    IN:{tipo:'e-visa',dias:30,nota:'e-visa turística (30d / 1 ano / 5 anos).'},
    NP:{tipo:'on-arrival',dias:90,nota:'VOA 15/30/90d (paga por faixa).'},
    LK:{tipo:'e-visa',dias:30,nota:'ETA eletrônica ~30d.'},
    PE:{tipo:'isento',dias:90,nota:'Isenção ~90–183d (a critério da imigração).'},
    BO:{tipo:'isento',dias:90,nota:'Isenção ~90d (varia por nacionalidade).'},
    CO:{tipo:'isento',dias:90,nota:'Isenção ~90d, prorrogável até 180/ano.'},
    AR:{tipo:'isento',dias:90,nota:'Isenção ~90d.'},
    CL:{tipo:'isento',dias:90,nota:'Isenção ~90d.'},
    MX:{tipo:'isento',dias:180,nota:'Até ~180d a critério do oficial (FMM).'},
    GT:{tipo:'isento',dias:90,nota:'Zona CA-4 ~90d.'},
    PT:{tipo:'isento',dias:90,nota:'Schengen: 90 dias dentro de 180.'},
    GE:{tipo:'isento',dias:365,nota:'Isenção de até ~1 ano para muitas nacionalidades.'},
    TR:{tipo:'e-visa',dias:90,nota:'e-visa ou isenção ~90d em 180 (varia).'},
    MA:{tipo:'isento',dias:90,nota:'Isenção ~90d.'},
    ZA:{tipo:'isento',dias:90,nota:'Isenção ~90d.'},
  },
};

// Resolve a regra de visto p/ país e passaporte, com fallback seguro.
export function vistoDe(code, passaporte) {
  const tab = VISTOS[passaporte] || VISTOS.generico;
  // Sem regra verificada NÃO é "isento": OMEGA V4 §35 proíbe inventar política de visto.
  // 'consultar' + dias 0 → statusVisto devolve 'na' e a UI pede a fonte oficial.
  return tab[code] || VISTOS.generico[code] || { tipo:'consultar', dias:0, nota:'Sem regra verificada para este passaporte — consulte o consulado/embaixada antes de comprar.' };
}

/* ---- Moedas + câmbio ---- */
// Lista de moedas comuns em mochilão. Símbolo é resolvido via Intl em utils.
export const MOEDAS = [
  { code:'USD', nome:'Dólar americano' }, { code:'BRL', nome:'Real brasileiro' },
  { code:'EUR', nome:'Euro' }, { code:'GBP', nome:'Libra' },
  { code:'THB', nome:'Baht (Tailândia)' }, { code:'VND', nome:'Dong (Vietnã)' },
  { code:'IDR', nome:'Rupia (Indonésia)' }, { code:'INR', nome:'Rupia (Índia)' },
  { code:'NPR', nome:'Rupia (Nepal)' }, { code:'LKR', nome:'Rupia (Sri Lanka)' },
  { code:'PEN', nome:'Sol (Peru)' }, { code:'BOB', nome:'Boliviano' },
  { code:'COP', nome:'Peso (Colômbia)' }, { code:'ARS', nome:'Peso (Argentina)' },
  { code:'CLP', nome:'Peso (Chile)' }, { code:'MXN', nome:'Peso (México)' },
  { code:'GTQ', nome:'Quetzal (Guatemala)' }, { code:'GEL', nome:'Lari (Geórgia)' },
  { code:'TRY', nome:'Lira (Turquia)' }, { code:'MAD', nome:'Dirham (Marrocos)' },
  { code:'ZAR', nome:'Rand (África do Sul)' }, { code:'MYR', nome:'Ringgit (Malásia)' },
  { code:'PHP', nome:'Peso (Filipinas)' }, { code:'KHR', nome:'Riel (Camboja)' },
  { code:'LAK', nome:'Kip (Laos)' }, { code:'JPY', nome:'Iene (Japão)' },
  { code:'AUD', nome:'Dólar australiano' },
  ...MOEDAS_EXTRA,
];

// Câmbio inicial aproximado (base USD), revisado jun/2026. Atualizado automaticamente
// pela API gratuita quando há internet; serve de fallback offline e fica editável.
export const SEED_FX = {
  base: 'USD',
  atualizadoEm: 0,
  rates: {
    ...FX_EXTRA,
    USD:1, BRL:5.5, EUR:0.92, GBP:0.78, THB:36, VND:25400, IDR:16200, INR:85,
    NPR:136, LKR:300, PEN:3.75, BOB:6.9, COP:4100, ARS:950, CLP:950, MXN:18,
    GTQ:7.8, GEL:2.7, TRY:38, MAD:10, ZAR:18.5, MYR:4.6, PHP:57, KHR:4100,
    LAK:21700, JPY:157, AUD:1.5,
  },
};

export const AI_PROVIDERS = {
  openai:    { label:'OpenAI-compatível', baseUrl:'https://api.openai.com/v1',      model:'gpt-4o-mini',              keyHint:'sk-...' },
  groq:      { label:'Groq (free tier)',  baseUrl:'https://api.groq.com/openai/v1', model:'llama-3.3-70b-versatile',  keyHint:'gsk_...' },
  anthropic: { label:'Anthropic (Claude)',baseUrl:'https://api.anthropic.com',      model:'claude-3-5-sonnet-latest', keyHint:'sk-ant-...' },
  custom:    { label:'Custom (OpenAI-compatível)', baseUrl:'',                       model:'',                         keyHint:'sua chave' },
};

/* ---- System prompts das features de IA (por extenso, pt-BR) ---- */

export const SYSTEM_PROMPT_OTIMIZADOR = `Você é um especialista em logística de viagens longas de mochilão econômico (meses a anos, vários continentes, perfil voluntariado/troca e custo diário baixo). Sua tarefa é REORDENAR uma lista de trechos (países) de uma única viagem contínua, mantendo TODOS os trechos e a MESMA quantidade de dias de cada um, otimizando dois objetivos nesta prioridade:

1) ESTAÇÃO: fazer cada país na melhor época climática possível (evitar monção, temporada de chuvas, calor ou frio extremos). Lembre-se: a data de início da viagem é fixa e a data de chegada de cada trecho é a soma dos dias dos trechos anteriores — então mudar a ordem muda o mês em que a pessoa chega em cada país.
2) GEOGRAFIA: minimizar zigue-zague — agrupar países da mesma região/continente e seguir um fluxo terrestre lógico, reduzindo deslocamentos longos e idas-e-vindas desnecessárias.

Regras:
- NÃO invente países nem altere a duração (dias) de nenhum trecho.
- Use EXATAMENTE os mesmos identificadores (id) recebidos, cada um uma única vez, sem faltar nem repetir.
- Seja realista: nem toda estação é perfeita. Se um conflito for inevitável, escolha o menor mal e explique.
- Justificativas curtas, diretas, em português (pt-BR), no máximo ~140 caracteres cada.

Responda SOMENTE com um JSON válido, sem markdown, sem comentários e sem texto antes ou depois, exatamente neste formato:
{
  "order": ["id_na_nova_ordem", "..."],
  "rationales": { "id": "por que este país nesta posição/época" },
  "resumo": "1 a 2 frases resumindo a lógica da nova rota"
}`;

export const SYSTEM_PROMPT_OPORTUNIDADES = `Você é um especialista em viagem-trabalho e voluntariado para mochileiros de orçamento apertado (estilo Workaway, HelpX, WWOOF, trabalho em hostel/recepção, ensino de idiomas, cuidar de casa e animais, etc.). Para o país informado, sugira TIPOS realistas de troca/voluntariado que reduzam o custo diário da viagem — geralmente trocando algumas horas de trabalho por hospedagem e, às vezes, comida.

Regras:
- Seja realista e específico para o contexto do país/região; nada de promessas fantasiosas.
- Para cada oportunidade, estime de forma CONSERVADORA quanto ela reduz o CUSTO DIÁRIO (na mesma moeda informada), lembrando que normalmente cobre hospedagem e às vezes comida, mas raramente transporte.
- Traga de 3 a 4 oportunidades. Texto em português (pt-BR), curto e prático, tom "mão na roda".
- Deixe implícito que são estimativas e que a disponibilidade varia por temporada e cidade.

Responda SOMENTE com um JSON válido, sem markdown e sem texto antes ou depois, exatamente neste formato:
{
  "oportunidades": [
    { "tipo": "nome curto", "descricao": "como funciona, ~160 caracteres", "economiaDiaEstimada": 15, "comoComecar": "primeiro passo, ~120 caracteres" }
  ]
}`;

export const SYSTEM_PROMPT_ROTEIRO = `Você é um planejador de viagens especialista que monta ROTEIROS dia a dia realistas, econômicos e geograficamente lógicos, em português (pt-BR). Receberá um destino e preferências (dias, orçamento, ritmo, interesses, restrição alimentar, nível de conforto). Monte um roteiro coerente.

Regras:
- Agrupe atividades próximas no mesmo dia (minimize deslocamento) e considere o tempo de transporte entre elas.
- Respeite o RITMO: tranquilo = 2-3 atividades/dia; equilibrado = 3-4; intenso = 4-6.
- Considere ORÇAMENTO e CONFORTO nas escolhas (hospedagem, comida, transporte). Respeite a RESTRIÇÃO alimentar nas sugestões de comida.
- Use atrações REAIS e conhecidas do destino quando possível. Custos são ESTIMATIVAS, na moeda informada.
- SEMPRE inclua, por dia, ao menos um item com alternativa grátis ("gratis") e plano B de chuva ("planoB").
- Texto curto e direto em cada campo (nada de encher linguiça).

Responda SOMENTE com um JSON válido, sem markdown, sem comentários e sem texto antes ou depois, exatamente neste formato:
{
  "resumo": "1-2 frases sobre a lógica do roteiro",
  "custoEstimado": "faixa total por pessoa, ex.: 'US$ 350–520' (fora passagem internacional)",
  "dias": [
    {
      "dia": 1,
      "titulo": "tema curto do dia",
      "itens": [
        { "hora": "09:00", "atividade": "o que fazer", "local": "lugar específico", "duracao": "~2h", "custo": "~US$ 15", "categoria": "cultura|natureza|gastronomia|praia|compras|vida noturna|aventura|descanso", "planoB": "alternativa se chover", "gratis": "opção grátis relacionada ou string vazia", "dica": "dica prática curta" }
      ]
    }
  ],
  "checklist": ["item de preparação prático"],
  "documentos": ["documento, visto ou vacina relevante"],
  "seguranca": ["alerta de segurança prático e específico do destino"],
  "economia": ["dica de economia específica do destino"]
}`;
