import { motion } from 'framer-motion'
import { useState } from 'react'
import ReactPlayer from 'react-player/lazy'
import { Badge } from '@/components/ui/badge'
import { MediaControls } from '@/components/molecules/MediaControls'
import type { Artifact } from '@/types'
import { cn } from '@/utils/cn'

interface ArtifactViewerProps {
  artifact: Artifact
  className?: string
}

export function ArtifactViewer({ artifact, className }: ArtifactViewerProps) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)
  const activeMedia = artifact.media[activeMediaIndex]

  return (
    <article className={cn('space-y-6', className)}>
      <header>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge>{artifact.era}</Badge>
          {artifact.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl font-bold"
        >
          {artifact.title}
        </motion.h1>
        {artifact.subtitle && (
          <p className="text-xl text-muted-foreground mt-2">{artifact.subtitle}</p>
        )}
      </header>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card aspect-video"
      >
        {activeMedia?.type === 'image' && (
          <img
            src={activeMedia.url}
            alt={activeMedia.caption ?? artifact.title}
            className="h-full w-full object-cover"
          />
        )}
        {activeMedia?.type === 'video' && (
          <ReactPlayer url={activeMedia.url} width="100%" height="100%" controls />
        )}
        {activeMedia?.type === 'audio' && (
          <div className="flex h-full items-center justify-center p-8">
            <MediaControls src={activeMedia.url} title={activeMedia.caption ?? artifact.title} />
          </div>
        )}
        {!activeMedia && (
          <div className="flex h-full items-center justify-center bg-border/20 text-muted-foreground">
            No media available
          </div>
        )}
      </motion.div>

      {artifact.media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Media gallery">
          {artifact.media.map((media, index) => (
            <button
              key={`${media.type}-${index}`}
              type="button"
              role="tab"
              aria-selected={index === activeMediaIndex}
              onClick={() => setActiveMediaIndex(index)}
              className={cn(
                'shrink-0 rounded-lg border px-4 py-2 text-sm capitalize transition-colors',
                index === activeMediaIndex
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/40',
              )}
            >
              {media.type}
            </button>
          ))}
        </div>
      )}

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">{artifact.description}</p>
      </div>

      {artifact.location && (
        <p className="text-sm text-muted-foreground">
          Floor {artifact.location.floor} · Room {artifact.location.room}
        </p>
      )}
    </article>
  )
}
