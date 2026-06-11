import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat('bs-BA', {
    style: 'currency',
    currency: currency === 'BAM' ? 'BAM' : currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return formatter.format(amount)
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      // Strip the data URL prefix (e.g. "data:image/jpeg;base64,")
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
  })
}

export function getMediaType(file: File): 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif' {
  const map: Record<string, 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'> = {
    'image/jpeg': 'image/jpeg',
    'image/jpg': 'image/jpeg',
    'image/png': 'image/png',
    'image/webp': 'image/webp',
    'image/gif': 'image/gif',
  }
  return map[file.type] ?? 'image/jpeg'
}

export function styleLabel(style: string): string {
  const labels: Record<string, string> = {
    modern: 'Moderni',
    scandinavian: 'Skandinavski',
    industrial: 'Industrijski',
    classic: 'Klasični',
    zen: 'Zen Prirodni',
  }
  return labels[style] ?? style
}

export function layoutLabel(layout: string): string {
  const labels: Record<string, string> = {
    'L-shape': 'L-raspored',
    'U-shape': 'U-raspored',
    island: 'Sa ostrvom',
    galley: 'Linijski',
    'single-wall': 'Jednobočni',
    peninsula: 'Sa poluostrvom',
  }
  return labels[layout] ?? layout
}
