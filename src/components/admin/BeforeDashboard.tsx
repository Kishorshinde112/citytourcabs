import React from 'react'

export const BeforeDashboard: React.FC = () => {
  return (
    <div style={{ marginBottom: '2rem', padding: '2rem', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
      <h2 style={{ marginTop: 0, color: '#0f172a' }}>👋 Welcome to the City Tour Cabs Admin Panel</h2>
      <p style={{ color: '#334155', fontSize: '1.1rem', maxWidth: '800px' }}>
        This is your central hub for managing website content, monitoring incoming leads, and updating tour pricing. 
        Everything you change here will automatically update the live website without needing any code changes.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
        
        <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1A96EB', fontSize: '1.2rem' }}>📞 Manage Inquiries</h3>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#64748b' }}>Check your latest customer bookings and WhatsApp leads.</p>
          <a href="/admin/collections/bookings" style={{ display: 'inline-block', padding: '8px 16px', background: '#1A96EB', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>View Leads</a>
        </div>

        <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#ea580c', fontSize: '1.2rem' }}>🗺️ Update Tours</h3>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#64748b' }}>Modify prices, upload new hero images, and change itineraries.</p>
          <a href="/admin/collections/tours" style={{ display: 'inline-block', padding: '8px 16px', background: '#ea580c', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>Manage Tours</a>
        </div>

        <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#16a34a', fontSize: '1.2rem' }}>⚙️ Global Settings</h3>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#64748b' }}>Update phone numbers, email, footer, and the promo popup.</p>
          <a href="/admin/globals/site-settings" style={{ display: 'inline-block', padding: '8px 16px', background: '#16a34a', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>Edit Settings</a>
        </div>

      </div>
    </div>
  )
}
