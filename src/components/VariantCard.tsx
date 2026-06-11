'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ZapIcon,
  ClockIcon,
  DollarSignIcon,
} from 'lucide-react'
import { cn, formatCurrency, layoutLabel, styleLabel } from '@/lib/utils'
import type { KitchenVariant } from '@/lib/types'

const STYLE_COLORS: Record<string, string> = {
  modern: 'bg-slate-100 text-slate-700',
  scandinavian: 'bg-sky-50 text-sky-700',
  industrial: 'bg-zinc-100 text-zinc-700',
  classic: 'bg-amber-50 text-amber-700',
  zen: 'bg-emerald-50 text-emerald-700',
}

interface Props {
  variant: KitchenVariant
  index: number
  isSelected: boolean
  onToggle: () => void
}

export function VariantCard({ variant, index, isSelected, onToggle }: Props) {
  const [expanded, setExpanded] = useState(false)
  const totalTimeline = variant.timeline[variant.timeline.length - 1]?.duration ?? ''
  const totalWithVat = variant.estimatedCost.breakdown.reduce(
    (sum, i) => sum + i.estimatedCost * i.quantity,
    0
  ) * 1.17

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={cn(
        'rounded-2xl border overflow-hidden transition-all duration-200',
        isSelected
          ? 'border-amber-500 shadow-md shadow-amber-100'
          : 'border-stone-200 hover:border-stone-300'
      )}
    >
      {/* Render image */}
      <div className="relative aspect-video bg-stone-100">
        {variant.renderUrl ? (
          <img
            src={variant.renderUrl}
            alt={variant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div className="flex gap-2">
              {variant.colors.map((c, i) => (
                <div key={i} className="w-6 h-6 rounded-full border border-white/50" style={{ backgroundColor: c }} />
              ))}
            </div>
            <span className="text-sm font-medium text-stone-500">{variant.name}</span>
            <span className="text-xs text-stone-400">Render se generiše...</span>
          </div>
        )}
        {/* Selection toggle */}
        <button
          onClick={onToggle}
          className={cn(
            'absolute top-3 right-3 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all',
            isSelected
              ? 'bg-amber-500 border-amber-500'
              : 'bg-white/90 border-stone-300 hover:border-amber-400'
          )}
        >
          {isSelected && <CheckIcon className="w-3.5 h-3.5 text-white" />}
        </button>
        {/* Index badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold text-stone-700 px-2 py-1 rounded-lg">
          0{index + 1}
        </div>
      </div>

      <div className="p-5">
        {/* Name and style */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-stone-900">{variant.name}</h3>
            <p className="text-xs text-stone-500 mt-0.5">{layoutLabel(variant.layout)}</p>
          </div>
          <span className={cn('text-xs font-medium px-2 py-1 rounded-full', STYLE_COLORS[variant.style])}>
            {styleLabel(variant.style)}
          </span>
        </div>

        {/* Short description */}
        <p className="text-sm text-stone-600 leading-relaxed mb-4">{variant.shortDescription}</p>

        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-stone-50 rounded-xl p-3 text-center">
            <DollarSignIcon className="w-4 h-4 text-amber-600 mx-auto mb-1" />
            <p className="text-xs text-stone-500 mb-0.5">Cijena</p>
            <p className="text-xs font-semibold text-stone-800">
              {(totalWithVat / 1000).toFixed(0)}k {variant.estimatedCost.currency}
            </p>
          </div>
          <div className="bg-stone-50 rounded-xl p-3 text-center">
            <ClockIcon className="w-4 h-4 text-amber-600 mx-auto mb-1" />
            <p className="text-xs text-stone-500 mb-0.5">Rokovi</p>
            <p className="text-xs font-semibold text-stone-800">{variant.timeline.length} faza</p>
          </div>
          <div className="bg-stone-50 rounded-xl p-3 text-center">
            <ZapIcon className="w-4 h-4 text-amber-600 mx-auto mb-1" />
            <p className="text-xs text-stone-500 mb-0.5">Uređaja</p>
            <p className="text-xs font-semibold text-stone-800">{variant.appliances.length}</p>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {variant.features.map((f, i) => (
            <span key={i} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full">
              {f}
            </span>
          ))}
        </div>

        {/* Expand/Collapse */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 transition-colors"
        >
          {expanded ? <ChevronUpIcon className="w-3.5 h-3.5" /> : <ChevronDownIcon className="w-3.5 h-3.5" />}
          {expanded ? 'Sakrij detalje' : 'Prikaži detalje'}
        </button>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-stone-100 space-y-4"
          >
            {/* Materials */}
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">Materijali</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-stone-400">Korpusi: </span>
                  <span className="text-stone-700">{variant.cabinets.material} — {variant.cabinets.color}</span>
                </div>
                <div>
                  <span className="text-stone-400">Radna ploča: </span>
                  <span className="text-stone-700">{variant.countertop.material}</span>
                </div>
                <div>
                  <span className="text-stone-400">Pod: </span>
                  <span className="text-stone-700">{variant.flooring.material}</span>
                </div>
              </div>
            </div>

            {/* Appliances */}
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">Ugradbeni uređaji</p>
              <ul className="text-xs text-stone-700 space-y-1">
                {variant.appliances.map((a, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-amber-500">·</span>
                    <span>{a.name}{a.notes ? ` — ${a.notes}` : ''}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lighting */}
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">Rasvjeta</p>
              <div className="text-xs text-stone-700 space-y-1">
                <p><span className="text-stone-400">Ambijent: </span>{variant.lighting.ambient}</p>
                <p><span className="text-stone-400">Radna: </span>{variant.lighting.task}</p>
                <p><span className="text-stone-400">Akcentna: </span>{variant.lighting.accent}</p>
              </div>
            </div>

            {/* Cost breakdown */}
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">Kalkulacija</p>
              <div className="space-y-1">
                {variant.estimatedCost.breakdown.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-stone-500">{item.category}</span>
                    <span className="text-stone-700 font-medium">
                      {(item.estimatedCost * item.quantity).toLocaleString()} {variant.estimatedCost.currency}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-xs pt-2 border-t border-stone-100 font-semibold">
                  <span>Ukupno sa PDV-om</span>
                  <span className="text-amber-700">{Math.round(totalWithVat).toLocaleString()} {variant.estimatedCost.currency}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">Dinamika izrade</p>
              <div className="space-y-2">
                {[...variant.timeline]
                  .sort((a, b) => a.order - b.order)
                  .map((phase) => (
                    <div key={phase.order} className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {phase.order}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-stone-700">{phase.name}</p>
                        <p className="text-xs text-amber-600">{phase.duration}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
