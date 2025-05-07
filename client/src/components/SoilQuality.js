import React, { useState, useEffect } from 'react';
import '../styles/SoilQuality.css';

function SoilQuality() {
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultsContent, setResultsContent] = useState('');
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // Reset results if they were previously shown
        setShowResults(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // Check if user is logged in
    if (!window.authHandler || !window.authHandler.isAuthenticated()) {
      setResultsContent({
        title: "Login Required",
        content: "No response generated."
      });
      setShowResults(true);
      
      // Show login prompt
      if (window.authHandler) {
        window.authHandler.showLoginPrompt();
      }
      return;
    }
    
    if (!imagePreview) {
      alert("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Get the file from the data URL
      const imageFile = await dataURLtoFile(imagePreview, 'soil_image.jpg');
      
      // Create form data for the API request
      const formData = new FormData();
      formData.append('image', imageFile);
      
      // Send the image to the server
      const response = await fetch('/analyze-soil', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResultsContent({
          title: "Analysis Results",
          content: data.analysis
        });
      } else {
        setResultsContent({
          title: "Error",
          content: data.error || "Failed to analyze the image."
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setResultsContent({
        title: "Error",
        content: `Error analyzing image: ${error.message}`
      });
    } finally {
      setIsLoading(false);
      setShowResults(true);
    }
  };
  
  // Helper function to convert data URL to File object
  const dataURLtoFile = (dataURL, filename) => {
    return new Promise((resolve) => {
      const arr = dataURL.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      
      resolve(new File([u8arr], filename, { type: mime }));
    });
  };

  return (
    <div className="soil-content">
      <h2>Soil Quality Analysis</h2>
      <p className="soil-text">Understanding your soil is the first step towards successful farming. Upload your soil sample results or input parameters below:</p>
      
      <div className="farming-prac">
        <div className="practice-cards">
          <div className="practice-card">
            <i className="fas fa-seedling"></i>
            <h3>Soil Health Overview</h3>
            <p>Upload a soil image for a quick quality assessment.</p>
          </div>
          <div className="practice-card">
            <i className="fas fa-tint"></i>
            <h3>Affordable Testing Methods</h3>
            <p>Test soil quality with simple, low-cost techniques.</p>
          </div>
          <div className="practice-card">
            <i className="fas fa-leaf"></i>
            <h3>Soil Improvement Tips</h3>
            <p>Get tailored advice to boost yield and soil health.</p>
          </div>
        </div>
      </div>

      <a href="https://onlinelibrary.wiley.com/doi/10.1155/2023/6699154" target="_blank" rel="noopener noreferrer">
        <button className="farm-btn">Learn More</button>
      </a>

      <div className="pest-control">
        <h2>Pest Management</h2>
        <p className="pest-text">Integrated Pest Management (IPM) strategies for your crops:</p>
        <div className="pest-cards">
          <div className="pest-card">
            <i className="fas fa-bug"></i>
            <h3>Prevention</h3>
            <p>Early detection and preventive measures.</p>
          </div>
          <div className="pest-card">
            <i className="fas fa-shield-alt"></i>
            <h3>Control</h3>
            <p>Biological and chemical control methods.</p>
          </div>
          <div className="pest-card">
            <i className="fas fa-chart-line"></i>
            <h3>Monitoring</h3>
            <p>Regular pest surveillance and tracking.</p>
          </div>
        </div>
      </div>

      <a href="https://bioprotectionportal.com/resources/integrated-pest-management-use-and-its-benefits/" target="_blank" rel="noopener noreferrer">
        <button className="pest-btn">Learn More</button>
      </a>

      <div className="image-bor">
        <h2 className="upload-heading">Soil Quality Check / Pest Check</h2>
        <div 
          className="image-upload-container" 
          onClick={() => document.getElementById('imageUpload').click()}
        >
          <input 
            type="file" 
            id="imageUpload" 
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <div 
            className="upload-placeholder" 
            id="uploadPlaceholder"
            style={{ display: imagePreview ? 'none' : 'block' }}
          >
            Upload Image
          </div>
          {imagePreview && (
            <img 
              src={imagePreview} 
              alt="Uploaded Image Preview" 
              id="preview" 
              style={{ display: 'block' }}
            />
          )}
        </div>
        
        {isLoading && (
          <div className="loading" id="loading" style={{ display: 'flex' }}>
            Analyzing your image...
          </div>
        )}
        
        {showResults && (
          <div className="results-container" id="resultsContainer" style={{ display: 'block' }}>
            <button 
              className="close-results" 
              id="closeResults" 
              onClick={() => setShowResults(false)}
            >
              ×
            </button>
            <div>
              <h3>{resultsContent.title}</h3>
              <p>{resultsContent.content}</p>
            </div>
          </div>
        )}
      </div>
      
      <button 
        className="img-submit" 
        id="submitButton" 
        disabled={!imagePreview || isLoading}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}

export default SoilQuality;