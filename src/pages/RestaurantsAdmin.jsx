import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from 'react-router-dom';
import { getRestaurants, deleteRestaurant } from "../services/restaurant.services.jsx"
import "../styles/main.scss";

const RestaurantsAdmin = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const data = await getRestaurants();
      setRestaurants(data || []);
      setError("");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError("Vlasnik sa ovim id-em ne poseduje nijedan restoran.");
        } else if (error.response.status === 401) {
          setError("Ova stranica je rezervisana samo za vlasnike restorana.");
        } else if (error.response.status === 500) {
          setError("Greska na serveru. Pokusajte kasnije.");
        } else {
          setError(`Greska: ${error.response.status}`);
        }
      } else if (error.request) {
        setError("Nema odgovora sa servera.");
      } else {
        setError("Doslo je do greske.");
      }
      console.error("Greska:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Da li ste sigurni da zelite da obrisete restoran "${name}"?`)) {
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
            setError('Nije pronadjen nijedan restoran.');
          } else if (error.response.status === 401) {
            setError('Ova stranica je rezervisana samo za administratore.');
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

  const handleEdit = (id) => {
    navigate("/restaurantForm/" + id)
  }

  useEffect(() => {
    loadRestaurants();
  }, [refreshKey]);

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (restaurants.length === 0) return <h4 style={{ textAlign: 'center', position: 'absolute', left:
  '50%', top: '50%', transform: 'translate(-50%, -50%)'
   }}>Nema restorana za prikaz.</h4>;
  return(
    <div id="restaurants-admin-container">
      <h3>Administrativni prikaz restorana</h3>
      <div>
      <button id="to-create-restaurant" className="buttons create-btn" type="button" onClick={(e) => navigate("/createRestaurant")}>Kreiraj restoran</button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Naziv</th>
            <th>Opis</th>
            <th>Telefon</th>
            <th>Adresa</th>
            <th>Vlasnik</th>
            <th style={{border: 0}}></th>
            <th style={{border: 0}}></th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.description}</td>
              <td>{r.phoneNumber}</td>
              <td>{r.address.streetAndNumber}, {r.address.city}</td>
              <td>{r.owner.firstName + " " + r.owner.lastName}</td>
              <td><button className="delete-btn buttons" onClick={() => handleDelete(r.id, r.name)}>Delete</button></td>
              <td><button className="edit-btn buttons" onClick={() => handleEdit(r.id)}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default RestaurantsAdmin;