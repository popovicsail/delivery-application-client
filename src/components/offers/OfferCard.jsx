import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../../styles/offers.scss";

const OfferCard = ({ offer, isInMenu, isOwnerHere, isCustomer, onDelete, addToOrder }) => {
  const navigate = useNavigate();
  const myAllergens = JSON.parse(sessionStorage.getItem('myAllergens'))

  return (
    <div className={`offer-card ${(!isInMenu || isCustomer) ? "offer-card-hover" : ""}`}
      onClick={e => (isInMenu && isCustomer 
      && addToOrder({
        id: offer.id,
        itemType: 'OFFER',
        price: offer.price,
        isOrdered: true,
      }))}
    >
      <div className="offer-image-wrapper">
        <img className="offer-image" src={offer?.image?.length > 0 ? offer.image : "https://www.keralatourism.org/_next/image/?url=http%3A%2F%2F127.0.0.1%2Fktadmin%2Fimg%2Fpages%2Flarge-desktop%2Frice-dishes-1714219146_4b2d13389d18792a8c3d.webp&w=3840&q=75"} alt="" />
        
        {isOwnerHere && (
          <section className="section-row">
              <button className="edit-btn buttons" onClick={() => (navigate(`offers/${offer.id}/edit`))}>Izmeni</button>
              <button className="delete-btn buttons" onClick={() => onDelete(offer.id)}>Ukloni</button>
          </section>
        )}

        <div className="offer-expires-at-badge">
          <p>Vazi do: {offer.expiresAt.toLocaleString().replace('T', " ").substring(0, 16)}!</p>
        </div>
      </div>

      <div className="offer-info-wrapper">
        <div className="offer-info">
          <h2 className="offer-name" title={offer.name}>{offer.name}</h2>
          {/*<p className="offer-desc" title={offer.description}>{offer.description}</p>*/}
          <p className="offer-price">Cena: <strong>{offer.price} RSD</strong></p>
        
        </div>
        {offer?.offerDishes?.some(od => od?.dish?.allergens?.length > 0) &&
          <ul>
            {offer.offerDishes.map(od => (
              od.dish.allergens.map(a => (
                <li title={a.name} style={((myAllergens && myAllergens.includes(a.id)) ? {color: 'red'} : {color: 'black'})} key={a.id}>{a.name}</li>
              ))
            ))}
          </ul>
        }
      </div>
    </div>
  );
}

export default OfferCard;