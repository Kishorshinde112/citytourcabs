# 📋 Project Handover & Work Summary: City Tour Cabs

> **🚨 MANDATORY FIRST STEP FOR ANY AGENT OR DEVELOPER**:  
> **ALWAYS sync with GitHub before doing ANY work!**  
> Run the following commands immediately upon resuming:  
> ```bash
> git fetch origin main
> git status
> git pull origin main
> ```  
> If the local branch is behind remote commits, **DO NOT** make edits or push before pulling, or you risk overwriting active work and live tracking configurations.

---

## 1. Quick Project Status & Credentials

- **Live Production Domain**: `https://citytourcabs.in`
- **GitHub Repository**: [github.com/Kishorshinde112/citytourcabs](https://github.com/Kishorshinde112/citytourcabs) (`origin/main`)
- **Local Dev Server**: `http://localhost:3000` (run `npm run dev -- -p 3000`)
- **Admin CMS Dashboard**: `http://localhost:3000/admin`
  - **Admin Accounts**:
    - `admin@citytourcabs.in` | Password: `CityTourCabs@2026!`
    - `citytourcabs8@gmail.com` | Password: `CityTourCabs@2026!`
- **Active Database**: **Supabase PostgreSQL** via IPv4 Pooler
  - Connection: `aws-0-ap-south-1.pooler.supabase.com:5432/postgres` (managed securely via `DATABASE_URI` in `.env`).
  - Switched from the historical SQLite archive (`data/citytourcabs.db`) to clean live PostgreSQL.

---

## 2. Key Accomplishments & What Was Done

### A. Mumbai Darshan Page & Rate Card Restructure
- Restructured the Mumbai Darshan tour page (`src/app/(site)/tours/mumbai-darshan/page.tsx` & `MumbaiDarshanClient.tsx`) to match the clean, user-friendly layout of reference sites (`citycabs24.com` & `citytourcabs.com`).
- Preserved existing brand colors and footer.
- Added structured rate table (`src/components/sections/MumbaiDarshanRateTable.jsx` & `src/data/mumbaiDarshanRates.js`) with 8hr/80km, 10hr/100km, 12hr/120km packages and transparent vehicle pricing.
- Integrated **Kia Carens (MUV 7+1)** across `fleetData.js`, rate tables, and modal dropdowns.
- Sized the Quick Enquiry modal (`QuickBookModal.jsx`) cleanly to `max-w-[420px]` with "Submit Enquiry" CTA and auto-filled trip types.

### B. Scroll Reveal & Lazy Loading Animations
- Built reusable transition components:
  - `src/components/common/ScrollReveal.tsx`: Handles scroll-triggered fade/slide animations matching `citytourcabs.com`.
  - `src/components/common/LazyOnScroll.tsx`: On-demand section mounting.
- Applied smooth reveal animations across:
  - Fleet cards (with skeleton loading states)
  - Tour packages
  - Mumbai Darshan rate cards
  - Why Choose Us section
  - Gallery and Testimonials sections

### C. Enquiry Standardization & Route Guard
- **Spelling Standard**: Standardized 100% on British/Indian English **"Enquiry"** across routes, badges, and copy:
  - New canonical route: `/enquiry-confirmed` (`src/app/(site)/enquiry-confirmed/page.tsx` & `EnquiryConfirmedClient.tsx`).
  - Completely deleted the legacy duplicate `/inquiry-confirmed` directory.
  - Added permanent `308` redirect in `next.config.mjs` from `/inquiry-confirmed` to `/enquiry-confirmed`.
- **Direct-Access Route Guard**:
  - Implemented client-side route guards on both `/enquiry-confirmed` and `/booking-confirmed`.
  - If a user directly types the URL without submitting an enquiry form (i.e. no valid `id`), they are **immediately redirected to `/`** (Home page) with a clean loading spinner, preventing empty "Thank You" screens from appearing.

### D. Unified Google Analytics 4 & Google Ads Conversion Tracking
- **Single-Load Architecture (`src/app/(site)/layout.tsx`)**:
  - Loads Google Tag library (`gtag.js`) **once** via Next.js `<Script strategy="afterInteractive" />` to protect Core Web Vitals and PageSpeed:
    - **Google Analytics 4 Measurement ID**: `G-E6E794WM68`
    - **Google Ads Tag ID**: `AW-18526387794`
- **Official Conversion Label (`src/lib/analytics.ts`)**:
  - Configured the required Google Ads conversion label: `GQMOCJ-eoaMdENL8ilJF`.
  - `send_to` dispatches to: `'AW-18526387794/GQMOCJ-eoaMdENL8ilJF'`.
  - Dispatches GA4 recommended `'generate_lead'` event with `transaction_id`, currency (`INR`), and tour details.
- **5-Layer Duplicate Protection**:
  1. **Route Guard**: Direct visits without reference IDs bounce to `/` before any tracking runs.
  2. **`sessionStorage` Latch**: `google_lead_tracked_${enquiryId}` ensures refreshing `/enquiry-confirmed` never fires duplicate conversions.
  3. **React Double-Mount Latch**: `useRef` prevents React StrictMode/hydration from running tracking code twice.
  4. **Google Server Deduplication**: Google Ads and GA4 use `transaction_id: enquiryId` to automatically discard duplicate events.
  5. **Account Setting**: Configured for "Count: One" (lead generation best practice).

---

## 3. Project File Guide

| Path | Purpose |
| :--- | :--- |
| `src/lib/analytics.ts` | Centralized GA4 & Google Ads conversion tracking with deduplication |
| `src/app/(site)/layout.tsx` | Site root layout with unified gtag.js loader & metadata |
| `src/app/(site)/enquiry-confirmed/` | Enquiry confirmation page with route guard & conversion triggers |
| `src/app/(site)/booking-confirmed/` | Booking confirmation page with route guard |
| `src/app/(site)/tours/mumbai-darshan/` | Restructured Mumbai Darshan page |
| `src/components/common/ScrollReveal.tsx` | Scroll reveal animation wrapper |
| `src/components/common/LazyOnScroll.tsx` | Lazy loading wrapper |
| `src/components/modals/QuickBookModal.jsx` | Quick Enquiry & Booking modal with validation |
| `src/data/fleetData.js` | Fleet vehicles and specifications (Kia Carens included) |
| `src/data/mumbaiDarshanRates.js` | Mumbai Darshan pricing tiers and packages |
| `next.config.mjs` | Next.js configuration and 308 redirects |

---

## 4. Verification & Testing Checklist

Before pushing new changes, always verify:
1. `npm run typecheck` &rarr; Must exit with 0 errors (`tsc --noEmit`).
2. `npm test` &rarr; All 9 security and booking validation tests must pass.
3. `npm run build` &rarr; Next.js standalone production build must compile and optimize cleanly.
4. Git Secrets check &rarr; Ensure `.env` is never staged or pushed.
