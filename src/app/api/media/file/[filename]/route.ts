import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params
  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 })
  }
  // Redirect to direct static media URL
  return NextResponse.redirect(new URL(`/media/${filename}`, req.url), 307)
}
