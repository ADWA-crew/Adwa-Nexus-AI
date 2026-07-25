import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useLocalization } from '@/app/contexts/LocalizationContext'
import { useVisitorStore } from '@/stores/visitor.store'
import { cn } from '@/utils/cn'

interface HeroProps {
  className?: string
}

export function Hero({ className }: HeroProps) {
  const { t } = useLocalization()
  const profile = useVisitorStore((s) => s.profile)
  const personalization = useVisitorStore((s) => s.personalization)

  return (
    <section
      className={cn(
        'relative min-h-[85vh] flex flex-col justify-center overflow-hidden gradient-hero px-6 py-20',
        className,
      )}
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-primary/30"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0.3,
            }}
            animate={{
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary"
        >
          Adwa Nexus AI
        </motion.p>

        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-balance leading-[0.95] mb-6"
        >
          {profile ? `Welcome, ${profile.name.split(' ')[0]}` : t.welcome}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-muted-foreground text-balance mb-10"
        >
          {t.tagline}
          {personalization && (
            <span className="block mt-3 text-foreground">
              Your personalized {personalization.experienceMode.toLowerCase()} experience awaits —{' '}
              {personalization.estimatedDuration} minutes of curated history.
            </span>
          )}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          <Button asChild size="lg">
            <Link to="/dashboard">{t.beginJourney}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/explore">{t.explore}</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
