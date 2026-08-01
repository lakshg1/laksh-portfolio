import { isAdmin } from '@/lib/guard';
import { passwordConfigured } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  return Response.json({
    authenticated: await isAdmin(),
    configured: passwordConfigured(),
  });
}
