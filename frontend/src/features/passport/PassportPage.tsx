import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Navigate } from 'react-router-dom'
import { PageTransition } from '@/app/components/PageTransition'
import { Passport as PassportOrganism } from '@/components/organisms/Passport'
import { Skeleton } from '@/components/ui/skeleton'
import { getPassport } from '@/services/api/passport.api'
import { useVisitorStore } from '@/stores/visitor.store'

export default function PassportPage() {
  const onboardingComplete = useVisitorStore((s) => s.onboardingComplete)

  const { data: passport, isLoading } = useQuery({
    queryKey: ['passport'],
    queryFn: getPassport,
    enabled: onboardingComplete,
  })

  if (!onboardingComplete) {
    return <Navigate to="/onboarding" replace />
  }

  if (isLoading) {
    return (
      <PageTransition className="mx-auto max-w-2xl px-4 py-10">
        <Skeleton className="h-96 w-full rounded-2xl" />
      </PageTransition>
    )
  }

  if (!passport) return null

  return (
    <PageTransition className="mx-auto max-w-2xl px-4 md:px-6 py-10">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="font-display text-4xl font-bold">Your Passport</h1>
        <p className="text-muted-foreground mt-2">
          Collect stamps as you explore artifacts throughout the museum
        </p>
      </motion.header>
      <PassportOrganism passport={passport} />
    </PageTransition>
  )
}
