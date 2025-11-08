"use client"

import React, { useState, useRef, useEffect } from "react"
import "./ContactUs.css"

export default function ContactUs() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [formErrors, setFormErrors] = useState({})
  const [showToast, setShowToast] = useState(false)

  // Chat state
  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Hello! How can we help you today?", time: new Date() }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const chatRef = useRef(null)

  // scroll chat to bottom
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, isTyping])

  const validateEmail = (e) => {
    return /^\S+@\S+\.\S+$/.test(e)
  }

  const validateForm = () => {
    const errors = {}
    if (!name.trim()) errors.name = "Name is required"
    if (!email.trim()) errors.email = "Email is required"
    else if (!validateEmail(email)) errors.email = "Enter a valid email"
    if (!message.trim()) errors.message = "Message is required"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    // simulate send
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2800)
    setName("")
    setEmail("")
    setMessage("")
  }

  const sendChat = () => {
    const text = chatInput.trim()
    if (!text) return
    const userMsg = { id: Date.now(), from: "user", text, time: new Date() }
    setMessages((m) => [...m, userMsg])
    setChatInput("")

    // bot reply simulation
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const lower = text.toLowerCase()
      const botText = lower.includes("booking")
        ? "Sure! Please provide your preferred salon and date."
        : "Thanks! Our team will get back to you shortly."
      setMessages((m) => [...m, { id: Date.now() + 1, from: "bot", text: botText, time: new Date() }])
    }, 900)
  }

  const handleChatKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendChat()
    }
  }

  const formatTime = (dt) => {
    try { return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    catch { return '' }
  }

  return (
    <div className="contact-page">
      <header className="contact-header">
        <h1>Contact Us</h1>
        <p className="subtext">We'd love to hear from you!</p>
      </header>

      <main className="contact-grid">
        <section className="contact-left">
          <div className="glass contact-card hover-scale">
            <div className="contact-row">
              <div className="icon-wrap email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6.5C2 5.67 2.67 5 3.5 5h17c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-17A1.5 1.5 0 0 1 2 17.5v-11z" stroke="#374151" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M22 6l-10 7L2 6" stroke="#374151" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </div>
              <div className="contact-info">
                <div className="label">Email</div>
                <a className="contact-link" href="mailto:mytrimtime@gmail.com">mytrimtime@gmail.com</a>
              </div>
            </div>

            <div className="divider" />

            <div className="contact-row">
              <div className="icon-wrap phone">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 16.92V20a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2 4.18 2 2 0 0 1 4 2h3.09a2 2 0 0 1 2 1.72c.12 1.04.38 2.05.77 3a2 2 0 0 1-.45 2.11L8.91 11.09a16 16 0 0 0 6 6l1.25-1.25a2 2 0 0 1 2.11-.45c.95.39 1.96.65 3 .77A2 2 0 0 1 22 16.92z" stroke="#374151" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </div>
              <div className="contact-info">
                <div className="label">Toll-free</div>
                <div className="contact-link">1800-123-456</div>
              </div>
            </div>

          </div>

          <div className="glass map-card">
            <div className="map-wrap">
              <iframe
                title="TrimTime HQ"
                src="https://maps.google.com/maps?q=TrimTime%20HQ&t=&z=13&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        <section className="contact-right">
          <div className="glass form-card">
            <form onSubmit={handleSubmit} noValidate>
              <label className="field">
                <div className="field-label">Name</div>
                <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
                {formErrors.name && <div className="error">{formErrors.name}</div>}
              </label>

              <label className="field">
                <div className="field-label">Email</div>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
                {formErrors.email && <div className="error">{formErrors.email}</div>}
              </label>

              <label className="field">
                <div className="field-label">Message</div>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="textarea" rows={5} />
                {formErrors.message && <div className="error">{formErrors.message}</div>}
              </label>

              <div className="form-actions">
                <button className="btn-gradient" type="submit">Send Message</button>
              </div>
            </form>
          </div>

          <div className="glass chat-card">
            <div className="chat-header">Live Chat</div>
            <div className="chat-body" ref={chatRef}>
              {messages.map((m) => (
                <div key={m.id} className={`chat-row ${m.from === 'bot' ? 'bot' : 'user'}`}>
                  <div className="bubble">{m.text}<div className="time">{formatTime(m.time)}</div></div>
                </div>
              ))}
              {isTyping && (
                <div className="chat-row bot">
                  <div className="bubble typing"><span className="dot"/><span className="dot"/><span className="dot"/></div>
                </div>
              )}
            </div>

            <div className="chat-input">
              <textarea value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={handleChatKey} placeholder="Type a message" rows={1} />
              <button className="btn-send" onClick={sendChat} aria-label="Send">Send</button>
            </div>
          </div>
        </section>
      </main>

      {showToast && <div className="toast">Message sent successfully!</div>}
    </div>
  )
}
