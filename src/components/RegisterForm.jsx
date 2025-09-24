import React from "react";
import "../styles/main.scss";
import { useState, useEffect } from "react";
import { userService } from "../services/user.services.tsx";
import { useNavigate } from "react-router-dom";

export const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const valid =
      username.trim().length > 2 &&
      password.length >= 8 &&
      password === confirmPassword;

    setIsValid(valid);
    setFeedback(
      valid
        ? "Podaci su validni. Možete nastaviti."
        : "Molimo vas da ispravno popunite sva polja."
    );
  }, [username, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await userService.createUser({ username, password });
      alert("Uspešna registracija!");
      useNavigate("/home")
    } catch (error) {
      const err = error || {};
      alert(`Greška: ${err.message || "Nešto nije u redu."}`);
      console.error("Create error:", err);
    }
  };

  return (
    <form className="formaDodaj">
      <section className="form-section">
        <h2>👤 Lični podaci</h2>
        <input
          type="text"
          name="username"
          placeholder="Korisničko ime"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </section>

      <section className="form-section">
        <h2>🔒 Bezbednost</h2>
        <input
          type="password"
          name="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Potvrdi lozinku"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </section>

      <section className="form-section">
        <h2>✅ Pregled i potvrda</h2>
        <button type="submit" disabled={!isValid}>
          Registruj se
        </button>
      </section>

      <div id="form-feedback" style={{ marginTop: "1rem", fontWeight: "bold", color: isValid ? "green" : "red" }}>
        {feedback}
      </div>
    </form>
  );
};
