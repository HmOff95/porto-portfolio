import { Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-space-grotesk',
});

export const metadata = {
  title: 'Muhammad Haikal Mahardika, S.Kom — Portfolio',
  description: 'Portfolio of Muhammad Haikal Mahardika, S.Kom — Software Engineer & Fullstack Developer from Samarinda, Indonesia.',
  openGraph: {
    title: 'Muhammad Haikal Mahardika, S.Kom — Portfolio',
    description: 'Software Engineer & Fullstack Developer from Samarinda, Indonesia.',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={spaceGrotesk.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
