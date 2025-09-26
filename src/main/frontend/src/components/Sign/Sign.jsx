import './Sign.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Sign() {
  // Define state variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { email, password, rememberMe });
    // You can add login logic here
  };

  return (
    <>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="signup-flex-column">
          <label>Email</label>
        </div>
        <div className="signup-inputForm">
          <input
            type="email"
            className="signup-input"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="signup-flex-column">
          <label>Password</label>
        </div>
        <div className="signup-inputForm">
          <input
            type="password"
            className="signup-input"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="signup-flex-row">
          <div>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label>Remember me</label>
          </div>
          <Link to="/forgot-password" className="signup-span">Forgot password?</Link>
        </div>

        <button className="signup-button-submit" type="submit">Sign In</button>

        <p className="signup-p">
          Don't have an account? <Link to="/login" className="signup-span">Sign Up</Link>
        </p>
      </form>
    </>
  );
}

export default Sign;
