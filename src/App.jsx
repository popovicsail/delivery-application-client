import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./styles/main.scss";
import Header from "./components/Header.jsx";
import Home from "./components/Home.jsx";
import RestaurantsAdmin from "./pages/RestaurantsAdmin.jsx";
import RestaurantForm from "./pages/RestaurantForm.jsx";
import CreateRestaurant from "./pages/CreateRestaurant.jsx";
import { RegisterForm } from "./components/RegisterForm.jsx";
import { LoginForm } from "./components/LoginForm.jsx";
import DishesPage from "./pages/Dishes/DishesPage.jsx";

const App = () => {
  return(
    <div id="main-container">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element = {<RegisterForm />} />
          <Route path="/login" element = {<LoginForm />} />
          <Route path="/restaurantsAdmin" element = {<RestaurantsAdmin />}/>
          <Route path="/restaurantForm/:id" element = {<RestaurantForm />}/>
          <Route path="/createRestaurant" element = {<CreateRestaurant />}/>
          <Route path="/dishes" element ={<DishesPage />} />
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
