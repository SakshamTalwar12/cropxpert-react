import React,{ useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Add click event handlers to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
      card.addEventListener('click', () => {
        const tab = card.getAttribute('data-tab');
        if (tab) {
          navigate(`/${tab}`);
        }
      });
    });
    
    // Cleanup event listeners on unmount
    return () => {
      featureCards.forEach(card => {
        card.removeEventListener('click', () => {});
      });
    };
  }, [navigate]);
  
  // Rest of your component remains the same...

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to CropXpert</h1>
          <p>Revolutionizing agriculture with technology and data-driven insights</p>
          <div className="button-group">
            <Link to="/login">
              <button className="cta-button">Login</button>
            </Link>
            <Link to="/register">
              <button className="cta-button">Register</button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <h2 className="section-title">Our Features</h2>
        <div className="feature-grid">
          <div className="feature-card" data-tab="soil">
            <i className="fas fa-seedling"></i>
            <h2>Soil <br />Analysis</h2>
            <p>Get detailed insights about your soil composition and health.</p>
          </div>
          
          <div className="feature-card" data-tab="pest">
            <i className="fas fa-bug"></i>
            <h2>Pest <br />Control</h2>
            <p>Receive personalized pest control suggestions based on your soil conditions.</p>
          </div>                
          
          <div className="feature-card" data-tab="practices">
            <i className="fas fa-book"></i>
            <h2>Best<br /> Practices</h2>
            <p>Learn about sustainable farming methods and techniques.</p>
          </div>
          
          <div className="feature-card" data-tab="schemes">
            <i className="fas fa-landmark"></i>
            <h2>Government Schemes</h2>
            <p>Discover relevant government schemes based on your profile and region.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 