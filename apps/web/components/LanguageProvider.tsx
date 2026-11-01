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

// Google Translate expects: /<source>/<target>
const GT_COOKIE_MAP: Record<Language, string> = {
  en: "/en/en",
  it: "/en/it",
  de: "/en/de",
  es: "/en/es",
  fr: "/en/fr",
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language | null
    if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
      setLanguageState(savedLang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)

    // Google Translate cookie logic
    const googtrans = GT_COOKIE_MAP[lang] ?? "/en/en"
    document.cookie = `googtrans=${googtrans}; path=/`
    document.cookie = `googtrans=${googtrans}; path=/; domain=.asse.devtunnels.ms` // Handle potential tunnel domain

    // Reload to apply translation
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