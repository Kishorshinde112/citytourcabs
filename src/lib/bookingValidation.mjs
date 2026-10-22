/** Shared, dependency-free public booking request validation. */
export class BookingValidationError extends Error {
  constructor(message) { super(message); this.name = 'BookingValidationError'; }
}

function text(value, max, label, fallback = '') {
  const str = String(value ?? fallback).trim();
  if (str.length > max) throw new BookingValidationError(`${label} is too long`);
  return str;
}

export function validateBooking(input, now = new Date()) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new BookingValidationError('Invalid booking payload');
  }
  const name = text(input.name || input.fullName, 100, 'Name');
  const phone = text(input.phone || input.contact, 24, 'Phone');
  const digits = phone.replace(/\D/g, '');
  if (!name || name.length < 2) throw new BookingValidationError('Please enter your name');
  if (!/^\+?[0-9 ()-]+$/.test(phone) || digits.length < 7 || digits.length > 15) {
    throw new BookingValidationError('Please provide a valid phone number');
  }
  const date = text(input.date || input.travelDate || input.pickupDate, 10, 'Travel date');
  // Require real YYYY-MM-DD calendar date. Prevent accidental default bookings for today's date.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(Date.parse(`${date}T00:00:00Z`)) ||
      new Date(`${date}T00:00:00Z`).toISOString().slice(0,10) !== date) {
    throw new BookingValidationError('Please provide a valid travel date (YYYY-MM-DD)');
  }
  // en-CA produces YYYY-MM-DD on supported Node.js ICU versions; construct from parts for portability.
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone:'Asia/Kolkata', year:'numeric',month:'2-digit',day:'2-digit'
  }).formatToParts(now);
  const map = Object.fromEntries(parts.map(x => [x.type,x.value]));
  const today = `${map.year}-${map.month}-${map.day}`;
  if (date < today) throw new BookingValidationError('Travel date cannot be in the past');
  const type = input.type === 'Booking' ? 'Booking' : 'Inquiry';
  const route = text(input.route || input.tourName || input.destination || input.drop || 'Custom Trip', 200, 'Route');
  const passengers = text(input.passengers || input.noOfPassengers || '4', 3, 'Passenger count');
  // The booking modal exposes "8+" as a supported group-size option.
  const passengerCount = passengers.endsWith('+') ? passengers.slice(0, -1) : passengers;
  if (!/^\d{1,3}$/.test(passengerCount) || Number(passengerCount) < 1 || Number(passengerCount) > 50) {
    throw new BookingValidationError('Passenger count must be between 1 and 50');
  }
  return {
    name, phone,
    whatsapp: text(input.whatsapp || input.whatsappNumber || phone, 24, 'WhatsApp'),
    route, vehicle: text(input.vehicle || input.carType || input.carPreference || 'Standard Cab', 90, 'Vehicle'),
    date,
    pickup_address: text(input.pickup_address || input.pickupAddress || input.pickupLocation || input.pickup || 'Customer Location', 500, 'Pickup address'),
    pickup_time: text(input.pickup_time || input.pickupTime, 20, 'Pickup time'),
    passengers, type,
    special_requirements: text(input.special_requirements || input.specialRequirements || input.message || input.otherDetails, 1500, 'Special requirements'),
    referrer: text(input.referrer, 500, 'Referrer'),
    status: 'Pending',
  };
}
