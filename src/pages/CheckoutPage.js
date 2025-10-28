"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import CartSummary from "../components/CartSummary"
import OrderTypeSelector from "../components/OrderTypeSelector"
import SwipeToOrder from "../components/SwipeToOrder"
import CookingInstructionsModal from "../components/CookingInstructionsModal"
import "../styles/CheckoutPage.css"

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://restaurant-management-backend-2.onrender.com/api"

function CheckoutPage({
  cart,
  removeFromCart,
  updateQuantity,
  updateCookingInstructions,
  orderType,
  setOrderType,
  clearCart,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [customerInfo, setCustomerInfo] = useState(
    location.state?.customerInfo || {
      name: "",
      phoneNumber: "",
      numberOfMembers: "2",
      address: "",
      tableNumber: null,
    }
  )
  const [selectedItemForInstructions, setSelectedItemForInstructions] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePlaceOrder = async () => {

    setLoading(true)
    try {
      const orderPayload = {
        items: cart.map((item) => ({
          menuItem: item.id,
          quantity: item.quantity,
        })),
        orderType: orderType === "dineIn" ? "dineIn" : "takeaway",
        customerInfo: {
          name: customerInfo.name,
          phoneNumber: customerInfo.phoneNumber,
          ...(orderType === "dineIn" ? { numberOfMembers: Number.parseInt(customerInfo.numberOfMembers) } : {}),
          ...(orderType === "takeaway" ? { address: customerInfo.address } : {}),
        },
        ...(orderType === "dineIn" ? { tableNumber: customerInfo.tableNumber } : {}),
        cookingInstructions: cart
          .filter((item) => item.cookingInstructions)
          .map((item) => `${item.name}: ${item.cookingInstructions}`)
          .join("\n") || "",
      }

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      })

      if (response.ok) {
        clearCart()
        navigate("/thank-you")
      } else {
        alert("Error placing order. Please try again.")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      alert("Error placing order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryCharge = orderType === "takeaway" ? 50 : 0
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + deliveryCharge + tax

  if (cart.length === 0) {
    return (
      <div className="checkout-page empty-cart">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate("/")}>Continue Shopping</button>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <button onClick={() => navigate("/")} className="back-button">
          ← Back
        </button>
        <h1>Order Summary</h1>
      </header>

      <div className="checkout-content">
        <CartSummary
          items={cart}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onAddInstructions={setSelectedItemForInstructions}
        />

        <div className="pricing-section">
          <div className="price-row">
            <span>Item Total</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          {orderType === "takeaway" && (
            <div className="price-row">
              <span>Delivery Charge</span>
              <span>₹{deliveryCharge.toFixed(2)}</span>
            </div>
          )}
          <div className="price-row">
            <span>Taxes</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="price-row total">
            <span>Grand Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        <OrderTypeSelector orderType={orderType} onSelectOrderType={setOrderType} />

        <div className="customer-details-display">
          <h3>Your details</h3>
          <p>{customerInfo.name}, {customerInfo.phoneNumber}</p>
          {orderType === "dineIn" && customerInfo.tableNumber && (
            <p>Table {customerInfo.tableNumber}</p>
          )}
          {orderType === "takeaway" && customerInfo.address && (
            <>
              <p className="address-info">
                <span className="icon">📍</span> {customerInfo.address}
              </p>
              <p className="delivery-time">
                <span className="icon">🕐</span> Delivery in 42 mins
              </p>
            </>
          )}
        </div>

        <SwipeToOrder onSwipeComplete={handlePlaceOrder} loading={loading} />
      </div>

      {selectedItemForInstructions && (
        <CookingInstructionsModal
          item={selectedItemForInstructions}
          onClose={() => setSelectedItemForInstructions(null)}
          onSave={(instructions) => {
            updateCookingInstructions(selectedItemForInstructions.id, instructions)
            setSelectedItemForInstructions(null)
          }}
        />
      )}
    </div>
  )
}

export default CheckoutPage
