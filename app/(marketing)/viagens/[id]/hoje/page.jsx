import { HojeClient } from './HojeClient.jsx';

export const metadata = { title: 'Modo Viagem — Mundo Sem Fim', robots: { index: false, follow: false } };

export default async function HojePage(props) {
  const { id } = await props.params;
  return <HojeClient id={id} />;
}
