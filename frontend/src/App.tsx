import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import { AppRouter } from '@/routes/AppRouter'
import { ThemeProvider } from '@/app/contexts/ThemeContext'
import { LocalizationProvider } from '@/app/contexts/LocalizationContext'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { useAccessibilityClasses } from '@/hooks/useAccessibilityClasses'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

function AppProviders() {
  useSmoothScroll()
  useAccessibilityClasses()

  return (
    <ThemeProvider>
      <LocalizationProvider>
        <AnimatePresence mode="wait">
          <AppRouter />
        </AnimatePresence>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders />
    </QueryClientProvider>
  )
}
