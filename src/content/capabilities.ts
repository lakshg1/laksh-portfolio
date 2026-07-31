/**
 * The six capability cards (section 03).
 * Add or remove cards freely — the grid reflows automatically.
 */
import type { Capability } from './types';

export const capabilities: Capability[] = [
  {
    title: 'API & service design',
    body: 'REST and WebSocket services in Python and Golang — schema through versioning to auth. Concurrent request handling with AsyncIO, and real-time bidirectional messaging over persistent connections.',
    earnedAt: 'Kyko · Microland · Thoughtworks',
  },
  {
    title: 'Data modeling',
    body: 'Domain-aligned relational schemas, SQLAlchemy models, ER diagrams before implementation. Restructured an unstructured data layer into something a team could extend without breaking it.',
    earnedAt: 'Kyko · Microland',
  },
  {
    title: 'AI & retrieval systems',
    body: 'Agent workflows on LangGraph and the OpenAI SDK, RAG pipelines, vector search over pgvector with Vertex AI embeddings — plus the unglamorous half: quota batching, resumable runs, failure isolation.',
    earnedAt: 'Kyko · Thoughtworks',
  },
  {
    title: 'Infra & deployment',
    body: 'Containerized microservices on Docker and Kubernetes, provisioning automated with Ansible, CI/CD through Jenkins, and automated product signing for verified releases to client infrastructure.',
    earnedAt: 'Microland · Axis Bank',
  },
  {
    title: 'Observability',
    body: 'Run-ID structured logging, lifecycle monitoring, metrics instrumentation — built because I was the one debugging it at 2am. Directly cut support ticket volume by nearly a third.',
    earnedAt: 'Kyko · Microland',
  },
  {
    title: 'Security & access',
    body: 'RBAC across enterprise tooling, SAML single sign-on, security feature toggles, and pre-deployment test gates for regulated client environments.',
    earnedAt: 'Microland',
  },
];
