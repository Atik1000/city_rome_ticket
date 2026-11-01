export const translations = {
  en: {
    nav: {
      tours: "Tours",
      aboutUs: "About us",
      contact: "Contact",
      cart: "Cart",
      profile: "Profile",
      support: "Support",
      settings: "Settings",
      logout: "Log out",
      loginSignup: "Log in or sign up",
    },
    footer: {
      support: "Support",
      contact: "Contact",
      legalNotice: "Legal Notice",
      privacyPolicy: "Privacy Policy",
      terms: "Terms and Conditions",
      company: "Company",
      aboutUs: "About Us",
      toursTickets: "Tours & Tickets",
      tagline:
        "Book unforgettable experiences with trusted local experts. Fast support, flexible booking, and great value—every time.",
    },
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
    },
  },

  it: {
    nav: {
      tours: "Tour",
      aboutUs: "Chi siamo",
      contact: "Contatto",
      cart: "Carrello",
      profile: "Profilo",
      support: "Supporto",
      settings: "Impostazioni",
      logout: "Disconnettersi",
      loginSignup: "Accedi o registrati",
    },
    footer: {
      support: "Supporto",
      contact: "Contatto",
      legalNotice: "Note Legali",
      privacyPolicy: "Informativa sulla privacy",
      terms: "Termini e Condizioni",
      company: "Azienda",
      aboutUs: "Chi siamo",
      toursTickets: "Tour e Biglietti",
      tagline:
        "Prenota esperienze indimenticabili con esperti locali di fiducia. Supporto rapido, prenotazione flessibile e ottimo rapporto qualità-prezzo, ogni volta.",
    },
    common: {
      loading: "Caricamento...",
      error: "Errore",
      success: "Successo",
    },
  },

  de: {
    nav: {
      tours: "Touren",
      aboutUs: "Über uns",
      contact: "Kontakt",
      cart: "Warenkorb",
      profile: "Profil",
      support: "Support",
      settings: "Einstellungen",
      logout: "Abmelden",
      loginSignup: "Anmelden oder registrieren",
    },
    footer: {
      support: "Support",
      contact: "Kontakt",
      legalNotice: "Impressum",
      privacyPolicy: "Datenschutzerklärung",
      terms: "Allgemeine Geschäftsbedingungen",
      company: "Unternehmen",
      aboutUs: "Über uns",
      toursTickets: "Touren & Tickets",
      tagline:
        "Buche unvergessliche Erlebnisse mit vertrauenswürdigen lokalen Experten. Schneller Support, flexible Buchung und ein tolles Preis-Leistungs-Verhältnis – jedes Mal.",
    },
    common: {
      loading: "Wird geladen...",
      error: "Fehler",
      success: "Erfolg",
    },
  },

  es: {
    nav: {
      tours: "Tours",
      aboutUs: "Sobre nosotros",
      contact: "Contacto",
      cart: "Carrito",
      profile: "Perfil",
      support: "Soporte",
      settings: "Ajustes",
      logout: "Cerrar sesión",
      loginSignup: "Iniciar sesión o registrarse",
    },
    footer: {
      support: "Soporte",
      contact: "Contacto",
      legalNotice: "Aviso legal",
      privacyPolicy: "Política de privacidad",
      terms: "Términos y condiciones",
      company: "Empresa",
      aboutUs: "Sobre nosotros",
      toursTickets: "Tours y entradas",
      tagline:
        "Reserva experiencias inolvidables con expertos locales de confianza. Soporte rápido, reserva flexible y excelente relación calidad-precio, siempre.",
    },
    common: {
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
    },
  },

  fr: {
    nav: {
      tours: "Visites",
      aboutUs: "À propos",
      contact: "Contact",
      cart: "Panier",
      profile: "Profil",
      support: "Assistance",
      settings: "Paramètres",
      logout: "Se déconnecter",
      loginSignup: "Se connecter ou s’inscrire",
    },
    footer: {
      support: "Assistance",
      contact: "Contact",
      legalNotice: "Mentions légales",
      privacyPolicy: "Politique de confidentialité",
      terms: "Conditions générales",
      company: "Entreprise",
      aboutUs: "À propos",
      toursTickets: "Visites & billets",
      tagline:
        "Réservez des expériences inoubliables avec des experts locaux de confiance. Assistance rapide, réservation flexible et excellent rapport qualité-prix — à chaque fois.",
    },
    common: {
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
    },
  },
} as const

export type Language = keyof typeof translations
export type TranslationKeys = typeof translations.en