import React, { useState, useEffect } from "react";
import "../styles/main.scss";
import { Link, useNavigate } from "react-router-dom";
import { login, googleLogin } from "../services/auth.services"
import { getMyAllergens, getProfile } from "../services/user.services"
import { GoogleLogin } from '@react-oauth/google';

export const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      await login(username, password)
      await handleSuccessfulLogin();
    }
    catch (error) {
      setLoading(false);
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 400) {
          alert("Neispravno korisnično ime ili lozinka.");
        } else {
          alert(`ERROR: ${error.message || "Nešto nije u redu, pokušajte ponovo"}`);
        }
      }
    }
  }


  const handleGoogleSubmit = async (response) => {
    setLoading(true);
    console.log(response.credential)

    try {
      const reponse = await googleLogin(response.credential)

      await handleSuccessfulLogin();

    } catch (error) {
      setLoading(false);
      alert(`ERROR: ${error.message || "Nešto nije u redu, pokušajte ponovo"}`);
    }
  }

  const handleSuccessfulLogin = async () => {
    try {
      const user = await getProfile();
      sessionStorage.setItem("myProfile", JSON.stringify(user))

      if (user.roles && user.roles.includes('Customer')) {
        const allergens = await getMyAllergens();
        if (allergens && allergens.length > 0) {
          sessionStorage.setItem("myAllergens", JSON.stringify(allergens))
        }
      }

      setLoading(false);
      alert(`Dobrodošao, ${user.userName}!`);
      navigate("/home");
      window.location.reload();

    } catch (error) {
      setLoading(false);
      alert(`Greška pri preuzimanju profila: ${error.message}`);
      console.error("Profile/Allergen error:", error);
    }

  }


  if (loading) {
    return <div id="loadingSpinner" className="spinner"></div>;
  }

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

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <Link to="/forgot-password">Forgot your password?</Link>
      </div>

      <section className="form-section" style={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          onSuccess={handleGoogleSubmit}
          useOneTap={false}
          theme="outline"
          shape="rectangular"
          text="signin_with"
        />
      </section>
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
}
