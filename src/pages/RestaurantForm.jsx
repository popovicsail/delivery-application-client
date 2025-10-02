import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getOneRestaurant, updateRestaurant } from "../services/restaurant.services.tsx"
import "../styles/main.scss";

const RestaurantForm = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const roles = sessionStorage.getItem("roles");
  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: {},
  });

  const onSubmit = async (data) => {
    const newRestaurant = { ...restaurant, ...data };
    try {
      setLoading(true);
      const response = await updateRestaurant(id, data);
      setError('');
      alert('Uspesno ste izmenili restoran');
      navigate('/restaurantsAdmin');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('Niste uneli validne podatke.');
        } else if (error.response.status === 404) {
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
    if (restaurant) {
      reset(restaurant);
    }
  }, [restaurant, reset]);

  useEffect(() => {
    if (id) {
      const fetchAndSet = async () => {
        setLoading(true);
        try {
          const data = await getOneRestaurant(id);
          setRestaurant(data);
          setError('');
        } catch (err) {
          setError('Greska pri ucitavanju restorana.');
        } finally {
          setLoading(false);
        }
      };

      fetchAndSet();
    } else {
      setLoading(false);
    }
  }, [id]);

  return(
    <div className="restaurants-form-container">
      
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Forma za dodavanje restorana</h3>
        {loading && <div id="loadingSpinner" className="spinner"></div>}
        {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
        <label>Naziv:</label>
        <input type="text" {...register("name", {required: 'Ovo polje je obavezno' })} />
        {formState.errors.name && <p style={{ color: 'red', margin: 0 }}>{formState.errors.name.message}</p>}
        <label>Opis:</label>
         <textarea {...register("description", {required: 'Ovo polje je obavezno' })} rows="4" cols="50"></textarea>
        {formState.errors.description && <p style={{ color: 'red', margin: 0 }}>{formState.errors.description.message}</p>}
        <label>Adresa:</label>
        <input type="text" {...register("address.streetAndNumber", {required: 'Ovo polje je obavezno' })} />
        {formState.errors.address?.streetAndNumber && <p style={{ color: 'red', margin: 0 }}>{formState.errors.address.streetAndNumber.message}</p>}
        <label>Grad:</label>
        <input type="text" {...register("address.city", {required: 'Ovo polje je obavezno' })} />
        {formState.errors.address?.city && <p style={{ color: 'red', margin: 0 }}>{formState.errors.address.city.message}</p>}
        <label>Postanski broj:</label>
        <input type="text" {...register("address.postalCode", {required: 'Ovo polje je obavezno' })} />
        {formState.errors.address?.postalCode && <p style={{ color: 'red', margin: 0 }}>{formState.errors.address.postalCode.message}</p>}
        <label>Telefon:</label>
        <input type="phone" {...register("phoneNumber", {required: 'Ovo polje je obavezno' })} />
        {formState.errors.phoneNumber && <p style={{ color: 'red', margin: 0 }}>{formState.errors.phoneNumber.message}</p>}
        <button type="submit">Potvrdi izmenu</button>
      </form>
    </div>
  );
}

export default RestaurantForm;