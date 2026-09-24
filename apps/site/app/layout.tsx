import type { ReactNode } from "react";
import { Bricolage_Grotesque, Fraunces, IBM_Plex_Sans, Space_Mono } from "next/font/google";
// @ts-ignore The design-tokens package exposes CSS without TypeScript declarations.
import "@clubi/design-tokens/tokens.css";
// @ts-ignore The design-tokens package exposes CSS without TypeScript declarations.

import "@clubi/block-registry/registry.css";
// @ts-ignore The design-tokens package exposes CSS without TypeScript declarations.

import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

// O ensaio usa Fraunces em romano (linha fina, descricoes) E em italico
// (dek, citacao, capitular). O italico 500 e o da capitular da demo.
const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const metadata = {
  title: {
    default: "Clubi da Foto Magazine",
    template: "%s — Clubi da Foto",
  },
  description: "Revista digital de fotografia. Traço gordo, papel cru, um acento.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${serif.variable} ${body.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
