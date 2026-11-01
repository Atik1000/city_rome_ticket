'use client'

import { Menu, X, PanelLeftOpen, PanelLeftClose, Landmark, ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/contexts/auth-context'
import { useEffect, useState } from 'react'

interface TopbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  isSidebarCollapsed: boolean
  onToggleSidebarCollapse: () => void
  isMobile: boolean
}

function getBreadcrumb(pathname: string): string[] {
  if (pathname === '/dashboard') return ['Dashboard']
  if (pathname.includes('/tours')) {
    if (/\/tours\/[^/]+\/dates\//.test(pathname)) return ['Tours', 'Time Slots']
    if (/\/tours\/[^/]+/.test(pathname)) return ['Tours', 'Tour Details']
    return ['Tours']
  }
  if (pathname.includes('/bookings')) {
    if (/\/bookings\/[^/]+/.test(pathname)) return ['Bookings', 'Booking Details']
    return ['Bookings']
  }
  if (pathname.includes('/contact-requests')) return ['Contact Requests']
  if (pathname.includes('/notices')) return ['Notices']
  if (pathname.includes('/settings')) return ['Settings']
  return ['Dashboard']
}

export function Topbar({
  isSidebarOpen,
  onToggleSidebar,
  isSidebarCollapsed,
  onToggleSidebarCollapse,
  isMobile
}: TopbarProps) {
  const [isDesktop, setIsDesktop] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    checkDesktop()
    window.addEventListener('resize', checkDesktop)

    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  const crumbs = getBreadcrumb(pathname)
  const initials =
    `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase() || 'A'

  return (
    <div className="bg-background border-b border-border h-16 flex items-center px-4 sm:px-6 md:px-8 w-full shadow-warm-sm">
      <div className="flex items-center justify-between w-full gap-3">
        {/* Left side - Hamburger menu for mobile, panel icons for desktop */}
        <div className="flex items-center gap-3 min-w-0">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="text-foreground hover:bg-secondary flex-shrink-0 md:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          )}

          {isDesktop && !isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebarCollapse}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary flex-shrink-0 hidden md:flex cursor-pointer"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </Button>
          )}

          {/* Breadcrumb / page title (desktop) */}
          <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1.5 min-w-0">
            {crumbs.map((crumb, i) => {
              const isLast = i === crumbs.length - 1
              return (
                <span key={crumb} className="flex items-center gap-1.5 min-w-0">
                  {i > 0 && (
                    <ChevronRight size={14} className="text-muted-foreground/60 shrink-0" aria-hidden="true" />
                  )}
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className={
                      isLast
                        ? 'font-display text-base font-semibold tracking-tight text-foreground truncate'
                        : 'text-sm text-muted-foreground truncate'
                    }
                  >
                    {crumb}
                  </span>
                </span>
              )
            })}
          </nav>
        </div>

        {/* Brand (shown on mobile where the sidebar is hidden) */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center ring-1 ring-gold/40">
            <Landmark size={16} className="text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold text-foreground">Iconic Rome</p>
            <p className="text-[9px] uppercase tracking-[0.2em] text-gold font-semibold">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Right side - admin avatar chip */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2.5 rounded-full border border-border/80 bg-card py-1 pl-1 pr-1 sm:pr-4 shadow-warm-sm">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground ring-1 ring-gold/40">
              {initials}
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-xs font-semibold text-foreground truncate max-w-[140px]">
                {user?.first_name ? `${user.first_name} ${user.last_name ?? ''}`.trim() : 'Administrator'}
              </p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground capitalize">
                {user?.role ?? 'admin'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
