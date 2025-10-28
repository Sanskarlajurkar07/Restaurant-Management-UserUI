"use client"

import { useRef, useEffect } from "react"
import { Utensils, Pizza, Coffee, Files as Fries, Leaf, Soup, Cake, Egg, Fish, Flame } from "lucide-react"
import "../styles/CategoryTabs.css"

const categoryIcons = {
  Burger: Utensils,
  Pizza: Pizza,
  Drink: Coffee,
  "French fries": Fries,
  Veggies: Leaf,
  Salad: Leaf,
  Soup: Soup,
  Dessert: Cake,
  Breakfast: Egg,
  Seafood: Fish,
  Spicy: Flame,
}

function CategoryTabs({ categories, selectedCategory, onSelectCategory }) {
  const scrollContainer = useRef(null)

  useEffect(() => {
    if (scrollContainer.current) {
      const selectedElement = scrollContainer.current.querySelector(".category-tab.active")
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      }
    }
  }, [selectedCategory])

  const getIcon = (category) => {
    if (category === "All") return null
    const IconComponent = categoryIcons[category]
    return IconComponent ? <IconComponent size={20} /> : null
  }

  return (
    <div className="category-tabs-container">
      <div className="category-tabs" ref={scrollContainer}>
        {categories.map((category) => {
          const icon = getIcon(category)
          return (
            <button
              key={category}
              className={`category-tab ${selectedCategory === category ? "active" : ""}`}
              onClick={() => onSelectCategory(category)}
            >
              {icon && <span className="category-icon">{icon}</span>}
              <span className="category-label">{category}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryTabs
