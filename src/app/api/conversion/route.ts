import { NextResponse, after } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { allowRequest } from '@/lib/rateLimit.mjs';
import { forwardBookingToN8n, resolveBookingNotification } from '@/lib/bookingNotifications';
import { sanitizeGclid } from '@/shared/lib/gclid';

export const runtime = 'nodejs';

const ALLOWED_CONVERSION_NAMES = new Set([
  'Phone Click',
  'WhatsApp Click',
  'Contact Click',
]);

export async function POST(req: Request) {
  try {
    if (!req.headers.get('content-type')?.toLowerCase().includes('application/json')) {
      return NextResponse.json(
        { success: false, message: 'Expected application/json' },
        { status: 415 }
      );
    }

    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > 4096) {
      return NextResponse.json(
        { success: false, message: 'Payload too large' },
        { status: 413 }
      );
    }

    const raw = await req.text();
    if (raw.length > 4096) {
      return NextResponse.json(
        { success: false, message: 'Payload too large' },
        { status: 413 }
      );
    }

    let body: Record<string, unknown>;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
      }
      body = parsed as Record<string, unknown>;
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
    }

    const ip =
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-real-ip') ||
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unidentified';
    if (!allowRequest(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests' },
        { status: 429 }
      );
    }

    const gclid = sanitizeGclid(body.gclid);
    if (!gclid) {
      return NextResponse.json(
        { success: false, message: 'No GCLID provided' },
        { status: 400 }
      );
    }

    const rawName = typeof body.conversionName === 'string' ? body.conversionName.trim() : '';
    const conversionName = ALLOWED_CONVERSION_NAMES.has(rawName)
      ? rawName
      : 'Contact Click';

    const rawValue = typeof body.value === 'number' ? body.value : Number(body.value);
    const value = Number.isFinite(rawValue) && rawValue > 0 && rawValue <= 1000000 ? rawValue : 1;

    const rawCurrency = typeof body.currency === 'string' ? body.currency.trim().toUpperCase() : '';
    const currency = /^[A-Z]{3}$/.test(rawCurrency) ? rawCurrency : 'INR';

    const rawTime = typeof body.time === 'string' ? body.time.trim() : '';
    const parsedTime = rawTime ? Date.parse(rawTime) : Number.NaN;
    const conversionTime = Number.isFinite(parsedTime)
      ? new Date(parsedTime).toISOString()
      : new Date().toISOString();

    const page = typeof body.page === 'string' ? body.page.trim().slice(0, 200) : '';
    const eventId = typeof body.eventId === 'string' ? body.eventId.trim().slice(0, 80) : '';

    const payload = await getPayload({ config });
    const { enabled, webhookUrl } = await resolveBookingNotification(payload, 'Booking');

    if (enabled && webhookUrl) {
      after(async () => {
        try {
          await forwardBookingToN8n(
            {
              name: 'Direct Click Lead',
              phone: 'Click Event',
              gclid,
              conversionName,
              conversionTime,
              value,
              currency,
              type: 'Booking',
              route: 'Click to Contact',
              ...(page ? { page } : {}),
              ...(eventId ? { contact_event_id: eventId } : {}),
            },
            webhookUrl
          );
        } catch (err) {
          console.error('[Conversion Route forward error]', err);
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Conversion API Error]', err);
    return NextResponse.json(
      { success: false, error: 'Internal Error' },
      { status: 500 }
    );
  }
}
