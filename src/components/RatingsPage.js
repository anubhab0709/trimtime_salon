"use client"

import React from "react"
import { useLanguage } from "../LanguageContext"
import { translations } from "../translations"

export default function RatingsPage() {
  const { language } = useLanguage()
  const t = translations[language]

  // Sample static ratings — replace with real data when available
  const ratings = [
    {
      id: 1,
      customer: "Amit Roy",
      gender: "Men",
      services: ["Hair Cut", "Beard Trim"],
      stars: 5,
      review: "Very good service and friendly staff. Clean place.",
      date: "2025-10-20"
    },
    {
      id: 2,
      customer: "Mousumi Das",
      gender: "Women",
      services: ["Facial Treatment"],
      stars: 4,
      review: "Nice experience, but the waiting time was a bit long.",
      date: "2025-11-02"
    },
    {
      id: 3,
      customer: "Ravi Sharma",
      gender: "Men",
      services: ["Hair Coloring", "Smoothing"],
      stars: 3.5,
      review: "Good styling but felt slightly expensive.",
      date: "2025-11-05"
    }
  ]

  const renderStars = (rating) => {
    const full = Math.floor(rating)
    const half = rating % 1 >= 0.5
    const empty = 5 - full - (half ? 1 : 0)
    const nodes = []
    for (let i = 0; i < full; i++) nodes.push(<span key={`f-${i}`} className="star-filled">⭐</span>)
    if (half) nodes.push(<span key="half" className="star-half">⭐</span>)
    for (let i = 0; i < empty; i++) nodes.push(<span key={`e-${i}`} className="star-empty">☆</span>)
    return nodes
  }

  return (
    <section className="ratings-page" style={{ padding: 16 }}>
      <h2 className="section-title">{t.viewRatings}</h2>

      <div className="ratings-list" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {ratings.map((r) => (
          <div key={r.id} className="rating-card glass-card" style={{ padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontWeight: 800 }}>{r.customer}</div>
                <div style={{ padding: "4px 8px", borderRadius: 12, background: r.gender === "Women" ? "rgba(236,72,153,0.12)" : "rgba(59,130,246,0.08)", color: r.gender === "Women" ? "#ec4899" : "#0b5fff", fontSize: 12, fontWeight: 700 }}>
                  {t[r.gender.toLowerCase()] || r.gender}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 4 }}>{renderStars(r.stars)}</div>
                <div style={{ fontWeight: 800 }}>{r.stars}</div>
              </div>
            </div>

            <div style={{ marginTop: 8, color: "var(--gray-medium)" }}>
              <strong>{t.servicesLabel}:</strong> {r.services.join(", ")}
            </div>

            <p style={{ marginTop: 8 }}>{r.review}</p>

            <div style={{ marginTop: 6, fontSize: 12, color: "var(--gray-medium)" }}>{r.date}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
