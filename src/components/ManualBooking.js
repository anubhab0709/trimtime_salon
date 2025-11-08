"use client"

import { useState } from "react"
import { useLanguage } from "../LanguageContext"
import { translations, formatDateLocalized } from "../translations"

export default function ManualBooking() {
  const { language } = useLanguage()
  const t = translations[language]
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
  })
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [bookedData, setBookedData] = useState(null)
  // services data and selection state
  const services = [
    { id: "s1", name: "Haircut", category: "men", price: 200, duration: 30, names: { English: "Haircut", Bengali: "হেয়ারকাট" } },
    { id: "s2", name: "Haircut (Women)", category: "women", price: 350, duration: 45, names: { English: "Haircut (Women)", Bengali: "হেয়ারকাট (মহিলা)" } },
    { id: "s3", name: "Shave", category: "men", price: 120, duration: 15, names: { English: "Shave", Bengali: "শেভ" } },
    { id: "s4", name: "Beard Trim", category: "men", price: 150, duration: 20, names: { English: "Beard Trim", Bengali: "দাড়ি ট্রিম" } },
    { id: "s5", name: "Manicure", category: "women", price: 300, duration: 35, names: { English: "Manicure", Bengali: "ম্যানিকিউর" } },
    { id: "s6", name: "Pedicure", category: "women", price: 320, duration: 35, names: { English: "Pedicure", Bengali: "পেডিকিউর" } },
    { id: "s7", name: "Hair Color", category: "unisex", price: 800, duration: 90, names: { English: "Hair Color", Bengali: "চুল রং" } },
    { id: "s8", name: "Face Pack", category: "unisex", price: 400, duration: 40, names: { English: "Face Pack", Bengali: "ফেস প্যাক" } },
  ]
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedServices, setSelectedServices] = useState([])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // store booked data and show confirmation popup (Step 1)
    const selectedDetailsSnapshot = services.filter((s) => selectedServices.includes(s.id))
    const snapshotTotalPrice = selectedDetailsSnapshot.reduce((acc, s) => acc + s.price, 0)
    const snapshotTotalDuration = selectedDetailsSnapshot.reduce((acc, s) => acc + s.duration, 0)

    setBookedData({
      ...formData,
      services: selectedDetailsSnapshot,
      totalPrice: snapshotTotalPrice,
      totalDuration: snapshotTotalDuration,
    })
    setShowConfirmPopup(true)
  }

  const handleConfirmBooking = () => {
    // Move from Step 1 (Confirm) to Step 2 (Success)
    setShowConfirmPopup(false)
    setTimeout(() => {
      setShowSuccessPopup(true)
    }, 200)
  }

  const handleCancelBooking = () => {
    setShowConfirmPopup(false)
    setBookedData(null)
  }

  const handleDone = () => {
    setShowSuccessPopup(false)
    setBookedData(null)
    setFormData({ name: "", phone: "", date: "", time: "" })
    setSelectedServices([])
  }

  const toggleService = (id) => {
    setSelectedServices((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  const filteredServices = services.filter((s) => categoryFilter === "all" || s.category === categoryFilter)
  const selectedDetails = services.filter((s) => selectedServices.includes(s.id))
  const totalPrice = selectedDetails.reduce((acc, s) => acc + s.price, 0)
  const totalDuration = selectedDetails.reduce((acc, s) => acc + s.duration, 0)

  return (
    <section className="manual-booking">
        <h2 className="section-title">{t.manualBooking}</h2>

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="name">{t.customerName}</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter customer name"
            required
          />
        </div>

        <div className="form-group">
            <label htmlFor="phone">{t.phoneNumber}</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
              <label htmlFor="date">{t.selectDate}</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>

          <div className="form-group">
              <label htmlFor="time">{t.selectTime}</label>
            <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required />
          </div>
        </div>

        {/* Services selection section */}
        <div className="services-section">
          <label className="section-title" style={{ marginBottom: 8 }}>{t.selectServices}</label>

          <div className="services-filter">
            <button type="button" className={`btn ${categoryFilter === "all" ? "btn-reschedule" : "btn-cancel"}`} onClick={() => setCategoryFilter("all")}>{t.all}</button>
            <button type="button" className={`btn ${categoryFilter === "men" ? "btn-reschedule" : "btn-cancel"}`} onClick={() => setCategoryFilter("men")}>{t.men}</button>
            <button type="button" className={`btn ${categoryFilter === "women" ? "btn-reschedule" : "btn-cancel"}`} onClick={() => setCategoryFilter("women")}>{t.women}</button>
            <button type="button" className={`btn ${categoryFilter === "unisex" ? "btn-reschedule" : "btn-cancel"}`} onClick={() => setCategoryFilter("unisex")}>{t.unisex}</button>
          </div>

          <div className="services-list">
            {filteredServices.map((s) => (
              <label key={s.id} className="service-item">
                <div className="service-info">
                  <div className="service-name">{(s.names && s.names[language]) || s.name}</div>
                  <div className="service-meta">{s.duration} {t.min} • ₹{s.price}</div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedServices.includes(s.id)}
                  onChange={() => toggleService(s.id)}
                  className="service-checkbox"
                />
              </label>
            ))}
          </div>

          <div className="services-summary">
            <div className="services-summary-left">{selectedServices.length} {t.servicesSelected}</div>
            <div className="services-summary-right">
              <div className="summary-price">₹{totalPrice}</div>
              <div className="summary-duration">{totalDuration} {t.min}</div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-submit">
         {t.bookNow}
        </button>
      </form>

      {/* Step 1: Confirm Appointment Popup */}
      {showConfirmPopup && bookedData && (
        <div className="booking-popup-overlay" onClick={handleCancelBooking}>
          <div className="booking-popup-container" onClick={(e) => e.stopPropagation()}>
            <div className="booking-popup-content">
              <h2 className="booking-popup-title">{t.todaysAppointments}</h2>
              
              <div className="booking-confirm-section">
                <div className="booking-field">
                  <label className="booking-field-label">{t.customerName}</label>
                  <input 
                    type="text" 
                    className="booking-field-input" 
                    value={bookedData.name}
                    readOnly
                  />
                </div>

                <div className="booking-salon-info">
                  <div className="booking-salon-name">TrimTime Salon</div>
                  <div className="booking-salon-address">123 Main Street, Downtown</div>
                </div>

                <div className="booking-detail-row">
                  <span className="booking-detail-label">{t.dateAndTime}</span>
                  <span className="booking-detail-value">
                    {formatDateLocalized(bookedData.date, language, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })} at {bookedData.time}
                  </span>
                </div>

                {bookedData.services && bookedData.services.length > 0 && (
                  <div className="booking-detail-row">
                    <span className="booking-detail-label">{t.servicesLabel}</span>
                    <span className="booking-detail-value">
                      {bookedData.services.map((s) => ((s.names && s.names[language]) || s.name)).join(', ')}
                    </span>
                  </div>
                )}

                <div className="booking-total-price">
                  Total: ₹{bookedData.totalPrice ?? 0}
                </div>
              </div>

              <div className="booking-popup-actions">
                <button className="booking-btn booking-btn-cancel" onClick={handleCancelBooking}>
                  Cancel
                </button>
                <button className="booking-btn booking-btn-confirm" onClick={handleConfirmBooking}>
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Booking Confirmed Success Popup */}
      {showSuccessPopup && bookedData && (
        <div className="booking-popup-overlay" onClick={handleDone}>
          <div className="booking-popup-container" onClick={(e) => e.stopPropagation()}>
            <div className="booking-popup-content booking-success-content">
              <div className="booking-success-icon">
                <svg className="booking-checkmark" viewBox="0 0 52 52">
                  <circle className="booking-checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                  <path className="booking-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>

              <h2 className="booking-success-title">Booking Confirmed!</h2>
              <p className="booking-success-subtitle">Your appointment has been successfully booked.</p>
              
              <p className="booking-success-details">
                Booking confirmed for <strong>{bookedData.name}</strong> at <strong>TrimTime Salon</strong>. 
                We'll send you a confirmation message shortly.
              </p>

              <button className="booking-btn booking-btn-done" onClick={handleDone}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
