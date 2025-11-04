import React, { useState } from "react";
import "../../styles/CartView.scss";

export default function CartView({
  draftOrder,
  removeFromCart,
  cancelOrder,
  vouchers,
  addresses,
  onSubmit,
  error,
  loading,
}) {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  /*const total = (items) => { 
    return items.reduce((sum, i) => {
      const extras = i.dishOptions?.reduce((s, o) => s + o.price, 0) || 0;
      return sum + i.price + extras;
    }, 0);
  }*/

  const discount = selectedVoucher ? selectedVoucher.discountAmount : 0;
  const finalTotal = Math.max((draftOrder ? draftOrder.totalPrice : 0) - discount, 0);

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return (
    <div className="cart">
      <h2>Vaša korpa</h2>

      <ul>
        {draftOrder && draftOrder.items.map(item => (
          <li key={item.id}>
            {item.name} x {item.quantity} = {item.price} RSD
            <button onClick={() => removeFromCart(item.id)}>Ukloni Stavku</button>
          </li>
        ))}
      </ul>

      {/* Adrese */}

      <label>
      Adresa za dostavu:
          <select
              value={selectedAddress && selectedAddress.id || ""}
              onChange={(e) => setSelectedAddress(addresses?.find(v => v.id === e.target.value) || null)}
          >
              <option value="">Izaberi adresu</option>
              {addresses.map(addr => (
              <option key={addr.id} value={addr.id}>
                  {addr.streetAndNumber}, {addr.city}
              </option>
              ))}
          </select>
      </label>

      {/* Vaučeri */}
      <label>
        Vaučer:
        <select
          value={selectedVoucher && selectedVoucher.id || ""}
          onChange={(e) => setSelectedVoucher(vouchers?.find(v => v.id === e.target.value) || null)}
        >
          <option value="">Bez vaučera</option>
          {(vouchers || []).map(v => (
            <option key={v.id} value={v.id}>
              {v.name} - {v.discountAmount} RSD
            </option>
          ))}
        </select>
      </label>

      {/* Rezime */}
      <div className="cart-summary">
        <p>Ukupno: {draftOrder ? `${draftOrder.totalPrice}` : `0`} RSD</p>
        {selectedVoucher && (
          <p style={{ color: "green" }}>
            Popust ({selectedVoucher.name}): -{discount} RSD
          </p>
        )}
        <h3>Za plaćanje: {finalTotal} RSD</h3>
      </div>

      <button onClick={(e) => {onSubmit({voucherId: selectedVoucher && selectedVoucher.id, addressId: selectedAddress && selectedAddress.id}, draftOrder.id); setSelectedVoucher(null); setSelectedAddress(null);}} className="order-btn">
        Pošalji porudžbinu
      </button>
    </div>
  );
}
  
