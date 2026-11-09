# Instructions for coding agents

This repo is a link-in-bio page. **All content and styling choices live in `links.yml`.**
The format is defined by `schema/links.schema.json`.

## Rules

1. To change what the page says or how it looks, edit **only `links.yml`** (and add image files to `public/` when needed).
2. Do not edit `src/`, `scripts/` or the schema to change content. Those are the renderer.
3. After every edit run `npm run validate`. It prints the exact field path of any problem. Fix and re-run until it prints `✓`.
4. Then run `npm run build` and confirm it succeeds. Deploy only if the user asks (`npm run deploy`).
5. Keep the user's existing order and wording unless they asked to change it.

## Field cheat-sheet

| Want to… | Do this in `links.yml` |
|---|---|
| Add a link | Append `- title: …` / `url: https://…` under `links:` (optional `description`, `icon`) |
| Group links | Insert `- section: Name` before the links that belong to it |
| Promote one link | `featured: true` on it (only one allowed) |
| Hide without deleting | `hidden: true` |
| Add a social icon | Under `socials:` add `- icon: <slug>` / `url: …` |
| Change the look | `theme.preset`: `studio` · `midnight` · `bloom` · `mono` |
| Force light/dark | `theme.mode`: `auto` · `light` · `dark` |
| Brand color | `theme.accent: "#RRGGBB"` (text color on it is picked automatically) |
| Corners | `theme.radius`: `sharp` · `soft` · `round` |
| Profile photo | Put the file in `public/` and set `profile.avatar: /file.jpg` |
| Status line | `profile.status: "Open to work"` (remove the key to hide it) |
| Share preview | `meta.url`, `meta.title`, `meta.description`, `meta.image` |

**Icons:** any slug from [simpleicons.org](https://simpleicons.org) (lowercase, e.g. `github`, `x`, `instagram`, `youtube`, `tiktok`, `bluesky`, `threads`, `mastodon`, `spotify`, `discord`, `substack`, `dribbble`), plus built-ins: `linkedin`, `mail`, `globe`, `link`, `rss`, `phone`, `calendar`. Unknown slugs fail validation.

**URLs** must start with `https://`, `http://`, `mailto:` or `tel:`.

## Example requests a user might give you

- "Add my new podcast at https://pod.example.com under a section called Listen, with the Spotify icon."
- "Switch to the midnight theme and make the accent #FF5A1F."
- "Feature my course launch link instead of the field guide."
- "Replace the placeholder profile with: Sam Rivera, @samr, illustrator in Mexico City."
