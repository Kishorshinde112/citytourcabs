'use client';

import { createContext, useContext } from 'react';

/**
 * Shared booking UI contract for the marketing site.
 * The shell owns the modals; pages only ask to open them.
 */
const noop = (_initialData = {}) => {};

export const BookingContext = createContext({
  openBooking: noop,
  openEnquiry: noop,
  openPrivacy: () => {},
});

export function useBooking() {
  return useContext(BookingContext);
}
