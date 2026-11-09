// Pure function: validated config -> HTML string. No content lives here.
import { PRESETS, RADII, readableOn } from './themes.mjs';
import { iconSvg, iconTitle } from './icons.mjs';

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ESC[c]);

// Only http(s), mailto and tel are allowed (also enforced by the schema).
const safeUrl = (u) => (/^(https?:\/\/|mailto:|tel:)/i.test(u) ? u : '#');
// Assets: site-relative paths or https URLs only.
const safeAsset = (u) => (/^(\/[^/]|https:\/\/)/.test(u) ? u : '');

export function hostOf(url) {
  if (/^mailto:/i.test(url)) return 'email';
  if (/^tel:/i.test(url)) return 'phone';
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

export function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts.at(-1)[0] : name.slice(0, 2)).toUpperCase();
}

const tokens = (t) =>
  `--bg:${t.bg};--surface:${t.surface};--surface-hover:${t.surfaceHover};--ink:${t.ink};--muted:${t.muted};--line:${t.line};--accent:${t.accent};--on-accent:${t.onAccent};`;

function themeCss(theme = {}) {
  const p = PRESETS[theme.preset ?? 'studio'];
  const light = { ...p.light };
  const dark = { ...p.dark };
  if (theme.accent) {
    for (const t of [light, dark]) { t.accent = theme.accent; t.onAccent = readableOn(theme.accent); }
  }
  const r = RADII[theme.radius ?? p.radius];
  const base = `--r:${r};--r-sm:calc(${r} * .6);--font-display:${p.fonts.display};--font-body:${p.fonts.body};--font-mono:${p.fonts.mono};--display-style:${p.displayStyle};--display-weight:${p.displayWeight};--display-scale:${p.displayScale ?? 1};`;
  return `:root{${base}${tokens(light)}color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-mode=light]){${tokens(dark)}color-scheme:dark}}
:root[data-mode=dark]{${tokens(dark)}color-scheme:dark}`;
}

const CSS = `*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
body{margin:0;min-height:100dvh;background:var(--bg);color:var(--ink);font:400 1rem/1.55 var(--font-body);-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent;padding:clamp(40px,9vh,96px) 16px 40px}
.wrap{max-width:34rem;margin:0 auto}
a{color:inherit}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:var(--r-sm)}
.avatar{display:block;width:76px;height:76px;border-radius:var(--r);object-fit:cover;background:var(--surface);border:1px solid var(--line)}
.mono-avatar{display:grid;place-items:center;width:76px;height:76px;border-radius:var(--r);background:var(--accent);color:var(--on-accent);font:var(--display-style) var(--display-weight) 1.9rem/1 var(--font-display);letter-spacing:-.02em}
h1{font:var(--display-style) var(--display-weight) calc(clamp(2.6rem,10vw,3.9rem) * var(--display-scale))/.95 var(--font-display);letter-spacing:-.035em;margin:28px 0 0;text-wrap:balance}
.sub{font:500 .8125rem/1.4 var(--font-mono);color:var(--muted);margin:12px 0 0;display:flex;flex-wrap:wrap;gap:4px 10px}
.sub span+span::before{content:"·";margin-right:10px}
.bio{font-size:1.0625rem;line-height:1.55;margin:16px 0 0;max-width:36ch;text-wrap:pretty}
.status{display:inline-flex;align-items:center;gap:10px;margin:18px 0 0;padding:7px 12px 7px 10px;border:1px solid var(--line);border-radius:999px;background:var(--surface);font:500 .8125rem/1.3 var(--font-mono)}
.dot{position:relative;width:8px;height:8px;border-radius:50%;background:var(--accent);flex:none}
.dot::after{content:"";position:absolute;inset:0;border-radius:50%;background:var(--accent);animation:ping 2.4s cubic-bezier(0,0,.2,1) infinite}
@keyframes ping{70%,100%{transform:scale(2.6);opacity:0}}
.socials{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0 0;padding:0;list-style:none}
.socials a{display:grid;place-items:center;width:44px;height:44px;border:1px solid var(--line);border-radius:var(--r-sm);color:var(--ink);transition:background-color .16s,border-color .16s,transform .16s cubic-bezier(.2,.7,.2,1)}
.socials a:hover{background:var(--surface);border-color:color-mix(in oklab,var(--ink) 35%,var(--line))}
.socials a:active{transform:scale(.94)}
.links{list-style:none;margin:36px 0 0;padding:0;display:flex;flex-direction:column;gap:10px}
.label{display:flex;align-items:center;gap:12px;margin:22px 0 2px;font:500 .75rem/1 var(--font-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.label::after{content:"";flex:1;height:1px;background:var(--line)}
.link{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:14px;min-height:68px;padding:14px 16px 14px 14px;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);text-decoration:none;transition:background-color .16s,border-color .16s,transform .16s cubic-bezier(.2,.7,.2,1)}
.link:hover{background:var(--surface-hover);border-color:color-mix(in oklab,var(--ink) 35%,var(--line))}
.link:active{transform:scale(.985)}
.ib{display:grid;place-items:center;width:40px;height:40px;border-radius:var(--r-sm);background:var(--bg);color:var(--ink)}
.no-icon{grid-template-columns:1fr auto;padding-left:20px}
.txt{min-width:0}
.t{display:block;font-weight:600;font-size:1.03rem;line-height:1.3}
.d{display:block;font-size:.875rem;line-height:1.4;color:var(--muted);margin-top:2px}
.h{font:500 .75rem/1.2 var(--font-mono);color:var(--muted)}
.end{display:flex;align-items:center;gap:10px}
.go{display:grid;place-items:center;width:28px;height:28px;color:var(--muted);transition:transform .2s cubic-bezier(.2,.7,.2,1),color .16s}
.go .i{width:18px;height:18px}
.link:hover .go{transform:translate(2px,-2px);color:var(--accent)}
.h-inline{display:none}
@media (max-width:460px){.end .h{display:none}.h-inline{display:block;margin-top:3px}}
.featured{background:var(--accent);border-color:var(--accent);color:var(--on-accent);padding:20px 18px 20px 20px;min-height:96px}
.featured:hover{background:color-mix(in oklab,var(--accent) 90%,var(--ink));border-color:transparent}
.featured .t{font:var(--display-style) var(--display-weight) calc(1.55rem * var(--display-scale))/1.1 var(--font-display);letter-spacing:-.02em}
.featured .d{margin-top:6px}
.featured .d,.featured .h{color:color-mix(in oklab,var(--on-accent) 92%,transparent)}
.featured .ib{background:color-mix(in oklab,var(--on-accent) 16%,transparent);color:var(--on-accent)}
.featured .go{width:36px;height:36px;border-radius:50%;background:var(--on-accent);color:var(--accent)}
.featured:hover .go{color:var(--accent)}
.featured:focus-visible{outline-color:var(--ink)}
footer{margin:56px 0 0;font:400 .75rem/1.5 var(--font-mono);color:var(--muted)}
footer a{text-decoration:none;border-bottom:1px solid var(--line)}
footer a:hover{color:var(--ink);border-color:currentColor}
.rise{animation:rise .55s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(var(--n,0) * 45ms)}
@keyframes rise{from{opacity:0;transform:translateY(10px)}}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}`;

function linkItem(l, n) {
  if (!l.url) return `<li class="rise" style="--n:${n}"><div class="link no-icon" style="opacity:.6"><span class="txt"><span class="t">${esc(l.title)}</span>${l.description ? `<span class="d">${esc(l.description)}</span>` : ''}</span><span class="h">${esc(l.soonLabel ?? 'Coming soon')}</span></div></li>`;
  const host = hostOf(l.url);
  const external = /^https?:/i.test(l.url);
  const icon = l.icon ? `<span class="ib">${iconSvg(l.icon)}</span>` : '';
  const cls = ['link', l.featured && 'featured', !l.icon && 'no-icon'].filter(Boolean).join(' ');
  return `<li class="rise" style="--n:${n}"><a class="${cls}" href="${esc(safeUrl(l.url))}"${external ? ' rel="noopener"' : ''}>${icon}<span class="txt"><span class="t">${esc(l.title)}</span>${l.description ? `<span class="d">${esc(l.description)}</span>` : ''}<span class="h h-inline" aria-hidden="true">${esc(host)}</span><span class="sr">, opens ${esc(host)}</span></span><span class="end"><span class="h" aria-hidden="true">${esc(host)}</span><span class="go">${iconSvg('arrow')}</span></span></a></li>`;
}

export function render(cfg) {
  const { profile: p, socials = [], links, theme = {}, meta = {}, analytics = {}, footer = {} } = cfg;
  const preset = PRESETS[theme.preset ?? 'studio'];
  const title = meta.title ?? p.name;
  const description = meta.description ?? p.bio ?? `${p.name} — links`;
  const lang = meta.lang ?? 'en';
  const abs = (u) => (u && meta.url && u.startsWith('/') ? new URL(u, meta.url).href : u);
  const ogImage = meta.image ? abs(safeAsset(meta.image)) : '';
  const mode = theme.mode && theme.mode !== 'auto' ? ` data-mode="${theme.mode}"` : '';
  const colors = PRESETS[theme.preset ?? 'studio'];

  let n = 0;
  const avatar = p.avatar && safeAsset(p.avatar)
    ? `<img class="avatar" src="${esc(safeAsset(p.avatar))}" alt="" width="76" height="76" decoding="async" fetchpriority="high">`
    : `<div class="mono-avatar" aria-hidden="true">${esc(initials(p.name))}</div>`;

  const sub = [p.handle, p.location].filter(Boolean).map((s) => `<span>${esc(s)}</span>`).join('');

  const socialRow = socials.length
    ? `<ul class="socials rise" style="--n:${++n}">${socials
        .map((s) => {
          const label = s.label ?? iconTitle(s.icon);
          return `<li><a href="${esc(safeUrl(s.url))}" aria-label="${esc(label)}" title="${esc(label)}"${/^https?:/i.test(s.url) ? ' rel="me noopener"' : ''}>${iconSvg(s.icon)}</a></li>`;
        })
        .join('')}</ul>`
    : '';

  const items = links
    .filter((l) => !l.hidden)
    .map((l) => (l.section ? `<li class="rise" style="--n:${++n}"><h2 class="label">${esc(l.section)}</h2></li>` : linkItem(l, ++n)))
    .join('');

  const jsonld = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: { '@type': 'Person', name: p.name, description: p.bio, ...(p.handle && { alternateName: p.handle }), sameAs: socials.filter((s) => /^https?:/.test(s.url)).map((s) => s.url) },
  }).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="${esc(lang)}"${mode}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${meta.url ? `<link rel="canonical" href="${esc(meta.url)}">\n<meta property="og:url" content="${esc(meta.url)}">\n` : ''}<meta property="og:type" content="profile">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
${ogImage ? `<meta property="og:image" content="${esc(ogImage)}">\n<meta name="twitter:card" content="summary_large_image">\n` : '<meta name="twitter:card" content="summary">\n'}<meta name="theme-color" media="(prefers-color-scheme: light)" content="${colors.light.bg}">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="${colors.dark.bg}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${preset.fonts.google}&display=swap">
<style>${themeCss(theme)}
${CSS}</style>
<script type="application/ld+json">${jsonld}</script>
</head>
<body>
<main class="wrap">
<header>
<div class="rise" style="--n:0">${avatar}</div>
<h1 class="rise" style="--n:0">${esc(p.name)}</h1>
${sub ? `<p class="sub rise" style="--n:1">${sub}</p>` : ''}
${p.bio ? `<p class="bio rise" style="--n:1">${esc(p.bio)}</p>` : ''}
${p.status ? `<p class="status rise" style="--n:2"><span class="dot" aria-hidden="true"></span>${esc(p.status)}</p>` : ''}
${socialRow}
</header>
<ul class="links">${items}</ul>
${footer.credit === false ? '' : `<footer>Made with <a href="https://github.com/rmadrazo97/social-links">social-links</a></footer>`}
</main>
${analytics.cloudflare_token ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${esc(analytics.cloudflare_token)}"}'></script>` : ''}
</body>
</html>
`;
}

export function favicon(cfg) {
  const preset = PRESETS[cfg.theme?.preset] ?? PRESETS.studio;
  const bg = cfg.theme?.accent ?? preset.light.accent;
  const fg = cfg.theme?.accent ? readableOn(cfg.theme.accent) : preset.light.onAccent;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="${bg}"/><text x="32" y="42" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="700" font-size="26" fill="${fg}">${esc(initials(cfg.profile.name))}</text></svg>`;
}
