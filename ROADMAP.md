# NewAgencyMarketplace - Product Roadmap

> **Guiding Principle**: Ship early, learn fast. Each phase should deliver real value to users before moving to the next.

---

## 🎯 Vision Statement
*[To be defined together]*

---

## Phase 0: Foundation (Current)
**Goal**: Define what we're building and set up the technical foundation.

### Decisions Needed
- [ ] Define target user personas (who are the two sides of the marketplace?)
- [ ] Define core value proposition (why would someone use this vs alternatives?)
- [ ] Choose tech stack
- [ ] Define MVP scope (ruthlessly prioritized)

### Deliverables
- [ ] This roadmap document
- [ ] Technical architecture decision
- [ ] Project scaffold with basic tooling

---

## Phase 1: MVP (Minimum Viable Product)
**Goal**: The smallest possible product that tests our core hypothesis.

### Core Features (ONLY these - nothing else)
- [ ] User authentication (sign up, login, logout)
- [ ] Agency profile creation (basic info only)
- [ ] Agency listing/discovery page
- [ ] Contact/inquiry mechanism

### What We're NOT Building Yet
- Payment processing
- Reviews/ratings
- Advanced search/filters
- Messaging system
- Admin dashboard
- Analytics
- Mobile app

### Success Metrics
- Can an agency sign up and create a profile?
- Can a potential client find and contact an agency?

---

## Phase 2: Validation
**Goal**: Get real users and validate product-market fit before adding features.

### Features (unlock ONLY after Phase 1 is live)
- [ ] Enhanced agency profiles (portfolio, case studies)
- [ ] Basic search and filtering
- [ ] Category/specialty tags

### Success Metrics
- Number of agency signups
- Number of inquiries sent
- User feedback collected

---

## Phase 3: Engagement
**Goal**: Increase stickiness and repeat usage.

*Features TBD based on Phase 2 learnings*

Potential candidates (will prioritize based on user feedback):
- Reviews and ratings
- Messaging system
- Saved/favorited agencies
- Agency verification badges

---

## Phase 4: Monetization
**Goal**: Introduce revenue model.

*Approach TBD based on what users value most*

---

## 🚫 Parking Lot (Good ideas, but NOT NOW)
These are features we've discussed but explicitly decided to defer:

| Feature | Why Deferred | Revisit When |
|---------|--------------|--------------|
| *To be added* | | |

---

## Tech Stack (Proposed)
*To be confirmed*

- **Frontend**: React/Next.js (SSR for SEO, good marketplace patterns)
- **Backend**: Node.js/Express or Next.js API routes
- **Database**: PostgreSQL (relational data fits marketplace well)
- **Auth**: NextAuth.js or Clerk
- **Hosting**: Vercel or Railway
- **Styling**: Tailwind CSS

---

## Working Agreements

### Before Adding Any Feature, Ask:
1. Does this help us validate our core hypothesis?
2. Can we launch without it?
3. Are we adding it because users asked, or because we think it's cool?

### Red Flags (Stop and Discuss)
- "While we're at it, let's also..."
- "It would be nice if..."
- "Competitors have this feature..."
- Building for hypothetical future users instead of current ones

---

## Changelog
| Date | Change | Reason |
|------|--------|--------|
| 2026-01-28 | Initial roadmap created | Project kickoff |

