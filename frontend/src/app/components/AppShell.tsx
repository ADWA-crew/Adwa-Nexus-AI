import { Link, NavLink } from 'react-router-dom'
import {
  Award,
  Compass,
  Home,
  Map,
  Menu,
  Moon,
  ScanLine,
  Sparkles,
  Stamp,
  Sun,
  X,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/app/contexts/ThemeContext'
import { useLocalization } from '@/app/contexts/LocalizationContext'
import { cn } from '@/utils/cn'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/dashboard', label: 'Dashboard', icon: Compass },
  { to: '/journey', label: 'Journey', icon: Sparkles },
  { to: '/passport', label: 'Passport', icon: Stamp },
  { to: '/certificate', label: 'Certificate', icon: Award },
  { to: '/assistant', label: 'AI Companion', icon: Sparkles },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/scan', label: 'Scan QR', icon: ScanLine },
]

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const { t } = useLocalization()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary font-display text-lg font-bold">
              A
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-lg font-semibold leading-none">Adwa Nexus</p>
              <p className="text-[10px] text-muted-foreground tracking-wide uppercase">AI Museum</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navItems.slice(0, 6).map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-border/30',
                  )
                }
              >
                <Icon className="size-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {resolvedTheme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <nav
            className="lg:hidden border-t border-border px-4 py-4 space-y-1"
            aria-label="Mobile navigation"
          >
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium',
                    isActive ? 'bg-primary/15 text-primary' : 'text-foreground',
                  )
                }
              >
                <Icon className="size-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border bg-card/50 py-8 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="font-display text-base text-foreground">Adwa Nexus AI</p>
          <p>{t.tagline}</p>
          <p>&copy; {new Date().getFullYear()} Adwa Nexus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
