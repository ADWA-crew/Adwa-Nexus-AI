import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Award, Stamp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { Passport as PassportType } from '@/types'
import { cn } from '@/utils/cn'

interface PassportProps {
  passport: PassportType
  className?: string
}

export function Passport({ passport, className }: PassportProps) {
  return (
    <Card className={cn('overflow-hidden border-2 border-primary/30', className)}>
      <div className="bg-gradient-to-br from-primary/20 via-transparent to-accent/10 px-6 py-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              Museum Passport
            </p>
            <CardTitle className="text-3xl">{passport.visitorName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {format(new Date(passport.visitDate), 'MMMM d, yyyy')}
            </p>
          </div>
          <Award className="size-10 text-primary" aria-hidden="true" />
        </div>
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Collection Progress</span>
            <span>{passport.completionPercent}%</span>
          </div>
          <Progress value={passport.completionPercent} className="h-3" />
        </div>
      </div>

      <CardHeader>
        <div className="flex items-center gap-2">
          <Stamp className="size-5 text-primary" />
          <CardTitle className="text-lg">Stamps Collected</CardTitle>
          <Badge>{passport.stamps.length}/{passport.totalStamps}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {passport.stamps.map((stamp, index) => (
            <motion.div
              key={stamp.id}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              className="flex flex-col items-center rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-center"
            >
              <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-card">
                <Stamp className="size-6 text-primary" />
              </div>
              <p className="text-xs font-medium line-clamp-2">{stamp.title}</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {format(new Date(stamp.earnedAt), 'h:mm a')}
              </p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
