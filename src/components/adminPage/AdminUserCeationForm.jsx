import React, { useState, useEffect } from "react";
import "../../styles/main.scss";
import * as userService from "../../services/user.services.jsx";
import { useNavigate } from "react-router-dom";

export const UserForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const valid =
      username.trim().length > 2 &&
      password.length >= 8 &&
      password === confirmPassword &&
      email.trim().length > 5 &&
      firstName.trim().length > 1 &&
      lastName.trim().length > 1 &&
      (role === "Courier" || role === "Owner");

    setIsValid(valid);
    setFeedback(
      valid
        ? "Podaci su validni. Možete nastaviti."
        : "Molimo vas da ispravno popunite sva polja."
    );
  }, [username, password, confirmPassword, email, firstName, lastName, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const payload = {
      userName: username,
      password,
      email,
      firstName,
      lastName,
      role,
    };

    try {
      setLoading(true);
      if (role === "Courier") {
        await userService.createCourier(payload);
      } else if (role === "Owner") {
        await userService.createOwner(payload);
      }
      alert("Uspešna registracija!");
      navigate("/admin");
    } catch (error) {
      const backendErrors = error?.response?.data;
      if (Array.isArray(backendErrors)) {
        const messages = backendErrors.map((err) => err.description || err.message || "Greška u registraciji.");
        setErrors(messages);
        setIsValid(false);
        setFeedback("Greška u unosu.");
      } else {
        setErrors([error.message || "Došlo je do greške."]);
      }
      console.error("Create error:", error);
    }finally {
      setLoading(false);
    }
  };

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
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
        <h2>🧩 Uloga korisnika</h2>
        <select
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="Courier">Courier</option>
          <option value="Owner">Owner</option>
        </select>
      </section>

      <section className="form-section">
        <h2>✅ Pregled i potvrda</h2>
        <button type="submit" disabled={!isValid}>
          Dodaj korisnika
        </button>
        <button onClick={() => navigate("/admin")} type="button">
          Otkaži
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
