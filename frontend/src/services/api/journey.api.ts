import type { Journey } from '@/types'
import { apiClient } from './client'

export async function getJourney(route?: string): Promise<Journey> {
  const query = route ? `?route=${encodeURIComponent(route)}` : ''
  return apiClient.request<Journey>(`/journey${query}`)
}

export async function completeJourneyStop(stopId: string): Promise<Journey> {
  return apiClient.request<Journey>(`/journey/stops/${stopId}/complete`, {
    method: 'POST',
  })
}
