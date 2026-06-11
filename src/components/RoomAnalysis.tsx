'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2Icon, AlertCircleIcon, RulerIcon, Layers3Icon, WandSparklesIcon } from 'lucide-react'
import { useDesignStore } from '@/lib/store'
import { cn } from '@/lib/utils'

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100)
  const color = pct >= 80 ? 'text-emerald-600 bg-emerald-50' : pct >= 60 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50'
  const Icon = pct >= 80 ? CheckCircle2Icon : AlertCircleIcon
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full', color)}>
      <Icon className="w-3.5 h-3.5" />
      Pouzdanost AI analize: {pct}%
    </span>
  )
}

function FloorPlanSVG() {
  const { roomData } = useDesignStore()
  if (!roomData) return null

  const W = roomData.dimensions.width
  const L = roomData.dimensions.length
  const scale = Math.min(280 / W, 200 / L)
  const svgW = W * scale
  const svgH = L * scale
  const padding = 32

  return (
    <svg
      viewBox={`0 0 ${svgW + padding * 2} ${svgH + padding * 2}`}
      className="w-full max-h-64"
      style={{ maxWidth: svgW + padding * 2 + 40 }}
    >
      <rect
        x={padding}
        y={padding}
        width={svgW}
        height={svgH}
        fill="#fafaf9"
        stroke="#292524"
        strokeWidth="2"
      />
      {/* Dimension arrows */}
      <text x={padding + svgW / 2} y={padding - 8} textAnchor="middle" fontSize="11" fill="#78716c">
        {W} cm
      </text>
      <text
        x={padding - 10}
        y={padding + svgH / 2}
        textAnchor="middle"
        fontSize="11"
        fill="#78716c"
        transform={`rotate(-90, ${padding - 10}, ${padding + svgH / 2})`}
      >
        {L} cm
      </text>
      {/* Area label */}
      <text x={padding + svgW / 2} y={padding + svgH / 2} textAnchor="middle" fontSize="12" fill="#44403c" fontWeight="500">
        {roomData.area.toFixed(1)} m²
      </text>
      {/* Windows and doors on walls */}
      {roomData.walls?.slice(0, 4).map((wall, wi) => (
        wall.features?.map((feat, fi) => {
          const featW = feat.width * scale
          const pos = feat.position * scale
          // Simple rendering: features on walls A(top), B(right), C(bottom), D(left)
          if (wi === 0) {
            // top wall
            return (
              <rect
                key={`${wi}-${fi}`}
                x={padding + pos}
                y={padding - 2}
                width={featW}
                height={4}
                fill={feat.type === 'window' ? '#93c5fd' : '#fcd34d'}
              />
            )
          }
          return null
        })
      ))}
    </svg>
  )
}

function DimensionInput({
  label,
  value,
  unit,
  field,
}: {
  label: string
  value: number
  unit: string
  field: 'width' | 'length' | 'height'
}) {
  const { updateRoomDimension } = useDesignStore()

  return (
    <div>
      <label className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => updateRoomDimension(field, Number(e.target.value))}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          min={50}
          max={2000}
        />
        <span className="text-sm text-stone-400 w-8 shrink-0">{unit}</span>
      </div>
    </div>
  )
}

export function RoomAnalysis() {
  const { roomData, sketchPreview, setStep, setVariants, setGenerationError } = useDesignStore()
  const [isGenerating, setLocalGenerating] = useState(false)

  if (!roomData) return null

  const handleGenerate = async () => {
    setLocalGenerating(true)
    setGenerationError(null)
    setStep('generating')

    try {
      const res = await fetch('/api/generate-variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomData }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setVariants(data.variants)

      // Generate renders in parallel (non-blocking, update as they arrive)
      const { updateVariantRender } = useDesignStore.getState()
      data.variants.forEach(async (v: { id: string; renderPrompt: string }) => {
        try {
          const rRes = await fetch('/api/generate-render', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: v.renderPrompt, variantId: v.id }),
          })
          const rData = await rRes.json()
          if (rData.renderUrl) {
            updateVariantRender(v.id, rData.renderUrl)
          }
        } catch {
          // render failure is non-fatal
        }
      })

      setStep('variants')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Greška pri generisanju'
      setGenerationError(message)
      setStep('review')
    } finally {
      setLocalGenerating(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-stone-900 mb-1">AI analiza skice</h3>
            <p className="text-sm text-stone-500">Provjeri i korigiraj dimenzije ako je potrebno</p>
          </div>
          <ConfidenceBadge confidence={roomData.confidence} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sketch preview */}
          {sketchPreview && (
            <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">Uploadovana skica</p>
              <img
                src={sketchPreview}
                alt="Skica"
                className="w-full rounded-lg object-contain max-h-48"
              />
            </div>
          )}

          {/* Floor plan visualization */}
          <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Layers3Icon className="w-3.5 h-3.5" />
              AI interpretacija
            </p>
            <div className="flex justify-center">
              <FloorPlanSVG />
            </div>
          </div>
        </div>

        {/* Dimensions editor */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-4 flex items-center gap-1.5">
            <RulerIcon className="w-3.5 h-3.5" />
            Dimenzije prostorije
          </p>
          <div className="grid grid-cols-3 gap-4">
            <DimensionInput label="Širina" value={roomData.dimensions.width} unit="cm" field="width" />
            <DimensionInput label="Dužina" value={roomData.dimensions.length} unit="cm" field="length" />
            <DimensionInput label="Visina" value={roomData.dimensions.height} unit="cm" field="height" />
          </div>
          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-sm">
            <span className="text-stone-500">Površina prostorije</span>
            <span className="font-semibold text-stone-900">{roomData.area.toFixed(2)} m²</span>
          </div>
        </div>

        {/* Notes */}
        {roomData.notes && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <span className="font-medium">Napomena AI: </span>{roomData.notes}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-sm transition-all duration-200',
            isGenerating
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
              : 'bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.99]'
          )}
        >
          <WandSparklesIcon className="w-4 h-4" />
          {isGenerating ? 'Generisanje u toku...' : 'Generiši 5 varijanti kuhinje'}
        </button>
      </motion.div>
    </div>
  )
}
