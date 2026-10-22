import type { Payload } from 'payload'

interface NotificationSettings {
  notificationsEnabled?: boolean | null
  bookingWebhookUrl?: string | null
  enquiryWebhookUrl?: string | null
}

const envWebhook = () => (process.env.N8N_INTERNAL_URL || '').trim()

/**
 * Resolve which webhook a submission should use.
 * Site Settings take priority; N8N_INTERNAL_URL remains the fallback so
 * existing deployments keep working without any admin changes.
 */
export async function resolveBookingNotification(
  payload: Payload,
  type: string,
): Promise<{ enabled: boolean; webhookUrl: string }> {
  let settings: NotificationSettings | null = null
  try {
    settings = (await payload.findGlobal({
      slug: 'site-settings',
      depth: 0,
      overrideAccess: true,
    })) as NotificationSettings | null
  } catch (err) {
    console.error('[Bookings] Could not read notification settings:', err instanceof Error ? err.message : err)
  }

  // Treat an unsaved/legacy setting as enabled to preserve existing behaviour.
  if (settings?.notificationsEnabled === false) {
    return { enabled: false, webhookUrl: '' }
  }

  const isBooking = type === 'Booking'
  const configured = isBooking ? settings?.bookingWebhookUrl : settings?.enquiryWebhookUrl

  return {
    enabled: true,
    webhookUrl: (configured || '').trim() || envWebhook(),
  }
}

export async function notifyBooking(
  payload: Payload,
  booking: { type?: string | null },
): Promise<boolean> {
  const { enabled, webhookUrl } = await resolveBookingNotification(payload, booking.type || 'Inquiry')
  if (!enabled) {
    console.log('[Bookings] Notifications are disabled in Site Settings; skipping')
    return false
  }
  return forwardBookingToN8n(booking, webhookUrl)
}

// Bounded retries reduce transient n8n failures. A durable outbox/queue is still recommended.
export async function forwardBookingToN8n(booking: unknown, webhookUrl?: string): Promise<boolean> {
  const webhook = (webhookUrl || envWebhook()).trim()
  if (!webhook) {
    console.error('[Bookings] No notification webhook configured; booking saved but not notified')
    return false
  }
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await fetch(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.N8N_WEBHOOK_TOKEN ? { 'x-webhook-token': process.env.N8N_WEBHOOK_TOKEN } : {}),
        },
        body: JSON.stringify({ ...(booking as object), source: 'CityTourCabs-API', timestamp: new Date().toISOString() }),
        signal: AbortSignal.timeout(3500),
        cache: 'no-store',
      })
      if (result.ok) return true
      console.error(`[Bookings] n8n returned HTTP ${result.status} (attempt ${attempt}/3)`)
    } catch (err) {
      console.error(`[Bookings] n8n attempt ${attempt}/3 failed:`, err instanceof Error ? err.message : 'unknown error')
    }
    if (attempt < 3) await new Promise(resolve => setTimeout(resolve, attempt * 250))
  }
  return false
}
