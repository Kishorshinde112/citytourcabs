export const MUMBAI_DARSHAN_RATES = [
  {
    id: "wagonr",
    carType: "Maruti Wagon R",
    category: "Hatchback",
    seating: "4+1 Seater",
    recommended: false,
    isTempo: false,
    rates: {
      "8h_80km": 2300,
      "10h_100km": 2800,
      "12h_120km": 3400
    },
    extraKm: 12,
    extraHr: 120
  },
  {
    id: "dzire",
    carType: "Swift Dzire / Accent",
    category: "Prime Sedan",
    seating: "4+1 Seater",
    recommended: true,
    isTempo: false,
    rates: {
      "8h_80km": 2500,
      "10h_100km": 3200,
      "12h_120km": 3800
    },
    extraKm: 14,
    extraHr: 140
  },
  {
    id: "ertiga",
    carType: "Maruti Suzuki Ertiga",
    category: "Family MUV",
    seating: "6+1 Seater",
    recommended: true,
    isTempo: false,
    rates: {
      "8h_80km": 3200,
      "10h_100km": 3800,
      "12h_120km": 4400
    },
    extraKm: 16,
    extraHr: 160
  },
  {
    id: "carens",
    carType: "Kia Carens",
    category: "Premium MPV",
    seating: "6+1 Seater",
    recommended: false,
    isTempo: false,
    rates: {
      "8h_80km": 3500,
      "10h_100km": 4200,
      "12h_120km": 4800
    },
    extraKm: 18,
    extraHr: 180
  },
  {
    id: "innova",
    carType: "Toyota Innova Crysta",
    category: "Luxury King",
    seating: "7+1 Seater",
    recommended: false,
    isTempo: false,
    rates: {
      "8h_80km": 3800,
      "10h_100km": 4500,
      "12h_120km": 5200
    },
    extraKm: 20,
    extraHr: 200
  },
  {
    id: "tempo13",
    carType: "13 Seater A/C Traveller",
    category: "Minibus",
    seating: "13+1 Seater",
    recommended: false,
    isTempo: true,
    rates: {
      "12h_100km": 8500
    },
    extraKm: 25,
    extraHr: 300
  },
  {
    id: "tempo17",
    carType: "17 Seater A/C Traveller",
    category: "Group Bus",
    seating: "17+1 Seater",
    recommended: false,
    isTempo: true,
    rates: {
      "12h_100km": 9500
    },
    extraKm: 28,
    extraHr: 350
  }
];

export const SIGHTSEEING_ITINERARIES = [
  {
    id: "south-mumbai",
    name: "South Mumbai Heritage Circuit",
    badge: "Heritage & Seaside (12 Spots)",
    subtitle: "Gateway of India to Marine Drive & Hanging Gardens",
    description: "Experience colonial British architecture, seaside promenades, ancient temples, and iconic city monuments.",
    landmarks: [
      "Gateway of India & Taj Mahal Palace Hotel",
      "Marine Drive & Queen's Necklace",
      "Chhatrapati Shivaji Maharaj Terminus (CSMT)",
      "Girgaon Chowpatty Seaside Walk",
      "Hanging Gardens & Kamla Nehru Park",
      "Mani Bhavan (Mahatma Gandhi Memorial)",
      "Haji Ali Dargah & Worli Sea Face",
      "Mahalaxmi Temple",
      "Dhobi Ghat Open Air Laundry",
      "Flora Fountain & Hutatma Chowk",
      "Colaba Causeway Shopping & Regal Circle",
      "Jehangir Art Gallery & Kala Ghoda Precinct"
    ]
  },
  {
    id: "north-mumbai",
    name: "North Mumbai Suburbs & Beaches Circuit",
    badge: "Spiritual & Coastal (9 Spots)",
    subtitle: "Siddhivinayak to Bandstand & Juhu Beach",
    description: "Explore holy temples, Bollywood celebrity landmarks, the Bandra-Worli Sea Link, and vibrant sunset beaches.",
    landmarks: [
      "Shree Siddhivinayak Ganapati Temple",
      "Bandra-Worli Sea Link Expressway",
      "Mount Mary Church (Bandra)",
      "Bandstand & Mannat / Galaxy View",
      "Juhu Beach Sunset & Street Food",
      "ISKCON Temple Juhu",
      "Versova Rock Beach & Fishing Village",
      "Sanjay Gandhi National Park & Caves (Optional)",
      "Global Vipassana Pagoda, Gorai (Optional)"
    ]
  },
  {
    id: "full-day-darshan",
    name: "Complete Mumbai Darshan All-in-One Circuit",
    badge: "Best Value (South + North Combined)",
    subtitle: "From Morning Historic Heritage to Sunset Seaside Beach",
    description: "The complete Mumbai experience in a single comprehensive guided day trip covering all top iconic spots without hassle.",
    landmarks: [
      "Gateway of India & Taj Mahal Palace",
      "Marine Drive & Queen's Necklace",
      "CSMT Heritage Victorian Terminus",
      "Mani Bhavan & Hanging Gardens",
      "Haji Ali Dargah & Mahalaxmi Temple",
      "Siddhivinayak Ganapati Temple",
      "Bandra-Worli Sea Link Coastal Drive",
      "Bandstand Promenade & Celebrity Mansions",
      "Juhu Beach Sunset Walk & ISKCON Temple"
    ]
  }
];

export const TOUR_TERMS = [
  "Night Allowance: Rs. 500/- will be applicable after 11 PM (Only for Tempo Traveller).",
  "Toll & Parking: Toll charges, parking fees, and entry tickets to monuments are not included in car hire charges.",
  "Cancellation: If booking is canceled after arrival of driver, cancellation charges of ₹500/- will be applicable."
];
