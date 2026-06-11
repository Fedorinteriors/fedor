'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftIcon, RefreshCwIcon } from 'lucide-react'
import { useDesignStore } from '@/lib/store'
import { StepIndicator } from '@/components/StepIndicator'
import { SketchUpload } from '@/components/SketchUpload'
import { RoomAnalysis } from '@/components/RoomAnalysis'
import { VariantCard } from '@/components/VariantCard'
import { ClientForm } from '@/components/ClientForm'
import { GeneratingAnimation, AnalyzingAnimation } from '@/components/GeneratingAnimation'

const STEP_TITLES: Record<string, { title: string; subtitle: string }> = {
  upload: {
    title: 'Upload skice prostorije',
    subtitle: 'Fotografiraj ili skeniraj rukom nacrtanu osnovu s dimenzijama',
  },
  analyzing: {
    title: 'AI analiza skice',
    subtitle: 'Claude čita dimenzije i geometriju prostorije',
  },
  review: {
    title: 'Pregled analize',
    subtitle: 'Provjeri dimenzije koje je AI prepoznao i korigiraj po potrebi',
  },
  generating: {
    title: 'Generisanje varijanti',
    subtitle: 'AI dizajner kreira 5 prilagođenih koncepta kuhinje',
  },
  variants: {
    title: '5 varijanti kuhinje',
    subtitle: 'Odaberi koje varijante želiš uključiti u PDF za klijenta',
  },
  pdf: {
    title: 'PDF za klijenta',
    subtitle: 'Unesi podatke i generiši profesionalni dokument',
  },
}

function VariantsGallery() {
  const { variants, selectedVariantIds, toggleVariantSelection, setStep } = useDesignStore()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {variants.map((variant, i) => (
          <VariantCard
            key={variant.id}
            variant={variant}
            index={i}
            isSelected={selectedVariantIds.includes(variant.id)}
            onToggle={() => toggleVariantSelection(variant.id)}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-stone-200 p-5">
        <div className="text-sm text-stone-500">
          {selectedVariantIds.length === 0
            ? 'Sve varijante će biti uključene u PDF'
            : `${selectedVariantIds.length} varijant${selectedVariantIds.length === 1 ? 'a' : 'e'} odabrano`}
        </div>
        <button
          onClick={() => setStep('pdf')}
          className="flex items-center gap-2 bg-stone-900 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-stone-800 transition-colors"
        >
          Nastavi na PDF
          <ArrowLeftIcon className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </div>
  )
}

export default function DesignPage() {
  const { step, reset, analysisError, generationError } = useDesignStore()
  const info = STEP_TITLES[step] ?? STEP_TITLES.upload

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
              <span className="text-amber-400 font-bold text-sm">F</span>
            </div>
            <span className="font-semibold text-stone-900">Fedor Interiors</span>
          </Link>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors"
          >
            <RefreshCwIcon className="w-3.5 h-3.5" />
            Nova skica
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Step indicator */}
        <div className="mb-10">
          <StepIndicator currentStep={step} />
        </div>

        {/* Page title */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step + '-title'}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold text-stone-900 mb-2">{info.title}</h2>
            <p className="text-stone-500">{info.subtitle}</p>
          </motion.div>
        </AnimatePresence>

        {/* Error messages */}
        {(analysisError || generationError) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4 text-center"
          >
            {analysisError ?? generationError}
          </motion.div>
        )}

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
          >
            {step === 'upload' && <SketchUpload />}
            {step === 'analyzing' && <AnalyzingAnimation />}
            {step === 'review' && <RoomAnalysis />}
            {step === 'generating' && <GeneratingAnimation />}
            {step === 'variants' && <VariantsGallery />}
            {step === 'pdf' && <ClientForm />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
