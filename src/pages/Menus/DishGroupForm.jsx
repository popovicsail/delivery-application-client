import React, {useState} from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { dishService } from "../../services/dishes.services.jsx";

const DishGroupForm = ({ dishId, onClose }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      type: "independent",
      name: "",
      dishOptions: [{ name: "", price: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dishOptions",
  });

  const saveGroup = async (data, addNew = false) => {
    try {
      const payload = { ...data, dishId };
      await dishService.createGroup(payload);

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

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex", justifyContent: "center", alignItems: "center",
        padding: "20px", zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#4A4A4A", color: "white",
          border: "2px solid white", borderRadius: "12px",
          padding: "30px", width: "600px", maxWidth: "100%",
        }}
      >
        <h1>Dodaj grupu dodataka</h1>

        <form onSubmit={handleSubmit((data) => saveGroup(data, false))}>
          <div style={{marginBottom: "10px"}}>
            <label>
              <input type="radio" value="independent" {...register("type")} />
              Nezavisni
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input type="radio" value="choice" {...register("type")} />
              Izborni
            </label>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px" }}>Naziv grupe: </label>
            <input 
            {...register("name", { required: "Naziv grupe je obavezan" })} 
            placeholder="Naziv grupe"
            style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px",
            resize: "vertical",
          }}
            />
            {errors.name && (<p style={{ color: "red", marginTop: "5px" }}> {errors.name.message}</p>
            )} 
          </div>

          <div style={{ marginTop: "15px" }}>
            <h3>Stavke</h3>
            {fields.map((field, index) => (
            <div key={field.id} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
              <div>
                <input 
                placeholder="Naziv" 
                {...register(`dishOptions.${index}.name`, { required: "Naziv stavke je obavezan" })} 
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              />
              {errors.dishOptions?.[index]?.name && (
                <p style={{ color: "red", marginTop: "5px" }}>
                  {errors.dishOptions[index].name.message}
                </p>
              )}
              </div>
              <div>
                <input 
                type="number" 
                placeholder="Cena" 
                {...register(`dishOptions.${index}.price`, { required: "Cena je obavezna" })} 
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              />
              {errors.dishOptions?.[index]?.price && (
                <p style={{ color: "red", marginTop: "5px" }}>
                  {errors.dishOptions[index].price.message}
                </p>
              )}
              </div>

              {fields.length > 1 && (
                <button type="button" onClick={() => remove(index)}>
                  Ukloni
                </button>
              )}
            </div>
          ))}
            <button type="button" onClick={() => append({ name: "", price: "" })}>
              Dodaj stavku
            </button>
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button type="submit">Završi</button>
            <button type="button" onClick={handleSubmit((data) => saveGroup(data, true))}>
              Dodaj još
            </button>
            <button type="button" onClick={onClose}>Otkaži</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DishGroupForm;
