import { WorkspaceClient } from './WorkspaceClient.jsx';

export const metadata = { title: 'Viagem — Mundo Sem Fim', robots: { index: false, follow: false } };

export default async function WorkspacePage(props) {
  const { id } = await props.params;
  return <WorkspaceClient id={id} />;
}
