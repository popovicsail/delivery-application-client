import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { Controller, useForm } from "react-hook-form";
import { getAllergens } from "../../services/user.services.jsx";

const DishForm = ({ dish, onClose, onSave }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [allergens, setAllergens] = useState([]);
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const fetchAllAllergens = async () => {
    try {
      setLoading(true);
      const data = await getAllergens();
      setAllergens(data.map((a) => ({value: a.id, label: a.name})) || []);
      setError('');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError('Pogresna ruta.');
        } else if (error.response.status === 401) {
          setError('Ova ruta je rezervisana samo za vlasnike restorana.');
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
    if (dish) {
      let convertedAllergens = [];
      if (dish.allergens && dish.allergens.length > 0) {
        convertedAllergens = dish.allergens.map((a) => ({value: a.id, label: a.name}));
      }
      
      const newDish = { ...dish, allergens: convertedAllergens };
      reset(newDish);
    } else {
      reset({
        name: '',
        description: '',
        price: '',
        picture: '',
        type: '',
        allergens: []
      });
    }
  }, [dish, reset]);

  useEffect(() => {
      fetchAllAllergens();
    }, []);

  const onSubmit = (data) => {
    onSave({ ...dish, ...data });
    onClose();
  };

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return (
    <div onClick={onClose} className="over-layer-base">
      <div
        onClick={(e) => e.stopPropagation()}
        className="dish-form-container"
        style={{
          boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
        }}>
        <h2 style={{ margin: 0, textAlign: 'center' }}>{dish ? 'Izmeni jelo' : 'Dodaj jelo'}</h2>

        <form onSubmit={handleSubmit(onSubmit)}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '5px' }}>Naziv jela:</label>
            <input type="text" {...register('name', { required: 'Naziv jela je obavezan' })}/>
            {errors.name && (
              <p style={{ color: 'red', marginTop: '5px' }}>
                {errors.name.message}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '5px' }}>Opis:</label>
            <textarea
              {...register('description', {required: 'Opis jela je obavezan',})}
              rows={4}
              placeholder="Opis jela..."
              style={{
                resize: 'vertical',
              }}
            />
            {errors.description && (
              <p style={{ color: 'red', marginTop: '5px' }}>
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="section-row">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '5px' }}>Tip kuhinje:</label>
              <input type="text"
                placeholder="Italijanska"
                {...register('type', { required: 'Tip kuhinje je obavezan' })}
              />
              {errors.type && (
                <p style={{ color: 'red', marginTop: '5px' }}>
                  {errors.type.message}
                </p>
              )}
            </div>
          
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '5px' }}>Cena:</label>
              <input type="number"
                placeholder="123"
                {...register('price', {
                  required: 'Cena je obavezna',
                  min: { value: 1, message: 'Cena mora biti veća od 0' },
                })}
              />
              {errors.price && (
                <p style={{ color: 'red', marginTop: '5px' }}>
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '5px' }}>Alergeni:</label>
          <Controller name="allergens" control={control}
          render={({ field }) => (
            <Select {...field} isMulti options={allergens} className="basic-multi-select" 
            onChange={(selected) => field.onChange(selected)} value={field.value} />
          )}
          />
          {errors.type && (
              <p style={{ color: 'red', marginTop: '5px' }}>
                {errors.type.message}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '5px' }}>Izaberite sliku jela:</label>
            <input type="file" placeholder="Izaberite" {...register('picture')}/>
            {dish?.picture && (
              <img src={dish.picture} alt="Preview" style={{ maxWidth: '150px', marginTop: '10px' }}/>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              marginTop: '10px',
            }}>
            <button type="submit" className="buttons-form" style={{ marginTop: 0 }}>Sačuvaj</button>
            <button type="button" onClick={onClose} className="delete-btn buttons">Otkaži</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DishForm;
