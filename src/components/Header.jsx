import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getProfile } from "../services/user.services.jsx";
import "../styles/main.scss";
import { logout } from "../services/auth.services.jsx";
import { toImageUrl } from "../services/imageUtils";

const Header = () => {
  const [roles, setRoles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [fullName, setFullName] = useState("");


  const location = useLocation();
  const current = location.pathname;
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;
  
    setIsAuthenticated(true);
  
    getProfile()
      .then((profile) => {
        const userRoles = profile.roles || [];
        setRoles(userRoles);
        setIsAdmin(userRoles.includes("Administrator"));

        const imageUrl = toImageUrl(
          profile.profilePictureBase64 ?? null,
          profile.profilePictureMimeType ?? "image/png"
        );
        setProfileImage(imageUrl);
        setFullName(`${profile.firstName} ${profile.lastName}`); // 👈 Dodaj ime
      })
      .catch((err) => {
        console.error("Greška pri učitavanju profila:", err);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setRoles([]);
      });
  }, []);

  const handleLogout = () => {
    logout();
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("myProfile");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setRoles([]);
    alert("Uspešno ste se odjavili.");
    navigate("/login");
  };

  return (
    <header className="header">
      <h1>Dobrodošli — Gozba na Klik</h1>
      {isAuthenticated && profileImage && (
        <Link to="/controlPanel" className="header-profile-box">
          <img
            src={profileImage}
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

          {!isAuthenticated && (
            <>
              <li id={current === "/register" ? "current" : ""}>
                <Link to="/register">Registruj se</Link>
              </li>
              <li id={current === "/login" ? "current" : ""}>
                <Link to="/login">Prijavite se</Link>
              </li>
            </>
          )}

          {isAuthenticated && (
            <>
              {isAdmin && (
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

              <li id={current === "/controlPanel" ? "current" : ""}>
                <Link to="/controlPanel">Kontrolna tabla</Link>
              </li>

              <li>
                <Link to="/login" onClick={handleLogout}>Odjavite se</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
