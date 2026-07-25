import type { Passport } from '@/types'
import { apiClient } from './client'

export async function getPassport(): Promise<Passport> {
  return apiClient.request<Passport>('/passport')
}

export async function addPassportStamp(artifactId: string): Promise<Passport> {
  return apiClient.request<Passport>('/passport/stamps', {
    method: 'POST',
    body: JSON.stringify({ artifactId }),
  })
}
