"use client"

import { useState } from "react"

export default function SalonPhotos() {
  const [photos, setPhotos] = useState([
    { id: 1, url: "/placeholder.jpg", name: "Salon Interior" },
    { id: 2, url: "/placeholder.jpg", name: "Work Station" },
  ])

  const addPhoto = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPhotos([
          ...photos,
          {
            id: Date.now(),
            url: event.target.result,
            name: file.name,
          },
        ])
      }
      reader.readAsDataURL(file)
    }
  }

  const deletePhoto = (id) => {
    setPhotos(photos.filter((p) => p.id !== id))
  }

  return (
    <div className="glass-card">
      <h2 className="section-title">Salon Photos</h2>

      <div className="photo-section">
        <label className="photo-item" style={{ cursor: "pointer", border: "2px dashed rgba(102, 126, 234, 0.5)" }}>
          <div className="photo-placeholder">
            <div className="photo-placeholder-icon">📸</div>
            <div className="photo-placeholder-text">Upload Photo</div>
          </div>
          <input type="file" accept="image/*" onChange={addPhoto} style={{ display: "none" }} />
        </label>

        <div className="photo-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="photo-item">
              <img src={photo.url || "/placeholder.svg"} alt={photo.name} />
              <button className="photo-delete-btn" onClick={() => deletePhoto(photo.id)}>
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
