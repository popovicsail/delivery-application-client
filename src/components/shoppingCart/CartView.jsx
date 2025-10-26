import React from "react";
import "../../styles/CartView.scss";

export default function CartView({
    items,
    total,
    removeFromCart,
    selectedVoucherId,
    setSelectedVoucherId,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    vouchers,
    onSubmit
  }) {
    const selectedVoucher = vouchers.find(v => v.id === selectedVoucherId);
    const discount = selectedVoucher ? selectedVoucher.discountAmount : 0;
    const finalTotal = Math.max(total - discount, 0);
  
    return (
      <div className="cart">
        <h2>Vaša korpa</h2>
  
        <ul>
          {items.map(item => (
            <li key={item.id}>
              {item.name} x {item.quantity} = {item.price * item.quantity} RSD
              <button onClick={() => removeFromCart(item.id)}>Ukloni Stavku</button>
            </li>
          ))}
        </ul>

        {/* Adrese */}

        <label>
        Adresa za dostavu:
            <select
                value={selectedAddressId || ""}
                onChange={(e) => setSelectedAddressId(e.target.value || null)}
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
            value={selectedVoucherId || ""}
            onChange={(e) => setSelectedVoucherId(e.target.value || null)}
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
          <p>Ukupno: {total} RSD</p>
          {selectedVoucher && (
            <p style={{ color: "green" }}>
              Popust ({selectedVoucher.name}): -{discount} RSD
            </p>
          )}
          <h3>Za plaćanje: {finalTotal} RSD</h3>
        </div>
  
        <button onClick={onSubmit} className="order-btn">
          Pošalji porudžbinu
        </button>
      </div>
    );
  }
  
