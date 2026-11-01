'use client'

import { Menu, X, PanelLeftOpen, PanelLeftClose, Landmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface TopbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  isSidebarCollapsed: boolean
  onToggleSidebarCollapse: () => void
  isMobile: boolean
}

export function Topbar({ 
  isSidebarOpen, 
  onToggleSidebar,
  isSidebarCollapsed,
  onToggleSidebarCollapse,
  isMobile
}: TopbarProps) {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  return (
    <div className="bg-background border-b border-border h-16 flex items-center px-4 sm:px-6 md:px-8 w-full shadow-sm">
      <div className="flex items-center justify-between w-full">
        {/* Left side - Hamburger menu for mobile, panel icons for desktop */}
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="text-foreground hover:bg-secondary flex-shrink-0 md:hidden"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          )}

          {isDesktop && !isMobile && (
            <Button
              variant="default"
              size="icon"
              onClick={onToggleSidebarCollapse}
              className="text-foreground hover:bg-primary/50 flex-shrink-0 hidden md:flex"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={24} /> : <PanelLeftClose size={24} />}
            </Button>
          )}
        </div>

        {/* Brand (shown on mobile where the sidebar is hidden) */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Landmark size={16} className="text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-foreground">Iconic Rome</p>
            <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Right side - Can add more items here */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Add more topbar items here if needed */}
        </div>
      </div>
    </div>
  )
}
