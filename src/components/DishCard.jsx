import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/main.scss";

const DishCard = ({ dish, highlighted, isInMenu, isOwnerHere, deleteDish, setSelectedDish, setIsFormOpen, clickForOrder }) => {
  const navigate = useNavigate();
  const myAllergens = JSON.parse(sessionStorage.getItem('myAllergens'))

  return (
    <div onClick={e => (isInMenu ? clickForOrder(dish.id, {
      id: dish.id,
      price: dish.price,
      quantity: '',
      isOrdered: false,
      dishOptionGroups: []
    }) : navigate(`/menuId/${dish.menuId}`, { state: { highlightDishId: dish.id } }))} className={`dish-card ${!isOwnerHere && "dish-card-hover"}`} id={highlighted ? "highlighted-dish" : ""}>
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
          <img className="dish-image" src={dish.picture && dish.picture.length > 0 ? dish.picture : "https://www.keralatourism.org/_next/image/?url=http%3A%2F%2F127.0.0.1%2Fktadmin%2Fimg%2Fpages%2Flarge-desktop%2Frice-dishes-1714219146_4b2d13389d18792a8c3d.webp&w=3840&q=75"} alt="slika" />
          {isOwnerHere && (
            <section className="section-row">
                <button className="edit-btn buttons" onClick={() => { setSelectedDish(dish); setIsFormOpen(true);}}>Izmeni jelo</button>
                <button className="delete-btn buttons" onClick={() => deleteDish(dish.id)}>Izbriši jelo</button>
            </section>
          )}
        </div>
    </div>
  );
}

export default DishCard;