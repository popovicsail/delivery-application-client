import React, { useState, useEffect } from "react";
import "../../styles/main.scss";
import { dishService } from "../../services/dishes.services.jsx"
import DishCard from "../../components/dishes/DishCard.jsx";
import DishForm from "../../components/dishes/DishForm.jsx";
import DishGroupForm from "../../components/dishes/DishGroupForm.jsx";

const RestaurantMenuOwner = ({restaurantId}) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [isDishGroupOpen, setIsDishGroupOpen] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [menuId, setMenuId] = useState(null);

  const grouped = dishes.reduce((a, dish) => {
    if (!a[dish.type]) a[dish.type] = [];
    a[dish.type].push(dish);
    return a;
  }, {});

  const handleSave = async (dish) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("Name", dish.name);
    formData.append("Type", dish.type);
    formData.append("Price", dish.price);
    formData.append("DiscountAmount", dish.discountAmount);
    formData.append("DiscountExpireAt", dish.discountExpireAt);
    formData.append("Description", dish.description);
    formData.append("MenuId", menuId);
    if (dish.allergens && dish.allergens.length > 0 ) {
      dish.allergens.forEach((a, i) => {
        formData.append(`AllergenIds[${i}]`, a.value);
      });
    }
    if (dish.picture) {
      formData.append("file", dish.picture[0]);
    }

    try {
      if (dish.id) {
      formData.append("Id", dish.id);
      await dishService.update(dish.id, formData);
      setIsDishGroupOpen(true);
      fetchMenu();
      } else {
        const created = await dishService.create(formData);
        setDishes((prev) => [...prev, created]);
        setSelectedDish(created);
        setIsDishGroupOpen(true);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('Niste uneli validne podatke.');
        } else if (error.response.status === 404) {
          setError("Jelo sa ovim id-em ne postoji ili pogresna ruta.");
        } else if (error.response.status === 401) {
          setError("Ova ruta je rezervisana samo za vlasnike restorana.");
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

  const deleteDish = async (id) => {
    if (!window.confirm("Da li ste sigurni da zelite da uklonite jelo?")) {
      return;
    }
    try {
      setLoading(true);
      await dishService.delete(id);
      setDishes((prev) => prev.filter((d) => d.id !== id));
      setError("");
      alert("Uspesno ste uklonili jelo");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError("Ne postoji jelo sa ovim id-em.");
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
    try {
      setLoading(true);
      const data = await dishService.getRestaurantMenu(restaurantId);
      setDishes(data.dishes);
      setMenuId(data.id);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError("Menu sa ovim id-em ne postoji ili pogresna ruta.");
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
      console.error("Greška pri slanju zahteva za permisije:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [refreshKey]);

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return (
    <div className="restaurant-menu-owner-container">
      <div className="restaurant-header">
        <h1>Menu Restorana</h1>

        <div className="owner-restaurant-create-btn-wrapper">
          <button className="buttons create-btn" onClick={() => { setSelectedDish(null); setIsFormOpen(true);}}
            style={{padding: '0.4rem 0.8rem'}}>
            + Dodaj jelo
          </button>
        </div>
      </div>


      {Object.keys(grouped).map((type) => (
        <div className="dish-type-row" key={type} style={{ marginBottom: "30px" }}>
          <h2>{type}</h2>
          <div className="dishes-row">
            {grouped[type].map((dish) => (
              <div className="dish-n-order-wrapper" key={dish.id}>
                <DishCard  dish={dish} setSelectedDish={setSelectedDish} isInMenu={true} isOwnerHere={true} 
                  isCustomer={false} deleteDish={deleteDish} setIsFormOpen={setIsFormOpen} />
              </div>
            ))}
          </div>
        </div>
      ))}

      {isFormOpen && (
        <DishForm dish={selectedDish} onClose={() => setIsFormOpen(false)} onSave={handleSave}/>
      )}
      {isDishGroupOpen && (
        <DishGroupForm dish={selectedDish} onClose={(freshDish) => {setIsDishGroupOpen(false); setRefreshKey(refreshKey + 1)}}/>
      )}
    </div>
  );
}

export default RestaurantMenuOwner;