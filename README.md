# Clovia - Care Staff Marketplace

A platform connecting care homes with self-employed care staff for short-term cover.

## What We're Building

- **Care homes** post shifts when they need cover
- **Care workers** browse and apply for shifts
- **We** take a 15% introduction fee per shift

## Status: Phase 1 - Core Implementation Complete

| Milestone | Target |
|-----------|--------|
| MVP | End of April 2026 |
| Monetization | End of December 2026 |

See [ROADMAP.md](./ROADMAP.md) for full product roadmap.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Validation**: Zod
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)
- **Payments**: Stripe Connect (Phase 4)

## Features Implemented

### For Care Staff
- Registration and profile creation
- Browse available shifts with filters (location, role, shift type)
- View shift details and apply
- Dashboard with booking status tracking
- Rating and review system

### For Care Homes
- Registration with CQC details
- Post shifts with detailed requirements
- Review applicants and confirm bookings
- Dashboard with shift management
- Staff rating system

### Core Database Models
- Users (with role-based access)
- CareStaff profiles (qualifications, DBS verification, availability)
- CareHome profiles (CQC details, specializations)
- Shifts (day, night, long day, twilight, sleep-in, waking night)
- Bookings with status tracking
- Reviews, Messages, Notifications

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and NEXTAUTH_SECRET

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login & Register pages
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth & registration
│   │   ├── bookings/     # Booking management
│   │   └── shifts/       # Shift CRUD
│   ├── dashboard/        # User dashboards
│   │   ├── care-home/    # Care home management
│   │   └── staff/        # Care staff management
│   └── shifts/           # Public shift browsing
├── components/           # Reusable components
├── lib/                  # Utilities (auth, db)
├── providers/            # Context providers
└── generated/            # Prisma client
prisma/
└── schema.prisma         # Database schema
```

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/clovia"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

## Deployment

Deploy on [Vercel](https://vercel.com):

1. Connect your GitHub repository
2. Add environment variables
3. Deploy

## License

Private - All rights reserved
