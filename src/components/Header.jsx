import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/main.scss";
import { getProfile } from "../services/user.services.tsx";
import { logout } from "../services/auth.services.tsx";

const Header = () => {
  const location = useLocation();
  const current = location.pathname;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    setIsAuthenticated(true);

    getProfile()
      .then((profile) => {
        const roles = profile.roles || [];
        if (roles.includes("Administrator")) {
          setIsAdmin(true);
        }
      })
      .catch((err) => {
        console.error("Greška pri učitavanju profila:", err);
        setIsAuthenticated(false);
        setIsAdmin(false);
      });
  }, []);

  const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate("/login");
    };

    return <Link onClick={handleLogout} to="/login">Odjavite se</Link>;
  };

  return (
    <header className="header">
      <h1>Dobrodošli — Gozba na Klik</h1>
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
                <li id={current === "/admin" ? "current" : ""}>
                  <Link to="/admin">Admin Panel</Link>
                </li>
              )}
              <li id={current === "/controlPanel" ? "current" : ""}>
                <Link to="/controlPanel">Kontrolna tabla</Link>
              </li>
              <li>
                <LogoutButton />
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
