import "../styles/MenuItem.css"

function MenuItem({ item, onAddToCart, cartQuantity, onUpdateQuantity }) {
  return (
    <div className="menu-item">
      <div className="item-image">
        <img src={item.image || "/placeholder.svg?height=200&width=200&query=food"} alt={item.name} />
      </div>
      <div className="item-info">
        <h3>{item.name}</h3>
        {item.description && <p className="description">{item.description}</p>}
        <div className="item-footer">
          <span className="price">₹{item.price}</span>
          {cartQuantity > 0 ? (
            <div className="quantity-controls">
              <button className="quantity-button" onClick={() => onUpdateQuantity(item._id || item.id, cartQuantity - 1)}>
                −
              </button>
              <span className="quantity-display">{cartQuantity}</span>
              <button className="quantity-button" onClick={() => onUpdateQuantity(item._id || item.id, cartQuantity + 1)}>
                +
              </button>
            </div>
          ) : (
            <button className="add-button" onClick={() => onAddToCart(item)}>
              +
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MenuItem
