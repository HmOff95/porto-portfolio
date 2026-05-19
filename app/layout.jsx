import { Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-space-grotesk',
});

export const metadata = {
  title: 'Muhammad Haikal Mahardika — Portfolio',
  description: 'Portfolio of Muhammad Haikal Mahardika — Software Engineer & Fullstack Developer from Samarinda, Indonesia.',
  charset: 'UTF-8',
  viewport: 'width=device-width, initial-scale=1.0',
  openGraph: {
    title: 'Muhammad Haikal Mahardika — Portfolio',
    description: 'Software Engineer & Fullstack Developer from Samarinda, Indonesia.',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
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
