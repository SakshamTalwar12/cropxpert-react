import React, { useState, useEffect } from 'react';
import '../styles/GovernmentSchemes.css';

function GovernmentSchemes() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    state: '',
    landArea: '',
    crops: '',
    income: '',
    kcc: '',
    pmKisan: '',
    otherDetails: ''
  });
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
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
      setResponse("No response generated.");
      setShowResponse(true);
      
      // Hide form elements
      setShowForm(false);
      
      // Show login prompt
      if (window.authHandler) {
        window.authHandler.showLoginPrompt();
      }
      return;
    }
    
    // Ensure form is visible
    setShowForm(true);

    const { state, landArea, crops, income } = formData;

    if (!state || !landArea || !crops || !income) {
      alert("Please fill all required details.");
      return;
    }

    setLoading(true);
    setShowResponse(false);

    try {
      // Create user prompt for API
      const userPrompt = `State: ${state}, Land Area: ${landArea} acres, Crops: ${crops}, Annual Income: ${income}, KCC: ${formData.kcc}, PM-KISAN: ${formData.pmKisan}, Other Details: ${formData.otherDetails}. Suggest government schemes suitable for this farmer.`;

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
      setResponse("Error fetching data.");
      setShowResponse(true);
    } finally {
      setLoading(false);
    }
  };

  // State to control form visibility
  const [showForm, setShowForm] = useState(true);

  return (
    <div className="schemes-container">
      <h2>Government Agricultural Schemes</h2>
      <p className="schemes-intro">Explore various government initiatives and schemes designed to support farmers:</p>

      <div className="schemes-grid">
        <div className="scheme-card">
          <div className="scheme-icon">
            <i className="fas fa-hand-holding-usd"></i>
          </div>
          <h3>PM-KISAN</h3>
          <p>Direct income support of ₹6000 per year to eligible farmer families</p>
          <div className="scheme-details">
            <span><i className="fas fa-users"></i> All Farmers</span>
            <span><i className="fas fa-calendar"></i> Year-round</span>
          </div>
        </div>

        <div className="scheme-card">
          <div className="scheme-icon">
            <i className="fas fa-seedling"></i>
          </div>
          <h3>Soil Health Card</h3>
          <p>Free soil testing and recommendations for farmers</p>
          <div className="scheme-details">
            <span><i className="fas fa-map-marker-alt"></i> Pan India</span>
            <span><i className="fas fa-clock"></i> Seasonal</span>
          </div>
        </div>

        <div className="scheme-card">
          <div className="scheme-icon">
            <i className="fas fa-tractor"></i>
          </div>
          <h3>Farm Mechanization</h3>
          <p>Subsidies on purchase of agricultural machinery</p>
          <div className="scheme-details">
            <span><i className="fas fa-percentage"></i>50% subsidy</span>
            <span><i className="fas fa-tools"></i>Equipments</span>
          </div>
        </div>
      </div>

      <a href="https://pib.gov.in/PressReleaseIframePage.aspx?PRID=2002012" target="_blank" rel="noopener noreferrer">
        <button className="schemes-btn">Learn More</button>
      </a>

      <div className="schemes-contact">
        <h3>Need Help?</h3>
        <p>Enter details to learn about relevant government schemes.</p>
        <button className="contact-btn" onClick={() => setShowModal(true)}>Click Here</button>
      </div>

      {showModal && (
        <div className="modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '500px',
            position: 'relative',
            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <span className="close" onClick={() => setShowModal(false)} style={{
              position: 'absolute',
              right: '15px',
              top: '10px',
              cursor: 'pointer',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#555'
            }}>&times;</span>
            
            {/* Response display */}
            {showResponse && (
              <div id="responseSchemes" style={{ display: 'block' }}>
                {response}
              </div>
            )}
            
            {/* Form elements */}
            {showForm && !loading && (
              <form id="schemesForm" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="state">State:</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter your state"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="landArea">Land Area (in acres):</label>
                  <input
                    type="number"
                    id="landArea"
                    name="landArea"
                    value={formData.landArea}
                    onChange={handleInputChange}
                    placeholder="E.g., 5"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cropsSchemes">Main Crops:</label>
                  <input
                    type="text"
                    id="cropsSchemes"
                    name="crops"
                    value={formData.crops}
                    onChange={handleInputChange}
                    placeholder="E.g., Wheat, Rice"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="income">Annual Income (₹):</label>
                  <input
                    type="text"
                    id="income"
                    name="income"
                    value={formData.income}
                    onChange={handleInputChange}
                    placeholder="E.g., Below 1 lakh"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="kcc">Do you have a Kisan Credit Card? (Yes/No)</label>
                  <input
                    type="text"
                    id="kcc"
                    name="kcc"
                    value={formData.kcc}
                    onChange={handleInputChange}
                    placeholder="Yes or No"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pmKisan">Are you registered under PM-KISAN? (Yes/No)</label>
                  <input
                    type="text"
                    id="pmKisan"
                    name="pmKisan"
                    value={formData.pmKisan}
                    onChange={handleInputChange}
                    placeholder="Yes or No"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="otherDetails">Any other details that you would like to mention</label>
                  <input
                    type="text"
                    id="otherDetails"
                    name="otherDetails"
                    value={formData.otherDetails}
                    onChange={handleInputChange}
                  />
                </div>

                <button type="submit" id="submitSchemesDetails">Submit</button>
              </form>
            )}
            
            {/* Loading indicator */}
            {loading && <p>Generating response...</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default GovernmentSchemes;