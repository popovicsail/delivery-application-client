import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { dishService } from "../../services/dishes.services.jsx";

const DishGroupForm = ({ dish, onClose }) => {
  const [groups, setGroups] = useState(dish && dish.dishOptionGroups || []);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      type: currentGroup ? currentGroup.type : 'independent',
      name: "",
      dishOptions: [{ name: "", price: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dishOptions",
  });

  const saveGroup = async (data, addNew = false, groupId) => {
    try {
      let payload = { ...data, dishId: dish && dish.id };
      if (groupId) {
        payload = {...payload, id: groupId};
        const group = await dishService.updateGroup(payload, groupId);
        const newArray = groups.map((g) => {
          if(g.id == group.id) {
            return group;
          }
          return g;
        })
        setGroups(newArray);
      }
      else {
        const group = await dishService.createGroup(payload);
        setGroups([...groups, group]);
      }

      if (addNew) {
        reset({
          type: "independent",
          name: "",
          dishOptions: [{ name: "", price: "" }],
        });
      } else {
        onClose();
      }
    } catch (err) {
      console.error("Greška pri cuvanju grupe:", err);
    }
  };

  const deleteGroup = async (id) => {
    if (!window.confirm('Da li ste sigurni da zelite da uklonite ovu grupu?')) {
      return;
    }
    try {
      setLoading(true);
      const response = await dishService.deleteGroup(id);
      setGroups(prev => prev.filter((g) => (g.id != id)));
      reset({
          type: "independent",
          name: "",
          dishOptions: [{ name: "", price: "" }],
        });
      setError('');
      alert('Uspesno ste uklonili grupu');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError('Ne postoji grupa sa ovim id-em.');
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
    if (currentGroup) {
      reset(currentGroup);
    }
  }, [currentGroup, reset]);

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return (
    <div id="dish-groups-layer" className="over-layer-base" onClick={onClose}>
      <div id="dish-groups-container" onClick={(e) => e.stopPropagation()}>
        <h1>Dodaj grupu dodataka</h1>

        <form
          onSubmit={handleSubmit((data) =>
            saveGroup(data, false, currentGroup ? currentGroup.id : null)
          )}
        >
          <div id="dish-group-edit-column">
            <div id="dish-group-type-row">
              <label>
                <input type="radio" {...register('type')} value="independent"
                />
                Nezavisni
              </label>
              <label style={{ marginLeft: '10px' }}>
                <input type="radio" {...register('type')} value="choice"
                />
                Izborni
              </label>
            </div>

            <div id="dish-group-name-row">
              <label style={{ marginBottom: '5px' }}>Naziv grupe: </label>
              <input {...register('name', { required: 'Naziv grupe je obavezan' })} placeholder="Naziv grupe"/>
              {errors.name && (<p style={{ color: 'red', marginTop: '5px' }}>{' '}{errors.name.message}</p>)}
            </div>

            <div id="dish-group-options-block" style={{ marginTop: '15px' }}>
              <h3>Stavke</h3>
              {fields.map((field, index) => (
                <div key={field.id}  style={{width: 'fit-content'}}>
                  <div className="dish-option-row"
                    style={{
                      display: 'flex',
                      gap: '10px',
                      marginBottom: '4px',
                      width: 'fit-content'
                    }}
                  >
                    <input placeholder="Naziv" {...register(`dishOptions.${index}.name`, { required: 'Naziv stavke je obavezan',})}/>
                    <input type="number" placeholder="Cena"
                      {...register(`dishOptions.${index}.price`, { required: 'Cena je obavezna',})}
                      style={{
                        width: '5vw',
                        fontSize: '16px',
                      }}
                    />
                    {fields.length > 1 && (
                      <button className="remove-btn" type="button"
                        onClick={() => remove(index)}
                      >-
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {errors.dishOptions?.[index]?.name && (
                      <p style={{ color: 'red', marginTop: '5px' }}>
                        {errors.dishOptions[index].name.message}
                      </p>
                    )}
                    {errors.dishOptions?.[index]?.price && (
                      <p style={{ color: 'red', marginTop: '5px' }}>
                        {errors.dishOptions[index].price.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <section className="section-row" style={{justifyContent:'start'}}>
                <button className="add-btn" type="button" onClick={() => append({ name: '', price: '' })}
                >+
                </button>
                <button type="button" className="buttons create-btn move-up-4" style={{margin: 0}}
                  onClick={handleSubmit((data) => {
                    saveGroup(data, true, currentGroup ? currentGroup.id : null); setCurrentGroup(null);}
                  )}
                >
                  Sačuvaj grupu
                </button>
                <button type="button" className={currentGroup ? "buttons delete-btn move-up-4" : "hidden"} style={{margin: 0}}
                  onClick={() => {
                    deleteGroup(currentGroup.id); setCurrentGroup(null); 
                  }}
                >
                  Ukloni grupu
                </button>
              </section>
            </div>
            <div style={{ display: 'flex', gap: '10px', height:'fit-content' }}>
              <button className="buttons-form" style={{marginTop: 0}} type="submit">Gotovo</button>
              <button className="delete-btn buttons" type="button" onClick={onClose}>Otkaži</button>
            </div>
          </div>
          <ul id="dish-groups-list-column">
            {groups &&
              groups.map((g) => (
                <li key={g.id} id={currentGroup && currentGroup.id == g.id ? "current-dish-group" : ""} onClick={() => setCurrentGroup(g)}>
                  {g.name}
                </li>
              ))}
          </ul>
        </form>
      </div>
    </div>
  );
};

export default DishGroupForm;
