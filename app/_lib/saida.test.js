import { describe, it, expect } from 'vitest';
import { hostPermitido, linkSaida } from './saida.js';

describe('saída para parceiros (anti open redirect)', () => {
  it('aceita só https de parceiros conhecidos', () => {
    expect(hostPermitido('https://www.booking.com/searchresults.html?ss=x')).toBe(true);
    expect(hostPermitido('https://www.viator.com/searchResults/all?text=a')).toBe(true);
    expect(hostPermitido('http://www.booking.com/')).toBe(false);
    expect(hostPermitido('https://booking.com.evil.io/')).toBe(false);
    expect(hostPermitido('https://evilbooking.com/')).toBe(false);
    expect(hostPermitido('https://user:pw@booking.com/')).toBe(false);
    expect(hostPermitido('javascript:alert(1)')).toBe(false);
    expect(hostPermitido('//evil.com')).toBe(false);
  });
  it('monta link rastreado só para parceiros', () => {
    expect(linkSaida('https://www.booking.com/x', 'booking', 'hotel')).toMatch(/^\/api\/out\?to=https%3A%2F%2Fwww\.booking\.com%2Fx&p=booking&k=hotel$/);
    expect(linkSaida('https://exemplo.com/', 'x')).toBe('https://exemplo.com/');
  });
});
