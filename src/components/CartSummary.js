"use client"
import "../styles/CartSummary.css"

function CartSummary({ items, onRemoveItem, onUpdateQuantity, onAddInstructions }) {
  return (
    <div className="cart-summary">
      <h2>Your Items</h2>
      {items.map((item) => (
        <div key={item.id} className="cart-item">
          <div className="item-image">
            <img src={item.image || "/placeholder.svg?height=100&width=100&query=food"} alt={item.name} />
          </div>
          <div className="item-details">
            <h3>{item.name}</h3>
            <p className="price">₹{item.price}</p>
            {item.cookingInstructions && <p className="instructions">Instructions: {item.cookingInstructions}</p>}
            <button className="instructions-link" onClick={() => onAddInstructions(item)}>
              {item.cookingInstructions ? "Edit" : "Add"} cooking instructions
            </button>
          </div>
          <div className="quantity-control">
            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>−</button>
            <span>{item.quantity}</span>
            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
          </div>
          <button className="remove-button" onClick={() => onRemoveItem(item.id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

export default CartSummary
