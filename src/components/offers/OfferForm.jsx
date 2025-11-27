import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form"
import "../../styles/offers.scss";

const OfferForm = ({ offer, submitRef, onSubmitOffer }) => {
  const formatDate = (inputString) => {
    const date = new Date(inputString);
    const pad = n => String(n).padStart(2, "0");

    return(
      date.getFullYear() + "-" +
      pad(date.getMonth() + 1) + "-" +
      pad(date.getDate()) + "T" +
      pad(date.getHours()) + ":" +
      pad(date.getMinutes())
    );
  }

  const { register, handleSubmit, formState: { errors }, control } = useForm({
    defaultValues: {
      name: offer ? offer.name : '',
      price: offer ? offer.price : 0,
      freeDelivery: offer ? offer.freeDelivery : false,
      expiresAt: offer ? formatDate(offer.expiresAt) : '',
      file: offer ? offer.image : null,
    }
  });

  const onSubmit = (data) => {
    onSubmitOffer(data);
  };

  useEffect(() => {
    submitRef.current = handleSubmit(onSubmit);
  }, [handleSubmit]);

  const isFutureDate = (value) => {
    const selectedDate = new Date(value);
    const currentDate = new Date();

    return selectedDate > currentDate || 'Datum mora biti u buducnosti';
  };

  return (
    <div className="offer-form-container">
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="form-group">
          <label>Naziv Ponude</label>
          <input type="text" {...register("name", { required: "Naziv je obavezan." })}/>
          {errors.name && <span style={{ color: 'red', marginTop: '5px' }}>{errors.name.message}</span>}
        </div>

        <section className="section-row">
          <div className="form-group">
            <label>Cena</label>
            <input type="number" {...register("price", { required: "Cena je obavezna.", min: { value: 1, message: "Cena mora biti pozitivan broj." } })}/>
            {errors.price && <span style={{ color: 'red', marginTop: '5px' }}>{errors.price.message}</span>}
          </div>

          <div className="form-group" style={{flexDirection: 'row', alignItems: 'center', alignSelf: 'end', marginBottom: '0.2rem'}}>
            <label >Besplatna dostava: </label>
            <input type="checkbox" {...register("freeDelivery")} style={{width: 'fit-content'}}/>
          </div>
        </section>

        <div className="form-group">
          <label>Traje do: </label>
          <input type="datetime-local" {...register("expiresAt", { required: "Datum i vreme su obavezni.", validate: isFutureDate })}/>
          {errors.expiresAt && <span style={{ color: 'red', marginTop: '5px' }}>{errors.expiresAt.message}</span>}
        </div>

        <div className="form-group">
          <label>Izaberi sliku: </label>
          <Controller name="file" control={control} render={({ field }) => (
            <input type="file" onChange={(e) => field.onChange(e.target.files[0])}/>)}/>

          {offer?.image && (
              <div className="form-group">
                <img src={offer.image} alt="Preview" style={{ height: '150px', width: 'auto', marginTop: '10px' }}/>
              </div>
            )}
        </div>
      </form>
    </div>
  );
}

export default OfferForm;