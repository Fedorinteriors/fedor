import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt, variantId } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        variantId,
        renderUrl: null,
        placeholder: true,
      })
    }

    const { default: OpenAI } = await import('openai')
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const enhancedPrompt = `${prompt}. Photorealistic architectural interior render, high-end kitchen design, professional photography, 4K quality, dramatic natural lighting, ultra-detailed.`

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      size: '1792x1024',
      quality: 'hd',
      style: 'natural',
      n: 1,
    })

    const imageUrl = response.data?.[0]?.url

    if (!imageUrl) {
      return NextResponse.json({ variantId, renderUrl: null, placeholder: true })
    }

    // Download the image and convert to base64 for persistence (DALL-E URLs expire)
    const imgResponse = await fetch(imageUrl)
    const arrayBuffer = await imgResponse.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUrl = `data:image/png;base64,${base64}`

    return NextResponse.json({
      variantId,
      renderUrl: dataUrl,
      placeholder: false,
    })
  } catch (err) {
    console.error('generate-render error:', err)
    return NextResponse.json(
      { error: 'Greška pri generisanju rendera.', variantId: req.body },
      { status: 500 }
    )
  }
}
