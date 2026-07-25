import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Medal, Sparkles } from 'lucide-react'
import type { Certificate as CertificateType } from '@/types'
import { cn } from '@/utils/cn'

interface CertificateProps {
  certificate: CertificateType
  className?: string
}

export function Certificate({ certificate, className }: CertificateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative overflow-hidden rounded-2xl border-4 border-primary/40 bg-card p-8 md:p-12 text-center shadow-2xl',
        className,
      )}
      role="article"
      aria-label={`Certificate for ${certificate.visitorName}`}
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--color-primary),transparent_70%)]" />
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15"
      >
        <Medal className="size-8 text-primary" />
      </motion.div>

      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
        Certificate of Completion
      </p>
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
        {certificate.visitorName}
      </h2>
      <p className="text-muted-foreground mb-8">
        has completed the <strong className="text-foreground">{certificate.routeTitle}</strong>{' '}
        at {certificate.museumName}
      </p>

      <div className="mx-auto max-w-md space-y-3 mb-8">
        {certificate.achievements.map((achievement, i) => (
          <motion.div
            key={achievement}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="flex items-center gap-2 text-sm"
          >
            <Sparkles className="size-4 text-primary shrink-0" />
            <span>{achievement}</span>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border text-sm text-muted-foreground">
        <span>{format(new Date(certificate.visitDate), 'MMMM d, yyyy')}</span>
        <span className="font-mono text-xs">ID: {certificate.certificateId}</span>
      </div>
    </motion.div>
  )
}
