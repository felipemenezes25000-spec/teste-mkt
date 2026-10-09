import './_ui/tokens.css';
import './globals.css';
import { League_Spartan, Barlow, Barlow_Condensed } from 'next/font/google';
import { SWRegister } from './_components/SWRegister.jsx';
import { AnalyticsScripts, AnalyticsNoscript } from './_components/AnalyticsScripts.jsx';

// CALÇADÃO: League Spartan (títulos e poema) + Barlow (texto) + Barlow Condensed (rótulos, placar, figurinhas)
const display = League_Spartan({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['600', '700', '800', '900'] });
const ui = Barlow({ subsets: ['latin'], variable: '--font-ui', display: 'swap', weight: ['400', '500', '600', '700'] });
const cond = Barlow_Condensed({ subsets: ['latin'], variable: '--font-cond', display: 'swap', weight: ['600', '700', '800', '900'], style: ['normal', 'italic'] });

// URL pública do site (canonical/og:url). Ordem de resolução: override explícito
// (domínio próprio) → domínio de produção ESTÁVEL da Vercel (resolve sozinho, sem
// setar nada) → fallback. Evita canonical/og apontando pro domínio errado.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  'https://mundo-sem-fim.vercel.app';
const TITULO = 'Mundo Sem Fim — o copiloto que decide a viagem com você';
const DESC = 'Cruze estação climática × janela de visto × fôlego de dinheiro numa timeline longa e descubra a ordem dos países que não te quebra.';
const DESC_SOCIAL = 'A ferramenta que apps de férias curtas não fazem: decide a ORDEM dos países por estação, visto e fôlego de grana.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITULO,
  description: DESC,
  applicationName: 'Mundo Sem Fim',
  // Canonical é POR PÁGINA (home/destino/planos). Um canonical global '/' faria os
  // 167 destinos se declararem cópia da home; páginas sem canonical se auto-canonizam.
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

// Tema sempre claro (decisão do dono, 2026-10-09): sem alternância nem script anti-flash.
export const viewport = { themeColor: '#FFFFFF', colorScheme: 'light' };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${ui.variable} ${cond.variable}`}>
      <head>
        <AnalyticsScripts />
      </head>
      <body>
        <AnalyticsNoscript />
        {children}
        <SWRegister />
      </body>
    </html>
  );
}
