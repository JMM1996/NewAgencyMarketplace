# Competitor Design Analysis

> Research compiled for NewAgencyMarketplace design decisions

---

## Major Competitors Overview

### 1. Clutch.co
- **Scale**: 200,000+ agencies, 500+ categories
- **Positioning**: Data-driven B2B research platform
- **Key differentiator**: Phone-verified client reviews
- **Trust model**: Two-tier verification (Premier & Verified badges)
- **Pricing**: Free basic listing, paid for premium placement

### 2. DesignRush
- **Scale**: 10,000+ agencies, 1M+ monthly visits
- **Positioning**: Editorially curated creative agency directory
- **Key differentiator**: Ranked/curated lists by category
- **Pricing**: $1,500 - $60,000+/year for agencies

### 3. UpCity
- **Scale**: 137,000+ monthly visits
- **Positioning**: Local-first agency discovery
- **Target**: SMBs in North America
- **Key differentiator**: Local provider emphasis

### 4. GoodFirms
- **Positioning**: Transparent ranking methodology
- **Key differentiator**: Scores based on reviews + market presence + portfolio

### 5. Sortlist
- **Positioning**: Personalized agency matching
- **Key differentiator**: Project-based matching vs browsing

---

## Design Patterns Analysis

### Navigation & Layout

| Pattern | Implementation | Why It Works |
|---------|---------------|--------------|
| **Sticky header** | Fixed top nav with blur backdrop | Always-accessible search & navigation |
| **Hamburger → full menu** | Collapsible mobile nav | Clean mobile experience |
| **Dropdown mega-menus** | Category trees with icons | Quick access to deep categories |
| **Breadcrumbs** | Category > Subcategory > Agency | Clear location awareness |

### Agency/Service Cards

**Standard card anatomy:**
```
┌─────────────────────────────────────┐
│  [Logo/Image]         [Badge: ✓]   │
│                                     │
│  Agency Name                        │
│  ★★★★☆ 4.8 (127 reviews)           │
│                                     │
│  "Tagline or specialty..."          │
│                                     │
│  📍 Location  |  💰 $5K min         │
│  🏢 10-50 employees                 │
│                                     │
│  [View Profile]  [Contact]          │
└─────────────────────────────────────┘
```

**Key card elements:**
- 16px border-radius for modern feel
- Hover scale effect (0.97-1.02 transform)
- Verification badge prominently placed
- Star rating + review count visible
- Minimum project size displayed
- Location tag for filtering context

### Search & Discovery UX

**Search bar best practices:**
- Prominent placement (hero area or sticky header)
- Autocomplete suggestions
- Spelling correction tolerance
- Support for long-tail queries
- Recent searches memory

**Filter patterns:**
| Type | Best For |
|------|----------|
| **Left sidebar** | Desktop, many filters |
| **Top horizontal bar** | Few filters, quick access |
| **Slide-out drawer** | Mobile, complex filters |
| **Sticky filter summary** | Show active filters |

**Essential filters for agency marketplace:**
- [ ] Service category/specialty
- [ ] Location (city, country, remote)
- [ ] Budget/minimum project size
- [ ] Team size
- [ ] Industry experience
- [ ] Rating threshold
- [ ] Verified only toggle

**Filter UX requirements:**
- Show result count after filtering
- "Clear all" button always visible
- Filters persist across sessions
- URL reflects filter state (shareable)

### Trust Signals & Social Proof

**Verification tiers (Clutch model):**
1. **Basic**: Claimed profile
2. **Verified**: Background check passed
3. **Premier**: High performance + verification

**Trust elements to include:**
- Verified badge on cards and profiles
- Review count and average rating
- Client logos (social proof)
- "Phone verified" or similar indicators
- Response time/rate metrics
- Years in business
- Portfolio samples

### Profile Page Structure

```
┌─────────────────────────────────────────────┐
│ HERO: Logo, Name, Tagline, CTA buttons      │
├─────────────────────────────────────────────┤
│ QUICK STATS: Rating, Reviews, Location,     │
│              Team size, Founded year        │
├─────────────────────────────────────────────┤
│ TABS: Overview | Portfolio | Reviews |      │
│       Team | Pricing                        │
├─────────────────────────────────────────────┤
│ SIDEBAR: Contact form, Quick facts,         │
│          Similar agencies                   │
└─────────────────────────────────────────────┘
```

---

## Two-Sided Platform Considerations

### For Agencies (Sellers)
- Simple onboarding with progress indicator
- Dashboard with inquiry metrics
- Profile completeness score
- Portfolio/case study upload
- Review request tools
- Analytics on profile views

### For Clients (Buyers)
- No account required to browse
- Low-friction inquiry form
- Save/favorite agencies
- Compare agencies side-by-side
- Project brief builder (optional)

---

## Mobile Design Patterns

| Desktop | Mobile Adaptation |
|---------|-------------------|
| Sidebar filters | Bottom sheet / drawer |
| Grid of cards | Single column list |
| Hover states | Tap states |
| 36px headings | 22px headings |
| Multi-column profile | Stacked sections |

**Mobile essentials:**
- Touch targets minimum 44px
- Sticky "Contact" CTA button
- Swipeable image galleries
- Collapsible sections
- Skeleton loading states

---

## Color & Typography Patterns

**Common schemes observed:**

| Platform | Primary | Accent | Background |
|----------|---------|--------|------------|
| Clutch | Dark blue | Orange | White/Gray |
| DesignRush | Black | Coral/Red | White |
| UpCity | Blue | Green | Light gray |

**Typography hierarchy:**
- Headings: Bold sans-serif (Poppins, Inter, or similar)
- Body: Regular weight, 16px base
- Metadata: Smaller, muted color

---

## Key Takeaways for NewAgencyMarketplace

### Must-Have (MVP)
1. Clean agency cards with essential info
2. Category-based browsing
3. Basic search with autocomplete
4. Simple contact/inquiry form
5. Mobile-responsive design
6. Trust indicators (even if basic)

### Differentiators to Consider
1. **Faster onboarding** than Clutch (they're known to be slow)
2. **Free for agencies** initially (DesignRush charges $1.5K+)
3. **Niche focus** if targeting specific agency type
4. **Better matching** (Sortlist-style project briefs)
5. **Transparent pricing** display

### Anti-Patterns to Avoid
- Overwhelming filter options at launch
- Requiring signup to browse
- Slow loading (kills trust)
- Inconsistent card layouts
- Hidden contact information
- Over-automated support

---

## Sources

- [G2 - Clutch Alternatives](https://www.g2.com/products/clutch-co/competitors/alternatives)
- [Clutch.co](https://clutch.co/)
- [DesignRush](https://www.designrush.com/)
- [Rigby - Marketplace UX Guide](https://www.rigbyjs.com/blog/marketplace-ux)
- [Codica - Marketplace Design Best Practices](https://www.codica.com/blog/best-practices-for-online-marketplace-design/)
- [Aspirity - Marketplace UX Design](https://aspirity.com/blog/marketplace-ux-design)
- [Pencil & Paper - Filter UX Patterns](https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-filtering)
- [UXPin - Filter UI Guide](https://www.uxpin.com/studio/blog/filter-ui-and-ux/)

---

*Document created: 2026-01-29*
