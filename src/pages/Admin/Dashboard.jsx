import React, { useEffect, useState } from 'react';
import { 
  Users, Car, CalendarCheck, TrendingUp, RefreshCw, MessageCircle, 
  Phone, Trash2, Calendar, MapPin, Download, Search, ChevronLeft, 
  ChevronRight, Filter, Clock, Navigation
} from 'lucide-react';
import useBookingsStore from '../../store/bookingsStore';

export default function Dashboard() {
  const { 
    bookings, loading, page, limit, total, totalPages, search, statusFilter, counts,
    fetchBookings, setPage, setSearch, setStatusFilter, setLimit, updateBookingStatus, deleteBooking 
  } = useBookingsStore();

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleExportCsv = () => {
    window.open('/api/bookings/export', '_blank');
  };

  const stats = [
    { label: 'Total Inquiries', value: (counts.all || total).toLocaleString(), icon: Users, color: 'bg-indigo-600', sub: 'Historical & live leads' },
    { label: 'Pending Follow-up', value: (counts.pending || 0).toLocaleString(), icon: CalendarCheck, color: 'bg-amber-500', sub: 'Needs immediate call' },
    { label: 'Confirmed Trips', value: (counts.confirmed || 0).toLocaleString(), icon: Car, color: 'bg-emerald-600', sub: 'Driver allocated' },
    { label: 'Completed Tours', value: (counts.completed || 0).toLocaleString(), icon: TrendingUp, color: 'bg-blue-600', sub: 'Delivered journeys' },
  ];

  const statusTabs = [
    { label: 'All Leads', value: 'All', count: counts.all },
    { label: 'Pending', value: 'Pending', count: counts.pending },
    { label: 'Confirmed', value: 'Confirmed', count: counts.confirmed },
    { label: 'Completed', value: 'Completed', count: counts.completed },
    { label: 'Cancelled', value: 'Cancelled', count: counts.all - counts.pending - counts.confirmed - counts.completed },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black font-display text-slate-900">Bookings & Customer Leads</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
              LIVE
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Real-time inquiries, tour requests, and customer records from all booking widgets.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            title="Download all customer records in Excel / CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to Excel (CSV)</span>
          </button>

          <button
            onClick={() => fetchBookings()}
            disabled={loading}
            className="px-4 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 truncate">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 font-display">{stat.value}</p>
                <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls Bar: Search & Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {statusTabs.map((tab) => {
              const active = statusFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      active ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search name, phone, route..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>

        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap justify-between items-center bg-slate-50/70 gap-2">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-bold text-slate-900">
              Showing {total > 0 ? (page - 1) * limit + 1 : 0} – {Math.min(page * limit, total)} of {total.toLocaleString()} Leads
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Per page:</span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="border border-slate-200 rounded-lg px-2 py-1 bg-white text-xs font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="p-16 text-center text-slate-500 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Users className="w-6 h-6" />
            </div>
            <div className="font-bold text-slate-700 text-sm">No inquiries match your filter</div>
            <p className="text-xs text-slate-400">Try clearing the search query or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 text-slate-600 text-xs uppercase font-extrabold tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-4">Lead ID & Received</th>
                  <th className="py-3.5 px-4">Customer Contact</th>
                  <th className="py-3.5 px-4">Destination & Cab</th>
                  <th className="py-3.5 px-4">Trip Details</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {bookings.map((booking) => {
                  const phoneNum = String(booking.phone || '').replace(/\D/g, '').slice(-10);
                  const waNum = String(booking.whatsapp || phoneNum).replace(/\D/g, '').slice(-10);
                  const statusVal = booking.status || 'Pending';

                  return (
                    <tr key={booking.id} className="hover:bg-slate-50/90 transition">
                      
                      {/* Lead ID & Date */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900 text-xs">{booking.id}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                            booking.type === 'Booking' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {booking.type || 'Inquiry'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{booking.created_at || booking.createdAt || 'N/A'}</span>
                        </div>
                      </td>

                      {/* Customer Details & Instant Contact Buttons */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-bold text-slate-900">{booking.name || 'Valued Guest'}</div>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {phoneNum && (
                            <a
                              href={`tel:+91${phoneNum}`}
                              className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1 transition"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{phoneNum}</span>
                            </a>
                          )}

                          {waNum && (
                            <a
                              href={`https://wa.me/91${waNum}?text=Hello%20${encodeURIComponent(booking.name || 'Sir/Madam')},%20Greetings%20from%20City%20Tour%20Cabs!%20Regarding%20your%20inquiry%20for%20${encodeURIComponent(booking.route || 'Tour')}:`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 transition shadow-xs"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Destination & Vehicle */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>{booking.route || 'Sightseeing Tour'}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
                          <span>🚘 {booking.vehicle || 'Standard Vehicle'}</span>
                          {booking.passengers && <span>• 👥 {booking.passengers} pax</span>}
                        </div>
                      </td>

                      {/* Trip Details (Date / Pickup) */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-1 font-semibold text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>{booking.date || 'Flexible'}</span>
                        </div>
                        {booking.pickup_address && (
                          <div className="text-[11px] text-slate-500 mt-1 truncate max-w-[200px]" title={booking.pickup_address}>
                            📍 {booking.pickup_address}
                          </div>
                        )}
                        {booking.special_requirements && (
                          <div className="text-[10px] text-amber-700 mt-0.5 truncate max-w-[200px]" title={booking.special_requirements}>
                            📝 {booking.special_requirements}
                          </div>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4 text-center align-top">
                        <select
                          value={statusVal}
                          onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                          className={`text-xs font-extrabold rounded-xl px-2.5 py-1.5 outline-none border cursor-pointer transition ${
                            statusVal === 'Confirmed'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : statusVal === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : statusVal === 'Cancelled'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <option value="Pending">🟡 Pending</option>
                          <option value="Confirmed">🔵 Confirmed</option>
                          <option value="Completed">🟢 Completed</option>
                          <option value="Cancelled">🔴 Cancelled</option>
                        </select>
                      </td>

                      {/* Delete */}
                      <td className="py-4 px-4 text-right align-top">
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete lead ${booking.id}?`)) {
                              deleteBooking(booking.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition cursor-pointer"
                          title="Delete lead record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs text-slate-500">
              Page <strong className="text-slate-800">{page}</strong> of <strong className="text-slate-800">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
