/**
 * Shared shapes for every content file.
 * Editing content? You want the other files in this folder — not this one.
 * TypeScript uses these to catch typos before the site ever builds.
 */

export type Stat = {
  /** The number or short value, e.g. "20+" or "~90%". */
  value: string;
  /** What it measures, e.g. "REST endpoints". Keep it under four words. */
  label: string;
};

export type System = {
  /** Stable key used for React lists. Lowercase, no spaces. */
  id: string;
  /** Short label shown on the switcher button. */
  tab: string;
  /** Sub-label under the tab, e.g. "AI & retrieval". */
  domain: string;
  /** Full system name shown as the panel heading. */
  name: string;
  /** Where and when, e.g. "Kyko AI · 2026". */
  context: string;
  /** Small badge, e.g. "AI Platform". */
  badge: string;
  /** One or two sentences on what the system does and what you owned. */
  summary: string;
  stats: Stat[];
  /**
   * The most valuable field on this page. Each note should describe a
   * DECISION and its trade-off, not a technology. Recruiters skim these;
   * interviewers ask about them. Inline <b> and <i> are allowed.
   */
  notes: string[];
  tech: string[];
};

export type PipelineStage = {
  id: string;
  /** Label inside the diagram node. Keep to one short word — it must fit. */
  short: string;
  /** Small text under the node label. Two or three words maximum. */
  caption: string;
  /** Heading in the detail panel below the diagram. */
  title: string;
  /** Monospace tag beside the detail heading. */
  meta: string;
  /** The engineering reasoning for this stage. Two or three sentences. */
  body: string;
  tech: string[];
};

export type Capability = {
  title: string;
  body: string;
  /** Companies where this was earned, e.g. "Kyko · Microland". */
  earnedAt: string;
};

export type Role = {
  company: string;
  location: string;
  /** Outer date range covering every title held here. */
  dates: string;
  /** One entry per title. Two entries renders as a promotion. */
  titles: {
    title: string;
    /** Only shown when a company has more than one title. */
    dates?: string;
    /** Inline <b> is allowed — use it on metrics and technologies. */
    bullets: string[];
  }[];
  /** Optional teal callout under the bullets. */
  note?: string;
  tech: string[];
};

export type StackGroup = {
  title: string;
  /** Rendered verbatim. Separate items with " · ". */
  items: string;
};
