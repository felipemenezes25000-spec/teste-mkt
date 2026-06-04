/* =============================================================================
   DICAS PRÁTICAS POR DESTINO — "antes de ir"
   ---------------------------------------------------------------------------
   Segurança, golpes comuns, saúde/vacinas, transporte local e conectividade.
   Curadoria por REGIÃO (com overrides por país) — ESTIMATIVAS de referência, não
   substituem a fonte oficial (Itamaraty/embaixada/Anvisa). Função PURA.
   ========================================================================== */
import { refDe } from './data.js';

const POR_REGIAO = {
  'Sudeste Asiático': {
    seguranca: ['Geralmente seguro pra turistas; atenção a batedores de carteira em mercados e ônibus lotados.', 'Trânsito caótico — cuidado ao atravessar e ao alugar moto (use capacete e confira o seguro).'],
    golpes: ['Tuk-tuk/táxi que "leva numa loja de amigo": recuse desvios e combine o preço antes.', 'Golpe do "templo fechado hoje" empurrando um passeio alternativo caro.', 'Confira o troco e desconfie de "promoções" com pressa.'],
    saude: ['Água da torneira não é potável — beba engarrafada/filtrada.', 'Vacinas comuns recomendadas: hepatite A e tifóide; febre amarela exigida na entrada de alguns países (confirme).', 'Repelente e atenção à dengue; antimalárico em áreas rurais específicas.'],
    transporte: ['Apps tipo Grab funcionam bem e evitam negociação.', 'Ônibus e trens noturnos conectam barato; reserve cedo na alta temporada.'],
    conectividade: ['eSIM/chip local é barato e fácil (aeroporto ou app). 4G amplo nas cidades.', 'Wi-Fi comum em hostels e cafés.'],
  },
  'Sul da Ásia': {
    seguranca: ['Cidades intensas; mulheres viajando sozinhas redobrem a atenção à noite.', 'Multidões e trânsito exigem cuidado com pertences.'],
    golpes: ['"Seu hotel fechou/mudou" levando a outro com comissão — confirme direto com o hotel.', 'Guias e agências falsas na rua; prefira reservar por canais oficiais.', 'Excesso de cobrança em táxi sem taxímetro — use app ou combine antes.'],
    saude: ['Risco alto de problema gastrointestinal — só água engarrafada, evite gelo e crus.', 'Vacinas: hepatite A, tifóide; febre amarela exigida na entrada (Índia/Nepal). Considere raiva em estadias longas.', 'Antimalárico em regiões específicas; repelente sempre.'],
    transporte: ['Trens são uma experiência, mas reserve com MUITA antecedência.', 'Apps (Ola/Uber) nas grandes cidades reduzem dor de cabeça.'],
    conectividade: ['Chip local exige documento/registro mas é barato; eSIM ajuda. 4G bom nas cidades.'],
  },
  'América do Sul': {
    seguranca: ['Evite "dar sopa" com celular/câmera em áreas movimentadas; assalto-relâmpago existe nas capitais.', 'Use apenas táxi por app ou ponto oficial, sobretudo à noite.'],
    golpes: ['Golpe da "mancha na roupa" pra te distrair e furtar.', 'Notas falsas e troco errado — confira o dinheiro.', 'Caixa eletrônico clonado: prefira ATMs dentro de bancos/shoppings.'],
    saude: ['Altitude nos Andes (Cusco, La Paz): suba devagar, hidrate, chá de coca ajuda.', 'Febre amarela exigida/recomendada em áreas de Amazônia; leve o certificado (CIVP).', 'Água engarrafada na maior parte; cuidado com crus em barracas.'],
    transporte: ['Ônibus "cama/semi-cama" são ótimos pra longas distâncias.', 'Apps de táxi nas capitais; combine preço onde não houver.'],
    conectividade: ['Chip local barato (Claro/Movistar/Entel). 4G bom nas cidades, fraco em trechos remotos da Patagônia/Altiplano.'],
  },
  'América Central e Norte': {
    seguranca: ['Varia MUITO por bairro/região — pesquise zonas a evitar antes.', 'Não exiba valores; transporte por app à noite.'],
    golpes: ['Táxi sem taxímetro cobrando a mais — combine ou use app.', 'Falsos "tours" e ingressos; compre em canais oficiais.'],
    saude: ['Água engarrafada; cuidado com gelo e crus fora de lugares confiáveis.', 'Hepatite A e tifóide recomendadas; febre amarela em áreas específicas.', 'Repelente contra dengue/zika.'],
    transporte: ['Apps de transporte nas cidades grandes; ônibus de 1ª classe entre cidades.', 'Colectivos baratos, mas confirme rota.'],
    conectividade: ['Chip Telcel/local barato; eSIM fácil. 4G bom nas áreas turísticas.'],
  },
  'Europa': {
    seguranca: ['Muito seguro no geral; o risco real é BATEDOR DE CARTEIRA em pontos turísticos e metrô.', 'Cuidado em estações lotadas e ao subir/descer do transporte.'],
    golpes: ['Pulseirinha/abaixo-assinado/"jogo das três cartas" pra distrair e furtar.', 'Taxistas que ignoram o taxímetro em saída de aeroporto — use app ou trem.', 'Restaurante turístico sem preço no cardápio: confirme antes.'],
    saude: ['Água da torneira potável na maior parte.', 'Sem vacinas especiais; leve o Cartão Europeu de Seguro ou seu seguro-viagem (exigido no Schengen).'],
    transporte: ['Trem é rei — passes (Eurail) e antecedência rendem economia.', 'Apps de mobilidade e transporte público excelente nas cidades.'],
    conectividade: ['eSIM cobre o bloco todo; roaming dentro da UE costuma ser incluso. 4G/5G amplo.'],
  },
  'Cáucaso e Oriente Médio': {
    seguranca: ['Hospitalidade alta e baixa criminalidade de rua na maioria dos destinos turísticos.', 'Confira alertas regionais atualizados antes de ir (situação muda).'],
    golpes: ['Câmbio na rua com taxa ruim/nota falsa — troque em casa de câmbio oficial.', 'Táxi sem taxímetro; combine o valor antes.', 'Bazar: pechinche, mas desconfie de "preço especial só hoje".'],
    saude: ['Água engarrafada por segurança; hepatite A recomendada.', 'Sol forte — hidratação e protetor.'],
    transporte: ['Marshrutkas (vans) são baratas; apps de táxi (Bolt/Yandex) nas capitais.'],
    conectividade: ['Chip local muito barato (ex.: Geórgia/Turquia). 4G bom nas cidades.'],
  },
  'África': {
    seguranca: ['Varia muito por país e bairro; pesquise zonas e ande acompanhado à noite.', 'Transporte por app/hotel; evite exibir valores.'],
    golpes: ['"Guias" não solicitados e comissão em lojas; combine tudo antes.', 'Câmbio de rua e ATMs suspeitos — prefira bancos.'],
    saude: ['Febre amarela frequentemente EXIGIDA na entrada — leve o certificado (CIVP).', 'Antimalárico em muitas áreas; repelente e mosquiteiro.', 'Água engarrafada; hepatite A e tifóide recomendadas.'],
    transporte: ['Distâncias grandes — voos internos e transfers de safári; combine logística antes.'],
    conectividade: ['Chip local (ex.: Vodacom/MTN) barato; 4G nas cidades, fraco em parques/rural.'],
  },
};

// Overrides por país (acrescentam itens específicos ao da região).
const POR_PAIS = {
  IN: { golpes: ['Em Délhi/Agra, falsos "escritórios de turismo do governo" — só use o oficial (India Tourism).'] },
  BO: { saude: ['La Paz/Uyuni a 3.600m+: o soroche (mal de altitude) é real — chegue sem esforço no 1º dia.'] },
  PE: { saude: ['Cusco (3.400m): aclimatize antes de Machu Picchu; ande devagar no 1º dia.'] },
  ZA: { seguranca: ['Cidade do Cabo/Joanesburgo: não caminhe à noite, use carro/app; pesquise bairros.'] },
  TH: { golpes: ['Aluguel de moto/jetski com "dano pré-existente" cobrado depois — fotografe tudo na retirada.'] },
  MA: { golpes: ['Na medina de Marraquexe, "o caminho está fechado, eu te levo" → cobra depois. Use maps offline.'] },
};

const VAZIO = { seguranca: [], golpes: [], saude: [], transporte: [], conectividade: [] };

export function dicasDe(code) {
  const ref = refDe(code);
  const base = (ref && POR_REGIAO[ref.regiao]) || VAZIO;
  const over = POR_PAIS[code] || {};
  const out = {};
  for (const k of Object.keys(VAZIO)) {
    out[k] = [...(base[k] || []), ...(over[k] || [])];
  }
  return out;
}

export const SECOES_DICAS = [
  { id: 'seguranca', label: 'Segurança', icon: '🛡️' },
  { id: 'golpes', label: 'Golpes comuns', icon: '⚠️' },
  { id: 'saude', label: 'Saúde & vacinas', icon: '💉' },
  { id: 'transporte', label: 'Transporte local', icon: '🚍' },
  { id: 'conectividade', label: 'Internet & chip', icon: '📶' },
];
