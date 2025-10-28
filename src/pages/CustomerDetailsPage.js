"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/CustomerDetailsPage.css"

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://restaurant-management-backend-2.onrender.com/api"

function CustomerDetailsPage({ setCustomerInfo }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    numberOfMembers: "2",
    address: "",
  })

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name || !formData.phoneNumber || !formData.numberOfMembers || !formData.address) {
      alert("Please fill in all required fields")
      return
    }

    setCustomerInfo(formData)
    navigate("/home")
  }

  return (
    <div className="customer-details-page">
      {/* Background Content */}
      <div className="background-content">
        <header className="header">
          <div className="header-text">
            <h1>Good evening</h1>
            <p>Place you order here</p>
          </div>
        </header>

        <div className="search-bar">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input type="text" placeholder="Search" disabled />
        </div>

        <div className="category-tabs">
          <button className="category-tab">Burger</button>
          <button className="category-tab active">Pizza</button>
          <button className="category-tab">Drink</button>
          <button className="category-tab">French fries</button>
          <button className="category-tab">Veggies</button>
        </div>

        <h2 className="category-title">Pizza</h2>

        <div className="menu-grid">
          <div className="menu-item">
            <div className="menu-item-placeholder">Marinara</div>
            <div className="menu-item-footer">
              <span className="item-name">Marinara</span>
              <span className="item-price">₹ 200</span>
              <button className="add-button">+</button>
            </div>
          </div>
          <div className="menu-item">
            <div className="menu-item-placeholder">Pepperoni</div>
            <div className="menu-item-footer">
              <span className="item-name">Pepperoni</span>
              <span className="item-price">₹ 200</span>
              <button className="add-button">+</button>
            </div>
          </div>
        </div>

        <button className="next-button-bottom">Next</button>
      </div>

      {/* Modal Overlay */}
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Enter Your Details</h2>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="full name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Number of Person</label>
            <input
              type="text"
              placeholder="2,4,6"
              value={formData.numberOfMembers}
              onChange={(e) => handleChange("numberOfMembers", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              placeholder="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Contact</label>
            <input
              type="tel"
              placeholder="phone"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
            />
          </div>

          <button className="order-now-button" onClick={handleSubmit}>
            Order Now
          </button>
        </div>
      </div>

    </div>
  )
}

export default CustomerDetailsPage
