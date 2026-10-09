import { describe, it, expect } from 'vitest';
import { aplicarPaleta, PALETA } from './paletaMapa.js';

const base = { version: 8, sources: { osm: {} }, layers: [
  { id: 'background', type: 'background', paint: { 'background-color': '#fff' } },
  { id: 'water', type: 'fill', paint: { 'fill-color': '#aad' } },
  { id: 'park', type: 'fill', paint: {} },
  { id: 'highway_major_casing', type: 'line', paint: {} },
  { id: 'highway_motorway_inner', type: 'line', paint: {} },
  { id: 'boundary_country', type: 'line', paint: {} },
  { id: 'water_name_point_label', type: 'symbol', layout: { 'text-field': '{name}' }, paint: {} },
  { id: 'label_city', type: 'symbol', layout: { 'text-field': '{name}' }, paint: {} },
  { id: 'poi_icon', type: 'symbol', layout: { 'icon-image': 'x' }, paint: {} },
] };

describe('paleta cartográfica MERIDIANO', () => {
  it('recolore só paint, preservando fontes, ids e ordem (atribuição/tiles intactos)', () => {
    const r = aplicarPaleta(base, 'light');
    expect(r.sources).toBe(base.sources);
    expect(r.layers.map((l) => l.id)).toEqual(base.layers.map((l) => l.id));
    const by = Object.fromEntries(r.layers.map((l) => [l.id, l.paint]));
    expect(by.background['background-color']).toBe(PALETA.light.fundo);
    expect(by.water['fill-color']).toBe(PALETA.light.agua);
    expect(by.park['fill-color']).toBe(PALETA.light.verde);
    expect(by.highway_major_casing['line-color']).toBe(PALETA.light.viaBorda);
    expect(by.highway_motorway_inner['line-color']).toBe(PALETA.light.viaPrincipal);
    expect(by.boundary_country['line-color']).toBe(PALETA.light.limite);
    expect(by.water_name_point_label['text-color']).toBe(PALETA.light.textoAgua);
    expect(by.label_city['text-halo-color']).toBe(PALETA.light.halo);
    expect(by.poi_icon['text-color']).toBeUndefined();
    expect(base.layers[1].paint['fill-color']).toBe('#aad'); // não muta a entrada
  });
  it('tema escuro usa a noite atlas', () => {
    expect(aplicarPaleta(base, 'dark').layers[0].paint['background-color']).toBe('#070B14');
  });
});
