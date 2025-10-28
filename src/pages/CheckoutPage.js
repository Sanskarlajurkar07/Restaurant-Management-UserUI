"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
  clearCart,
  customerInfo,
}) {
  const navigate = useNavigate()
  const [selectedItemForInstructions, setSelectedItemForInstructions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [orderType, setOrderType] = useState("takeaway")
  const [tableNumber, setTableNumber] = useState(null)
  const [availableTables, setAvailableTables] = useState([])

  // Fetch available tables when order type is dineIn
  useEffect(() => {
    const fetchAvailableTables = async () => {
      if (orderType === "dineIn") {
        try {
          const capacity = parseInt(customerInfo.numberOfMembers) || 2
          const response = await fetch(`${API_BASE_URL}/tables/available/${capacity}`)
          const data = await response.json()
          setAvailableTables(data.data || [])
        } catch (error) {
          console.error("Error fetching tables:", error)
          setAvailableTables([])
        }
      }
    }
    fetchAvailableTables()
  }, [orderType, customerInfo.numberOfMembers])

  const handlePlaceOrder = async () => {
    // Validate dineIn requires table selection
    if (orderType === "dineIn" && !tableNumber) {
      alert("Please select a table for dine-in orders")
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
          numberOfMembers: Number.parseInt(customerInfo.numberOfMembers),
          ...(orderType === "takeaway" ? { address: customerInfo.address } : {}),
        },
        ...(orderType === "dineIn" && tableNumber ? { tableNumber } : {}),
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
  const tax = 5
  const total = subtotal + deliveryCharge + tax

  if (cart.length === 0) {
    return (
      <div className="checkout-page empty-cart">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate("/home")}>Continue Shopping</button>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <button onClick={() => navigate("/home")} className="back-button">
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

        {orderType === "dineIn" && (
          <div className="table-selection">
            <h3>Select Table</h3>
            <select 
              value={tableNumber || ""} 
              onChange={(e) => setTableNumber(parseInt(e.target.value))}
              className="table-select"
            >
              <option value="">Choose a table</option>
              {availableTables.map((table) => (
                <option key={table._id || table.id} value={table.tableNumber}>
                  Table {table.tableNumber} (Capacity: {table.capacity})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="customer-details-display">
          <h3>Your details</h3>
          <p>{customerInfo.name}, {customerInfo.phoneNumber}</p>
          {orderType === "dineIn" && tableNumber && (
            <p className="table-info">
              <span className="icon">🪑</span> Table {tableNumber}
            </p>
          )}
          {orderType === "takeaway" && (
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
