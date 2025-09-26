import React from "react";
import { Link } from "react-router-dom";
import "../styles/main.scss";

const Header = () => {
  return (
    <header className="header">
      <h1>Dobrodošli — Gozba na Klik</h1>
      <nav>
        <ul className="nav-list">
          <li className="pocetna" style={{ display: "none" }}>
            <Link to="/">Početna</Link></li>
            
          <li className="usersControlPanel" style={{ display: "none" }}>
            <Link to="/controlPanel">Profil</Link>
          </li>

          <li className="register" style={{ display: "block" }}>
            <Link to="/register">Registruj se</Link>
            </li>

          <li className="logIn"   style={{ display: "block" }}>
            <Link to="/login">Prijavite se</Link>
            </li>

          <li 
          className="logOut" 
          style={{ display: "none" }}
          onClick={showButton}> 
          <Link to="/login">Izlogujte se</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

function showButton() {
  const buttonRegister = document.querySelector('.register');
  const buttonLogin = document.querySelector('.logIn');
  const buttonLogout = document.querySelector('.logOut');
  const buttonUserControlPanel = document.querySelector('.usersControlPanel');
  const buttonHome = document.querySelector('.pocetna');

  if (buttonHome) {
    buttonHome.style.display = 'none';
  }
  if (buttonUserControlPanel) {
    buttonUserControlPanel.style.display = 'none';
  }
  if (buttonLogout) {
    buttonLogout.style.display = 'none';
  }
  if (buttonRegister) {
    buttonRegister.style.display = 'block';
  }
  if (buttonLogin) {
    buttonLogin.style.display = 'block';
  }
}

export default Header;
