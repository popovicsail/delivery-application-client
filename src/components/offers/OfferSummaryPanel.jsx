import React, { useState, useEffect } from "react";
import "../../styles/offers.scss";

const OfferSummaryPanel = ({offer, items, changeItemQuantity, removeItem}) => {
  return (
    <div className="offer-summary-panel">
      <div className="offer-summary-header">
        <h2>Pregled Ponude</h2>
      </div>

      <div className="offer-summary-list">
        {items.length === 0 && <p style={{textAlign: 'center'}}>Nema izabranih jela za ponudu.</p>}
        {items.map((item) => (
          <div key={item.dishId} className="offer-summary-item-row">
            <p className="item-name">{item.dish.name}</p>
            <div>
              <input type="number" min="1" value={item.quantity || 1} onChange={(e) => changeItemQuantity(item.dishId, parseInt(!e.target.value || e.target.value == "" || e.target.value == 0 ? 1 : e.target.value), item.dish)}/>
              <button className="buttons delete-btn" type="button" onClick={() => removeItem(item.dishId)}>Izbaci</button>
            </div>
          </div>
        ))}
      </div>

      <div className="offer-summary-calc">
        <div>
          <h3>Ukupna cena jela:</h3>
          <span className="offer-summary-price">{items.reduce((sum, i) => sum + i.dish.price * i.quantity, 0)} RSD</span>
        </div>

        <div>
          <h3>Cena ponude:</h3>
          <span className="offer-summary-price">{offer ? offer.price : 0} RSD</span>
        </div>

        <div>
          <h3>Usteda kupca:</h3>
          <span className="offer-summary-price">
            {items.reduce((sum, i) => sum + i.dish.price * i.quantity, 0) - (offer ? offer.price : 0)} RSD 
            ({items.length != 0 ? (Math.round(100 
              / items.reduce((sum, i) => sum + i.dish.price * i.quantity, 0) 
              * (items.reduce((sum, i) => sum + i.dish.price * i.quantity, 0) 
              - (offer ? offer.price : 0)))) : "0"}%)
          </span>
        </div>
      </div>
    </div>
  );
}

export default OfferSummaryPanel;