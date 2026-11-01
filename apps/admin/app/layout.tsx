import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AppLayoutWrapper } from './app-layout-wrapper'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Iconic Rome Tickets - Admin Panel',
  description: 'Admin panel for managing Iconic Rome Tickets tours, bookings, and customer requests',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/iconic-icon.svg',
    apple: '/iconic-icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AppLayoutWrapper>{children}</AppLayoutWrapper>
        <Analytics />
      </body>
    </html>
  )
}
