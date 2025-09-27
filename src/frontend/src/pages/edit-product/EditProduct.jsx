import { useEffect, useState } from "react";
import "../product/product.css";
import { useNavigate } from "react-router-dom";
import DHeader from "../../components/dashboard-header/dheader";
import Footer from "../../components/footer/footer";

const EditProduct = () => {
  const [qCType, setQCType] = useState("exact");
  const [formData, setFormData] = useState({
    name: "",
    quantityBought: 0,
    quantityConsumed: "",
    qCPercentage: "",
    unit: "kg",
    category: "Dairy",
    expiryDate: "",
    disableAlerts: false,
  });
  const [productId, setProductId] = useState(null);
  const [expiryError, setExpiryError] = useState("");
  const [message, setMessage] = useState({ text: "", color: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("productId");
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      localStorage.removeItem("jwtToken");
      navigate("/signup");
      return;
    }

    if (!id) {
      alert("Invalid product ID.");
      navigate("/dashboard");
      return;
    }
    setProductId(id);

    fetch(`http://localhost:8080/product/id/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error fetching product data.");
        return res.json();
      })
      .then((product) => {
        setFormData({
          name: product.name,
          quantityBought: product.quantityBought,
          quantityConsumed: product.quantityConsumed || "",
          qCPercentage: product.percentageLeft ? 100 - product.percentageLeft : "",
          unit: product.unit,
          category: product.category || "Dairy",
          expiryDate: product.expiryDate,
          disableAlerts: product.disableAlerts,
        });
        if (product.percentageLeft !== null) {
          setQCType("percentage");
        }
      })
      .catch(() => {
        alert("Error fetching product data.");
        navigate("/dashboard");
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("jwtToken");
      navigate("/signup");
      return;
    }

    if (!formData.name || !formData.quantityBought || !formData.expiryDate) {
      setMessage({ text: "Please fill all required fields!", color: "red" });
      return;
    }

    const selectedDate = new Date(formData.expiryDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate <= now) {
      setExpiryError("Expiry date must be in the future.");
      return;
    } else {
      setExpiryError("");
    }

    let quantityConsumed = formData.quantityConsumed ? parseFloat(formData.quantityConsumed) : null;
    let qCPercentage = formData.qCPercentage ? parseFloat(formData.qCPercentage) : null;
    let quantityBought = parseFloat(formData.quantityBought);
    let percentageLeft;

    if (qCType === "percentage") {
      if (qCPercentage > 100) {
        alert("Consumed percentage cannot exceed 100%.");
        return;
      }
      quantityConsumed = parseFloat(((qCPercentage / 100) * quantityBought).toFixed(2));
      percentageLeft = 100 - qCPercentage;
    } else {
      if (quantityConsumed > quantityBought) {
        alert("Consumed quantity cannot be greater than the quantity bought.");
        return;
      }
      percentageLeft = ((quantityBought - quantityConsumed) / quantityBought) * 100;
    }

    const updatedData = {
      name: formData.name,
      quantityBought: quantityBought,
      quantityConsumed: quantityConsumed,
      percentageLeft: percentageLeft.toFixed(2),
      category: formData.category,
      unit: formData.unit,
      expiryDate: formData.expiryDate,
      disableAlerts: formData.disableAlerts,
    };

    setIsSubmitting(true);
    fetch(`http://localhost:8080/product/id/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => {
        if (res.status === 401 || res.status === 500) {
          throw new Error("Session expired or server error");
        }
        if (res.status === 400) {
          throw new Error("Invalid input");
        }
        return res.json();
      })
      .then(() => {
        setMessage({ text: "Product updated successfully!", color: "green" });
        setTimeout(() => navigate("/dashboard"), 2000);
      })
      .catch((err) => {
        console.error("Error:", err);
        setMessage({ text: "Error updating product. Try again!", color: "red" });
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <>
      <DHeader />
      <div >
        <h2 className="product-form-heading">Edit Product</h2>
        <form className="product-form-form">
          <div className="product-form-form-group">
            <label htmlFor="name">Product Name:</label>
            <input type="text" id="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="product-form-form-group">
            <label htmlFor="quantityBought">Quantity Bought:</label>
            <input type="number" id="quantityBought" value={formData.quantityBought} onChange={handleChange} required step="0.01" />
            <label htmlFor="unit">Unit:</label>
            <select id="unit" value={formData.unit} onChange={handleChange} required>
              <option value="kg">Kg</option>
              <option value="g">Grams</option>
              <option value="L">Liters</option>
              <option value="ml">Milliliters</option>
              <option value="packs">Packs</option>
              <option value="n">Number</option>
            </select>
          </div>

          <div className="product-form-form-group">
            <label htmlFor="qCType">Quantity Consumed:</label>
            <select id="qCType" value={qCType} onChange={(e) => setQCType(e.target.value)}>
              <option value="exact">Exact Quantity</option>
              <option value="percentage">Percentage</option>
            </select>
            {qCType === "exact" ? (
              <input type="number" id="quantityConsumed" value={formData.quantityConsumed} onChange={handleChange} placeholder="Enter quantity" />
            ) : (
              <input type="number" id="qCPercentage" value={formData.qCPercentage} onChange={handleChange} placeholder="Enter %" min="0" max="100" />
            )}
          </div>

          <div className="product-form-form-group">
            <label htmlFor="category">Category:</label>
            <select id="category" value={formData.category} onChange={handleChange} required>
              <option value="Dairy">Dairy</option>
              <option value="Grocery">Grocery</option>
              <option value="Beverages">Beverages</option>
              <option value="Snacks">Snacks</option>
              <option value="Hygiene">Hygiene</option>
              <option value="Medicine">Medicine</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div className="product-form-form-group">
            <label htmlFor="expiryDate">Expiry Date:</label>
            <input type="date" id="expiryDate" value={formData.expiryDate} onChange={handleChange} required min={today} />
            <span className="product-form-expiry-error">{expiryError}</span>
          </div>

          <div className="product-form-group">
          <label htmlFor="disableAlerts">Disable Alerts:</label>
          <label className="switch">
          <input
            type="checkbox"
            id="disableAlerts"
            checked={formData.disableAlerts}
            onChange={handleChange}
          />
            <span className="slider round"></span>
          </label>
        </div>


          {message.text && (
            <p style={{ color: message.color, textAlign: "center", marginBottom: "1rem" }}>
              {message.text}
            </p>
          )}

          <button
            type="button"
            className=""
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Product"}
          </button>
          <button type="button" className="product-form-cancel-btn" onClick={() => navigate("/dashboard")}>
            Cancel
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditProduct;
