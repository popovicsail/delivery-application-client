import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { getOneRestaurant, updateRestaurant } from "../services/restaurant.services.jsx"
import { dishService } from "../services/dishes.services.jsx";
import "../styles/main.scss";

const RestaurantForm = () => {
  const { id } = useParams();
  const [menuId, setMenuId ]= useState("0");
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const profile = JSON.parse(sessionStorage.getItem("myProfile"));
  const roles = profile ? profile.user.roles : [];
  const { register, handleSubmit, formState, reset, control, watch } = useForm({
    defaultValues: {
    name: '',
    description: '',
    phoneNumber: '',
    address: { streetAndNumber: '', city: '', postalCode: '' },
    baseWorkSched: roles.includes("Owner") ? { saturday: false, sunday: false, weekendStart: '', weekendEnd: '', workDayStart: '', workDayEnd: '' } : null,
    file: null
  }
});

  const isCheckedOne = roles.includes("Owner") ? watch("baseWorkSched.saturday") : false;
  const isCheckedTwo = roles.includes("Owner") ? watch("baseWorkSched.sunday") : false;

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("Id", id);
    formData.append("Name", data.name);
    formData.append("Address.StreetAndNumber", data.address.streetAndNumber);
    formData.append("Address.City", data.address.city);
    formData.append("Address.PostalCode", data.address.postalCode);
    formData.append("Description", data.description);
    formData.append("PhoneNumber", data.phoneNumber);
    if (roles.includes("Owner")) {
      formData.append("BaseWorkSched.WorkDayStart", data.baseWorkSched.workDayStart);
      formData.append("BaseWorkSched.WorkDayEnd", data.baseWorkSched.workDayEnd);
      if (isCheckedOne || isCheckedTwo) {
        formData.append("BaseWorkSched.WeekendStart",data.baseWorkSched.weekendStart);
        formData.append("BaseWorkSched.WeekendEnd", data.baseWorkSched.weekendEnd);
        if (isCheckedOne) {
          formData.append("BaseWorkSched.Saturday", true);
        }
        if (isCheckedTwo) {
          formData.append("BaseWorkSched.Sunday", true);
        }
      }
      else {
        formData.append("BaseWorkSched.WeekendStart", "00:00:00");
        formData.append("BaseWorkSched.WeekendEnd", "00:00:00");
      }
    }
    if (data.file) {
      formData.append("file", data.file);
    }
    try {
      setLoading(true);
      const response = await updateRestaurant(id, formData);
      setError('');
      alert('Uspesno ste izmenili restoran');
      navigate(-1);
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

  const onMenuClick = () => {
    sessionStorage.setItem('permitRequest', true);
    navigate("/menuId/" + menuId)
  }

  useEffect(() => {
    if (restaurant) {
      reset(restaurant);
    }
  }, [restaurant, reset]);

  useEffect(() => {
    if (id) {
      const fetchAndSet = async () => {
        try {
          setLoading(true);
          const data = await getOneRestaurant(id);
          setRestaurant(data);
          setError("");
        } catch (error) {
          if (error.response) {
            if (error.response.status === 404) {
              setError("Restoran sa ovim ID-em ne postoji ili je pogresna ruta.");
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

      const fetchMenu = async () => {
        setLoading(true);
        try {
          const data = await dishService.getRestaurantMenu(id);
          setMenuId(data.id);
          setError("");
        } catch (error) {
          if (error.response) {
            if (error.response.status === 400) {
              setError("Niste uneli validne podatke.");
            } else if (error.response.status === 404) {
              setError("Restoran sa ovim ID-em ne postoji ili je pogresna ruta.");
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

      fetchAndSet();
      if (roles.includes("Owner")) {
        fetchMenu();
      }
    } else {
      setLoading(false);
    }
  }, [id]);


  return (
    <div className="restaurants-form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Forma za dodavanje restorana</h3>
        <section className="section-row" style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <section style={{display:"flex", flexDirection: 'column', height: '30vh' }}>
          {loading && <div id="loadingSpinner" className="spinner"></div>}
          {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
          <label>Naziv:</label>
          <input type="text" {...register('name', { required: 'Ovo polje je obavezno' })}/>
          {formState.errors.name && (
            <p style={{ color: 'red', margin: 0 }}>{formState.errors.name.message}</p>)}
          <label>Opis:</label>
          <textarea {...register('description', { required: 'Ovo polje je obavezno' })} rows="4" cols="50"></textarea>
          {formState.errors.description && (
            <p style={{ color: 'red', margin: 0 }}>{formState.errors.description.message}</p>)}
          <label>Telefon:</label>
          <input type="phone" {...register('phoneNumber', { required: 'Ovo polje je obavezno' })}/>
          {formState.errors.phoneNumber && (
            <p style={{ color: 'red', margin: 0 }}>{formState.errors.phoneNumber.message}</p>)}
        </section>
        <section style={{display:"flex", flexDirection: 'column'}}>
          <label>Adresa:</label>
          <input type="text" {...register('address.streetAndNumber', { required: 'Ovo polje je obavezno'})}/>
          {formState.errors.address?.streetAndNumber && (
            <p style={{ color: 'red', margin: 0 }}>{formState.errors.address.streetAndNumber.message}</p>)}
          <label>Grad:</label>
          <input type="text" {...register('address.city', { required: 'Ovo polje je obavezno' })}/>
          {formState.errors.address?.city && (
            <p style={{ color: 'red', margin: 0 }}>{formState.errors.address.city.message}</p>)}
          <label>Postanski broj:</label>
          <input type="text" {...register('address.postalCode', { required: 'Ovo polje je obavezno'})}/>
          {formState.errors.address?.postalCode && (
            <p style={{ color: 'red', margin: 0 }}>{formState.errors.address.postalCode.message}</p>)}
        </section>
        {roles.includes("Owner") && (<section style={{display:"flex", flexDirection: 'column', height: '30vh' }}>
          <h4>Radno vreme:</h4>
          <section className="section-row" style={{justifyContent: 'flex-start'}}>
            <label>Radnim danima od:</label>
            <input type="time" {...register('baseWorkSched.workDayStart', {required: 'Ovo polje je obavezno'})}/>
            <label>do:</label>
            <input type="time" {...register('baseWorkSched.workDayEnd', {required: 'Ovo polje je obavezno'})}/>
          </section>
          <section className="section-row" style={{justifyContent: 'flex-start'}}>
            <p>Subota:</p>
            <input type="checkbox" {...register('baseWorkSched.saturday')}/>
            <p>Nedelja:</p>
            <input type="checkbox" {...register('baseWorkSched.sunday')}/>
          </section>
          <section className="section-row" style={{justifyContent: 'flex-start'}}>
            <label>Vikendom od:</label>
            <Controller name="baseWorkSched.weekendStart" control={control}
            rules={{ required: !isCheckedOne && !isCheckedTwo ? "Ovo polje je obavezno" : false }} render={({ field }) => (
            <input type="time" {...field} disabled={!isCheckedOne && !isCheckedTwo}/>)}/>
            <label>do:</label>
            <Controller name="baseWorkSched.weekendEnd" control={control} 
            rules={{ required: !isCheckedOne && !isCheckedTwo ? "Ovo polje je obavezno" : false }} render={({ field }) => (
              <input type="time" {...field} disabled={!isCheckedOne && !isCheckedTwo}/>)}/>
          </section>
        </section>
        )}
        </section>
        {roles.includes("Owner") && (<section>
          <label>Izaberi sliku: </label>
          <Controller name="file" control={control} render={({ field }) => (
            <input type="file" onChange={(e) => field.onChange(e.target.files[0])}/>)}/>
        </section>
        )}
        <section className="section-row">
          <button className="buttons-form" type="submit">Potvrdi izmenu</button>
          {roles.includes("Owner") && <button className="buttons-form" type="button" onClick={onMenuClick}>Menu</button>}
        </section>
        
      </form>
    </div>
  );
}

export default RestaurantForm;