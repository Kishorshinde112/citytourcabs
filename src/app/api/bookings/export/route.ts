import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const bookings = await payload.find({
      collection: 'bookings',
      limit: 10000,
      pagination: false,
      sort: '-createdAt',
    })

    const headers = [
      'Booking ID',
      'Status',
      'Travel Date',
      'Created At',
      'Customer Name',
      'Phone',
      'WhatsApp',
      'Route / Tour',
      'Vehicle',
      'Passengers',
      'Pickup Time',
      'Pickup Address',
      'Special Requirements',
    ]

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""'
      const str = String(val).replace(/"/g, '""')
      return `"${str}"`
    }

    let csvContent = headers.join(',') + '\n'
    for (const r of bookings.docs) {
      csvContent +=
        [
          escapeCsv(r.id),
          escapeCsv(r.status || 'Pending'),
          escapeCsv(r.date),
          escapeCsv(r.createdAt),
          escapeCsv(r.name),
          escapeCsv(r.phone),
          escapeCsv(r.whatsapp),
          escapeCsv(r.route),
          escapeCsv(r.vehicle),
          escapeCsv(r.passengers),
          escapeCsv(r.pickup_time),
          escapeCsv(r.pickup_address),
          escapeCsv(r.special_requirements),
        ].join(',') + '\n'
    }

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="citytourcabs_leads.csv"',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
