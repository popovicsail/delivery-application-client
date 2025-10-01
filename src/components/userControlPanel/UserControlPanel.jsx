import React, { useEffect, useState } from "react";
import FileUploader from "./FileUploader";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../services/user.services.tsx";
import "../../styles/userControlPanel.scss";

const UsersControlPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profil-view");
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);

  const [alergens1, setAlergens1] = useState({
    gluten: false,
    lactose: false,
    nuts: false,
    soy: false,
    eggs: false,
    fish: false,
  });

  const [alergens2, setAlergens2] = useState({
    shellfish: false,
    sesame: false,
    celery: false,
    mustard: false,
    sulfurDioxide: false,
    lupin: false,
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    getProfile()
      .then((data) => {
        setProfile(data);
        setUser({
          userName: data.userName || "",
          password: "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          file: null
        });

        // Ako backend vraća alergene:
        // setAlergens1(data.alergens1 || defaultAlergens1);
        // setAlergens2(data.alergens2 || defaultAlergens2);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...user,
      alergens: [
        ...Object.entries(alergens1),
        ...Object.entries(alergens2)
      ]
        .filter(([_, selected]) => selected)
        .map(([name]) => name)
    };

    console.log("Podaci za slanje:", payload);
    // Poziv ka backendu za ažuriranje profila
  };

  return (
    <div className="account-panel">
      <aside className="sidebar">
        <ul>
          <li className={activeTab === "profil-view" ? "active" : ""} onClick={() => setActiveTab("profil-view")}>Profil</li>
          <li className={activeTab === "izmeni-podatke-form" ? "active" : ""} onClick={() => setActiveTab("izmeni-podatke-form")}>Izmeni podatke</li>
          <li className={activeTab === "alergen-view" ? "active" : ""} onClick={() => setActiveTab("alergen-view")}>Alergeni</li>
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
                <img src={profile.imageUrl || "/default-avatar.png"} alt="Profilna slika" />
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
              <div className="form-row">
                <label htmlFor="password">Lozinka:</label>
                <input type="password" id="password" value={user.password} onChange={handleInputChange} required />
              </div>
              <div className="upload-section">
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button id="save" type="submit">Sačuvaj</button>
            </form>
          )}
        </section>

        {/* Alergeni */}
        <section id="alergen-view" className={activeTab === "alergen-view" ? "active" : ""}>
          <div className="form-section">
            <h3>🧬 Alergeni</h3>
            <form className="alergenForm" onSubmit={handleSubmit}>
              <div className="alergen1">
                {Object.entries(alergens1).map(([key, value]) => (
                  <label key={key} className={`checkbox-label ${value ? "selected" : ""}`}>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() =>
                        setAlergens1((prev) => ({ ...prev, [key]: !prev[key] }))
                      }
                    />
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                ))}
              </div>
              <div className="alergen2">
                {Object.entries(alergens2).map(([key, value]) => (
                  <label key={key} className={`checkbox-label ${value ? "selected" : ""}`}>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() =>
                        setAlergens2((prev) => ({ ...prev, [key]: !prev[key] }))
                      }
                    />
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                ))}
              </div>
              <div className="dugme">
                <button type="submit">Sačuvaj alergene</button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UsersControlPanel;
