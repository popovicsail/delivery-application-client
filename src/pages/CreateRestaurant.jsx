import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createRestaurant } from "../services/restaurant.services.jsx";
import { getAllOwners } from "../services/user.services.jsx";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import SearchControl from "../components/userControlPanel/SearchControl.jsx";
import "../styles/restaurantForm.scss";

// ✅ Custom marker ikona
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
});

const LocationPicker = ({ onLocationSelected }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelected({ latitude: lat, longitude: lng });
    },
  });

  return position ? <Marker position={position}></Marker> : null;
};

const RestaurantForm = () => {
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

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
        <MapContainer
          className="map-container"
          center={[45.2671, 19.8335]}
          zoom={13}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <LocationPicker onLocationSelected={setLocation} />
          <SearchControl className=".leaflet-control-geosearch" onLocationSelected={setLocation} />
        </MapContainer>

        {location.latitude && location.longitude && (
          <p className="address-preview">
            Izabrana lokacija: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
          </p>
        )}

        {loading && <div id="loadingSpinner" className="spinner"></div>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className="buttons-form" type="submit">Kreiraj</button>
      </form>
    </div>
  );
};

export default RestaurantForm;
