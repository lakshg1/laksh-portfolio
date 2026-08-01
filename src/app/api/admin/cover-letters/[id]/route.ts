import { isAdmin, unauthorized } from '@/lib/guard';
import { getLetter, deleteLetter } from '@/lib/repo';

export const runtime = 'nodejs';

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await ctx.params;
  const letter = await getLetter(Number(id));
  if (!letter) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ letter });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await ctx.params;
  await deleteLetter(Number(id));
  return Response.json({ ok: true });
}
