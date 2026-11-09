// "maison" preset — hotel-stationery link page for interiors / lifestyle creators.
// One sheet of paper, one ink, ruled rows, an optional blind-embossed monogram.
// Light only by design. See DESIGN.md → Maison.
import { esc, hostOf } from './render.mjs';
import { iconSvg, iconTitle } from './icons.mjs';

export const MAISON_DEFAULTS = {
  bg: '#E4DDD2',
  surface: '#F1ECE4',
  surfaceHover: '#EDE7DE',
  ink: '#6B5F53',
  soon: '#8C8176',
  line: '#C9C0B4',
  lineStrong: '#A29586',
  accent2: '#9B736B',
  desk: '#D6CFC5',
  embossFill: '#D6CEC3',
  embossHi: '#F7F3EC',
  embossLo: '#BFB5A8',
  onAccent: '#F1ECE4',
};

const LABELS = { soon: 'Próximamente', opens: 'abre', mail: 'Correo' };

const safeUrl = (u) => (/^(https?:\/\/|mailto:|tel:)/i.test(u) ? u : '#');

// Inline SVG asset: { viewBox, inner } read by the build from public/.
const svgUse = (asset, id) => `<symbol id="${id}" viewBox="${asset.viewBox}">${asset.inner}</symbol>`;

const scriptWords = (s = '') => [...s.matchAll(/\*([^*]+)\*/g)].map((m) => m[1]);

function headline(s) {
  return esc(s).replace(/\*([^*]+)\*/g, '<em class="script">$1</em>');
}

function hexToRgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
export function contrast(a, b) {
  const L = (hex) => {
    const [r, g, bl] = hexToRgb(hex).map((c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [L(a), L(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

const grain = (w, freq, oct, seed, alpha) =>
  `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${w}'><filter id='g' x='0' y='0' width='100%25' height='100%25'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${oct}' stitchTiles='stitch' seed='${seed}'/><feColorMatrix values='0 0 0 0 .42  0 0 0 0 .37  0 0 0 0 .33  0 0 0 ${alpha} 0'/></filter><rect width='100%25' height='100%25' filter='url(%23g)'/></svg>")`;

function css(c, texture, logoWidth) {
  const paper = texture
    ? `var(--grain) 0 0/240px 240px repeat,var(--mottle) 0 0/480px 480px repeat,radial-gradient(140% 90% at 50% -10%,color-mix(in oklab,var(--bg),#fff 22%) 0%,var(--bg) 55%,color-mix(in oklab,var(--bg),#000 3%) 100%),var(--bg)`
    : 'var(--bg)';
  return `:root{--bg:${c.bg};--surface:${c.surface};--surface-hover:${c.surfaceHover};--ink:${c.ink};--soon:${c.soon};--line:${c.line};--line-strong:${c.lineStrong};--accent-2:${c.accent2};--desk:${c.desk};--emboss-fill:${c.embossFill};--emboss-hi:${c.embossHi};--emboss-lo:${c.embossLo};--focus:${c.ink};--r:4px;
--f-display:'Instrument Serif','Times New Roman',serif;--f-body:'PT Serif',Georgia,serif;--f-label:'Open Sans','Helvetica Neue',Arial,sans-serif;--f-script:'Ballet','Snell Roundhand','Apple Chancery',cursive;
--grain:${grain(240, 0.9, 1, 3, 0.14)};--mottle:${grain(480, 0.012, 3, 7, 0.1)};--paper:${paper};--logo-w:${logoWidth}px;color-scheme:light}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
body{margin:0;min-height:100dvh;background:var(--paper);color:var(--ink);font:400 1rem/1.6 var(--f-body);font-synthesis:none;-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent;padding:max(40px,calc(env(safe-area-inset-top) + 24px)) 24px max(40px,calc(env(safe-area-inset-bottom) + 24px))}
.wrap{max-width:400px;margin:0 auto;text-align:center}
a{color:inherit}
:focus-visible{outline:2px solid var(--focus);outline-offset:4px;border-radius:2px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
h1{margin:0;font-weight:400}
.seal{display:block;width:var(--logo-w);height:auto;margin:0 auto;overflow:visible}
.seal .lo{color:var(--emboss-lo);transform:translate(-1.4px,-1.4px)}
.seal .hi{color:var(--emboss-hi);transform:translate(1.4px,1.4px)}
.seal .body{color:var(--emboss-fill)}
.seal.flat .body{color:var(--ink)}
.wordmark{display:block;width:var(--logo-w);height:auto;margin:10px auto 0;color:var(--ink)}
.name{display:inline-block;font:400 30px/1.1 var(--f-display);letter-spacing:.08em;text-transform:uppercase;padding:14px 0;border-top:1px solid var(--line-strong);border-bottom:1px solid var(--line-strong)}
.sub,.label,.t,.tag,.cta,.eyebrow,.soc a{font-family:var(--f-label);font-weight:700;text-transform:uppercase}
.sub{margin:20px 0 0;font-size:10.5px;line-height:1;letter-spacing:.24em}
.sub span+span::before{content:"·";margin:0 10px}
.headline{margin:28px 0 0;font:400 clamp(26px,8.6vw,38px)/1.05 var(--f-display);letter-spacing:.02em;text-transform:uppercase;text-wrap:balance}
.script{display:block;margin:6px 0 2px;font:400 clamp(38px,11.8vw,50px)/1.15 var(--f-script);font-variation-settings:"opsz" 40;text-transform:none;letter-spacing:0}
.bio{margin:20px auto 0;max-width:30ch;font-size:16px;line-height:1.6;text-wrap:pretty}
.links{list-style:none;margin:32px 0 0;padding:0;text-align:left}
.label{display:flex;align-items:center;gap:16px;margin:24px 0 8px;font-size:10px;line-height:1;letter-spacing:.26em;font-weight:700}
.label::before,.label::after{content:"";flex:1;height:1px;background:var(--line)}
.after-feature .label{margin-top:0}
.row{position:relative;display:grid;grid-template-columns:1fr auto;align-items:center;gap:16px;min-height:64px;padding:18px 0;border-bottom:1px solid var(--line);text-decoration:none;color:var(--ink);transition:border-color .24s}
.row::before{content:"";position:absolute;inset:0 -12px;background:var(--surface-hover);opacity:0;transition:opacity .12s;z-index:-1}
.row:active::before{opacity:1}
.links li{position:relative;z-index:0}
.row:focus-visible{outline-offset:2px}
.t{display:block;font-size:12px;line-height:1.3;letter-spacing:.18em;text-wrap:balance}
.d{display:block;margin-top:4px;font:italic 400 15px/1.45 var(--f-body)}
.go{display:grid;place-items:center;width:24px;height:24px;color:var(--ink);transition:transform .24s cubic-bezier(.2,.7,.2,1),color .24s}
.go .i{width:16px;height:16px}
.go .i path{stroke-width:1.4}
.row-soon .t,.row-soon .d{color:var(--soon)}
.tag{font-size:10px;line-height:1;letter-spacing:.22em;white-space:nowrap}
.feature{display:block;position:relative;margin:0 0 32px;padding:26px 22px 24px;background:var(--surface);border:1px solid var(--line-strong);border-radius:var(--r);text-align:center;text-decoration:none;color:var(--ink);box-shadow:inset 0 1px 0 rgba(255,255,255,.55),0 1px 2px rgba(74,64,56,.08);transition:border-color .24s,box-shadow .24s,transform .12s}
.feature::before{content:"";position:absolute;inset:4px;border:1px solid var(--accent-2);opacity:.45;border-radius:2px;pointer-events:none}
.eyebrow{display:block;margin-bottom:10px;font-size:10px;line-height:1;letter-spacing:.26em}
.ft{display:block;font:400 clamp(22px,6.6vw,28px)/1.1 var(--f-display);letter-spacing:.03em;text-transform:uppercase}
.feature .d{max-width:34ch;margin:8px auto 0}
.cta{display:inline-flex;align-items:center;gap:8px;margin-top:18px;font-size:11px;line-height:1;letter-spacing:.2em;padding-bottom:3px;border-bottom:1px solid var(--line-strong);transition:border-color .24s}
.cta .i{width:14px;height:14px;transition:transform .24s cubic-bezier(.2,.7,.2,1)}
.cta .i path{stroke-width:1.4}
.feature:active{transform:translateY(1px);box-shadow:inset 0 1px 0 rgba(255,255,255,.55)}
@media (hover:hover){
.row:hover{border-bottom-color:var(--line-strong)}
.row:hover .go{transform:translateX(4px);color:var(--accent-2)}
.feature:hover{border-color:var(--ink);box-shadow:inset 0 1px 0 rgba(255,255,255,.55),0 2px 6px rgba(74,64,56,.10)}
.feature:hover .cta{border-color:var(--ink)}
.feature:hover .cta .i{transform:translateX(3px)}
.soc a:hover{border-bottom-color:var(--line-strong)}
.mail:hover{border-bottom-color:var(--line-strong)}}
footer{margin-top:56px;font:400 13px/1.6 var(--f-body)}
.orn{display:flex;align-items:center;justify-content:center;gap:12px;color:var(--line-strong)}
.orn::before,.orn::after{content:"";width:40px;height:1px;background:var(--line-strong)}
.orn span{width:3px;height:3px;border-radius:50%;background:currentColor}
.soc{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;margin:8px 0 0;padding:0;list-style:none}
.soc li+li::before{content:"·" / "";color:var(--line-strong);padding:0 2px}
.soc a{display:inline-block;padding:17px 8px;font-size:10.5px;line-height:1;letter-spacing:.22em;text-decoration:none;border-bottom:1px solid transparent}
.mail{display:inline-block;margin-top:4px;text-decoration:none;border-bottom:1px solid transparent}
.fine{margin:12px 0 0;font-size:12px}
.fine a{text-decoration:none;border-bottom:1px solid var(--line)}
.rise{animation:rise .64s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(var(--n,0) * 55ms)}
@keyframes rise{from{opacity:0;transform:translateY(6px)}}
@media (min-width:760px){
body{background:${texture ? 'var(--grain) 0 0/240px 240px repeat,' : ''}var(--desk);padding:64px 24px}
.wrap{position:relative;max-width:460px;padding:56px 44px 40px;background:var(--paper);border:1px solid var(--line-strong);border-radius:2px;box-shadow:0 30px 60px -40px rgba(74,64,56,.45)}
.wrap::before{content:"";position:absolute;inset:6px;border:1px solid var(--line);border-radius:1px;pointer-events:none}}
@media (min-width:460px) and (max-width:759px){body{padding-left:32px;padding-right:32px}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}`;
}

export function renderMaison(cfg, assets = {}) {
  const { profile: p, socials = [], links, theme = {}, meta = {}, analytics = {}, footer = {} } = cfg;
  const labels = { ...LABELS, ...(cfg.labels ?? {}) };
  const c = { ...MAISON_DEFAULTS, ...(theme.palette ?? {}) };
  const texture = theme.texture !== 'none';
  const logoWidth = Math.max(96, p.logoWidth ?? 104);
  const title = meta.title ?? p.name;
  const description = meta.description ?? p.bio ?? p.name;
  const abs = (u) => (u && meta.url && u.startsWith('/') ? new URL(u, meta.url).href : u);

  const words = scriptWords(p.headline);
  const scriptChars = [...new Set(words.join('') + words.join('').toUpperCase())].join('');
  const fonts = [
    'https://fonts.googleapis.com/css2?family=Instrument+Serif&family=PT+Serif:ital,wght@0,400;1,400&family=Open+Sans:wght@700&display=swap',
    words.length && `https://fonts.googleapis.com/css2?family=Ballet:opsz@16..72&text=${encodeURIComponent(scriptChars)}&display=swap`,
  ].filter(Boolean);

  let n = 0;
  // Header
  let mark;
  if (assets.logo) {
    const emboss = p.emboss !== false;
    const layers = emboss
      ? '<use class="lo" href="#mono"/><use class="hi" href="#mono"/><use class="body" href="#mono"/>'
      : '<use class="body" href="#mono"/>';
    const [, , w, h] = assets.logo.viewBox.split(/\s+/).map(Number);
    mark = `<h1><span class="sr">${esc(p.name)}</span><svg class="seal${emboss ? '' : ' flat'}" viewBox="0 0 ${w} ${h}" aria-hidden="true" focusable="false">${layers}</svg>${
      assets.wordmark ? `<svg class="wordmark" viewBox="${assets.wordmark.viewBox}" aria-hidden="true" focusable="false">${assets.wordmark.inner}</svg>` : ''
    }</h1>`;
  } else {
    mark = `<h1 class="name">${esc(p.name)}</h1>`;
  }
  const sub = [p.handle, p.location].filter(Boolean).map((s) => `<span>${esc(s)}</span>`).join('');

  // Links
  const visible = links.filter((l) => !l.hidden);
  let prevFeatured = false;
  const items = visible
    .map((l) => {
      const after = prevFeatured ? ' class="after-feature rise"' : ' class="rise"';
      prevFeatured = false;
      const nn = ++n;
      if (l.section) return `<li${after} style="--n:${nn}"><h2 class="label">${esc(l.section)}</h2></li>`;
      const desc = l.description ? `<span class="d">${esc(l.description)}</span>` : '';
      const sr = l.url ? `<span class="sr">, ${esc(labels.opens)} ${esc(hostOf(l.url))}</span>` : '';
      const ext = l.url && /^https?:/i.test(l.url) ? ' rel="noopener"' : '';
      if (l.featured) {
        prevFeatured = true;
        const eyebrow = l.eyebrow ?? (l.soon ? labels.soon : '');
        const inner = `${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ''}<span class="ft">${esc(l.title)}</span>${desc}${
          l.cta ? `<span class="cta">${esc(l.cta)}${iconSvg('arrow-right')}</span>` : ''
        }${sr}`;
        return `<li${after} style="--n:${nn}">${
          l.url ? `<a class="feature" href="${esc(safeUrl(l.url))}"${ext}>${inner}</a>` : `<div class="feature">${inner}</div>`
        }</li>`;
      }
      const text = `<span class="txt"><span class="t">${esc(l.title)}</span>${desc}</span>`;
      if (!l.url) return `<li${after} style="--n:${nn}"><div class="row row-soon">${text}<span class="tag">${esc(labels.soon)}</span></div></li>`;
      const end = l.soon ? `<span class="tag">${esc(labels.soon)}</span>` : `<span class="go">${iconSvg('arrow-right')}</span>`;
      return `<li${after} style="--n:${nn}"><a class="row" href="${esc(safeUrl(l.url))}"${ext}>${text}${sr}${end}</a></li>`;
    })
    .join('');

  // Footer
  const socLabel = (s) => s.label ?? (s.icon === 'mail' ? labels.mail : iconTitle(s.icon));
  const soc = socials.length
    ? `<ul class="soc">${socials
        .map((s) => `<li><a href="${esc(safeUrl(s.url))}"${/^https?:/i.test(s.url) ? ' rel="me noopener"' : ''}>${esc(socLabel(s))}</a></li>`)
        .join('')}</ul>`
    : '';
  const email = footer.email ? `<a class="mail" href="mailto:${esc(footer.email)}">${esc(footer.email)}</a>` : '';
  const year = new Date().getFullYear();
  const fine = [
    footer.copyright !== false ? `© ${year} ${esc(p.name)}` : '',
    footer.credit !== false ? `${esc(labels.madeWith ?? 'Hecho con')} <a href="https://github.com/rmadrazo97/social-links">social-links</a>` : '',
  ].filter(Boolean).join(' · ');

  const jsonld = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: { '@type': 'Person', name: p.name, description: p.bio, ...(p.handle && { alternateName: p.handle }), sameAs: socials.filter((s) => /^https?:/.test(s.url)).map((s) => s.url) },
  }).replace(/</g, '\\u003c');

  const ogImage = meta.image ? abs(meta.image) : '';

  return `<!doctype html>
<html lang="${esc(meta.lang ?? 'es')}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${meta.url ? `<link rel="canonical" href="${esc(meta.url)}">\n<meta property="og:url" content="${esc(meta.url)}">\n` : ''}<meta property="og:type" content="profile">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
${ogImage ? `<meta property="og:image" content="${esc(ogImage)}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta name="twitter:card" content="summary_large_image">\n` : '<meta name="twitter:card" content="summary">\n'}<meta name="theme-color" content="${c.bg}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
${assets.appleTouch ? '<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n' : ''}<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fonts.map((f) => `<link rel="stylesheet" href="${f}">`).join('\n')}
<style>${css(c, texture, logoWidth)}</style>
<script type="application/ld+json">${jsonld}</script>
</head>
<body>
${assets.logo ? `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${svgUse(assets.logo, 'mono')}</svg>` : ''}
<main class="wrap">
<header>
<div class="rise" style="--n:0">${mark}</div>
${sub ? `<p class="sub rise" style="--n:0">${sub}</p>` : ''}
${p.headline ? `<p class="headline rise" style="--n:1">${headline(p.headline)}</p>` : ''}
${p.bio ? `<p class="bio rise" style="--n:1">${esc(p.bio)}</p>` : ''}
</header>
<ul class="links">${items}</ul>
<footer class="rise" style="--n:${++n}">
<div class="orn" aria-hidden="true"><span></span></div>
${soc}
${email}
${fine ? `<p class="fine">${fine}</p>` : ''}
</footer>
</main>
${analytics.cloudflare_token ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${esc(analytics.cloudflare_token)}"}'></script>` : ''}
</body>
</html>
`;
}

export function maisonFavicon(cfg, assets) {
  const c = { ...MAISON_DEFAULTS, ...(cfg.theme?.palette ?? {}) };
  if (!assets.logo) return null;
  const [x, y, w, h] = assets.logo.viewBox.split(/\s+/).map(Number);
  const s = 44 / Math.max(w, h);
  const tx = 32 - (w * s) / 2 - x * s;
  const ty = 32 - (h * s) / 2 - y * s;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${c.lineStrong}"/><g color="${c.onAccent}" transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(4)})">${assets.logo.inner}</g></svg>`;
}
