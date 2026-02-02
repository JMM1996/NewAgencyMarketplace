# ROI Calculator - NewAgencyMarketplace

## Care Home Cost Savings Calculator

Use this calculator during sales calls to demonstrate specific savings for each prospect.

---

## Quick Calculator (For Live Calls)

### Step 1: Gather Their Numbers

Ask these questions during discovery:

| Question | Their Answer | Notes |
|----------|--------------|-------|
| "What do you currently pay per hour for agency HCAs?" | £_____ | Typical range: £18-25 |
| "What about agency nurses/seniors?" | £_____ | Typical range: £25-40 |
| "How many agency shifts do you use per month?" | _____ shifts | |
| "What's the average shift length?" | _____ hours | Usually 8 or 12 |

### Step 2: Calculate Their Current Spend

```
Monthly Agency Spend = (Shifts per month) × (Hours per shift) × (Hourly rate)

Example:
20 shifts × 8 hours × £20/hour = £3,200/month
```

### Step 3: Calculate NewAgencyMarketplace Cost

```
Our Cost = Worker hourly rate + 15% platform fee

If worker rate is £15/hour:
Our cost = £15 + (£15 × 0.15) = £17.25/hour

For the same 20 shifts × 8 hours:
20 × 8 × £17.25 = £2,760/month
```

### Step 4: Calculate Savings

```
Monthly Savings = Current Spend - Our Cost
£3,200 - £2,760 = £440/month

Annual Savings = Monthly × 12
£440 × 12 = £5,280/year
```

---

## Detailed ROI Spreadsheet

Copy this into Google Sheets or Excel:

### Input Section (Yellow cells - customer fills in)

| Cell | Field | Example Value |
|------|-------|---------------|
| B2 | Care Home Name | Sunny Days Care Home |
| B3 | Current agency rate (HCA) per hour | £20 |
| B4 | Current agency rate (Senior/Nurse) per hour | £28 |
| B5 | Average HCA shifts per month | 15 |
| B6 | Average Senior/Nurse shifts per month | 5 |
| B7 | Average shift length (hours) | 8 |

### Calculation Section (Auto-calculated)

| Row | Description | Formula | Example |
|-----|-------------|---------|---------|
| **Current Agency Costs** | | | |
| B10 | Monthly HCA agency cost | =B5*B7*B3 | £2,400 |
| B11 | Monthly Senior/Nurse agency cost | =B6*B7*B4 | £1,120 |
| B12 | **Total Monthly Agency Cost** | =B10+B11 | **£3,520** |
| B13 | Annual Agency Cost | =B12*12 | £42,240 |
| | | | |
| **NewAgencyMarketplace Costs** | | | |
| B16 | Suggested worker rate (HCA) | =B3*0.75 | £15 |
| B17 | Suggested worker rate (Senior) | =B4*0.75 | £21 |
| B18 | Platform fee (15%) | 15% | 15% |
| B19 | Your cost per hour (HCA) | =B16*1.15 | £17.25 |
| B20 | Your cost per hour (Senior) | =B17*1.15 | £24.15 |
| B21 | Monthly HCA cost with us | =B5*B7*B19 | £2,070 |
| B22 | Monthly Senior cost with us | =B6*B7*B20 | £966 |
| B23 | **Total Monthly Cost with Us** | =B21+B22 | **£3,036** |
| B24 | Annual Cost with Us | =B23*12 | £36,432 |
| | | | |
| **Your Savings** | | | |
| B27 | **Monthly Savings** | =B12-B23 | **£484** |
| B28 | **Annual Savings** | =B13-B24 | **£5,808** |
| B29 | **Percentage Saved** | =(B12-B23)/B12 | **13.75%** |
| | | | |
| **Worker Benefit** | | | |
| B32 | Extra earnings per HCA shift | =(B16-B3*0.6)*B7 | £24 |
| B33 | Extra earnings per Senior shift | =(B17-B4*0.6)*B7 | £33.60 |

---

## Quick Reference Tables

### Savings by Current Agency Rate (8-hour HCA shift)

| Current Agency Rate | Worker Gets (est.) | With Us (Worker + 15%) | You Save Per Shift |
|---------------------|-------------------|------------------------|-------------------|
| £18/hour | £14/hour | £16.10/hour | £15.20 |
| £20/hour | £15/hour | £17.25/hour | £22.00 |
| £22/hour | £16/hour | £18.40/hour | £28.80 |
| £24/hour | £17/hour | £19.55/hour | £35.60 |
| £25/hour | £18/hour | £20.70/hour | £34.40 |

### Monthly Savings by Volume

| Shifts/Month | At £20/hr Agency | Your Savings/Month | Annual Savings |
|--------------|------------------|-------------------|----------------|
| 10 | £1,600 | £220 | £2,640 |
| 20 | £3,200 | £440 | £5,280 |
| 30 | £4,800 | £660 | £7,920 |
| 40 | £6,400 | £880 | £10,560 |
| 50 | £8,000 | £1,100 | £13,200 |
| 75 | £12,000 | £1,650 | £19,800 |
| 100 | £16,000 | £2,200 | £26,400 |

---

## Talking Points for ROI Discussion

### Opening

> "Let me show you exactly what this could save you. You mentioned you use about [X] agency shifts per month at around £[Y] per hour..."

### During Calculation

> "So right now, you're spending roughly £[current spend] per month on agency staff."
>
> "With us, if we assume workers set their rate at around £[X] - which is actually more than they get through agencies - your cost including our 15% fee would be £[our cost]."
>
> "That's a saving of £[savings] per month, or £[annual] per year."

### Addressing "That's Not That Much"

> "I hear you - on a single shift, the savings might seem small. But it adds up. And remember, this is money you're currently giving to agency shareholders. With us, that money stays either in your pocket or goes to the workers - which means better people want to work with you."

### The Bigger Picture

> "Beyond the direct savings, think about:
> - Time saved not chasing agencies on the phone
> - Better relationships with workers who come back
> - Reduced risk of no-shows (they've chosen your shift)
> - No surprise invoice markups at month end"

---

## Proposal Template

Use this structure when sending a formal proposal:

```
COST COMPARISON PROPOSAL
========================

Prepared for: [Care Home Name]
Prepared by: [Your Name]
Date: [Date]

CURRENT SITUATION
-----------------
Monthly agency shifts: [X]
Average hourly rate: £[Y]
Estimated monthly spend: £[Z]

PROPOSED SOLUTION
-----------------
Platform: NewAgencyMarketplace
Fee structure: 15% of worker rate (transparent, no hidden costs)
Estimated monthly cost: £[A]

YOUR SAVINGS
------------
Monthly: £[B]
Annual: £[C]
Percentage: [D]%

ADDITIONAL BENEFITS
-------------------
• Build relationships with regular workers
• See profiles before accepting
• No contracts or minimums
• Fill shifts faster (hours not days)

RECOMMENDED NEXT STEP
---------------------
Sign up for a free trial with 3 shifts at 0% fee

[Contact details]
```

---

## Common Scenarios

### Scenario 1: Small Care Home (30 beds)

- **Typical agency usage:** 10-15 shifts/month
- **Current spend:** ~£2,000/month
- **Potential savings:** £200-300/month (£2,400-3,600/year)
- **Pitch angle:** "Every pound matters with tight margins"

### Scenario 2: Medium Care Home (50-70 beds)

- **Typical agency usage:** 25-40 shifts/month
- **Current spend:** ~£5,000/month
- **Potential savings:** £500-800/month (£6,000-9,600/year)
- **Pitch angle:** "That's almost enough for an extra part-time staff member"

### Scenario 3: Large Care Home (80+ beds)

- **Typical agency usage:** 50-100 shifts/month
- **Current spend:** ~£10,000+/month
- **Potential savings:** £1,000-2,000/month (£12,000-24,000/year)
- **Pitch angle:** "Significant budget impact, worth a pilot"

### Scenario 4: Care Home Group (3+ homes)

- **Typical agency usage:** 100-300 shifts/month across portfolio
- **Current spend:** £20,000-50,000/month
- **Potential savings:** £2,000-5,000/month (£24,000-60,000/year)
- **Pitch angle:** "Portfolio-wide impact, dedicated account management"

---

## Objection: "Your Rates Aren't That Different"

Sometimes the savings look smaller than expected. Here's how to handle:

1. **Check their agency rate is accurate** - Some underestimate what they actually pay
2. **Include all agency fees** - Booking fees, admin fees, holiday pay markups
3. **Factor in time savings** - What's their time worth chasing agencies?
4. **Emphasise quality** - Workers earn more, so better people join
5. **Mention the relationship** - Build a reliable bank vs random temps

> "You're right that the per-shift saving isn't huge. But there's a reason agencies charge what they do - they're taking that margin from both you AND the worker. We've built a leaner model. The savings are real, but the bigger win is building a team of people who actually want to come back."

---

*Version 1.0 - February 2026*
