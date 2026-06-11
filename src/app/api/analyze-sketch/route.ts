import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { SKETCH_ANALYSIS_PROMPT } from '@/lib/prompts'
import type { RoomData } from '@/lib/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { base64, mediaType } = await req.json()

    if (!base64) {
      return NextResponse.json({ error: 'Nedostaje slika' }, { status: 400 })
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType ?? 'image/jpeg',
                data: base64,
              },
            },
            {
              type: 'text',
              text: SKETCH_ANALYSIS_PROMPT,
            },
          ],
        },
      ],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    // Extract JSON from potential markdown code block
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text]
    const jsonText = jsonMatch[1].trim()

    let roomData: RoomData
    try {
      roomData = JSON.parse(jsonText)
    } catch {
      return NextResponse.json(
        { error: 'AI nije uspio parsirati skicu. Pokušajte sa jasnijom slikom.' },
        { status: 422 }
      )
    }

    // Ensure area is calculated if missing
    if (!roomData.area || roomData.area === 0) {
      roomData.area = (roomData.dimensions.width / 100) * (roomData.dimensions.length / 100)
    }

    // Default height
    if (!roomData.dimensions.height || roomData.dimensions.height < 180) {
      roomData.dimensions.height = 260
    }

    return NextResponse.json({ roomData })
  } catch (err) {
    console.error('analyze-sketch error:', err)
    return NextResponse.json(
      { error: 'Greška pri analizi skice. Provjerite API ključ.' },
      { status: 500 }
    )
  }
}
