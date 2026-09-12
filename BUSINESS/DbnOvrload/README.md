# DbnOvrload

Pay-at-the-till voucher + foot-traffic platform digitising Durban's Gqom and youth-culture venues.
Students unlock single-use, short-lived verification tokens that are redeemed against the venue's own
Point of Sale — **DbnOvrload never touches consumer cash**. Venues pay either a per-scan commission
(Tier 1) or a flat monthly retainer (Tier 2). Premium student membership (R49/mo) is billed via
Capitec Pay through the Stitch API.

## Monorepo layout

```
DbnOvrload/
├── backend/      Express + TypeScript + Prisma (PostgreSQL) API
│   ├── prisma/   schema.prisma + seed
│   └── src/
│       ├── config/      env loading + validation
│       ├── lib/         prisma client, TOTP, JWT, scarcity math
│       ├── middleware/  auth + error handling
│       ├── services/    Stitch payments, token engine, webhooks, clout-share
│       └── routes/      auth, voucher, token, payment, door, dashboard, seo, ugc
└── frontend/     React + Vite + Tailwind PWA
    └── src/
        ├── theme/       locked DbnOvrload colour tokens
        ├── components/  60s countdown wheel, scarcity ticker, clout-share
        ├── pages/       student voucher view, B2B owner dashboard
        └── seo/         programmatic routing + meta/JSON-LD injectors
```

## Quick start

### Backend
```bash
cd backend
cp .env.example .env          # fill in DATABASE_URL + Stitch credentials
npm install
npx prisma migrate dev --name init
npm run seed                  # optional demo data
npm run dev                   # http://localhost:4000
```

### Frontend
```bash
cd frontend
cp .env.example .env          # set VITE_API_URL
npm install
npm run dev                   # http://localhost:5173
```

## Core flows

| Flow | Endpoint(s) |
|------|-------------|
| Student unlocks a voucher (60s window) | `POST /api/vouchers/:id/unlock` |
| Till verifies the token (Track A) | `POST /api/tokens/verify` |
| Door staff manual override (Track B) | `POST /api/door/lookup`, `POST /api/door/admit` |
| Rotating entrance QR (TOTP, 60s) | `GET /api/tokens/entrance/:venueId` |
| Premium membership via Capitec Pay | `POST /api/payments/membership`, `POST /api/payments/webhook` |
| B2B owner analytics (private) | `GET /api/dashboard/:venueId` |
| Programmatic SEO data | `GET /api/seo/culture/:neighborhood/:venueSlug`, `GET /api/seo/specials/:campusSlug/:day` |
| UGC clip + energy rating | `POST /api/ugc/:venueId/clips` |
| Clout-share asset | `POST /api/cloutshare` |

## Compliance notes (read before launch)

- **Honest scarcity.** Every "only N left" / "X students just claimed" figure is computed from real
  rows (`Voucher.dailyQuantity − redeemed`, real `Scan` counts). Nothing is fabricated. Under the SA
  Consumer Protection Act, displaying false scarcity is a prohibited practice — keep it data-driven.
- **POPIA.** Phone numbers and student data require consent. `User.consentPopiaAt` records it; the
  door-lookup endpoint only returns the minimum needed to admit a student.
- **Pay-at-the-till.** Tokens carry no monetary value and cannot move money. They only prove a student
  arrived; the venue charges its own POS.
