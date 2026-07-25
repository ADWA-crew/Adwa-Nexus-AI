import type { Artifact } from '@/types'
import { apiClient } from './client'

export async function getArtifact(id: string): Promise<Artifact> {
  return apiClient.request<Artifact>(`/artifacts/${id}`)
}

export async function getArtifacts(): Promise<Artifact[]> {
  return apiClient.request<Artifact[]>('/artifacts')
}

export async function scanQrCode(code: string): Promise<Artifact> {
  return apiClient.request<Artifact>(`/artifacts/scan/${encodeURIComponent(code)}`)
}
