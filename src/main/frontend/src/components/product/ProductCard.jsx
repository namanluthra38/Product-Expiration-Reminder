
import React from 'react';
import './ProductCard.css';
const ProductCard = ({ product, onEdit, onAnalyse, onDelete }) => {
  const {
    name,
    category,
    quantityBought,
    quantityConsumed,
    unit,
    percentageLeft,
    stringDate,
    daysToExpiry,
    disableAlerts,
    strid
  } = product;

  const isExpired = daysToExpiry <= 0;
  const isFinished = percentageLeft === 0;

  const cardClass = isExpired
    ? "dashboard-expired-product"
    : isFinished
    ? "dashboard-finished-product"
    : disableAlerts
    ? "dashboard-disabled-product"
    : "";

  let displayName = name;
  if (isExpired) displayName += " (Expired)";
  else if (isFinished) displayName += " (Finished)";
  else if (disableAlerts) displayName += " (Alerts Disabled)";

  return (
    <div key={strid} className={`dashboard-product-card ${cardClass}`}>
      <div className="dashboard-product-name">{displayName}</div>
      <div className="dashboard-product-id">{category}</div>
      <div className="dashboard-product-details"><b>Quantity Bought:</b> {quantityBought} {unit}</div>
{/*       <div className="dashboard-product-details"><b>Quantity Consumed:</b> {quantityConsumed} {unit}</div> */}
      <div className="dashboard-product-details"><b>Remaining:</b> {percentageLeft}%</div>
      <div className="dashboard-product-details"><b>Expiry Date:</b> {stringDate}</div>
      {!isExpired && !isFinished && (
        <>
          <button className="dashboard-product-details" onClick={() => onEdit(strid)}>Edit</button>
          <button className="dashboard-product-details" onClick={() => onAnalyse(strid)}>Analyse</button>
        </>
      )}
      <button className="dashboard-product-details" onClick={() => onDelete(strid)}>Delete</button>
    </div>
  );
};

export default ProductCard;
