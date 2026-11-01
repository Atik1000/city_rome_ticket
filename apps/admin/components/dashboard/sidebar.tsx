'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, LayoutGroup, useReducedMotion } from 'framer-motion'
import {
  LayoutDashboard,
  Landmark,
  Plane,
  BookOpen,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/app/contexts/auth-context'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface SidebarProps {
  isMobile?: boolean
  onClose?: () => void
  isCollapsed?: boolean
}

const MotionLink = motion.create(Link)

export function Sidebar({ isMobile = false, onClose, isCollapsed = false }: SidebarProps) {
  const pathname = usePathname()
  const { logout, user } = useAuth()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const reduceMotion = useReducedMotion()

  // Pill that slides between the active nav items (static under reduced motion)
  const activePill = reduceMotion ? (
    <span className="absolute inset-0 rounded-lg bg-sidebar-primary" />
  ) : (
    <motion.span
      layoutId="sidebar-active-pill"
      className="absolute inset-0 rounded-lg bg-sidebar-primary"
      transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
    />
  )

  const linkHover = reduceMotion ? {} : { whileHover: 'hover' as const }
  const iconVariants = reduceMotion ? undefined : { hover: { scale: 1.05 } }

  const sections = [
    {
      label: 'Overview',
      routes: [
        {
          label: 'Dashboard',
          icon: LayoutDashboard,
          href: '/dashboard',
          active: pathname === '/dashboard',
        },
      ],
    },
    {
      label: 'Manage',
      routes: [
        {
          label: 'Tours',
          icon: Plane,
          href: '/dashboard/tours',
          active: pathname.includes('/tours'),
        },
        {
          label: 'Bookings',
          icon: BookOpen,
          href: '/dashboard/bookings',
          active: pathname.includes('/bookings'),
        },
        {
          label: 'Contact Requests',
          icon: MessageSquare,
          href: '/dashboard/contact-requests',
          active: pathname.includes('/contact-requests'),
        },
        {
          label: 'Notices',
          icon: Bell,
          href: '/dashboard/notices',
          active: pathname.includes('/notices'),
        },
      ],
    },
  ]

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  const handleConfirmLogout = () => {
    logout()
    if (isMobile && onClose) {
      onClose()
    }
    setShowLogoutDialog(false)
  }

  // On mobile/tablet, always show labels. On desktop, respect collapse state
  const shouldShowLabels = isMobile || !isCollapsed

  return (
    <LayoutGroup id={isMobile ? 'sidebar-mobile' : 'sidebar-desktop'}>
      <div
        className={cn(
          'bg-sidebar text-sidebar-foreground h-full flex flex-col border-r border-sidebar-border overflow-hidden transition-all duration-300',
          isCollapsed && !isMobile ? 'w-20' : 'w-64'
        )}
      >
        {/* Logo Section */}
        <div
          className={cn(
            'flex items-center gap-3 p-4 border-b border-sidebar-border flex-shrink-0',
            isCollapsed && !isMobile ? 'justify-center' : ''
          )}
        >
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center flex-shrink-0 shadow-md ring-1 ring-gold/50">
            <Landmark size={20} className="text-sidebar-primary-foreground" />
          </div>
          {shouldShowLabels && (
            <div className="min-w-0">
              <p className="font-display font-semibold text-lg leading-tight tracking-tight text-sidebar-foreground truncate">
                Iconic Rome
              </p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-gold font-semibold">
                Admin Panel
              </p>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {sections.map((section, sectionIndex) => (
            <div key={section.label}>
              {shouldShowLabels ? (
                <p
                  className={cn(
                    'px-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-sidebar-foreground/45',
                    sectionIndex === 0 ? 'pt-2' : 'pt-6'
                  )}
                >
                  {section.label}
                </p>
              ) : (
                sectionIndex > 0 && (
                  <div className="mx-3 my-4 h-px bg-sidebar-border" aria-hidden="true" />
                )
              )}
              <div className="space-y-1.5">
                {section.routes.map((route) => {
                  const Icon = route.icon
                  return (
                    <MotionLink
                      key={route.href}
                      href={route.href}
                      onClick={handleLinkClick}
                      {...linkHover}
                      className={cn(
                        'relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-base outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/60',
                        isCollapsed && !isMobile ? 'justify-center p-3' : '',
                        route.active
                          ? 'text-sidebar-primary-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )}
                      title={isCollapsed && !isMobile ? route.label : undefined}
                    >
                      {route.active && activePill}
                      {route.active && (
                        <span
                          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gold"
                          aria-hidden="true"
                        />
                      )}
                      <motion.span
                        className="relative flex-shrink-0 flex items-center"
                        variants={iconVariants}
                        transition={{ duration: 0.15 }}
                      >
                        <Icon size={20} />
                      </motion.span>
                      {shouldShowLabels && <span className="relative">{route.label}</span>}
                    </MotionLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Section - Settings & Logout */}
        <div className="border-t border-sidebar-border p-3 space-y-2 flex-shrink-0">
          {/* Settings Link */}
          {user?.role === 'admin' && (
            <MotionLink
              href="/dashboard/settings"
              onClick={handleLinkClick}
              {...linkHover}
              className={cn(
                'relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-base outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/60',
                isCollapsed && !isMobile ? 'justify-center p-3' : '',
                pathname.includes('/settings')
                  ? 'text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
              title={isCollapsed && !isMobile ? 'Settings' : undefined}
            >
              {pathname.includes('/settings') && activePill}
              {pathname.includes('/settings') && (
                <span
                  className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gold"
                  aria-hidden="true"
                />
              )}
              <motion.span
                className="relative flex-shrink-0 flex items-center"
                variants={iconVariants}
                transition={{ duration: 0.15 }}
              >
                <Settings size={20} />
              </motion.span>
              {shouldShowLabels && <span className="relative">Settings</span>}
            </MotionLink>
          )}

          {/* Logout Button */}
          <motion.button
            onClick={() => setShowLogoutDialog(true)}
            {...linkHover}
            className={cn(
              'cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 w-full text-sm font-base outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/60',
              isCollapsed && !isMobile ? 'justify-center p-3' : '',
              'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )}
            title={isCollapsed && !isMobile ? 'Logout' : undefined}
          >
            <motion.span
              className="flex-shrink-0 flex items-center"
              variants={iconVariants}
              transition={{ duration: 0.15 }}
            >
              <LogOut size={20} />
            </motion.span>
            {shouldShowLabels && <span>Logout</span>}
          </motion.button>
        </div>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out of Iconic Rome?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to access the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLogout} className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer">
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </LayoutGroup>
  )
}
