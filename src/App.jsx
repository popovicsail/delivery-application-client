import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./styles/main.scss";
import Header from "./components/Header.jsx";
import Home from "./components/Home.jsx";
import RestaurantsAdmin from "./pages/RestaurantsAdmin.jsx";
import CreateRestaurant from "./pages/CreateRestaurant.jsx";
import { RegisterForm } from "./components/RegisterForm.jsx";
import { LoginForm } from "./components/LoginForm.jsx";
import AdminPage from "./components/adminPage/AdminPanelRender.jsx";
import { UserForm } from "./components/adminPage/AdminUserCeationForm.jsx";
import ProfilePage from "../src/components/userControlPanel/UserControlRender.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import RestaurantsSearch from "./pages/RestaurantsSearch.jsx";
import DishesSearch from "./pages/DishesSearch.jsx";
import FeedbackSurvey from "./pages/Feedback/FeedbackSurvey.jsx";
import CartContainer from "./components/shoppingCart/CartContainer.jsx";
import OwnerWrapper from "./pages/Owner/OwnerWrapper.jsx";
import RestaurantOverview from "./pages/RestaurantOverview.jsx";
import RestaurantWrapper from "./pages/Owner/RestaurantWrapper.jsx";
import RestaurantForm from "./pages/Owner/RestaurantForm.jsx";
import RestaurantOfferManage from "./pages/Owner/RestaurantOfferManage.jsx";

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
          <Route path="/admin/restaurants" element = {<RestaurantsAdmin />}/>
          <Route path="/admin/restaurants/create" element = {<CreateRestaurant />}/>
          <Route path="/admin/restaurants/:restaurantId/edit" element = {<RestaurantForm />}/>
          <Route path="/controlPanel" element ={<ProfilePage />} />
          <Route path="/owner" element = {<OwnerWrapper />}/>
          <Route path="/owner/restaurants/:restaurantId" element = {<RestaurantWrapper />}/>
          <Route path="/owner/restaurants/:restaurantId/offers/:offerId/edit" element = {<RestaurantOfferManage />}/>
          <Route path="/owner/restaurants/:restaurantId/offers/create" element = {<RestaurantOfferManage />}/>
          <Route path="/restaurants/:restaurantId/overview" element = {<RestaurantOverview />}/>
          <Route path="/restaurants/search" element = {<RestaurantsSearch />}/>
          <Route path="/dishes/search" element = {<DishesSearch />}/>
          <Route path="/cart" element={<CartContainer/>}/>
          <Route path="/menuId/:menuId" element ={<MenuPage />} />
          <Route path="/survey" element ={<FeedbackSurvey />} />
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
