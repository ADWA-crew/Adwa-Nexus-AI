import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PageTransition } from '@/app/components/PageTransition'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/services/api/client'
import type { ExploreItem } from '@/types'

async function getExploreItems(): Promise<ExploreItem[]> {
  return apiClient.request<ExploreItem[]>('/explore')
}

export default function ExplorePage() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['explore'],
    queryFn: getExploreItems,
  })

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <header className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold">Explore Ethiopia</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Discover the rich tapestry of Ethiopian history beyond the Battle of Adwa
        </p>
      </header>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <Badge className="absolute top-3 left-3">{item.region}</Badge>
              </div>
              <div className="p-5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  {item.era}
                </p>
                <h2 className="font-display text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {item.description}
                </p>
                {item.linkedArtifactId && (
                  <Link
                    to={`/artifact/${item.linkedArtifactId}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View related artifact →
                  </Link>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </PageTransition>
  )
}
