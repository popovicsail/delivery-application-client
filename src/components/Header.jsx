import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getProfile } from "../services/user.services.jsx";
import "../styles/main.scss";
import { logout } from "../services/auth.services.jsx";

const Header = () => {
  const [roles, setRoles] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [fullName, setFullName] = useState("");

  const location = useLocation();
  const current = location.pathname;
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    getProfile()
      .then((profile) => {
        setRoles(profile.roles || []);
        setProfileImage(profile.profilePictureBase64); // već data URL
        setFullName(`${profile.firstName} ${profile.lastName}`);
      })
      .catch((error) => {
        console.error("Greška pri učitavanju profila:", error);
        setRoles([]);
        setProfileImage(null);
        setFullName("");
      }, []);
  }, []);

  const handleLogout = () => {
    logout();
    setRoles([]);
    alert("Uspešno ste se odjavili.");
    navigate("/login");
  };

  const isAuthenticated = roles.length > 0;

  return (
    <header className="header">
      <h1>Dobrodošli — Gozba na Klik</h1>

      {isAuthenticated && profileImage && (
        <Link to="/controlPanel" className="header-profile-box">
          <img
            src={profileImage}   // direktno koristiš string iz backenda
            alt="Profilna slika"
            className="header-profile-image"
          />
          <span className="header-profile-name">{fullName}</span>
        </Link>
      )}

      <nav>
        <ul className="nav-list">
          <li id={current === "/home" ? "current" : ""}>
            <Link to="/home">Početna</Link>
          </li>
          <li id={current === "/restaurantsSearch" ? "current" : ""}>
            <Link to="/restaurantsSearch">Pretraga</Link>
          </li>

          {!isAuthenticated ? (
            <>
              <li id={current === "/register" ? "current" : ""}>
                <Link to="/register">Registruj se</Link>
              </li>
              <li id={current === "/login" ? "current" : ""}>
                <Link to="/login">Prijavite se</Link>
              </li>
            </>
          ) : (
            <>
              {roles.includes("Administrator") && (
                <>
                  <li id={current === "/admin" ? "current" : ""}>
                    <Link to="/admin">Admin Panel</Link>
                  </li>
                  <li id={current === "/restaurantsAdmin" ? "current" : ""}>
                    <Link to="/restaurantsAdmin">Restorani</Link>
                  </li>
                  <li id={current === "/createRestaurant" ? "current" : ""}>
                    <Link to="/createRestaurant">Kreiraj</Link>
                  </li>
                </>
              )}

              {roles.includes("Owner") && (
                <li id={current === "/restaurantsOwner" ? "current" : ""}>
                  <Link to="/restaurantsOwner">Moji Restorani</Link>
                </li>
              )}

              <li>
                <Link to="/login" onClick={handleLogout}>
                  Odjavite se
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
