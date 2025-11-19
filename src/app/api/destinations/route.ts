import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { parseJSONL, parseExternalAPIData } from '@/utils/jsonlParser'

// export async function GET() {
//   try {
//     const jsonlPath = join(process.cwd(), 'src/app/data/data_wisata.jsonl')
//     const jsonlText = readFileSync(jsonlPath, 'utf-8')
//     const destinations = parseJSONL(jsonlText)
    
//     return NextResponse.json(destinations)
//   } catch (error) {
//     console.error('Error loading destinations:', error)
//     return NextResponse.json({ error: 'Failed to load destinations' }, { status: 500 })
//   }
// }
export async function GET() {
  try {
    // Fetch data from external API
    const response = await fetch('http://localhost:8000/wisata?offset=0', {
      cache: 'no-store' // Disable caching to always get fresh data
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