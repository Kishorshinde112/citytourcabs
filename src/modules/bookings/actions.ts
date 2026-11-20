'use server';

import { validateBooking, BookingValidationError } from './validation';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { notifyBooking } from './notify';

export async function submitBookingAction(rawFormData: Record<string, any>) {
  try {
    const validated = validateBooking(rawFormData);
    const payload = await getPayload({ config });

    const created = await payload.create({
      collection: 'bookings',
      data: {
        name: validated.name,
        phone: validated.phone,
        whatsapp: validated.whatsapp,
        route: validated.route,
        vehicle: validated.vehicle,
        date: validated.date,
        pickup_address: validated.pickup_address,
        passengers: validated.passengers,
        type: validated.type as any,
        status: 'Pending',
        special_requirements: validated.notes,
      },
    });

    try {
      await notifyBooking(payload, created);
    } catch (notifyErr) {
      console.warn('[Booking Action] Notification delivery non-blocking error:', notifyErr);
    }

    return {
      success: true,
      booking: {
        id: String(created.id),
        name: created.name,
        phone: created.phone,
        type: created.type,
        status: created.status,
      },
    };
  } catch (err: any) {
    if (err instanceof BookingValidationError) {
      return { success: false, error: err.message };
    }
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Booking could not be processed. Please try again.',
    };
  }
}
