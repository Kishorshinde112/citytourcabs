import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { gclid, conversionName, value, currency, time } = body || {};

    if (!gclid) {
      return NextResponse.json({ success: false, message: 'No GCLID provided' }, { status: 400 });
    }

    // Forward to internal n8n CityTourCabs webhook or record
    const n8nUrl = 'http://n8n-06278a5e-cc2e-4953-9de8-9518c3452bb6:5678/webhook/citytourcabs-lead';
    
    // We send to n8n as a conversion event
    fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Direct Click Lead',
        phone: 'Click Event',
        gclid,
        conversionName: conversionName || 'Contact Click',
        conversionTime: time || new Date().toISOString(),
        value: value || 1,
        currency: currency || 'INR',
        type: 'Booking',
        route: 'Click to Contact',
      }),
    }).catch(err => console.error('[Conversion Route forward error]', err));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Conversion API Error]', err);
    return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
  }
}
