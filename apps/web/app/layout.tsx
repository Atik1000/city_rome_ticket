import type React from "react"
import type { Metadata } from "next"
import { Inter, Fraunces } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import StoreProvider from "@/components/StoreProvider"
import { LanguageProvider } from "@/components/LanguageProvider"
import GoogleTranslate from "@/components/GoogleTranslate"
import MotionProvider from "@/components/animation/motion-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
})

export const metadata: Metadata = {
  title: "Iconic Rome Tickets - Skip-the-Line Tours & Experiences in Rome",
  description:
    "Book skip-the-line tickets and expert-guided tours of the Colosseum, Vatican, Pantheon and more with Iconic Rome Tickets. Free cancellation and instant mobile tickets.",
  metadataBase: new URL("https://iconicrometours.com"),
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} font-sans antialiased`}>
        <LanguageProvider>
          <StoreProvider>
            <MotionProvider>
              <GoogleTranslate />
              {children}
            </MotionProvider>
          </StoreProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
