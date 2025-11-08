"use client"

import { useState } from "react"
import { useLanguage } from "../LanguageContext"
import { translations, getDayTranslation } from "../translations"

export default function SalonProfile() {
  const { language, setLanguage } = useLanguage()
  const t = translations[language]
  
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const salonImages = [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200",
    "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=1200"
  ]

  const [profileData, setProfileData] = useState({
    salonName: "Raj Beauty Parlour",
    ownerName: "Rajesh Kumar",
    registeredPhone: "+91 98765 43210",
    callingPhone: "+91 98765 43211",
    email: "raj@beautypark.com",
    isVerified: true,
    rating: 4.5,
    totalRatings: 128,
    totalRevenue: "₹2,45,000",
    version: "v1.0.2"
  })

  const [businessDays, setBusinessDays] = useState([
    { day: "Monday", isOpen: true, openTime: "09:00", closeTime: "20:00" },
    { day: "Tuesday", isOpen: true, openTime: "09:00", closeTime: "20:00" },
    { day: "Wednesday", isOpen: true, openTime: "09:00", closeTime: "20:00" },
    { day: "Thursday", isOpen: true, openTime: "09:00", closeTime: "20:00" },
    { day: "Friday", isOpen: true, openTime: "09:00", closeTime: "20:00" },
    { day: "Saturday", isOpen: true, openTime: "09:00", closeTime: "20:00" },
    { day: "Sunday", isOpen: false, openTime: "09:00", closeTime: "20:00" }
  ])

  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [isEditingSchedule, setIsEditingSchedule] = useState(false)
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [showLanguageChangedPopup, setShowLanguageChangedPopup] = useState(false)
  const [languageChangedMessage, setLanguageChangedMessage] = useState("")

  const languages = ["English", "Bengali", "Hindi"]
  // Native display labels (always show each language in its own script/form)
  const languageNativeNames = {
    English: "English",
    Bengali: "বাংলা",
    Hindi: "हिन्दी",
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % salonImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + salonImages.length) % salonImages.length)
  }

  const addImage = () => {
    alert("Image upload functionality to be implemented")
  }

  const handlePhoneSave = () => {
    setIsEditingPhone(false)
    // Show the same success popup style as language change
    setLanguageChangedMessage(t.phoneUpdated)
    setShowLanguageChangedPopup(true)
  }

  const handleScheduleSave = () => {
    setIsEditingSchedule(false)
    // Show the same success popup style as language change
    setLanguageChangedMessage(t.hoursUpdated)
    setShowLanguageChangedPopup(true)
  }

  const toggleDay = (index) => {
    const updated = [...businessDays]
    updated[index].isOpen = !updated[index].isOpen
    setBusinessDays(updated)
  }

  const updateDayTime = (index, field, value) => {
    const updated = [...businessDays]
    updated[index][field] = value
    setBusinessDays(updated)
  }

  const selectLanguage = (lang) => {
    // Set new language and show a confirmation popup (translated in the selected language)
    setLanguage(lang)
    setShowLanguageModal(false)
    const newT = translations[lang] || translations[language]
    setLanguageChangedMessage(`${newT.languageChanged} ${lang}`)
    setShowLanguageChangedPopup(true)
  }

  const handleLogout = () => {
    if (window.confirm(t.logoutConfirm)) {
      alert("Logout functionality to be implemented")
    }
  }

  const contactUs = () => {
    alert("Contact Us functionality to be implemented")
  }

  const viewRatings = () => {
    // Navigate to the Ratings page using a window navigation fallback so this
    // component doesn't depend on being rendered inside a React Router
    // context (which can cause useNavigate/useContext errors when missing).
    try {
      // Prefer updating history so React Router can handle it without reload.
      window.history.pushState({}, '', '/ratings')
      // Dispatch a popstate so routers listening to history will react.
      window.dispatchEvent(new PopStateEvent('popstate'))
    } catch (e) {
      // Fallback to a full navigation if pushState fails.
      window.location.href = '/ratings'
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star-filled">⭐</span>)
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star-half">⭐</span>)
    }
    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star-empty">☆</span>)
    }
    return stars
  }

  return (
    <section className="salon-profile-redesign">
      {/* Cover Page Slideshow */}
      <div className="profile-slideshow-container">
        <div className="profile-slideshow">
          {salonImages.map((img, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? "active" : ""}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          
          <button className="slide-nav slide-prev" onClick={prevSlide}>
            ‹
          </button>
          <button className="slide-nav slide-next" onClick={nextSlide}>
            ›
          </button>
          
          <button className="slide-add-btn" onClick={addImage}>
            + {t.addImage}
          </button>

          <div className="slide-indicators">
            {salonImages.map((_, index) => (
              <span
                key={index}
                className={`indicator ${index === currentSlide ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Salon Name */}
      <div className="profile-salon-name-section">
        <h1 className="profile-salon-name">{profileData.salonName}</h1>
      </div>

      {/* Rating Section */}
      <div className="profile-rating-section">
        <div className="rating-stars">
          {renderStars(profileData.rating)}
          <span className="rating-value">{profileData.rating}</span>
          <span className="rating-count">({profileData.totalRatings} {t.ratings})</span>
        </div>
        <button className="btn-view-ratings" onClick={viewRatings}>
          {t.viewRatings}
        </button>
      </div>

      {/* Salon Details Card */}
      <div className="profile-details-card glass-card-profile">
        <h3 className="details-card-title">{t.salonDetails}</h3>
        
        <div className="detail-item">
          <span className="detail-label">{t.salonName}</span>
          <span className="detail-value">{profileData.salonName}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">{t.ownerName}</span>
          <span className="detail-value">{profileData.ownerName}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">{t.registeredPhone}</span>
          <span className="detail-value">{profileData.registeredPhone}</span>
        </div>

        <div className="detail-item detail-item-editable">
          <span className="detail-label">{t.callingPhone}</span>
          {isEditingPhone ? (
            <div className="detail-edit-group">
              <input
                type="tel"
                className="detail-edit-input"
                value={profileData.callingPhone}
                onChange={(e) => setProfileData({ ...profileData, callingPhone: e.target.value })}
              />
              <button className="btn-detail-save" onClick={handlePhoneSave}>
                ✓
              </button>
              <button className="btn-detail-cancel" onClick={() => setIsEditingPhone(false)}>
                ✕
              </button>
            </div>
          ) : (
            <div className="detail-value-with-edit">
              <span className="detail-value">{profileData.callingPhone}</span>
              <button className="btn-detail-edit" onClick={() => setIsEditingPhone(true)}>
                ✏️
              </button>
            </div>
          )}
        </div>

        <div className="detail-item">
          <span className="detail-label">{t.emailAddress}</span>
          <span className="detail-value">{profileData.email}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">{t.verificationStatus}</span>
          <span className={`verification-badge ${profileData.isVerified ? "verified" : "not-verified"}`}>
            {profileData.isVerified ? t.verified : t.notVerified}
          </span>
        </div>
      </div>

      {/* Business Days Card */}
      <div className="profile-details-card glass-card-profile">
        <div className="details-card-header">
          <h3 className="details-card-title">{t.businessDaysHours}</h3>
          {!isEditingSchedule ? (
            <button className="btn-edit-schedule" onClick={() => setIsEditingSchedule(true)}>
              ✏️ {t.edit}
            </button>
          ) : (
            <button className="btn-save-schedule" onClick={handleScheduleSave}>
              ✓ {t.save}
            </button>
          )}
        </div>

        <div className="business-days-list">
          {businessDays.map((day, index) => (
            <div key={day.day} className={`business-day-item ${!day.isOpen ? "closed" : ""}`}>
              <div className="day-info">
                {isEditingSchedule && (
                  <input
                    type="checkbox"
                    className="day-checkbox"
                    checked={day.isOpen}
                    onChange={() => toggleDay(index)}
                  />
                )}
                <span className="day-name">{getDayTranslation(day.day, language)}</span>
              </div>
              {day.isOpen ? (
                isEditingSchedule ? (
                  <div className="day-time-edit">
                    <input
                      type="time"
                      className="time-input"
                      value={day.openTime}
                      onChange={(e) => updateDayTime(index, "openTime", e.target.value)}
                    />
                    <span className="time-separator">-</span>
                    <input
                      type="time"
                      className="time-input"
                      value={day.closeTime}
                      onChange={(e) => updateDayTime(index, "closeTime", e.target.value)}
                    />
                  </div>
                ) : (
                  <span className="day-time">
                    {day.openTime} - {day.closeTime}
                  </span>
                )
              ) : (
                <span className="day-closed-label">{t.closed}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="profile-bottom-section">
        <div className="profile-stats-card glass-card-profile">
          <div className="stat-item">
            <span className="stat-label">{t.totalRevenue}</span>
            <span className="stat-value">{profileData.totalRevenue}</span>
          </div>
        </div>

        <div className="profile-actions-card glass-card-profile">
          <button className="profile-action-btn" onClick={() => setShowLanguageModal(true)}>
            <span className="action-icon">🌐</span>
            <span className="action-text">{t.language}: {language}</span>
            <span className="action-arrow">›</span>
          </button>

          <button className="profile-action-btn" onClick={contactUs}>
            <span className="action-icon">📞</span>
            <span className="action-text">{t.contactUs}</span>
            <span className="action-arrow">›</span>
          </button>

          <div className="profile-version">
            <span className="version-text">{t.version} {profileData.version}</span>
          </div>

          <button className="profile-logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            <span className="logout-text">{t.logout}</span>
          </button>
        </div>

        {/* Made with Love Footer */}
        <div className="profile-footer">
          <p className="footer-text">
            {t.madeWith} <span className="footer-heart">❤️</span> {t.by} <span className="footer-team">{t.trimTimeTeam}</span> {t.at} <span className="footer-location">{t.kolkata}</span>
          </p>
        </div>
      </div>

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div className="language-modal-overlay" onClick={() => setShowLanguageModal(false)}>
          <div className="language-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="language-modal-title">{t.selectLanguage}</h3>
            <div className="language-options">
              {languages.map((lang) => (
                <button
                  key={lang}
                  className={`language-option ${language === lang ? "active" : ""}`}
                  onClick={() => selectLanguage(lang)}
                >
                  <span className="language-name">{languageNativeNames[lang] || lang}</span>
                  {language === lang && <span className="language-check">✓</span>}
                </button>
              ))}
            </div>
            <button className="language-modal-close" onClick={() => setShowLanguageModal(false)}>
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* Language Changed Confirmation Popup */}
      {showLanguageChangedPopup && (
        <div className="booking-popup-overlay" onClick={() => setShowLanguageChangedPopup(false)}>
          <div className="booking-popup-container language-change-popup" onClick={(e) => e.stopPropagation()}>
            <div className="success-animation">
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>

            <h3 className="success-title">{languageChangedMessage}</h3>

            <button className="popup-btn popup-btn-done" onClick={() => setShowLanguageChangedPopup(false)}>
              {t.done}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
