"use client"

import { useState } from "react"
import "../styles/CookingInstructionsModal.css"

function CookingInstructionsModal({ item, onClose, onSave }) {
  const [instructions, setInstructions] = useState(item.cookingInstructions || "")

  const handleSave = () => {
    onSave(instructions)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <h2>Add Cooking instructions</h2>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder=""
          rows="6"
        />
        <p className="disclaimer">
          The restaurant will try its best to follow your request. However, refunds or cancellations in this regard won't be possible
        </p>
        <div className="modal-buttons">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="save-button" onClick={handleSave}>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookingInstructionsModal
