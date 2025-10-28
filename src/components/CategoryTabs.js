"use client"

import { useRef, useEffect } from "react"
import { Sandwich, Pizza, Coffee, Popcorn, Salad, Soup, Cake, Egg, Fish, Flame } from "lucide-react"
import "../styles/CategoryTabs.css"

const categoryIconsMap = {
  burger: Sandwich,
  pizza: Pizza,
  drink: Coffee,
  "french fries": Popcorn,
  veggies: Salad,
  salad: Salad,
  soup: Soup,
  dessert: Cake,
  breakfast: Egg,
  seafood: Fish,
  spicy: Flame,
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
    const IconComponent = categoryIconsMap[category.toLowerCase()]
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
