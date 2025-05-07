import React, { useState, useEffect } from 'react';
// Make sure this import path is correct for your project structure
// import '../styles/BestPractices.css';

function BestPractices() {
  console.log("BestPractices component rendered"); // Debug log
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    soilType: '',
    irrigation: '',
    crops: '',
    pestIssues: '',
    fertilizers: '',
    weatherIssues: ''
  });
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    if (window.authHandler) {
      // Wait for auth status to load
      const checkAuth = async () => {
        await window.authHandler.loadAuthStatus();
        setIsAuthenticated(window.authHandler.isAuthenticated());
      };
      checkAuth();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!window.authHandler || !window.authHandler.isAuthenticated()) {
      setResponse("Please log in to use this feature.");
      setShowResponse(true);
      setShowForm(false);
      
      // Show login prompt
      if (window.authHandler) {
        window.authHandler.showLoginPrompt();
      }
      return;
    }
    
    const { soilType, irrigation, crops, pestIssues, fertilizers, weatherIssues } = formData;

    if (!soilType || !irrigation || !crops) {
      alert("Please fill all required details.");
      return;
    }

    setLoading(true);
    setShowResponse(false);

    try {
      // Create user prompt for API
      const userPrompt = `Soil Type: ${soilType}, Irrigation: ${irrigation}, Crops: ${crops}, Pest Issues: ${pestIssues}, Fertilizers: ${fertilizers}, Weather Issues: ${weatherIssues}. Suggest best farming practices for this farmer.`;

      // Send the API request
      const response = await fetch("/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      const data = await response.json();
      
      // Hide form elements and show response
      setShowForm(false);
      setResponse(data.response || "No response received.");
      setShowResponse(true);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setResponse("Error fetching data. Please try again later.");
      setShowResponse(true);
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    console.log("Opening modal"); // Debug log
    setShowModal(true);
  };

  const closeModal = () => {
    console.log("Closing modal"); // Debug log
    setShowModal(false);
    // Reset state when modal is closed
    setShowForm(true);
    setShowResponse(false);
    setResponse('');
  };

  console.log("Modal state:", showModal); // Debug log for modal state

  return (
    <div id="practices">
      <h2>Best Farming Practices</h2>
      <p className="farming-text">Discover sustainable and efficient farming techniques for optimal yield.</p>
      
      <div className="farming-prac">
        <div className="practice-cards">
          <div className="practice-card">
            <i className="fas fa-seedling"></i>
            <h3>Crop Rotation</h3>
            <p>Implement systematic crop rotation to maintain soil health and prevent pest buildup.</p>
          </div>
          <div className="practice-card">
            <i className="fas fa-tint"></i>
            <h3>Water Management</h3>
            <p>Optimize irrigation systems and water usage for sustainable farming.</p>
          </div>
          <div className="practice-card">
            <i className="fas fa-leaf"></i>
            <h3>Organic Farming</h3>
            <p>Learn about organic farming methods and certification processes.</p>
          </div>
        </div>
      </div>

      <a href="https://www.agrivi.com/blog/best-farm-practices-for-profitable-farming/" target="_blank" rel="noopener noreferrer">
        <button className="farm-btn">Learn More</button>
      </a>

      <div className="practises-contact">
        <h3>Need Help?</h3>
        <p>Enter details about yourself to learn about best farming practises.</p>
        {/* Changed to button type element with onClick handler */}
        <button 
          type="button"
          className="practises-btn" 
          onClick={openModal}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4caf50',
            color: '#F5F7F2',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1rem',
            cursor: 'pointer',
            margin: '20px auto 0',
            display: 'inline-block',
            transition: 'all 0.3s ease'
          }}
        >
          Click Here
        </button>
      </div>

      {/* Modal with debugging message */}
      {showModal ? (
        <div 
          className="modal" 
          style={{
            display: 'flex',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div 
            className="modal-content" 
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '500px',
              position: 'relative',
              boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.3)'
            }}
          >
            <span 
              className="close" 
              onClick={closeModal} 
              style={{
                position: 'absolute',
                right: '15px',
                top: '10px',
                cursor: 'pointer',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#555'
              }}
            >
              &times;
            </span>
            
            {/* Response display */}
            {showResponse && (
              <div id="responsePractices" style={{ display: 'block' }}>
                <h3>Personalized Recommendations</h3>
                <div style={{ textAlign: 'left', marginTop: '15px' }}>
                  {response}
                </div>
                <button 
                  onClick={closeModal}
                  style={{
                    background: '#4caf50',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '20px'
                  }}
                >
                  Close
                </button>
              </div>
            )}
            
            {/* Form elements */}
            {showForm && !loading && (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="soilType">What type of soil do you have?*</label>
                  <input
                    type="text"
                    id="soilType"
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleInputChange}
                    placeholder="E.g., Clay, Sandy, Loamy"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="irrigation">Do you have access to irrigation?*</label>
                  <input
                    type="text"
                    id="irrigation"
                    name="irrigation"
                    value={formData.irrigation}
                    onChange={handleInputChange}
                    placeholder="Yes or No"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="crops">What are the main crops you cultivate?*</label>
                  <input
                    type="text"
                    id="crops"
                    name="crops"
                    value={formData.crops}
                    onChange={handleInputChange}
                    placeholder="E.g., Wheat, Rice"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pestIssues">Do you face any major pest or disease issues?</label>
                  <input
                    type="text"
                    id="pestIssues"
                    name="pestIssues"
                    value={formData.pestIssues}
                    onChange={handleInputChange}
                    placeholder="Yes or No (Specify if needed)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fertilizers">Do you use chemical fertilizers, organic manure, or both?</label>
                  <input
                    type="text"
                    id="fertilizers"
                    name="fertilizers"
                    value={formData.fertilizers}
                    onChange={handleInputChange}
                    placeholder="E.g., Chemical, Organic, Both"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="weatherIssues">Do you face extreme weather conditions like droughts or floods?</label>
                  <input
                    type="text"
                    id="weatherIssues"
                    name="weatherIssues"
                    value={formData.weatherIssues}
                    onChange={handleInputChange}
                    placeholder="Yes or No"
                  />
                </div>

                <button 
                  type="submit" 
                  id="submitPracticesDetails"
                  style={{
                    background: '#4caf50',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    margin: '10px auto 0',
                    display: 'block',
                    width: '200px',
                    fontSize: '1rem'
                  }}
                >
                  Submit
                </button>
              </form>
            )}
            
            {/* Loading indicator */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>Generating personalized recommendations...</p>
                <div style={{ 
                  display: 'inline-block',
                  width: '40px',
                  height: '40px',
                  margin: '20px auto',
                  border: '4px solid rgba(76, 175, 80, 0.3)',
                  borderRadius: '50%',
                  borderTop: '4px solid #4caf50',
                  animation: 'spin 1s linear infinite'
                }}>
                </div>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default BestPractices;