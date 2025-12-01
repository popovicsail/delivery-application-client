import React, { useState, useEffect } from "react";
import * as userService from "../../services/user.services";
import MapModal from "../../components/widgets/MapWidget/MapModal.jsx"; // ✅ import modala
import "../widgets/MapWidget/mapModal.scss";
import "../../styles/userControlPanel.scss";

export default function AddressTab({ active }) {
  const [currentAddress, setCurrentAddress] = useState({ addresses: [] });
  const [newAddress, setNewAddress] = useState({
    latitude: null,
    longitude: null
  });
  const [editingAddress, setEditingAddress] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false); // ✅ state za modal

  const refreshAddresses = async () => {
    try {
      setLoading(true);
      const addresses = await userService.getMyAddresses();
      setCurrentAddress({ addresses });
    } catch (err) {
      console.error("Greška:", err);
      setError("Greška pri učitavanju adresa.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAddresses();
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.latitude || !newAddress.longitude) {
      setError("Morate prvo izabrati lokaciju na mapi.");
      return;
    }
    try {
      setLoading(true);
      await userService.addAddress(newAddress.latitude, newAddress.longitude);
      await refreshAddresses();
      setNewAddress({ latitude: null, longitude: null });
      setError("");
      alert("Uspešno ste dodali adresu");
    } catch (err) {
      console.error("Greška:", err);
      setError("Greška pri dodavanju adrese.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await userService.updateAddress(editingAddress.id, newAddress);
      await refreshAddresses();
      setEditingAddress(null);
      setNewAddress({ latitude: null, longitude: null });
      setError("");
      alert("Uspešno ste izmenili adresu");
    } catch (err) {
      console.error("Greška:", err);
      setError("Greška pri izmeni adrese.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      if (!window.confirm("Da li ste sigurni da želite da uklonite adresu?")) return;
      setLoading(true);
      await userService.deleteAddress(id);
      await refreshAddresses();
      setError("");
      alert("Uspešno ste uklonili adresu");
    } catch (err) {
      console.error("Greška:", err);
      setError("Greška pri brisanju adrese.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (addr) => {
    setEditingAddress(addr);
    setNewAddress({ latitude: addr.latitude, longitude: addr.longitude });
  };

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
                  <button className="buttons-form" onClick={() => handleEditAddress(addr)}>Izmeni</button>
                  <button className="buttons-form" onClick={() => handleDeleteAddress(addr.id)}>Obriši</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!editingAddress && (
          <>
            <label>Dodaj adresu klikom na mapu</label>
            <button type="button" className="buttons-form" onClick={() => setShowMapModal(true)}>
              Otvori mapu
            </button>

            {newAddress.latitude && newAddress.longitude && (
              <form className="address-form" onSubmit={handleAddAddress}>
                <p className="address-preview">
                  📍 Koordinate: {newAddress.latitude}, {newAddress.longitude}
                </p>
                <button type="submit" className="buttons-form">Dodaj adresu</button>
              </form>
            )}
          </>
        )}

        {editingAddress && (
          <form className="address-form" onSubmit={handleUpdateAddress}>
            <input
              type="text"
              placeholder="Ulica i broj"
              value={editingAddress.streetAndNumber || ""}
              onChange={(e) => setEditingAddress({ ...editingAddress, streetAndNumber: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Grad"
              value={editingAddress.city || ""}
              onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Poštanski broj"
              value={editingAddress.postalCode || ""}
              onChange={(e) => setEditingAddress({ ...editingAddress, postalCode: e.target.value })}
              required
            />
            <button type="submit" className="buttons-form">Sačuvaj izmene</button>
            <button
              type="button"
              className="buttons-form"
              onClick={() => {
                setEditingAddress(null);
                setNewAddress({ latitude: null, longitude: null });
              }}
            >
              Otkaži
            </button>
          </form>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading && <div id="loadingSpinner" className="spinner"></div>}
      </div>

      {/* ✅ Modal za mapu */}
      <MapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        onLocationSelected={(coords) => {
          setNewAddress({ ...newAddress, ...coords });
        }}
      />
    </section>
  );
}
