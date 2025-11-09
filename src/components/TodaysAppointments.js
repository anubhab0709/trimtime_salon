"use client"

import { useState } from "react"
import { useLanguage } from "../LanguageContext"
import { translations } from "../translations"

export default function TodaysAppointments() {
  const { language } = useLanguage()
  const t = translations[language]
  
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      phone: "+91 98765 43210",
      time: "10:00 AM",
      services: "Hair Cut, Styling",
      amount: 800,
    },
    {
      id: 2,
      name: "Emily Davis",
      phone: "+91 98765 43211",
      time: "10:45 AM",
      services: "Facial Treatment",
      amount: 1200,
    },
    {
      id: 3,
      name: "Jessica Brown",
      phone: "+91 98765 43212",
      time: "11:30 AM",
      services: "Hair Color, Smoothing",
      amount: 2500,
    },
  ])

  const [activeAppointmentId, setActiveAppointmentId] = useState(null)

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
    const apt = appointments.find(a => a.id === id)
    if (!apt) return
    setCancelTarget(apt)
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
    // Remove appointment
    setAppointments(prev => prev.filter(a => a.id !== cancelTarget.id))
    setActiveAppointmentId(null)
    setShowCancelModal(false)
    // Toasts: cancellation done, then small SMS sent note
    triggerToast(`${t.cancellationDone}`)
    setTimeout(() => {
      triggerToast(`${t.cancellationSmsSent} ${cancelTarget.name}`)
    }, 2400)
  }

  const handleStart = (id) => {
    setActiveAppointmentId(id)
  }

  // Available services list
  const availableServices = [
    { id: "s1", name: "Haircut", names: { English: "Haircut", Bengali: "হেয়ার কাট", Hindi: "हेयरकट" }, category: "men", price: 200, duration: 30 },
    { id: "s2", name: "Haircut (Women)", names: { English: "Haircut (Women)", Bengali: "হেয়ার কাট (মহিলা)", Hindi: "हेयरकट (महिला)" }, category: "women", price: 350, duration: 45 },
    { id: "s3", name: "Shave", names: { English: "Shave", Bengali: "শেভ", Hindi: "शेव" }, category: "men", price: 120, duration: 15 },
    { id: "s4", name: "Beard Trim", names: { English: "Beard Trim", Bengali: "দাড়ি ট্রিম", Hindi: "दाढ़ी ट्रिम" }, category: "men", price: 150, duration: 20 },
    { id: "s5", name: "Manicure", names: { English: "Manicure", Bengali: "ম্যানিকিউর", Hindi: "मैनिक्योर" }, category: "women", price: 300, duration: 35 },
    { id: "s6", name: "Pedicure", names: { English: "Pedicure", Bengali: "পেডিকিউর", Hindi: "पेडिक्योर" }, category: "women", price: 320, duration: 35 },
    { id: "s7", name: "Hair Color", names: { English: "Hair Color", Bengali: "হেয়ার কালার", Hindi: "हेयर कलर" }, category: "unisex", price: 800, duration: 90 },
    { id: "s8", name: "Face Pack", names: { English: "Face Pack", Bengali: "ফেস প্যাক", Hindi: "फेस पैक" }, category: "unisex", price: 400, duration: 40 },
  ]

  const [rescheduleAppointment, setRescheduleAppointment] = useState(null)
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
    const appointment = appointments.find(apt => apt.id === id)
    if (appointment) {
      setRescheduleAppointment(appointment)
      const today = new Date().toISOString().split('T')[0]
      setRescheduleData({
        name: appointment.name,
        date: today,
        time: appointment.time
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
    setRescheduleAppointment(null)
  }

  const handleRescheduleDone = () => {
    setShowRescheduleSuccess(false)
    setRescheduleAppointment(null)
  }

  const handleComplete = () => {
    if (activeAppointmentId) {
      setAppointments(appointments.filter((apt) => apt.id !== activeAppointmentId))
      setActiveAppointmentId(null)
    }
  }

  const activeAppointment = appointments.find((apt) => apt.id === activeAppointmentId)
  const [modalAppointment, setModalAppointment] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const openModal = (appointment) => {
    setModalAppointment(appointment)
    setShowModal(true)
  }

  const closeModal = () => {
    setModalAppointment(null)
    setShowModal(false)
  }

  return (
    <section className="todays-appointments">
      {activeAppointment && (
        <div className="appointment-status-section">
          <div className="status-section-header">
            <h3>{t.currentBooking}</h3>
            <button className="close-status-btn" onClick={() => setActiveAppointmentId(null)}>
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
              <span className="status-row-value">{activeAppointment.name}</span>
            </div>

            <div className="status-row">
              <span className="status-row-label">{t.servicesLabel}:</span>
              <span className="status-row-value">{activeAppointment.services}</span>
            </div>

            <div className="status-row">
              <span className="status-row-label">{t.totalAmount}:</span>
              <span className="status-row-value">₹{activeAppointment.amount}</span>
            </div>

            <div className="status-row">
              <span className="status-row-label">{t.time}:</span>
              <span className="status-row-value">{activeAppointment.time}</span>
            </div>
          </div>

          <div className="status-section-actions">
            <button className="btn btn-complete" onClick={handleComplete}>
              ✓ Complete
            </button>
            <button className="btn btn-cancel-status" onClick={() => openCancelModal(activeAppointmentId)}>
              ✕ Cancel
            </button>
          </div>
        </div>
      )}

        <h2 className="section-title">{t.todaysAppointments}</h2>

      <div className="appointments-list">
        {appointments.map((appointment, index) => (
          <div key={appointment.id} className="booking-card" onClick={() => openModal(appointment)}>
            <span className="card-serial-badge">#{index + 1}</span>
            <div className="booking-header">
              <div className="booking-info">
                <h3 className="booking-name">{appointment.name}</h3>
                <p className="booking-phone">{appointment.phone}</p>
                <p className="booking-time">{appointment.time}</p>
              </div>
            </div>

          <p className="booking-services">{t.selectServices}: {appointment.services}</p>

            <div className="booking-actions">
              <button className="btn btn-start" onClick={(e) => { e.stopPropagation(); handleStart(appointment.id); }}>
                {t.start}
              </button>

              <button className="btn btn-reschedule" onClick={(e) => { e.stopPropagation(); handleReschedule(appointment.id); }}>
                {t.reschedule}
              </button>

              <button className="btn btn-cancel" onClick={(e) => { e.stopPropagation(); openCancelModal(appointment.id); }}>
                {t.cancel}
              </button>

              <button
                className="btn btn-call btn-call-round"
                aria-label={`Call ${appointment.name}`}
                onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${appointment.phone}`; }}
                title={`Call ${appointment.phone}`}
              >
                ☎
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for appointment details */}
      {showModal && modalAppointment && (
        <div className="appointment-popup-backdrop" onClick={closeModal}>
          <div className="appointment-popup" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="status-header">
              <h3>{modalAppointment.name}</h3>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>

            <div className="status-body">
                <div className="status-row">
                  <span className="status-row-label">{t.time}:</span>
                  <span className="status-row-value">{modalAppointment.time}</span>
                </div>

                <div className="status-row">
                  <span className="status-row-label">{t.phoneNumber}:</span>
                  <span className="status-row-value">{modalAppointment.phone}</span>
                </div>

                <div className="status-row">
                  <span className="status-row-label">{t.servicesLabel}:</span>
                  <span className="status-row-value">{modalAppointment.services}</span>
                </div>

                <div className="status-row">
                  <span className="status-row-label">{t.amount}:</span>
                  <span className="status-row-value">₹{modalAppointment.amount}</span>
                </div>
            </div>

            <div className="status-section-actions">
              <button className="btn btn-complete" onClick={() => { closeModal(); handleComplete(); }}>✓ Complete</button>
              <button className="btn btn-call" onClick={() => window.location.href = `tel:${modalAppointment.phone}`}>☎ Call</button>
              <button className="btn btn-cancel-status" onClick={() => { closeModal(); openCancelModal(modalAppointment.id); }}>✕ Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Confirm Popup */}
      {showRescheduleConfirm && rescheduleAppointment && (
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
                <p>{t.original}: {rescheduleAppointment.time}</p>
              </div>
            </div>

            <div className="booking-popup-actions">
              <button className="popup-btn popup-btn-confirm" onClick={handleConfirmReschedule}>
                Confirm
              </button>
              <button className="popup-btn popup-btn-cancel" onClick={handleCancelReschedule}>
                Cancel
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
              {t.done || 'Done'}
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
              <div className="status-row"><span className="status-row-label">{t.time}:</span> <span className="status-row-value">{cancelTarget.time}</span></div>
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
      
      {/* More link to full bookings page */}
      <div className="appointments-more-row">
        <button
          type="button"
          className="btn btn-more-bookings"
          onClick={() => {
            try {
              // Navigate to bookings (showing today's bookings by default)
              window.history.pushState({ page: 'bookings' }, '', '#bookings')
              window.dispatchEvent(new PopStateEvent('popstate'))
            } catch (e) {
              window.location.hash = '#bookings'
            }
          }}
        >
          {t.viewAll || 'View All'}
        </button>
      </div>
      
    </section>
  )
}
