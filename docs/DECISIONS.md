# Architecture Decisions

**Why Cursor Pagination**
- Stable performance under large catalogs
- No expensive `OFFSET` scans
- Works well with a composite index on `storeId + id`

**Why Cache Headers + ISR**
- CDN caching reduces repeated DB hits
- `stale-while-revalidate` keeps pages fast during updates
- ISR avoids full rebuilds and keeps content fresh on a schedule

**Why the Cart Is Client-Side**
- Fast UX without server round trips
- Simple local persistence via `localStorage`
- Keeps API surface small until orders/payments are added

**Next Production Steps**
- Authentication and user profiles
- Payment integration (Stripe or local provider)
- Order database schema + order history
- Server-side cart validation and stock checks
- Image CDN for remote assets
