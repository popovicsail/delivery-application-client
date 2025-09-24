import React from "react";
import { Link } from "react-router-dom";
import "../styles/main.scss";

const Header = () => {
  return (
    <header className="header">
      <h1>Dobrodošli — Gozba na Klik</h1>
      <nav>
        <ul className="nav-list">
          <li><Link to="/">Početna</Link></li>
          <li><Link to="/register">Registruj se</Link></li>
          <li><Link to="/login">Prijavite se</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
