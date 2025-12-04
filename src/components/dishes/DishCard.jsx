import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../../styles/main.scss";
import statsIco from "../../props/bar-chart.png";

const DishCard = ({ dish, highlighted, isInMenu, isOwnerHere, isCustomer, deleteDish, setSelectedDish, setIsFormOpen, clickForOrder, onStatsClick }) => {
  const navigate = useNavigate();
  const myAllergens = JSON.parse(sessionStorage.getItem('myAllergens'))

  return (
    <div onClick={e => (isInMenu && isCustomer ? clickForOrder(dish.id, {
      id: dish.id,
      price: dish.price,
      quantity: 1,
      itemType: 'DISH',
      isOrdered: false,
      dishOptionGroups: []
    }) : !isInMenu ? navigate(`/menuId/${dish.menuId}`, { state: { highlightDishId: dish.id } }) : {})} 
    className={`dish-card ${(!isInMenu || isCustomer) ? "dish-card-hover" : ""}`} id={highlighted ? "highlighted-dish" : ""}>
      <div className="dish-info">
        <div className="dish-info-wrapper">
          <h2 className="dish-name" title={dish.name}>{dish.name}</h2>
          <p className="dish-desc" title={dish.description}>{dish.description}</p>
          <p className="dish-price">Cena: <strong>{dish.price} RSD</strong></p>
        
        </div>
        {(dish.allergens && dish.allergens.length > 0) &&
          <ul>
            {dish.allergens.map(a => (
              <li title={a.name} style={((myAllergens && myAllergens.includes(a.id)) ? {color: 'red'} : {color: 'black'})} key={a.id}>{a.name}</li>
            ))}
          </ul>
          }
        </div>
        <div className="dish-image-wrapper">
          <img className="dish-image" src={dish.picture && dish.picture.length > 0 ? dish.picture : "https://ik.imagekit.io/munchery/blog/tr:w-768/the-10-dishes-that-define-moroccan-cuisine.jpeg"} alt="" />
          
          {isOwnerHere && (
            <section className="section-row">
                <button className="edit-btn buttons" onClick={() => { setSelectedDish(dish); setIsFormOpen(true);}}>Izmeni jelo</button>
                <button className="delete-btn buttons" onClick={() => deleteDish(dish.id)}>Izbriši jelo</button>
            </section>
          )}
          {isOwnerHere && (
            <div className="dish-stats-button">
              <img src={statsIco}onClick={(e) => {
                e.stopPropagation(); 
                if (onStatsClick) onStatsClick(dish.id); 
                }} />
            </div>
          )}

          {dish.discountRate > 0 && dish.discountRate < 1 && new Date(dish.discountExpireAt) > new Date() &&
            <div className="dish-discount-badge">
              <p>{dish.discountRate * 100}% POPUST!</p>
            </div>
          }
        </div>
    </div>
  );
}

export default DishCard;