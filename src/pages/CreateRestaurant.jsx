import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm} from 'react-hook-form';
import { createRestaurant } from "../services/restaurant.services.jsx"
import { getAllOwners } from "../services/user.services.jsx"
import "../styles/main.scss";

const RestaurantForm = () => {
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState} = useForm({
    defaultValues: {
      owners: ""
    },
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const newRestaurant = {name: data.name, ownerId: data.ownerId };
    try {
      setLoading(true);
      const response = await createRestaurant(newRestaurant);
      setError('');
      alert('Uspesno ste dodali restoran');
      navigate('/restaurantsAdmin');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('Niste uneli validne podatke.');
        } else if (error.response.status === 404) {
          setError('Ne postoji vlasnik sa ovim id-em.');
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
    const fetchOwners = async () => {
      try {
        setLoading(true);
        const data = await getAllOwners();
        setOwners(data || []);
        setError('');
      } catch (err) {
        setError('Greska pri ucitavanju vlasnika.');
        console.error('Greska:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOwners();
  }, []);

  return(
    <div className="restaurants-form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Forma za dodavanje restorana</h3>
        <label>Naziv</label>
        <input type="text" {...register("name", {required: 'Ovo polje je obavezno' })} />
        {formState.errors.name && <p style={{ color: 'red', margin: 0 }}>{formState.errors.name.message}</p>}
        <label>Owner</label>
        <select id="ownerId" {...register("ownerId", { required: 'Niste izabrali vlasnika' })}>
          <option value="">Izaberi vlasnika</option>
          {owners.map(owner => (
            <option key={owner.id} value={owner.id}>
            {owner.firstName} {owner.lastName}
            </option>
          ))}
        </select>
        {formState.errors.ownerId && <p style={{ color: 'red', margin: 0 }}>{formState.errors.ownerId.message}</p>}
        {loading && <div id="loadingSpinner" className="spinner"></div>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Kreiraj</button>
      </form>
    </div>
  );
}

export default RestaurantForm;