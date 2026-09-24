export const colors = {
  paper: "#F6F1E6",
  paperAlt: "#ECE3CE",
  ink: "#1B1712",
  signal: "#FF3E1F",
  signalTint: "#FBD9CC",
} as const;

export const grid = {
  desktop: { columns: 12, gutter: 24, margin: 64, maxWidth: 1180 },
  tablet: { columns: 8, gutter: 20, margin: 32, maxWidth: 860 },
  mobile: { columns: 4, gutter: 16, margin: 20, maxWidth: 480 },
  readingMax: 680,
} as const;

export const type = {
  display: '"Bricolage Grotesque", sans-serif',
  italic: '"Fraunces", serif',
  body: '"IBM Plex Sans", sans-serif',
  mono: '"Space Mono", monospace',
} as const;

export const tokens = { colors, grid, type };
