/**
 * The signature architecture diagram (section 02).
 *
 * Stages render left to right and the SVG lays itself out automatically,
 * so adding or removing one needs no geometry maths. Four to six works
 * best — beyond six the node labels get cramped.
 *
 * Keep `short` to a single word and `caption` to two or three.
 */
import type { PipelineStage } from './types';

export const pipelineMeta = {
  heading: 'Brand DNA pipeline',
  label: 'Kyko AI · ingestion architecture',
  /** Small live-looking badge, top right of the diagram. */
  badge: 'Resumable run lifecycle',
  /** The dashed rail beneath the nodes. */
  rail: 'run_id · structured logging · lifecycle monitoring across every stage',
  intro:
    'A closer look at the hardest system I’ve built. Click any stage to see the engineering decision behind it — these are the trade-offs, not the tech list.',
};

export const pipeline: PipelineStage[] = [
  {
    id: 'sources',
    short: 'SOURCES',
    caption: 'web · social',
    title: 'Sources',
    meta: 'web · social',
    body:
      'A brand’s website plus Instagram and X. The hard part isn’t reading them — it’s that every source rate-limits differently, changes markup without notice, and requires its own platform verification.',
    tech: ['Meta API', 'X API', 'Firecrawl'],
  },
  {
    id: 'extract',
    short: 'EXTRACT',
    caption: 'per-source tooling',
    title: 'Extraction',
    meta: 'per-source tooling',
    body:
      'Benchmarked Firecrawl, Apify, Selenium and Playwright against real failure modes, then chose per source rather than standardising. Retries with backoff and partial-failure isolation mean one dead source never kills a run.',
    tech: ['Playwright', 'Apify', 'Selenium'],
  },
  {
    id: 'process',
    short: 'PROCESS',
    caption: 'speech + caption',
    title: 'Processing',
    meta: 'speech + caption',
    body:
      'Video speech transcription and caption parsing normalise wildly different media into one text representation. Content evaluation then scores what is actually brand signal versus noise.',
    tech: ['AsyncIO', 'Python'],
  },
  {
    id: 'embed',
    short: 'EMBED',
    caption: 'Vertex AI',
    title: 'Embedding',
    meta: 'Vertex AI',
    body:
      'Normalised content is embedded in batches sized against API quota. Run-lifecycle management makes a run resumable rather than restartable, so a late failure doesn’t discard everything already completed.',
    tech: ['Vertex AI', 'LangGraph'],
  },
  {
    id: 'retrieve',
    short: 'RETRIEVE',
    caption: 'pgvector',
    title: 'Retrieval',
    meta: 'pgvector',
    body:
      'Vectors land in PostgreSQL via pgvector, indexed for low-latency similarity search. Keeping vectors beside relational data avoids a second datastore and lets one query filter on both.',
    tech: ['pgvector', 'PostgreSQL', 'SQLAlchemy'],
  },
];
