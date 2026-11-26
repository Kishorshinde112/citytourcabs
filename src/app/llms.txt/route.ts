import { NextResponse } from 'next/server';
import { buildLlmsTxt } from '@/lib/agentCard';

export const revalidate = 3600;

export async function GET() {
  const body = await buildLlmsTxt();

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
