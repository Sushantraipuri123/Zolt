import type { Metadata, Viewport } from 'next';
import { Unbounded, Space_Grotesk, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';

const display = Unbounded({ variable: '--font-unbounded', subsets: ['latin'], display: 'swap' });
const sans = Space_Grotesk({ variable: '--font-grotesk', subsets: ['latin'], display: 'swap' });
const mono = JetBrains_Mono({ variable: '--font-jetbrains', subsets: ['latin'], display: 'swap' });
/** Footer "DRINK ZOLT" title only — matches the original shining footer type. */
const outfit = Outfit({ variable: '--font-outfit', subsets: ['latin'], weight: ['700'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Zolt — Unleash the Charge',
  description:
    'Zolt is clean, high-voltage energy: 150mg natural caffeine, zero sugar and a full electrolyte load. No crash. No compromise.',
};

export const viewport: Viewport = {
  themeColor: '#050505',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable} ${outfit.variable} is-locked`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
