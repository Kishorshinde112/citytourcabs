import React, { useState } from 'react';
import useBookingsStore from '../store/bookingsStore';

export default function BookingForm() {
  const [status, setStatus] = useState('');
  const { addBooking } = useBookingsStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    
    const name = e.target.name.value;
    const phone = e.target.phone.value;
    const tour = e.target.tour.value;

    const bookingPayload = {
      name,
      phone,
      whatsapp: phone,
      route: tour,
      vehicle: 'Standard Cab',
      type: 'Booking',
      date: new Date().toISOString().slice(0, 10),
    };

    try {
      // 1. Save directly into local database & live admin panel
      await addBooking(bookingPayload);

      // 2. Also forward to webhook if available
      try {
        fetch('https://n8n.kishorlab.dev/webhook/lead-ingestor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingPayload)
        }).catch(() => {});
      } catch (err) {}

      setStatus('Booking Confirmed! We will call you shortly.');
    } catch (error) {
      setStatus('Error, please try again.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">Book Your Cab</h3>
      {status ? <p className="text-blue-600 font-bold mb-4">{status}</p> : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" type="text" placeholder="Full Name" required className="w-full p-4 border rounded-xl" />
          <input name="phone" type="tel" placeholder="Phone Number" required className="w-full p-4 border rounded-xl" />
          <select name="tour" className="w-full p-4 border rounded-xl">
            <option>Select Tour</option>
            <option>Mumbai Darshan</option>
            <option>Airport Transfer</option>
          </select>
          <button type="submit" className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition">Confirm Booking</button>
        </form>
      )}
    </div>
  );
}
