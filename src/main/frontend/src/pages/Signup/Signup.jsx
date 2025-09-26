import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import Hdr from "../../components/hdr/hdr";
import Footer from "../../components/footer/footer";

const LoginRegister = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [isLogin, setIsLogin] = useState(true);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const [registerData, setRegisterData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginMessage, setLoginMessage] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { userName, email, password, confirmPassword } = registerData;

    if (password !== confirmPassword) {
      setRegisterMessage("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/public/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setRegisterMessage("Registered successfully!");

        const loginRes = await fetch("http://localhost:8080/public/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: loginUsername, password: loginPassword }),
        });


        const loginData = await loginRes.json();
        localStorage.setItem("jwtToken", loginData.token);
        localStorage.setItem("userId", loginData.userId);

        navigate("/dashboard");
      } else {
        setRegisterMessage(data.message || "Registration failed.");
      }
    } catch (err) {
      setRegisterMessage("Network error. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/public/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: loginUsername, password: loginPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("jwtToken", data.token);
        localStorage.setItem("userId", data.userId);
        setLoginMessage("Login successful!");
        navigate("/dashboard");
      } else {
        setLoginMessage(data.message || "Login failed.");
      }
    } catch (err) {
      setLoginMessage("Network error. Please try again.");
    }
  };


  const handleRequestReset = async () => {
    try {
      const res = await fetch("http://localhost:8080/public/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await res.json();
      setResetMessage(data.message);
    } catch (err) {
      setResetMessage("Error sending reset code.");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setResetMessage("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/public/verify-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, code: resetCode, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setResetMessage("Password reset successful. You may now log in.");
        setShowReset(false);
      } else {
        setResetMessage(data.message || "Reset failed.");
      }
    } catch (err) {
      setResetMessage("Reset error. Please try again.");
    }
  };

  return (
    <>
      <Hdr />
      <div className="signup-page">
        <div className="signup-container">
          <div className="signup-toggle-buttons">
            <button onClick={() => setIsLogin(true)} className={isLogin ? "signup-active" : ""}>Login</button>
            <button onClick={() => setIsLogin(false)} className={!isLogin ? "signup-active" : ""}>Register</button>
          </div>

          <div className="signup-form-container">
            {isLogin && !showReset ? (
              <form onSubmit={handleLogin} className="signup-form signup-active">
                <h2>Login</h2>
                <input
                  type="text"
                  id="loginIdentifier"
                  placeholder="Username or Email"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  required
                />


                <input
                  type="password"
                  id="loginPassword"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button type="submit">Login</button>
                <p style={{ color: loginMessage.includes("successful") ? "green" : "red" }}>{loginMessage}</p>
                <p className="forgot-password" onClick={() => setShowReset(true)} style={{ cursor: "pointer", color: "blue" }}>
                  Forgot Password?
                </p>
              </form>
            ) : isLogin && showReset ? (
              <div className="signup-form signup-active">
                <h2>Reset Password</h2>
                <input type="email" placeholder="Email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required />
                <button onClick={handleRequestReset} className = "send-code">Send Code</button>

                <input type="text" placeholder="Verification Code" value={resetCode} onChange={(e) => setResetCode(e.target.value)} required />
                <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                <input type="password" placeholder="Confirm New Password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />

                <button onClick={handleResetPassword} className = "reset-pass">Reset Password</button>
                <p style={{ color: resetMessage.includes("successful") ? "green" : "red" }}>{resetMessage}</p>
                <p className="back-to-login" onClick={() => setShowReset(false)} style={{ cursor: "pointer", color: "blue" }}>
                  Back to Login
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="signup-form signup-active">
                <h2>Register</h2>
                <input type="text" id="userName" placeholder="Username" value={registerData.userName} onChange={handleRegisterChange} required />
                <input type="text" id="email" placeholder="Email" value={registerData.email} onChange={handleRegisterChange} required />
                <input type="password" id="password" placeholder="Password" value={registerData.password} onChange={handleRegisterChange} required />
                <input type="password" id="confirmPassword" placeholder="Confirm Password" value={registerData.confirmPassword} onChange={handleRegisterChange} required />
                <button type="submit">Register</button>
                <p style={{ color: registerMessage.includes("success") ? "green" : "red" }}>{registerMessage}</p>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginRegister;
