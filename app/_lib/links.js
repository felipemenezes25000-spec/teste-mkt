// Deep-links de reserva/serviços. As URLs base abrem a busca certa no parceiro;
// `withAffiliate` injeta a tag de afiliado quando a env existe (no-op seguro sem ela).
import { withAffiliate } from '../_engine/afiliados.js';

const enc = encodeURIComponent;

export function linkBooking(cidade, pais) { return `https://www.booking.com/searchresults.html?ss=${enc(`${cidade}, ${pais}`)}`; }
export function linkAirbnb(cidade, pais) { return `https://www.airbnb.com.br/s/${enc(`${cidade}, ${pais}`)}/homes`; }
export function linkGetYourGuide(q) { return `https://www.getyourguide.com/s/?q=${enc(q)}`; }
export function linkViator(q) { return `https://www.viator.com/searchResults/all?text=${enc(q)}`; }
export function linkTripadvisor(q) { return `https://www.tripadvisor.com.br/Search?q=${enc(q)}`; }
export function linkRome2Rio(origem, destino) { return `https://www.rome2rio.com/map/${enc(origem || '')}/${enc(destino || '')}`; }
export function linkGoogleFlights(origemCidade, destinoCidade, dataISO) {
  return 'https://www.google.com/travel/flights?q=' + enc(`voos ${origemCidade || ''} para ${destinoCidade} ${dataISO || ''}`);
}

// Conjunto de deep-links úteis pra um destino (cidade/país). Cada URL já sai
// decorada com a tag de afiliado do parceiro (quando configurada). `airbnb`,
// `tripadvisor` e `rome2rio` não pagam afiliado → withAffiliate é no-op neles.
export function linksDestino(cidade, pais) {
  return [
    { id: 'booking', label: 'Booking', icon: '🏨', desc: 'Hotéis & hostels', url: withAffiliate(linkBooking(cidade, pais), 'booking') },
    { id: 'airbnb', label: 'Airbnb', icon: '🏠', desc: 'Casas & apês', url: withAffiliate(linkAirbnb(cidade, pais), 'airbnb') },
    { id: 'gyg', label: 'GetYourGuide', icon: '🎟️', desc: 'Passeios & ingressos', url: withAffiliate(linkGetYourGuide(`${cidade} ${pais}`), 'getyourguide') },
    { id: 'viator', label: 'Viator', icon: '🚎', desc: 'Tours & experiências', url: withAffiliate(linkViator(`${cidade}`), 'viator') },
    { id: 'tripadvisor', label: 'TripAdvisor', icon: '⭐', desc: 'Avaliações', url: withAffiliate(linkTripadvisor(`${cidade} ${pais}`), 'tripadvisor') },
    { id: 'rome2rio', label: 'Rome2Rio', icon: '🧭', desc: 'Como chegar', url: withAffiliate(linkRome2Rio(pais, cidade), 'rome2rio') },
  ];
}

// Mapeia a categoria de um item de roteiro → CTA de reserva (parceiro + URL
// decorada). Hospedagem e passeios são monetizáveis; transporte abre "como chegar";
// comida e outros não têm CTA por ora (Fatia 1). Devolve null se não houver CTA.
export function linkPorCategoria(categoria, cidade, pais) {
  const cat = (categoria || '').toLowerCase();
  const q = `${cidade || ''} ${pais || ''}`.trim();
  if (/hosped|hotel|dorm|hostel|estad/.test(cat))
    return { parceiro: 'booking', label: 'Reservar hospedagem', icon: '🏨', url: withAffiliate(linkBooking(cidade, pais), 'booking') };
  if (/atra|passe|tour|ingress|museu|experi|visit/.test(cat))
    return { parceiro: 'viator', label: 'Reservar passeio', icon: '🎟️', url: withAffiliate(linkViator(q || cidade), 'viator') };
  if (/transp|voo|trem|ônibus|onibus|ferry|transfer|desloc/.test(cat))
    return { parceiro: 'rome2rio', label: 'Como chegar', icon: '🧭', url: withAffiliate(linkRome2Rio(pais, cidade), 'rome2rio') };
  return null;
}
