import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { PageTransition } from '@/app/components/PageTransition'
import { Certificate as CertificateOrganism } from '@/components/organisms/Certificate'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/services/api/client'
import type { Certificate } from '@/types'
import { useVisitorStore } from '@/stores/visitor.store'

async function getCertificate(): Promise<Certificate> {
  return apiClient.request<Certificate>('/certificate')
}

export default function CertificatePage() {
  const onboardingComplete = useVisitorStore((s) => s.onboardingComplete)

  const { data: certificate, isLoading } = useQuery({
    queryKey: ['certificate'],
    queryFn: getCertificate,
    enabled: onboardingComplete,
  })

  if (!onboardingComplete) {
    return <Navigate to="/onboarding" replace />
  }

  if (isLoading) {
    return (
      <PageTransition className="mx-auto max-w-2xl px-4 py-10">
        <Skeleton className="h-[500px] w-full rounded-2xl" />
      </PageTransition>
    )
  }

  if (!certificate) return null

  return (
    <PageTransition className="mx-auto max-w-2xl px-4 md:px-6 py-10">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="font-display text-4xl font-bold">Certificate of Completion</h1>
        <p className="text-muted-foreground mt-2">
          Congratulations on completing your Adwa Nexus journey
        </p>
      </motion.header>

      <CertificateOrganism certificate={certificate} />

      <div className="flex justify-center mt-8">
        <Button variant="outline" onClick={() => window.print()}>
          <Download className="size-4" />
          Save / Print Certificate
        </Button>
      </div>
    </PageTransition>
  )
}
