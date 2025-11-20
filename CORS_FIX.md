# CORS Fix - OPTIONS 400 Bad Request Error

## Problem
Getting `OPTIONS /wisata 400 Bad Request` error when trying to fetch data from the external API.

## Root Cause
**CORS (Cross-Origin Resource Sharing)** preflight requests were failing because:

1. The frontend was calling the external API directly from the browser
2. The external API doesn't have proper CORS headers configured
3. Modern browsers send an `OPTIONS` preflight request before the actual `GET` request
4. The external API rejected the `OPTIONS` request with 400 Bad Request

## What is CORS?

When your browser makes a request to a different domain:
- **Same Origin**: `http://localhost:3000` → `http://localhost:3000/api` ✅ No CORS needed
- **Cross Origin**: `http://localhost:3000` → `https://ngrok-free.dev/wisata` ❌ CORS required

### CORS Preflight Flow:
```
1. Browser sends OPTIONS request → External API
2. External API should respond with CORS headers
3. If OK, browser sends actual GET request
4. If NOT OK → 400 Bad Request ❌
```

## Solution

### Architecture Change: Use API Proxy Pattern

**Before** (Direct API Call - ❌ CORS Error):
```
Frontend → External API (ngrok)
         ❌ CORS blocked by browser
```

**After** (API Proxy - ✅ Works):
```
Frontend → Next.js API Route → External API (ngrok)
         ✅ Same origin       ✅ Server-side (no CORS)
```

### Changes Made

#### 1. Added CORS Headers to API Routes

**`/src/app/api/wisata/route.ts`**
```typescript
// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, ngrok-skip-browser-warning',
}

// Handle OPTIONS preflight request
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET(request: NextRequest) {
  // ...fetch from external API...
  return NextResponse.json(data, { headers: corsHeaders })
}
```

**`/src/app/api/wisata/[id]/route.ts`**
```typescript
// Same CORS configuration as above
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET(request: NextRequest, { params }) {
  // ...fetch from external API...
  return NextResponse.json(data, { headers: corsHeaders })
}
```

#### 2. Updated Service to Use API Proxy

**`/src/services/destinationService.ts`**

**Before**:
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL // External API
const response = await fetch(`${apiUrl}/wisata?offset=0`)
```

**After**:
```typescript
// Use Next.js API proxy instead of direct external API call
const response = await fetch('/api/wisata?offset=0')
```

#### 3. Updated Destination Detail Page

**`/src/app/destination/[place_id]/page.tsx`**

**Before**:
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL
const response = await fetch(`${apiUrl}/wisata/${restaurantId}`)
```

**After**:
```typescript
// Fetch from Next.js API proxy (to avoid CORS issues)
const response = await fetch(`/api/wisata/${restaurantId}`)
```

## How It Works Now

### Request Flow:
```
1. User visits /lihat-semua
2. Page calls getDestinations()
3. Service calls /api/wisata?offset=0 (same origin - no CORS)
4. Next.js API route receives request
5. API route fetches from external API (server-side - no CORS)
6. API route returns data with CORS headers
7. Frontend receives data ✅
```

### Why This Works:
- ✅ **Frontend → Next.js API**: Same origin, no CORS needed
- ✅ **Next.js API → External API**: Server-to-server, no browser CORS restrictions
- ✅ **OPTIONS preflight**: Handled by Next.js API route, returns proper headers

## Benefits of API Proxy Pattern

1. **✅ No CORS Issues**: Browser sees same-origin requests
2. **✅ Security**: External API URL hidden from frontend
3. **✅ Flexibility**: Can add authentication, rate limiting, caching
4. **✅ Error Handling**: Centralized error handling in API route
5. **✅ Monitoring**: Easy to log and monitor API calls

## Testing

### 1. Check Network Tab
```
GET /api/wisata?offset=0
Status: 200 OK
Response: { data: [...] }
```

### 2. Check Console
```
🔄 Proxying request to: https://...ngrok-free.dev/wisata?offset=0
✅ Successfully fetched data, count: 100
```

### 3. No CORS Errors
```
❌ Before: Access to fetch at 'https://ngrok-free.dev/wisata' from origin 'http://localhost:3000' has been blocked by CORS
✅ After: No CORS errors!
```

## Environment Variables

Your Next.js API routes use `NEXT_PUBLIC_API_URL` to know where to proxy requests:

**`.env.local`** or **Vercel Environment Variables**:
```env
NEXT_PUBLIC_API_URL=https://unrisky-marisol-unfossilised.ngrok-free.dev
```

## Related Files Modified

- ✅ `/src/app/api/wisata/route.ts` - Added CORS headers and OPTIONS handler
- ✅ `/src/app/api/wisata/[id]/route.ts` - Added CORS headers and OPTIONS handler
- ✅ `/src/services/destinationService.ts` - Changed to use API proxy
- ✅ `/src/app/destination/[place_id]/page.tsx` - Changed to use API proxy

## Summary

The **API Proxy Pattern** solves CORS issues by routing all external API requests through your Next.js backend, which handles CORS properly and communicates with the external API server-to-server (where CORS doesn't apply).
