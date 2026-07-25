import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { Language } from '@/types'
import { useExperienceStore } from '@/stores/visitor.store'

type Direction = 'ltr' | 'rtl'

interface LocaleStrings {
  tagline: string
  beginJourney: string
  explore: string
  passport: string
  certificate: string
  assistant: string
  map: string
  dashboard: string
  scanQr: string
  continue: string
  back: string
  loading: string
  welcome: string
}

const translations: Record<Language, LocaleStrings> = {
  ENGLISH: {
    tagline: 'Every visitor experiences history differently.',
    beginJourney: 'Begin Your Journey',
    explore: 'Explore Ethiopia',
    passport: 'Passport',
    certificate: 'Certificate',
    assistant: 'AI Companion',
    map: 'Museum Map',
    dashboard: 'Dashboard',
    scanQr: 'Scan QR Code',
    continue: 'Continue',
    back: 'Back',
    loading: 'Loading...',
    welcome: 'Welcome to Adwa Nexus',
  },
  AMHARIC: {
    tagline: 'እያንዳንዱ ጎብኝ ታሪክን በተለየ መንገድ ይለማመዳል።',
    beginJourney: 'ጉዞዎን ይጀምሩ',
    explore: 'ኢትዮጵያን ያስሱ',
    passport: 'ፓስፖርት',
    certificate: 'ሰርተፊኬት',
    assistant: 'የ AI ጓደኛ',
    map: 'የሙዚየም ካርታ',
    dashboard: 'ዳሽቦርድ',
    scanQr: 'QR ኮድ ይቃኙ',
    continue: 'ቀጥል',
    back: 'ተመለስ',
    loading: 'በመጫን ላይ...',
    welcome: 'እንኳን ወደ Adwa Nexus በደህና መጡ',
  },
  OROMO: {
    tagline: 'Seenaa tokkoon tokkoon daawwataa adda addaa.',
    beginJourney: 'Imala Keessan Jalqabaa',
    explore: 'Itoophiyaa Qoradhu',
    passport: 'Paaspoortii',
    certificate: 'Ragaa',
    assistant: 'AI Gargaaraa',
    map: 'Kaartaa Muuziyeemii',
    dashboard: 'Daashboordii',
    scanQr: 'Koodii QR Skaanii',
    continue: 'Itti fufi',
    back: 'Duubatti',
    loading: 'Fe\'aa jira...',
    welcome: 'Baga nagaan dhufte Adwa Nexus',
  },
  TIGRINYA: {
    tagline: 'ኩሉ ተዕዘብቲ ታሪኽ ብፍሉይ መንገዲ ይርእዮ።',
    beginJourney: 'ጉዕዞኻ ጀምር',
    explore: 'ኢትዮጵያ ምርምር',
    passport: 'ፓስፖርት',
    certificate: 'ሰርተፊኬት',
    assistant: 'AI መሓዛ',
    map: 'ካርታ ሙዚየም',
    dashboard: 'ዳሽቦርድ',
    scanQr: 'QR ኮድ ስካን',
    continue: 'ቀጽል',
    back: 'ተመለስ',
    loading: 'ይጽዕን ኣሎ...',
    welcome: 'እንቋዕ ብደሓን መጻእኩም Adwa Nexus',
  },
  FRENCH: {
    tagline: "Chaque visiteur vit l'histoire différemment.",
    beginJourney: 'Commencer le Voyage',
    explore: "Explorer l'Éthiopie",
    passport: 'Passeport',
    certificate: 'Certificat',
    assistant: 'Compagnon IA',
    map: 'Plan du Musée',
    dashboard: 'Tableau de Bord',
    scanQr: 'Scanner le QR',
    continue: 'Continuer',
    back: 'Retour',
    loading: 'Chargement...',
    welcome: 'Bienvenue à Adwa Nexus',
  },
}

interface LocalizationContextValue {
  language: Language
  direction: Direction
  t: LocaleStrings
  setLanguage: (language: Language) => void
}

const LocalizationContext = createContext<LocalizationContextValue | null>(null)

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const language = useExperienceStore((s) => s.language)
  const setLanguage = useExperienceStore((s) => s.setLanguage)

  const value = useMemo(
    () => ({
      language,
      direction: 'ltr' as Direction,
      t: translations[language] ?? translations.ENGLISH,
      setLanguage,
    }),
    [language, setLanguage],
  )

  return (
    <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>
  )
}

export function useLocalization() {
  const context = useContext(LocalizationContext)
  if (!context) throw new Error('useLocalization must be used within LocalizationProvider')
  return context
}
