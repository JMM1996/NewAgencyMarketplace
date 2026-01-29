# NewAgencyMarketplace - Product Roadmap

> **Guiding Principle**: Ship early, learn fast. Each phase should deliver real value to users before moving to the next.

---

## 🎯 Vision Statement

**Connect care homes needing short-term cover with self-employed care staff, quickly and reliably.**

We're building an introductory platform - we connect the two parties, they work directly together, and we take a 15% fee per shift from the care home.

---

## 📊 Business Model

| Aspect | Detail |
|--------|--------|
| **Supply side** | Self-employed care staff seeking flexible shifts |
| **Demand side** | Care homes needing short-term/emergency cover |
| **Revenue** | 15% flat fee per shift, paid by care home |
| **Relationship** | Introductory - we connect, they contract directly |

---

## 🗓️ Timeline Overview

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Phase 0: Foundation | Early Feb 2026 | 🟡 In Progress |
| Phase 1: MVP | **End of April 2026** | ⚪ Not Started |
| Phase 2: Validation | June 2026 | ⚪ Not Started |
| Phase 3: Engagement | Sept 2026 | ⚪ Not Started |
| Phase 4: Monetization | **End of December 2026** | ⚪ Not Started |

---

## 📈 Progress Tracker (Quick View)

**Last Updated**: 2026-01-29 by Claude

### MVP Features (9 total)
```
Auth & Profiles     [____] 0/4
Shift Flow          [____] 0/5
─────────────────────────────
Total               [____] 0/9
```

### Current Sprint Focus
- Phase 0: Setting up project scaffold and database schema

### Blockers
- None currently

### Recent Completions
- Roadmap created and approved
- Tech stack confirmed (Next.js, Supabase, Vercel)
- Business model defined (15% per shift)

---

## Phase 0: Foundation (Current)
**Target**: Early February 2026
**Goal**: Define scope and set up technical foundation.

### Decisions Needed
- [x] Define target user personas ✓ Care staff + Care homes
- [x] Define core value proposition ✓ Fast, reliable short-term cover
- [x] Define revenue model ✓ 15% per shift from care home
- [x] Choose tech stack ✓ Next.js + Supabase + Vercel
- [x] Define MVP feature cut-off ✓ See Phase 1 scope

### Deliverables
- [x] Roadmap document
- [ ] Technical architecture confirmed
- [ ] Project scaffold with basic tooling
- [ ] Database schema design

---

## Phase 1: MVP 🎯
**Target**: End of April 2026 (~3 months)
**Goal**: Can a care home find and book a care worker for a shift?

### User Personas

**Care Worker (Supply)**
- Self-employed carer seeking flexible work
- Needs: Find shifts, show availability, get booked

**Care Home (Demand)**
- Needs last-minute or planned cover
- Needs: Post shifts, find qualified staff, book quickly

### Core Features (ONLY these - nothing else)

**Authentication & Profiles**
- [ ] Sign up / login (email + password)
- [ ] Two user types: Care Worker, Care Home
- [ ] Care Worker profile: name, location, experience summary, availability
- [ ] Care Home profile: name, location, contact details

**Shift Flow (The Core Loop)**
- [ ] Care Home can post a shift (date, time, hourly rate, requirements)
- [ ] Care Workers can browse available shifts (location-filtered)
- [ ] Care Worker can express interest / apply for shift
- [ ] Care Home can view applicants and accept one
- [ ] Both parties receive confirmation (email)

**That's it. Nothing else for MVP.**

### What We're NOT Building in MVP
| Feature | Why Not | Revisit |
|---------|---------|---------|
| Payment processing | Can invoice manually initially | Phase 4 |
| In-app messaging | Email/phone works for MVP | Phase 3 |
| Reviews/ratings | Need volume first | Phase 3 |
| DBS verification system | Manual check initially | Phase 2 |
| Mobile app | Responsive web is enough | 2027 |
| Admin dashboard | Manual DB queries initially | Phase 2 |
| Advanced search/filters | Basic location filter only | Phase 2 |
| Automated matching | Manual browsing first | Phase 3 |
| Calendar integrations | Nice to have, not must have | Phase 3 |

### MVP Success Metrics
- [ ] Can a care home post a shift?
- [ ] Can a care worker find and apply for it?
- [ ] Can they successfully connect?
- [ ] Would they use it again? (qualitative feedback)

### MVP "Done" Criteria
- 5 care homes can post shifts
- 10 care workers can browse and apply
- At least 3 successful shift bookings completed
- Core loop works without manual intervention

---

## Phase 2: Validation
**Target**: June 2026
**Goal**: Prove product-market fit with real usage data.

### Unlock Criteria
- MVP is live and functioning
- At least 10 completed shift bookings

### Features (Candidates - will prioritize based on MVP feedback)
- [ ] Enhanced profiles (qualifications, certifications, work history)
- [ ] Basic verification status (DBS check uploaded, we verify manually)
- [ ] Improved search and filtering (shift type, pay range, distance)
- [ ] Simple admin dashboard (see all users, shifts, bookings)
- [ ] Basic analytics (how many shifts posted, filled, etc.)

### Success Metrics
- Number of care homes actively posting
- Number of care workers with complete profiles
- Shift fill rate (% of posted shifts that get booked)
- Repeat usage (same care home posts multiple shifts)

---

## Phase 3: Engagement
**Target**: September 2026
**Goal**: Increase platform stickiness and trust.

### Unlock Criteria
- 50+ completed bookings
- Evidence of repeat usage

### Features (Candidates - prioritize based on Phase 2 data)
- [ ] Reviews and ratings (after shift completion)
- [ ] In-app messaging
- [ ] Favorite workers / preferred homes
- [ ] Verification badges (enhanced trust signals)
- [ ] Shift history and rebooking
- [ ] Notifications (shift updates, new opportunities)

---

## Phase 4: Monetization 💰
**Target**: End of December 2026
**Goal**: Implement the 15% fee and payment processing.

### Unlock Criteria
- 200+ completed bookings
- Clear evidence of value (users would pay)

### Features
- [ ] Payment integration (Stripe Connect likely)
- [ ] Automated invoicing to care homes
- [ ] 15% fee calculation and collection
- [ ] Care worker payout tracking
- [ ] Financial reporting / dashboard

### Revenue Model Implementation
```
Shift hourly rate: £15/hour
Shift duration: 8 hours
Shift value: £120

Care home pays: £120 + 15% = £138
Platform fee: £18
Care worker receives: £120 (paid directly or via platform)
```

---

## 🚫 Parking Lot (Good ideas, but NOT NOW)

| Feature | Why Deferred | Revisit When |
|---------|--------------|--------------|
| Mobile native app | Responsive web sufficient | 2027 |
| Automated DBS checking via API | Manual works at scale we'll have | When 500+ workers |
| Timesheet/clock-in system | Out of scope for intro model | If we pivot to managed |
| Insurance provision | Complex, not core | Phase 4+ |
| Training/certification marketplace | Different product | Never (stay focused) |
| Multi-location care home accounts | Edge case initially | Phase 3 if demanded |
| Agency accounts (posting for multiple homes) | Changes the model | Evaluate in 2027 |

---

## ⚠️ Compliance Considerations

The care industry is regulated. We need to be aware of:

| Requirement | Our Approach (MVP) | Future |
|-------------|-------------------|--------|
| DBS checks | Workers self-declare, homes verify | Phase 2: Upload + manual verify |
| Right to work | Self-declaration | Phase 2: Document upload |
| Qualifications | Profile field, not verified | Phase 2: Verification |
| Insurance | Workers must have own | Clear in T&Cs |
| Self-employed status | Clear introductory model, not employment | Legal review pre-Phase 4 |

**Important**: We are an *introductory* platform. We connect parties. The contract is between care home and care worker directly. This is critical for our business model.

---

## Tech Stack (Confirmed)

| Layer | Choice | Who Leads |
|-------|--------|-----------|
| **Framework** | Next.js 14+ (App Router) | You |
| **Language** | TypeScript | You |
| **Backend/DB/Auth** | Supabase (PostgreSQL + Auth + Storage) | You |
| **Hosting** | Vercel | You |
| **Payments** | Stripe Connect | You (Phase 4) |
| **Version Control** | GitHub | You |
| **Styling** | Tailwind CSS | Claude fills gap |
| **Email** | Resend (transactional emails) | Claude fills gap |
| **Forms/Validation** | React Hook Form + Zod | Claude fills gap |
| **UI Components** | shadcn/ui (Radix-based) | Claude fills gap |
| **Date/Time** | date-fns | Claude fills gap |
| **Maps/Location** | TBD (for location filtering) | Claude fills gap |

### Where I'll Fill Gaps

| Area | What I'll Handle |
|------|------------------|
| **UI/UX patterns** | Component structure, responsive design, accessibility |
| **Database schema** | Table design, relationships, RLS policies for Supabase |
| **Form handling** | Validation logic, error states, user feedback |
| **Email templates** | Transactional email content and triggers |
| **Business logic** | Shift matching, application flow, status management |
| **Type definitions** | TypeScript interfaces, Supabase types |
| **Testing strategy** | What to test, how to structure tests |
| **Security** | Input sanitization, auth guards, data access patterns |

---

## Working Agreements

### Before Adding Any Feature, Ask:
1. Does this help a care home book a care worker faster?
2. Can we launch MVP without it?
3. Are we adding it because users asked, or because we think it's cool?
4. Does it need to exist before we have 100 users?

### Red Flags (Stop and Discuss)
- "While we're at it, let's also..."
- "Competitors have this feature..."
- "What if a user wants to..."
- Building for hypothetical edge cases
- Adding "just one more thing" before launch

### My Role (Business Manager)
- Keep us focused on the current phase
- Push back on scope creep
- Ensure we ship before we perfect
- Track progress against timeline
- Remind us what we agreed NOT to build

---

## Changelog

| Date | Change | Reason |
|------|--------|--------|
| 2026-01-28 | Initial roadmap created | Project kickoff |
| 2026-01-28 | Updated with care staffing context | Defined business model |
| 2026-01-28 | Added timeline: MVP Apr, Monetized Dec | Set concrete deadlines |

