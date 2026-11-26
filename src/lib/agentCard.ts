import { SITE_CONFIG } from '@/shared/config/site';
import { getSiteSettings } from '@/lib/cmsGlobals';
import { getAllTours } from '@/modules/tours/queries';
import { getActiveFleet } from '@/modules/fleet/queries';
import { displayIndianPhone, telHref, whatsappNumber } from '@/lib/phone';
import tourPagesData from '@/data/tourPagesData.json';
import { FLEET_DATA } from '@/data/fleetData';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.siteUrl).replace(/\/+$/, '');

export function buildAgentCard() {
  return {
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: BASE_URL,
    version: '1.0.0',
    documentationUrl: `${BASE_URL}/llms.txt`,
    provider: {
      organization: SITE_CONFIG.legalName,
      url: BASE_URL,
    },
    capabilities: {
      streaming: false,
      pushNotifications: false,
      stateTransitionHistory: false,
    },
    defaultInputModes: ['text/plain', 'application/json'],
    defaultOutputModes: ['text/plain', 'application/json', 'text/html'],
    skills: [
      {
        id: 'browse-tour-packages',
        name: 'Browse Mumbai & Maharashtra Sightseeing Tour Packages',
        description:
          'Discover Mumbai Darshan, Lonavala, Alibaug, Shirdi, Mahabaleshwar, Ashtavinayak, Matheran, Nashik, and Jyotirlinga cab tour packages with transparent package rates and itineraries.',
        tags: ['tours', 'sightseeing', 'mumbai-darshan', 'outstation', 'pilgrimage'],
        examples: [
          'Show Mumbai Darshan cab packages and 8/10/12 hour rates',
          'What sightseeing tours are available from Mumbai?',
        ],
      },
      {
        id: 'inspect-cab-fleet-and-rates',
        name: 'Inspect Cab Fleet & Per-Kilometer Rates',
        description:
          'View available AC vehicles (WagonR, Dzire/Etios Sedan, Ertiga, Kia Carens, Innova Crysta, 13 & 17 Seater Tempo Traveller) with seating capacities and transparent tariffs.',
        tags: ['fleet', 'cab-rates', 'sedan', 'suv', 'tempo-traveller'],
        examples: [
          'Which SUVs and Tempo Travellers are available for family trips?',
          'Compare base rates and per-km pricing across vehicles.',
        ],
      },
      {
        id: 'submit-cab-booking-or-enquiry',
        name: 'Submit Cab Booking or Custom Tour Enquiry',
        description:
          'Book a cab or request a fixed fare quote for doorstep pickup in Mumbai, airport transfers, or multi-day outstation trips via web booking or 24/7 phone/WhatsApp desk.',
        tags: ['booking', 'enquiry', 'airport-transfer', 'mumbai-cab'],
        examples: [
          'Book an Ertiga for Mumbai Darshan tomorrow at 9 AM',
          'Get a fixed quote for Mumbai to Shirdi round trip',
        ],
      },
    ],
  };
}

export async function buildLlmsTxt(): Promise<string> {
  const [settings, cmsTours, cmsFleet] = await Promise.all([
    getSiteSettings(),
    getAllTours(),
    getActiveFleet(),
  ]);

  const phone = settings.phone || SITE_CONFIG.defaultPhone;
  const email = settings.email || SITE_CONFIG.defaultEmail;
  const address = settings.officeAddress || `${SITE_CONFIG.address.street}, ${SITE_CONFIG.address.city} ${SITE_CONFIG.address.postalCode}`;
  const hours = settings.workingHours || SITE_CONFIG.workingHours;

  const tours = cmsTours.length > 0
    ? cmsTours
    : Object.entries(tourPagesData as Record<string, any>).map(([slug, data]) => ({
        slug,
        title: data.title,
        tagline: data.subtitle,
        startingPrice: data.startingPrice || 'Best Rates',
      }));

  const fleet = cmsFleet.length > 0
    ? cmsFleet
    : FLEET_DATA.map((f) => ({
        name: f.name,
        category: f.category,
        seats: f.seats,
        ratePerKm: f.ratePerKm,
        localFullDay: f.localFullDay,
      }));

  const lines: string[] = [
    `# ${settings.siteName || SITE_CONFIG.name}`,
    '',
    `> ${SITE_CONFIG.tagline}. ${SITE_CONFIG.description}`,
    '',
    `Website: ${BASE_URL}`,
    `Agent Card: ${BASE_URL}/.well-known/agent-card.json`,
    '',
    '## Key Pages',
    `- [Home](${BASE_URL}/): Overview of cabs, tour packages, fleet, customer reviews, and FAQs`,
    `- [Tour Packages](${BASE_URL}/tours): All Mumbai Darshan, weekend getaway, and pilgrimage tour packages`,
    `- [Mumbai Darshan](${BASE_URL}/tours/mumbai-darshan): Full-day guided Mumbai sightseeing cab packages (8h/80km, 10h/100km, 12h/120km)`,
    `- [Our Fleet](${BASE_URL}/fleet): Clean, sanitized AC Hatchbacks, Sedans, SUVs, and Tempo Travellers`,
    `- [About Us](${BASE_URL}/about): Company background, mission, and service standards`,
    `- [Contact & Booking Enquiry](${BASE_URL}/contact): 24/7 dispatch desk and booking enquiry form`,
    `- [Privacy Policy](${BASE_URL}/privacy-policy): Customer data privacy and booking policy`,
    '',
    '## Tour Packages',
    ...tours.map((t: any) => {
      const priceNote = t.startingPrice ? ` | Starting: ${t.startingPrice}` : '';
      const taglineNote = t.tagline ? ` — ${t.tagline}` : '';
      return `- [${t.title}](${BASE_URL}/tours/${t.slug})${taglineNote}${priceNote}`;
    }),
    '',
    '## Cab Fleet & Tariffs',
    ...fleet.map((v: any) => {
      const parts = [
        v.category ? `Category: ${v.category}` : null,
        v.seats ? `Capacity: ${v.seats}` : null,
        v.localFullDay ? `Base Package: ${v.localFullDay}` : null,
        v.ratePerKm ? `Extra/Km: ${v.ratePerKm}` : null,
      ].filter(Boolean);
      return `- **${v.name}** (${parts.join(', ')})`;
    }),
    '',
    '## 24/7 Contact & Booking Channels',
    `- Phone: ${displayIndianPhone(phone)} (${telHref(phone)})`,
    `- WhatsApp: https://wa.me/${whatsappNumber(phone)}`,
    `- Email: ${email}`,
    `- Office: ${address}`,
    `- Operating Hours: ${hours}`,
    '',
    '## Service Policies',
    '- Flexible doorstep pickup and drop across Mumbai, Navi Mumbai, and Thane.',
    '- Experienced local drivers acting as helpful tour guides.',
    '- Transparent billing; toll, parking, and entry tickets are charged separately at actuals.',
    '- Instant booking confirmation available via website form, phone call, or WhatsApp.',
    '',
  ];

  return lines.join('\n');
}
