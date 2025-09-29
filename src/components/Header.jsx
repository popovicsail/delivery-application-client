import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/main.scss";

const Header = () => {
  const location = useLocation();
  const current = location.pathname;

  return (
    <header className="header">
      <h1>Dobrodošli — Gozba na Klik</h1>
      <nav>
        <ul className="nav-list">
          <li id={current === "/home" ? "current" : ""}><Link to="/home">Početna</Link></li>
          <li id={current === "/register" ? "current" : ""}><Link  to="/register">Registruj se</Link></li>
          <li id={current === "/login" ? "current" : ""}><Link to="/login">Prijavite se</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
