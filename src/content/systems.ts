/**
 * The systems switcher (section 01).
 *
 * Add a system: append an object to the array. It appears automatically —
 * no component changes needed. Reorder the array to reorder the tabs.
 * The first entry is selected on load, so put your strongest work first.
 */
import type { System } from './types';

export const systems: System[] = [
  {
    id: 'brand-intelligence',
    tab: 'Brand Intelligence',
    domain: 'AI & retrieval',
    name: 'Brand Intelligence Platform',
    context: 'Kyko AI · 2026',
    badge: 'AI Platform',
    summary:
      'An end-to-end platform that ingests a brand’s web and social footprint and makes it semantically queryable as “Brand DNA”. I owned the full vertical — data model, ingestion concurrency, embedding pipeline, retrieval layer and observability.',
    stats: [
      { value: '20+', label: 'REST endpoints' },
      { value: '5', label: 'pipeline stages' },
      { value: 'Founder-facing', label: 'ownership' },
    ],
    notes: [
      'Designed <b>domain-aligned PostgreSQL schemas</b> and SQLAlchemy models first, so the ingestion layer had something coherent to write into.',
      'Built concurrency with <b>AsyncIO</b> and made runs <b>resumable rather than restartable</b> — a mid-run failure doesn’t discard completed work.',
      'Benchmarked Firecrawl, Apify, Selenium and Playwright per-source rather than standardising on one, because each fails differently under platform API constraints.',
      'Embedded via <b>Vertex AI</b> in quota-aware batches; vectors land in <b>pgvector</b> beside relational data so a single query can filter on both.',
    ],
    tech: ['FastAPI', 'PostgreSQL', 'pgvector', 'LangGraph', 'AsyncIO', 'Vertex AI'],
  },
  {
    id: 'realtime-messaging',
    tab: 'Real-time messaging',
    domain: 'distributed systems',
    name: 'Real-Time Enterprise Messaging',
    context: 'Microland · 2022–2025',
    badge: 'Distributed',
    summary:
      'Golang services delivering bidirectional real-time messaging and platform integrations to enterprise clients, plus the monitoring layer that made them supportable at scale.',
    stats: [
      { value: '15+', label: 'enterprise clients' },
      { value: '30%', label: 'fewer support tickets' },
      { value: '10%', label: 'adoption increase' },
    ],
    notes: [
      'Built <b>Golang REST endpoints</b> and <b>WebSocket</b> services with persistent connection handling for live client-server messaging.',
      'Instrumented monitoring and metrics across distributed automation services — this is what produced the <b>30% ticket reduction</b>, not a new feature.',
      'Added <b>RBAC</b> and <b>SAML</b> single sign-on across the tooling for regulated enterprise environments.',
      'The real lesson: in enterprise platforms, observability <i>is</i> the feature. Nobody thanks you for it until it’s missing.',
    ],
    tech: ['Golang', 'WebSockets', 'Django', 'MongoDB', 'SAML', 'Redis'],
  },
  {
    id: 'platform-automation',
    tab: 'Infra automation',
    domain: 'infrastructure',
    name: 'Platform & Release Automation',
    context: 'Microland · Axis Bank',
    badge: 'Infrastructure',
    summary:
      'The infrastructure work that let a platform team ship reliably into client environments — containerization, provisioning automation, CI/CD, and verified release signing.',
    stats: [
      { value: '20%', label: 'dev efficiency gain' },
      { value: '20+', label: 'eng hours saved weekly' },
      { value: '10%', label: 'faster deploys' },
    ],
    notes: [
      'Containerized microservices with <b>Docker and Kubernetes</b>, cutting deployment time <b>10%</b>.',
      'Automated infrastructure provisioning with <b>Ansible</b>, removing <b>20+ hours</b> of manual work every week.',
      'Built <b>Jenkins CI/CD</b> pipelines with pre-deployment test coverage and security feature toggles.',
      'Implemented an automated <b>product-signing workflow</b> for verified pre-shipping to client infrastructure.',
    ],
    tech: ['Docker', 'Kubernetes', 'Ansible', 'Jenkins', 'CI/CD', 'AWS'],
  },
  {
    id: 'qa-agent',
    tab: 'QA agent',
    domain: 'developer tooling',
    name: 'LLM-Assisted QA Agent',
    context: 'Kyko AI · Thoughtworks',
    badge: 'Dev Tooling',
    summary:
      'A skill-centric agent that turns plain-language intent into executable browser journeys, producing reproducible test cases instead of brittle recorded scripts.',
    stats: [
      { value: '8+', label: 'QA hours saved per release' },
      { value: '2', label: 'orgs deployed in' },
    ],
    notes: [
      'Built the agent with <b>Python and Claude</b> for structured knowledge retrieval over internal test context.',
      'Generated and executed <b>Playwright</b> journeys validating real user paths, capturing reproducible resolution-oriented cases.',
      'Designed it as composable <b>skills</b> rather than one monolithic prompt, so the team could extend coverage without touching agent internals.',
    ],
    tech: ['Python', 'Claude', 'Playwright', 'LangChain'],
  },
];
