import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { parseJSONL } from '@/utils/jsonlParser'

export async function GET() {
  try {
    const jsonlPath = join(process.cwd(), 'src/app/data/data_wisata.jsonl')
    const jsonlText = readFileSync(jsonlPath, 'utf-8')
    const destinations = parseJSONL(jsonlText)
    
    return NextResponse.json(destinations)
  } catch (error) {
    console.error('Error loading destinations:', error)
    return NextResponse.json({ error: 'Failed to load destinations' }, { status: 500 })
  }
}