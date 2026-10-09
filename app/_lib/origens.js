// Origens de partida (aeroportos) para estimativas de passagem. Curadoria pequena
// e explícita: capitais brasileiras com voo internacional e hubs mundiais. Cidades
// homônimas são desambiguadas pelo país e pelo código IATA. Coordenadas = aeroporto.
export const ORIGENS = [
  { iata: 'GRU', cidade: 'São Paulo', pais: 'Brasil', coords: [-46.47, -23.43] },
  { iata: 'VCP', cidade: 'Campinas', pais: 'Brasil', coords: [-47.13, -23.01] },
  { iata: 'GIG', cidade: 'Rio de Janeiro', pais: 'Brasil', coords: [-43.25, -22.81] },
  { iata: 'BSB', cidade: 'Brasília', pais: 'Brasil', coords: [-47.92, -15.87] },
  { iata: 'CNF', cidade: 'Belo Horizonte', pais: 'Brasil', coords: [-43.97, -19.62] },
  { iata: 'POA', cidade: 'Porto Alegre', pais: 'Brasil', coords: [-51.17, -29.99] },
  { iata: 'CWB', cidade: 'Curitiba', pais: 'Brasil', coords: [-49.18, -25.53] },
  { iata: 'FLN', cidade: 'Florianópolis', pais: 'Brasil', coords: [-48.55, -27.67] },
  { iata: 'SSA', cidade: 'Salvador', pais: 'Brasil', coords: [-38.32, -12.91] },
  { iata: 'REC', cidade: 'Recife', pais: 'Brasil', coords: [-34.92, -8.13] },
  { iata: 'FOR', cidade: 'Fortaleza', pais: 'Brasil', coords: [-38.53, -3.78] },
  { iata: 'NAT', cidade: 'Natal', pais: 'Brasil', coords: [-35.37, -5.77] },
  { iata: 'BEL', cidade: 'Belém', pais: 'Brasil', coords: [-48.48, -1.38] },
  { iata: 'MAO', cidade: 'Manaus', pais: 'Brasil', coords: [-60.05, -3.04] },
  { iata: 'GYN', cidade: 'Goiânia', pais: 'Brasil', coords: [-49.23, -16.63] },
  { iata: 'VIX', cidade: 'Vitória', pais: 'Brasil', coords: [-40.29, -20.26] },
  { iata: 'LIS', cidade: 'Lisboa', pais: 'Portugal', coords: [-9.14, 38.77] },
  { iata: 'OPO', cidade: 'Porto', pais: 'Portugal', coords: [-8.68, 41.24] },
  { iata: 'MAD', cidade: 'Madri', pais: 'Espanha', coords: [-3.57, 40.49] },
  { iata: 'LHR', cidade: 'Londres', pais: 'Reino Unido', coords: [-0.45, 51.47] },
  { iata: 'CDG', cidade: 'Paris', pais: 'França', coords: [2.55, 49.01] },
  { iata: 'FRA', cidade: 'Frankfurt', pais: 'Alemanha', coords: [8.57, 50.04] },
  { iata: 'JFK', cidade: 'Nova York', pais: 'Estados Unidos', coords: [-73.78, 40.64] },
  { iata: 'MIA', cidade: 'Miami', pais: 'Estados Unidos', coords: [-80.29, 25.8] },
  { iata: 'MEX', cidade: 'Cidade do México', pais: 'México', coords: [-99.07, 19.44] },
  { iata: 'EZE', cidade: 'Buenos Aires', pais: 'Argentina', coords: [-58.54, -34.82] },
  { iata: 'SCL', cidade: 'Santiago', pais: 'Chile', coords: [-70.79, -33.39] },
  { iata: 'LIM', cidade: 'Lima', pais: 'Peru', coords: [-77.11, -12.02] },
  { iata: 'BOG', cidade: 'Bogotá', pais: 'Colômbia', coords: [-74.15, 4.7] },
  { iata: 'MVD', cidade: 'Montevidéu', pais: 'Uruguai', coords: [-56.03, -34.84] },
  { iata: 'NRT', cidade: 'Tóquio', pais: 'Japão', coords: [140.39, 35.77] },
  { iata: 'DXB', cidade: 'Dubai', pais: 'Emirados Árabes Unidos', coords: [55.36, 25.25] },
  { iata: 'SIN', cidade: 'Singapura', pais: 'Singapura', coords: [103.99, 1.36] },
  { iata: 'SYD', cidade: 'Sydney', pais: 'Austrália', coords: [151.18, -33.94] },
  { iata: 'JNB', cidade: 'Joanesburgo', pais: 'África do Sul', coords: [28.24, -26.13] },
  { iata: 'YYZ', cidade: 'Toronto', pais: 'Canadá', coords: [-79.62, 43.68] },
];

const sem = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/** Busca tolerante a acento e caixa por cidade, país ou IATA; IATA exato vem primeiro. */
export function buscarOrigens(q, limite = 6) {
  const t = sem(q);
  if (!t) return ORIGENS.slice(0, limite);
  const exato = ORIGENS.filter((o) => sem(o.iata) === t);
  const resto = ORIGENS.filter((o) => !exato.includes(o) && (sem(o.cidade).includes(t) || sem(o.pais).includes(t) || sem(o.iata).startsWith(t)));
  return [...exato, ...resto].slice(0, limite);
}

export function origemPorIata(iata) {
  return ORIGENS.find((o) => o.iata === String(iata || '').toUpperCase()) || null;
}
