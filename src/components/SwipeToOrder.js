"use client"

import { useRef, useState } from "react"
import "../styles/SwipeToOrder.css"

function SwipeToOrder({ onSwipeComplete, loading }) {
  const [swiped, setSwiped] = useState(false)
  const [startX, setStartX] = useState(0)
  const sliderRef = useRef(null)
  const thumbRef = useRef(null)

  const handleMouseDown = (e) => {
    setStartX(e.clientX)
  }

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX)
  }

  const handleMouseMove = (e) => {
    if (startX === 0 || swiped) return
    const currentX = e.clientX
    const diff = currentX - startX
    const sliderWidth = sliderRef.current.offsetWidth
    const thumbWidth = thumbRef.current.offsetWidth
    const maxDrag = sliderWidth - thumbWidth

    if (diff > 0 && diff <= maxDrag) {
      thumbRef.current.style.transform = `translateX(${diff}px)`
    }

    if (diff > maxDrag * 0.8) {
      completeSwipe()
    }
  }

  const handleTouchMove = (e) => {
    if (startX === 0 || swiped) return
    const currentX = e.touches[0].clientX
    const diff = currentX - startX
    const sliderWidth = sliderRef.current.offsetWidth
    const thumbWidth = thumbRef.current.offsetWidth
    const maxDrag = sliderWidth - thumbWidth

    if (diff > 0 && diff <= maxDrag) {
      thumbRef.current.style.transform = `translateX(${diff}px)`
    }

    if (diff > maxDrag * 0.8) {
      completeSwipe()
    }
  }

  const handleMouseUp = () => {
    if (!swiped) {
      thumbRef.current.style.transform = "translateX(0)"
    }
    setStartX(0)
  }

  const handleTouchEnd = () => {
    if (!swiped) {
      thumbRef.current.style.transform = "translateX(0)"
    }
    setStartX(0)
  }

  const completeSwipe = () => {
    setSwiped(true)
    onSwipeComplete()
  }

  return (
    <div
      className={`swipe-to-order ${swiped ? "completed" : ""}`}
      ref={sliderRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="swipe-thumb" ref={thumbRef} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 12l7 7 7-7"></path>
        </svg>
      </div>
      <span className="swipe-text">{swiped ? "Processing..." : "Swipe to Order"}</span>
    </div>
  )
}

export default SwipeToOrder
