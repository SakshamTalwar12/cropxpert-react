import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css"; // Make sure this path is correct

function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
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

        try {
            // Updated to use port 5000 and the correct endpoint path
            const response = await fetch("http://localhost:5000/login", {
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
                setError(data.message || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <h1>Welcome to</h1>
                    <h1>CropXpert</h1>
                    <p className="login-tagline">Your Smart Farming Assistant</p>
                    <div className="icon-container">
                        {/* Simple Plant Icon SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22c2-4 4-8 4-12 0-2.2-1.8-4-4-4s-4 1.8-4 4c0 4 2 8 4 12z" />
                            <path d="M12 14c2-2 3-4 3-6 0-1.1-0.9-2-2-2s-2 0.9-2 2c0 2 1 4 3 6z" />
                        </svg>
                    </div>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">
                                {/* User Icon SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password">
                                {/* Lock Icon SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                Password
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
                        
                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                    
                    <div className="divider">
                        <span>OR</span>
                    </div>
                    
                    <p>
                        Don't have an account? <Link to="/register" className="register-link">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;