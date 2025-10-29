import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import CategoryTabs from "../components/CategoryTabs"
import MenuGrid from "../components/MenuGrid"
import SearchBar from "../components/SearchBar"
import "../styles/HomePage.css"

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://restaurant-management-backend-2.onrender.com/api"

function HomePage({ cart, addToCart, updateQuantity, customerInfo }) {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [menuItems, setMenuItems] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef(null)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/menu/categories/all`)
        const data = await response.json()
        // Check if data has a 'data' property containing the categories
        const categories = data.data || data
        // Ensure categories is an array before spreading
        const categoryArray = Array.isArray(categories) ? categories : []
        setCategories(["All", ...categoryArray])
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch menu items when category or search changes
  useEffect(() => {
    let isCancelled = false
    
    const fetchItems = async () => {
      setLoading(true)
      setMenuItems([])
      setPage(1)
      setHasMore(true)
      
      try {
        let url
        if (selectedCategory === "All") {
          url = `${API_BASE_URL}/menu`
          if (searchQuery) {
            url += `?search=${encodeURIComponent(searchQuery)}`
          }
        } else {
          url = `${API_BASE_URL}/menu/category/${selectedCategory}?page=1&limit=10`
          if (searchQuery) {
            url += `&search=${encodeURIComponent(searchQuery)}`
          }
        }

        const response = await fetch(url)
        const data = await response.json()
        const items = data.data || data.items || []
        
        if (!isCancelled) {
          setMenuItems(items)
          if (selectedCategory === "All") {
            setHasMore(false)
          } else {
            setHasMore(data.pagination?.hasMore !== false)
          }
        }
      } catch (error) {
        console.error("Error fetching menu items:", error)
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchItems()
    return () => { isCancelled = true }
  }, [selectedCategory, searchQuery])

  // Infinite scroll observer for loading more items
  useEffect(() => {
    if (selectedCategory === "All" || !hasMore || loading) return

    let isLoadingMore = false

    const loadMore = async () => {
      if (isLoadingMore) return
      isLoadingMore = true
      setLoading(true)
      
      try {
        const nextPage = page + 1
        let url = `${API_BASE_URL}/menu/category/${selectedCategory}?page=${nextPage}&limit=10`
        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`
        }

        const response = await fetch(url)
        const data = await response.json()
        const newItems = data.data || data.items || []
        
        // Deduplicate items by _id
        setMenuItems((prev) => {
          const existingIds = new Set(prev.map(item => item._id || item.id))
          const uniqueNewItems = newItems.filter(item => !existingIds.has(item._id || item.id))
          return [...prev, ...uniqueNewItems]
        })
        setPage(nextPage)
        setHasMore(data.pagination?.hasMore !== false)
      } catch (error) {
        console.error("Error loading more items:", error)
      } finally {
        setLoading(false)
        isLoadingMore = false
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: '100px' },
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
      observer.disconnect()
    }
  }, [page, hasMore, loading, selectedCategory, searchQuery])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleNextClick = () => {
    if (cart.length === 0) {
      alert("Your cart is empty")
      return
    }
    navigate("/checkout")
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-content">
          <h1>Good evening, {customerInfo?.name}</h1>
          <p>Place your order here</p>
        </div>
      </header>

      <SearchBar value={searchQuery} onChange={setSearchQuery} cartTotal={cartTotal} />

      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="menu-section">
        <h2 className="category-title">{selectedCategory}</h2>
        <MenuGrid items={menuItems} onAddToCart={addToCart} cart={cart} onUpdateQuantity={updateQuantity} />
      </div>

      {hasMore && <div ref={observerTarget} className="observer-target" />}
      {loading && <div className="loading">Loading more items...</div>}

      {cartCount > 0 && (
        <button className="homepage-next-button" onClick={handleNextClick}>
          Next
        </button>
      )}
    </div>
  )
}

export default HomePage
