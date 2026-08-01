/** Auth guard for route handlers (Node runtime). */
import { cookies } from 'next/headers';
import { COOKIE, verifyToken } from '@/lib/auth';

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return verifyToken(jar.get(COOKIE)?.value);
}

export function unauthorized(): Response {
  return Response.json({ error: 'unauthorized' }, { status: 401 });
}
