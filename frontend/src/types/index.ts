export type ExperienceMode =
  | 'CHILD'
  | 'TEEN'
  | 'ADULT'
  | 'SENIOR'
  | 'FAMILY'
  | 'SCHOLAR'
  | 'TOURIST'

export type Language = 'ENGLISH' | 'AMHARIC' | 'OROMO' | 'TIGRINYA' | 'FRENCH'

export type ContentLevel = 'SIMPLE' | 'STANDARD' | 'DETAILED' | 'ACADEMIC'

export type MuseumRoute =
  | 'CHILD_ROUTE'
  | 'FAMILY_ROUTE'
  | 'STANDARD_ROUTE'
  | 'DEEP_DIVE_ROUTE'
  | 'ACCESSIBLE_ROUTE'

export type ExperienceTheme = 'FUN' | 'IMMERSIVE' | 'EDITORIAL' | 'MINIMAL'

export type AnimationLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export interface PersonalizationResponse {
  experienceMode: ExperienceMode
  language: Language
  contentLevel: ContentLevel
  recommendedRoute: MuseumRoute
  estimatedDuration: number
  theme: ExperienceTheme
  voiceNarration: boolean
  animationLevel: AnimationLevel
  features: string[]
}

export interface VisitorProfile {
  id?: string
  name: string
  ageGroup: ExperienceMode
  language: Language
  interests: string[]
  accessibilityNeeds: string[]
  visitPurpose: string
}

export interface JourneyStop {
  id: string
  title: string
  description: string
  artifactId?: string
  duration: number
  order: number
  completed: boolean
  imageUrl?: string
  category: string
}

export interface Journey {
  id: string
  title: string
  description: string
  route: MuseumRoute
  estimatedDuration: number
  progress: number
  stops: JourneyStop[]
}

export interface ArtifactMedia {
  type: 'image' | 'video' | 'audio' | '3d'
  url: string
  caption?: string
  thumbnail?: string
}

export interface Artifact {
  id: string
  title: string
  subtitle?: string
  era: string
  description: string
  shortDescription: string
  contentLevel: ContentLevel
  media: ArtifactMedia[]
  relatedArtifactIds: string[]
  location?: { lat: number; lng: number; floor: string; room: string }
  tags: string[]
  qrCode?: string
}

export interface PassportStamp {
  id: string
  artifactId: string
  title: string
  earnedAt: string
  imageUrl?: string
}

export interface Passport {
  visitorName: string
  visitDate: string
  route: MuseumRoute
  stamps: PassportStamp[]
  totalStamps: number
  completionPercent: number
}

export interface Certificate {
  visitorName: string
  visitDate: string
  routeTitle: string
  achievements: string[]
  certificateId: string
  museumName: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface AiChatResponse {
  message: string
  suggestions?: string[]
}

export interface MapLocation {
  id: string
  name: string
  lat: number
  lng: number
  floor: string
  type: 'artifact' | 'restroom' | 'entrance' | 'cafe' | 'exit'
  description?: string
}

export interface ExploreItem {
  id: string
  title: string
  region: string
  description: string
  imageUrl: string
  era: string
  linkedArtifactId?: string
}

export interface AccessibilitySettings {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  voiceNavigation: boolean
}

export interface OnboardingFormData {
  name: string
  ageGroup: ExperienceMode
  language: Language
  interests: string[]
  accessibilityNeeds: string[]
  visitPurpose: string
}
