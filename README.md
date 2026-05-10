# Budenfinder

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D21.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

Budenfinder is an AI-powered rental platform built specifically for Berlin's competitive housing market. It aggregates every available listing from 15+ Berlin rental portals into one intelligent, real-time feed, matches tenants by budget, lifestyle, and legal rights, and auto-applies on their behalf — making the rental process faster, safer, and smarter.

## 🎯 Problem Solved

Berlin's rental market is one of Europe's most competitive:
- **0.3% vacancy rate** with ~250 applicants per listing
- **EUR 15.79/m² average rent** (2025) — affordability crisis
- Students and expats waste **10-20 hours/week** manually searching fragmented portals
- Non-German speakers face language and navigation barriers
- Complex paperwork (SCHUFA, income proof, cover letters) overwhelms newcomers
- **Mietpreisbremse violations** rarely flagged — tenants overpay unknowingly

## 🚀 Solution

Budenfinder provides a **3-tier SaaS platform**:

### Free Tier (€0/month)
- Full apartment search based on personalized preferences
- All Berlin apartments in one unified, real-time feed
- Basic neighborhood info & interactive map view
- Automated Mietpreisbremse compliance alerts
- ML-powered fraud detection on every listing
- Save favorites & set basic filters

### Mid Tier (€3-5/month)
- Everything in Free tier
- Daily or weekly email alerts for affordable apartments
- Alerts filtered to your exact budget & preferences
- Priority notifications for new listings
- Advanced filters: commute time, noise level, pet policy
- Neighborhood quality scoring (Kiez Score)

### Pro Tier (€6-10/month)
- Everything in Mid tier
- Upload application documents once (SCHUFA, income proof, ID)
- AI generates personalized cover letters per listing
- 1-click auto-apply to matching listings
- Application tracker with full timeline & reminders
- Rejection analysis: AI explains why + how to improve
- Tenant profile score with explainability

## 🏗️ Architecture

This is a **monorepo** with two main applications:

| App | Stack | Port | Directory |
|-----|-------|------|-----------|
| **Backend** | Fastify 5, Prisma 7, PostgreSQL, Playwright | 8080 | `backend/` |
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4, Vercel AI SDK | 3000 | `frontend/` |

### Backend Architecture
```
backend/src/
  api/{feature}/        ← Routes + Controllers (HTTP layer)
  features/{feature}/   ← Services + Types (business logic)
  database/             ← Prisma schema, client, migrations
  shared/               ← Middleware, shared types, utils
```

**Pattern**: Routes → Controllers → Services. Routes register Fastify handlers. Controllers parse/validate input. Services contain business logic and DB access.

### Frontend Architecture
```
frontend/
  app/                  ← Next.js App Router pages + API routes
  components/           ← Shared React components
  lib/                  ← Utilities, types, API client, scoring
```

**Pattern**: Pages use server components by default. Client components are opt-in with `'use client'`. API routes in `app/api/` proxy to backend or handle AI/document logic.

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js ≥21.0.0
- **Framework**: Fastify 5
- **Database**: PostgreSQL with Prisma 7 ORM
- **Scraping**: Playwright for browser automation
- **Validation**: Zod v4 with treeifyError
- **Testing**: Vitest
- **Deployment**: Railway/Fly.io

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **AI**: Vercel AI SDK, Ollama, Hugging Face
- **Maps**: Mapbox GL JS
- **Auth**: NextAuth.js v5
- **Deployment**: Vercel

### Infrastructure
- **Database**: Docker PostgreSQL (dev), Managed PostgreSQL (prod)
- **Caching**: Redis (BullMQ for job queues)
- **Storage**: AWS S3 / GCP Cloud Storage
- **Monitoring**: Application Insights

## 📦 Installation & Setup

### Prerequisites
- **Node.js** ≥21.0.0
- **Docker** (for local database)
- **Git**

> **Important**: Always use `--legacy-peer-deps` when installing due to TypeScript 6.x peer dependency conflicts.

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/budenfinder.git
   cd budenfinder
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install --legacy-peer-deps
   cp .env.template .env  # Configure environment variables
   npm run start:db      # Start PostgreSQL via Docker
   npm run dev           # Start dev server (port 8080)
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install --legacy-peer-deps
   npm run dev           # Start Next.js dev server (port 3000)
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Health check: http://localhost:8080/health

### Environment Variables

#### Backend (.env in backend/)
```bash
HOST=localhost
PORT=8080
POSTGRES_USER=immos_user
POSTGRES_PASSWORD=immos_pass
DATABASE_URL=postgresql://immos_user:immos_pass@localhost:5432/immos
DATABASE_URL_RO=postgresql://immos_user:immos_pass@localhost:5432/immos
```

#### Frontend (.env.local in frontend/)
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
OLLAMA_BASE_URL=http://localhost:11434
HUGGINGFACE_API_KEY=your_huggingface_key
```

## 🔧 Development

### Database Management
```bash
cd backend
npm run start:db     # Start Postgres container
npm run db:migrate   # Apply pending migrations
npm run db:generate  # Regenerate Prisma client
npm run db:reset     # Wipe and re-migrate (destructive)
```

### Testing
```bash
cd backend
npm run test        # Run Vitest smoke tests
```

### Key Scripts

#### Backend
| Script | Description |
|--------|-------------|
| `npm run dev` | Run in dev mode with ts-node |
| `npm run build` | Compile TypeScript to dist/ |
| `npm run start` | Run compiled output |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run format` | Prettier format |

#### Frontend
| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | ESLint check |

## 📚 API Documentation

### Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Health check |
| GET | `/api/v1/listings` | List all listings (paginated) |
| GET | `/api/v1/listings/:id` | Single listing by ID |
| GET | `/api/v1/scrapers/jobs` | List scraper job history |
| POST | `/api/v1/scrapers/:sourceId/run` | Trigger a scraper run |

### Authentication
- Google OAuth + Email/Password via NextAuth.js
- JWT tokens for API access
- DSGVO-compliant data handling

## 🤖 AI Features

- **Intelligent Matching**: ML-powered tenant-listing matching
- **Fraud Detection**: Automated scam listing removal
- **Auto-Apply**: AI-generated personalized cover letters
- **Mietpreisbremse Checker**: Automated rent cap compliance using Berliner Mietspiegel 2024
- **Rejection Analysis**: AI feedback on application failures

## 🎯 Target Audience

- **Students** (expat & local): Ages 18-28, CODE/BSBI/HU/FU/TU Berlin
- **Working Professionals**: Ages 25-45, relocating or upgrading
- **International Expats**: Non-German speakers navigating Berlin rentals
- **Local Renters**: German-speaking tenants seeking smarter search

## 📊 Business Model

- **Free Tier**: Zero-barrier search access
- **Mid Tier**: €3-5/month for email alerts
- **Pro Tier**: €6-10/month for AI auto-apply
- **Revenue Target**: €120,000 ARR Year 1
- **Unit Economics**: €3,360 ARR per 100 users

## 🚀 Go-To-Market Strategy

- **University Partnerships**: CODE, BSBI, HU, FU, TU Berlin
- **Visa Agency Referrals**: Accommodation at point of visa approval
- **Social Media**: Instagram/LinkedIn targeted ads
- **SEO**: Berlin rental guides, tenant rights content
- **Referral Program**: Free Pro months for successful sign-ups

## 🧪 Testing

Backend uses Vitest for unit and integration tests. Frontend testing framework to be configured.

```bash
cd backend
npm run test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- **Files**: kebab-case (`in-berlin-wohnen.scraper.ts`)
- **Types**: PascalCase (`StandardListing`, `ScraperInterface`)
- **Controllers**: `{verb}{Resource}Handler` pattern
- **Validation**: Zod v4 with safeParse + treeifyError
- **DB Queries**: Raw SQL via Prisma.sql template literals
- **Feature Folders**: Group by domain (routes, controllers, services, types)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Website**: https://budenfinder.de
- **Email**: team@budenfinder.de
- **LinkedIn**: [Budenfinder](https://linkedin.com/company/budenfinder)

## 🙏 Acknowledgments

- Berliner Mietspiegel 2024 data
- University partnerships: CODE, BSBI, HU, FU, TU Berlin
- Open source community

---

**Budenfinder** — Making Berlin rentals faster, safer, and smarter. 🏠✨</content>
<parameter name="filePath">/Users/justicesamuel/Documents/immobilen_ai/README.md