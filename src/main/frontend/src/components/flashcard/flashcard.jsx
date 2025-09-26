import './flashcard.css'; // Ensure correct CSS import path
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faClock, faUserLock } from '@fortawesome/free-solid-svg-icons';

function Flashcard() {
  return (
    <div className="flash-container">

      <div className="flashcard">
        <p className="flashcard-title">
          <FontAwesomeIcon icon={faBell} className="flash-icon" /> Stay Notified
        </p>
        <p className="flashsmall-desc">
          Never let groceries, medicines, or subscriptions go to waste. Get timely reminders before they expire, helping you save money, reduce waste, and stay organized effortlessly.
        </p>
        <div className="flashgo-corner">
          <div className="flashgo-arrow">→</div>
        </div>
      </div>

      <div className="flashcard">
        <p className="flashcard-title">
          <FontAwesomeIcon icon={faClock} className="flash-icon" /> Easy & Intuitive Tracking
        </p>
        <p className="flashsmall-desc">
        Input your items with name, category, and expiry date — our simple dashboard helps you manage everything at a glance.        </p>
        <div className="flashgo-corner">
          <div className="flashgo-arrow">→</div>
        </div>
      </div>

      <div className="flashcard">
        <p className="flashcard-title">
          <FontAwesomeIcon icon={faUserLock} className="flash-icon" /> Your Data, Your Control
        </p>
        <p className="flashsmall-desc">
        Your personal data matters. We don't share your product information with anyone ever. All your added items and preferences are securely stored.</p>
        <div className="flashgo-corner">
          <div className="flashgo-arrow">→</div>
        </div>
      </div>

    </div>
  );
}

export default Flashcard;
