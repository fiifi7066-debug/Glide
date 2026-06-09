# Glide — Ride Hailing & Delivery

A full-stack ride-hailing and package delivery web application built with **Next.js 14**, **React 18**, **Prisma**, **Zustand**, **Leaflet**, and **Tailwind CSS**. The app features a dark blue theme, real interactive maps, and role-based workflows for both riders and drivers.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Data Model](#data-model)
- [API Reference](#api-reference)
- [Auth Flow](#auth-flow)
- [Matching Engine](#matching-engine)
- [State Management](#state-management)
- [Map Integration](#map-integration)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 (App Router) | Full-stack React framework with server components & API routes |
| **UI** | React 18 + TypeScript | Component-based user interface |
| **Styling** | Tailwind CSS 3 | Utility-first CSS with custom dark theme & animations |
| **Database** | SQLite + Prisma 5 | Lightweight relational DB with type-safe ORM |
| **Auth** | bcryptjs + jsonwebtoken | Password hashing & JWT-based auth with httpOnly cookies |
| **State** | Zustand 5 | Lightweight global state management |
| **Maps** | Leaflet 1.9 + react-leaflet 4 | Open-source map rendering with CartoDB dark tiles |
| **Icons** | react-icons (Feather) | Icon library |

---

## Features

### Rider Mode
- Register/login with email & password (password visibility toggle)
- Book rides by specifying pickup and dropoff locations
- Request package deliveries with parcel description & weight
- View real-time trip/delivery status with live map tracking
- Rate drivers (1–5 stars with comments)
- Make payments (Credit Card, Mobile Money, Cash)
- View ride & delivery history with filters
- Edit profile and manage saved locations

### Driver Mode
- Toggle online/offline availability
- Receive and accept ride & delivery requests
- Start and complete trips with GPS location updates
- View pending requests sorted by distance & score
- Track earnings via completed trips count
- Update current location (simulated GPS)

### Map (Ghana)
- Interactive map at `/map` with 36 locations across all 16 regions of Ghana
- Color-coded location categories: Capital, City, Landmark, Nature, Coastal
- Category filter buttons and clickable location cards with fly-to navigation
- Informative popups with region, coordinates, and descriptions

### UI/UX
- Dark blue theme with glassmorphism cards and gradient buttons
- Page-transition animations (fade-in, slide-up, scale-in)
- Micro-interactions (hover effects, glow, shimmer, pulse)
- Fully responsive design (mobile hamburger menu)

---

## Architecture

```
Client (Browser)                  Server (Next.js)                Database
     │                                │                             │
     │  ┌─────────────────────┐       │                             │
     │  │   React App         │       │                             │
     │  │  (Pages/Components) │       │                             │
     │  │  Zustand Store      │──HTTP──►  API Routes                │
     │  │  Leaflet Map        │       │  (/api/auth/*)              │
     │  └─────────────────────┘       │  (/api/trips/*)             │
     │                                │  (/api/deliveries/*)        │
     │                                │  (/api/drivers/*)           │
     │                                │  (/api/matching/*)          │
     │                                │  (/api/payments/*)          │
     │                                │  (/api/ratings/*)           │
     │                                │  (/api/users/*)             │
     │                                │         │                    │
     │                                │  ┌──────▼──────┐            │
     │                                │  │   Prisma    │──────────►  SQLite
     │                                │  │   (ORM)     │            │
     │                                │  └─────────────┘       prisma/dev.db
```

**Key design decisions:**
- API routes run server-side with direct Prisma access (no external API calls)
- JWT stored in httpOnly cookies (secure, not accessible via JS)
- Leaflet dynamically imported to avoid SSR `window is not defined` errors
- In-memory Zustand store (not persisted) — data fetched from API on mount
- All GPS coordinates are simulated (Accra, Ghana mock data)

---

## Data Model

The database uses **7 models** with the following relationships:

```
User ──┬── Driver (1:1)
       │
       └── Rider (1:1)

Driver ──┬── Trip (1:N)
         └── Delivery (1:N)

Rider ──┬── Trip (1:N)   [as rider]
        └── Delivery (1:N) [as sender]

Trip ──┬── Payment (1:1)
       └── Rating (1:N)

Delivery ──┬── Payment (1:1)
           └── (no direct rating)

Rating ──┬── raterId → User
         └── rateeId → User
```

### Models

**User** — Core identity
| Field | Type | Notes |
|-------|------|-------|
| id | String (CUID) | Primary key |
| name | String | |
| email | String | Unique |
| password | String | bcrypt hashed |
| phone | String? | Optional |
| role | String | "RIDER" \| "DRIVER" (default "RIDER") |
| avatar | String? | |

**Driver** — Driver-specific profile
| Field | Type | Notes |
|-------|------|-------|
| id | String (CUID) | Primary key |
| userId | String | FK → User (unique) |
| licenseNumber | String | |
| vehicleModel | String | |
| vehicleColor | String | |
| licensePlate | String | |
| isAvailable | Boolean | Default true |
| currentLat | Float? | GPS coordinate |
| currentLng | Float? | GPS coordinate |
| rating | Float | Default 5.0 |
| totalTrips | Int | Default 0 |

**Rider** — Rider-specific profile
| Field | Type | Notes |
|-------|------|-------|
| id | String (CUID) | Primary key |
| userId | String | FK → User (unique) |
| paymentMethod | String? | |
| savedLocations | String? | |

**Trip** — Ride-hailing trips
| Field | Type | Notes |
|-------|------|-------|
| id | String (CUID) | Primary key |
| riderId | String | FK → Rider |
| driverId | String? | FK → Driver |
| pickupLat/Lng | Float | Coordinates |
| dropoffLat/Lng | Float | Coordinates |
| pickupAddress | String | |
| dropoffAddress | String | |
| status | String | See lifecycle below |
| fare | Float | GHS |
| distance | Float | km |
| duration | Int | minutes |
| startedAt | DateTime? | |
| completedAt | DateTime? | |
| createdAt | DateTime | Auto |

**Delivery** — Package delivery
| Field | Type | Notes |
|-------|------|-------|
| id | String (CUID) | Primary key |
| senderId | String | FK → Rider |
| driverId | String? | FK → Driver |
| pickupLat/Lng | Float | Coordinates |
| dropoffLat/Lng | Float | Coordinates |
| pickupAddress | String | |
| dropoffAddress | String | |
| parcelDescription | String | |
| parcelWeight | Float? | |
| status | String | See lifecycle below |
| fare | Float | GHS |
| distance | Float | km |
| duration | Int | minutes |
| completedAt | DateTime? | |
| createdAt | DateTime | Auto |

**Payment** — Payment records
| Field | Type | Notes |
|-------|------|-------|
| id | String (CUID) | Primary key |
| tripId | String? | FK → Trip (unique) |
| deliveryId | String? | FK → Delivery (unique) |
| amount | Float | |
| method | String | "CREDIT_CARD" \| "MOBILE_MONEY" \| "CASH" |
| status | String | "PENDING" \| "COMPLETED" \| "FAILED" |
| transactionId | String | Auto-generated UUID |
| createdAt | DateTime | Auto |

**Rating** — Trip ratings
| Field | Type | Notes |
|-------|------|-------|
| id | String (CUID) | Primary key |
| tripId | String | FK → Trip |
| raterId | String | FK → User |
| rateeId | String | FK → User |
| score | Int | 1–5 |
| comment | String? | |
| createdAt | DateTime | Auto |

### Status Lifecycles

**Ride:** `REQUESTED` → `ACCEPTED` → `STARTED` → `COMPLETED` | `CANCELLED`

**Delivery:** `REQUESTED` → `ACCEPTED` → `PICKED_UP` → `IN_TRANSIT` → `DELIVERED` | `CANCELLED`

---

## API Reference

All authenticated endpoints read JWT from the `glide_token` httpOnly cookie (set on login/register). Protected endpoints return **401** if unauthenticated.

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create user + driver/rider profile, returns JWT cookie |
| POST | `/api/auth/login` | No | Validate credentials, returns JWT cookie |
| POST | `/api/auth/logout` | Yes | Clear JWT cookie |
| GET | `/api/auth/me` | Yes | Get current authenticated user |

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/profile` | Yes | Get full profile with driver/rider data |
| PATCH | `/api/users/profile` | Yes | Update name, phone, avatar |

### Trips

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/trips/request` | Yes (Rider) | Create a new trip request |
| GET | `/api/trips/active` | Yes | Get current active trip |
| GET | `/api/trips/history` | Yes | Get all past trips |
| PATCH | `/api/trips/:id/accept` | Yes (Driver) | Accept a trip request |
| PATCH | `/api/trips/:id/start` | Yes (Driver) | Start an accepted trip |
| PATCH | `/api/trips/:id/complete` | Yes (Driver) | Complete a started trip |
| PATCH | `/api/trips/:id/cancel` | Yes | Cancel an active trip |

### Deliveries

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/deliveries/request` | Yes (Rider) | Create a new delivery request |
| GET | `/api/deliveries/active` | Yes | Get current active delivery |
| GET | `/api/deliveries/history` | Yes | Get all past deliveries |
| PATCH | `/api/deliveries/:id/accept` | Yes (Driver) | Accept a delivery request |
| PATCH | `/api/deliveries/:id/pickup` | Yes (Driver) | Confirm package pickup |
| PATCH | `/api/deliveries/:id/deliver` | Yes (Driver) | Complete delivery |
| PATCH | `/api/deliveries/:id/cancel` | Yes | Cancel an active delivery |

### Drivers

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/drivers/nearby` | Yes | Find drivers within radius (query: `lat`, `lng`, `radius`) |
| PATCH | `/api/drivers/location` | Yes (Driver) | Update GPS location |
| GET | `/api/drivers/:id` | Yes | Get driver details |

### Matching

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/matching/find` | Yes | Score and rank nearby drivers for a pickup location |

### Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payments/process` | Yes | Process payment for trip/delivery |
| GET | `/api/payments/:id` | Yes | Get payment details |

### Ratings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/ratings` | Yes | Create rating for a trip |
| GET | `/api/ratings` | Yes | Get ratings (query: `userId`) |

---

## Auth Flow

1. **Registration** (`POST /api/auth/register`)
   - Password hashed with bcrypt (12 rounds)
   - User + Driver or Rider profile created in a Prisma transaction
   - JWT generated with 7-day expiry, stored in httpOnly cookie (`glide_token`)
   - User data returned to client

2. **Login** (`POST /api/auth/login`)
   - Email looked up, password verified with bcrypt.compare
   - JWT generated, cookie set
   - User data returned

3. **Server-side verification** (`getAuthUser()`)
   - Reads `glide_token` cookie from the request
   - Verifies JWT signature and expiry
   - Confirms user exists in database
   - Returns user object or null

4. **Client-side session**
   - Zustand store's `setUser()` called on login/register response
   - `isDriver` derived from `user.role === "DRIVER"`
   - Navbar conditionally renders auth-dependent links
   - On page load, `fetch("/api/auth/me")` restores session

---

## Matching Engine

File: `src/lib/matching.ts`

The scoring algorithm ranks available drivers for a given pickup location:

### Score Components

```
Total Score = DistanceScore + RatingScore + ExperienceScore + AvailabilityScore
```

| Component | Formula | Max |
|-----------|---------|-----|
| **Distance** | `max(0, 100 - distanceKm \* 10)` | 100 |
| **Rating** | `rating \* 10` | 50 |
| **Experience** | `min(20, totalTrips \* 2)` | 20 |
| **Availability** | `50` if available, `-200` if not | 50 |

### Functions

- **`findNearbyDrivers(lat, lng, radius?)`** — Filters available drivers within Haversine distance
- **`scoreDriver(driver, pickup)`** — Computes composite score for a single driver
- **`findBestMatch(drivers, pickup, maxResults?)`** — Scores all drivers, returns top N with driverId, score, distance, ETA

### Geo Utilities (`src/lib/geo.ts`)

- **`haversineDistance(lat1, lng1, lat2, lng2)`** — Great-circle distance in km
- **`calculateFare(distanceKm, durationMin)`** — `GHS 5.0 base + 1.5/km + 0.25/min`
- **`estimateDuration(distanceKm)`** — `ceil(distance / 30 km/h \* 60)` minutes
- **`isWithinRadius(lat1, lng1, lat2, lng2, radiusKm)`** — Boolean check

---

## State Management

Uses **Zustand 5** (`src/lib/store.ts`) with an in-memory store:

| State | Type | Default | Purpose |
|-------|------|---------|---------|
| `user` | `AuthUser \| null` | `null` | Current authenticated user |
| `isDriver` | `boolean` | `false` | Role flag (set when user is set) |
| `activeTrip` | `TripData \| null` | `null` | Current ride in progress |
| `activeDelivery` | `DeliveryData \| null` | `null` | Current delivery in progress |
| `nearbyDrivers` | `NearbyDriver[]` | `[]` | Drivers within search distance |
| `driverLocation` | `{lat, lng} \| null` | `null` | Driver's current GPS position |
| `tripHistory` | `TripData[]` | `[]` | Past ride history |
| `deliveryHistory` | `DeliveryData[]` | `[]` | Past delivery history |
| `driverData` | `DriverData \| null` | `null` | Full driver profile |
| `pendingRequests` | `TripData[]` | `[]` | Ride requests for driver |
| `pendingDeliveries` | `DeliveryData[]` | `[]` | Delivery requests for driver |

Each field has a corresponding setter. Components access state via `useStore()`.

---

## Map Integration

Leaflet is used throughout the app for location visualization.

### Implementation Details
- **Dynamic import** — Leaflet is imported inside `useEffect` via `await import("leaflet")` to avoid SSR errors
- **Dark tiles** — CartoDB dark tile layer (`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`)
- **Custom markers** — DivIcon objects with inline SVG: green `P` (pickup), red `D` (dropoff), blue car (driver)
- **Dark-themed controls** — CSS-overridden Leaflet zoom controls and popups for theme consistency
- **Map page** (`/map`) — Full-viewport map of Ghana with 36 locations across all 16 regions, color-coded by category (Capital/City/Landmark/Nature/Coastal), filterable, with click-to-navigate cards

### Map Component Locations
- `src/components/MapView.tsx` — Reusable map with pickup/dropoff/driver markers
- `src/components/LiveTracker.tsx` — Integrated map with trip status overlay
- `src/app/map/page.tsx` — Ghana exploration map with filters

---

## Project Structure

```
Glide/
├── .env                          # Environment variables (gitignored)
├── .gitignore
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.js             # PostCSS + Tailwind
├── tailwind.config.ts            # Tailwind theme (colors, animations)
├── tsconfig.json                 # TypeScript configuration
├── prisma/
│   ├── schema.prisma             # Database schema (7 models)
│   └── dev.db                    # SQLite database file (gitignored)
└── src/
    ├── types/
    │   └── index.ts              # All TypeScript type definitions
    ├── lib/
    │   ├── auth.ts               # JWT & password utilities
    │   ├── api-response.ts       # Response helpers (success/error)
    │   ├── geo.ts                # Haversine distance, fare calc
    │   ├── matching.ts           # Driver scoring & matching
    │   ├── prisma.ts             # Prisma singleton client
    │   └── store.ts              # Zustand global store
    ├── components/
    │   ├── Navbar.tsx            # Sticky navigation bar
    │   ├── MapView.tsx           # Leaflet map with markers
    │   ├── BookingForm.tsx       # Ride booking form
    │   ├── DeliveryForm.tsx      # Package delivery form
    │   ├── DriverCard.tsx        # Nearby driver display
    │   ├── RideCard.tsx          # Trip status card
    │   ├── DeliveryCard.tsx      # Delivery status card
    │   ├── LiveTracker.tsx       # Real-time trip tracker
    │   ├── PaymentModal.tsx      # Payment processing modal
    │   └── RatingModal.tsx       # Rating submission modal
    └── app/
        ├── layout.tsx            # Root layout (Navbar + children)
        ├── globals.css           # Tailwind, animations, utilities
        ├── page.tsx              # Landing page
        ├── login/
        │   └── page.tsx          # Login page
        ├── register/
        │   └── page.tsx          # Registration page
        ├── rider/
        │   └── page.tsx          # Rider dashboard
        ├── driver/
        │   └── page.tsx          # Driver dashboard
        ├── delivery/
        │   └── page.tsx          # Delivery page
        ├── history/
        │   └── page.tsx          # Trip/delivery history
        ├── profile/
        │   └── page.tsx          # User profile
        ├── map/
        │   └── page.tsx          # Ghana map explorer
        └── api/
            ├── auth/
            │   ├── register/route.ts
            │   ├── login/route.ts
            │   ├── logout/route.ts
            │   └── me/route.ts
            ├── users/
            │   └── profile/route.ts
            ├── trips/
            │   ├── request/route.ts
            │   ├── active/route.ts
            │   ├── history/route.ts
            │   └── [id]/
            │       ├── accept/route.ts
            │       ├── start/route.ts
            │       ├── complete/route.ts
            │       └── cancel/route.ts
            ├── deliveries/
            │   ├── request/route.ts
            │   ├── active/route.ts
            │   ├── history/route.ts
            │   └── [id]/
            │       ├── accept/route.ts
            │       ├── pickup/route.ts
            │       ├── deliver/route.ts
            │       └── cancel/route.ts
            ├── drivers/
            │   ├── nearby/route.ts
            │   ├── location/route.ts
            │   └── [id]/route.ts
            ├── matching/
            │   └── find/route.ts
            ├── payments/
            │   ├── process/route.ts
            │   └── [id]/route.ts
            └── ratings/
                └── route.ts
```

---

## Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/glide.git
cd glide

# Install dependencies
npm install

# Generate Prisma client and push schema
npx prisma db push

# Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**.

### For LAN Access (phone testing)

```bash
npm run dev -- -H 0.0.0.0
```

Then access the app from your phone at **http://<your-local-ip>:3000**.

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | `file:./dev.db` | SQLite database path |
| `JWT_SECRET` | Yes | — | Secret key for signing JWT tokens |

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secure-secret-here"
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npx prisma db push` | Sync database schema |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma generate` | Regenerate Prisma client |

---

## License

MIT
