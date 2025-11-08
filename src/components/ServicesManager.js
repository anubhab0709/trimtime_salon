"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "../LanguageContext"
import { translations } from "../translations"

export default function ServicesManager() {
  const { language } = useLanguage()
  const t = translations[language]
  const [services, setServices] = useState([
    { id: 1, name: "Hair Cut", price: 300, duration: 30, category: "Hair", gender: "Men", names: { English: "Hair Cut", Bengali: "হেয়ার কাট" } },
    { id: 2, name: "Facial Treatment", price: 500, duration: 45, category: "Facial", gender: "Women", names: { English: "Facial Treatment", Bengali: "ফেসিয়াল চিকিৎসা" } },
    { id: 3, name: "Hair Coloring", price: 800, duration: 90, category: "Hair", gender: "Unisex", names: { English: "Hair Coloring", Bengali: "চুল রং করা" } },
    { id: 4, name: "Manicure", price: 400, duration: 35, category: "Nails", gender: "Women", names: { English: "Manicure", Bengali: "ম্যানিকিউর" } },
    { id: 5, name: "Pedicure", price: 450, duration: 40, category: "Nails", gender: "Unisex", names: { English: "Pedicure", Bengali: "পেডিকিউর" } },
  ])
  // New service form state
  const [newService, setNewService] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [newDuration, setNewDuration] = useState("")
  const [newCategory, setNewCategory] = useState("Hair")
  const [newGender, setNewGender] = useState("Unisex")
  const [showAddPreview, setShowAddPreview] = useState(false)
  const [pendingNewService, setPendingNewService] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState("")
  const [editPrice, setEditPrice] = useState("")
  const [editDuration, setEditDuration] = useState("")
  const [editCategory, setEditCategory] = useState("")
  const [editGender, setEditGender] = useState("")

  const categories = ["Hair", "Facial", "Nails", "Spa", "Other"]
  const genders = ["Men", "Women", "Unisex"]

  // Service name dropdown options fetched from backend (fallback to existing list)
  const [serviceOptions, setServiceOptions] = useState([])
  const [loadingServices, setLoadingServices] = useState(false)

  // Toast state for edit/delete confirmations
  const [toastMessage, setToastMessage] = useState("")
  const [showToast, setShowToast] = useState(false)
  // Success animation popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  useEffect(() => {
    // Attempt to fetch available service names from backend
    setLoadingServices(true)
    fetch("/api/services/names")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setServiceOptions(data)
        } else {
          setServiceOptions([...new Set(services.map((s) => s.name))])
        }
      })
      .catch(() => {
        // Fallback to existing service names
        setServiceOptions([...new Set(services.map((s) => s.name))])
      })
    .finally(() => setLoadingServices(false))
  }, [services])

  const addService = () => {
    if (newService.trim() && newPrice.trim() && newDuration.trim()) {
      const previewObj = {
        id: Date.now(),
        name: newService,
        price: Number.parseFloat(newPrice),
        duration: Number.parseInt(newDuration),
        category: newCategory,
        gender: newGender,
      }
      setPendingNewService(previewObj)
      setShowAddPreview(true)
    }
  }

  const confirmAddService = () => {
    if (!pendingNewService) return
    const srv = {
      ...pendingNewService,
      names: { [language]: pendingNewService.name }
    }
    setServices([...services, srv])
    setShowAddPreview(false)
    setPendingNewService(null)
    setNewService("")
    setNewPrice("")
    setNewDuration("")
    setNewCategory("Hair")
    setNewGender("Unisex")
    // Success animation then toast
    setShowSuccessPopup(true)
    setSuccessMessage(`${t.newServiceAdded || 'New Service added'}\n${srv.name}`)
    setTimeout(() => setShowSuccessPopup(false), 1600)
    setTimeout(() => triggerToast(t.serviceAdded || 'Service added'), 1700)
  }

  const cancelAddPreview = () => {
    setShowAddPreview(false)
    setPendingNewService(null)
  }

  const startEdit = (service) => {
    setEditingId(service.id)
    setEditName(service.name)
    setEditPrice(service.price.toString())
    setEditDuration(service.duration.toString())
    setEditCategory(service.category)
    setEditGender(service.gender)
  }

  // Edit preview & delete confirmation modal state
  const [showEditPreview, setShowEditPreview] = useState(false)
  const [pendingEdit, setPendingEdit] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState(null)

  const openEditPreview = (id) => {
    // build a pending edit object for preview
    const editObj = {
      id,
      name: editName,
      price: Number.parseFloat(editPrice),
      duration: Number.parseInt(editDuration),
      category: editCategory,
      gender: editGender,
    }
    setPendingEdit(editObj)
    setShowEditPreview(true)
  }

  const confirmEdit = () => {
    if (!pendingEdit) return
    setServices(
      services.map((s) =>
        s.id === pendingEdit.id
          ? {
              ...s,
              name: pendingEdit.name,
              names: { ...(s.names || {}), [language]: pendingEdit.name },
              price: pendingEdit.price,
              duration: pendingEdit.duration,
              category: pendingEdit.category,
              gender: pendingEdit.gender,
            }
          : s
      )
    )
    setEditingId(null)
    setPendingEdit(null)
    setShowEditPreview(false)
    // Show animated success popup like language change, then toast
    setShowSuccessPopup(true)
    setSuccessMessage(t.serviceUpdatedSuccessfully || t.serviceUpdated || 'Service updated successfully')
    setTimeout(() => setShowSuccessPopup(false), 1600)
    setTimeout(() => triggerToast(t.serviceUpdatedSuccessfully || t.serviceUpdated || 'Service updated successfully'), 1700)
  }

  const cancelEditPreview = () => {
    setShowEditPreview(false)
    setPendingEdit(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName("")
    setEditPrice("")
    setEditDuration("")
    setEditCategory("")
  }

  const requestDeleteService = (service) => {
    setServiceToDelete(service)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteService = () => {
    if (serviceToDelete) {
      setServices(services.filter((s) => s.id !== serviceToDelete.id))
      // Show animated success popup like language change, then toast
      setShowSuccessPopup(true)
      setSuccessMessage(t.serviceDeletedSuccessfully || t.serviceDeleted || 'Service deleted successfully')
      setTimeout(() => setShowSuccessPopup(false), 1600)
      setTimeout(() => triggerToast(t.serviceDeletedSuccessfully || t.serviceDeleted || 'Service deleted successfully'), 1700)
    }
    setServiceToDelete(null)
    setShowDeleteConfirm(false)
  }

  const cancelDeleteService = () => {
    setServiceToDelete(null)
    setShowDeleteConfirm(false)
  }

  return (
    <div className="services-manager-container">
      <h2 className="section-title services-manager-title">{t.manageServices}</h2>

      {/* Add New Service Card */}
      <div className="service-add-card glass-card">
        <h3 className="add-service-heading">{t.addNewService}</h3>
        <div className="add-service-form">
          {/* Gender */}
          <div className="form-group">
            <label className="form-label">{t.gender}</label>
            <select
              value={newGender}
              onChange={(e) => setNewGender(e.target.value)}
              className="form-input"
            >
              {genders.map((gen) => {
                const key = gen.toLowerCase()
                return (
                  <option key={gen} value={gen}>
                    {t[key] || gen}
                  </option>
                )
              })}
            </select>
          </div>
          {/* Category */}
          <div className="form-group">
            <label className="form-label">{t.category}</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="form-input"
            >
              {categories.map((cat) => {
                const key = cat.toLowerCase()
                return (
                  <option key={cat} value={cat}>
                    {t[key] || cat}
                  </option>
                )
              })}
            </select>
          </div>
          {/* Service Name Dropdown */}
          <div className="form-group">
            <label className="form-label">{t.serviceName}</label>
            <select
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              className="form-input"
            >
              <option value="">{loadingServices ? (t.loading || "Loading...") : t.selectService || "Select service"}</option>
              {serviceOptions.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          {/* Duration */}
          <div className="form-group">
            <label className="form-label">{t.duration} ({t.min})</label>
            <input
              type="number"
              placeholder="30"
              value={newDuration}
              onChange={(e) => setNewDuration(e.target.value)}
              className="form-input"
            />
          </div>
          {/* Price */}
            <div className="form-group">
              <label className="form-label">{t.price} (₹)</label>
              <input
                type="number"
                placeholder="300"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="form-input"
              />
            </div>
          <div className="add-service-actions">
            <button
              className="btn btn-secondary-action"
              onClick={() => {
                setNewService("")
                setNewPrice("")
                setNewDuration("")
                setNewCategory("Hair")
                setNewGender("Unisex")
              }}
            >
              {t.reset}
            </button>
            <button className="btn btn-primary-action" onClick={addService} disabled={!newService || !newPrice || !newDuration}>
              {t.addService}
            </button>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="services-grid">
        {services.length > 0 ? (
          services.map((service) => (
            <div key={service.id} className="service-item-card glass-card" data-gender={service.gender}>
              {editingId === service.id ? (
                <div className="service-edit-form">
                  <div className="form-group-compact">
                    <label className="form-label-small">{t.serviceName}</label>
                    <input
                      className="form-input-compact"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>

                  <div className="form-group-compact">
                    <label className="form-label-small">{t.category}</label>
                    <select
                      className="form-input-compact"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                    >
                      {categories.map((cat) => {
                        const key = cat.toLowerCase()
                        return (
                          <option key={cat} value={cat}>
                            {t[key] || cat}
                          </option>
                        )
                      })}
                    </select>
                  </div>

                  <div className="form-group-compact">
                    <label className="form-label-small">{t.gender}</label>
                    <select
                      className="form-input-compact"
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value)}
                    >
                      {genders.map((gen) => {
                        const key = gen.toLowerCase()
                        return (
                          <option key={gen} value={gen}>
                            {t[key] || gen}
                          </option>
                        )
                      })}
                    </select>
                  </div>

                  <div className="form-row-compact">
                    <div className="form-group-compact">
                      <label className="form-label-small">{t.duration}</label>
                      <input
                        className="form-input-compact"
                        value={editDuration}
                        onChange={(e) => setEditDuration(e.target.value)}
                        type="number"
                      />
                    </div>

                    <div className="form-group-compact">
                      <label className="form-label-small">{t.price} (₹)</label>
                      <input
                        className="form-input-compact"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        type="number"
                      />
                    </div>
                  </div>

                  <div className="service-edit-actions">
                    <button className="btn-service-action btn-save" onClick={() => openEditPreview(service.id)}>
                      {t.save || 'Save'}
                    </button>
                    <button className="btn-service-action btn-cancel-edit" onClick={cancelEdit}>
                      {t.cancel}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="service-item-header">
                    <div className="service-category-badge">{t[service.category.toLowerCase()] || service.category}</div>
                    <div className="service-item-price">₹{service.price}</div>
                  </div>

                  <h3 className="service-item-name">{(service.names && service.names[language]) || service.name}</h3>
                  
                  <div className="service-item-meta">
                    <span className="service-gender-badge">{t[service.gender.toLowerCase()] || service.gender}</span>
                    <span className="service-duration-badge">⏱ {service.duration} {t.min}</span>
                  </div>

                  <div className="service-item-actions">
                    <button className="btn-icon-action btn-edit-icon" onClick={() => startEdit(service)}>
                      ✏️ {t.edit}
                    </button>
                    <button className="btn-icon-action btn-delete-icon" onClick={() => requestDeleteService(service)}>
                      🗑️ {t.delete}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>{t.noServicesAddedYet} {t.addFirstServiceAbove}</p>
          </div>
        )}
      </div>
      {showToast && <div className={`toast ${showToast ? 'visible' : ''}`}>{toastMessage}</div>}

      {/* Success Animation Popup (like language change) */}
      {showSuccessPopup && (
        <div className="booking-popup-overlay" onClick={() => setShowSuccessPopup(false)}>
          <div className="booking-popup-container language-change-popup success-popup" onClick={(e) => e.stopPropagation()}>
            <div className="success-animation">
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            <h3 className="success-title">{successMessage}</h3>
          </div>
        </div>
      )}

      {/* Edit Preview Modal */}
      {showEditPreview && pendingEdit && (
        <div className="service-modal-overlay" role="dialog" aria-modal="true">
          <div className="service-modal">
            <h3 className="service-modal-title">{t.confirmEditTitle || 'Confirm Edit'}</h3>
            <div className="service-modal-body">
              <ul className="service-preview-list">
                <li><span>{t.serviceName || 'Service'}:</span> {pendingEdit.name}</li>
                <li><span>{t.category || 'Category'}:</span> {pendingEdit.category}</li>
                <li><span>{t.gender || 'Gender'}:</span> {pendingEdit.gender}</li>
                <li><span>{t.duration || 'Duration'}:</span> {pendingEdit.duration} {t.min}</li>
                <li><span>{t.price || 'Price'}:</span> ₹{pendingEdit.price}</li>
              </ul>
            </div>
            <div className="service-modal-actions">
              <button className="modal-btn confirm" onClick={confirmEdit}>{t.confirmEdit || 'Confirm Edit'}</button>
              <button className="modal-btn cancel" onClick={cancelEditPreview}>{t.cancel || 'Cancel'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && serviceToDelete && (
        <div className="service-modal-overlay" role="dialog" aria-modal="true">
          <div className="service-modal">
            <h3 className="service-modal-title">{t.confirmDeleteTitle || 'Delete Service'}</h3>
            <div className="service-modal-body">
              <p>{t.areYouSureDelete || 'Are you sure you want to delete this service?'}<br/><strong>{serviceToDelete.name}</strong></p>
            </div>
            <div className="service-modal-actions">
              <button className="modal-btn danger" onClick={confirmDeleteService}>{t.delete || 'Delete'}</button>
              <button className="modal-btn cancel" onClick={cancelDeleteService}>{t.cancel || 'Cancel'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Preview Modal */}
      {showAddPreview && pendingNewService && (
        <div className="service-modal-overlay" role="dialog" aria-modal="true">
          <div className="service-modal">
            <h3 className="service-modal-title">{t.confirmAddTitle || 'Confirm New Service'}</h3>
            <div className="service-modal-body">
              <ul className="service-preview-list">
                <li><span>{t.serviceName || 'Service'}:</span> {pendingNewService.name}</li>
                <li><span>{t.category || 'Category'}:</span> {pendingNewService.category}</li>
                <li><span>{t.gender || 'Gender'}:</span> {pendingNewService.gender}</li>
                <li><span>{t.duration || 'Duration'}:</span> {pendingNewService.duration} {t.min}</li>
                <li><span>{t.price || 'Price'}:</span> ₹{pendingNewService.price}</li>
              </ul>
            </div>
            <div className="service-modal-actions">
              <button className="modal-btn confirm" onClick={confirmAddService}>{t.confirmAdd || 'Confirm Service'}</button>
              <button className="modal-btn cancel" onClick={cancelAddPreview}>{t.cancel || 'Cancel'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
