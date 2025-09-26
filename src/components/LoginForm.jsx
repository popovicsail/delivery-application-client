import React, { useState, useEffect } from "react";
import "../styles/main.scss";
import { userService } from "../services/user.services";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth.services"

export const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const valid = username.trim().length > 2 && password.length >= 8;
    setIsValid(valid);
    setFeedback(
      valid
        ? "Podaci su validni. Možete se prijaviti."
        : "Molimo vas da unesete ispravno korisničko ime i lozinku."
    );
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const user = await login(username, password);
      alert(`Dobrodošao, ${user.username}!`);
      navigate("/admin")
      hideButton();
    } catch (error) {
      const err = error || {};
      alert(`Greška: ${err.message || "Nešto nije u redu."}`);
      console.error("Login error:", err);
    }
  };

  return (
    <form className="formaLogin" onSubmit={handleSubmit}>
      <section className="form-section">
        <h2>🔐 Prijava</h2>
        <input
          type="text"
          name="username"
          placeholder="Korisničko ime"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </section>

      <section className="form-section">
        <button type="submit" disabled={!isValid}>
          Prijavi se
        </button>
      </section>

      <div id="form-feedback" style={{ marginTop: "1rem", fontWeight: "bold", color: isValid ? "green" : "red" }}>
        {feedback}
      </div>
    </form>
  );




  function hideButton() {
    const buttonRegister = document.querySelector('.register');
    const buttonLogin = document.querySelector('.logIn');
    const buttonLogout = document.querySelector('.logOut');
    const buttonUserControlPanel = document.querySelector('.usersControlPanel');
    const buttonHome = document.querySelector('.pocetna');

    if (buttonHome) {
      buttonHome.style.display = 'block';
    }
    if (buttonUserControlPanel) {
      buttonUserControlPanel.style.display = 'block';
    }
    if (buttonLogout) {
      buttonLogout.style.display = 'block';
    }
    if (buttonRegister) {
      buttonRegister.style.display = 'none';
    }
    if (buttonLogin) {
      buttonLogin.style.display = 'none';
    }
  }
};
