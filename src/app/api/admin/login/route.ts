import { cookies } from 'next/headers';
import { checkPassword, passwordConfigured, issueToken, COOKIE, cookieOptions } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!passwordConfigured()) {
    return Response.json({ error: 'ADMIN_PASSWORD is not set on the server' }, { status: 503 });
  }
  const { password } = await req.json().catch(() => ({ password: '' }));
  if (!checkPassword(String(password ?? ''))) {
    return Response.json({ error: 'Wrong password' }, { status: 401 });
  }
  const jar = await cookies();
  jar.set(COOKIE, issueToken(), cookieOptions);
  return Response.json({ ok: true });
}
