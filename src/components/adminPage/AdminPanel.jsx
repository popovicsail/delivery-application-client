import React, { useEffect, useState } from "react";
import "../../styles/main.scss";
import UsersAdminPanel from "./UsersAdminPanel.jsx";
import AllergensAdminPanel from "./AllergensAdminPanel.jsx";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../services/user.services.jsx";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="admin-page">
      <nav className="admin-tabs">
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Korisnici
        </button>
        <button
          className={activeTab === "allergens" ? "active" : ""}
          onClick={() => setActiveTab("allergens")}
        >
          Alergeni
        </button>
      </nav>

      <div className="admin-content">
        {activeTab === "users" && <UsersAdminPanel />}
        {activeTab === "allergens" && <AllergensAdminPanel />}
      </div>
    </div>
  );
}