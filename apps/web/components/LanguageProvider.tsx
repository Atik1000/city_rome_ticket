"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { translations, Language, TranslationKeys } from "@/lib/translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationKeys
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const SUPPORTED_LANGUAGES: Language[] = ["en", "it", "de", "es", "fr"]

const COOKIE = "googtrans"
const SYNC_FLAG = "langCookieSynced"

/**
 * Google Translate writes its cookie on several domain scopes (host-only and
 * dot-prefixed). Writing only one scope leaves a stale cookie behind that keeps
 * winning, so every read/write/delete has to cover all of them.
 */
const domainScopes = (): string[] => {
  const host = window.location.hostname
  const scopes: string[] = [""] // host-only, no domain attribute
  // localhost / raw IPs can't take a domain attribute
  if (host !== "localhost" && !/^\d+(\.\d+)*$/.test(host)) {
    scopes.push(host, `.${host}`)
    const parts = host.split(".")
    if (parts.length > 2) {
      const root = parts.slice(-2).join(".")
      scopes.push(root, `.${root}`)
    }
  }
  return Array.from(new Set(scopes))
}

const clearGoogtrans = () => {
  for (const domain of domainScopes()) {
    document.cookie =
      `${COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/` +
      (domain ? `; domain=${domain}` : "")
  }
}

/** The language Google Translate is actually rendering right now. */
const readGoogtransLanguage = (): Language => {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/)
  if (!match) return "en"
  const target = decodeURIComponent(match[1]).split("/").filter(Boolean).pop()
  return SUPPORTED_LANGUAGES.includes(target as Language) ? (target as Language) : "en"
}

const applyGoogtrans = (lang: Language) => {
  // Always wipe first so no stale scope outranks what we're about to write.
  clearGoogtrans()
  // English is the page's own language: no cookie at all means "untranslated".
  if (lang === "en") return

  const host = window.location.hostname
  const writeScopes =
    host === "localhost" || /^\d+(\.\d+)*$/.test(host) ? [""] : ["", `.${host}`]
  for (const domain of writeScopes) {
    document.cookie =
      `${COOKIE}=/en/${lang}; path=/` + (domain ? `; domain=${domain}` : "")
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language | null
    const lang = savedLang && SUPPORTED_LANGUAGES.includes(savedLang) ? savedLang : "en"
    setLanguageState(lang)

    // Reconcile the saved choice with what Google Translate is actually doing.
    if (readGoogtransLanguage() !== lang) {
      applyGoogtrans(lang)
      // Reload once so the widget picks up the corrected cookie; the flag keeps
      // a cookie we can't change from turning into a reload loop.
      if (!sessionStorage.getItem(SYNC_FLAG)) {
        sessionStorage.setItem(SYNC_FLAG, "1")
        window.location.reload()
        return
      }
    }
    sessionStorage.removeItem(SYNC_FLAG)
  }, [])

  const setLanguage = (lang: Language) => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) return

    setLanguageState(lang)
    localStorage.setItem("language", lang)
    applyGoogtrans(lang)
    sessionStorage.removeItem(SYNC_FLAG)

    // Reload to apply (or undo) the translation.
    window.location.reload()
  }

  const t = translations[language]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
