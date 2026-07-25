import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Send, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { sendChatMessage } from '@/services/api/ai.api'
import type { ChatMessage } from '@/types'
import { cn } from '@/utils/cn'

interface AiChatProps {
  suggestions?: string[]
  artifactId?: string
  className?: string
}

export function AiChat({ suggestions = [], artifactId, className }: AiChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am your Adwa Nexus AI companion. Ask me anything about the Battle of Adwa, Ethiopian history, or artifacts in the museum.',
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await sendChatMessage(text, { artifactId })
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.message,
          timestamp: new Date().toISOString(),
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'I apologize, but I am temporarily unavailable. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={cn('flex flex-col h-[600px] rounded-2xl border border-border bg-card overflow-hidden', className)}
      role="region"
      aria-label="AI Companion chat"
    >
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
          <Sparkles className="size-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">AI Companion</h3>
          <p className="text-xs text-muted-foreground">Powered by Adwa Nexus AI</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'max-w-[85%] rounded-2xl px-4 py-3 text-sm',
                message.role === 'user'
                  ? 'ml-auto bg-primary text-primary-foreground'
                  : 'bg-border/30 text-foreground',
              )}
            >
              {message.content}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="size-4 animate-spin" />
            Thinking...
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-4 pb-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => void sendMessage(suggestion)}
              className="shrink-0 rounded-full border border-border px-3 py-1 text-xs hover:border-primary/40 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <form
        className="flex gap-2 border-t border-border p-4"
        onSubmit={(e) => {
          e.preventDefault()
          void sendMessage(input)
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Adwa, artifacts, or history..."
          aria-label="Chat message"
          disabled={loading}
        />
        <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Send message">
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  )
}
