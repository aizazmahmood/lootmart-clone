# Lootmart Clone

Production-grade grocery storefront with Next.js App Router, Prisma 7, and Neon Postgres.

**Live Demo**
- https://lootmart-clone.vercel.app/

**What’s Implemented**
- Home page with hero, feature cards, promo banner, and store sections
- Store page with search, dynamic category chips, filters, and paginated product grid
- Cart drawer + sticky checkout bar
- Checkout UI (client-side, demo-only)
- API routes: stores, products, product detail, categories, health

**Architecture Overview**
- Next.js App Router with Server Components for data-heavy pages
- Prisma 7 + Neon adapter for Postgres (pooled connections)
- API routes with cache headers + ETag for read endpoints
- ISR on key pages (`revalidate = 60`)
- Client state for cart via localStorage hydration

**How to Run Locally**
1. Install deps
```
npm install
```
2. Set env vars
```
DATABASE_URL=postgres://...-pooler?sslmode=require
DIRECT_URL=postgres://... (non-pooler, migrations only)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
3. Generate Prisma client
```
npx prisma generate
```
4. Run migrations
```
npx prisma migrate dev
```
5. Seed data
```
npm run db:seed
```
6. Start dev server
```
npm run dev
```

**Seed Data**
- Stores and products are loaded from `seed/input/*.json`
- Product images are stored under `public/images/...`
- The seed script clears existing rows and re-imports data

**Deployment Notes (Vercel)**
- Set `DATABASE_URL` (pooled) and `DIRECT_URL` (non-pooled) in Vercel env vars
- Run `npx prisma generate` during build
- Run migrations via CI or manual command using `DIRECT_URL`
- Cache headers are emitted by API routes for CDN caching
- Verify cache behavior with `x-vercel-cache` response header

**Performance Notes**
- Product listing is cursor-paginated (`limit` + `cursor`)
- API caching: `s-maxage=60` with `stale-while-revalidate=600` + ETag
- ISR for `Home` and `Store` pages (`revalidate = 60`)
- Image optimization enabled for local + remote sources

**Key Endpoints**
- `GET /api/stores`
- `GET /api/stores/[slug]`
- `GET /api/stores/[slug]/categories`
- `GET /api/products`
- `GET /api/products/[id]`
- `GET /api/health`
