import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { PageTransition } from '@/app/components/PageTransition'
import { AiChat } from '@/components/organisms/AiChat'
import { getChatSuggestions } from '@/services/api/ai.api'

export default function AssistantPage() {
  const [searchParams] = useSearchParams()
  const artifactId = searchParams.get('artifact') ?? undefined

  const { data: suggestions = [] } = useQuery({
    queryKey: ['ai-suggestions'],
    queryFn: getChatSuggestions,
  })

  return (
    <PageTransition className="mx-auto max-w-3xl px-4 md:px-6 py-10">
      <header className="mb-8 text-center">
        <h1 className="font-display text-4xl font-bold">AI Companion</h1>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          Your intelligent guide to the Battle of Adwa, Ethiopian heritage, and museum artifacts
        </p>
      </header>
      <AiChat suggestions={suggestions} artifactId={artifactId} />
    </PageTransition>
  )
}
