import { auth } from '@/lib/auth/server';

export async function GET() {
  const { data: session } = await auth.getSession();
  
  if (!session) {
    return Response.json({});
  }

  return Response.json(session);
}
