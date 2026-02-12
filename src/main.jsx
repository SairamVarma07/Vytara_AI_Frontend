import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Apply device-specific classes to document root
function initializeDeviceClasses() {
  const root = document.documentElement;
  
  // Detect touch capability
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  root.classList.add(isTouch ? 'touch' : 'no-touch');
  
  // Detect device type based on width
  function updateDeviceType() {
    const width = window.innerWidth;
    
    // Remove old device classes
    root.classList.remove('mobile-small', 'mobile', 'tablet', 'laptop', 'desktop', 'wide');
    root.classList.remove('portrait', 'landscape');
    
    // Add device type class
    if (width < 480) {
      root.classList.add('mobile-small');
    } else if (width < 768) {
      root.classList.add('mobile');
    } else if (width < 1024) {
      root.classList.add('tablet');
    } else if (width < 1280) {
      root.classList.add('laptop');
    } else if (width < 1536) {
      root.classList.add('desktop');
    } else {
      root.classList.add('wide');
    }
    
    // Add orientation class
    root.classList.add(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
  }
  
  // Initial call
  updateDeviceType();
  
  // Update on resize
  window.addEventListener('resize', updateDeviceType);
  window.addEventListener('orientationchange', updateDeviceType);
}

// Initialize device detection
initializeDeviceClasses();

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
