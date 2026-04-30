import { Montserrat, Cairo } from 'next/font/google';
import '../styles/tailwind.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cairo',
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Sadena Store— Natural Beauty Store',
  description:
    'Natural care for hair, skin, henna, and oils — curated for everyday rituals in Saudi Arabia.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat?.variable} ${cairo?.variable}`}>
      <body className="font-sans bg-[#edf2ed]">
        {children}
        <script
          type="module"
          async
          src="https://quality-cdn.dhiwise.com/rocket-web.js?_cfg=https%3A%2F%2Fstillness8556back.dhiwise.co&_be=https%3A%2F%2Fquality-analytics.dhiwise.com&_v=0.1.17"
        />
        <script type="module" defer src="https://quality-cdn.dhiwise.com/rocket-shot.js?v=0.0.2" />
        <script
          type="module"
          defer
          src="https://quality-cdn.dhiwise.com/preview-collaborator.js?v=0.0.1"
        />
      </body>
    </html>
  );
}
