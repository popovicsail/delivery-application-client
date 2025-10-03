import React, { useState, useEffect } from "react";
import "../styles/main.scss";
import * as userService from "../services/user.services.tsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { set } from "react-hook-form";

export const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const valid =
      username.trim().length > 2 &&
      password.length >= 8 &&
      password === confirmPassword &&
      email.trim().length > 5 &&
      firstName.trim().length > 1 &&
      lastName.trim().length > 1;

    setIsValid(valid);
    setFeedback(
      valid
        ? "Podaci su validni. Možete nastaviti."
        : "Molimo vas da ispravno popunite sva polja."
    );
  }, [username, password, confirmPassword, email, firstName, lastName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
  
    const payload = {
      userName: username,
      password,
      email,
      firstName,
      lastName,
    };
  
    try {
      const response = await userService.createUser(payload);
  

      const token = response?.data?.token;
      if (token) {
        sessionStorage.setItem("token", token);
        navigate("/home");
      } else {
        setErrors(["Registracija je prošla, ali token nije vraćen."]);
      }
    } catch (error) {
      const backendErrors = error?.response?.data;
      if (Array.isArray(backendErrors)) {
        const messages = backendErrors.map((err) => err.description || err.message || "Greška u registraciji.");
        setErrors(messages);
        setIsValid(false);
        setFeedback(isValid);
      } else {
        setErrors([error.message || "Došlo je do greške."]);
      }
      console.error("Create error:", error);
    }
  };
  

  return (
    <form className="formaDodaj" onSubmit={handleSubmit}>
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
        <input
          type="email"
          name="email"
          placeholder="Email adresa"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          name="firstName"
          placeholder="Ime"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Prezime"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
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

      <div
        id="form-feedback"
        style={{
          marginTop: "1rem",
          fontWeight: "bold",
          color: isValid ? "green" : "red",
        }}
      >
        {feedback}
      </div>

      {errors.length > 0 && (
        <div
          style={{
            marginTop: "1rem",
            color: "red",
            fontWeight: "bold",
          }}
        >
          <h4>Greške:</h4>
          <ul>
            {errors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};
