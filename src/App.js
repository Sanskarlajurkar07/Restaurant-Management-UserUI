"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import CustomerDetailsPage from "./pages/CustomerDetailsPage"
import HomePage from "./pages/HomePage"
import CheckoutPage from "./pages/CheckoutPage"
import ThankYouPage from "./pages/ThankYouPage"
import "./App.css"

function App() {
  const [cart, setCart] = useState([])
  const [customerInfo, setCustomerInfo] = useState(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (item) => {
    // Normalize ID: use _id from API or id if already normalized
    const itemId = item._id || item.id
    const normalizedItem = { ...item, id: itemId }
    
    const existingItem = cart.find((cartItem) => cartItem.id === itemId)
    if (existingItem) {
      setCart(
        cart.map((cartItem) => (cartItem.id === itemId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)),
      )
    } else {
      setCart([...cart, { ...normalizedItem, quantity: 1, cookingInstructions: "" }])
    }
  }

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
    } else {
      setCart(cart.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
    }
  }

  const updateCookingInstructions = (itemId, instructions) => {
    setCart(cart.map((item) => (item.id === itemId ? { ...item, cookingInstructions: instructions } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <CustomerDetailsPage 
              setCustomerInfo={setCustomerInfo}
            />
          } 
        />
        <Route 
          path="/home" 
          element={
            customerInfo ? (
              <HomePage 
                cart={cart} 
                addToCart={addToCart} 
                updateQuantity={updateQuantity} 
                customerInfo={customerInfo}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route
          path="/checkout"
          element={
            customerInfo ? (
              <CheckoutPage
                cart={cart}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
                updateCookingInstructions={updateCookingInstructions}
                clearCart={clearCart}
                customerInfo={customerInfo}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/thank-you" element={<ThankYouPage />} />
      </Routes>
    </Router>
  )
}

export default App
