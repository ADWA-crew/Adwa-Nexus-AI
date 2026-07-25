import type { OnboardingFormData, PersonalizationResponse } from '@/types'
import { apiClient } from './client'

export async function personalizeVisitor(
  profile: OnboardingFormData,
): Promise<PersonalizationResponse> {
  return apiClient.request<PersonalizationResponse>('/visitor/personalize', {
    method: 'POST',
    body: JSON.stringify(profile),
  })
}

export async function getPersonalization(
  visitorId: string,
): Promise<PersonalizationResponse> {
  return apiClient.request<PersonalizationResponse>(`/visitor/${visitorId}/personalization`)
}
