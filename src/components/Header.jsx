import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getProfile } from "../services/user.services.tsx";
import "../styles/main.scss";

const Header = () => {
  const [roles, setRoles] = useState([]);
  const location = useLocation();
  const current = location.pathname;
  const token = sessionStorage.getItem("token");

  const getRoles = async () => {
    if (token) {
      try {
        const profile = JSON.parse(sessionStorage.getItem("myProfile"));
        setRoles(profile.user.roles ? profile.user.roles : []);
        console.log("User roles:", profile.user.roles);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setRoles([]);
      }
    }
  };

  useEffect(() => {
    getRoles();
  }, [token]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("myProfile");
    setRoles([]);
    alert("Uspešno ste se odjavili.");
  }

  return (
    <header className="header">
      <h1>Dobrodošli — Gozba na Klik</h1>
      <nav>
        <ul className="nav-list">
          <li id={current === "/home" ? "current" : ""}><Link to="/home">Početna</Link></li>
          <li className={roles.length != 0 ? "hidden" : ""} id={current === "/register" ? "current" : ""}><Link  to="/register">Registruj se</Link></li>
          <li className={roles != 0 ? "hidden" : ""} id={current === "/login" ? "current" : ""}><Link to="/login">Prijavite se</Link></li>
          <li className={roles.includes("Administrator") ? "" : "hidden"} id={current === "/restaurantsAdmin" ? "current" : ""}><Link to="/restaurantsAdmin">Restorani</Link></li>
          <li className={roles.includes("Administrator") ? "" : "hidden"} id={current === "/createRestaurant" ? "current" : ""}><Link to="/createRestaurant">Kreiraj</Link></li>
          <li className={roles.includes("Owner") ? "" : "hidden"} id={current === "/restaurantsOwner" ? "current" : ""}><Link to="/restaurantsOwner">Moji Restorani</Link></li>
          <li className={roles != 0 ? "" : "hidden"}><Link to="/home" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
