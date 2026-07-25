import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utils/cn'

interface FeatureCardProps {
  title: string
  description: string
  icon: ReactNode
  href: string
  badge?: string
  className?: string
}

export function FeatureCard({
  title,
  description,
  icon,
  href,
  badge,
  className,
}: FeatureCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link to={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
        <Card hover className={cn('group h-full overflow-hidden', className)}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                {icon}
              </div>
              {badge && <Badge variant="secondary">{badge}</Badge>}
            </div>
            <CardTitle className="group-hover:text-primary transition-colors">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              Explore
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
