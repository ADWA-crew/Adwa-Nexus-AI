import { motion } from 'framer-motion'
import { Check, Circle } from 'lucide-react'
import type { JourneyStop } from '@/types'
import { cn } from '@/utils/cn'

interface JourneyTimelineProps {
  stops: JourneyStop[]
  activeStopId?: string
  onStopClick?: (stop: JourneyStop) => void
  className?: string
}

export function JourneyTimeline({
  stops,
  activeStopId,
  onStopClick,
  className,
}: JourneyTimelineProps) {
  const sorted = [...stops].sort((a, b) => a.order - b.order)

  return (
    <ol className={cn('relative space-y-0', className)} aria-label="Journey timeline">
      {sorted.map((stop, index) => {
        const isActive = stop.id === activeStopId
        const isLast = index === sorted.length - 1

        return (
          <li key={stop.id} className="relative flex gap-4 pb-8">
            {!isLast && (
              <div
                className={cn(
                  'absolute left-[15px] top-8 h-full w-0.5',
                  stop.completed ? 'bg-primary' : 'bg-border',
                )}
                aria-hidden="true"
              />
            )}

            <motion.button
              type="button"
              onClick={() => onStopClick?.(stop)}
              whileHover={{ scale: 1.05 }}
              className={cn(
                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                stop.completed
                  ? 'border-primary bg-primary text-primary-foreground'
                  : isActive
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-border bg-card text-muted-foreground',
              )}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`${stop.title}${stop.completed ? ', completed' : ''}`}
            >
              {stop.completed ? <Check className="size-4" /> : <Circle className="size-3" />}
            </motion.button>

            <div className="flex-1 pt-0.5">
              <h4
                className={cn(
                  'font-display text-lg font-semibold',
                  isActive && 'text-primary',
                )}
              >
                {stop.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {stop.description}
              </p>
              <p className="text-xs text-muted-foreground mt-2">{stop.duration} min</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
