import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { isAuthorizedBookingStaff } from '@/lib/bookingAuth';

function escapeCsv(value: unknown) {
  const str = String(value ?? '');
  // Excel / Sheets formula injection protection, even when a formula starts after whitespace.
  const safe = /^[\s]*[=+@\-\t\r]/.test(str) ? `'${str}` : str;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  try {
    const payload = await getPayload({config});
    if (!(await isAuthorizedBookingStaff(payload,req.headers))) {
      return NextResponse.json({error:'Unauthorized'},{status:401});
    }
    const bookings = await payload.find({collection:'bookings',limit:10000,pagination:false,sort:'-createdAt',overrideAccess:true});
    const columns = [
      ['Booking ID','id'],['Status','status'],['Travel Date','date'],['Created At','createdAt'],
      ['Customer Name','name'],['Phone','phone'],['WhatsApp','whatsapp'],['Route / Tour','route'],
      ['Vehicle','vehicle'],['Passengers','passengers'],['Pickup Time','pickup_time'],
      ['Pickup Address','pickup_address'],['Special Requirements','special_requirements'],
    ] as const;
    const csv = [columns.map(([header])=>escapeCsv(header)).join(','),
      ...bookings.docs.map((row: any)=>columns.map(([,key])=>escapeCsv(row[key])).join(','))].join('\r\n')+'\r\n';
    return new NextResponse(csv,{headers:{
      'Content-Type':'text/csv; charset=utf-8',
      'Content-Disposition':'attachment; filename="citytourcabs_leads.csv"',
      'Cache-Control':'private, no-store',
      'X-Content-Type-Options':'nosniff',
    }});
  } catch (err) {
    console.error('[Bookings Export]',err);
    return NextResponse.json({error:'Could not export bookings'},{status:500});
  }
}
