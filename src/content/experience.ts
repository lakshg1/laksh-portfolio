/**
 * Work history (section 04). Newest first.
 * A role with two `titles` entries renders as a promotion inside one company.
 * Inline <b> is allowed in bullets — use it on metrics and key technologies.
 */
import type { Role } from './types';

export const experience: Role[] = [
  {
    company: 'Kyko AI',
    location: 'Bengaluru',
    dates: 'Feb 2026 — Present',
    titles: [
      {
        title: 'Backend Engineer',
        bullets: [
          'Architected an AI-powered Brand Intelligence platform end to end, working directly with founders.',
          'Shipped <b>20+ REST endpoints</b> and autonomous agent workflows with Python, LangChain and the OpenAI SDK.',
          'Restructured an unstructured data layer into domain-aligned <b>PostgreSQL</b> schemas and SQLAlchemy models, authoring the ER and architecture diagrams the team now builds against.',
          'Built concurrent ingestion with <b>AsyncIO</b> and resumable run-lifecycle management across third-party platform APIs.',
          'Instrumented run-ID structured logging and lifecycle monitoring so every pipeline execution is traceable in production.',
          'Engineered LLM-assisted <b>Playwright</b> automation validating real user journeys, saving <b>8+ QA hours</b> per release.',
        ],
      },
    ],
    tech: ['FastAPI', 'PostgreSQL', 'pgvector', 'LangGraph', 'AsyncIO', 'SQLAlchemy', 'Playwright'],
  },
  {
    company: 'Thoughtworks',
    location: 'Bengaluru',
    dates: 'Oct 2025 — Jan 2026',
    titles: [
      {
        title: 'Developer Consultant',
        bullets: [
          'Built a skill-centric <b>AI QA agent</b> with Python and Claude for structured knowledge retrieval.',
          'Contributed <b>Golang microservices</b> to an enterprise payment system, and produced system architecture and ER designs for a client VR platform.',
          'Practiced <b>TDD</b> and feature-toggle-gated deployment to client infrastructure.',
        ],
      },
    ],
    tech: ['Golang', 'Claude', 'TDD', 'System Design'],
  },
  {
    company: 'Microland Ltd.',
    location: 'Bengaluru',
    dates: 'Jan 2022 — Oct 2025',
    titles: [
      {
        title: 'Senior Software Developer, Platforms',
        dates: 'Jun 2022 — Oct 2025',
        bullets: [
          'Engineered <b>Golang</b> REST endpoints and <b>WebSocket</b> services delivering real-time messaging to <b>15+ enterprise clients</b> with persistent connection handling.',
          'Instrumented monitoring and metrics across distributed automation services, driving a <b>30% reduction</b> in support tickets and <b>10% increase</b> in adoption.',
          'Built <b>RBAC</b> and <b>SAML</b>-authenticated Django/MongoDB tooling; containerized microservices with Docker and Kubernetes, cutting deployment time <b>10%</b>.',
          'Automated provisioning with <b>Ansible</b> and Jenkins CI/CD — <b>20%</b> efficiency gain, <b>20+ engineering hours</b> saved weekly.',
          'Implemented pre-deployment test coverage, security feature toggles and automated product signing for reliable client releases.',
        ],
      },
      {
        title: 'Software Engineer Intern',
        dates: 'Jan 2022 — Jun 2022',
        bullets: [
          'Developed an <b>RBAC</b>-enabled MongoDB management UI with <b>Python and Django</b>.',
        ],
      },
    ],
    note: 'Promoted from Software Engineer Intern within six months',
    tech: ['Golang', 'Kubernetes', 'Django', 'MongoDB', 'Ansible', 'SAML', 'Jenkins'],
  },
  {
    company: 'Axis Bank',
    location: 'Bengaluru',
    dates: 'May 2021 — Jul 2021',
    titles: [
      {
        title: 'Data Engineer Intern',
        bullets: [
          'Built a Chart.js COVID-19 analytics tracker serving <b>1000+ global users</b>, and cut deployment time <b>20%</b> with Jenkins CI/CD.',
        ],
      },
    ],
    tech: ['Python', 'Jenkins', 'Chart.js'],
  },
];
