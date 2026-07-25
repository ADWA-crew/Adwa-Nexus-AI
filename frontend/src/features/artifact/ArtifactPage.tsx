import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageTransition } from '@/app/components/PageTransition'
import { ArtifactViewer } from '@/components/organisms/ArtifactViewer'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getArtifact } from '@/services/api/artifact.api'
import { useExperienceStore } from '@/stores/visitor.store'

export default function ArtifactPage() {
  const { id } = useParams<{ id: string }>()
  const setCurrentArtifact = useExperienceStore((s) => s.setCurrentArtifact)

  const { data: artifact, isLoading, error } = useQuery({
    queryKey: ['artifact', id],
    queryFn: () => getArtifact(id!),
    enabled: !!id,
  })

  useEffect(() => {
    if (artifact) setCurrentArtifact(artifact)
    return () => setCurrentArtifact(null)
  }, [artifact, setCurrentArtifact])

  if (isLoading) {
    return (
      <PageTransition className="mx-auto max-w-4xl px-4 py-10 space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <Skeleton className="h-32 w-full" />
      </PageTransition>
    )
  }

  if (error || !artifact) {
    return (
      <PageTransition className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold mb-4">Artifact not found</h1>
        <Button asChild>
          <Link to="/dashboard">Return to Dashboard</Link>
        </Button>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="mx-auto max-w-4xl px-4 md:px-6 py-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <ArtifactViewer artifact={artifact} />
        <div className="flex flex-wrap gap-4 mt-10 pt-8 border-t border-border">
          <Button asChild variant="secondary">
            <Link to={`/assistant?artifact=${artifact.id}`}>Ask AI about this</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/journey">Back to Journey</Link>
          </Button>
        </div>
      </motion.div>
    </PageTransition>
  )
}
