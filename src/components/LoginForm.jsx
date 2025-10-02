import React, { useState, useEffect } from "react";
import "../styles/main.scss";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth.services"
import { getProfile } from "../services/user.services"

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      setLoading(true);
      await login(username, password);
      const user = await getProfile();
      sessionStorage.setItem("myProfile", JSON.stringify({user}));
      setUsername(user.userName)
      setLoggedIn(true);
      setLoading(false);
      alert(`Dobrodošao, ${username}!`);
      navigate("/home");
    } catch (error) {
      const err = error || {};
      if (err.response) {
        if (err.response.status === 401) {
          alert("Neispravno korisničko ime ili lozinka.");
        }
        else {
          alert(`Greška: ${err.message || "Nešto nije u redu."}`);
          console.error("Login error:", err);
        }
      }
    } 
    finally {
        setLoading(false);
    }
  };

  return (
    <form className="formaLogin" onSubmit={handleSubmit}>
      <section className="form-section">
        <h2>🔐 Prijava</h2>
        {loading && <div id="loadingSpinner" className="spinner"></div>}
        <input
          type="text"
          name="username"
          placeholder="Korisničko ime"
          value={username}
          onChange={(e) => (setUsername(e.target.value))}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => (setPassword(e.target.value))}
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
};
