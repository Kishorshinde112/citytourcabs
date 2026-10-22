/** Small phone helpers shared by confirmation pages and contact CTAs. */

export function displayIndianPhone(value: string | null | undefined): string {
  const raw = String(value ?? '').trim()
  if (!raw) return ''
  return raw.startsWith('+') ? raw : `+91 ${raw}`
}

export function telHref(value: string | null | undefined): string {
  const raw = String(value ?? '').trim()
  if (raw.startsWith('+')) return `tel:${raw.replace(/[^0-9+]/g, '')}`
  return `tel:+91${raw.replace(/\D/g, '')}`
}

/** Returns a wa.me-compatible number with the 91 country code. */
export function whatsappNumber(value: string | null | undefined): string {
  let digits = String(value ?? '').replace(/\D/g, '')
  if (digits.length === 10) digits = `91${digits}`
  if (digits.length === 11 && digits.startsWith('0')) digits = `91${digits.slice(1)}`
  return digits
}
