export interface WallFeature {
  type: 'window' | 'door' | 'column'
  position: number
  width: number
  height?: number
}

export interface Wall {
  id: string
  length: number
  height: number
  features: WallFeature[]
}

export interface RoomData {
  shape: 'rectangular' | 'L-shape' | 'irregular'
  dimensions: {
    width: number
    length: number
    height: number
  }
  area: number
  walls: Wall[]
  confidence: number
  notes: string
}

export interface Appliance {
  name: string
  notes?: string
}

export interface LightingPlan {
  ambient: string
  task: string
  accent: string
  fixtures: string[]
}

export interface CostItem {
  category: string
  description: string
  estimatedCost: number
  unit: string
  quantity: number
}

export interface TimelinePhase {
  name: string
  duration: string
  description: string
  order: number
}

export type KitchenStyle = 'modern' | 'scandinavian' | 'industrial' | 'classic' | 'zen'
export type KitchenLayout = 'L-shape' | 'U-shape' | 'island' | 'galley' | 'single-wall' | 'peninsula'

export interface KitchenVariant {
  id: string
  name: string
  style: KitchenStyle
  layout: KitchenLayout
  shortDescription: string
  description: string
  renderPrompt: string
  renderUrl?: string
  renderBase64?: string
  cabinets: {
    color: string
    material: string
    style: string
    hasIsland: boolean
    hasUpperCabinets: boolean
  }
  countertop: {
    material: string
    color: string
  }
  appliances: Appliance[]
  lighting: LightingPlan
  flooring: {
    material: string
    color: string
  }
  colors: string[]
  features: string[]
  estimatedCost: {
    min: number
    max: number
    currency: string
    breakdown: CostItem[]
  }
  timeline: TimelinePhase[]
}

export interface ClientInfo {
  clientName: string
  projectName: string
  projectAddress: string
  designerName: string
  designerContact: string
  date: string
  currency: 'EUR' | 'BAM' | 'RSD'
  notes: string
}

export type WizardStep =
  | 'upload'
  | 'analyzing'
  | 'review'
  | 'generating'
  | 'variants'
  | 'pdf'
