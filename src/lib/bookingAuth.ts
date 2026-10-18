import type { Payload } from 'payload';

export async function isAuthorizedBookingStaff(payload: Payload, headers: Headers): Promise<boolean> {
  const { user } = await payload.auth({ headers });
  return !!user && user.collection === 'users' && (user.role === 'admin' || user.role === 'operator');
}
