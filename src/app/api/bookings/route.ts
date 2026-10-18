import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import { randomUUID } from 'node:crypto';
import config from '@/payload.config';
import { isAuthorizedBookingStaff } from '@/lib/bookingAuth';
import { validateBooking, BookingValidationError } from '@/lib/bookingValidation.mjs';
import { allowRequest } from '@/lib/rateLimit.mjs';
import { forwardBookingToN8n } from '@/lib/bookingNotifications';

export const runtime = 'nodejs';
const failure = (status: number, message: string) => NextResponse.json({ success:false, error:message }, {status});

export async function GET(req: Request) {
  try {
    const payload = await getPayload({ config });
    if (!(await isAuthorizedBookingStaff(payload, req.headers))) return failure(401,'Unauthorized');
    const params = new URL(req.url).searchParams;
    const page = Math.min(10000, Math.max(1, Number.parseInt(params.get('page') || '1', 10) || 1));
    const requestedLimit = params.get('limit');
    const limit = Math.min(100, Math.max(1, Number.parseInt(requestedLimit || '25', 10) || 25));
    const search = (params.get('search') || '').trim().slice(0, 100);
    const status = (params.get('status') || '').trim();
    const where: any = {};
    if (['Pending','Confirmed','Completed','Cancelled'].includes(status)) where.status = {equals:status};
    if (search) where.or = [
      {name:{contains:search}}, {phone:{contains:search}},
      {route:{contains:search}}, {vehicle:{contains:search}},
    ];
    const result = await payload.find({collection:'bookings',where,limit,page,sort:'-createdAt',overrideAccess:true});
    return NextResponse.json({
      success:true, bookings:result.docs, docs:result.docs,
      total:result.totalDocs, totalDocs:result.totalDocs,
      page:result.page, limit:result.limit, totalPages:result.totalPages,
    });
  } catch (err) {
    console.error('[Bookings GET]',err);
    return failure(500,'Failed to load bookings');
  }
}

export async function POST(req: Request) {
  try {
    if (!req.headers.get('content-type')?.toLowerCase().includes('application/json')) {
      return failure(415,'Expected application/json');
    }
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > 8192) return failure(413,'Booking request is too large');
    const raw = await req.text();
    if (raw.length > 8192) return failure(413,'Booking request is too large');
    let input: unknown;
    try { input = JSON.parse(raw); }
    catch { return failure(400,'Invalid JSON'); }

    // Trust a single ingress proxy only. Protect this route with an edge rate limit as well.
    const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unidentified';
    if (!allowRequest(ip)) return failure(429,'Too many requests. Please try again later');
    const data = validateBooking(input);
    const payload = await getPayload({config});
    const bookingId = `BK-${randomUUID()}`;
    // Public Payload CMS create is disabled; only the internal server API can bypass it.
    const booking = await payload.create({collection:'bookings',data:{...data,id:bookingId,status:'Pending' as const},overrideAccess:true});
    const notified = await forwardBookingToN8n(booking);
    return NextResponse.json({success:true,booking, notificationDelivered:notified},{status:201});
  } catch (err) {
    if (err instanceof BookingValidationError) return failure(400,err.message);
    console.error('[Bookings POST]',err);
    return failure(500,'Unable to save booking. Please try again');
  }
}
