import MenuItem from "./MenuItem"
import "../styles/MenuGrid.css"

function MenuGrid({ items, onAddToCart, cart, onUpdateQuantity }) {
  const getCartQuantity = (itemId) => {
    const cartItem = cart?.find((item) => item.id === itemId)
    return cartItem ? cartItem.quantity : 0
  }

  if (items.length === 0) {
    return <div className="no-items">No items found</div>
  }

  return (
    <div className="menu-grid">
      {items.map((item) => {
        const itemId = item._id || item.id
        return (
          <MenuItem
            key={itemId}
            item={item}
            onAddToCart={onAddToCart}
            cartQuantity={getCartQuantity(itemId)}
            onUpdateQuantity={onUpdateQuantity}
          />
        )
      })}
    </div>
  )
}

export default MenuGrid
