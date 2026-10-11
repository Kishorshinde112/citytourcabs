import { create } from 'zustand';

const useBookingsStore = create((set) => ({
  bookings: [],
  loading: false,

  fetchBookings: async () => {
    set({ loading: true });
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data.bookings) ? data.bookings : (Array.isArray(data.docs) ? data.docs : []);
        set({ bookings: list, loading: false });
        return;
      }
    } catch (_) {}
    set({ loading: false });
  },

  addBooking: async (bookingData) => {
    const payload = {
      name: bookingData.name || bookingData.fullName || 'Customer',
      phone: bookingData.phone || bookingData.contact || '',
      whatsapp: bookingData.whatsapp || bookingData.whatsappNumber || bookingData.phone || '',
      route: bookingData.route || bookingData.tourName || bookingData.destination || 'Custom Trip',
      vehicle: bookingData.vehicle || bookingData.carType || 'Standard Cab',
      date: bookingData.date || bookingData.travelDate || new Date().toISOString().slice(0, 10),
      pickup_address: bookingData.pickup_address || bookingData.pickupAddress || '',
      pickup_time: bookingData.pickup_time || bookingData.pickupTime || '',
      passengers: bookingData.passengers || bookingData.noOfPassengers || '4',
      status: 'Pending',
      type: bookingData.type || 'Inquiry',
      special_requirements: bookingData.special_requirements || bookingData.specialRequirements || bookingData.message || '',
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Failed to sync booking to server:', err);
    }
  },
}));

export default useBookingsStore;
