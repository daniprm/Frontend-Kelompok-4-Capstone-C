import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
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
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('✅ Successfully fetched destination:', data.nama_destinasi || data.restaurant_id)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
