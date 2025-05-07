import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
        
    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
        
    try {
      // Updated to use port 5000 and the correct endpoint path
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
        credentials: "include" // Important for session cookies
      });
            
      if (response.ok) {
        // Store user info in localStorage if needed
        localStorage.setItem("userEmail", formData.username);
        localStorage.setItem("isLoggedIn", "true");
        navigate("/");
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
    
  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Join CropXpert</h1>
        <p className="register-tagline">Create Your Smart Farming Account</p>
        <div className="icon-container">
          <i className="fas fa-seedling"></i>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-envelope"></i> Email
            </label>
            <input
              type="email"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">
              <i className="fas fa-lock"></i> Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
                
        <div className="divider">
          <span>OR</span>
        </div>
        
        <div className="additional-links">
          <p className="login-text">Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;