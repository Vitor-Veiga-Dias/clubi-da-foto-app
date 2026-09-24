import type { BlockLayout, Breakpoint, ResponsiveLayout } from "./entities";

const FALLBACK: Record<Breakpoint, Breakpoint | null> = {
  mobile: "tablet",
  tablet: "desktop",
  desktop: null,
};

export function resolveBlockLayout(
  layout: ResponsiveLayout,
  breakpoint: Breakpoint,
): BlockLayout {
  const layers: Partial<BlockLayout>[] = [];
  let current: Breakpoint | null = breakpoint;

  while (current) {
    const slice = layout[current];
    if (slice) layers.unshift(slice);
    current = FALLBACK[current];
  }

  return Object.assign({}, ...layers) as BlockLayout;
}
