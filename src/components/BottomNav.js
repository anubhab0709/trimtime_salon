"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "../LanguageContext"
import { translations } from "../translations"

export default function BottomNav({ currentPage, setCurrentPage }) {
  const { language } = useLanguage()
  const t = translations[language]
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    // Hide on scroll down, show on scroll up
    let lastY = window.scrollY
    let ticking = false

    function onScroll() {
      const currentY = window.scrollY
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const delta = currentY - lastY
          // small threshold to avoid jitter
          if (delta > 10 && currentY > 100) {
            setHidden(true)
          } else if (delta < -10) {
            setHidden(false)
          }
          lastY = currentY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav className={`bottom-nav ${hidden ? "hidden" : ""}`}>
      <button className={`nav-item ${currentPage === "home" ? "active" : ""}`} onClick={() => setCurrentPage("home")}>
        <svg className="nav-icon-svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
        <span className="nav-label">{t.home}</span>
      </button>

      <button
        className={`nav-item ${currentPage === "bookings" ? "active" : ""}`}
        onClick={() => setCurrentPage("bookings")}
      >
        <svg className="nav-icon-svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
        </svg>
        <span className="nav-label">{t.bookings}</span>
      </button>

      <button
        className={`nav-item ${currentPage === "services" ? "active" : ""}`}
        onClick={() => setCurrentPage("services")}
      >
        <svg className="nav-icon-svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.5 3c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5S13.09 3 9.5 3zm0 12c-3.03 0-5.5-2.47-5.5-5.5S6.47 4 9.5 4 15 6.47 15 9.5 12.53 15 9.5 15zm3.5-9h-3v2.6H9v1.8h1v3h1.5v-3h1V8.6h-1V6z" />
        </svg>
        <span className="nav-label">{t.services}</span>
      </button>

      <button
        className={`nav-item ${currentPage === "profile" ? "active" : ""}`}
        onClick={() => setCurrentPage("profile")}
      >
        <svg className="nav-icon-svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
        <span className="nav-label">{t.profile}</span>
      </button>
    </nav>
  )
}
