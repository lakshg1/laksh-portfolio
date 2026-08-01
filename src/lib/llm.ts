/**
 * LLM service. Nothing else in the app talks to a model directly — this is the
 * single seam. Every provider speaks the OpenAI-compatible Chat Completions
 * API, so switching is env-only:
 *
 *   LLM_PROVIDER=ollama (default)   OLLAMA_BASE_URL / OLLAMA_MODEL
 *   LLM_PROVIDER=groq               GROQ_API_KEY   / GROQ_MODEL
 *   LLM_PROVIDER=gemini             GEMINI_API_KEY / GEMINI_MODEL
 *
 * If the endpoint is unreachable (or the provider's key is missing), callers
 * fall back to a deterministic template so the feature degrades gracefully.
 */

export type Mode = 'generic' | 'targeted';
export type Length = 'short' | 'long';

export interface GenInput {
  cvText: string;
  mode: Mode;
  length?: Length;
  company?: string;
  role?: string;
  prompt?: string;
}

export interface GenResult {
  content: string;
  model: string;
  source: 'llm' | 'template';
}

interface Provider {
  name: string;
  baseUrl: string;
  model: string;
  apiKey?: string;
}

/** Resolve the active provider from env. Unknown values fall back to ollama. */
function provider(): Provider {
  switch ((process.env.LLM_PROVIDER || 'ollama').toLowerCase()) {
    case 'groq':
      return {
        name: 'groq',
        baseUrl: 'https://api.groq.com/openai/v1',
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        apiKey: process.env.GROQ_API_KEY,
      };
    case 'gemini':
      return {
        name: 'gemini',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
        // Rolling alias — pinned versions (e.g. gemini-2.5-flash) get retired for new keys.
        model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
        apiKey: process.env.GEMINI_API_KEY,
      };
    default:
      return {
        name: 'ollama',
        baseUrl: (process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1').replace(/\/$/, ''),
        model: process.env.OLLAMA_MODEL || 'qwen3',
        apiKey: process.env.OPENAI_API_KEY,
      };
  }
}

function system(length: Length): string {
  const shape =
    length === 'short'
      ? 'Exactly 2 tight paragraphs, 110–160 words total — recruiters skim; every sentence earns its place.'
      : '3–4 short paragraphs, ~250–320 words.';
  return [
    'You are a professional career writer. Write a concise, confident cover letter',
    'in first person as the candidate. Ground every claim ONLY in the provided CV —',
    `never invent employers, dates, or metrics. ${shape}`,
    'Plain prose, no markdown headings, no bullet points, no placeholders like [Company].',
    'Do not include the contact header or signature block — body paragraphs only.',
  ].join(' ');
}

function userPrompt(i: GenInput): string {
  const target =
    i.mode === 'targeted'
      ? `Target role: ${i.role || 'the advertised role'}\nTarget company: ${i.company || 'the company'}\n` +
        (i.prompt ? `Extra context about the company / job:\n${i.prompt}\n` : '')
      : 'Write a GENERIC letter suitable for backend / AI engineering roles. Do not name a specific company.\n';
  return `${target}\n--- CANDIDATE CV (verbatim) ---\n${i.cvText.slice(0, 12000)}\n--- END CV ---`;
}

/** Deterministic fallback used when the model endpoint is unreachable. */
export function templateLetter(i: GenInput): string {
  const company = i.company?.trim();
  const role = i.role?.trim();
  const focus = (i.mode === 'targeted' && company) || 'your team';
  // Generic letters must be sendable as-is — never emit bracket placeholders.
  const opening =
    i.mode === 'targeted'
      ? `I am writing to express my interest in the ${role || 'advertised'} position at ${company || 'your company'}.`
      : 'I am writing to express my interest in a backend engineering role with your team.';
  if (i.length === 'short') {
    return [
      `${opening} I bring over four years of experience building production backend services and LLM agent systems — most recently architecting an AI-powered Brand Intelligence platform at Kyko AI with FastAPI, LangGraph and pgvector, and previously delivering Golang microservices and CI/CD automation for enterprise clients at Thoughtworks and Microland.`,
      `I work comfortably across Python, Golang, RAG pipelines, PostgreSQL and cloud-native deployment, and I would welcome the chance to discuss how that maps to ${focus}'s goals. Thank you for your time and consideration.`,
    ].join('\n\n');
  }
  return [
    `${opening} As a backend engineer with over four years of experience building production services and LLM agent systems, I was excited by the chance to contribute to ${focus}.`,
    'In my current role at Kyko AI, I architected an AI-powered Brand Intelligence platform that processes 400+ social posts and full website content per ingestion using FastAPI, LangGraph, Vertex AI Embeddings and pgvector. I designed the end-to-end ingestion lifecycle and built 20+ REST endpoints and autonomous agent workflows with structured, fully traceable logging — taking LLM systems from data modeling through to observability.',
    'Earlier, at Thoughtworks and Microland, I delivered Golang microservices, WebSocket messaging for 15+ enterprise clients, RBAC/SAML-authenticated tooling, and CI/CD automation that eliminated 20+ engineering hours weekly. I work comfortably across Python and Golang, RAG and vector retrieval, PostgreSQL, and cloud-native deployment on AWS, Docker and Kubernetes.',
    `I would welcome the opportunity to discuss how my background maps to ${focus}'s goals. Thank you for your time and consideration.`,
  ].join('\n\n');
}

function clean(text: string): string {
  // qwen3 and similar reasoning models may emit <think>…</think> — strip it.
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/^```[a-z]*\n?|\n?```$/gi, '')
    .trim();
}

export async function generate(i: GenInput): Promise<GenResult> {
  const p = provider();
  // Stored on the letter row so the admin list shows what produced each one.
  const model = `${p.name}/${p.model}`;
  try {
    // Hosted providers reject keyless requests anyway — fail fast to the template.
    if (p.name !== 'ollama' && !p.apiKey) throw new Error(`${p.name}: missing API key`);
    const res = await fetch(`${p.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(p.apiKey ? { Authorization: `Bearer ${p.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: p.model,
        temperature: 0.6,
        messages: [
          { role: 'system', content: system(i.length ?? 'long') },
          { role: 'user', content: userPrompt(i) },
        ],
      }),
      // don't hang the request forever if the endpoint is down
      signal: AbortSignal.timeout(120_000),
    });
    if (!res.ok) throw new Error(`LLM ${res.status}`);
    const data = await res.json();
    const content = clean(data?.choices?.[0]?.message?.content ?? '');
    if (!content) throw new Error('empty completion');
    return { content, model, source: 'llm' };
  } catch {
    return { content: templateLetter(i), model, source: 'template' };
  }
}
