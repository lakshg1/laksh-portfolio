/**
 * SITE SKIN — the one-line theme switch.
 *
 * Options:
 *   'fog'     — coral haze / steel-blue smoke (the original)
 *   'plain'   — zero motion, zero texture. The screenshot-safe professional mode
 *   'panther' — vibranium: violet-on-black, silver light mode
 *   'spider'  — red-and-blue, both modes
 *   'ironman' — hot-rod red and gold
 *   'thor'    — storm blue and lightning silver
 *   'cap'     — navy, red and silver
 *   'doom'    — gunmetal and emerald green, pulsing aura + embers
 *   'breakingbad' — desert ochre, chemistry green, hazmat yellow
 *   'peaky'   — 1920s soot, newsprint sepia, whisky amber
 *   'starwars' — space black, crawl gold, saber blue
 *   'minions' — banana yellow and denim blue
 *   'got'     — ice and fire: cold iron, pale ice, ember red
 *
 * To switch: edit this line on GitHub (pencil icon → commit) and Vercel
 * redeploys automatically. Or override without a commit by setting the
 * NEXT_PUBLIC_SKIN environment variable in Vercel → Settings → Environment
 * Variables (takes precedence over this file).
 */
export const SKINS = [
  'fog', 'plain', 'panther', 'spider', 'ironman', 'thor', 'cap', 'doom',
  'breakingbad', 'peaky', 'starwars', 'minions', 'got',
  // Company palettes — flip to match where you're applying.
  'netflix', 'hotstar', 'instagram', 'whatsapp', 'meta',
  'microsoft', 'atlassian', 'google', 'stripe', 'uber',
  // Wave 3 — cinema + more companies
  'oppenheimer', 'dune', 'interstellar', 'matrix', 'f1', 'ghibli',
  'amazon', 'apple', 'airbnb', 'spotify',
] as const;
export type Skin = (typeof SKINS)[number];

export const configuredSkin: Skin = 'plain';

export function resolveSkin(): Skin {
  const env = process.env.NEXT_PUBLIC_SKIN;
  if (env && (SKINS as readonly string[]).includes(env)) return env as Skin;
  return configuredSkin;
}
