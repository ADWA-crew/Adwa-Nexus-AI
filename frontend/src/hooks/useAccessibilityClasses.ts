import { useEffect } from 'react'
import { useAccessibilityStore } from '@/stores/visitor.store'

export function useAccessibilityClasses() {
  const { highContrast, largeText, reducedMotion } = useAccessibilityStore()

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('high-contrast', highContrast)
    root.classList.toggle('large-text', largeText)
    root.classList.toggle('reduce-motion', reducedMotion)
  }, [highContrast, largeText, reducedMotion])
}
