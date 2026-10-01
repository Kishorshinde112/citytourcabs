import express from 'express';
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Ensure data directory exists
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'citytourcabs.db');
const db = new DatabaseSync(DB_PATH);

// Initialize DB Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    route TEXT NOT NULL,
    vehicle TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT DEFAULT 'Pending'
  );

  CREATE TABLE IF NOT EXISTS tours (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    duration TEXT,
    startingPrice TEXT,
    image TEXT,
    description TEXT,
    popular INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY,
    title TEXT,
    subtitle TEXT,
    banner TEXT,
    content_1 TEXT,
    content_2 TEXT,
    content_3 TEXT,
    content_4 TEXT,
    content_5 TEXT,
    content_6 TEXT,
    content_7 TEXT,
    content_8 TEXT,
    content_9 TEXT,
    content_10 TEXT,
    created TEXT,
    updated TEXT
  );

  CREATE TABLE IF NOT EXISTS tour_packages (
    id TEXT PRIMARY KEY,
    title TEXT,
    subtitle TEXT,
    summary TEXT,
    banner TEXT,
    car_types TEXT,
    booking_packages TEXT,
    rate_table TEXT,
    content TEXT,
    created TEXT,
    updated TEXT
  );

  CREATE TABLE IF NOT EXISTS pb_settings (
    id TEXT PRIMARY KEY,
    label TEXT,
    value TEXT,
    context TEXT,
    created TEXT,
    updated TEXT
  );
`);

// Auto-migrate schema if needed
const columnsToAdd = [
  'created_at DATETIME',
  'createdAt DATETIME',
  'whatsapp TEXT',
  'pickup_address TEXT',
  'pickup_time TEXT',
  'passengers TEXT',
  'special_requirements TEXT',
  'type TEXT DEFAULT "Inquiry"',
  'referrer TEXT'
];
for (const col of columnsToAdd) {
  try {
    db.exec(`ALTER TABLE bookings ADD COLUMN ${col};`);
  } catch (e) {
    // Column already exists
  }
}

// Seed default settings if empty
const checkSettings = db.prepare('SELECT COUNT(*) as count FROM settings').get();
if (checkSettings.count === 0) {
  const insertStmt = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
  insertStmt.run('phone', '7021001921');
  insertStmt.run('helpPhone', '9967672660');
  insertStmt.run('email', 'citytourcabs8@gmail.com');
}

// Seed initial test lead if bookings table is empty
const checkBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get();
if (checkBookings.count === 0) {
  const insertBooking = db.prepare(`
    INSERT INTO bookings (id, name, phone, route, vehicle, date, status, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertBooking.run(
    'BK-838080',
    'Test Booking (Live Lead)',
    '8380803217',
    'Mumbai ➔ Pune (Expressway)',
    'Swift Dzire (Sedan)',
    new Date().toISOString().slice(0, 10),
    'Confirmed',
    new Date().toISOString().slice(0, 19).replace('T', ' ')
  );
}

// REST API Endpoints

// 1. Settings Endpoints
app.get('/api/settings', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM settings').all();
    const settings = {};
    for (const r of rows) {
      settings[r.key] = r.value;
    }
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/settings', (req, res) => {
  try {
    const { phone, helpPhone, email } = req.body;
    const updateStmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    for (const [key, value] of Object.entries(req.body)) {
      if (value !== undefined && value !== null) {
        const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value).trim();
        updateStmt.run(key, valStr);
      }
    }

    const rows = db.prepare('SELECT key, value FROM settings').all();
    const settings = {};
    for (const r of rows) {
      settings[r.key] = r.value;
    }
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Bookings Endpoints
app.get('/api/bookings', (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limitParam = req.query.limit;
    const isAll = limitParam === 'all' || limitParam === '0';
    const limit = isAll ? 100000 : Math.max(1, parseInt(limitParam) || 25);
    const offset = (page - 1) * limit;
    const search = (req.query.search || '').trim();
    const status = (req.query.status || '').trim();

    let whereClauses = [];
    let params = [];

    if (status && status !== 'All') {
      whereClauses.push('status = ?');
      params.push(status);
    }

    if (search) {
      whereClauses.push('(name LIKE ? OR phone LIKE ? OR whatsapp LIKE ? OR route LIKE ? OR vehicle LIKE ? OR pickup_address LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s, s, s, s, s);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Total filtered count
    const totalRow = db.prepare(`SELECT COUNT(*) as count FROM bookings ${whereSql}`).get(...params);
    const total = totalRow ? totalRow.count : 0;

    // Filtered page query
    const rows = db.prepare(`
      SELECT * FROM bookings
      ${whereSql}
      ORDER BY 
        CASE WHEN created_at IS NOT NULL AND created_at != '' THEN created_at ELSE date END DESC,
        rowid DESC
      LIMIT ? OFFSET ?
    `).all(...params, limit, offset);

    // Global stats summary
    const countAll = db.prepare('SELECT COUNT(*) as c FROM bookings').get().c;
    const countPending = db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'Pending'").get().c;
    const countConfirmed = db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'Confirmed'").get().c;
    const countCompleted = db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'Completed'").get().c;

    res.json({
      success: true,
      bookings: rows,
      total,
      page,
      limit: isAll ? total : limit,
      totalPages: Math.ceil(total / (isAll ? total || 1 : limit)),
      counts: {
        all: countAll,
        pending: countPending,
        confirmed: countConfirmed,
        completed: countCompleted
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CSV Export Endpoint
app.get('/api/bookings/export', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT * FROM bookings
      ORDER BY 
        CASE WHEN created_at IS NOT NULL AND created_at != '' THEN created_at ELSE date END DESC,
        rowid DESC
    `).all();

    const headers = [
      'Booking ID', 'Type', 'Status', 'Date', 'Created At', 'Customer Name',
      'Phone', 'WhatsApp', 'Route / Destination', 'Vehicle',
      'Passengers', 'Pickup Time', 'Pickup Address', 'Special Requirements'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    let csvContent = headers.join(',') + '\n';
    for (const r of rows) {
      csvContent += [
        escapeCsv(r.id),
        escapeCsv(r.type || 'Inquiry'),
        escapeCsv(r.status || 'Pending'),
        escapeCsv(r.date),
        escapeCsv(r.created_at || r.createdAt),
        escapeCsv(r.name),
        escapeCsv(r.phone),
        escapeCsv(r.whatsapp),
        escapeCsv(r.route),
        escapeCsv(r.vehicle),
        escapeCsv(r.passengers),
        escapeCsv(r.pickup_time),
        escapeCsv(r.pickup_address),
        escapeCsv(r.special_requirements)
      ].join(',') + '\n';
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="citytourcabs_leads.csv"');
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/bookings', (req, res) => {
  try {
    const name = String(req.body.name || req.body.fullName || 'Customer').trim();
    const phone = String(req.body.phone || req.body.contact || '').trim();
    const whatsapp = String(req.body.whatsapp || req.body.whatsappNumber || phone).trim();
    const route = String(req.body.route || req.body.tourName || req.body.destination || req.body.drop || 'Custom Trip').trim();
    const vehicle = String(req.body.vehicle || req.body.carType || req.body.carPreference || 'Standard Cab').trim();
    const date = String(req.body.date || req.body.travelDate || req.body.pickupDate || new Date().toISOString().slice(0, 10)).trim();
    const pickup_address = String(req.body.pickup_address || req.body.pickupAddress || req.body.pickupLocation || req.body.pickup || '').trim();
    const pickup_time = String(req.body.pickup_time || req.body.pickupTime || '').trim();
    const passengers = String(req.body.passengers || req.body.noOfPassengers || '4').trim();
    const special_requirements = String(req.body.special_requirements || req.body.specialRequirements || req.body.message || req.body.otherDetails || '').trim();
    const type = String(req.body.type || 'Inquiry').trim();
    const referrer = String(req.body.referrer || req.headers.referer || '').trim();

    const id = req.body.id || ('BK-' + Math.floor(100000 + Math.random() * 900000));
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    console.log(`📥 [NEW BOOKING RECEIVED] ID: ${id} | Name: "${name}" | Phone: "${phone}" | Route: "${route}" | Vehicle: "${vehicle}" | Date: "${date}"`);

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO bookings (
        id, name, phone, whatsapp, route, vehicle, date, status, created_at,
        pickup_address, pickup_time, passengers, special_requirements, type, referrer
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, 'Pending', ?,
        ?, ?, ?, ?, ?, ?
      )
    `);

    stmt.run(
      id, name, phone, whatsapp, route, vehicle, date, created_at,
      pickup_address, pickup_time, passengers, special_requirements, type, referrer
    );

    res.json({
      success: true,
      booking: {
        id, name, phone, whatsapp, route, vehicle, date, status: 'Pending', created_at,
        pickup_address, pickup_time, passengers, special_requirements, type, referrer
      }
    });
  } catch (err) {
    console.error('❌ Error saving booking:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/bookings/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const stmt = db.prepare('UPDATE bookings SET status = ? WHERE id = ?');
    stmt.run(status, id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/bookings/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM bookings WHERE id = ?');
    stmt.run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Tours Endpoints (CMS for Tour Packages & Images)
app.get('/api/tours', (req, res) => {
  try {
    const rows = db.prepare('SELECT id, data FROM tours').all();
    const tours = rows.map(r => JSON.parse(r.data));
    res.json({ success: true, tours });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/tours', (req, res) => {
  try {
    const { tours } = req.body;
    if (Array.isArray(tours)) {
      const stmt = db.prepare('INSERT OR REPLACE INTO tours (id, data) VALUES (?, ?)');
      for (const t of tours) {
        stmt.run(t.id, JSON.stringify(t));
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/tours/:id', (req, res) => {
  try {
    const { id } = req.params;
    const tourData = req.body;
    const stmt = db.prepare('INSERT OR REPLACE INTO tours (id, data) VALUES (?, ?)');
    stmt.run(id, JSON.stringify(tourData));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/tours/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM tours WHERE id = ?');
    stmt.run(id);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3b. PocketBase Generic Collections Endpoints
app.get('/api/collections/:col/records', (req, res) => {
  const { col } = req.params;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const perPage = Math.max(1, parseInt(req.query.perPage) || 50);
  const offset = (page - 1) * perPage;
  const filter = (req.query.filter || req.query.search || '').trim();

  try {
    if (col === 'Form_Submissions') {
      let where = '';
      let params = [];
      if (filter) {
        where = 'WHERE (name LIKE ? OR phone LIKE ? OR route LIKE ? OR vehicle LIKE ?)';
        params = [`%${filter}%`, `%${filter}%`, `%${filter}%`, `%${filter}%`];
      }
      const total = db.prepare(`SELECT COUNT(*) as c FROM bookings ${where}`).get(...params).c;
      const rows = db.prepare(`
        SELECT 
          id, type as Type, route as Destination, '' as Package, vehicle as Car_Type,
          name as Full_Name, phone as Phone_Number, whatsapp as Whatsapp_Number,
          passengers as No_of_Passengers, date as Travel_Date, pickup_time as Pickup_Time,
          pickup_address as Pickup_Address, special_requirements as Special_Requirements,
          referrer as Referrer, '' as Other_Details,
          created_at as created, created_at as updated, status
        FROM bookings ${where}
        ORDER BY CASE WHEN created_at IS NOT NULL AND created_at != '' THEN created_at ELSE date END DESC
        LIMIT ? OFFSET ?
      `).all(...params, perPage, offset);

      return res.json({
        page,
        perPage,
        totalItems: total,
        totalPages: Math.ceil(total / perPage),
        items: rows
      });
    }

    if (col === 'Tour_Packages') {
      const total = db.prepare('SELECT COUNT(*) as c FROM tour_packages').get().c;
      const rows = db.prepare('SELECT * FROM tour_packages ORDER BY created DESC LIMIT ? OFFSET ?').all(perPage, offset);
      const items = rows.map(r => ({
        id: r.id,
        Banner: r.banner,
        Title: r.title,
        Sub_title: r.subtitle,
        Summary: r.summary,
        Car_Types: r.car_types,
        Booking_Packages: r.booking_packages,
        Rate_Table: r.rate_table,
        Content: r.content,
        created: r.created,
        updated: r.updated
      }));
      return res.json({ page, perPage, totalItems: total, totalPages: Math.ceil(total / perPage), items });
    }

    if (col === 'Settings') {
      const total = db.prepare('SELECT COUNT(*) as c FROM pb_settings').get().c;
      const rows = db.prepare('SELECT * FROM pb_settings LIMIT ? OFFSET ?').all(perPage, offset);
      const items = rows.map(r => ({
        id: r.id,
        Label: r.label,
        Value: r.value,
        Context: r.context || 'N/A',
        created: r.created,
        updated: r.updated
      }));
      return res.json({ page, perPage, totalItems: total, totalPages: Math.ceil(total / perPage), items });
    }

    if (col === 'Pages') {
      const total = db.prepare('SELECT COUNT(*) as c FROM pages').get().c;
      const rows = db.prepare('SELECT * FROM pages LIMIT ? OFFSET ?').all(perPage, offset);
      const items = rows.map(r => ({
        id: r.id,
        Title: r.title,
        Sub_title: r.subtitle,
        Banner: r.banner,
        Content_1: r.content_1,
        Content_2: r.content_2,
        Content_3: r.content_3,
        Content_4: r.content_4,
        Content_5: r.content_5,
        Content_6: r.content_6,
        Content_7: r.content_7,
        Content_8: r.content_8,
        Content_9: r.content_9,
        Content_10: r.content_10,
        created: r.created,
        updated: r.updated
      }));
      return res.json({ page, perPage, totalItems: total, totalPages: Math.ceil(total / perPage), items });
    }

    res.status(404).json({ message: 'Collection not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/collections/:col/records/:id', (req, res) => {
  const { col, id } = req.params;
  const body = req.body;
  try {
    if (col === 'Form_Submissions') {
      if (body.status) db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(body.status, id);
      if (body.Full_Name) db.prepare('UPDATE bookings SET name = ? WHERE id = ?').run(body.Full_Name, id);
      if (body.Phone_Number) db.prepare('UPDATE bookings SET phone = ? WHERE id = ?').run(body.Phone_Number, id);
      if (body.Destination) db.prepare('UPDATE bookings SET route = ? WHERE id = ?').run(body.Destination, id);
      return res.json({ success: true });
    }
    if (col === 'Settings') {
      if (body.Value !== undefined) {
        db.prepare('UPDATE pb_settings SET value = ?, updated = ? WHERE id = ?')
          .run(body.Value, new Date().toISOString(), id);
        const row = db.prepare('SELECT label FROM pb_settings WHERE id = ?').get(id);
        if (row) {
          if (row.label === 'Phone') db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES ("phone", ?)').run(body.Value);
          if (row.label === 'Email') db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES ("email", ?)').run(body.Value);
        }
      }
      return res.json({ success: true });
    }
    if (col === 'Tour_Packages') {
      db.prepare('UPDATE tour_packages SET title = COALESCE(?, title), summary = COALESCE(?, summary), updated = ? WHERE id = ?')
        .run(body.Title, body.Summary, new Date().toISOString(), id);
      return res.json({ success: true });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/collections/:col/records/:id', (req, res) => {
  const { col, id } = req.params;
  try {
    if (col === 'Form_Submissions') db.prepare('DELETE FROM bookings WHERE id = ?').run(id);
    if (col === 'Tour_Packages') db.prepare('DELETE FROM tour_packages WHERE id = ?').run(id);
    if (col === 'Settings') db.prepare('DELETE FROM pb_settings WHERE id = ?').run(id);
    if (col === 'Pages') db.prepare('DELETE FROM pages WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logs Endpoint matching PocketBase API logs
app.get('/api/logs', (req, res) => {
  res.json({
    items: [
      { id: 'log-1', method: 'GET', status: 200, url: '/api/collections/Form_Submissions/records', ip: '127.0.0.1', created: new Date().toISOString() },
      { id: 'log-2', method: 'POST', status: 200, url: '/api/collections/Form_Submissions/records', ip: '152.59.106.252', created: new Date(Date.now() - 3600000).toISOString() },
      { id: 'log-3', method: 'GET', status: 200, url: '/api/collections/Tour_Packages/records', ip: '49.36.121.87', created: new Date(Date.now() - 7200000).toISOString() },
      { id: 'log-4', method: 'GET', status: 200, url: '/api/collections/Settings/records', ip: '127.0.0.1', created: new Date(Date.now() - 10800000).toISOString() },
    ]
  });
});


// 4. Admin Authentication Endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const validEmail = email?.trim().toLowerCase();
  const allowedEmails = [
    'citytourcabs8@gmail.com',
    'mumbaicitycabs24@gmail.com',
    'mumbaicitytourcabs@gmail.com',
    'admin@citytourcabs.in'
  ];
  const allowedPasswords = ['Shahrukh@123', 'CityTour@123'];

  if (allowedEmails.includes(validEmail) && allowedPasswords.includes(password)) {
    res.json({ success: true, token: 'admin-jwt-token-citytourcabs' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
  }
});

// 5. AI Chatbot & Webhook Proxy Endpoint
function generateFallbackChatResponse(query) {
  const q = (query || '').toLowerCase();

  if (q.includes('mumbai') || q.includes('darshan')) {
    return "🚖 **Mumbai Darshan Packages:**\n- Full-day guided sightseeing starting at just ₹2,499 (Sedan) / ₹3,499 (Ertiga SUV).\n- Covers Gateway of India, Marine Drive, Haji Ali, Siddhivinayak Temple, Bandra-Worli Sea Link, and more.\n- Includes toll, fuel, and experienced driver-cum-guide.\n\nWould you like to book or know timing options?";
  }

  if (q.includes('lonavala') || q.includes('khandala')) {
    return "⛰️ **Lonavala & Khandala Tour:**\n- Same-day return or overnight package.\n- Visit Tiger Point, Bhushi Dam, Lion's Point, Karla Caves & Wax Museum.\n- Fares start from ₹2,799 (Dzire) and ₹3,899 (Ertiga SUV) with transparent pricing.\n\nShall I arrange an instant quote for your travel date?";
  }

  if (q.includes('shirdi') || q.includes('jyotirlinga') || q.includes('ashtavinayak')) {
    return "🛕 **Spiritual & Pilgrimage Tours:**\n- **Shirdi Sai Baba Darshan**: 1-day or 2-day comfortable AC cab with pickup from anywhere in Mumbai/Pune.\n- **3 Jyotirlinga Tour**: Trimbakeshwar, Bhimashankar & Grishneshwar (customizable 2-3 days).\n- **Ashtavinayak Darshan**: Complete 8 Ganpati tour package with clean sanitized cabs.\n\nTell me your starting point and dates to get the best package deal!";
  }

  if (q.includes('alibaug') || q.includes('matheran') || q.includes('mahabaleshwar') || q.includes('konkan') || q.includes('igatpuri')) {
    return "🏖️ **Weekend & Holiday Getaways:**\n- We cover Alibaug, Matheran Eco-hills, Mahabaleshwar-Panchgani, Igatpuri & scenic Konkan Coastal road trips.\n- Clean AC cabs with drivers who know the best viewpoints and food stops.\n- Drop your preferred destination and passenger count to check availability!";
  }

  if (q.includes('fare') || q.includes('rate') || q.includes('price') || q.includes('cost') || q.includes('km') || q.includes('fleet')) {
    return "🚘 **City Tour Cabs Fleet & Pricing:**\n- **Sedan (Swift Dzire/Etios)**: 4 Seater • Affordable, comfortable • Starting ₹13-14/km\n- **SUV (Maruti Ertiga/Carens)**: 6 Seater • Perfect for families • Starting ₹17-18/km\n- **Premium (Innova Crysta)**: 6/7 Seater • Maximum comfort & luxury • Starting ₹22-25/km\n- Zero hidden fees! All local rental & outstation packages have transparent pricing.";
  }

  if (q.includes('book') || q.includes('contact') || q.includes('call') || q.includes('phone') || q.includes('number') || q.includes('agent') || q.includes('help')) {
    return "📞 **Instant Booking & Support:**\n- Call / WhatsApp our booking manager directly at: **+91 7021001921** or Helpline **+91 9967672660**.\n- You can also use the 'Book Now' form on this website or chat with us on WhatsApp for 24/7 instant confirmation!";
  }

  return "Namaste! 🙏 Welcome to **City Tour Cabs**.\n\nI can assist you with:\n1. 🚖 Mumbai Darshan & City Sightseeing\n2. ⛰️ Lonavala, Alibaug, Mahabaleshwar & Matheran getaways\n3. 🛕 Shirdi, Ashtavinayak & Jyotirlinga pilgrimage packages\n4. 🚘 Outstation one-way & round-trip AC cabs\n\nHow can I help you plan your journey today? You can also call us directly at **+91 7021001921**!";
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId, history } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    // Check if a Webhook URL is configured in settings or environment
    let webhookUrl = process.env.CHATBOT_WEBHOOK_URL || process.env.CHAT_WEBHOOK_URL;
    if (!webhookUrl) {
      try {
        const row = db.prepare("SELECT value FROM settings WHERE key = 'chatbotWebhookUrl' OR key = 'chatWebhookUrl' OR key = 'chatbot_webhook_url'").get();
        if (row && row.value && row.value.trim().startsWith('http')) {
          webhookUrl = row.value.trim();
        }
      } catch (dbErr) {
        console.warn('Could not read webhook from db:', dbErr.message);
      }
    }

    // If webhook URL exists, forward request to webhook
    if (webhookUrl) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'CityTourCabs-AI/1.0',
          },
          body: JSON.stringify({
            message: message.trim(),
            history: history || [],
            sessionId: sessionId || `session_${Date.now()}`,
            timestamp: new Date().toISOString(),
            source: 'citytourcabs-widget'
          }),
          signal: controller.signal
        });

        clearTimeout(timeout);

        if (webhookResponse.ok) {
          const contentType = webhookResponse.headers.get('content-type') || '';
          let replyText = '';

          if (contentType.includes('application/json')) {
            const data = await webhookResponse.json();
            if (data.output) replyText = typeof data.output === 'string' ? data.output : JSON.stringify(data.output);
            else if (data.reply) replyText = typeof data.reply === 'string' ? data.reply : JSON.stringify(data.reply);
            else if (data.response) replyText = typeof data.response === 'string' ? data.response : JSON.stringify(data.response);
            else if (data.message) replyText = typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
            else if (data.text) replyText = typeof data.text === 'string' ? data.text : JSON.stringify(data.text);
            else if (Array.isArray(data) && data.length > 0) {
              const first = data[0];
              replyText = first.output || first.reply || first.message || JSON.stringify(first);
            } else {
              replyText = JSON.stringify(data);
            }
          } else {
            replyText = await webhookResponse.text();
          }

          if (replyText && replyText.trim()) {
            return res.json({ success: true, reply: replyText.trim(), source: 'webhook' });
          }
        } else {
          console.warn(`Webhook responded with status ${webhookResponse.status}`);
        }
      } catch (forwardErr) {
        console.error('Error forwarding message to webhook:', forwardErr.message);
      }
    }

    // Fallback response if webhook is not configured or failed
    const fallbackReply = generateFallbackChatResponse(message);
    return res.json({
      success: true,
      reply: fallbackReply,
      source: webhookUrl ? 'fallback_after_webhook_error' : 'internal_assistant'
    });
  } catch (err) {
    console.error('Chat endpoint error:', err);
    res.status(500).json({ error: 'Internal server error processing chat message.' });
  }
});

// Chat status endpoint (lets frontend check if webhook is linked)
app.get('/api/chat/status', (req, res) => {
  let webhookUrl = process.env.CHATBOT_WEBHOOK_URL || process.env.CHAT_WEBHOOK_URL;
  if (!webhookUrl) {
    try {
      const row = db.prepare("SELECT value FROM settings WHERE key = 'chatbotWebhookUrl' OR key = 'chatWebhookUrl' OR key = 'chatbot_webhook_url'").get();
      if (row && row.value && row.value.trim().startsWith('http')) {
        webhookUrl = row.value.trim();
      }
    } catch (e) {}
  }
  let host = null;
  if (webhookUrl) {
    try { host = new URL(webhookUrl).host; } catch (_) {}
  }
  res.json({
    enabled: true,
    webhookConfigured: Boolean(webhookUrl),
    webhookHost: host
  });
});

// Serve compiled static assets
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Catch-all route to serve SPA index.html
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚖 City Tour Cabs Fullstack server running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Database connected at ${DB_PATH}`);
});
