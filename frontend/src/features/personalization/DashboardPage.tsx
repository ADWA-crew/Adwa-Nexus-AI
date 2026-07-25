import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Award,
  Compass,
  Map,
  ScanLine,
  Sparkles,
  Stamp,
} from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { PageTransition } from '@/app/components/PageTransition'
import { FeatureCard } from '@/components/molecules/FeatureCard'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { getJourney } from '@/services/api/journey.api'
import { useExperienceStore, useVisitorStore } from '@/stores/visitor.store'
import { formatDuration } from '@/utils/cn'

export default function DashboardPage() {
  const onboardingComplete = useVisitorStore((s) => s.onboardingComplete)
  const profile = useVisitorStore((s) => s.profile)
  const personalization = useVisitorStore((s) => s.personalization)
  const currentRoute = useExperienceStore((s) => s.currentRoute)

  const { data: journey, isLoading } = useQuery({
    queryKey: ['journey', currentRoute],
    queryFn: () => getJourney(currentRoute ?? undefined),
    enabled: onboardingComplete,
  })

  if (!onboardingComplete) {
    return <Navigate to="/onboarding" replace />
  }

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <header className="mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-muted-foreground mb-1">Visitor Dashboard</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold">
            Hello, {profile?.name.split(' ')[0]}
          </h1>
          {personalization && (
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge>{personalization.experienceMode}</Badge>
              <Badge variant="secondary">{personalization.language}</Badge>
              <Badge variant="outline">{personalization.recommendedRoute.replace(/_/g, ' ')}</Badge>
              <Badge variant="accent">{formatDuration(personalization.estimatedDuration)}</Badge>
            </div>
          )}
        </motion.div>
      </header>

      {isLoading ? (
        <Skeleton className="h-32 w-full mb-10 rounded-2xl" />
      ) : journey ? (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-6 md:p-8 mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-display text-2xl font-semibold">{journey.title}</h2>
              <p className="text-muted-foreground mt-1">{journey.description}</p>
            </div>
            <Link
              to="/journey"
              className="text-sm font-medium text-primary hover:underline shrink-0"
            >
              View full journey →
            </Link>
          </div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Journey Progress</span>
            <span>{journey.progress}%</span>
          </div>
          <Progress value={journey.progress} className="h-3" />
        </motion.section>
      ) : null}

      {personalization && (
        <section className="mb-10">
          <h2 className="font-display text-xl font-semibold mb-4">Your Experience Features</h2>
          <div className="flex flex-wrap gap-2">
            {personalization.features.map((feature) => (
              <Badge key={feature} variant="secondary">
                {feature.replace(/-/g, ' ')}
              </Badge>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-2xl font-semibold mb-6">Explore</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Your Journey"
            description="Follow your personalized route through the museum"
            icon={<Compass className="size-6" />}
            href="/journey"
            badge="Active"
          />
          <FeatureCard
            title="Scan Artifact"
            description="Point your camera at QR codes to unlock stories"
            icon={<ScanLine className="size-6" />}
            href="/scan"
          />
          <FeatureCard
            title="AI Companion"
            description="Ask questions about Adwa and Ethiopian history"
            icon={<Sparkles className="size-6" />}
            href="/assistant"
          />
          <FeatureCard
            title="Museum Map"
            description="Navigate floors, rooms, and points of interest"
            icon={<Map className="size-6" />}
            href="/map"
          />
          <FeatureCard
            title="Passport"
            description="Collect stamps as you discover artifacts"
            icon={<Stamp className="size-6" />}
            href="/passport"
          />
          <FeatureCard
            title="Certificate"
            description="Earn your completion certificate"
            icon={<Award className="size-6" />}
            href="/certificate"
          />
        </div>
      </section>
    </PageTransition>
  )
}
