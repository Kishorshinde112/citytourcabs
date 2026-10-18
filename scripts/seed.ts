import { getPayload } from 'payload'
import config from '../src/payload.config'
import tourPagesData from '../src/data/tourPagesData.json'
import { FLEET_DATA } from '../src/data/fleetData'
import { TESTIMONIALS_DATA } from '../src/data/testimonialsData'
import { FAQ_DATA } from '../src/data/faqData'
import { GALLERY_DATA } from '../src/data/routesData'

async function seed() {
  console.log('🌱 Starting comprehensive Payload CMS database seed...')
  const payload = await getPayload({ config })

  // 1. Seed Admin User
  const existingUsers = await payload.find({
    collection: 'users',
    limit: 1,
  })

  if (existingUsers.totalDocs === 0) {
    console.log('Creating default admin user: citytourcabs8@gmail.com...')
    await payload.create({
      collection: 'users',
      data: {
        name: 'Administrator',
        email: 'citytourcabs8@gmail.com',
        password: 'CityTourCabs@2026!',
        role: 'admin',
      },
    })
    console.log('✅ Admin user created successfully.')
  } else {
    console.log('ℹ️ Admin user already exists.')
  }

  // 2. Seed Tours
  const existingTours = await payload.find({
    collection: 'tours',
    limit: 1,
  })

  if (existingTours.totalDocs === 0) {
    console.log('Seeding tour packages from tourPagesData.json...')
    for (const [slug, tour] of Object.entries(tourPagesData as Record<string, any>)) {
      await payload.create({
        collection: 'tours',
        data: {
          title: tour.title,
          slug,
          tagline: tour.subtitle || '',
          duration: 'Full Day / Multi-Day',
          starting_price: '₹2,300',
          hero_image: tour.heroImage || '/assets/about-banner.jpg',
          description: tour.subtitle || tour.title,
          rate_table_html: tour.rightHtml || '',
          itinerary_html: tour.leftHtml || '',
          popular: slug === 'mumbai-darshan' || slug === 'lonavala-trip' || slug === 'alibaug-sightseeing',
          meta: {
            title: `${tour.title} | City Tour Cabs Mumbai`,
            description: `Book sanitized private cabs with expert driver-guides for ${tour.title}. Doorstep pickup and transparent rates.`,
          },
        },
      })
      console.log(`  + Seeded tour: ${tour.title} (/${slug})`)
    }
    console.log('✅ Tours seeded successfully.')
  } else {
    console.log('ℹ️ Tours already present.')
  }

  // 3. Seed Fleet Vehicles
  const existingFleet = await payload.find({
    collection: 'fleet',
    limit: 1,
  })

  if (existingFleet.totalDocs === 0) {
    console.log('Seeding fleet vehicles from FLEET_DATA...')
    for (const car of FLEET_DATA) {
      await payload.create({
        collection: 'fleet',
        data: {
          name: car.name,
          category: car.category as any,
          seating: car.seating,
          luggage: car.luggage,
          rate_per_km: car.ratePerKm,
          image_url: car.image,
          features: car.features.map((f: string) => ({ feature: f })),
        },
      })
      console.log(`  + Seeded fleet: ${car.name}`)
    }
    console.log('✅ Fleet vehicles seeded successfully.')
  } else {
    console.log('ℹ️ Fleet already present.')
  }

  // 4. Seed Pages (Home, About Us, Privacy Policy)
  const existingPages = await payload.find({
    collection: 'pages',
    limit: 1,
  })

  if (existingPages.totalDocs === 0) {
    console.log('Seeding standard website pages (Home, About Us, Privacy Policy)...')
    
    // Home Page
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: 'home',
        hero: {
          title: 'Explore Mumbai & Beyond in Comfort',
          subtitle: 'Sanitized Cabs • Local Driver-Guides • Transparent Flat Rates',
          badge: "Mumbai's #1 Rated Cab Service",
        },
        slides: [
          {
            image: '/assets/bd08021da8c244de8eafa9a4f86c4e2a30099151-CaKyNwZu.png',
            subtitle: 'Discover the City of Dreams',
            title: 'Mumbai Sightseeing Tours',
            description: 'Explore Mumbai\'s iconic landmarks with our expert drivers who know every corner, every story, and every hidden gem of the city.',
            link: '/mumbai-darshan',
            buttonText: 'Explore Mumbai Tours',
          },
          {
            image: '/assets/0b74c7f86c8df43750abbbe95621c390702852bc-C6i9-JQP.png',
            subtitle: 'Escape to the Hills',
            title: 'Lonavala Weekend Getaway',
            description: 'Experience the scenic beauty of Lonavala with our comfortable cabs and knowledgeable drivers who will make your hill station trip unforgettable.',
            link: '/lonavala-trip',
            buttonText: 'Book Lonavala Trip',
          },
          {
            image: 'https://images.unsplash.com/photo-1629640890590-7836d69c5237?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTaGlyZGklMjB0ZW1wbGUlMjBJbmRpYXxlbnwxfHx8fDE3NjEzNzg4MTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
            subtitle: 'Seek Blessings & Peace',
            title: 'Shirdi Spiritual Journey',
            description: 'Visit the holy town of Shirdi with our reliable cab service and experienced drivers who ensure a comfortable and peaceful pilgrimage journey.',
            link: '/shirdi-tour',
            buttonText: 'Book Shirdi Tour',
          },
        ],
        meta: {
          title: 'City Tour Cabs - Top Rated Private Mumbai Sightseeing & Outstation Cabs',
          description: 'Book private chauffeur cabs in Mumbai for South Mumbai Darshan, Lonavala, Shirdi, Mahabaleshwar, and airport transfers. Best rates guaranteed.',
        },
      },
    })
    console.log('  + Seeded Page: Home (/home)')

    // About Us Page
    await payload.create({
      collection: 'pages',
      data: {
        title: 'About Us',
        slug: 'about',
        hero: {
          title: 'About Us',
          subtitle: 'Your trusted local cab partner in Mumbai',
          backgroundImage: '/assets/about-banner.jpg',
        },
        aboutContent: {
          welcomeTitle: 'Welcome to CityTourCabs',
          welcomeDescription: 'We make city travel easy, affordable, and comfortable with fast doorstep pickup and drop, reliable service, and friendly professional drivers who truly care about your experience.',
          driverImage: '/assets/about-driver.jpg',
          statsYears: '12+',
          statsCustomers: '50,000+',
          statsCabs: '45+',
          statsCities: '25+',
          missionTitle: 'Our Mission & Promise',
          missionDescription: 'To deliver safe, sanitized, punctual, and transparent cab services across Mumbai, Maharashtra, and beyond. Every journey is backed by 24/7 dedicated support and experienced driver-guides.',
          fleetDescription: 'From economical sedans for city errands to premium SUVs and tempo travellers for family vacations and pilgrimage tours, our fleet is rigorously inspected and sanitized before every single trip.',
        },
        meta: {
          title: 'About City Tour Cabs - Mumbai Trusted Cab Service',
          description: 'Learn about City Tour Cabs, our 12+ years of passenger experience, clean sanitized fleet, and local driver-guides.',
        },
      },
    })
    console.log('  + Seeded Page: About Us (/about)')

    // Privacy Policy & Terms Page
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Privacy Policy & Terms',
        slug: 'privacy-policy',
        hero: {
          title: 'Privacy Policy & Terms',
          subtitle: 'Transparent policies designed for passenger safety and peace of mind.',
        },
        contentHtml: `
          <h3>Booking & Cancellation Policy</h3>
          <p>We believe in honest, stress-free travel. You can cancel or modify your local Mumbai Darshan booking up to 6 hours before pickup with zero penalty.</p>
          <h3>Vehicle Cleanliness Guarantee</h3>
          <p>Every vehicle in our fleet is vacuumed, sanitized, and inspected prior to dispatch. Air conditioning is 100% operational.</p>
          <h3>Privacy & Data Safety</h3>
          <p>We do not share customer contact details with third-party advertisers. Your phone number is strictly used for booking confirmations and driver communication.</p>
        `,
        meta: {
          title: 'Privacy Policy & Terms | City Tour Cabs Mumbai',
          description: 'Official cancellation terms, refund policies, and privacy statement of City Tour Cabs.',
        },
      },
    })
    console.log('  + Seeded Page: Privacy Policy (/privacy-policy)')
    console.log('✅ Pages seeded successfully.')
  } else {
    console.log('ℹ️ Pages already present.')
  }

  // 5. Seed Testimonials
  const existingTestimonials = await payload.find({
    collection: 'testimonials',
    limit: 1,
  })

  if (existingTestimonials.totalDocs === 0) {
    console.log('Seeding customer reviews from TESTIMONIALS_DATA...')
    for (let i = 0; i < TESTIMONIALS_DATA.length; i++) {
      const item = TESTIMONIALS_DATA[i]
      await payload.create({
        collection: 'testimonials',
        data: {
          name: item.name,
          location: item.location,
          rating: item.rating,
          comment: item.text,
          tour_name: item.trip,
          date: item.date,
          avatar_url: item.avatar,
          featured: true,
          order: i,
        },
      })
      console.log(`  + Seeded testimonial from: ${item.name}`)
    }
    console.log('✅ Testimonials seeded successfully.')
  } else {
    console.log('ℹ️ Testimonials already present.')
  }

  // 6. Seed FAQs
  const existingFaqs = await payload.find({
    collection: 'faqs',
    limit: 1,
  })

  if (existingFaqs.totalDocs === 0) {
    console.log('Seeding FAQs from FAQ_DATA...')
    for (let i = 0; i < FAQ_DATA.length; i++) {
      const item = FAQ_DATA[i]
      await payload.create({
        collection: 'faqs',
        data: {
          question: item.question,
          answer: item.answer,
          category: 'general',
          order: i,
        },
      })
      console.log(`  + Seeded FAQ: ${item.question.slice(0, 40)}...`)
    }
    console.log('✅ FAQs seeded successfully.')
  } else {
    console.log('ℹ️ FAQs already present.')
  }

  // 7. Seed Gallery
  const existingGallery = await payload.find({
    collection: 'gallery',
    limit: 1,
  })

  if (existingGallery.totalDocs === 0) {
    console.log('Seeding gallery photos from GALLERY_DATA...')
    for (let i = 0; i < GALLERY_DATA.length; i++) {
      const item = GALLERY_DATA[i]
      await payload.create({
        collection: 'gallery',
        data: {
          title: item.title,
          imageUrl: item.image,
          location: item.category,
          order: i,
        },
      })
      console.log(`  + Seeded gallery image: ${item.title}`)
    }
    console.log('✅ Gallery images seeded successfully.')
  } else {
    console.log('ℹ️ Gallery already present.')
  }

  // 8. Seed / Update Global SiteSettings
  console.log('Updating Global Site Settings with full branding & announcements...')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'City Tour Cabs',
      supportPhone: '7021001921',
      helpPhone: '9967672660',
      supportEmail: 'citytourcabs8@gmail.com',
      whatsappNumber: '917021001921',
      officeAddress: 'Shop No 4, Chembur West, Mumbai, Maharashtra 400071',
      workingHours: '24/7 Available (Open All 365 Days)',
      announcement: {
        enabled: true,
        text: 'Available 24/7 for your convenience • 100% Sanitized Cabs with Expert Local Drivers',
      },
      promoPopup: {
        enabled: true,
        delaySeconds: 5,
        headline: 'Special Tour Offer!',
        subtext: 'Get Flat 15% OFF on advance bookings for Mumbai Sightseeing and Outstation Tours.',
        discountBadge: 'FLAT 15% OFF',
        couponCode: 'CITY15',
      },
      footer: {
        bio: 'City Tour Cabs is Mumbai\'s trusted cab service. Clean sanitized cabs, experienced polite chauffeurs, and transparent flat pricing for Mumbai Darshan and outstation trips.',
        copyright: '© 2026 City Tour Cabs. All rights reserved. Designed for hassle-free travel.',
        facebookUrl: 'https://facebook.com',
        instagramUrl: 'https://instagram.com',
      },
      chatbotWebhookUrl: '',
    },
  })
  console.log('✅ Global Site Settings updated successfully.')

  console.log('🎉 Seed complete! All CMS data is now ready for client self-service in /admin.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seeding failed with error:', err)
  process.exit(1)
})
