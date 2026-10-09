import { RoteiroComunidade } from './RoteiroComunidade.jsx';

export const metadata = {
  title: 'Roteiro da comunidade — Mundo Sem Fim',
  robots: { index: false },
};

export default async function Page({ params }) {
  const { slug } = await params;
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12">
      <RoteiroComunidade slug={slug} />
    </main>
  );
}
