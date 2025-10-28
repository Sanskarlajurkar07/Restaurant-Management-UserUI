"use client"
import "../styles/OrderTypeSelector.css"

function OrderTypeSelector({ orderType, onSelectOrderType }) {
  return (
    <div className="order-type-selector">
      <h3>Order Type</h3>
      <div className="type-buttons">
        <button
          className={`type-button ${orderType === "dineIn" ? "active" : ""}`}
          onClick={() => onSelectOrderType("dineIn")}
        >
          Dine In
        </button>
        <button
          className={`type-button ${orderType === "takeaway" ? "active" : ""}`}
          onClick={() => onSelectOrderType("takeaway")}
        >
          Take Away
        </button>
      </div>
    </div>
  )
}

export default OrderTypeSelector
