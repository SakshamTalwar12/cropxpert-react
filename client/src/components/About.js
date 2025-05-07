import React from 'react';
import '../styles/About.css';

function About() {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h2>About Smart Farming Assistant</h2>
        <p className="about-tagline">Empowering farmers with technology and knowledge</p>
      </div>

      <div className="about-grid">
        <div className="about-section">
          <i className="fas fa-bullseye"></i>
          <h3>Our Mission</h3>
          <p>To revolutionize farming practices through innovative technology and data-driven insights.</p>
        </div>

        <div className="about-section">
          <i className="fas fa-eye"></i>
          <h3>Our Vision</h3>
          <p>Creating a world where every farmer has access to advanced agricultural technologies.</p>
        </div>

        <div className="about-section">
          <i className="fas fa-heart"></i>
          <h3>Our Values</h3>
          <ul>
            <li>Innovation in Agriculture</li>
            <li>Farmer-First Approach</li>
            <li>Sustainable Practices</li>
            <li>Community Support</li>
          </ul>
        </div>
      </div>

      <div className="team-section">
        <h3>Our Expert Team</h3>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-img">
              <i className="fas fa-user-circle"></i>
            </div>
            <h4>Tejas Paunikar</h4>
            <p>Contributed to planning, created the template and video, and reviewed the project</p>
          </div>
          <div className="team-member">
            <div className="member-img">
              <i className="fas fa-user-circle"></i>
            </div>
            <h4>Aaryan Mishra</h4>
            <p>Designed the frontend, planned features, and integrated APIs.</p>
          </div>
          <div className="team-member">
            <div className="member-img">
              <i className="fas fa-user-circle"></i>
            </div>
            <h4>Saksham Talwar</h4>
            <p>Managed backend development, planning, and API integration.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About; 