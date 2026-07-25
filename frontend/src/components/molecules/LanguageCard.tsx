import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { Language } from '@/types'

const languageLabels: Record<Language, { native: string; english: string }> = {
  ENGLISH: { native: 'English', english: 'English' },
  AMHARIC: { native: 'አማርኛ', english: 'Amharic' },
  OROMO: { native: 'Afaan Oromoo', english: 'Oromo' },
  TIGRINYA: { native: 'ትግርኛ', english: 'Tigrinya' },
  FRENCH: { native: 'Français', english: 'French' },
}

interface LanguageCardProps {
  language: Language
  selected?: boolean
  onSelect: (language: Language) => void
}

export function LanguageCard({ language, selected, onSelect }: LanguageCardProps) {
  const labels = languageLabels[language]

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(language)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={selected}
      className={cn(
        'relative flex w-full flex-col items-start rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        selected
          ? 'border-primary bg-primary/10 shadow-sm'
          : 'border-border bg-card hover:border-primary/40',
      )}
    >
      {selected && (
        <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3.5" />
        </div>
      )}
      <span className="font-display text-xl font-semibold">{labels.native}</span>
      <span className="text-sm text-muted-foreground">{labels.english}</span>
    </motion.button>
  )
}
