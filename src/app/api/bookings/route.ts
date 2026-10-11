import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
    const limitParam = url.searchParams.get('limit')
    const isAll = limitParam === 'all' || limitParam === '0'
    const limit = isAll ? 10000 : Math.max(1, parseInt(limitParam || '25'))
    const search = (url.searchParams.get('search') || '').trim()
    const status = (url.searchParams.get('status') || '').trim()

    const payload = await getPayload({ config })

    let where: any = {}
    if (status && status !== 'All') {
      where.status = { equals: status }
    }

    if (search) {
      where.or = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { route: { contains: search } },
        { vehicle: { contains: search } },
      ]
    }

    const res = await payload.find({
      collection: 'bookings',
      where,
      limit,
      page,
      sort: '-createdAt',
    })

    return NextResponse.json({
      success: true,
      bookings: res.docs,
      docs: res.docs,
      total: res.totalDocs,
      totalDocs: res.totalDocs,
      page: res.page,
      limit: res.limit,
      totalPages: res.totalPages,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const name = String(body.name || body.fullName || 'Customer').trim()
    const phone = String(body.phone || body.contact || '').trim()
    const whatsapp = String(body.whatsapp || body.whatsappNumber || phone).trim()
    const route = String(body.route || body.tourName || body.destination || body.drop || 'Custom Trip').trim()
    const vehicle = String(body.vehicle || body.carType || body.carPreference || 'Standard Cab').trim()
    const date = String(body.date || body.travelDate || body.pickupDate || new Date().toISOString().slice(0, 10)).trim()
    const pickup_address = String(body.pickup_address || body.pickupAddress || body.pickupLocation || body.pickup || '').trim()
    const pickup_time = String(body.pickup_time || body.pickupTime || '').trim()
    const passengers = String(body.passengers || body.noOfPassengers || '4').trim()
    const special_requirements = String(body.special_requirements || body.specialRequirements || body.message || body.otherDetails || '').trim()
    const type = String(body.type || 'Inquiry').trim()
    const referrer = String(body.referrer || '').trim()

    const payload = await getPayload({ config })
    const bookingId = body.id || ('BK-' + Math.floor(100000 + Math.random() * 900000))
    const booking = await payload.create({
      collection: 'bookings',
      data: {
        id: bookingId,
        name,
        phone,
        whatsapp,
        route,
        vehicle,
        date,
        pickup_address: pickup_address || 'Customer Location',
        pickup_time,
        passengers,
        special_requirements,
        status: 'Pending',
        type,
        referrer,
      },
    })

    // Background internal dispatch to n8n
    const n8nUrl = process.env.N8N_INTERNAL_URL || 'http://n8n-service:5678/webhook/leads'
    fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...booking,
        timestamp: new Date().toISOString(),
        source: 'CityTourCabs-API',
      }),
    }).catch((err) => {
      console.warn('[n8n Webhook Warning]:', err.message)
    })

    return NextResponse.json({
      success: true,
      booking,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
