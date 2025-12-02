import React, { useState, useEffect } from "react";
import { getByRestaurant, deleteOffer } from "../../services/offer.services.jsx"
import "../../styles/offers.scss";
import { useNavigate } from "react-router-dom";
import OfferCard from "../../components/offers/OfferCard.jsx";

const RestaurantOffers = ({restaurantId}) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [sort, setSort] = useState('NAME_ASC'); // NAME_ASC, NAME_DESC, TYPE_ASC, TYPE_DESC, PRICE_ASC, PRICE_DESC
  const [filters, setFilters] = useState({
    name: '',
    type: '',
  });
  const navigate = useNavigate();

  const handleDeleteOffer = (offerId) => {
    try {
      setLoading(true);
      const response = deleteOffer(offerId);
      setOffers((prevOffers) => prevOffers.filter((offer) => offer.id !== offerId));
      setError('');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError('Ponuda sa ovim id-em ne postoji.');
        } else if (error.response.status === 401) {
          setError('Ova akcija je rezervisana samo za vlasnika ovog restorana.');
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

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await getByRestaurant(restaurantId);
      setOffers(response);
      setError('');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError('Restoran sa ovim id-em ne postoji.');
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
    fetchOffers();
  }, []);

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return (
    <div id="restaurant-offers-container" style={{margin: '0'}}>
      <div className="restaurant-header">
        <h1>Ponude Restorana</h1>

        <div className="owner-restaurant-create-btn-wrapper">
          <button className="buttons create-btn add-offer-btn" 
          onClick={() => navigate(`/owner/restaurants/${restaurantId}/offers/create`)}>
            + Dodaj Novu Ponudu
          </button>
        </div>
      </div>

      {/*<div className="filter-block">
        <h3>Pretrazi po:</h3>
        <div className="filter-row">
          <div>
            <label>Nazivu:</label>
            <input type="text" onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}/>
          </div>
          <div>
            <label>Tipu:</label>
            <input type="text" onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}/>
          </div>
          <div>
            <label>Sortiraj po</label>
            <select onChange={(e) => setSort(e.target.value)}>
              <option value="NAME_ASC">Naziv Rastuće</option>
              <option value="NAME_DESC">Naziv Opadajuće</option>
              <option value="TYPE_ASC">Tip Rastuće</option>
              <option value="TYPE_DESC">Tip Opadajuće</option>
            </select>
          </div>
        </div>
      </div>*/}
      
      

      <div className="offers-list">
        {offers.length === 0 && <p>Nema dostupnih ponuda za ovaj restoran.</p>}
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} isInMenu={false} isOwnerHere={true} isCustomer={false} onDelete={handleDeleteOffer}/>
        ))}
      </div>
    </div>
  );
}

export default RestaurantOffers;