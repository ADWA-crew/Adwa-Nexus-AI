import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Navigate, useNavigate } from 'react-router-dom'
import { PageTransition } from '@/app/components/PageTransition'
import { JourneyCard } from '@/components/molecules/JourneyCard'
import { JourneyTimeline } from '@/components/organisms/JourneyTimeline'
import { Skeleton } from '@/components/ui/skeleton'
import { completeJourneyStop, getJourney } from '@/services/api/journey.api'
import { useExperienceStore, useJourneyProgressStore, useVisitorStore } from '@/stores/visitor.store'

export default function JourneyPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const onboardingComplete = useVisitorStore((s) => s.onboardingComplete)
  const currentRoute = useExperienceStore((s) => s.currentRoute)
  const completedStopIds = useJourneyProgressStore((s) => s.completedStopIds)
  const markStopComplete = useJourneyProgressStore((s) => s.markStopComplete)

  const { data: journey, isLoading } = useQuery({
    queryKey: ['journey', currentRoute],
    queryFn: () => getJourney(currentRoute ?? undefined),
    enabled: onboardingComplete,
  })

  const completeMutation = useMutation({
    mutationFn: completeJourneyStop,
    onSuccess: (data, stopId) => {
      markStopComplete(stopId)
      queryClient.setQueryData(['journey', currentRoute], data)
    },
  })

  if (!onboardingComplete) {
    return <Navigate to="/onboarding" replace />
  }

  if (isLoading) {
    return (
      <PageTransition className="mx-auto max-w-5xl px-4 py-10 space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </PageTransition>
    )
  }

  if (!journey) return null

  const enrichedStops = journey.stops.map((stop) => ({
    ...stop,
    completed: stop.completed || completedStopIds.includes(stop.id),
  }))

  const activeStop = enrichedStops.find((s) => !s.completed)

  return (
    <PageTransition className="mx-auto max-w-5xl px-4 md:px-6 py-10">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-sm text-muted-foreground mb-1">Personalized Route</p>
        <h1 className="font-display text-4xl font-bold">{journey.title}</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">{journey.description}</p>
      </motion.header>

      <div className="grid gap-10 lg:grid-cols-2">
        <section aria-label="Journey timeline">
          <h2 className="font-display text-xl font-semibold mb-6">Timeline</h2>
          <JourneyTimeline
            stops={enrichedStops}
            activeStopId={activeStop?.id}
            onStopClick={(stop) => {
              if (stop.artifactId) {
                navigate(`/artifact/${stop.artifactId}`)
              }
            }}
          />
        </section>

        <section aria-label="Journey stops">
          <h2 className="font-display text-xl font-semibold mb-6">Stops</h2>
          <div className="space-y-4">
            {enrichedStops.map((stop) => (
              <JourneyCard
                key={stop.id}
                title={stop.title}
                description={stop.description}
                duration={stop.duration}
                progress={stop.completed ? 100 : stop.id === activeStop?.id ? 50 : 0}
                category={stop.category}
                completed={stop.completed}
                imageUrl={stop.imageUrl}
                onClick={() => {
                  if (stop.artifactId) {
                    navigate(`/artifact/${stop.artifactId}`)
                  }
                  if (!stop.completed) {
                    completeMutation.mutate(stop.id)
                  }
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
