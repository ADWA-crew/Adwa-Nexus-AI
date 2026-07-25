import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { PageTransition } from '@/app/components/PageTransition'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LanguageCard } from '@/components/molecules/LanguageCard'
import { Badge } from '@/components/ui/badge'
import { personalizeVisitor } from '@/services/api/visitor.api'
import {
  useExperienceStore,
  useVisitorStore,
} from '@/stores/visitor.store'
import type { ExperienceMode, Language } from '@/types'
import { cn } from '@/utils/cn'

const onboardingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  ageGroup: z.enum(['CHILD', 'TEEN', 'ADULT', 'SENIOR', 'FAMILY', 'SCHOLAR', 'TOURIST']),
  language: z.enum(['ENGLISH', 'AMHARIC', 'OROMO', 'TIGRINYA', 'FRENCH']),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  accessibilityNeeds: z.array(z.string()),
  visitPurpose: z.string().min(1, 'Please select a visit purpose'),
})

type OnboardingForm = z.infer<typeof onboardingSchema>

const ageGroups: { value: ExperienceMode; label: string; description: string }[] = [
  { value: 'CHILD', label: 'Child', description: 'Ages 6–12, playful storytelling' },
  { value: 'TEEN', label: 'Teen', description: 'Ages 13–17, interactive discovery' },
  { value: 'ADULT', label: 'Adult', description: 'Standard immersive experience' },
  { value: 'SENIOR', label: 'Senior', description: 'Comfortable pace, rich narration' },
  { value: 'FAMILY', label: 'Family', description: 'Multi-generational journey' },
  { value: 'SCHOLAR', label: 'Scholar', description: 'Deep academic exploration' },
  { value: 'TOURIST', label: 'Tourist', description: 'Highlights and essentials' },
]

const interestOptions = [
  'Battle of Adwa',
  'Ethiopian Empire',
  'Military History',
  'Art & Culture',
  'Photography',
  'Architecture',
  'Royal Heritage',
  'African Independence',
]

const purposeOptions = [
  'First visit',
  'School trip',
  'Research',
  'Family outing',
  'Cultural tourism',
]

const accessibilityOptions = [
  'Wheelchair access',
  'Visual impairment support',
  'Hearing impairment support',
  'Cognitive accessibility',
  'None',
]

const languages: Language[] = ['ENGLISH', 'AMHARIC', 'OROMO', 'TIGRINYA', 'FRENCH']

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const setProfile = useVisitorStore((s) => s.setProfile)
  const setPersonalization = useVisitorStore((s) => s.setPersonalization)
  const completeOnboarding = useVisitorStore((s) => s.completeOnboarding)
  const setExperienceMode = useExperienceStore((s) => s.setExperienceMode)
  const setLanguage = useExperienceStore((s) => s.setLanguage)
  const setCurrentRoute = useExperienceStore((s) => s.setCurrentRoute)

  const form = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: '',
      ageGroup: 'ADULT',
      language: 'ENGLISH',
      interests: [],
      accessibilityNeeds: [],
      visitPurpose: '',
    },
  })

  const { watch, setValue, getValues, trigger } = form
  const selectedInterests = watch('interests')
  const selectedAccessibility = watch('accessibilityNeeds')

  const toggleArrayValue = (field: 'interests' | 'accessibilityNeeds', value: string) => {
    const current = getValues(field)
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    setValue(field, next, { shouldValidate: true })
  }

  const steps = [
    { title: 'Welcome', subtitle: 'Tell us your name to personalize your journey' },
    { title: 'Experience', subtitle: 'Who is visiting the museum today?' },
    { title: 'Language', subtitle: 'Choose your preferred language' },
    { title: 'Interests', subtitle: 'What aspects of history fascinate you?' },
    { title: 'Accessibility', subtitle: 'We want everyone to enjoy Adwa Nexus' },
    { title: 'Purpose', subtitle: 'What brings you to the museum?' },
  ]

  const validateStep = async () => {
    switch (step) {
      case 0:
        return trigger('name')
      case 1:
        return trigger('ageGroup')
      case 2:
        return trigger('language')
      case 3:
        return trigger('interests')
      case 4:
        return true
      case 5:
        return trigger('visitPurpose')
      default:
        return true
    }
  }

  const nextStep = async () => {
    const valid = await validateStep()
    if (!valid) return
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      await submitOnboarding()
    }
  }

  const submitOnboarding = async () => {
    setSubmitting(true)
    try {
      const data = getValues()
      const personalization = await personalizeVisitor(data)

      setProfile({
        name: data.name,
        ageGroup: data.ageGroup,
        language: data.language,
        interests: data.interests,
        accessibilityNeeds: data.accessibilityNeeds,
        visitPurpose: data.visitPurpose,
      })
      setPersonalization(personalization)
      setExperienceMode(personalization.experienceMode)
      setLanguage(personalization.language)
      setCurrentRoute(personalization.recommendedRoute)
      completeOnboarding()
      navigate('/dashboard')
    } catch {
      form.setError('root', { message: 'Failed to personalize experience. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageTransition className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary">
              Step {step + 1} of {steps.length}
            </Badge>
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1.5 w-8 rounded-full transition-colors',
                    i <= step ? 'bg-primary' : 'bg-border',
                  )}
                />
              ))}
            </div>
          </div>
          <motion.h1
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display text-3xl md:text-4xl font-bold"
          >
            {steps[step].title}
          </motion.h1>
          <p className="text-muted-foreground mt-2">{steps[step].subtitle}</p>
        </div>

        <motion.div
          key={`step-${step}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm"
        >
          {step === 0 && (
            <div className="space-y-4">
              <Input
                {...form.register('name')}
                placeholder="Your name"
                aria-label="Your name"
                autoFocus
              />
              {form.formState.errors.name && (
                <p className="text-sm text-accent">{form.formState.errors.name.message}</p>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {ageGroups.map((group) => (
                <button
                  key={group.value}
                  type="button"
                  onClick={() => setValue('ageGroup', group.value)}
                  className={cn(
                    'rounded-xl border p-4 text-left transition-colors',
                    watch('ageGroup') === group.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/40',
                  )}
                >
                  <p className="font-semibold">{group.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {languages.map((lang) => (
                <LanguageCard
                  key={lang}
                  language={lang}
                  selected={watch('language') === lang}
                  onSelect={(l) => setValue('language', l)}
                />
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleArrayValue('interests', interest)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm transition-colors',
                    selectedInterests.includes(interest)
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border hover:border-primary/40',
                  )}
                >
                  {interest}
                </button>
              ))}
              {form.formState.errors.interests && (
                <p className="w-full text-sm text-accent mt-2">
                  {form.formState.errors.interests.message}
                </p>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-wrap gap-2">
              {accessibilityOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleArrayValue('accessibilityNeeds', option)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm transition-colors',
                    selectedAccessibility.includes(option)
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border hover:border-primary/40',
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              {purposeOptions.map((purpose) => (
                <button
                  key={purpose}
                  type="button"
                  onClick={() => setValue('visitPurpose', purpose)}
                  className={cn(
                    'w-full rounded-xl border p-4 text-left transition-colors',
                    watch('visitPurpose') === purpose
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/40',
                  )}
                >
                  {purpose}
                </button>
              ))}
            </div>
          )}

          {form.formState.errors.root && (
            <p className="text-sm text-accent mt-4">{form.formState.errors.root.message}</p>
          )}
        </motion.div>

        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="ghost"
            onClick={() => (step > 0 ? setStep(step - 1) : navigate('/'))}
            disabled={submitting}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Button type="button" onClick={() => void nextStep()} disabled={submitting}>
            {step === steps.length - 1 ? (
              <>
                <Sparkles className="size-4" />
                {submitting ? 'Personalizing...' : 'Start Journey'}
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
