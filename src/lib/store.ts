'use client'
import { create } from 'zustand'
import type { RoomData, KitchenVariant, ClientInfo, WizardStep } from './types'

interface DesignStore {
  step: WizardStep
  sketchFile: File | null
  sketchPreview: string | null
  sketchBase64: string | null
  roomData: RoomData | null
  variants: KitchenVariant[]
  selectedVariantIds: string[]
  clientInfo: ClientInfo
  isAnalyzing: boolean
  isGenerating: boolean
  analysisError: string | null
  generationError: string | null

  setStep: (step: WizardStep) => void
  setSketch: (file: File, preview: string, base64: string) => void
  setRoomData: (data: RoomData) => void
  updateRoomDimension: (key: keyof RoomData['dimensions'], value: number) => void
  setVariants: (variants: KitchenVariant[]) => void
  updateVariantRender: (id: string, url: string, base64?: string) => void
  setClientInfo: (info: Partial<ClientInfo>) => void
  toggleVariantSelection: (id: string) => void
  setIsAnalyzing: (v: boolean) => void
  setIsGenerating: (v: boolean) => void
  setAnalysisError: (e: string | null) => void
  setGenerationError: (e: string | null) => void
  reset: () => void
}

const defaultClientInfo: ClientInfo = {
  clientName: '',
  projectName: '',
  projectAddress: '',
  designerName: '',
  designerContact: '',
  date: new Date().toLocaleDateString('bs-BA'),
  currency: 'BAM',
  notes: '',
}

export const useDesignStore = create<DesignStore>((set) => ({
  step: 'upload',
  sketchFile: null,
  sketchPreview: null,
  sketchBase64: null,
  roomData: null,
  variants: [],
  selectedVariantIds: [],
  clientInfo: defaultClientInfo,
  isAnalyzing: false,
  isGenerating: false,
  analysisError: null,
  generationError: null,

  setStep: (step) => set({ step }),
  setSketch: (file, preview, base64) =>
    set({ sketchFile: file, sketchPreview: preview, sketchBase64: base64 }),
  setRoomData: (data) => set({ roomData: data }),
  updateRoomDimension: (key, value) =>
    set((state) => ({
      roomData: state.roomData
        ? {
            ...state.roomData,
            dimensions: { ...state.roomData.dimensions, [key]: value },
            area: key !== 'height'
              ? (key === 'width'
                  ? (value / 100) * (state.roomData.dimensions.length / 100)
                  : (state.roomData.dimensions.width / 100) * (value / 100))
              : state.roomData.area,
          }
        : null,
    })),
  setVariants: (variants) => set({ variants }),
  updateVariantRender: (id, url, base64) =>
    set((state) => ({
      variants: state.variants.map((v) =>
        v.id === id ? { ...v, renderUrl: url, renderBase64: base64 } : v
      ),
    })),
  setClientInfo: (info) =>
    set((state) => ({ clientInfo: { ...state.clientInfo, ...info } })),
  toggleVariantSelection: (id) =>
    set((state) => ({
      selectedVariantIds: state.selectedVariantIds.includes(id)
        ? state.selectedVariantIds.filter((v) => v !== id)
        : [...state.selectedVariantIds, id],
    })),
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),
  setIsGenerating: (v) => set({ isGenerating: v }),
  setAnalysisError: (e) => set({ analysisError: e }),
  setGenerationError: (e) => set({ generationError: e }),
  reset: () =>
    set({
      step: 'upload',
      sketchFile: null,
      sketchPreview: null,
      sketchBase64: null,
      roomData: null,
      variants: [],
      selectedVariantIds: [],
      clientInfo: defaultClientInfo,
      isAnalyzing: false,
      isGenerating: false,
      analysisError: null,
      generationError: null,
    }),
}))
