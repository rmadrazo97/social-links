#!/usr/bin/env node
// Usage: node scripts/build.mjs [--check] [--config path/to/links.yml]
// --check validates links.yml only (no output). Exit code 1 on any error.
import { readFile, writeFile, mkdir, cp, rm, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { parseDocument } from 'yaml';
import Ajv from 'ajv';
import { render, favicon } from '../src/render.mjs';
import { renderMaison, maisonFavicon, contrast, MAISON_DEFAULTS } from '../src/maison.mjs';
import { hasIcon } from '../src/icons.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const ci = args.indexOf("--config");
const configPath = resolve(root, ci >= 0 && args[ci + 1] ? args[ci + 1] : "links.yml");

const fail = (msgs) => {
  console.error(`\n✖ links.yml has ${msgs.length} problem${msgs.length > 1 ? 's' : ''}:\n`);
  for (const m of msgs) console.error(`  • ${m}`);
  console.error('\nFix the file and run `npm run validate` again.\n');
  process.exit(1);
};

// 1. Parse YAML
const doc = parseDocument(await readFile(configPath, 'utf8'));
if (doc.errors.length) fail(doc.errors.map((e) => `YAML syntax: ${e.message.split('\n')[0]}`));
const cfg = doc.toJS();

// 2. Validate against the schema (the single source of truth for the format)
const schema = JSON.parse(await readFile(resolve(root, 'schema/links.schema.json'), 'utf8'));
const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);
if (!validate(cfg)) {
  // oneOf errors are noisy; keep the most specific message per path.
  const seen = new Map();
  for (const e of validate.errors) {
    if (e.keyword === 'if') continue;
    const path = e.instancePath.replace(/^\//, '').replace(/\//g, '.') || '(root)';
    const extra = e.keyword === 'additionalProperties' ? ` (unknown key "${e.params.additionalProperty}")`
      : e.keyword === 'enum' ? ` (one of: ${e.params.allowedValues.join(', ')})` : '';
    const msg = `${path}: ${e.message}${extra}`;
    if (![...seen.values()].includes(msg)) seen.set(msg, msg);
  }
  fail([...seen.values()]);
}

// 3. Semantic checks the schema can't express
const problems = [];
const warn = [];
const visible = cfg.links.filter((l) => !l.section && !l.hidden);
if (visible.filter((l) => l.featured).length > 1) problems.push('links: only one link can be featured: true');
for (const [i, s] of (cfg.socials ?? []).entries()) if (!hasIcon(s.icon)) problems.push(`socials.${i}.icon: unknown icon "${s.icon}" — use a simple-icons slug (https://simpleicons.org) or linkedin/mail/globe/link/rss/phone/calendar`);
for (const [i, l] of cfg.links.entries()) if (l.icon && !hasIcon(l.icon)) problems.push(`links.${i}.icon: unknown icon "${l.icon}"`);
for (const key of ['avatar', 'logo', 'wordmark']) {
  const v = cfg.profile[key];
  if (v && v.startsWith('/')) {
    try { await access(resolve(root, 'public', v.slice(1))); } catch { problems.push(`profile.${key}: file public${v} does not exist`); }
  } else if (v && !v.startsWith('https://')) problems.push(`profile.${key}: must be a /path in public/ or an https:// URL`);
}
if (cfg.meta?.image?.startsWith('/')) {
  try { await access(resolve(root, 'public', cfg.meta.image.slice(1))); } catch { problems.push(`meta.image: file public${cfg.meta.image} does not exist`); }
}
const isMaison = cfg.theme?.preset === 'maison';
if (isMaison) {
  const pal = { ...MAISON_DEFAULTS, ...(cfg.theme.palette ?? {}) };
  const r = contrast(pal.ink, pal.bg);
  if (r < 4.5) problems.push(`theme.palette: ink ${pal.ink} on bg ${pal.bg} is ${r.toFixed(2)}:1 — needs 4.5:1 for readable text`);
  if (cfg.theme.accent) warn.push('theme.accent is ignored by maison — use theme.palette');
  if (cfg.theme.radius) warn.push('theme.radius is ignored by maison');
  if (cfg.theme.mode && cfg.theme.mode !== 'light') warn.push('maison is light-only; theme.mode is ignored');
  if (cfg.profile.status) warn.push('profile.status is not shown by maison');
  const scripts = [...(cfg.profile.headline ?? '').matchAll(/\*([^*]+)\*/g)].map((m) => m[1]);
  if (scripts.join(' ').split(/\s+/).filter(Boolean).length > 2) warn.push('profile.headline: keep the *script* part to 1–2 words');
} else {
  for (const k of ['headline', 'logo', 'wordmark']) if (cfg.profile[k]) warn.push(`profile.${k} is only used by the maison preset`);
}
if (visible.filter((l) => l.soon && !l.featured).length > 2) warn.push('more than 2 coming-soon links reads unfinished');
if ((cfg.socials ?? []).length > 6) warn.push(`socials: ${cfg.socials.length} icons — 6 or fewer reads better`);
if (problems.length) fail(problems);
for (const w of warn) console.warn(`  ! ${w}`);

if (checkOnly) {
  console.log(`✓ links.yml is valid (${visible.length} links, ${(cfg.socials ?? []).length} socials, theme: ${cfg.theme?.preset ?? 'studio'})`);
  process.exit(0);
}

// 4. Write dist/
const out = resolve(root, 'dist');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
try { await cp(resolve(root, 'public'), out, { recursive: true }); } catch {}
// Inline SVG assets (maison logo / wordmark)
const readSvg = async (path) => {
  if (!path) return null;
  const raw = await readFile(resolve(root, 'public', path.slice(1)), 'utf8');
  const viewBox = raw.match(/viewBox="([^"]+)"/)?.[1];
  const inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/\son\w+="[^"]*"/gi, '');
  if (!viewBox) fail([`${path}: SVG needs a viewBox`]);
  return { viewBox, inner };
};
const assets = {};
if (isMaison) {
  assets.logo = await readSvg(cfg.profile.logo);
  assets.wordmark = await readSvg(cfg.profile.wordmark);
  try { await access(resolve(root, 'public/apple-touch-icon.png')); assets.appleTouch = true; } catch {}
}
const html = isMaison ? renderMaison(cfg, assets) : render(cfg);
await writeFile(resolve(out, 'index.html'), html);
await writeFile(resolve(out, 'favicon.svg'), (isMaison && maisonFavicon(cfg, assets)) || favicon(cfg));
await writeFile(resolve(out, '_headers'), `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n/\n  Cache-Control: public, max-age=0, must-revalidate\n`);
console.log(`✓ built dist/index.html (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB, ${visible.length} links)`);
