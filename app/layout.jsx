import './_ui/tokens.css';
import './globals.css';
import { Fraunces, Hanken_Grotesk } from 'next/font/google';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' });
const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken', display: 'swap' });

export const metadata = {
  title: 'Mundo Sem Fim — Planejador de rota de mochilão longo',
  description: 'Cruze estação climática × janela de visto × fôlego de dinheiro numa timeline longa e descubra a ordem dos países que não te quebra.',
  openGraph: {
    type: 'website', locale: 'pt_BR',
    title: 'Mundo Sem Fim — Planejador de rota de mochilão longo',
    description: 'A ferramenta que apps de férias curtas não fazem: decide a ORDEM dos países por estação, visto e fôlego de grana.',
  },
};

export const viewport = { themeColor: '#0E5A4E' };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${hanken.variable}`}>
      <body>{children}</body>
    </html>
  );
}
