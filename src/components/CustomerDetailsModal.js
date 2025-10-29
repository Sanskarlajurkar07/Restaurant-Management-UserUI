import { useState } from "react"
import "../styles/CustomerDetailsModal.css"

function CustomerDetailsModal({ 
  orderType, 
  setOrderType,
  onClose, 
  onSubmit, 
  availableTables,
  initialData 
}) {
  const [customerInfo, setCustomerInfo] = useState(initialData || {
    name: "",
    phoneNumber: "",
    numberOfMembers: "2",
    address: "",
    tableNumber: null,
  })

  const handleChange = (field, value) => {
    setCustomerInfo({
      ...customerInfo,
      [field]: value,
    })
  }

  const handleSubmit = () => {
    // Validate required fields
    if (!customerInfo.name || !customerInfo.phoneNumber) {
      alert("Please fill in all required fields")
      return
    }

    if (orderType === "dineIn") {
      if (!customerInfo.numberOfMembers || !customerInfo.tableNumber) {
        alert("Please select number of members and a table")
        return
      }
    } else {
      if (!customerInfo.address) {
        alert("Please enter your address")
        return
      }
    }

    onSubmit(customerInfo)
  }

  return (
    <div className="customer-modal-overlay" onClick={onClose}>
      <div className="customer-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="customer-modal-close" onClick={onClose}>
          ✕
        </button>
        
        <h2>Enter Your Details</h2>

        <div className="order-type-toggle">
          <button
            className={orderType === "dineIn" ? "active" : ""}
            onClick={() => setOrderType("dineIn")}
          >
            Dine In
          </button>
          <button
            className={orderType === "takeaway" ? "active" : ""}
            onClick={() => setOrderType("takeaway")}
          >
            Take Away
          </button>
        </div>

        <div className="customer-modal-form">
          <div className="customer-form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="full name"
              value={customerInfo.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="customer-form-group">
            <label>Number of Person</label>
            <input
              type="text"
              placeholder="2,4,6"
              value={customerInfo.numberOfMembers}
              onChange={(e) => handleChange("numberOfMembers", e.target.value)}
            />
          </div>

          {orderType === "dineIn" && (
            <div className="customer-form-group">
              <label>Select Table</label>
              <select
                value={customerInfo.tableNumber || ""}
                onChange={(e) => handleChange("tableNumber", parseInt(e.target.value))}
              >
                <option value="">Choose a table</option>
                {Array.isArray(availableTables) && availableTables.map((table) => (
                  <option key={table._id || table.id} value={table.tableNumber}>
                    Table {table.tableNumber}
                  </option>
                ))}
              </select>
            </div>
          )}

          {orderType === "takeaway" && (
            <div className="customer-form-group">
              <label>Address</label>
              <input
                type="text"
                placeholder="address"
                value={customerInfo.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
          )}

          <div className="customer-form-group">
            <label>Contact</label>
            <input
              type="tel"
              placeholder="phone"
              value={customerInfo.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
            />
          </div>
        </div>

        <button className="customer-modal-submit" onClick={handleSubmit}>
          Order Now
        </button>
      </div>
    </div>
  )
}

export default CustomerDetailsModal
