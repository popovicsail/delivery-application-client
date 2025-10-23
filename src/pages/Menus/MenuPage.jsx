import React, { useState, useEffect } from "react";
import { useParams, useLocation } from 'react-router-dom';
import DishForm from "./DishForm.jsx";
import DishGroupForm from "./DishGroupForm.jsx";
import { dishService } from "../../services/dishes.services.jsx";
import { getMenuPermissionAsync } from "../../services/user.services.jsx";
import DishCard from "../../components/DishCard.jsx";

const MenuPage = () => {
  const location = useLocation();
  const highlightDishId = location.state?.highlightDishId;
  const { menuId } = useParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [newDishId, setNewDishId] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isOwnerHere, setIsOwnerHere] = useState(false);
  const [isDishGroupOpen, setIsDishGroupOpen] = useState(false);
  const myProfile = sessionStorage.getItem("myProfile"); 
  console.log("profile", JSON.parse(myProfile))

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await dishService.getMenuByid(menuId);
        setDishes(data.dishes);
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
    const fetchRestaurant = async () => {
      const permit = JSON.parse(sessionStorage.getItem("permitRequest"));
      if (!permit || permit != true) return;
      try {
        const response = await getMenuPermissionAsync(menuId);
        setIsOwnerHere(response == true);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
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
        console.error("Greška pri slanju zahteva za permisije:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
    fetchRestaurant();
  }, []);

  const grouped = dishes.reduce((a, dish) => {
    if (!a[dish.type]) a[dish.type] = [];
    a[dish.type].push(dish);
    return a;
  }, {});

  const handleSave = async (dish) => {
    const formData = new FormData();
    formData.append("Name", dish.name)
    formData.append("Type", dish.type)
    formData.append("Price", dish.price)
    formData.append("Description", dish.description)
    formData.append("MenuId", menuId)
    if (dish.picture) {
      formData.append("file", dish.picture[0]);
    }
    try {
      if (dish.id) {
      formData.append("Id", dish.id)
      await dishService.update(dish.id, formData);

      const data = await dishService.getAll();
      setDishes(data);
      } else {
        const created = await dishService.create(formData);
        setDishes((prev) => [...prev, created]);

        setNewDishId(created.id);
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

  const getDishData = async (id) =>{
    const data = await dishService.getById(id);
    console.log("data", data)
  }

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

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('permitRequest');
    };
  }, []);

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "0", fontStyle: 'italic' }}>Glavni Menu</h1>
      
      {isOwnerHere && (
        <button 
          onClick={() => { setSelectedDish(null); setIsFormOpen(true);}}
          style={{
            marginBottom: "20px",
            padding: "8px 14px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background 0.3s", }}
        >
          + Dodaj jelo
        </button>
      )}

      {Object.keys(grouped).map((type) => (
        <div className="dish-type-row" key={type} style={{ marginBottom: "30px" }}>
          <h2>{type}</h2>
          <div className="dishes-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "15px" }}>
            {grouped[type].map((dish) => (
              <DishCard key={dish.id} dish={dish} isInMenu={true} isOwnerHere={isOwnerHere} deleteDish={deleteDish} 
              setSelectedDish={setSelectedDish} setIsFormOpen={setIsFormOpen} getDishData={getDishData} highlighted={highlightDishId == dish.id}></DishCard>
            ))}
          </div>
        </div>
      ))}

      {isFormOpen && (
        <DishForm
          jelo={selectedDish}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      )}
      {isDishGroupOpen && (
      <DishGroupForm
        dishId={newDishId}
        onClose={() => setIsDishGroupOpen(false)}
      />
    )}
    </div>
  );
};

export default MenuPage;
