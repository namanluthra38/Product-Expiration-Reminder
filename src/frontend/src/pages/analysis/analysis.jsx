import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './analysis.css';

const ProductAnalysis = () => {
  const [product, setProduct] = useState(null);
  const [minConsumption, setMinConsumption] = useState('');
  const [consumptionType, setConsumptionType] = useState('daily');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      const token = localStorage.getItem("jwtToken");
      const productId = localStorage.getItem("selectedProductId");

      if (!token || !productId) {
        alert("Session expired. Redirecting to login...");
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/product/id/${productId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          alert("Failed to fetch product details.");
          return;
        }

        const data = await response.json();
        setProduct(data);
        updateConsumption(data, consumptionType);
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };

    fetchProductDetails();
  }, [navigate, consumptionType]); // added dependency

  const updateConsumption = (prod, type) => {
    if (!prod) return;

    const remaining = prod.quantityBought - (prod.quantityConsumed || 0);
    let value = 'N/A';

    if (type === 'daily' && prod.daysToExpiry) {
      value = (remaining / prod.daysToExpiry).toFixed(2) + ` ${prod.unit}/day`;
    } else if (type === 'weekly' && prod.weeksToExpiry) {
      value = (remaining / prod.weeksToExpiry).toFixed(2) + ` ${prod.unit}/week`;
    } else if (type === 'monthly' && prod.monthsToExpiry) {
      value = (remaining / prod.monthsToExpiry).toFixed(2) + ` ${prod.unit}/month`;
    }

    setMinConsumption(value);
  };

  const handleChange = (e) => {
    const newType = e.target.value;
    setConsumptionType(newType);
    if (product) updateConsumption(product, newType);
  };

  const goBack = () => navigate('/dashboard');

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-analysis-container">
      <div className="product-analysis-card">
        <h1>Product Analysis</h1>
        <div className="product-analysis-plan">
          <div className="product-analysis-inner">
            <div className="product-analysis-pricing">📦 Analysis</div>
            <div className="product-analysis-title">Expiry Overview</div>
            <p className="product-analysis-info">Monitor your stock and consumption in one place.</p>

            <div className="product-analysis-feature">
              <span className="product-analysis-icon">🛒</span> Product Name: <span>{product.name}</span>
            </div>
            <div className="product-analysis-feature">
              <span className="product-analysis-icon">📦</span> Quantity Bought: <span>{product.quantityBought} {product.unit}</span>
            </div>
            <div className="product-analysis-feature">
              <span className="product-analysis-icon">🍴</span> Quantity Consumed: <span>{product.quantityConsumed || 0} {product.unit}</span>
            </div>
            <div className="product-analysis-feature">
              <span className="product-analysis-icon">📊</span> Percentage Left: <span>{product.percentageLeft || 0}%</span>
            </div>
  
            <div className="product-analysis-features">
              <div className="product-analysis-feature-block">
                <div className="product-analysis-icon">Days Left</div>
                <span className="product-analysis-output">{product.daysToExpiry}</span>
              </div>
              <div className="product-analysis-feature-block">
                <div className="product-analysis-icon">Weeks Left</div>
                <span className="product-analysis-output">{product.weeksToExpiry}</span>
              </div>
              <div className="product-analysis-feature-block">
                <div className="product-analysis-icon">Months Left</div>
                <span className="product-analysis-output">{product.monthsToExpiry}</span>
              </div>
            </div>
  
            <label htmlFor="consumptionType">Consumption Rate:</label>
            <select id="consumptionType" value={consumptionType} onChange={handleChange} className="product-analysis-select">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
  
            <div className="product-analysis-info-block">
              <p><strong>Required Consumption:</strong> <span>{minConsumption}</span></p>
            </div>
  
            <div className="product-analysis-action">
              <button className="product-analysis-button" onClick={goBack}>Back to Dashboard</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default ProductAnalysis;
