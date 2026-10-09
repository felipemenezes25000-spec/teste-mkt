// "Adaptar para minha viagem": transforma um roteiro do marketplace (equipe ou
// criador) numa viagem do workspace local, dia a dia, com as coordenadas.
import { novaViagem, adicionarViagem, adicionarItem } from '../viagens/store.js';

const somaDias = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

/**
 * @param {object} estado  estado do store de viagens
 * @param {{ titulo: string, destinoCode: string, destinoNome: string, dias: Array<{ dia: number, itens: Array<object> }> }} roteiro
 * @param {{ inicio: string, pessoas?: number, moeda?: string, orcamento?: number, timeZone?: string }} opcoes
 * @returns {{ estado: object, id: string }}
 */
export function viagemDeRoteiro(estado, roteiro, opcoes) {
  if (!roteiro || !Array.isArray(roteiro.dias) || !roteiro.dias.length) throw new Error('Roteiro vazio.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(opcoes.inicio || '')) throw new Error('Escolha a data de ida.');
  const n = roteiro.dias.length;
  const v = novaViagem({
    titulo: roteiro.titulo,
    destinoCode: roteiro.destinoCode,
    destinoNome: roteiro.destinoNome,
    inicio: opcoes.inicio,
    fim: somaDias(opcoes.inicio, n - 1),
    pessoas: opcoes.pessoas || 2,
    moeda: opcoes.moeda || 'BRL',
    orcamento: opcoes.orcamento || 0,
    timeZone: opcoes.timeZone || 'UTC',
  });
  let e = adicionarViagem(estado, v);
  for (const d of roteiro.dias) {
    const dia = v.dias[Math.min(v.dias.length - 1, Math.max(0, (Number(d.dia) || 1) - 1))];
    for (const it of d.itens || []) {
      e = adicionarItem(e, v.id, {
        dia, titulo: it.titulo, placeId: it.placeId || null, lat: it.lat, lng: it.lng,
        duracaoMin: it.duracaoMin || 120, notas: it.notas || '',
      });
    }
  }
  return { estado: e, id: v.id };
}
