# Laksh Gupta — Portfolio

Personal portfolio for recruiters and hiring managers.
**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Vanta.js/three.js fog hero · deployed on Vercel.

Live design: minimal centered hero over an animated fog, a 4-system deep-dive switcher,
an interactive architecture diagram, capabilities grid, experience timeline, and a
skin system that can re-theme the entire site with one line.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build — run before every push |
| `npm run typecheck` | TypeScript check without building |
| `npm run lint` | Next.js lint rules |
| `npm run resume <file.pdf>` | Swap in a new résumé + stamp today's date |

---

## Project structure

```
├── public/
│   └── resume.pdf            ← the file recruiters download (stable URL)
├── scripts/
│   └── update-resume.mjs     ← powers `npm run resume`
└── src/
    ├── app/
    │   ├── layout.tsx        ← metadata, fonts, theme + skin bootstrap, JSON-LD
    │   ├── page.tsx          ← section order lives here
    │   ├── globals.css       ← ALL styling: @theme tokens, skins, effects
    │   ├── icon.svg          ← favicon ("L" on accent)
    │   ├── studio/           ← hidden skin switcher route (noindexed)
    │   ├── sitemap.ts / robots.ts
    ├── content/              ←←← EDIT HERE — components render whatever this says
    │   ├── site.ts           ← name, rotating roles, links, résumé date, ticker
    │   ├── skin.ts           ← THE SKIN SWITCH
    │   ├── systems.ts        ← the systems switcher panels
    │   ├── pipeline.ts       ← architecture diagram stages
    │   ├── capabilities.ts   ← capability cards
    │   ├── experience.ts     ← work history
    │   ├── stack.ts          ← skills groups
    │   └── types.ts          ← shapes (don't edit to change content)
    └── components/           ← never contain content
        ├── Hero.tsx  Nav.tsx  Ticker.tsx  Footer.tsx  Contact.tsx
        ├── Systems.tsx  Pipeline.tsx  Capabilities.tsx  Experience.tsx  Stack.tsx
        ├── FogBackground.tsx ← Vanta fog for cinematic skins (FOGLESS set inside)
        ├── SkinEffects.tsx   ← every skin's signature layer + company backdrops
        ├── SkinPicker.tsx    ← nav dropdown (one-line removable, see Switching)
        ├── RoleRotator.tsx   ← crossfading hero roles
        └── ThemeToggle.tsx  Reveal.tsx  SectionHeader.tsx  Tag.tsx
```

**The rule:** components never contain words; content files never contain markup
(beyond inline `<b>`/`<i>`). To change what the site *says*, only touch `src/content/`.

---

## Editing content

| Task | File | Notes |
|---|---|---|
| Headline / lede / contact links | `content/site.ts` | One field each |
| Rotating hero roles | `content/site.ts` → `roles` | 2–5 short roles read best |
| Add a system panel | `content/systems.ts` | Append an object — tab appears automatically; first entry loads selected |
| Add a pipeline stage | `content/pipeline.ts` | SVG lays itself out — no coordinates; 4–6 stages fit best |
| Add a capability card | `content/capabilities.ts` | Grid reflows |
| Add a job / promotion | `content/experience.ts` | Two `titles` in one role renders as a promotion |
| Add skills | `content/stack.ts` | `" · "`-separated string |
| Hero stats (currently hidden) | `content/site.ts` → `stats` | Data kept; re-render by mapping it in `Hero.tsx` |

Run `npm run typecheck` after editing — typos fail loudly before they ship.

### Writing guidance (worth keeping)

The `notes` fields in `systems.ts` and `pipeline.ts` are the highest-value words on
the site. Write **decisions and trade-offs**, not technology lists — "made runs
resumable rather than restartable" beats "used AsyncIO". Interviewers ask about
exactly these lines.

---

## Updating the résumé

```bash
npm run resume ~/Downloads/Laksh_Gupta_Resume.pdf
git add -A && git commit -m "chore: update résumé" && git push
```

The script copies the PDF to `public/resume.pdf`, rejects non-PDFs, and rewrites the
`resumeUpdated` date in `site.ts` so the "Résumé · <Month Year>" label can never
silently go stale. The URL is permanently `/resume.pdf` — links you emailed months ago
keep working and serve the newest file.

---

## Skins — one-line full-site re-theming

The entire site (accents, fog, atmosphere effects) switches personality via
`src/content/skin.ts`:

```ts
export const configuredSkin: Skin = 'fog';
```

| Skin | Mood | Extra effects |
|---|---|---|
| `fog` | Coral haze light / steel-blue smoke dark (default) | Drifting dust motes |
| `plain` | **The professional mode** — camel paper light / warm charcoal dark, zero motion. A static gradient wash keeps it from reading flat. Screenshot-safe. | None, by design |
| `panther` | Vibranium — silver-lavender light, violet-on-black dark | Kinetic energy ripples |
| `spider` | Red-and-blue, both modes | Corner web + spider descending on a thread |
| `ironman` | Hot-rod red and gold | Arc-reactor glow + repulsor streak |
| `thor` | Storm blue and lightning silver | Random lightning strikes over the hero |
| `cap` | Navy, red and silver | Slow counter-rotating shield rings |
| `doom` | Gunmetal and emerald | Pulsing aura + rising embers |
| `breakingbad` | Desert ochre, chemistry green, hazmat yellow | Beaker bubbles rising |
| `peaky` | 1920s soot, newsprint sepia, whisky amber | Falling ash + old-film flicker |
| `starwars` | Space black, crawl gold, saber blue | Twinkling starfield + shooting stars |
| `minions` | Banana yellow and denim blue | Goggle-ringed bubbles bobbing up |
| `got` | Ice and fire — cold iron, pale ice, ember red | Snow falls left, embers rise right |
| `netflix` | Signature red on near-black | Cinematic red light beams sweeping (no fog) |
| `hotstar` | Stream navy + saffron | Breathing saffron sun + projector shimmer (no fog) |
| `instagram` | Sunset gradient hues | The gradient itself, slowly wandering (no fog) |
| `whatsapp` | Chat green | Soft chat bubbles floating up (no fog) |
| `meta` | Gradient blue-violet | Two gradient orbs in slow orbit (no fog) |
| `microsoft` | Quiet four-color pastels | Four quadrant washes breathing in stagger (no fog) |
| `atlassian` | Product blue | Angular blue peaks bobbing (no fog) |
| `google` | Muted primaries | Four primary-color orbs drifting (no fog) |
| `stripe` | Blurple haze | Skewed gradient ribbons drifting (no fog) |
| `uber` | Monochrome + safety green | Route lines with traveling waypoint dots (no fog) |
| `oppenheimer` | Ash monochrome + trinity orange | Falling ash + rare slow bloom |
| `dune` | Spice ochre + stillsuit grey | Sand drifting sideways |
| `interstellar` | Deep space + cornfield gold | Starfield + rotating accretion ring |
| `matrix` | Phosphor green on black | Digital rain (no fog) |
| `f1` | Carbon + racing red | Speed lines + pit stripes (no fog) |
| `ghibli` | Pastel sky, forest + terracotta | Floating seeds on the wind |
| `amazon` | Smile orange + navy | Breathing delivery arc (no fog) |
| `apple` | Monochrome + product blue | A single quiet spotlight (no fog) |
| `airbnb` | Coral + teal | Warm orbs in slow orbit (no fog) |
| `spotify` | Signature green on near-black | Equalizer bars along the bottom (no fog) |

### Defaults — what a first-time visitor sees

| Default | Where to set it | Current value |
|---|---|---|
| **Skin** | `src/content/skin.ts` → `configuredSkin` | `'fog'` |
| **Skin (build override)** | Vercel env `NEXT_PUBLIC_SKIN` | unset |
| **Light/dark** | Follows the visitor's OS (`prefers-color-scheme`) | auto |
| **Force light or dark for everyone** | `src/app/layout.tsx` → `themeBootstrap` script | not forced |

To force a theme regardless of visitor OS, replace the matchMedia line inside
`themeBootstrap` in `layout.tsx`:

```js
// before (follows OS):
t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
// after (everyone starts dark — they can still toggle):
t = 'dark';
```

Visitor choices always win after that: the ☾/☀ toggle and any skin picked in the
nav dropdown or /studio persist per-browser via localStorage
(keys: `theme`, `skin-override`).

### Switching

0. **Nav dropdown (temporary, for review):** a skin picker sits in the nav next to
   the theme toggle — grouped Core / Characters / Companies, applies instantly,
   same per-browser override as /studio. **To hide it from visitors:** comment out
   the `<SkinPicker />` line in `src/components/Nav.tsx` (it's marked with a
   comment). /studio keeps working after you do.
1. **The secret studio (instant, no deploy):** visit **`/studio`** — a hidden,
   noindexed route with a one-click picker for every skin. Applies live and
   persists **in that browser only** via localStorage; every other visitor keeps
   seeing the deployed default. Reset from the same page. This is the day-to-day
   switch — use it from your phone mid-conversation if you like.
2. **Changing what everyone sees (deploy):** edit `configuredSkin` in
   `src/content/skin.ts` via the GitHub pencil icon, commit — Vercel redeploys in ~60s.
3. **Env var (no commit):** Vercel → Settings → Environment Variables →
   `NEXT_PUBLIC_SKIN=thor` → Redeploy. Env wins over the file.
4. **Local preview:** `NEXT_PUBLIC_SKIN=doom npm run dev`

`/studio` is unlisted rather than authenticated — anyone who guesses the URL can
restyle *their own view*, which is harmless. Nothing they do affects other visitors.

### How it works

- `layout.tsx` stamps `<html data-skin="…">` at build time.
- `globals.css` has a `[data-skin='…']` token block per skin (light) and a
  `[data-skin='…'][data-t='dark']` block (dark). Skins override **accents and
  atmosphere only** — layout, fonts, spacing and content never change.
- `FogBackground.tsx` keys its Vanta palette on the same attribute.
- `SkinEffects.tsx` mounts each skin's signature layer — every skin has one.
- **Fog is reserved for cinematic personas** (storms, smoke, embers). Company
  skins and `plain` are fogless — they get bespoke CSS backdrops instead
  (`FOGLESS` set in `FogBackground.tsx`), which also means they skip the
  three.js download entirely.

### Adding a skin

1. Add the name to `SKINS` in `content/skin.ts`.
2. Add both CSS blocks in `globals.css` (copy an existing pair).
3. Add a fog palette in `FogBackground.tsx` → `FOG_THEMES`.
4. Optional: an effect layer in `SkinEffects.tsx`.
5. **Check contrast.** Every accent must hit ≥4.5:1 against its background
   (WCAG AA). All 33 shipped skins pass — the generator refuses to emit a failing palette; keep that bar.

**A deliberate boundary:** skins are palette-and-mood only — no character imagery,
logos or names in the UI. Copyrighted branding on a hiring portfolio is an IP risk
and reads unprofessional to recruiters. Hue families deliver the vibe safely.

---

## Theming (light/dark) — separate from skins

Every skin has a light and a dark mode. The toggle (☾/☀ in the nav):

- Defaults to the visitor's OS preference (`prefers-color-scheme`)
- Persists their choice in `localStorage`
- Applies before first paint via an inline script — no flash of wrong theme
- Fog and effects re-color live on toggle without re-initialising

---

## Design system

- **Fonts** (matched to reference): Cormorant Garamond 300 (display name),
  Space Grotesk (body), JetBrains Mono (labels/metadata). Loaded via Google Fonts
  `<link>` in `layout.tsx`.
- **Tokens:** everything is a CSS variable in the `@theme` block —
  `--color-bg/surface/panel/line/line2/tx/tx2/tx3/accent/accent2/btntx`.
  Tailwind v4 generates utilities (`bg-bg`, `text-accent`) from them.
- **Motion:** Framer Motion scroll reveals (`Reveal.tsx`), role rotator, fog,
  skin effects. Everything respects `prefers-reduced-motion` — those visitors get
  a static, fully readable page.
- **Film grain:** `body::after` overlay, opacity per theme via `--grain`.

## Performance & SEO

- Fully static — every route prerendered, no server code.
- First load JS ~144 kB; three.js (~600 kB) loads **lazily after paint** and only
  when motion is allowed.
- `sitemap.xml`, `robots.txt`, OpenGraph/Twitter metadata, JSON-LD `Person` schema.
- Set `NEXT_PUBLIC_SITE_URL` in Vercel to the real domain for correct canonical URLs.

## Deploy

```bash
git init && git add -A && git commit -m "feat: portfolio"
git branch -M main
git remote add origin https://github.com/lakshg1/laksh-portfolio.git
git push -u origin main
```

Then [vercel.com](https://vercel.com) → sign in with GitHub → New Project → import →
Deploy. No env vars required. Every push to `main` auto-deploys; PRs get preview URLs.

**Domain:** free `lakshgupta.is-a.dev` via PR to the
[is-a.dev registry](https://github.com/is-a-dev/register) pointing at the Vercel URL,
or attach a paid domain in Vercel → Settings → Domains.

## Routes

| Route | What it is | Indexed? |
|---|---|---|
| `/` | The portfolio | yes |
| `/studio` | Hidden skin switcher | **no** (noindex + absent from sitemap) |
| `/resume.pdf` | The downloadable résumé — permanent URL | n/a |
| `/sitemap.xml`, `/robots.txt` | Generated by `sitemap.ts` / `robots.ts` | — |
| `/icon.svg` | Favicon | — |

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Old favicon (or wrong icon) in the tab | Browsers cache favicons per-origin aggressively. Close the tab and open a fresh one; or visit `/icon.svg` directly once. Localhost may show a stale icon from another app that ran on port 3000. |
| Site stuck on one skin | You have a per-browser override. Open `/studio` → "Reset to deployed default", or clear the `skin-override` localStorage key. |
| Hero background is empty / no fog | Either the skin is intentionally fogless (`plain` + all company skins), or the OS has reduced-motion enabled — both are by design. |
| Fog didn't change after toggling theme/skin | Should be live; if it ever sticks, hard-refresh. If reproducible, check the browser console for a Vanta error. |
| Changes not appearing on localhost | Confirm you edited the folder the dev server is actually running from, then hard-refresh. Next.js occasionally needs a dev-server restart after config changes. |
| `npm run build` fails on types | Run `npm run typecheck` for the exact error — usually a typo in a content file. |
| Port 3000 busy | `npm run dev -- -p 3001` |

## Maintenance

This site is deliberately low-maintenance: fully static, four runtime dependencies
(next, react, framer-motion, three/vanta), no database, no server, no analytics
service to break. What little upkeep exists:

### Recurring

| Cadence | Task |
|---|---|
| Per job application | `npm run resume <pdf>` if the résumé changed; pick the skin (deploy default or /studio per-browser) |
| Monthly-ish | Glance at the Vercel dashboard — deployment green, domain valid |
| Every 3–6 months | Dependency refresh (below) |
| Yearly | Re-read the content files top to bottom — stale copy is the most common portfolio failure. Check `resumeUpdated` isn't embarrassing |

### Dependency refresh (the safe way)

```bash
npm outdated                 # see what moved
npm update                   # patch/minor only — safe
npm run typecheck && npm run build   # gate before pushing
```

For **major** versions (Next 15→16, React, Tailwind), do them one at a time on a
branch, build after each, and read the package's migration notes. Vercel builds the
PR as a preview URL — check that preview before merging. The riskiest pins here are
`three`/`vanta` (fog) and Tailwind majors (token syntax); everything else is boring.

If a dependency upgrade breaks the fog and you don't want to debug it: the site
degrades gracefully — fog simply not initialising leaves a clean readable hero.
Fix at leisure.

### Pre-launch / periodic checklist

- [ ] `plain` and the default skin look right in **both** light and dark
- [ ] Résumé downloads and opens; date label matches the file
- [ ] `/studio` reachable, resets correctly
- [ ] Mobile pass (nav collapses, hero fits, tap targets ok)
- [ ] Lighthouse in Chrome DevTools: expect 90+ across the board on `plain`

---

## Future development — a roadmap of sensible next steps

Ordered by value-per-effort. None are needed for launch.

**1. OG share image (~30 min).** Add `src/app/opengraph-image.tsx` (Next generates
it at build) so links pasted into Slack/LinkedIn/WhatsApp show a branded card
instead of a blank preview. Highest-visibility small win available.

**2. Analytics (~10 min).** Vercel → project → Analytics → Enable (free tier).
Tells you whether recruiters actually open the site and what they click. No code.

**3. Contact form (~1 hr).** Currently mailto-only, which is fine. If you want a
form: Web3Forms or Formspree free tier — the form POSTs to their endpoint, lands in
your inbox, no server. Add the access key via env var, render in `Contact.tsx`.

**4. Case-study pages (~1 day each).** Grow a `systems.ts` entry into
`/work/brand-intelligence` with architecture diagrams and decision narratives.
Strongest possible interview-prep artifact; add a `content/case-studies/` folder
and one dynamic route.

**5. Blog (only if you'll write).** `/blog` with MDX. An empty blog is worse than
none — commit to 3 posts before building it.

**6. Per-skin OG images (~2 hrs).** The share card matches the active deploy skin.
Pure polish.

**7. New skins (~30 min each).** Fully recipe-ized — see "Adding a skin" above
(SKINS array → two CSS blocks → fog palette or backdrop → optional effect →
contrast check ≥4.5:1). The original parked ideas (Oppenheimer, Dune, Interstellar,
Matrix, F1, Ghibli, Amazon, Apple, Airbnb, Spotify) have all shipped — 33 skins
total. Still unclaimed if the itch returns: Blade Runner, Wes Anderson, Tron,
Slack, Figma, Notion. Keep the IP rule: palettes and moods, never logos or imagery.

**8. A `/uses` or `/now` page (~1 hr).** Developer-culture staples; cheap
personality, occasionally sparks interview small talk.

### Adding features without breaking the architecture

The one rule that keeps this maintainable: **content in `src/content/`, rendering
in `src/components/`, styling tokens in `globals.css`.** Every feature above fits
that split. If a change wants to hardcode words into a component, it's designed
wrong — add a content file instead.

### Things deliberately NOT built (so future-you doesn't wonder)

- **CMS** — content files in git are simpler, versioned, and typo-checked by `tsc`
- **Auth on /studio** — per-browser overrides make it harmless; auth needs a server
- **i18n** — target audience reads English; big complexity multiplier
- **Server anything** — static means free hosting, zero attack surface, no 3am pages

---

## Pre-push checklist

```bash
npm run typecheck && npm run build
```

Both must pass. If you edited a skin: check both light and dark modes, and verify
accent contrast.
