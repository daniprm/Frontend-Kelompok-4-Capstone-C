import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { parseJSONL, parseExternalAPIData } from '@/utils/jsonlParser'
import { headers } from 'next/headers'


export async function GET() {
  try {
    // Fetch data from external API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const response = await fetch(`${apiUrl}/wisata?offset=0`, {
      cache: 'no-store', // Disable caching to always get fresh data
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from external API: ${response.status}`)
    }
    
    const apiData = await response.json()
    
    // Transform the external API data to match your Destination type
    const destinations = parseExternalAPIData(apiData.data)
    
    return NextResponse.json(destinations)
  } catch (error) {
    console.error('Error loading destinations:', error)
    return NextResponse.json({ error: 'Failed to load destinations' }, { status: 500 })
  }
}