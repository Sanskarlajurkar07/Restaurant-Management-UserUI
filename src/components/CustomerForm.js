import "../styles/CustomerForm.css"

function CustomerForm({ orderType, customerInfo, onUpdateCustomerInfo, availableTables }) {
  const handleChange = (field, value) => {
    onUpdateCustomerInfo({
      ...customerInfo,
      [field]: value,
    })
  }

  return (
    <div className="customer-form">
      <h3>Your Details</h3>

      <div className="form-group">
        <label>Name *</label>
        <input
          type="text"
          placeholder="Full name"
          value={customerInfo.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Phone Number *</label>
        <input
          type="tel"
          placeholder="Phone number"
          value={customerInfo.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
        />
      </div>

      {orderType === "dineIn" ? (
        <>
          <div className="form-group">
            <label>Number of Members *</label>
            <select
              value={customerInfo.numberOfMembers}
              onChange={(e) => handleChange("numberOfMembers", e.target.value)}
            >
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="6">6</option>
              <option value="8">8</option>
            </select>
          </div>

          <div className="form-group">
            <label>Select Table *</label>
            <select
              value={customerInfo.tableNumber || ""}
              onChange={(e) => handleChange("tableNumber", Number.parseInt(e.target.value))}
            >
              <option value="">Choose a table</option>
              {Array.isArray(availableTables) && availableTables.map((table) => (
                <option key={table._id || table.id} value={table.tableNumber}>
                  Table {table.tableNumber}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : (
        <div className="form-group">
          <label>Address *</label>
          <textarea
            placeholder="Enter your complete address"
            value={customerInfo.address}
            onChange={(e) => handleChange("address", e.target.value)}
            rows="3"
          />
        </div>
      )}
    </div>
  )
}

export default CustomerForm
