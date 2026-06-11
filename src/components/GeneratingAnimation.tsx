'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  { label: 'Analiziram dimenzije prostorije...', icon: '📐' },
  { label: 'Osmišljavam raspored kuhinje...', icon: '🏠' },
  { label: 'Generijem varijante materijala...', icon: '🎨' },
  { label: 'Procjenjujem troškove...', icon: '💰' },
  { label: 'Izračunavam dinamiku izrade...', icon: '📅' },
  { label: 'Finalizujem 5 varijanti...', icon: '✨' },
]

export function GeneratingAnimation() {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((s) => (s < STEPS.length - 1 ? s + 1 : s))
      setProgress((p) => Math.min(p + 100 / STEPS.length, 92))
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-2 border-stone-200 border-t-amber-500 mx-auto mb-6"
        />
        <h3 className="text-xl font-semibold text-stone-900 mb-2">AI dizajner na poslu</h3>
        <p className="text-sm text-stone-500">Generisujem 5 prilagođenih varijanti kuhinje...</p>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-stone-100 rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-amber-500 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {STEPS.slice(0, currentStep + 1)
            .reverse()
            .slice(0, 4)
            .reverse()
            .map((step, i) => {
              const globalIdx = currentStep - (Math.min(currentStep + 1, 4) - 1 - i)
              const isActive = globalIdx === currentStep
              return (
                <motion.div
                  key={globalIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: isActive ? 1 : 0.4, y: 0 }}
                  className="flex items-center gap-3 text-left"
                >
                  <span className="text-lg w-8 text-center">{step.icon}</span>
                  <span
                    className={`text-sm ${isActive ? 'text-stone-900 font-medium' : 'text-stone-400'}`}
                  >
                    {step.label}
                  </span>
                  {isActive && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-auto"
                    />
                  )}
                </motion.div>
              )
            })}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function AnalyzingAnimation() {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
      >
        <span className="text-2xl">🔍</span>
      </motion.div>
      <h3 className="text-xl font-semibold text-stone-900 mb-2">Analiziram skicu</h3>
      <p className="text-sm text-stone-500">Claude AI čita dimenzije i geometriju prostorije...</p>
      <div className="mt-6 flex justify-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-amber-500"
          />
        ))}
      </div>
    </div>
  )
}
