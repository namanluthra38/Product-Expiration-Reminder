import "./itemform.css";
import { useState } from "react";

export default function ItemForm() {
  const [formData, setFormData] = useState({
    productName: "",
    quantityBought: "",
    quantityConsumed: "",
    category: "",
    expiryDate: "",
  });

  const categories = ["Grocery", "Medicine", "Personal Care", "Household", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product Added:", formData);
  };

  return (
    <div className="item-form-main-container">
      <h2 className="title">Add Product</h2>
      <p className="message">Track your products with ease. Never miss an expiry!</p>
      <form className="item-form" onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder=""
            required
            className="input"
          />
          <span>Product Name</span>
        </label>

        <label>
          <input
            type="number"
            name="quantityBought"
            value={formData.quantityBought}
            onChange={handleChange}
            placeholder=""
            required
            className="input"
          />
          <span>Quantity Bought</span>
        </label>

        <label>
          <input
            type="number"
            name="quantityConsumed"
            value={formData.quantityConsumed}
            onChange={handleChange}
            placeholder=""
            className="input"
          />
          <span>Quantity Consumed</span>
        </label>

        <label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <span>Category</span>
        </label>

        <label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="input"
            required
          />
          <span>Expiry Date</span>
        </label>

        <button type="submit" className="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

