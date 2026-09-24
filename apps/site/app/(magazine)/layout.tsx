import type { ReactNode } from "react";
import { Masthead } from "../../src/Masthead";

export default function MagazineLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Masthead />
      {children}
    </>
  );
}
