import React, { useState, useEffect } from "react";
import "../styles/main.scss";
import { useParams } from "react-router-dom";

const RestaurantOverview = () => {
  const { restaurantId } = useParams();
  return (
    <div className="restaurant-overview-container">
      <div className="restaurant-header">
        <h1>Pregled Restorana</h1>
      </div>
    </div>
  );
}

export default RestaurantOverview;