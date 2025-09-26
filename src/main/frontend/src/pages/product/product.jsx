import React, { useEffect, useState } from 'react';
import './product.css';
import DHeader from '../../components/dashboard-header/dheader';
import SnackbarWithDecorators from '../../components/snackbar/SnackbarWithDecorators';
import { useNavigate } from 'react-router-dom';

const Product = () => {
  const navigate = useNavigate();

  const [expiryDate, setExpiryDate] = useState('');
  const [expiryError, setExpiryError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [qCType, setQCType] = useState('exact');
  const [quantityBought, setQuantityBought] = useState('');
  const [quantityConsumed, setQuantityConsumed] = useState('');
  const [qCPercentage, setQCPercentage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFields, setFormFields] = useState({
    name: '',
    category: 'Dairy',
    unit: 'kg',
  });

  // 🔒 Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/signup');
    }
  }, [navigate]);

  const toTitleCase = (str) =>
    str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  const handleSubmit = async (e) => {

    e.preventDefault();
    setIsSubmitting(true);
    const today = new Date().toISOString().split('T')[0];
    if (expiryDate <= today) {
      setIsSubmitting(false);
      setExpiryError(true);
      return;
    }
    setExpiryError(false);

    const quantityBoughtValue = parseFloat(quantityBought);
    let quantityConsumedValue = quantityConsumed ? parseFloat(quantityConsumed) : null;
    const percentageVal = qCPercentage ? parseFloat(qCPercentage) : null;
    let percentageLeft;

    if (qCType === 'percentage' && percentageVal) {
      quantityConsumedValue = parseFloat(((percentageVal / 100) * quantityBoughtValue).toFixed(2));
      percentageLeft = 100 - percentageVal;
    } else if (quantityBoughtValue && quantityConsumedValue) {
      percentageLeft = ((quantityBoughtValue - quantityConsumedValue) / quantityBoughtValue) * 100;
    } else {
      percentageLeft = 100;
    }

    const token = localStorage.getItem('jwtToken');
    const dataToSend = {
      name: toTitleCase(formFields.name),
      quantityBought: quantityBoughtValue,
      quantityConsumed: quantityConsumedValue,
      percentageLeft: percentageLeft.toFixed(2),
      category: formFields.category,
      unit: formFields.unit,
      expiryDate,
    };

    try {
      const res = await fetch('http://localhost:8080/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (res.status === 401 || res.status === 500) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('jwtToken');
        navigate('/');
        return;
      }

      if (res.status === 400) {
        alert('Invalid entry');
        return;
      }

      const response = await res.json();
      setSnackbarOpen(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DHeader />
      <div>
        <div className="product-form-heading">
          <h2>Product Form</h2>
        </div>
        <form className="product-form-form" onSubmit={handleSubmit}>
          <div className="product-form-form-group">
            <label htmlFor="name">Product Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formFields.name}
              onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
            />
          </div>

          <div className="product-form-form-group">
            <label htmlFor="quantityBought">Quantity Bought:</label>
            <input
              type="number"
              id="quantityBought"
              name="quantityBought"
              required
              step="0.01"
              value={quantityBought}
              onChange={(e) => setQuantityBought(e.target.value)}
            />
            <label htmlFor="unit">Unit:</label>
            <select
              id="unit"
              name="unit"
              required
              value={formFields.unit}
              onChange={(e) => setFormFields({ ...formFields, unit: e.target.value })}
            >
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
            <select
              id="qCType"
              name="qCType"
              value={qCType}
              onChange={(e) => setQCType(e.target.value)}
            >
              <option value="exact">Exact Quantity</option>
              <option value="percentage">Percentage</option>
            </select>

            {qCType === 'exact' ? (
              <input
                type="number"
                id="quantityConsumed"
                name="quantityConsumed"
                placeholder="Enter quantity"
                value={quantityConsumed}
                onChange={(e) => setQuantityConsumed(e.target.value)}
              />
            ) : (
              <input
                type="number"
                id="qCPercentage"
                name="qCPercentage"
                placeholder="Enter %"
                min="0"
                max="100"
                value={qCPercentage}
                onChange={(e) => setQCPercentage(e.target.value)}
              />
            )}
          </div>

          <div className="product-form-form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              required
              value={formFields.category}
              onChange={(e) => setFormFields({ ...formFields, category: e.target.value })}
            >
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
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              required
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              max={`${new Date().getFullYear() + 5}-12-31`}
            />
            {expiryError && (
              <span className="product-form-expiry-error">
                Expiry date must be later than today!
              </span>
            )}
          </div>
          {isSubmitting && (
          <div className="product-form-loading-message">Adding product, please wait...</div>
          )}
          <div className="product-form-submit-wrapper">
            <button type="submit">Submit</button>
          </div>
        </form>

        <SnackbarWithDecorators
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          message="Product added successfully!"
        />
      </div>
      <footer />
    </>
  );
};

export default Product;
