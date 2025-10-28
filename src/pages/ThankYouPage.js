"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/ThankYouPage.css"

function ThankYouPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/")
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="thank-you-page">
      <div className="thank-you-content">
        <h1>Thanks For Ordering</h1>
        <div className="checkmark-circle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <p className="redirect-text">Redirecting in 3</p>
      </div>
    </div>
  )
}

export default ThankYouPage
