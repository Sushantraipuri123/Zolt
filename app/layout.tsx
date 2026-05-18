import type { Metadata } from "next";
import { Orbitron, Space_Grotesk, Outfit } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Zolt — Hydration Reinvented",
  description:
    "Zolt is the world’s first tokenized energy drink, blending cutting-edge blockchain innovation with peak performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${spaceGrotesk.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-[#020202] overflow-x-hidden antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
