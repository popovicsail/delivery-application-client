import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./styles/main.scss";
import Header from "./components/Header.jsx";
import Home from "./components/Home.jsx";
import { RegisterForm } from "./components/RegisterForm.jsx";
import { LoginForm } from "./components/LoginForm.jsx";

const App = () => {
  return(
    <div id="main-container">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element = {<RegisterForm />} />
          <Route path="/login" element = {<LoginForm />} />
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
