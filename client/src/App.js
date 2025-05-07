import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home.js';
import SoilQuality from './components/SoilQuality.js';
import BestPractices from './components/BestPractices.js';
import GovernmentSchemes from './components/GovernmentSchemes.js';
import About from './components/About.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Navbar from './components/Navbar.js';  

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/soil" element={<SoilQuality />} />
          <Route path="/practices" element={<BestPractices />} />
          <Route path="/schemes" element={<GovernmentSchemes />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
