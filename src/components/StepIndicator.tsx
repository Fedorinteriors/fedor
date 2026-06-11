'use client'
import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { key: 'upload', label: 'Upload skice' },
  { key: 'review', label: 'Pregled analize' },
  { key: 'variants', label: '5 varijanti' },
  { key: 'pdf', label: 'PDF za klijenta' },
]

const STEP_ORDER = ['upload', 'analyzing', 'review', 'generating', 'variants', 'pdf']

interface Props {
  currentStep: string
}

export function StepIndicator({ currentStep }: Props) {
  const currentIndex = STEP_ORDER.indexOf(currentStep)

  const getDisplayStep = (stepKey: string) => {
    const idx = STEP_ORDER.indexOf(stepKey)
    return idx !== -1 ? idx : 0
  }

  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, i) => {
        const stepDisplayIdx = ['upload', 'review', 'variants', 'pdf'].indexOf(step.key)
        const stepRealIdx = STEP_ORDER.indexOf(step.key)
        const isDone = currentIndex > stepRealIdx
        const isActive =
          currentStep === step.key ||
          (step.key === 'review' && currentStep === 'analyzing') ||
          (step.key === 'variants' && currentStep === 'generating')

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
                  isDone
                    ? 'bg-amber-600 text-white'
                    : isActive
                    ? 'bg-stone-900 text-white ring-2 ring-amber-500 ring-offset-2'
                    : 'bg-stone-100 text-stone-400 border border-stone-200'
                )}
              >
                {isDone ? <CheckIcon className="w-4 h-4" /> : stepDisplayIdx + 1}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium whitespace-nowrap transition-colors',
                  isActive ? 'text-stone-900' : isDone ? 'text-amber-600' : 'text-stone-400'
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'w-16 h-px mx-2 mb-5 transition-colors duration-300',
                  currentIndex > stepRealIdx ? 'bg-amber-500' : 'bg-stone-200'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
