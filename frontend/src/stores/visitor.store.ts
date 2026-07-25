import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  AccessibilitySettings,
  Artifact,
  ExperienceMode,
  Language,
  MuseumRoute,
  PersonalizationResponse,
  VisitorProfile,
} from '@/types'

interface VisitorState {
  profile: VisitorProfile | null
  personalization: PersonalizationResponse | null
  onboardingComplete: boolean
  setProfile: (profile: VisitorProfile) => void
  setPersonalization: (data: PersonalizationResponse) => void
  completeOnboarding: () => void
  reset: () => void
}

export const useVisitorStore = create<VisitorState>()(
  persist(
    (set) => ({
      profile: null,
      personalization: null,
      onboardingComplete: false,
      setProfile: (profile) => set({ profile }),
      setPersonalization: (personalization) => set({ personalization }),
      completeOnboarding: () => set({ onboardingComplete: true }),
      reset: () =>
        set({ profile: null, personalization: null, onboardingComplete: false }),
    }),
    { name: 'adwa-visitor' },
  ),
)

interface ExperienceState {
  experienceMode: ExperienceMode | null
  language: Language
  currentRoute: MuseumRoute | null
  currentArtifact: Artifact | null
  setExperienceMode: (mode: ExperienceMode) => void
  setLanguage: (language: Language) => void
  setCurrentRoute: (route: MuseumRoute) => void
  setCurrentArtifact: (artifact: Artifact | null) => void
}

export const useExperienceStore = create<ExperienceState>()((set) => ({
  experienceMode: null,
  language: 'ENGLISH',
  currentRoute: null,
  currentArtifact: null,
  setExperienceMode: (experienceMode) => set({ experienceMode }),
  setLanguage: (language) => set({ language }),
  setCurrentRoute: (currentRoute) => set({ currentRoute }),
  setCurrentArtifact: (currentArtifact) => set({ currentArtifact }),
}))

interface AccessibilityState extends AccessibilitySettings {
  setHighContrast: (value: boolean) => void
  setLargeText: (value: boolean) => void
  setReducedMotion: (value: boolean) => void
  setVoiceNavigation: (value: boolean) => void
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      voiceNavigation: false,
      setHighContrast: (highContrast) => set({ highContrast }),
      setLargeText: (largeText) => set({ largeText }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setVoiceNavigation: (voiceNavigation) => set({ voiceNavigation }),
    }),
    { name: 'adwa-accessibility' },
  ),
)

interface JourneyProgressState {
  completedStopIds: string[]
  markStopComplete: (stopId: string) => void
  resetProgress: () => void
}

export const useJourneyProgressStore = create<JourneyProgressState>()(
  persist(
    (set) => ({
      completedStopIds: [],
      markStopComplete: (stopId) =>
        set((state) => ({
          completedStopIds: state.completedStopIds.includes(stopId)
            ? state.completedStopIds
            : [...state.completedStopIds, stopId],
        })),
      resetProgress: () => set({ completedStopIds: [] }),
    }),
    { name: 'adwa-journey-progress' },
  ),
)
