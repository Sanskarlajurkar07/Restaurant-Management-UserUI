import MenuItem from "./MenuItem"
import "../styles/MenuGrid.css"

function MenuGrid({ items, onAddToCart }) {
  if (items.length === 0) {
    return <div className="no-items">No items found</div>
  }

  return (
    <div className="menu-grid">
      {items.map((item) => (
        <MenuItem key={item._id || item.id} item={item} onAddToCart={onAddToCart} />
      ))}
    </div>
  )
}

export default MenuGrid
