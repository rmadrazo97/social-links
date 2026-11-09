// Icons: brand glyphs come from simple-icons (CC0). A few generic glyphs are
// drawn here. Only icons actually used in links.yml end up in the HTML.
import * as si from 'simple-icons';

const BRANDS = new Map();
for (const icon of Object.values(si)) {
  if (icon && icon.slug && icon.path) BRANDS.set(icon.slug, icon);
}

// 24×24, currentColor. Stroke-based generics share one visual weight.
const stroke = (d) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
const GENERIC = {
  linkedin: { title: 'LinkedIn', svg: '<circle cx="5.2" cy="5.3" r="2.1" fill="currentColor"/><path fill="currentColor" d="M3.4 9h3.6v11.6H3.4zM9.3 9h3.4v1.6c.5-.9 1.7-1.9 3.6-1.9 3.8 0 4.5 2.5 4.5 5.8v6.1h-3.6v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.5H9.3z"/>' },
  mail: { title: 'Email', svg: stroke('M3.5 6.5h17v11h-17z') + stroke('m4 7 8 6 8-6') },
  globe: { title: 'Website', svg: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/>' + stroke('M3.5 12h17M12 3.5c2.4 2.6 3.5 5.4 3.5 8.5s-1.1 5.9-3.5 8.5c-2.4-2.6-3.5-5.4-3.5-8.5s1.1-5.9 3.5-8.5z') },
  link: { title: 'Link', svg: stroke('M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1') + stroke('M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1') },
  rss: { title: 'RSS', svg: stroke('M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14') + '<circle cx="6" cy="18" r="1.6" fill="currentColor"/>' },
  phone: { title: 'Phone', svg: stroke('M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z') },
  calendar: { title: 'Calendar', svg: stroke('M4.5 6.5h15v13h-15zM4.5 10.5h15M8.5 4v4M15.5 4v4') },
  arrow: { title: 'Open', svg: stroke('M7 17 17 7M8.5 7H17v8.5') },
};

export function hasIcon(slug) {
  return Boolean(GENERIC[slug] || BRANDS.get(slug));
}

export function iconTitle(slug) {
  return GENERIC[slug]?.title ?? BRANDS.get(slug)?.title ?? slug;
}

export function iconSvg(slug, cls = 'i') {
  const g = GENERIC[slug];
  const inner = g ? g.svg : BRANDS.has(slug) ? `<path fill="currentColor" d="${BRANDS.get(slug).path}"/>` : GENERIC.link.svg;
  return `<svg class="${cls}" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">${inner}</svg>`;
}
