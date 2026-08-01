/**
 * CV helpers — text extraction (unpdf, serverless-friendly) + content hashing.
 * The hash is the identity used for change-detection and generic-letter caching.
 */
import { createHash } from 'node:crypto';
import { extractText, getDocumentProxy } from 'unpdf';

export function hashBytes(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

/** Best-effort PDF → plain text. Never throws; returns '' on failure. */
export async function pdfToText(bytes: Uint8Array): Promise<string> {
  try {
    // pdf.js transfers (detaches) the buffer it is handed, zeroing the caller's
    // view — parse a copy so `bytes` stays intact for hashing and persistence.
    const pdf = await getDocumentProxy(bytes.slice());
    const { text } = await extractText(pdf, { mergePages: true });
    return (Array.isArray(text) ? text.join('\n') : text).trim();
  } catch {
    return '';
  }
}
