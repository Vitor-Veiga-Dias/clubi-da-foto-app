"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CameraMark, Wordmark } from "./brand";

const links = [
  { href: "/edicao", label: "Edição 01" },
  { href: "/materia/configuracoes", label: "Ensaio" },
  { href: "/sobre", label: "Sobre" },
];

/**
 * O masthead completo (wordmark + camera + nav) e da capa/indice.
 * Nas rotas de leitura entra o topbar fino do demo — ver ArticleTopbar.
 */
export function Masthead() {
  const pathname = usePathname();
  if (pathname.startsWith("/materia/")) return null;
  const overlay = pathname === "/";

  return (
    <header className="masthead" data-overlay={overlay ? "true" : "false"}>
      <Link href="/" className="masthead-brand">
        <Wordmark tone={overlay ? "paper" : "ink"} withMeta />
      </Link>
      <CameraMark />
      <nav className="masthead-nav">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link key={link.href} href={link.href} data-active={active ? "true" : "false"}>
              {active ? <span className="clubi-dot" aria-hidden /> : null}
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
