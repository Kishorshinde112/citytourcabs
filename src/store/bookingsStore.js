import { create } from 'zustand';

const useBookingsStore = create((set, get) => ({
  bookings: [],
  loading: false,
  page: 1,
  limit: 25,
  total: 0,
  totalPages: 1,
  search: '',
  statusFilter: 'All',
  counts: { all: 0, pending: 0, confirmed: 0, completed: 0 },

  fetchBookings: async (overrides = {}) => {
    set({ loading: true });
    const { page, limit, search, statusFilter } = {
      page: overrides.page ?? get().page,
      limit: overrides.limit ?? get().limit,
      search: overrides.search !== undefined ? overrides.search : get().search,
      statusFilter: overrides.statusFilter !== undefined ? overrides.statusFilter : get().statusFilter,
    };

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search: search.trim(),
        status: statusFilter,
      });

      const res = await fetch(`/api/bookings?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.bookings)) {
          set({
            bookings: data.bookings,
            total: data.total,
            totalPages: data.totalPages || 1,
            page: data.page || page,
            limit: data.limit || limit,
            counts: data.counts || get().counts,
            search,
            statusFilter,
            loading: false,
          });
          return;
        }
      }
    } catch (err) {
      console.warn('Error fetching bookings from server:', err);
    }
    set({ loading: false });
  },

  setPage: (newPage) => {
    set({ page: newPage });
    get().fetchBookings({ page: newPage });
  },

  setSearch: (newSearch) => {
    set({ search: newSearch, page: 1 });
    get().fetchBookings({ search: newSearch, page: 1 });
  },

  setStatusFilter: (newStatus) => {
    set({ statusFilter: newStatus, page: 1 });
    get().fetchBookings({ statusFilter: newStatus, page: 1 });
  },

  setLimit: (newLimit) => {
    set({ limit: newLimit, page: 1 });
    get().fetchBookings({ limit: newLimit, page: 1 });
  },

  addBooking: async (bookingData) => {
    const tempId = 'BK-' + Math.floor(100000 + Math.random() * 900000);
    const newBooking = {
      id: tempId,
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
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    // Optimistic UI update if on page 1
    if (get().page === 1) {
      set((state) => ({ bookings: [newBooking, ...state.bookings] }));
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.booking) {
          get().fetchBookings();
        }
      }
    } catch (err) {
      console.error('Failed to sync booking to server:', err);
    }
  },

  updateBookingStatus: async (id, status) => {
    set((state) => ({
      bookings: state.bookings.map(b => b.id === id ? { ...b, status } : b)
    }));

    try {
      await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      get().fetchBookings();
    } catch (err) {
      console.error('Failed to update booking status on server:', err);
    }
  },

  deleteBooking: async (id) => {
    set((state) => ({
      bookings: state.bookings.filter(b => b.id !== id)
    }));

    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });
      get().fetchBookings();
    } catch (err) {
      console.error('Failed to delete booking on server:', err);
    }
  }
}));

if (typeof window !== 'undefined') {
  useBookingsStore.getState().fetchBookings();
}

export default useBookingsStore;
