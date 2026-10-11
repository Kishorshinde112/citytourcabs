'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'

export interface SubmitBookingInput {
  id?: string
  name: string
  phone: string
  whatsapp?: string
  route: string
  vehicle?: string
  date: string
  pickup_address?: string
  pickup_time?: string
  passengers?: string
  special_requirements?: string
  type?: string
  referrer?: string
}

export async function submitBooking(formData: SubmitBookingInput) {
  if (!formData.name?.trim() || !formData.phone?.trim()) {
    return { success: false, error: 'Full name and phone number are required.' }
  }

  const travelDate = formData.date || new Date().toISOString().slice(0, 10)
  const vehicle = formData.vehicle || 'Standard Cab / Sedan'
  const route = formData.route || 'Mumbai Tour'

  try {
    const payload = await getPayload({ config })

    // 1. Save directly to DB via Payload (Zero HTTP lag, guaranteed persistence)
    const bookingId = formData.id || ('BK-' + Math.floor(100000 + Math.random() * 900000))
    const booking = await payload.create({
      collection: 'bookings',
      data: {
        id: bookingId,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        whatsapp: formData.whatsapp?.trim() || formData.phone.trim(),
        route,
        vehicle,
        date: travelDate,
        pickup_address: formData.pickup_address?.trim() || 'Customer Location',
        pickup_time: formData.pickup_time?.trim() || '',
        passengers: formData.passengers || '4',
        status: 'Pending',
        type: formData.type || 'Inquiry',
        special_requirements: formData.special_requirements?.trim() || '',
        referrer: formData.referrer || '',
      },
    })

    // 2. Secretly trigger n8n for instant WhatsApp confirmation (Dokploy internal network)
    const n8nUrl = process.env.N8N_INTERNAL_URL || 'http://n8n-service:5678/webhook/leads'
    fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: booking.id,
        name: booking.name,
        phone: booking.phone,
        whatsapp: booking.whatsapp,
        route: booking.route,
        vehicle: booking.vehicle,
        date: booking.date,
        pickup_address: booking.pickup_address,
        pickup_time: booking.pickup_time,
        passengers: booking.passengers,
        special_requirements: booking.special_requirements,
        timestamp: new Date().toISOString(),
        source: 'CityTourCabs-NextJS',
      }),
    }).catch((err) => {
      console.warn('[n8n Webhook Warning]: Failed to dispatch to n8n (booking is safely saved):', err.message)
    })

    return {
      success: true,
      bookingId: booking.id,
      message: 'Booking enquiry submitted successfully! Our team will contact you shortly.',
    }
  } catch (error: any) {
    console.error('[SubmitBooking Error]:', error)
    return { success: false, error: error.message || 'Failed to submit booking.' }
  }
}
