import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createRestaurant } from "../services/restaurant.services.jsx";
import { getAllOwners } from "../services/user.services.jsx";
import "../styles/main.scss";
import "../components/widgets/MapWidget/mapModal.scss";
import MapModal from "../components/widgets/MapWidget/MapModal.jsx"; // ✅ import modala

const RestaurantForm = () => {
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [showMapModal, setShowMapModal] = useState(false); // ✅ state za modal

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      owners: ""
    },
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const newRestaurant = {
      name: data.name,
      ownerId: data.ownerId,
      latitude: location.latitude,
      longitude: location.longitude
    };

    try {
      setLoading(true);
      await createRestaurant(newRestaurant);
      setError('');
      alert('Uspešno ste dodali restoran');
      navigate('/admin/restaurants');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('Niste uneli validne podatke.');
        } else if (error.response.status === 404) {
          setError('Pogrešna ruta.');
        } else if (error.response.status === 401) {
          setError("Ova stranica je rezervisana samo za Administratore.");
        } else if (error.response.status === 500) {
          setError('Greška na serveru. Pokušajte kasnije.');
        } else {
          setError(`Greška: ${error.response.status}`);
        }
      } else if (error.request) {
        setError('Nema odgovora sa servera.');
      } else {
        setError('Došlo je do greške.');
      }
      console.error('Greška:', error.message);
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
        setError("");
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            setError("Pogrešna ruta.");
          } else if (error.response.status === 401) {
            setError("Ova stranica je rezervisana samo za Administratore.");
          } else if (error.response.status === 500) {
            setError("Greška na serveru. Pokušajte kasnije.");
          } else {
            setError(`Greška: ${error.response.status}`);
          }
        } else if (error.request) {
          setError("Nema odgovora sa servera.");
        } else {
          setError("Došlo je do greške.");
        }
        console.error("Greška:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOwners();
  }, []);

  return (
    <div className="restaurants-form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Forma za dodavanje restorana</h3>

        <label>Naziv</label>
        <input type="text" {...register("name", { required: 'Ovo polje je obavezno' })} />
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

        <label>Lokacija restorana</label>
        <button type="button" className="buttons-form" onClick={() => setShowMapModal(true)}>
          Odaberi lokaciju na mapi
        </button>

        {location.latitude && location.longitude && (
          <p className="address-preview">
            Izabrana lokacija: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
          </p>
        )}

        {loading && <div id="loadingSpinner" className="spinner"></div>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className="buttons-form" type="submit">Kreiraj</button>
      </form>

      {/* ✅ Modal za mapu */}
      <MapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        onLocationSelected={(coords) => {
          setLocation(coords);
        }}
      />
    </div>
  );
};

export default RestaurantForm;
