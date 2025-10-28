"use client"
import "../styles/CartSummary.css"

function CartSummary({ items, onRemoveItem, onUpdateQuantity, onAddInstructions }) {
  return (
    <div className="cart-summary">
      {items.map((item) => (
        <div key={item.id} className="cart-item-card">
          <div className="cart-item-header">
            <div className="item-image-small">
              <img src={item.image || "/placeholder.svg?height=100&width=100&query=food"} alt={item.name} />
            </div>
            <div className="item-info-header">
              <h3>{item.name}</h3>
              <p className="price">₹ {item.price}</p>
            </div>
            <button className="remove-button" onClick={() => onRemoveItem(item.id)}>
              ✗
            </button>
          </div>
          
          <div className="cart-item-footer">
            <button className="instructions-link-simple" onClick={() => onAddInstructions(item)}>
              Add cooking instructions (optional)
            </button>
            <div className="quantity-control">
              <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
          </div>
          
          {item.cookingInstructions && (
            <div className="cooking-instructions-display">
              <p>{item.cookingInstructions}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default CartSummary
