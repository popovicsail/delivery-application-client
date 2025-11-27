import React, { useState, useEffect, useRef } from "react";
import "../../styles/offers.scss";
import { useNavigate, useParams } from "react-router-dom";
import OfferForm from "../../components/offers/OfferForm";
import OfferFillWrapper from "../../components/offers/OfferFillWrapper";
import { getOneOffer, createOffer, updateOffer, manageOfferDishes } from "../../services/offer.services";

const RestaurantOfferManage = ({}) => {
  const { restaurantId, offerId } = useParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("form"); // "form", "fill", "finish", "cancel"
  const [offer, setOffer] = useState(null);
  const [items, setItems] = useState([]);
  const submitRef = useRef(null);
  const navigate = useNavigate();

  const handleUpdateOffer = async (data) => {
    const formData = new FormData();
    formData.append("Name", data.name);
    formData.append("Price", data.price);
    formData.append("FreeDelivery", data.freeDelivery);
    formData.append("ExpiresAt", data.expiresAt);
    if (data.file) {
      formData.append("file", data.file);
    }
    setLoading(true);
    try {
      const response = await updateOffer(offerId, formData);
      setOffer(response);
      setError('');
      setAction("fill");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError('Ponuda sa ovim id-em ne postoji.');
        } else if (error.response.status === 400) {
          setError('Nevalidni podaci za azuriranje ponude.');
        } else if (error.response.status === 401) {
          setError('Ova stranica je rezervisana samo za vlasnika ovog restorana.');
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
  }

  const handleCreateOffer = async (data) => {
    const formData = new FormData();
    formData.append("Name", data.name);
    formData.append("Price", data.price);
    formData.append("FreeDelivery", data.freeDelivery);
    formData.append("ExpiresAt", data.expiresAt);
    if (data.file) {
      formData.append("file", data.file);
    }
    try {
      setLoading(true);
      const response = await createOffer(restaurantId, formData);
      setOffer(response);
      setError('');
      setAction("fill");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError('Restoran sa ovim id-em ne postoji.');
        } else if (error.response.status === 400) {
          setError('Nevalidni podaci za kreiranje ponude.');
        } else if (error.response.status === 401) {
          setError('Ova stranica je rezervisana samo za vlasnika ovog restorana.');
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
  }

  const handleManageOfferDishes = async () => {
    setLoading(true);
    if (!offer) {
      setError('Greska, Ponuda ne postoji!')
      return;
    }
    try {
      const response = await manageOfferDishes(offer.id, items.map((item) => ({dishId: item.dishId, quantity: item.quantity})));
      setError('');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError('Ponuda sa ovim id-em ne postoji.');
        } else if (error.response.status === 400) {
          setError('Nevalidni podaci za azuriranje jela u ponudi.');
        } else if (error.response.status === 401) {
          setError('Ova stranica je rezervisana samo za vlasnika ovog restorana.');
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
  }

  const fetchOffer = async () => {
    setLoading(true);
    try {
      const response = await getOneOffer(offerId);
      setOffer(response);
      if (response.offerDishes && response.offerDishes.length > 0){
        setItems(response.offerDishes)
      }
      setError('');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError('Ponuda sa ovim id-em ne postoji.');
        } else if (error.response.status === 401) {
          setError('Ova stranica je rezervisana samo za vlasnika ovog restorana.');
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
    if (action == "form") {
      if (offerId) {
        fetchOffer();
      }
    } else if (action == "finish") {

      handleManageOfferDishes();
      if (offerId) {
        alert('Ponuda je izmenjena.')
      }
      else {
        alert('Nova ponuda je kreirana.')
      }
      navigate(`/owner/restaurants/${restaurantId}`, { state: { navigateTab: "offers" }});
    } else if (action == "cancel") {
      navigate(`/owner/restaurants/${restaurantId}`, { state: { navigateTab: "offers" }});
    }
  }, [action]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return (
    <div className="offer-manage-container">
      
      <div className="offer-manage-content">
        <div className="step-nav">
          <div className={`step-nav-item ${action == "form" ? "active-step" : ""}`}>
            <span className={`step-indicator ${action == "form" ? "active-step" : ""}`}>1</span>
            <span className={`step-title ${action == "form" ? "active-step" : ""}`}>Osn. Informacije</span>
          </div>
          <div className={`step-nav-item ${action == "fill" ? "active-step" : ""}`}>
            <span className={`step-indicator ${action == "fill" ? "active-step" : ""}`}>2</span>
            <span className={`step-title ${action == "fill" ? "active-step" : ""}`}>Popunjavanje Ponude</span>
          </div>
        </div>

        {loading ? <div id="loadingSpinner" className="spinner"></div> :
          action == "form" ? <OfferForm offer={offer} submitRef={submitRef} onSubmitOffer={offerId && offer ? handleUpdateOffer : handleCreateOffer}/>
          : action == "fill" ? <OfferFillWrapper offer={offer} setItems={setItems} items={items}/> : <p>Greska u prikazu!</p>}

        <div className="offer-manage-footer">
          <button className="buttons cancel-btn" 
            onClick={() => setAction("cancel")}>Otkazi</button>

          {action == "fill" && <button className="back-btn buttons" 
            onClick={() => setAction("form")}>Nazad</button>}

          {action == "form" && <button className="buttons next-btn edit-btn" 
            onClick={() => {submitRef.current()}}>Sledece</button>}

          {action == "fill" && <button className="buttons finish-btn edit-btn"
            onClick={() => setAction("finish")}>Zavrsi</button>}
        </div>
      </div>
    </div>
  );
}

export default RestaurantOfferManage;