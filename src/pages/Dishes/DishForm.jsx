import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const DishForm = ({ jelo, onClose, onSave }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (jelo) {
      reset(jelo);
    } else {
      reset({
        name: "",
        description: "",
        price: "",
        type: "" });
    }
  }, [jelo, reset]);

  const onSubmit = (data) => {
    onSave({ ...jelo, ...data })
    onClose();
  };

  return (
    <div
  onClick={onClose}
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 1000,
  }}
>
  <div
    onClick={(e) => e.stopPropagation()}
    style={{
      padding: "30px 40px",
      borderRadius: "12px",
      width: "600px",
      maxWidth: "100%",
      backgroundColor: "#4A4A4A",
      border: "2px solid white",
      boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
      color: "white",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      fontFamily: "Arial, sans-serif",
    }}
  >
    <h2 style={{ margin: 0, textAlign: "center" }}>
      {jelo ? "Izmeni jelo" : "Dodaj jelo"}
    </h2>

    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ marginBottom: "5px" }}>Naziv jela:</label>
        <input
          type="text"
          {...register("name", { required: "Naziv jela je obavezan" })}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
        {errors.name && <p style={{ color: "red", marginTop: "5px" }}>{errors.name.message}</p>}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ marginBottom: "5px" }}>Opis:</label>
        <textarea
          {...register("description", { required: "Opis jela je obavezan" })}
          rows={4}
          placeholder="Opis jela..." 
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px",
            resize: "vertical",
          }}
        />
        {errors.description && <p style={{ color: "red", marginTop: "5px" }}>{errors.description.message}</p>}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ marginBottom: "5px" }}>Cena:</label>
        <input
          type="number"
          placeholder="123" 
          {...register("price", {required: "Cena je obavezna", min: { value: 1, message: "Cena mora biti veća od 0" },
          })}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
        {errors.price && <p style={{ color: "red", marginTop: "5px" }}>{errors.price.message}</p>}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ marginBottom: "5px" }}>Tip kuhinje:</label>
        <input
          type="text"
          placeholder="Italijanska" 
          {...register("type", { required: "Tip kuhinje je obavezan" })}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
        {errors.type && <p style={{ color: "red", marginTop: "5px" }}>{errors.type.message}</p>}
      </div>

      {/* Zameniti kasnije kada se promeni back da se koristi type file a ne text */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ marginBottom: "5px" }}>URL fotografije jela:</label>
        <input 
          type="text" 
          placeholder="Unesite URL slike" 
          {...register("image")} 
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
        {jelo?.image && (
          <img 
            src={jelo.image} alt="Preview" style={{ maxWidth: "150px", marginTop: "10px" }} 
          />
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px", marginTop: "10px" }}>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            border: "1px solid white",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Sačuvaj
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            border: "1px solid white",
            backgroundColor: "#f44336",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Otkaži
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default DishForm;
