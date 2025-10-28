"use client"
import "../styles/SearchBar.css"

function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <input type="text" placeholder="Search" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

export default SearchBar
