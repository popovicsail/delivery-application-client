import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./styles/main.scss";
import Header from "./components/Header.jsx";
import Home from "./components/Home.jsx";
import RestaurantsAdmin from "./pages/RestaurantsAdmin.jsx";
import RestaurantsOwner from "./pages/RestaurantsOwner.jsx";
import RestaurantForm from "./pages/RestaurantForm.jsx";
import CreateRestaurant from "./pages/CreateRestaurant.jsx";
import { RegisterForm } from "./components/RegisterForm.jsx";
import { LoginForm } from "./components/LoginForm.jsx";
import AdminPage from "./components/adminPage/AdminPanelRender.jsx";
import { UserForm } from "./components/adminPage/AdminUserCeationForm.jsx";
import ProfilePage from "../src/components/userControlPanel/UserControlRender.jsx";
import MenuPage from "./pages/Menus/MenuPage.jsx";
import RestaurantsSearch from "./pages/RestaurantsSearch.jsx";
import DishesSearch from "./pages/DishesSearch.jsx";

const App = () => {
  return(
    <div id="main-container">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element = {<RegisterForm />} />
          <Route path="/login" element = {<LoginForm />} />
          <Route path="/admin" element = {<AdminPage />} />
          <Route path="/adminCreate" element ={<UserForm />} />
          <Route path="/controlPanel" element ={<ProfilePage />} />
          <Route path="/restaurantsAdmin" element = {<RestaurantsAdmin />}/>
          <Route path="/restaurantsOwner" element = {<RestaurantsOwner />}/>
          <Route path="/restaurantForm/:id" element = {<RestaurantForm />}/>
          <Route path="/createRestaurant" element = {<CreateRestaurant />}/>
          <Route path="/restaurantsSearch" element = {<RestaurantsSearch />}/>
          <Route path="/DishesSearch" element = {<DishesSearch />}/>
          <Route path="/menuId/:menuId" element ={<MenuPage />} />
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
