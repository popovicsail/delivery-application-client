import React, { useState, useEffect } from "react";
import "../../styles/main.scss";

const DishMiniCard = ({ dish, onAdd }) => {
  return (
    <div className="dish-mini-card" onClick={() => onAdd({dishId: dish.id, dish: dish})}
    style={{backgroundImage: `url("${dish.picture && dish.picture.length > 0 ? dish.picture : "https://ik.imagekit.io/munchery/blog/tr:w-768/the-10-dishes-that-define-moroccan-cuisine.jpeg"}")`}}>
      <h3 title={dish.name}>{dish.name}</h3>
      <p>Cena: {dish.price} RSD</p>
    </div>
  );
}

export default DishMiniCard;