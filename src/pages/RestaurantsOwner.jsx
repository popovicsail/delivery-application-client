import React, { useState, useEffect } from "react";
import { getMyRestaurants, deleteRestaurant } from "../services/restaurant.services.jsx"
import "../styles/main.scss";
import RestaurantCard from "../components/RestaurantCard.jsx";

const RestaurantsOwner = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

    const loadRestaurants = async () => {
      try {
        setLoading(true);
        const data = await getMyRestaurants();
        setRestaurants(data || []);
        setError('');
      } catch (error) {
         if (error.response) {
          if (error.response.status === 404) {
            setError('Vlasnik sa ovim id-em ne postoji ili ova ruta ne postoji.');
          } else if (error.response.status === 401) {
            setError('Ova stranica je rezervisana samo za vlasnike restorana.');
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


  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return(
    <div id="restaurants-owner-container">
      <h3>Moji restorani</h3>
      <div id="cards-container">
        {restaurants.map((r) => (
          <RestaurantCard key={r.id} isForOwner={true} handleDelete={handleDelete} restaurant={r}></RestaurantCard>
        ))}
      </div>
    </div>
  );
}

export default RestaurantsOwner;