"use client"

import { useState, useEffect } from "react"
import "./salon-admin.css"
import SalonHeader from "./SalonHeader"
import TodaysAppointments from "./TodaysAppointments"
import ManualBooking from "./ManualBooking"
import AllBookings from "./AllBookings"
import SalonProfile from "./SalonProfile"
import TotalRevenue from "./TotalRevenue"
import BottomNav from "./BottomNav"
import ServicesManager from "./ServicesManager"

export default function SalonAdminDashboard() {
  const [currentPage, setCurrentPage] = useState("home")

  // Wrapper to change page and push a history entry so Back goes to previous page
  const goToPage = (page) => {
    setCurrentPage(page)
    try {
      // push a hash-based state so it's reflected in browser history without changing routes
      window.history.pushState({ page }, '', `#${page}`)
    } catch (e) {
      // ignore if not available
    }
  }

  useEffect(() => {
    // On mount, initialize page from hash if present and replace initial history state
    const initial = window.location.hash ? window.location.hash.replace('#', '') : 'home'
    setCurrentPage(initial)
    try {
      window.history.replaceState({ page: initial }, '', `#${initial}`)
    } catch (e) {}

    const onPop = (e) => {
      const statePage = (e.state && e.state.page) || (window.location.hash ? window.location.hash.replace('#', '') : 'home')
      setCurrentPage(statePage || 'home')
    }

    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <div className="salon-home-content">
            <TodaysAppointments />
            <ManualBooking />
          </div>
        )
      case "bookings":
        return <AllBookings />
      case "services":
        return (
          <div>
            <ServicesManager />
          </div>
        )
      case "total-revenue":
        return <TotalRevenue />
      case "profile":
        return <SalonProfile />
      default:
        return (
          <div className="salon-home-content">
            <TodaysAppointments />
          </div>
        )
    }
  }

  return (
    <div className="salon-admin-container">
      {currentPage !== "profile" && currentPage !== "total-revenue" && <SalonHeader />}
      <main className="salon-admin-main">{renderPage()}</main>
      <BottomNav currentPage={currentPage} setCurrentPage={goToPage} />
    </div>
  )
}
