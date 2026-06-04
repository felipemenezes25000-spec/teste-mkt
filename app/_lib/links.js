// Deep-links de reserva/serviços — só construção de URL (sem API/afiliado). Abrem
// a busca certa no parceiro. Trocáveis por links de afiliado quando houver conta.
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

// Conjunto de deep-links úteis pra um destino (cidade/país).
export function linksDestino(cidade, pais) {
  return [
    { id: 'booking', label: 'Booking', icon: '🏨', desc: 'Hotéis & hostels', url: linkBooking(cidade, pais) },
    { id: 'airbnb', label: 'Airbnb', icon: '🏠', desc: 'Casas & apês', url: linkAirbnb(cidade, pais) },
    { id: 'gyg', label: 'GetYourGuide', icon: '🎟️', desc: 'Passeios & ingressos', url: linkGetYourGuide(`${cidade} ${pais}`) },
    { id: 'viator', label: 'Viator', icon: '🚎', desc: 'Tours & experiências', url: linkViator(`${cidade}`) },
    { id: 'tripadvisor', label: 'TripAdvisor', icon: '⭐', desc: 'Avaliações', url: linkTripadvisor(`${cidade} ${pais}`) },
    { id: 'rome2rio', label: 'Rome2Rio', icon: '🧭', desc: 'Como chegar', url: linkRome2Rio(pais, cidade) },
  ];
}
