import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { registerWorker, updateWorker, getOneWorker, getMyRestaurants } from "../services/restaurant.services.jsx"
import "../styles/main.scss";

const WorkerForm = ( {worker, setComponent, component, setRefreshKey} ) => {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [repeatedPass ,setRepeatedPass] = useState('');
  const [password, setPassword] = useState('');
  const { register, handleSubmit, formState, reset} = useForm({
    defaultValues: {
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (worker && worker.id) {
        const response = await updateWorker(data, worker.id);
        alert('Uspesno ste izmenili radnika');
      }
      else {
        const response = await registerWorker(data);
        alert('Uspesno ste registrovali radnika');
      }
      setError('');
      setRefreshKey((prev) => prev + 1);
      setComponent("workers");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('Niste uneli validne podatke.');
        } else if (error.response.status === 404) {
          setError('Ne postoji radnik sa tim id-em. Ili pogresna ruta.');
        } else if (error.response.status === 401) {
          setError("Ova stranica je rezervisana samo za Vlasnike.");
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
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await getMyRestaurants();
        setRestaurants(data || []);
        setError("");
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            setError("Pogresna ruta.");
          } else if (error.response.status === 401) {
            setError("Ova stranica je rezervisana samo za Vlasnike.");
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
    
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (worker && restaurants && restaurants.length > 0) {
      reset(worker);
    }
  }, [restaurants, worker, reset]);

  return(
    <div className="over-layer-base" onClick={(e) => setComponent("workers")}>
      <div className="restaurants-form-container" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit(onSubmit)} style={{gap: '0.5rem'}}>
          <h3>{component == "register" ? "Registracija radnika" : component == "edit" ? "Izmena radnika" : ""}</h3>

          <section className="section-row-start" style={{justifyContent: 'space-between', width: '100%', alignItems: 'start'}}>
            <section style={{display: "flex", flexDirection: "column"}}>
            <label>Ime</label>
            <input type="text" {...register("firstName", {required: 'Ovo polje je obavezno' })} style={{width: "9rem"}}/>
            {formState.errors.firstName && <p style={{ color: 'red', margin: 0 }}>{formState.errors.firstName.message}</p>}
            </section>

            <section style={{display: "flex", flexDirection: "column"}}>
            <label>Prezime</label>
            <input type="text" {...register("lastName", {required: 'Ovo polje je obavezno' })} style={{width: "9rem"}}/>
            {formState.errors.lastName && <p style={{ color: 'red', margin: 0 }}>{formState.errors.lastName.message}</p>}
            </section>
          </section>

          <label>Korisnicko ime(username)</label>
          <input type="text" {...register("userName", {required: 'Ovo polje je obavezno' })}/>
          {formState.errors.userName && <p style={{ color: 'red', margin: 0 }}>{formState.errors.userName.message}</p>}

      
          <label>Email</label>
          <input type="email" {...register("email", {
            required: "Ovo polje je obavezno",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Unesite ispravnu email adresu",
            },
          })}
          />
          {formState.errors.email && <p style={{ color: 'red', margin: 0 }}>{formState.errors.email.message}</p>}

          <label>Telefon</label>
          <input type="tel" {...register("phoneNumber", {required: 'Ovo polje je obavezno' })} />
          {formState.errors.phoneNumber && <p style={{ color: 'red', margin: 0 }}>{formState.errors.phoneNumber.message}</p>}

          <section className="section-row-start" style={{justifyContent: 'space-between', width: '100%', alignItems: 'start'}}>
            <section style={{display: "flex", flexDirection: "column"}}>
              <label>Lozinka</label>
              <input type="password" {...register("password", {required: 'Ovo polje je obavezno', onChange: (e) => setPassword(e.target.value) })} style={{width: "9rem"}}/>
              {formState.errors.password && <p style={{ color: 'red', margin: 0 }}>{formState.errors.password.message}</p>}
            </section>

            <section style={{display: "flex", flexDirection: "column"}}>
              <label>Potvrda lozinke</label>
              <input type="password" onChange={(e) => setRepeatedPass(e.target.value)} style={{width: "9rem"}}/>
              {repeatedPass != "" && repeatedPass != password && <p style={{ color: 'red', margin: 0 }}>Ne podudara se lozinka</p>}
            </section>
          </section>
        
          <label>Posao/Zaduzenje</label>
          <select id="restaurantId" {...register("job", { required: 'Niste izabrali posao/zaduzenje' })}>
            <option value="">- Izaberi -</option>
            <option value="Cook">Cook</option>
            <option value="Chef">Chef</option>
            <option value="Waiter">Waiter</option>
          </select>
          {formState.errors.job && <p style={{ color: 'red', margin: 0 }}>{formState.errors.job.message}</p>}

          <label>Restoran</label>
          <select id="restaurantId" {...register("restaurantId", { required: 'Niste izabrali vlasnika' })}>
            <option value="">Izaberite restoran</option>
            {restaurants.map(r => (
              <option key={r.id} value={r.id}>
              {r.name}
              </option>
            ))}
          </select>
          {formState.errors.restaurantId && <p style={{ color: 'red', margin: 0 }}>{formState.errors.restaurantId.message}</p>}

          {loading && <div id="loadingSpinner" className="spinner"></div>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button className="buttons-form" type="submit">{component == "register" ? "Registruj" : component == "edit" ? "Izmeni" : ""}</button>
          
        </form>
      </div>
    </div>
  );
}

export default WorkerForm;