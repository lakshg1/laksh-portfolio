/**
 * The skills grid (section 05). Separate items with " · ".
 */
import type { StackGroup } from './types';

export const stack: StackGroup[] = [
  { title: 'Languages', items: 'Python · Golang · Java · Kotlin · JavaScript · SQL' },
  { title: 'Backend', items: 'FastAPI · Django · REST · AsyncIO · WebSockets · SQLAlchemy · Microservices' },
  { title: 'AI & GenAI', items: 'OpenAI SDK · Claude · LangChain · LangGraph · RAG · MCP · pgvector · Vertex AI' },
  { title: 'Data', items: 'PostgreSQL · MongoDB · Redis · MySQL' },
  { title: 'Cloud & DevOps', items: 'AWS · Docker · Kubernetes · Jenkins · Ansible · CI/CD' },
  { title: 'Practices', items: 'TDD · Feature toggles · ER modeling · Structured logging · RBAC · SAML' },
];
