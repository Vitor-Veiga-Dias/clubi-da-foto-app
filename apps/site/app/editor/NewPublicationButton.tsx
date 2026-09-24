"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewPublicationButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function create() {
    setPending(true);
    const response = await fetch("/api/publications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Nova matéria" }),
    });
    const publication = await response.json();
    router.push(`/editor/${publication.slug}`);
  }

  return (
    <button type="button" className="ed-new" onClick={() => void create()} disabled={pending}>
      {pending ? "Criando…" : "Nova matéria"}
    </button>
  );
}
