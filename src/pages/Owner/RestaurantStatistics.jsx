import React, { useState, useEffect } from "react";
import "../../styles/main.scss";
import Statistics from "../Statistics"

const RestaurantStatistics = ({restaurantId}) => {
  return (
    <div className="owner-statistics-container">
      <div className="restaurant-header">
        <h1>Statistika Vlasnika</h1>
      </div>
       <Statistics 
          restaurantId={restaurantId}
        ></Statistics>
    </div>
  );
}

export default RestaurantStatistics;