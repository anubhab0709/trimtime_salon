"use client"

import { useState, useMemo } from "react"
import { useLanguage } from "../LanguageContext"
import { translations } from "../translations"


export default function AllBookings() {
  const { language } = useLanguage()
  const t = translations[language]
  // Helpers to generate ISO date strings for relative days
  const dateISO = (offsetDays = 0) => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + offsetDays)
    return d.toISOString().split('T')[0]
  }
  const todayISO = dateISO(0)
  const tomorrowISO = dateISO(1)
  const [bookings, setBookings] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      phone: "+91 98765 43210",
      date: todayISO,
      time: "10:00 AM",
      services: "Hair Cut, Styling",
      amount: 800,
      status: "In Progress",
    },
    {
      id: 2,
      name: "Emily Davis",
      phone: "+91 98765 43211",
      date: todayISO,
      time: "10:45 AM",
      services: "Facial Treatment",
      amount: 1200,
      status: "Upcoming",
    },
    {
      id: 3,
      name: "Jessica Brown",
      phone: "+91 98765 43212",
      date: todayISO,
      time: "11:30 AM",
      services: "Hair Color, Smoothing",
      amount: 2500,
      status: "Upcoming",
    },
    {
      id: 4,
      name: "Lisa Anderson",
      phone: "+91 98765 43213",
      date: tomorrowISO,
      time: "02:00 PM",
      services: "Manicure",
      amount: 600,
      status: "Upcoming",
    },
    {
      id: 5,
      name: "Ava Wilson",
      phone: "+91 98765 43214",
      date: tomorrowISO,
      time: "03:15 PM",
      services: "Pedicure",
      amount: 650,
      status: "Upcoming",
    },
    {
      id: 6,
      name: "Mia Thompson",
      phone: "+91 98765 43215",
      date: dateISO(3),
      time: "11:00 AM",
      services: "Manicure, Nail Art",
      amount: 950,
      status: "Upcoming",
    },
    {
      id: 7,
      name: "Olivia Martin",
      phone: "+91 98765 43216",
      date: dateISO(3),
      time: "04:30 PM",
      services: "Beard Trim, Shave",
      amount: 450,
      status: "Upcoming",
    },
  ])

  const [activeBookingId, setActiveBookingId] = useState(null)

  // Filter state: 'today' | 'tomorrow' | 'date'
  const [filterMode, setFilterMode] = useState('today')
  const [selectedDate, setSelectedDate] = useState(() => todayISO)

  const effectiveDate = filterMode === 'today'
    ? todayISO
    : filterMode === 'tomorrow'
      ? tomorrowISO
      : selectedDate

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => b.date === effectiveDate)
  }, [bookings, effectiveDate])

  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => {
      const timeA = new Date(`2025-01-01 ${a.time}`)
      const timeB = new Date(`2025-01-01 ${b.time}`)
      return timeA - timeB
    })
  }, [filteredBookings])

  // Toast
  const [toast, setToast] = useState({ show: false, message: "" })
  const triggerToast = (message) => {
    setToast({ show: true, message })
    setTimeout(() => setToast({ show: false, message: "" }), 2200)
  }

  // Cancellation modal state
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelTarget, setCancelTarget] = useState(null)
  const [cancelReason, setCancelReason] = useState("")
  const [cancelNote, setCancelNote] = useState("")

  const openCancelModal = (id) => {
    const b = bookings.find(x => x.id === id)
    if (!b) return
    setCancelTarget(b)
    setCancelReason("")
    setCancelNote("")
    setShowCancelModal(true)
  }

  const closeCancelModal = () => {
    setShowCancelModal(false)
    setCancelTarget(null)
  }

  const confirmCancel = () => {
    if (!cancelTarget) return
    setBookings(prev => prev.filter(x => x.id !== cancelTarget.id))
    setActiveBookingId(null)
    setShowCancelModal(false)
    triggerToast(`${t.cancellationDone}`)
    setTimeout(() => {
      triggerToast(`${t.cancellationSmsSent} ${cancelTarget.name}`)
    }, 2400)
  }

  // Available services list
  const availableServices = [
    { id: "s1", name: "Haircut", category: "men", price: 200, duration: 30, names: { English: "Haircut", Bengali: "হেয়ারকাট" } },
    { id: "s2", name: "Haircut (Women)", category: "women", price: 350, duration: 45, names: { English: "Haircut (Women)", Bengali: "হেয়ারকাট (মহিলা)" } },
    { id: "s3", name: "Shave", category: "men", price: 120, duration: 15, names: { English: "Shave", Bengali: "শেভ" } },
    { id: "s4", name: "Beard Trim", category: "men", price: 150, duration: 20, names: { English: "Beard Trim", Bengali: "দাড়ি ট্রিম" } },
    { id: "s5", name: "Manicure", category: "women", price: 300, duration: 35, names: { English: "Manicure", Bengali: "ম্যানিকিউর" } },
    { id: "s6", name: "Pedicure", category: "women", price: 320, duration: 35, names: { English: "Pedicure", Bengali: "পেডিকিউর" } },
    { id: "s7", name: "Hair Color", category: "unisex", price: 800, duration: 90, names: { English: "Hair Color", Bengali: "চুল রং" } },
    { id: "s8", name: "Face Pack", category: "unisex", price: 400, duration: 40, names: { English: "Face Pack", Bengali: "ফেস প্যাক" } },
  ]

  const [rescheduleBooking, setRescheduleBooking] = useState(null)
  const [showRescheduleConfirm, setShowRescheduleConfirm] = useState(false)
  const [showRescheduleSuccess, setShowRescheduleSuccess] = useState(false)
  const [selectedServices, setSelectedServices] = useState([])
  const [rescheduleData, setRescheduleData] = useState({
    name: "",
    date: "",
    time: ""
  })

  const toggleService = (serviceId) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId)
      } else {
        return [...prev, serviceId]
      }
    })
  }

  const calculateTotal = () => {
    const selected = availableServices.filter(s => selectedServices.includes(s.id))
    const totalPrice = selected.reduce((acc, s) => acc + s.price, 0)
    const totalDuration = selected.reduce((acc, s) => acc + s.duration, 0)
    return { totalPrice, totalDuration }
  }

  const handleReschedule = (id) => {
    const booking = bookings.find(b => b.id === id)
    if (booking) {
      setRescheduleBooking(booking)
      setRescheduleData({
        name: booking.name,
        date: booking.date,
        time: booking.time
      })
      // Initialize selected services (for demo, select first 2 services)
      setSelectedServices(["s1", "s2"])
      setShowRescheduleConfirm(true)
    }
  }

  const handleRescheduleChange = (e) => {
    const { name, value } = e.target
    setRescheduleData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleConfirmReschedule = () => {
    setShowRescheduleConfirm(false)
    setShowRescheduleSuccess(true)
  }

  const handleCancelReschedule = () => {
    setShowRescheduleConfirm(false)
    setRescheduleBooking(null)
  }

  const handleRescheduleDone = () => {
    setShowRescheduleSuccess(false)
    setRescheduleBooking(null)
  }

  const handleComplete = () => {
    if (activeBookingId) {
      alert(`${t.completedBooking} ${activeBookingId}`)
      setActiveBookingId(null)
    }
  }

  const activeBooking = bookings.find((b) => b.id === activeBookingId)
  const [modalBooking, setModalBooking] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const openModal = (booking) => {
    setModalBooking(booking)
    setShowModal(true)
  }

  const closeModal = () => {
    setModalBooking(null)
    setShowModal(false)
  }

  return (
    <section className="all-bookings">
      {activeBooking && (
        <div className="appointment-status-section">
          <div className="status-section-header">
            <h3>{t.currentBooking}</h3>
            <button className="close-status-btn" onClick={() => setActiveBookingId(null)}>
              ✕
            </button>
          </div>

          <div className="status-section-body">
            <div className="status-row">
              <span className="status-row-label">{t.status}:</span>
              <span className="status-badge in-progress">{t.inProgress}</span>
            </div>

            <div className="status-row">
              <span className="status-row-label">{t.customerName}:</span>
              <span className="status-row-value">{activeBooking.name}</span>
            </div>

            <div className="status-row">
              <span className="status-row-label">{t.servicesLabel}:</span>
              <span className="status-row-value">{activeBooking.services}</span>
            </div>

            <div className="status-row">
              <span className="status-row-label">{t.totalAmount}:</span>
              <span className="status-row-value">₹{activeBooking.amount}</span>
            </div>

            <div className="status-row">
              <span className="status-row-label">{t.time}:</span>
              <span className="status-row-value">{activeBooking.time}</span>
            </div>
          </div>

          <div className="status-section-actions">
            <button className="btn btn-complete" onClick={handleComplete}>
              ✓ {t.complete}
            </button>
            <button className="btn btn-cancel-status" onClick={() => openCancelModal(activeBookingId)}>
              ✕ {t.cancel}
            </button>
          </div>
        </div>
      )}

      <h2 className="section-title">{t.allBookings}</h2>

      {/* Filter Bar */}
      <div className="bookings-filter-container">
        <button
          className={`filter-btn ${filterMode==='today' ? 'active' : ''}`}
          onClick={() => { setFilterMode('today'); setSelectedDate(todayISO) }}
        >{t.today}</button>
        <button
          className={`filter-btn ${filterMode==='tomorrow' ? 'active' : ''}`}
          onClick={() => { setFilterMode('tomorrow'); setSelectedDate(tomorrowISO) }}
        >{t.tomorrow}</button>
        <button
          className={`filter-btn ${filterMode==='date' ? 'active' : ''}`}
          onClick={() => { setFilterMode('date') }}
        >{t.selectDateLabel}</button>

        {filterMode === 'date' && (
          <div className="custom-date-filter">
            <input
              type="date"
              value={selectedDate}
              min={todayISO}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-filter-input"
            />
          </div>
        )}
      </div>

      <div className="bookings-list">
        {sortedBookings.length === 0 && (
          <div className="empty-state">
            <p>{t.noBookingsForDate}</p>
          </div>
        )}
        {sortedBookings.map((booking, index) => (
          <div key={booking.id} className="booking-card" onClick={() => openModal(booking)}>
            <div className="booking-header">
              <div className="booking-info">
                <h3 className="booking-name">{booking.name}</h3>
                <p className="booking-date">{booking.date} • {booking.time} • {booking.phone}</p>
              </div>
              <span className={`booking-status ${booking.status.toLowerCase()}`}>
                {booking.status === "Upcoming" && t.upcoming}
                {booking.status === "In Progress" && t.inProgress}
                {booking.status === "Completed" && t.completed}
              </span>
            </div>

            <p className="booking-services">{t.servicesLabel}: {booking.services}</p>

            <div className="booking-actions">
              <button className="btn btn-reschedule" onClick={(e) => { e.stopPropagation(); handleReschedule(booking.id); }}>
                {t.reschedule}
              </button>
              <button className="btn btn-call" onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${booking.phone}`; }}>
                ☎ Call
              </button>
              <button className="btn btn-cancel btn-cancel-red" onClick={(e) => { e.stopPropagation(); openCancelModal(booking.id); }}>
                {t.cancel}
              </button>
              <span className="booking-serial-badge">#{index + 1}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for booking details */}
      {showModal && modalBooking && (
        <div className="appointment-popup-backdrop" onClick={closeModal}>
          <div className="appointment-popup" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="status-header">
              <h3>{modalBooking.name}</h3>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>

            <div className="status-body">
              <div className="status-row">
                <span className="status-row-label">{t.dateAndTime}:</span>
                <span className="status-row-value">{modalBooking.date} • {modalBooking.time}</span>
              </div>

              <div className="status-row">
                <span className="status-row-label">{t.phoneNumber}:</span>
                <span className="status-row-value">{modalBooking.phone}</span>
              </div>

              <div className="status-row">
                <span className="status-row-label">{t.servicesLabel}:</span>
                <span className="status-row-value">{modalBooking.services}</span>
              </div>

              <div className="status-row">
                <span className="status-row-label">{t.amount}:</span>
                <span className="status-row-value">₹{modalBooking.amount}</span>
              </div>
            </div>

            <div className="status-section-actions">
              <button className="btn btn-complete" onClick={() => { closeModal(); handleComplete(); }}>✓ {t.complete}</button>
              <button className="btn btn-call" onClick={() => window.location.href = `tel:${modalBooking.phone}`}>☎ Call</button>
              <button className="btn btn-cancel-status" onClick={() => { closeModal(); openCancelModal(modalBooking.id); }}>✕ {t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Confirm Popup */}
      {showRescheduleConfirm && rescheduleBooking && (
        <div className="booking-popup-overlay">
          <div className="booking-popup-container">
            <div className="booking-popup-header">
              <h3>{t.rescheduleAppointment}</h3>
              <button className="popup-close-btn" onClick={handleCancelReschedule}>✕</button>
            </div>

            <div className="booking-popup-body">
              <div className="popup-section">
                <h4 className="popup-section-title">{t.customerDetails}</h4>
                <div className="popup-detail-row">
                  <span className="popup-label">{t.customerName}:</span>
                  <input
                    type="text"
                    name="name"
                    value={rescheduleData.name}
                    onChange={handleRescheduleChange}
                    className="popup-input"
                  />
                </div>
              </div>

              <div className="popup-section">
                <h4 className="popup-section-title">{t.selectServices}</h4>
                <div className="popup-services-list">
                  {availableServices.map((service) => (
                    <label key={service.id} className="popup-service-item">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.id)}
                        onChange={() => toggleService(service.id)}
                        className="service-checkbox"
                      />
                      <div className="popup-service-info">
                        <span className="popup-service-name">{(service.names && service.names[language]) || service.name}</span>
                        <div className="popup-service-meta">
                          <span className="popup-service-price">₹{service.price}</span>
                          <span className="popup-service-duration">{service.duration} {t.min}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="popup-services-total">
                  <span>{selectedServices.length} {t.servicesSelected}</span>
                  <div className="popup-total-right">
                    <span className="popup-total-price">₹{calculateTotal().totalPrice}</span>
                    <span className="popup-total-duration">{calculateTotal().totalDuration} {t.min}</span>
                  </div>
                </div>
              </div>

              <div className="popup-section">
                <h4 className="popup-section-title">{t.dateAndTime}</h4>
                <div className="popup-datetime-row">
                  <div className="popup-datetime-item">
                    <label className="popup-label">{t.selectDate}:</label>
                    <input
                      type="date"
                      name="date"
                      value={rescheduleData.date}
                      onChange={handleRescheduleChange}
                      className="popup-input"
                    />
                  </div>
                  <div className="popup-datetime-item">
                    <label className="popup-label">{t.selectTime}:</label>
                    <input
                      type="time"
                      name="time"
                      value={rescheduleData.time}
                      onChange={handleRescheduleChange}
                      className="popup-input"
                    />
                  </div>
                </div>
              </div>

              <div className="popup-info-box">
                <p>{t.original}: {rescheduleBooking.date} • {rescheduleBooking.time}</p>
              </div>
            </div>

            <div className="booking-popup-actions">
              <button className="popup-btn popup-btn-confirm" onClick={handleConfirmReschedule}>
                {t.confirm}
              </button>
              <button className="popup-btn popup-btn-cancel" onClick={handleCancelReschedule}>
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Success Popup */}
      {showRescheduleSuccess && (
        <div className="booking-popup-overlay">
          <div className="booking-popup-container success-popup">
            <div className="success-animation">
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>

            <h3 className="success-title">{t.rescheduledSuccessTitle}</h3>
            <p className="success-message">{t.rescheduledSuccessMessage}</p>

            <button className="popup-btn popup-btn-done" onClick={handleRescheduleDone}>
              {t.done}
            </button>
          </div>
        </div>
      )}

      {/* Cancellation Confirm Modal */}
      {showCancelModal && cancelTarget && (
        <div className="cancel-modal-overlay" onClick={closeCancelModal}>
          <div className="cancel-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="cancel-modal-header">
              <h3>{t.cancelAppointment}</h3>
              <button className="cancel-close-btn" onClick={closeCancelModal}>✕</button>
            </div>

            <div className="cancel-section">
              <div className="status-row"><span className="status-row-label">{t.customerName}:</span> <span className="status-row-value">{cancelTarget.name}</span></div>
              <div className="status-row"><span className="status-row-label">{t.servicesLabel}:</span> <span className="status-row-value">{cancelTarget.services}</span></div>
              <div className="status-row"><span className="status-row-label">{t.dateAndTime}:</span> <span className="status-row-value">{cancelTarget.date} • {cancelTarget.time}</span></div>
              <div className="status-row"><span className="status-row-label">{t.amount}:</span> <span className="status-row-value">₹{cancelTarget.amount}</span></div>
            </div>

            <div className="cancel-section">
              <label className="cancel-label" htmlFor="cancel-reason">{t.cancellationReason}</label>
              <select id="cancel-reason" className="cancel-select" value={cancelReason} onChange={(e)=>setCancelReason(e.target.value)}>
                <option value="" disabled>{t.selectReason}</option>
                <option value="no-show">{t.reasonCustomerNoShow}</option>
                <option value="salon">{t.reasonSalonIssue}</option>
                <option value="weather">{t.reasonWeather}</option>
                <option value="other">{t.reasonOther}</option>
              </select>
            </div>

            {cancelReason === 'other' && (
              <div className="cancel-section">
                <label className="cancel-label" htmlFor="cancel-note">{t.addNotePlaceholder}</label>
                <textarea id="cancel-note" className="cancel-textarea" rows={3} value={cancelNote} onChange={(e)=>setCancelNote(e.target.value)} placeholder={t.addNotePlaceholder} />
              </div>
            )}

            <div className="cancel-actions">
              <button className="cancel-btn outline" onClick={closeCancelModal}>{t.close}</button>
              <button className="cancel-btn" onClick={confirmCancel}>{t.confirmCancellation}</button>
            </div>
            <div className="cancellation-sms-note">SMS will be sent to {cancelTarget.name}</div>
          </div>
        </div>
      )}

      {/* Global toast */}
      <div className={`toast ${toast.show ? 'visible' : ''}`}>{toast.message}</div>
    </section>
  )
}
 
