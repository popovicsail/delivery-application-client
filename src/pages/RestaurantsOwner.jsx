import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getMyRestaurants, deleteRestaurant, getImage } from "../services/restaurant.services.tsx"
import "../styles/main.scss";

const RestaurantsOwner = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

    const loadRestaurants = async () => {
      try {
        setLoading(true);
        const data = await getMyRestaurants();
        setRestaurants(data || []);
        setError('');
      } catch (error) {
        console.error('Error:', error);
        setError('Greska pri ucitavanju restorana.');
      }
      setLoading(false);
    };
  
    const handleDelete = async (id) => {
      if (!window.confirm("Da li ste sigurni da zelite da uklonite restoran?")) {
        return;
      }
      try {
        setLoading(true);
        const response = await deleteRestaurant(id);
        setError('');
        setRefreshKey((prev) => prev + 1);
        alert('Uspesno ste uklonili restoran');
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            setError('Ne postoji restoran sa ovim id-em.');
          } else if (error.response.status === 500) {
            setError('Greska na serveru. Pokusajte kasnije.');
          } else {
            setError(`Greska: ${error.response.status}`);
          }
        } else if (error.request) {
          setError('Nema odgovora sa servera.');
        } else {
          setError('Doslo je do greske.');
        }
        console.error('Greska:', error.message);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      loadRestaurants();
    }, [refreshKey]);

    function getWeekendTitle(workSchedule) {
      if (workSchedule.saturday && workSchedule.sunday) {
        return "Vikendom"
      } else if (workSchedule.saturday && !workSchedule.sunday) {
        return "Subotom"
      } else if (!workSchedule.saturday && workSchedule.sunday) {
        return "Nedeljom"
      } else {
        return "Vikendom"
      }
    }

    function getWeekendTime(workSchedule) {
      if (workSchedule.saturday || workSchedule.sunday) {
        return workSchedule.weekendStart.slice(0, 5) + " - " + workSchedule.weekendEnd.slice(0, 5) + "h"
      } else {
        return "Zatvoreno"
      }
    }

  return(
    <div id="restaurants-owner-container">
      <h3>Moji restorani</h3>
      <div id="cards-container">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-card">
            <section className="section-row">
              <img src={restaurant.image || "https://fastly.picsum.photos/id/635/450/300.jpg?hmac=uihVhPLLXIWpSq1VatqfJ0Q1CuPP-2CQG54M43Da6do"} alt={restaurant.name}/>
              <section>
                <h4>Radnim danima</h4>
                <p>{restaurant.baseWorkSched.workDayStart.slice(0, 5) + " - " + restaurant.baseWorkSched.workDayEnd.slice(0, 5)}h</p>
                <h4>{getWeekendTitle(restaurant.baseWorkSched)}</h4>
                <p>{getWeekendTime(restaurant.baseWorkSched)}</p>
              </section>
            </section>
            <h3 className="restaurant-name">{restaurant.name}</h3>
            <section className="section-row r-card-contact-row" style={{textDecoration: "underline"}}>
              <p className="address">📍Adresa: {restaurant.address.streetAndNumber + ", " + restaurant.address.city}</p>
              <p className="phone">☎️Telefon: {restaurant.phoneNumber}</p>
            </section>
            <p className="card-desc">{restaurant.description}</p>
            <section className="section-row button-group">
              <button onClick={() => navigate("/restaurantForm/" + restaurant.id)}>Izmeni</button>
              <button onClick={() => handleDelete(restaurant.id)}>Ukloni</button>
            </section>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantsOwner;