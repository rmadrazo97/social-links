// Theme presets. Each preset = fonts + radius + a light and a dark token set.
// Tokens map 1:1 to CSS custom properties (--bg, --surface, ...).

export const RADII = { sharp: '4px', soft: '14px', round: '24px' };

export const PRESETS = {
  studio: {
    fonts: {
      display: "'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif",
      body: "'Geist', ui-sans-serif, system-ui, sans-serif",
      mono: "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
      google: 'family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500',
    },
    displayStyle: 'normal',
    displayWeight: 700,
    radius: 'soft',
    light: { bg: '#EDEFF2', surface: '#FFFFFF', surfaceHover: '#F7F8FA', ink: '#111317', muted: '#575D67', line: '#DADEE4', accent: '#2F45FF', onAccent: '#FFFFFF' },
    dark: { bg: '#0E1014', surface: '#171A20', surfaceHover: '#1D2128', ink: '#F1F2F4', muted: '#9AA1AC', line: '#272B33', accent: '#8C9BFF', onAccent: '#0E1014' },
  },
  midnight: {
    fonts: {
      display: "'Instrument Serif', ui-serif, Georgia, serif",
      body: "'Geist', ui-sans-serif, system-ui, sans-serif",
      mono: "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
      google: 'family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500',
    },
    displayStyle: 'italic',
    displayWeight: 400,
    displayScale: 1.18,
    radius: 'soft',
    light: { bg: '#E9EEF7', surface: '#FFFFFF', surfaceHover: '#F5F8FC', ink: '#0B1530', muted: '#4E5874', line: '#D3DAE8', accent: '#00797A', onAccent: '#FFFFFF' },
    dark: { bg: '#070B18', surface: '#0F1529', surfaceHover: '#141B33', ink: '#E7ECF7', muted: '#8E98B3', line: '#1E2643', accent: '#3EE0CF', onAccent: '#04131A' },
  },
  bloom: {
    fonts: {
      display: "'Fraunces', ui-serif, Georgia, serif",
      body: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
      mono: "'DM Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
      google: 'family=Fraunces:opsz,wght,SOFT@9..144,600,100&family=DM+Sans:opsz,wght@9..40,400..600&family=DM+Mono:wght@400;500',
    },
    displayStyle: 'normal',
    displayWeight: 600,
    radius: 'round',
    light: { bg: '#F7EAF1', surface: '#FFF8FB', surfaceHover: '#FFFFFF', ink: '#2B0F26', muted: '#6E4A66', line: '#EBCFDF', accent: '#C2185B', onAccent: '#FFFFFF' },
    dark: { bg: '#1A0B17', surface: '#261222', surfaceHover: '#2E1629', ink: '#F9E8F2', muted: '#C49BB8', line: '#3A1C33', accent: '#FF7AB6', onAccent: '#1A0B17' },
  },
  mono: {
    fonts: {
      display: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
      body: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
      mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
      google: 'family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500',
    },
    displayStyle: 'normal',
    displayWeight: 700,
    radius: 'sharp',
    light: { bg: '#FFFFFF', surface: '#FFFFFF', surfaceHover: '#F2F2F2', ink: '#000000', muted: '#555555', line: '#000000', accent: '#000000', onAccent: '#FFFFFF' },
    dark: { bg: '#000000', surface: '#000000', surfaceHover: '#141414', ink: '#FFFFFF', muted: '#A8A8A8', line: '#FFFFFF', accent: '#FFFFFF', onAccent: '#000000' },
  },
};

// Pick black or white text for a given background hex (WCAG relative luminance).
export function readableOn(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return (1.05) / (L + 0.05) >= (L + 0.05) / 0.05 ? '#FFFFFF' : '#000000';
}
