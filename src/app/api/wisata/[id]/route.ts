import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic'
export const revalidate = 0

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const externalUrl = `${apiUrl}/wisata/${id}`
    
    console.log('🔄 Proxying request to:', externalUrl)
    
    const response = await fetch(externalUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    })

    if (!response.ok) {
      console.error('❌ External API error:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Failed to fetch data from external API', status: response.status },
        { status: response.status, headers: corsHeaders }
      )
    }

    const data = await response.json()
    console.log('✅ Successfully fetched destination:', data.nama_destinasi || data.restaurant_id)
    
    return NextResponse.json(data, { headers: corsHeaders })
  } catch (error) {
    console.error('❌ Proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: corsHeaders }
    )
  }
}
