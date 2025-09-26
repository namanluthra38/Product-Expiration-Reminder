import './flipcard.css';

function flipcard(){
return(
<div className="flipcard-container">

<div className="flipcard-card">
  <div className="flipcard-inner">
    <div className="flipcard-front">
      <p className="flipcard-title">🔔 Stay Notified</p>
      <p>📌 Never Miss an Expiry Again!</p>
    </div>
    <div className="flipcard-back">
      <p className="flipcard-title">✅ Timely Alerts</p>
      <p>Get notified before your products, medicines & essentials expire.</p>
    </div>
  </div>
</div>

<div className="flipcard-card">
  <div className="flipcard-inner">
    <div className="flipcard-front">
      <p className="flipcard-title">📅 Organize with Ease</p>
      <p>📌 All Your Reminders in One Place!</p>
    </div>
    <div className="flipcard-back">
      <p className="flipcard-title">✅ Stay on Track</p>
      <p>Create, manage & categorize reminders for a clutter-free experience.</p>
    </div>
  </div>
</div>

<div className="flipcard-card">
  <div className="flipcard-inner">
    <div className="flipcard-front">
      <p className="flipcard-title">📊 Plan Smarter</p>
      <p>📌 AI-Powered Reminders & Analytics!</p>
    </div>
    <div className="flipcard-back">
      <p className="flipcard-title">✅ Boost Efficiency</p>
      <p>Sync with calendars & track habits for better time management.</p>
    </div>
  </div>
</div>

</div>



);

}
export default flipcard;