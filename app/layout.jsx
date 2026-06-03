import './_ui/tokens.css';
import './globals.css';
import { Fraunces, Hanken_Grotesk } from 'next/font/google';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' });
const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken', display: 'swap' });

// URL pública do site (canonical/og:url). Ordem de resolução: override explícito
// (domínio próprio) → domínio de produção ESTÁVEL da Vercel (resolve sozinho, sem
// setar nada) → fallback. Evita canonical/og apontando pro domínio errado.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  'https://mundo-sem-fim.vercel.app';
const TITULO = 'Mundo Sem Fim — Planejador de rota de mochilão longo';
const DESC = 'Cruze estação climática × janela de visto × fôlego de dinheiro numa timeline longa e descubra a ordem dos países que não te quebra.';
const DESC_SOCIAL = 'A ferramenta que apps de férias curtas não fazem: decide a ORDEM dos países por estação, visto e fôlego de grana.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITULO,
  description: DESC,
  applicationName: 'Mundo Sem Fim',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website', locale: 'pt_BR', url: '/', siteName: 'Mundo Sem Fim',
    title: TITULO, description: DESC_SOCIAL,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITULO, description: DESC_SOCIAL,
  },
  // og:image e twitter:image são gerados automaticamente por opengraph-image.jsx
  // e twitter-image.jsx (next/og) — não precisam de asset estático.
};

export const viewport = { themeColor: '#0E5A4E' };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${hanken.variable}`}>
      <body>{children}</body>
    </html>
  );
}
