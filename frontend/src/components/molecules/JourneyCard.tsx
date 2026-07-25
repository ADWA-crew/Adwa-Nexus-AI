import { motion } from 'framer-motion'
import { Check, Clock, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn, formatDuration } from '@/utils/cn'

interface JourneyCardProps {
  title: string
  description: string
  duration: number
  progress: number
  category: string
  completed?: boolean
  imageUrl?: string
  onClick?: () => void
  className?: string
}

export function JourneyCard({
  title,
  description,
  duration,
  progress,
  category,
  completed,
  imageUrl,
  onClick,
  className,
}: JourneyCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn('w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl', className)}
    >
      <Card hover className={cn('overflow-hidden', completed && 'border-primary/40')}>
        {imageUrl && (
          <div className="relative h-36 overflow-hidden">
            <img
              src={imageUrl}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {completed && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-[2px]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-5" />
                </div>
              </div>
            )}
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary">{category}</Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              {formatDuration(duration)}
            </span>
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              Stop {progress > 0 ? 'in progress' : 'up next'}
            </span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </CardContent>
      </Card>
    </motion.button>
  )
}
