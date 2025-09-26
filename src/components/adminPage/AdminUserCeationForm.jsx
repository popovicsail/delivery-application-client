import React, { useState, useEffect } from "react";
import "../../styles/main.scss";
import { useNavigate } from "react-router-dom";

export const UserForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Kurir");
  const [feedback, setFeedback] = useState("");
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const valid =
      username.trim().length > 2 &&
      password.length >= 8 &&
      password === confirmPassword &&
      (role === "Kurir" || role === "Vlasnik");

    setIsValid(valid);
    setFeedback(
      valid
        ? "Podaci su validni. Možete nastaviti."
        : "Molimo vas da ispravno popunite sva polja."
    );
  }, [username, password, confirmPassword, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await userService.createUser({ username, password, role });
      alert("Uspešna registracija!");
      navigate("/home");
    } catch (error) {
      const err = error || {};
      alert(`Greška: ${err.message || "Nešto nije u redu."}`);
      console.error("Create error:", err);
    }
  };

  return (
    <form className="adminUserCreate" onSubmit={handleSubmit}>
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
        <h2>🧩 Uloga korisnika</h2>
        <select
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="Kurir">Kurir</option>
          <option value="Vlasnik">Vlasnik</option>
        </select>
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
    </form>
  );
};
