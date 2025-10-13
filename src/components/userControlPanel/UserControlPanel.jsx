import React, { useEffect, useState } from "react";
import FileUploader from "./FileUploader";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../services/user.services.tsx";
import { toImageUrl } from "../../services/imageUtils.tsx";
import * as userService from "../../services/user.services.tsx";
import "../../styles/userControlPanel.scss";

const UsersControlPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profil-view");
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [profilePictureBase64, setProfilePictureBase64] = useState(null);
  const [profilePictureMimeType, setProfilePictureMimeType] = useState(null);
  const [newAddress, setNewAddress] = useState({ streetAndNumber: "", city: "" ,postalCode: ""});
  const [editingAddress, setEditingAddress] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [alergens, setAlergens] = useState([]);


  

useEffect(() => {
  const token = sessionStorage.getItem("token");
  if (!token) return;

  userService.getMyAddresses()
    .then((data) => {
      console.log("Učitane adrese:", data);
      setCurrentAddress({ addresses: data || [] });
    })
    .catch((err) => {
      console.error("Greška pri učitavanju adresa:", err);
      setCurrentAddress({ addresses: [] });
    });

  userService.getAllergens()
    .then((data) => {
      const enriched = (data || []).map(a => ({ ...a, selected: false }));
      setAlergens(enriched);
    })
    .catch((err) => console.error("Greška pri učitavanju alergena:", err));

    getProfile()
    .then((data) => {
      const imageUrl = toImageUrl(
        data?.profilePictureBase64 ?? null,
        data?.profilePictureMimeType ?? "image/png"
      );
  
      setProfile({
        ...data,
        imageUrl,
      });
  
      setUser({
        userName: data.userName || "",
        password: "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        file: imageUrl,
      });
    })
    .catch((err) => {
      console.error("Greška pri učitavanju profila:", err);
      sessionStorage.removeItem("token");
      navigate("/login");
    });
}, [navigate]);

  
  const handleFileSelect = (file) => {
    setUser((prev) => ({ ...prev, file }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUser((prev) => ({ ...prev, [id]: value }));
  };

  const toggleAlergen = (id) => {
    setAlergens(prev =>
      prev.map(a =>
        a.id === id ? { ...a, selected: !a.selected } : a
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePictureBase64,   
      profilePictureMimeType, 
    };
  
    console.log("Podaci za slanje:", payload);
  
    userService.updateProfile(payload)
      .then(() => alert("Podaci su uspešno ažurirani."))
      .catch((err) => {
        console.error("Greška pri ažuriranju profila:", err);
        alert("Došlo je do greške prilikom ažuriranja profila.");
      });
  };
  const handleSubmitAlergens = (e) => {
    e.preventDefault();
  
    const payload = {
      AllergenIds: alergens.filter(a => a.selected).map(a => a.id)
    };
  
    userService.putMyAllergens(payload)
      .then(() => alert("Alergeni su uspešno ažurirani."))
      .catch((err) => {
        console.error("Greška pri ažuriranju alergena:", err);
        alert("Došlo je do greške prilikom ažuriranja alergena.");
      });
  
    console.log("Podaci za slanje:", payload);
  };


  const handleAddAddress = async (e) => {
    e.preventDefault();
    console.log("Dodavanje adrese:", newAddress);
    userService.addAddress(newAddress)
      .then((addedAddress) => {
        setCurrentAddress((prev) => ({
          ...prev,
          addresses: [...(prev.addresses || []), addedAddress]
        }));
        setNewAddress({ StreetAndNumber: "", City: "" ,PostalCode: ""});
        alert("Adresa je uspešno dodata.");
      })
      .catch((err) => {
        console.error("Greška pri dodavanju adrese:", err);
        alert("Došlo je do greške prilikom dodavanja adrese.");
      });
  };

  const handleEditAddress = (addr) => {
    setEditingAddress(addr);
    setNewAddress({
      streetAndNumber: addr.streetAndNumber,
      city: addr.city,
      postalCode: addr.postalCode
    });
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    if (!editingAddress) return;
  
    const payload = {
      StreetAndNumber: newAddress.streetAndNumber,
      City: newAddress.city,
      PostalCode: newAddress.postalCode
    };
  
    try {
      const updated = await userService.updateAddress(editingAddress.id, payload);
      setCurrentAddress((prev) => ({
        ...prev,
        addresses: prev.addresses.map((a) =>
          a.id === editingAddress.id ? updated : a
        )
      }));
      setEditingAddress(null);
      setNewAddress({ StreetAndNumber: "", City: "", PostalCode: "" });
      alert("Adresa je uspešno izmenjena.");
    } catch (err) {
      console.error("Greška pri izmeni adrese:", err);
      alert("Došlo je do greške prilikom izmene adrese.");
    }
  };
  

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovu adresu?")) return;
  
    try {
      await userService.deleteAddress(id);
      setCurrentAddress((prev) => ({
        ...prev,
        addresses: prev.addresses.filter((a) => a.id !== id)
      }));
      alert("Adresa je uspešno obrisana.");
    } catch (err) {
      console.error("Greška pri brisanju adrese:", err);
      alert("Došlo je do greške prilikom brisanja adrese.");
    }
  };
  

  return (
    <div className="account-panel">
      <aside className="sidebar">
        <ul>
          <li className={activeTab === "profil-view" ? "active" : ""} onClick={() => setActiveTab("profil-view")}>Profil</li>
          <li className={activeTab === "izmeni-podatke-form" ? "active" : ""} onClick={() => setActiveTab("izmeni-podatke-form")}>Izmeni podatke</li>
          <li className={activeTab === "alergen-view" ? "active" : ""} onClick={() => setActiveTab("alergen-view")}>Alergeni</li>
          <li className={activeTab === "adrese-view" ? "active" : ""} onClick={() => setActiveTab("adrese-view")}>Adrese</li>
        </ul>
      </aside>

      <main className="content">
        {/* Profil */}
        <section id="profil-view" className={activeTab === "profil-view" ? "active" : ""}>
          {!profile ? (
            <p>Učitavanje profila...</p>
          ) : (
            <>
              <div className="profile-picture">
                <img
                  src={profile?.imageUrl || "/default-avatar.png"}
                  alt="Profilna slika"
                />
              </div>

              <p><strong>Korisničko ime:</strong> <span>{profile.userName}</span></p>
              <p><strong>Ime:</strong> <span>{profile.firstName}</span></p>
              <p><strong>Prezime:</strong> <span>{profile.lastName}</span></p>
              <p><strong>Email:</strong> <span>{profile.email}</span></p>
              <p><strong>Uloga:</strong> <span>{profile.roles?.join(", ")}</span></p>
            </>
          )}
        </section>

        {/* Izmena podataka */}
        <section id="izmeni-podatke-form" className={activeTab === "izmeni-podatke-form" ? "active" : ""}>
          {!user ? (
            <p>Učitavanje forme...</p>
          ) : (
            <form id="edit-user-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label htmlFor="firstName">Ime:</label>
                <input type="text" id="firstName" value={user.firstName} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <label htmlFor="lastName">Prezime:</label>
                <input type="text" id="lastName" value={user.lastName} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" value={user.email} onChange={handleInputChange} required />
              </div>
              <div className="upload-section">
              <FileUploader
                onFileProcessed={({ base64, mimeType }) => {
                  setProfilePictureBase64(base64);
                  setProfilePictureMimeType(mimeType);
                }}
              />
              </div>
              <button id="save" type="submit">Sačuvaj</button>
            </form>
          )}
        </section>

        {/* Alergeni */}
       {/* Alergeni */}
       <section id="alergen-view" className={activeTab === "alergen-view" ? "active" : ""}>
          <div className="form-section">
            <h3>🧬 Alergeni</h3>
            <form className="alergenForm" onSubmit={handleSubmitAlergens}>
              <div className="alergen1">
                {alergens.map((a) => (
                  <label key={a.id} className={`checkbox-label ${a.selected ? "selected" : ""}`}>
                    <input
                      type="checkbox"
                      checked={a.selected}
                      onChange={() => toggleAlergen(a.id)}
                    />
                    {a.name} <span className="allergen-type">({a.type})</span>
                  </label>
                ))}
              </div>
              <div className="dugme">
                <button type="submit">Sačuvaj alergene</button>
              </div>
            </form>
          </div>
        </section>


        <section
          id="adrese-view"
          className={activeTab === "adrese-view" ? "active" : ""}
        >
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
                <button type="button" onClick={() => {
                  setEditingAddress(null);
                  setNewAddress({ StreetAndNumber: "", City: "", PostalCode: "" });
                }}>
                  Otkaži
                </button>
              )}
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UsersControlPanel;
