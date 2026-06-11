'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileTextIcon, DownloadIcon, Loader2Icon } from 'lucide-react'
import { useDesignStore } from '@/lib/store'
import { cn } from '@/lib/utils'

function Field({
  label,
  field,
  type = 'text',
  placeholder,
  required,
}: {
  label: string
  field: keyof import('@/lib/types').ClientInfo
  type?: string
  placeholder?: string
  required?: boolean
}) {
  const { clientInfo, setClientInfo } = useDesignStore()
  return (
    <div>
      <label className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-1.5">
        {label} {required && <span className="text-amber-500">*</span>}
      </label>
      <input
        type={type}
        value={String(clientInfo[field] ?? '')}
        onChange={(e) => setClientInfo({ [field]: e.target.value })}
        placeholder={placeholder}
        className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
      />
    </div>
  )
}

export function ClientForm() {
  const { clientInfo, setClientInfo, variants, selectedVariantIds, roomData, sketchBase64 } = useDesignStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedVariants = variants.filter((v) =>
    selectedVariantIds.length === 0 ? true : selectedVariantIds.includes(v.id)
  )

  const handleGeneratePDF = async () => {
    if (!roomData) return
    setIsGenerating(true)
    setError(null)

    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variants: selectedVariants,
          clientInfo,
          roomData,
          sketchBase64,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Greška pri generisanju PDF-a')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fedor-kuhinja-${clientInfo.projectName.replace(/\s+/g, '-') || 'projekt'}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Greška pri generisanju'
      setError(message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Variant selection summary */}
        <div className="bg-stone-50 rounded-xl border border-stone-200 p-5">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">
            Odabrane varijante za PDF ({selectedVariants.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedVariants.length === 0 ? (
              <p className="text-sm text-stone-400">Sve varijante će biti uključene</p>
            ) : (
              selectedVariants.map((v) => (
                <span
                  key={v.id}
                  className="text-xs font-medium bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full"
                >
                  {v.name}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Client info form */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <FileTextIcon className="w-4 h-4 text-amber-600" />
            <h3 className="font-semibold text-stone-900">Podaci za PDF</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Naziv projekta" field="projectName" placeholder="Kuhinja Stanić" required />
            <Field label="Ime klijenta" field="clientName" placeholder="Marko Stanić" required />
            <Field label="Adresa projekta" field="projectAddress" placeholder="Ul. Maršala Tita 12, Sarajevo" />
            <Field label="Ime dizajnera" field="designerName" placeholder="Fedor Interiors" />
            <Field label="Kontakt dizajnera" field="designerContact" placeholder="+387 61 000 000" />
            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-1.5">
                Valuta
              </label>
              <select
                value={clientInfo.currency}
                onChange={(e) => setClientInfo({ currency: e.target.value as 'EUR' | 'BAM' | 'RSD' })}
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="BAM">BAM — Konvertibilna marka</option>
                <option value="EUR">EUR — Euro</option>
                <option value="RSD">RSD — Srpski dinar</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-1.5">
              Napomene (opcionalno)
            </label>
            <textarea
              value={clientInfo.notes}
              onChange={(e) => setClientInfo({ notes: e.target.value })}
              placeholder="Posebni zahtjevi, napomene za klijenta..."
              rows={3}
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>
        </div>

        {/* PDF includes info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '🎨', label: 'Renderi', desc: `${selectedVariants.length} varijante` },
            { icon: '📝', label: 'Opisi', desc: 'Detaljan opis svakog stila' },
            { icon: '💰', label: 'Kalkulacija', desc: 'Stavke sa PDV-om' },
            { icon: '📅', label: 'Dinamika', desc: 'Timeline izrade' },
          ].map((item) => (
            <div key={item.label} className="bg-stone-50 rounded-xl p-4 text-center">
              <span className="text-2xl block mb-2">{item.icon}</span>
              <p className="text-xs font-semibold text-stone-700">{item.label}</p>
              <p className="text-xs text-stone-400 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">
            {error}
          </div>
        )}

        <button
          onClick={handleGeneratePDF}
          disabled={isGenerating}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-sm transition-all duration-200',
            isGenerating
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
              : 'bg-amber-600 text-white hover:bg-amber-700 active:scale-[0.99] shadow-lg shadow-amber-200'
          )}
        >
          {isGenerating ? (
            <>
              <Loader2Icon className="w-4 h-4 animate-spin" />
              Generišem PDF...
            </>
          ) : (
            <>
              <DownloadIcon className="w-4 h-4" />
              Generiši i preuzmi PDF za klijenta
            </>
          )}
        </button>
      </motion.div>
    </div>
  )
}
