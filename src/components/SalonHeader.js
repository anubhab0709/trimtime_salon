"use client"

import { useState } from "react"
import { useLanguage } from "../LanguageContext"
import { translations, formatDateLocalized } from "../translations"

export default function SalonHeader() {
  const { language } = useLanguage()
  const t = translations[language]
  const [isOpen, setIsOpen] = useState(true)

  const today = formatDateLocalized(new Date(), language, {
    weekday: "long",
    month: "short",
    day: "numeric",
  })

  // TrimTime logo removed per request

  const Pin = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 2C8.13401 2 5 5.13401 5 9C5 13.25 12 22 12 22C12 22 19 13.25 19 9C19 5.13401 15.866 2 12 2Z" fill="white"/>
      <path d="M12 11.5C13.3807 11.5 14.5 10.3807 14.5 9C14.5 7.61929 13.3807 6.5 12 6.5C10.6193 6.5 9.5 7.61929 9.5 9C9.5 10.3807 10.6193 11.5 12 11.5Z" fill="#7c3aed"/>
    </svg>
  )

  // Calendar icon removed per request

  return (
    <header className="salon-header">
      <div className="salon-header-top">
        <div className="salon-header-top-container">
          <div className="salon-brand" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 className="salon-header-title">TrimTime</h1>
          </div>

          <div className="location-section-right">
            <button
              className={`salon-status-btn ${isOpen ? "open" : "closed"}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-pressed={!isOpen}
            >
              <span className={`status-dot ${isOpen ? "" : "closed"}`} aria-hidden />
                {isOpen ? t.shopOpen : t.shopClosed}
            </button>
          </div>
        </div>
      </div>

      <div className="salon-header-info">
        <div className="salon-header-left">
          <h2 className="salon-name-large">Raj Beauty Parlour</h2>

          <div className="salon-date-row" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <p className="salon-date">{today}</p>
          </div>

          <div style={{ marginTop: 8 }}>
            <div className="location-badge" aria-label="Salon location">
              <span className="loc-pin" style={{ display: "inline-flex", alignItems: "center" }}>
                <Pin />
              </span>
              <span className="location-name">Kaichar</span>
            </div>
          </div>
        </div>

        <div className="salon-header-right">
          <div className="salon-status-card">
              <p className="status-label">{t.queueStatus}</p>
            <div className="status-value-row">
              <span className="queue-pulse" aria-hidden />
              <p className="status-value">3</p>
            </div>
              <p className="status-time">15 {t.minEstWaiting}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
