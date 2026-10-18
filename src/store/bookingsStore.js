import { create } from 'zustand';

const useBookingsStore = create((set) => ({
  bookings: [], loading: false,
  fetchBookings: async () => {
    set({loading:true});
    try {
      const res = await fetch('/api/bookings',{cache:'no-store'});
      if (!res.ok) throw new Error('Could not retrieve bookings');
      const data = await res.json();
      const list = Array.isArray(data.bookings) ? data.bookings : (Array.isArray(data.docs) ? data.docs : []);
      set({bookings:list});
    } catch (err) { console.error(err); }
    finally {set({loading:false});}
  },
  addBooking: async (bookingData) => {
    const payload = {
      name: bookingData.name || bookingData.fullName,
      phone: bookingData.phone || bookingData.contact,
      whatsapp: bookingData.whatsapp || bookingData.whatsappNumber || bookingData.phone,
      route: bookingData.route || bookingData.tourName || bookingData.destination,
      vehicle: bookingData.vehicle || bookingData.carType || 'Standard Cab',
      date: bookingData.date || bookingData.travelDate,
      pickup_address: bookingData.pickup_address || bookingData.pickupAddress || '',
      pickup_time: bookingData.pickup_time || bookingData.pickupTime || '',
      passengers: bookingData.passengers || bookingData.noOfPassengers || '4',
      type: bookingData.type || 'Inquiry',
      special_requirements: bookingData.special_requirements || bookingData.specialRequirements || bookingData.message || '',
    };
    const res = await fetch('/api/bookings',{
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),
    });
    const data = await res.json().catch(()=>({}));
    if (!res.ok || !data.success || !data.booking?.id) {
      throw new Error(data.error || 'Your request could not be saved. Please try again.');
    }
    return data;
  },
}));
export default useBookingsStore;
