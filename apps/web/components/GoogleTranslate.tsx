"use client"

import { useEffect } from "react"

declare global {
    interface Window {
        google: any
        googleTranslateElementInit: () => void
    }
}

export default function GoogleTranslate() {
    useEffect(() => {
        // Load Google Translate script
        const addScript = () => {
            if (document.querySelector("#google-translate-script")) return

            const script = document.createElement("script")
            script.id = "google-translate-script"
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
            script.async = true
            document.body.appendChild(script)
        }

        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    includedLanguages: "en,it,de,es,fr",
                    // We keep it empty because we'll trigger it via cookies and custom UI
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                },
                "google_translate_element"
            )
        }

        addScript()

        // Aggressive cleanup interval
        const interval = setInterval(() => {
            const banner = document.querySelector(".goog-te-banner-frame");
            if (banner) {
                (banner as HTMLElement).style.display = "none";
                (banner as HTMLElement).style.visibility = "hidden";
                document.body.style.top = "0px";
                document.body.style.marginTop = "0px";
            }

            const skipTranslate = document.querySelector(".skiptranslate");
            if (skipTranslate && skipTranslate.innerHTML.includes("google")) {
                (skipTranslate as HTMLElement).style.display = "none";
            }
        }, 500);

        return () => clearInterval(interval);
    }, [])

    return (
        <>
            <div id="google_translate_element" style={{ display: "none" }} />
            <style jsx global>{`
        /* Hide Google Translate toolbar/banner */
        .goog-te-banner-frame.skiptranslate,
        .goog-te-banner-frame,
        .goog-te-banner,
        #goog-gt-tt,
        .goog-te-balloon-frame,
        .goog-te-menu-frame,
        .goog-te-menu-value,
        .goog-te-gadget-icon,
        .goog-te-gadget-simple img,
        .skiptranslate.goog-te-gadget,
        .skiptranslate {
          display: none !important;
          visibility: hidden !important;
        }
        
        /* Modern Google Translate classes */
        .VIpgJm-tfB0hd-m69Vgc,
        .VIpgJm-tfB0hd-m69Vgc-hpve9d,
        .VIpgJm-Z76W9b-p696u-f79v9c {
          display: none !important;
          visibility: hidden !important;
        }

        body {
          top: 0 !important;
          position: static !important;
          margin-top: 0 !important;
        }

        /* Fix for the gap Google Translate might create */
        .goog-te-banner-frame {
            visibility: hidden !important;
            display: none !important;
        }
        
        #google_translate_element {
            display: none !important;
        }

        /* Prevent Google from shifting the page */
        html {
            margin-top: 0 !important;
        }
      `}</style>
        </>
    )
}
