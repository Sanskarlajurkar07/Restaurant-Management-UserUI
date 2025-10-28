"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import CartSummary from "../components/CartSummary"
import OrderTypeSelector from "../components/OrderTypeSelector"
import CustomerForm from "../components/CustomerForm"
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
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phoneNumber: "",
    numberOfMembers: "2",
    address: "",
    tableNumber: null,
  })
  const [selectedItemForInstructions, setSelectedItemForInstructions] = useState(null)
  const [availableTables, setAvailableTables] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch available tables when numberOfMembers changes
  useEffect(() => {
    if (orderType === "dineIn" && customerInfo.numberOfMembers) {
      fetchAvailableTables(customerInfo.numberOfMembers)
    }
  }, [customerInfo.numberOfMembers, orderType])

  const fetchAvailableTables = async (capacity) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tables/available/${capacity}`)
      const data = await response.json()
      setAvailableTables(data.data || [])
    } catch (error) {
      console.error("Error fetching tables:", error)
      setAvailableTables([])
    }
  }

  const handlePlaceOrder = async () => {
    // Validate required fields
    if (!customerInfo.name || !customerInfo.phoneNumber) {
      alert("Please fill in all required fields")
      return
    }

    if (orderType === "dineIn") {
      if (!customerInfo.numberOfMembers || !customerInfo.tableNumber) {
        alert("Please select number of members and a table")
        return
      }
    } else {
      if (!customerInfo.address) {
        alert("Please enter your address")
        return
      }
    }

    if (cart.length === 0) {
      alert("Your cart is empty")
      return
    }

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

        <CustomerForm
          orderType={orderType}
          customerInfo={customerInfo}
          onUpdateCustomerInfo={setCustomerInfo}
          availableTables={availableTables}
        />

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
