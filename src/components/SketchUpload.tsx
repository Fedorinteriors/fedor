'use client'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloudIcon, ImageIcon, XIcon, ScanIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fileToBase64, getMediaType } from '@/lib/utils'
import { useDesignStore } from '@/lib/store'

export function SketchUpload() {
  const { setSketch, setStep, sketchPreview, sketchBase64, setIsAnalyzing, setAnalysisError, setRoomData } =
    useDesignStore()
  const [isAnalyzing, setLocalAnalyzing] = useState(false)

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0]
      if (!file) return
      const preview = URL.createObjectURL(file)
      const base64 = await fileToBase64(file)
      setSketch(file, preview, base64)
    },
    [setSketch]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  const handleAnalyze = async () => {
    if (!sketchBase64) return
    setLocalAnalyzing(true)
    setIsAnalyzing(true)
    setAnalysisError(null)
    setStep('analyzing')

    try {
      const res = await fetch('/api/analyze-sketch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64: sketchBase64, mediaType: 'image/jpeg' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRoomData(data.roomData)
      setStep('review')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Greška pri analizi'
      setAnalysisError(message)
      setStep('upload')
    } finally {
      setLocalAnalyzing(false)
      setIsAnalyzing(false)
    }
  }

  const clearSketch = () => {
    useDesignStore.setState({
      sketchFile: null,
      sketchPreview: null,
      sketchBase64: null,
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!sketchPreview ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-200',
                isDragActive
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-stone-200 bg-stone-50 hover:border-stone-400 hover:bg-white'
              )}
            >
              <input {...getInputProps()} />
              <UploadCloudIcon
                className={cn(
                  'w-12 h-12 mx-auto mb-4 transition-colors',
                  isDragActive ? 'text-amber-500' : 'text-stone-300'
                )}
              />
              <p className="text-stone-700 font-medium mb-1">
                {isDragActive ? 'Ispusti skicu ovdje' : 'Prevuci skicu ili klikni za upload'}
              </p>
              <p className="text-sm text-stone-400">
                JPG, PNG, WEBP · Maks. 10MB
              </p>
            </div>

            <div className="mt-8 p-5 bg-stone-50 rounded-xl border border-stone-100">
              <div className="flex items-start gap-3">
                <ImageIcon className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-stone-700 mb-1">Kako nacrtati skicu</p>
                  <ul className="text-sm text-stone-500 space-y-1">
                    <li>· Nacrta osnovu prostorije odozgo (tlocrt)</li>
                    <li>· Upiši dimenzije zidova u centimetrima</li>
                    <li>· Označi vrata i prozore ako postoje</li>
                    <li>· Napiši visinu zidova (npr. "vis. 260cm")</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
              <img
                src={sketchPreview}
                alt="Uploadovana skica"
                className="w-full max-h-96 object-contain"
              />
              <button
                onClick={clearSketch}
                className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow border border-stone-200 hover:bg-stone-50 transition-colors"
              >
                <XIcon className="w-4 h-4 text-stone-500" />
              </button>
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs text-stone-600 border border-stone-100">
                Skica uploadovana
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-sm transition-all duration-200',
                isAnalyzing
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  : 'bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.99]'
              )}
            >
              <ScanIcon className="w-4 h-4" />
              {isAnalyzing ? 'Analiza u toku...' : 'Analiziraj skicu s AI'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
