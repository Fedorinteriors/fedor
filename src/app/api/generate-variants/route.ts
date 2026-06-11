import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildVariantPrompt } from '@/lib/prompts'
import type { RoomData, KitchenVariant } from '@/lib/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { roomData }: { roomData: RoomData } = await req.json()

    if (!roomData) {
      return NextResponse.json({ error: 'Nedostaju podaci o prostoriji' }, { status: 400 })
    }

    const prompt = buildVariantPrompt(roomData)

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text]
    const jsonText = (jsonMatch[1] ?? text).trim()

    let variants: KitchenVariant[]
    try {
      variants = JSON.parse(jsonText)
    } catch {
      return NextResponse.json(
        { error: 'AI nije uspio generisati varijante. Pokušajte ponovo.' },
        { status: 422 }
      )
    }

    // Ensure IDs are set
    variants = variants.map((v, i) => ({
      ...v,
      id: v.id ?? `variant-${i + 1}`,
    }))

    return NextResponse.json({ variants })
  } catch (err) {
    console.error('generate-variants error:', err)
    return NextResponse.json(
      { error: 'Greška pri generisanju varijanti.' },
      { status: 500 }
    )
  }
}
