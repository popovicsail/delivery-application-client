import React from "react";

export default function AddressView({
    currentAddress,
    handleEditAddress,
    handleDeleteAddress,
    newAddress,
    setNewAddress,
    editingAddress,
    setEditingAddress,
    handleAddAddress,
    handleUpdateAddress,
    active
  }) {
    return (
      <section id="adrese-view" className={active}>
        <div className="form-section">
          <h3>📍 Moje adrese</h3>
  
          {!currentAddress?.addresses || currentAddress.addresses.length === 0 ? (
            <p>Nemate definisane adrese.</p>
          ) : (
            <ul className="address-list">
              {currentAddress.addresses.map((addr, index) => (
                <li key={index} className="address-item">
                  <div className="address-text">
                    <span>{addr.streetAndNumber}, {addr.city} {addr.postalCode}</span>
                  </div>
                  <div className="address-actions">
                    <button onClick={() => handleEditAddress(addr)}>Izmeni</button>
                    <button onClick={() => handleDeleteAddress(addr.id)}>Obriši</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
  
          <form className="address-form" onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}>
            <input
              type="text"
              placeholder="Ulica i broj"
              value={newAddress.streetAndNumber}
              onChange={(e) => setNewAddress({ ...newAddress, streetAndNumber: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Grad"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Poštanski broj"
              value={newAddress.postalCode}
              onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
              required
            />
            <button type="submit">
              {editingAddress ? "Sačuvaj izmene" : "Dodaj adresu"}
            </button>
            {editingAddress && (
              <button
                type="button"
                onClick={() => {
                  setEditingAddress(null);
                  setNewAddress({ streetAndNumber: "", city: "", postalCode: "" });
                }}
              >
                Otkaži
              </button>
            )}
          </form>
        </div>
      </section>
    );
  }
  