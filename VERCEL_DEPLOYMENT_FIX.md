# Vercel Deployment Fix - Dynamic Server Usage Error

## Problem
The application was failing to deploy on Vercel with the error:
```
Error: Dynamic server usage: Route /lihat-semua couldn't be rendered statically 
because it used revalidate: 0 fetch https://...ngrok-free.dev/wisata?offset=0
```

**Update**: Next.js 15 also introduced a breaking change where `params` in API routes must be awaited.

## Root Cause
Next.js was trying to **statically generate** the `/lihat-semua` page at build time, but the page needs to fetch data from an external API dynamically. This creates a conflict because:

1. **Static Site Generation (SSG)** happens at build time
2. The external API (ngrok URL) is not available during build
3. The data should be fetched fresh on each request (dynamic)

## Solution

### Key Change: Force Dynamic Rendering

Added `export const dynamic = 'force-dynamic'` to the `/lihat-semua` page to tell Next.js to always render this page on the server at request time, never statically.

### Files Modified

#### 1. `/src/app/lihat-semua/page.tsx`
```typescript
// Force dynamic rendering - required for Vercel deployment with external API
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Lihat Semua Destinasi | Wisata Surabaya',
  description: 'Jelajahi semua destinasi wisata kuliner dan non-kuliner yang tersedia di Surabaya'
}
```

#### 2. `/src/services/destinationService.ts`
```typescript
const response = await fetch(`${apiUrl}/wisata?offset=0`, {
  cache: 'no-store',  // Ensures fresh data on every request
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  }
})
```

#### 3. `/src/app/api/wisata/route.ts` (API Proxy)
```typescript
// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  const response = await fetch(externalUrl, {
    cache: 'no-store',
    headers: { /* ... */ }
  })
  // ...
}
```

#### 4. `/src/app/api/wisata/[id]/route.ts` (Single Destination Proxy)
```typescript
// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }  // ⚠️ Next.js 15: params is now a Promise
) {
  const { id } = await params  // ⚠️ Must await params
  
  const response = await fetch(externalUrl, {
    cache: 'no-store',
    headers: { /* ... */ }
  })
  // ...
}
```

## How It Works

### Before (Static - ❌ Failed)
```
Build Time → Next.js tries to render /lihat-semua statically
          → Needs to fetch from external API
          → API not available during build
          → ERROR: Dynamic server usage
```

### After (Dynamic - ✅ Success)
```
Request Time → User visits /lihat-semua
            → Next.js renders on server
            → Fetches from external API
            → Returns fresh HTML
            → SUCCESS!
```

## Deployment Steps

1. **Commit all changes**:
   ```bash
   git add .
   git commit -m "Fix: Force dynamic rendering for external API routes"
   git push
   ```

2. **Vercel will automatically**:
   - Detect the changes
   - Build with dynamic rendering enabled
   - Deploy successfully

3. **Environment Variables** (must be set in Vercel):
   - `NEXT_PUBLIC_API_URL`: Your ngrok or production API URL
   - Example: `https://unrisky-marisol-unfossilised.ngrok-free.dev`

## Why This Configuration?

### `export const dynamic = 'force-dynamic'`
- Tells Next.js: "Always render this page server-side"
- Never attempts static generation at build time
- Required for pages that fetch from external APIs

### `cache: 'no-store'`
- Tells fetch: "Don't cache this response"
- Always get fresh data from the API
- Ensures users see the latest destinations

### `export const revalidate = 0`
- Additional safeguard for API routes
- Ensures no caching at the route level
- Works with `dynamic = 'force-dynamic'`

## Testing

### Local Development
```bash
npm run dev
# Visit http://localhost:3000/lihat-semua
# Should load destinations from external API
```

### Production Build (Simulate Vercel)
```bash
npm run build
npm run start
# Visit http://localhost:3000/lihat-semua
# Should work without build-time errors
```

## Alternative Approaches (Not Used)

### 1. Use API Routes as Proxy ✅ (Implemented)
- Pros: Hides external API URL, adds security layer
- Cons: Extra hop in request chain
- **Status**: Implemented in `/src/app/api/wisata/`

### 2. Use `generateStaticParams` with ISR
- Pros: Better performance for known destinations
- Cons: Requires knowing all IDs at build time
- **Status**: Not suitable for dynamic external API

### 3. Client-Side Data Fetching
- Pros: Simple implementation
- Cons: Slower page load, worse SEO
- **Status**: Used in `/destination/[place_id]` page (already client component)

## Related Documentation

- [Next.js Dynamic Rendering](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering)
- [Next.js Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)

## Summary

The fix ensures that pages fetching from external APIs are **always rendered dynamically** on the server, preventing build-time errors and ensuring fresh data for users.
