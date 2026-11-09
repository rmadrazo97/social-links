# Design notes

**Job of the page:** get a visitor to the right link in one tap.

**Signature:** every link shows its real destination (`github.com`, `email`) in monospace,
so people know where a tap goes before they tap. One optional *featured* card carries the
accent; everything else stays quiet.

## Rules the renderer follows

- Zero JavaScript. One HTML file with inline CSS; icons are inlined SVG, only the ones used.
- Left-aligned hero: display name large and tight, handle/location in mono, bio capped at ~36ch.
- Tap targets ≥ 44px, visible `:focus-visible` ring in the accent color.
- Motion: a single staggered rise on load (45ms steps), arrow nudge on hover, press scale. All off with `prefers-reduced-motion`.
- Light + dark tokens per preset, tested separately (not inverted).
- Body ≥ 16px, muted text ≥ 4.5:1 on its surface.

## Presets

| Preset | Display / body / mono | Accent (light · dark) | Radius |
|---|---|---|---|
| studio | Bricolage Grotesque / Geist / Geist Mono | `#2F45FF` · `#8C9BFF` | soft 14px |
| midnight | Instrument Serif italic / Geist / Geist Mono | `#00797A` · `#3EE0CF` | soft 14px |
| bloom | Fraunces / DM Sans / DM Mono | `#C2185B` · `#FF7AB6` | round 24px |
| mono | Space Grotesk / Space Grotesk / JetBrains Mono | `#000` · `#FFF` | sharp 4px |

Tokens per mode: `bg`, `surface`, `surfaceHover`, `ink`, `muted`, `line`, `accent`, `onAccent` — see `src/themes.mjs`.
