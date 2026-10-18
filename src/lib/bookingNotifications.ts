// Bounded retries reduce transient n8n failures. A durable outbox/queue is still recommended.
export async function forwardBookingToN8n(booking: unknown): Promise<boolean> {
  const webhook = process.env.N8N_INTERNAL_URL;
  if (!webhook) {
    console.error('[Bookings] N8N_INTERNAL_URL is not configured; booking saved but not notified');
    return false;
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
      });
      if (result.ok) return true;
      console.error(`[Bookings] n8n returned HTTP ${result.status} (attempt ${attempt}/3)`);
    } catch (err) {
      console.error(`[Bookings] n8n attempt ${attempt}/3 failed:`, err instanceof Error ? err.message : 'unknown error');
    }
    if (attempt < 3) await new Promise(resolve => setTimeout(resolve, attempt * 250));
  }
  return false;
}
