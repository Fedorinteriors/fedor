import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import type { KitchenVariant, ClientInfo, RoomData } from '@/lib/types'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const {
      variants,
      clientInfo,
      roomData,
      sketchBase64,
    }: {
      variants: KitchenVariant[]
      clientInfo: ClientInfo
      roomData: RoomData
      sketchBase64?: string
    } = await req.json()

    const { KitchenPDFDocument } = await import('@/components/PDFDocument')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = createElement(KitchenPDFDocument, {
      variants,
      clientInfo,
      roomData,
      sketchBase64,
    }) as any
    const buffer = await renderToBuffer(element)

    const uint8 = new Uint8Array(buffer)

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="fedor-kuhinja-${clientInfo.projectName.replace(/\s+/g, '-')}.pdf"`,
        'Content-Length': uint8.byteLength.toString(),
      },
    })
  } catch (err) {
    console.error('generate-pdf error:', err)
    return NextResponse.json({ error: 'Greška pri generisanju PDF-a.' }, { status: 500 })
  }
}
