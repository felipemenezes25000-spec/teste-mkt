'use client';
import { useState } from 'react';
import { MapaInterativo } from '../../_components/mapa/MapaInterativo.jsx';

// Mapa do roteiro: pontos de todos os dias, ligados na ordem (linha aproximada).
export function MapaRoteiro({ pontos, centro, rotulo }) {
  const [sel, setSel] = useState(null);
  const linhas = pontos.length > 1 ? [{ id: 'rota', coords: pontos.map((p) => [p.lng, p.lat]), estimada: true }] : [];
  return (
    <MapaInterativo pontos={pontos} linhas={linhas} selecionado={sel} onSelecionar={setSel} centro={centro} zoom={4}
      className="h-[420px] rounded-2xl border border-line overflow-hidden" rotulo={rotulo} zoomMaximo={12} />
  );
}
