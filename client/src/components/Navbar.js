import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "home", label: "Home" },
    { id: "soil", label: "Soil Quality" },
    { id: "practices", label: "Best Practices" },
    { id: "schemes", label: "Govt Schemes" },
    { id: "about", label: "About" },
  ];

  const linkStyle = {
    background: 'none',
    border: 'none',
    color: 'black',
    padding: '20px 20px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    borderRadius: '4px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
    paddingTop: '20px',
    textDecoration: 'none'
  };

  return (
    <div className="nav-container">
      <div className="logo-wrapper">
        <div className="logo">
          <div className="logo-icon">
            <i className="fas fa-leaf"></i>
            <div className="logo-circle"></div>
            <div className="logo-circle-outer"></div>
            <div className="logo-sparkles">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="logo-text">
            <div className="logo-text-wrapper">
              <span className="logo-main">CX</span>
              <div className="logo-highlight"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-container">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={`/${tab.id}`}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            style={linkStyle}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Navbar;
