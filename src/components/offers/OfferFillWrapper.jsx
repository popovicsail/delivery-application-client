import React, { useState, useEffect } from "react";
import "../../styles/offers.scss";
import OfferSummaryPanel from "./OfferSummaryPanel";
import DishSelectorPanel from "./DishSelectorPanel";
import { dishService } from "../../services/dishes.services.jsx";
import { useParams } from "react-router-dom";

const OfferFillWrapper = ({offer, setItems, items}) => {
  const { restaurantId } = useParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [notSelectedDishes, setNotSelectedDishes] = useState([]);
  const [sort, setSort] = useState('NAME_ASC'); // NAME_ASC, NAME_DESC, TYPE_ASC, TYPE_DESC
  const [filters, setFilters] = useState({
    name: '',
    type: '',
    restaurantId: restaurantId,
  });

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const response = await dishService.getAll(filters, sort);
      setDishes(response);
      setError('');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError('Jela nisu pronadjena.');
        } else if (error.response.status === 400) {
          setError('Nevalidni filteri ili sortiranje za dobijanje jela.');
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
    fetchDishes();
  }, [filters, sort]);

  useEffect(() => {
    //if (!dishes) return;

    if (items.length == 0) {
      setNotSelectedDishes((prev) => [...dishes])
      return;
    }
    else {
      setNotSelectedDishes((prev) => dishes.filter((dish) => !items.some((item) => item.dishId === dish.id)));
    }
  }, [items, dishes]);

  const addDishToItems = (newObj) => {
    if(items.some((item) => item.dishId === newObj.dishId)) {
      setItems((prev) =>
        prev.map((item) => (item.dishId === newObj.dishId ? { ...item, quantity: item.quantity + 1 } : item))
      );
      return;
    };
    setItems((prev) => [...prev, { ...newObj, quantity: 1 }]);
  }
  
  const changeItemQuantity = (dishId, newQuantity, dish) => {
    if(!newQuantity || newQuantity == NaN || newQuantity < 1){
      removeItem(dishId);
      return;
    }
    if(items.some((item) => item.dishId === dishId)) {
      setItems((prev) =>
        prev.map((item) => (item.dishId === dishId ? { ...item, quantity: newQuantity } : item))
      );
    }
    else {
      setItems((prev) => [...prev, { dishId: dishId, dish: dish, quantity: newQuantity }]);
    }
  }

  const removeItem = (dishId) => {
    setItems((prev) => prev.filter((item) => item.dishId !== dishId));
  }

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return (
    <div className="offer-fill-wrapper">
      <DishSelectorPanel dishes={notSelectedDishes} addDishToItems={addDishToItems} setSort={setSort} setFilters={setFilters} filters={filters} sort={sort}/>
      <OfferSummaryPanel offer={offer} items={items} changeItemQuantity={changeItemQuantity} removeItem={removeItem}/>
    </div>
  );
}
export default OfferFillWrapper;