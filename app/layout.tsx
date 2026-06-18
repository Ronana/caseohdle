import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/LanguageContext';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'] });

const SITE_URL = 'https://caseohdle.vercel.app';

export const metadata: Metadata = {
  title:       'CaseOhdle',
  description: "Guess the CaseOh stream game of the day. A Wordle-style daily guessing game for CaseOh's stream games.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title:       'CaseOhdle',
    description: "Guess the CaseOh stream game of the day.",
    url:          SITE_URL,
    siteName:    'CaseOhdle',
    type:        'website',
    images: [
      {
        url:    '/opengraph-image',
        width:  1200,
        height: 630,
        alt:    'CaseOhdle - Daily CaseOh stream game guessing game',
      },
    ],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'CaseOhdle',
    description: "Guess the CaseOh stream game of the day.",
    images:      ['/opengraph-image'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
