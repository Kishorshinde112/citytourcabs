import { NextResponse } from 'next/server';
import { buildAgentCard } from '@/lib/agentCard';

export const revalidate = 3600;

export async function GET() {
  return NextResponse.json(buildAgentCard(), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
