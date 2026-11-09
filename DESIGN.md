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
| maison | Instrument Serif caps / PT Serif / Open Sans 700 tracked + Ballet script | ink `#6B5F53` on `#E4DDD2` (light only) | 4px card, no pills |

Tokens per mode: `bg`, `surface`, `surfaceHover`, `ink`, `muted`, `line`, `accent`, `onAccent` — see `src/themes.mjs`.

## Maison

A single sheet of hotel stationery rather than a stack of buttons. Built first for an interiors creator's brand kit and kept generic through `theme.palette`.

- **Signature:** an optional monogram blind-embossed into the paper: three stacked `<use>` layers (shadow, highlight, paper-tinted body).
- **One ink.** Titles, body and labels share one color, and hierarchy comes from typeface, case and tracking. The brand mid-tone (`lineStrong`) is used only for rules and fills, never as text (2.2:1).
- **Rows, not boxes.** Hairline-ruled rows (min 64px tall). One featured card with a double inner rule, echoing a double-oval monogram.
- **Paper:** two inline SVG `feTurbulence` tiles (240px grain, 480px mottle) over a soft radial sheen, with zero image bytes. On desktop the page becomes a framed sheet on a darker desk.
- **Light only.** Emboss and grain only read on light paper, and in-app browsers report `prefers-color-scheme` inconsistently.
- **Motion:** 6px rise, 55ms stagger. Hover effects are scoped to `(hover:hover)` so they never stick in in-app browsers, and press is a wash rather than a scale.
- **Fonts:** Ballet is requested with `text=` holding only the script word's glyphs (a few KB).
