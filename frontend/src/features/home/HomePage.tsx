import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PageTransition } from '@/app/components/PageTransition'
import { Hero } from '@/components/organisms/Hero'
import { Button } from '@/components/ui/button'
import { useVisitorStore } from '@/stores/visitor.store'

export default function HomePage() {
  const onboardingComplete = useVisitorStore((s) => s.onboardingComplete)

  return (
    <PageTransition>
      <Hero />
      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        {!onboardingComplete ? (
          <>
            <h2 className="font-display text-3xl font-bold mb-4">
              Your story begins here
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Complete a brief personalization to receive a curated museum experience
              tailored to your interests, language, and accessibility needs.
            </p>
            <Button asChild size="lg">
              <Link to="/onboarding">
                Personalize My Visit
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </>
        ) : (
          <>
            <h2 className="font-display text-3xl font-bold mb-4">Ready to continue?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Your personalized journey awaits. Pick up where you left off or explore something new.
            </p>
            <Button asChild size="lg">
              <Link to="/dashboard">
                Go to Dashboard
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </>
        )}
      </section>
    </PageTransition>
  )
}
