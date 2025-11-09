import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import './components/salon-admin.css'

import SalonAdminDashboard from './components/salon-admin'
import AllBookings from './components/AllBookings'
import ManualBooking from './components/ManualBooking'
import SalonPhotos from './components/SalonPhotos'
import SalonProfile from './components/SalonProfile'
import ContactUs from './components/ContactUs'
import ServicesManager from './components/ServicesManager'
import TodaysAppointments from './components/TodaysAppointments'
import BottomNav from './components/BottomNav'
import AuthPage from './components/Auth'
import RatingsPage from './components/RatingsPage'
import { LanguageProvider } from './LanguageContext'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <main className="app-main">
            <Routes>
              <Route path="/login" element={<AuthPage />} />
              <Route path="/" element={<AuthPage />} />
              <Route path="/home" element={<SalonAdminDashboard />} />
              <Route path="/all-bookings" element={<AllBookings />} />
              <Route path="/manual-booking" element={<ManualBooking />} />
              <Route path="/today" element={<TodaysAppointments />} />
              <Route path="/services" element={<ServicesManager />} />
              <Route path="/photos" element={<SalonPhotos />} />
              <Route path="/profile" element={<SalonProfile />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/ratings" element={<RatingsPage />} />
              {/* keep BottomNav reachable by a route if needed */}
              <Route path="/bottom" element={<BottomNav />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App
