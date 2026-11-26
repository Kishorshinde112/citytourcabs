export const GCLID_STORAGE_KEY = 'ctc_gclid';
const MAX_GCLID_LENGTH = 256;
const SAFE_GCLID_PATTERN = /^[A-Za-z0-9_.=-]+$/;

/**
 * Validate and trim an incoming Google Click ID so arbitrary strings cannot
 * reach storage or outbound webhooks.
 * @param {unknown} value
 * @returns {string}
 */
export function sanitizeGclid(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_GCLID_LENGTH) return '';
  return SAFE_GCLID_PATTERN.test(trimmed) ? trimmed : '';
}
