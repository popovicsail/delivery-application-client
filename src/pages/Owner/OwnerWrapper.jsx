import React, { useState, useEffect } from "react";
import "../../styles/main.scss";
import OwnerRestaurants from "./OwnerRestaurants";

const OwnerWrapper = () => {
  const [activeTab, setActiveTab] = useState("restaurants");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return (
    <div className="owner-wrapper">

      {/*<div className="owner-navbar-row"> 
        <div className="owner-navbar-block">
          <button type="button" className={`owner-navbar-option ${activeTab == "restaurants" && "owner-navbar-option-active"}`}
          onClick={(e) => setActiveTab("restaurants")}>Restorani</button>
        </div>
      </div>*/}

      <div className="owner-content-container">
        {activeTab == "restaurants" && (<OwnerRestaurants />)}
      </div>
    </div>
  );
}
export default OwnerWrapper;