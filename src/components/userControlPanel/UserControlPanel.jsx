import React, { useState } from "react";
import FileUploader from "./FileUploader";
import { useNavigate } from "react-router-dom";
import "../../styles/userControlPanel.scss";

const UsersControlPanel = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profil-view");

  const [user, setUser] = useState({
    id: "123",
    username: "mirko",
    password: "tajna",
    role: "admin",
    file: null 
  });

  const handleFileSelect = (file) => {
    setUser((prev) => ({ ...prev, file }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUser((prev) => ({ ...prev, [id === "edit-username" ? "username" : "password"]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Podaci za slanje:", user);
    // Ovde ide poziv ka backendu
  };

  return (
    <div className="account-panel">
      <aside className="sidebar">
        <ul>
          <li
            className={activeTab === "profil-view" ? "active" : ""}
            onClick={() => setActiveTab("profil-view")}
          >
            Profil
          </li>
          <li
            className={activeTab === "izmeni-podatke-form" ? "active" : ""}
            onClick={() => setActiveTab("izmeni-podatke-form")}
          >
            Izmeni podatke
          </li>
        </ul>
      </aside>

      <main className="content">
        <section
          id="profil-view"
          className={activeTab === "profil-view" ? "active" : ""}
        >
          <p><strong>ID:</strong> <span>{user.id}</span></p>
          <p><strong>Korisničko ime:</strong> <span>{user.username}</span></p>
          <p><strong>Uloga:</strong> <span>{user.role}</span></p>
        </section>

        <section
          id="izmeni-podatke-form"
          className={activeTab === "izmeni-podatke-form" ? "active" : ""}
        >
          <form id="edit-user-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="edit-username">Korisničko ime:</label>
              <input
                type="text"
                id="edit-username"
                value={user.username}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="edit-password">Lozinka:</label>
              <input
                type="password"
                id="edit-password"
                value={user.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <FileUploader onFileSelect={handleFileSelect} />
            </div>

            <button id="save" type="submit">Sačuvaj</button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default UsersControlPanel;
