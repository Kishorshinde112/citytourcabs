// Best-effort single-instance rate limit. For production, also configure Cloudflare/Traefik limits.
const buckets = new Map();
export function allowRequest(identity, { limit = 8, windowMs = 15 * 60_000, now = Date.now() } = {}) {
  if (!identity) return false;
  if (buckets.size > 10_000) {
    for (const [key, value] of buckets) if (value.resetAt <= now) buckets.delete(key);
  }
  const current = buckets.get(identity);
  if (!current || current.resetAt <= now) {
    buckets.set(identity, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}
