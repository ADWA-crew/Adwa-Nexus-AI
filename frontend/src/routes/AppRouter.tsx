import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/app/components/AppShell'
import { Skeleton } from '@/components/ui/skeleton'

const HomePage = lazy(() => import('@/features/home/HomePage'))
const ExplorePage = lazy(() => import('@/features/home/ExplorePage'))
const OnboardingPage = lazy(() => import('@/features/onboarding/OnboardingPage'))
const DashboardPage = lazy(() => import('@/features/personalization/DashboardPage'))
const JourneyPage = lazy(() => import('@/features/journey/JourneyPage'))
const ArtifactPage = lazy(() => import('@/features/artifact/ArtifactPage'))
const PassportPage = lazy(() => import('@/features/passport/PassportPage'))
const CertificatePage = lazy(() => import('@/features/certificate/CertificatePage'))
const AssistantPage = lazy(() => import('@/features/ai-companion/AssistantPage'))
const QrScannerPage = lazy(() => import('@/features/qr-scanner/QrScannerPage'))
const MapPage = lazy(() => import('@/features/journey/MapPage'))

function PageLoader() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 space-y-4">
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppShell>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/journey" element={<JourneyPage />} />
            <Route path="/artifact/:id" element={<ArtifactPage />} />
            <Route path="/passport" element={<PassportPage />} />
            <Route path="/certificate" element={<CertificatePage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/scan" element={<QrScannerPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/explore" element={<ExplorePage />} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  )
}
