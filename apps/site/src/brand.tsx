export function Wordmark({
  tone = "ink",
  withMeta = false,
}: {
  tone?: "ink" | "paper";
  withMeta?: boolean;
}) {
  return (
    <span className="wordmark" data-tone={tone}>
      Club
      <span className="clubi-i">
        ı
        <span className="clubi-tittle" aria-hidden />
      </span>
      {withMeta ? <span className="wordmark-meta">da Foto Magazine</span> : null}
    </span>
  );
}

export function CameraMark({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "camera-mark"}
      viewBox="0 0 64 40"
      fill="none"
      aria-hidden
    >
      <rect x="4" y="12" width="48" height="24" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="28" cy="24" r="8" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="28" cy="24" r="3.2" stroke="currentColor" strokeWidth="1" />
      <path d="M14 12 V8 H24 V12" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="46" cy="18" r="1.4" fill="currentColor" />
      <path d="M54 18 h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
