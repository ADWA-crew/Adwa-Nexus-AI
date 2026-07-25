import type { AiChatResponse } from '@/types'
import { apiClient } from './client'

export async function sendChatMessage(
  message: string,
  context?: { artifactId?: string; journeyStopId?: string },
): Promise<AiChatResponse> {
  return apiClient.request<AiChatResponse>('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message, context }),
  })
}

export async function getChatSuggestions(): Promise<string[]> {
  return apiClient.request<string[]>('/ai/suggestions')
}
