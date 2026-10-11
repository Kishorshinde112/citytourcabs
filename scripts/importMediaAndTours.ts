import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import tourPagesData from '../src/data/tourPagesData.json'

const TOUR_RATES: Record<string, Array<{ vehicleName: string; category: string; capacity: string; rate: string; extraKmRate: string; features: string }>> = {
  'mumbai-darshan': [
    { vehicleName: 'Maruti WagonR (AC)', category: 'Sedan', capacity: '4 Passengers + 1 Driver', rate: '₹2,300 (8h / 80km)', extraKmRate: '₹12/km', features: 'AC • Sanitized • City Guide Driver' },
    { vehicleName: 'Maruti Swift Dzire (Sedan)', category: 'Sedan', capacity: '4 Passengers + 1 Driver', rate: '₹2,500 (8h / 80km)', extraKmRate: '₹14/km', features: 'Chilled AC • Boot Space • Guide Driver' },
    { vehicleName: 'Maruti Ertiga (6 Seater)', category: 'SUV', capacity: '6 Passengers + 1 Driver', rate: '₹3,200 (8h / 80km)', extraKmRate: '₹16/km', features: 'Spacious Family Car • Dual AC' },
    { vehicleName: 'Kia Carens (Luxury MPV)', category: 'SUV', capacity: '6 Passengers + 1 Driver', rate: '₹3,500 (8h / 80km)', extraKmRate: '₹18/km', features: 'Plush Leather Seats • Premium Comfort' },
    { vehicleName: 'Toyota Innova Crysta', category: 'Premium SUV', capacity: '7 Passengers + 1 Driver', rate: '₹3,800 (8h / 80km)', extraKmRate: '₹20/km', features: 'Top Comfort • Highway Master' },
    { vehicleName: 'Tempo Traveller (13 Seater)', category: 'Tempo Traveller', capacity: '13 Passengers + 1 Driver', rate: '₹8,500 (12h / 100km)', extraKmRate: '₹24/km', features: 'Pushback Seats • Group Travel' },
    { vehicleName: 'Tempo Traveller (17 Seater)', category: 'Tempo Traveller', capacity: '17 Passengers + 1 Driver', rate: '₹9,500 (12h / 100km)', extraKmRate: '₹26/km', features: 'Large Group • Sound System' },
  ],
  'lonavala-trip': [
    { vehicleName: 'Maruti Swift Dzire (Sedan)', category: 'Sedan', capacity: '4 Passengers + 1 Driver', rate: '₹4,500 (Same Day 300km)', extraKmRate: '₹14/km', features: 'AC • Hill Station Expert Driver' },
    { vehicleName: 'Maruti Ertiga (SUV)', category: 'SUV', capacity: '6 Passengers + 1 Driver', rate: '₹5,200 (Same Day 300km)', extraKmRate: '₹16/km', features: 'Family Comfort • Ghat Driving Safe' },
    { vehicleName: 'Kia Carens', category: 'SUV', capacity: '6 Passengers + 1 Driver', rate: '₹5,800 (Same Day 300km)', extraKmRate: '₹18/km', features: 'Luxury Seating • Dual AC' },
    { vehicleName: 'Toyota Innova Crysta', category: 'Premium SUV', capacity: '7 Passengers + 1 Driver', rate: '₹6,400 (Same Day 300km)', extraKmRate: '₹20/km', features: 'Premium Smooth Ghat Suspension' },
  ],
  'alibaug-sightseeing': [
    { vehicleName: 'Maruti Swift Dzire (Sedan)', category: 'Sedan', capacity: '4 Passengers + 1 Driver', rate: '₹4,500 (Same Day 300km)', extraKmRate: '₹14/km', features: 'AC • Beach Trip Specialist' },
    { vehicleName: 'Maruti Ertiga (SUV)', category: 'SUV', capacity: '6 Passengers + 1 Driver', rate: '₹5,200 (Same Day 300km)', extraKmRate: '₹16/km', features: 'Spacious for Luggage & Water Gear' },
    { vehicleName: 'Toyota Innova Crysta', category: 'Premium SUV', capacity: '7 Passengers + 1 Driver', rate: '₹6,400 (Same Day 300km)', extraKmRate: '₹20/km', features: 'Maximum Comfort on Coastal Highway' },
  ],
  'matheran-sightseeing': [
    { vehicleName: 'Maruti Swift Dzire (Sedan)', category: 'Sedan', capacity: '4 Passengers + 1 Driver', rate: '₹3,800 (Same Day 250km)', extraKmRate: '₹14/km', features: 'Pickup & Drop at Dasturi Naka' },
    { vehicleName: 'Maruti Ertiga (SUV)', category: 'SUV', capacity: '6 Passengers + 1 Driver', rate: '₹4,400 (Same Day 250km)', extraKmRate: '₹16/km', features: 'Family Hill Ride' },
    { vehicleName: 'Toyota Innova Crysta', category: 'Premium SUV', capacity: '7 Passengers + 1 Driver', rate: '₹5,400 (Same Day 250km)', extraKmRate: '₹20/km', features: 'Luxury Ghat Experience' },
  ],
  'shirdi-tour': [
    { vehicleName: 'Maruti Swift Dzire (Sedan)', category: 'Sedan', capacity: '4 Passengers + 1 Driver', rate: '₹8,000 (Same Day 550km)', extraKmRate: '₹14/km', features: 'Samruddhi Mahamarg Highway Trained' },
    { vehicleName: 'Maruti Ertiga (SUV)', category: 'SUV', capacity: '6 Passengers + 1 Driver', rate: '₹9,200 (Same Day 550km)', extraKmRate: '₹16/km', features: 'Devotional Tour Family Cab' },
    { vehicleName: 'Toyota Innova Crysta', category: 'Premium SUV', capacity: '7 Passengers + 1 Driver', rate: '₹11,400 (Same Day 550km)', extraKmRate: '₹20/km', features: 'Elderly Friendly Reclining Seats' },
  ],
  'mahabaleshwar-sightseeing': [
    { vehicleName: 'Maruti Swift Dzire (Sedan)', category: 'Sedan', capacity: '4 Passengers + 1 Driver', rate: '₹6,600 (2D/1N 450km)', extraKmRate: '₹14/km', features: 'Pasarni Ghat Safe Chauffeur' },
    { vehicleName: 'Maruti Ertiga (SUV)', category: 'SUV', capacity: '6 Passengers + 1 Driver', rate: '₹7,600 (2D/1N 450km)', extraKmRate: '₹16/km', features: 'Strawberry Valley Sightseeing' },
    { vehicleName: 'Toyota Innova Crysta', category: 'Premium SUV', capacity: '7 Passengers + 1 Driver', rate: '₹9,400 (2D/1N 450km)', extraKmRate: '₹20/km', features: 'King of Hill Station Tours' },
  ],
}

async function main() {
  console.log('🚀 Starting Media Library Import & Tour Pages CMS Synchronizer...')
  const payload = await getPayload({ config })

  // 1. Ensure public/media directory exists
  const mediaDir = path.resolve(process.cwd(), 'public/media')
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true })
  }

  // 2. Discover all asset files
  const assetPaths = [
    'public/assets/mumbai-darshan.png',
    'public/assets/citytourcabs-logo.png',
    'public/assets/about-banner.jpg',
    'public/assets/about-driver.jpg',
    'public/assets/about-cityscape.png',
    'public/assets/dzire-CAMjcjsT.jpg',
    'public/assets/ertiga-Bq9MdWD-.jpg',
    'public/assets/innova-B7xv-cs5.jpg',
    'public/assets/carens-CBBO8xCr.jpg',
    'public/assets/wagonr-Ct1Y7D7H.jpg',
    'public/assets/tempo-traveller.jpg',
    'public/assets/0b74c7f86c8df43750abbbe95621c390702852bc-C6i9-JQP.png',
    'public/assets/bd08021da8c244de8eafa9a4f86c4e2a30099151-CaKyNwZu.png',
    'public/assets/2fb8d36e68b18567546da82e33c3bec544da2220-BkfUJrnl.png',
    'public/assets/tours/mumbai-darshan.png',
    'public/assets/tours/lonavala-trip.webp',
    'public/assets/tours/alibaug-sightseeing.webp',
    'public/assets/tours/matheran-sightseeing.webp',
    'public/assets/tours/shirdi-tour.jpeg',
    'public/assets/tours/mahabaleshwar-sightseeing.webp',
    'public/assets/tours/igatpuri-tour.jpg',
    'public/assets/tours/ashtavinayak.jpg',
    'public/assets/tours/3-jyotirlinga-in-maharashtra.jpg',
    'public/assets/tours/konkan-darshan.jpg',
  ]

  const mediaMap: Record<string, number> = {}

  for (const relPath of assetPaths) {
    const fullPath = path.resolve(process.cwd(), relPath)
    if (!fs.existsSync(fullPath)) continue

    const baseName = path.basename(fullPath)
    const targetPath = path.join(mediaDir, baseName)

    if (!fs.existsSync(targetPath)) {
      fs.copyFileSync(fullPath, targetPath)
    }

    // Check if already in media collection
    const existing = await payload.find({
      collection: 'media',
      where: {
        filename: { equals: baseName },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      mediaMap[baseName] = existing.docs[0].id as number
      console.log(`  ✓ Found existing media: ${baseName} (ID: ${existing.docs[0].id})`)
    } else {
      try {
        const stats = fs.statSync(targetPath)
        const ext = path.extname(baseName).toLowerCase()
        const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
        const doc = await payload.create({
          collection: 'media',
          filePath: targetPath,
          data: {
            alt: baseName.replace(/[-_.]/g, ' '),
            caption: 'City Tour Cabs Website Asset',
          },
        })
        mediaMap[baseName] = doc.id as number
        console.log(`  + Created media: ${baseName} (ID: ${doc.id})`)
      } catch (err) {
        console.warn(`  ! Could not create media doc for ${baseName}:`, err)
      }
    }
  }

  // 3. Update Tours Collection with visual fields and media relations
  console.log('\n🌟 Updating all 10 Tour Landing Pages in CMS...')
  const standardInclusions = [
    { item: 'Private Dedicated Air-Conditioned Vehicle for your group' },
    { item: 'Fuel Charges & Driver Day Allowance included' },
    { item: 'Doorstep Pickup & Drop at any location in Mumbai / MMR' },
    { item: 'Experienced Local Chauffeur who acts as Tour Guide' },
    { item: '100% Sanitized and Vacuumed Vehicle before pickup' },
  ]
  const standardExclusions = [
    { item: 'Tolls & State Border Tax (as per actual Fastag receipts)' },
    { item: 'Parking fees & Monument / Temple entry tickets' },
    { item: 'Personal food, water & boating / activities charges' },
  ]

  for (const [slug, tourData] of Object.entries(tourPagesData as Record<string, any>)) {
    const existing = await payload.find({
      collection: 'tours',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const heroImageFilename = tourData.heroImage ? path.basename(tourData.heroImage) : `${slug}.jpg`
    const mediaId = mediaMap[heroImageFilename] || null

    const pricing = TOUR_RATES[slug] || [
      { vehicleName: 'Maruti Swift Dzire (Sedan)', category: 'Sedan', capacity: '4 Passengers + 1 Driver', rate: '₹4,500', extraKmRate: '₹14/km', features: 'AC • Sanitized • Chauffeur Included' },
      { vehicleName: 'Maruti Ertiga (SUV)', category: 'SUV', capacity: '6 Passengers + 1 Driver', rate: '₹5,500', extraKmRate: '₹16/km', features: 'Family Comfort • Extra Boot Space' },
      { vehicleName: 'Toyota Innova Crysta', category: 'Premium SUV', capacity: '7 Passengers + 1 Driver', rate: '₹6,800', extraKmRate: '₹20/km', features: 'Luxury Reclining Seats • Top Comfort' },
      { vehicleName: 'Tempo Traveller (17 Seater)', category: 'Tempo Traveller', capacity: '17 Passengers + 1 Driver', rate: '₹12,500', extraKmRate: '₹26/km', features: 'Group Tour • Sound System' },
    ]

    const tourFaqs = [
      {
        question: `Can I customize the places visited during the ${tourData.title}?`,
        answer: 'Yes, all our tours are 100% private. You can customize the sightseeing points, start earlier or later, and spend as much time as your family desires at each spot.',
      },
      {
        question: 'Are there any hidden charges or advance cancellation fees?',
        answer: 'Zero hidden fees! Tolls and parking are payable strictly as per actual government receipts. You can modify or reschedule with 6 hours notice.',
      },
      {
        question: 'Is doorstep pickup included in Mumbai and Navi Mumbai?',
        answer: 'Yes! Doorstep pickup from anywhere in South Mumbai, Western Suburbs, Central Suburbs, Thane, or Navi Mumbai is fully included.',
      },
    ]

    const updateData: any = {
      title: tourData.title,
      slug,
      tagline: tourData.subtitle || `${tourData.title} by Private Cab`,
      duration: slug === 'mumbai-darshan' ? 'Full Day (8-10 Hours)' : 'Same Day or 2D/1N Getaway',
      startingPrice: pricing[0]?.rate?.split(' ')[0] || '₹2,499',
      heroImage: tourData.heroImage || `/assets/tours/${slug}.jpg`,
      description: tourData.subtitle || `Book private sanitized cabs with local guide-drivers for ${tourData.title}. Transparent flat rates & doorstep pickup.`,
      popular: slug === 'mumbai-darshan' || slug === 'lonavala-trip' || slug === 'alibaug-sightseeing' || slug === 'shirdi-tour',
      pricingTiers: pricing,
      inclusions: standardInclusions,
      exclusions: standardExclusions,
      tourFaqs,
      rateTableHtml: tourData.rightHtml || '',
      itineraryHtml: tourData.leftHtml || '',
    }

    if (mediaId) {
      updateData.heroImageMedia = mediaId
    }

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'tours',
        id: existing.docs[0].id,
        data: updateData,
      })
      console.log(`  ✓ Updated tour with visual CMS fields: ${tourData.title} (/${slug})`)
    } else {
      await payload.create({
        collection: 'tours',
        data: updateData,
      })
      console.log(`  + Created tour: ${tourData.title} (/${slug})`)
    }
  }

  // 4. Link Fleet vehicles to Media
  console.log('\n🚗 Linking Fleet Vehicles to Media uploads...')
  const fleetMatches = [
    { nameMatch: 'Dzire', filename: 'dzire-CAMjcjsT.jpg' },
    { nameMatch: 'Ertiga', filename: 'ertiga-Bq9MdWD-.jpg' },
    { nameMatch: 'Crysta', filename: 'innova-B7xv-cs5.jpg' },
    { nameMatch: 'Carens', filename: 'carens-CBBO8xCr.jpg' },
    { nameMatch: 'Wagon', filename: 'wagonr-Ct1Y7D7H.jpg' },
    { nameMatch: 'Traveller', filename: 'tempo-traveller.jpg' },
  ]

  for (const fm of fleetMatches) {
    const mediaId = mediaMap[fm.filename]
    if (!mediaId) continue
    const fleetCars = await payload.find({
      collection: 'fleet',
      where: { name: { contains: fm.nameMatch } },
      limit: 1,
    })
    if (fleetCars.docs.length > 0) {
      await payload.update({
        collection: 'fleet',
        id: fleetCars.docs[0].id,
        data: {
          imageMedia: mediaId,
          imageUrl: `/assets/${fm.filename}`,
        },
      })
      console.log(`  ✓ Linked vehicle ${fleetCars.docs[0].name} to media ID ${mediaId}`)
    }
  }

  // 5. Link Pages Hero Slides to Media
  console.log('\n📄 Linking Pages (Home & About) to Media uploads...')
  const homeDoc = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })

  if (homeDoc.docs.length > 0) {
    const s1Media = mediaMap['bd08021da8c244de8eafa9a4f86c4e2a30099151-CaKyNwZu.png']
    const s2Media = mediaMap['0b74c7f86c8df43750abbbe95621c390702852bc-C6i9-JQP.png']

    const updatedSlides = [
      {
        imageMedia: s1Media || undefined,
        image: '/assets/bd08021da8c244de8eafa9a4f86c4e2a30099151-CaKyNwZu.png',
        subtitle: 'Discover the City of Dreams',
        title: 'Mumbai Sightseeing Tours',
        description: "Explore Mumbai's iconic landmarks with our expert drivers who know every corner, every story, and every hidden gem of the city.",
        link: '/mumbai-darshan',
        buttonText: 'Explore Mumbai Tours',
      },
      {
        imageMedia: s2Media || undefined,
        image: '/assets/0b74c7f86c8df43750abbbe95621c390702852bc-C6i9-JQP.png',
        subtitle: 'Escape to the Hills',
        title: 'Lonavala Weekend Getaway',
        description: 'Experience the scenic beauty of Lonavala with our comfortable cabs and knowledgeable drivers who will make your hill station trip unforgettable.',
        link: '/lonavala-trip',
        buttonText: 'Book Lonavala Trip',
      },
      {
        image: 'https://images.unsplash.com/photo-1629640890590-7836d69c5237?auto=format&fit=crop&w=1080&q=80',
        subtitle: 'Seek Blessings & Peace',
        title: 'Shirdi Spiritual Journey',
        description: 'Visit the holy town of Shirdi with our reliable cab service and experienced drivers who ensure a comfortable and peaceful pilgrimage journey.',
        link: '/shirdi-tour',
        buttonText: 'Book Shirdi Tour',
      },
    ]

    await payload.update({
      collection: 'pages',
      id: homeDoc.docs[0].id,
      data: {
        slides: updatedSlides,
      },
    })
    console.log('  ✓ Updated Home page hero slider with direct media upload relations!')
  }

  const aboutDoc = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'about' } },
    limit: 1,
  })

  if (aboutDoc.docs.length > 0) {
    const bannerMedia = mediaMap['about-banner.jpg']
    const driverMedia = mediaMap['about-driver.jpg']

    await payload.update({
      collection: 'pages',
      id: aboutDoc.docs[0].id,
      data: {
        hero: {
          title: 'About Us',
          subtitle: 'Your trusted local cab partner in Mumbai',
          backgroundImageMedia: bannerMedia || undefined,
          backgroundImage: '/assets/about-banner.jpg',
        },
        aboutContent: {
          welcomeTitle: 'Welcome to CityTourCabs',
          welcomeDescription: 'We make city travel easy, affordable, and comfortable with fast doorstep pickup and drop, reliable service, and friendly professional drivers who truly care about your experience.',
          driverImageMedia: driverMedia || undefined,
          driverImage: '/assets/about-driver.jpg',
          statsYears: '12+',
          statsCustomers: '50,000+',
          statsCabs: '45+',
          statsCities: '25+',
          missionTitle: 'Our Mission & Promise',
          missionDescription: 'To deliver safe, sanitized, punctual, and transparent cab services across Mumbai, Maharashtra, and beyond.',
          fleetDescription: 'From economical sedans for city errands to premium SUVs and tempo travellers for family vacations and pilgrimage tours.',
        },
      },
    })
    console.log('  ✓ Updated About Us page with direct media upload relations!')
  }

  console.log('\n🎉 Complete! All assets imported to Media Library, and all 10 Tour landing pages are now fully dynamic and visual in CMS!')
  process.exit(0)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
