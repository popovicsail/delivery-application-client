import React, { useState, useEffect } from "react";
import DishForm from "./DishForm";
import DishGroupForm from "./DishGroupForm";
import { dishService } from "../../services/dishes.services.tsx";

const DishesPage = () => {
  const [dishes, setDishes] = useState([]);
  const [newDishId, setNewDishId] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDishGroupOpen, setIsDishGroupOpen] = useState(false);

  const myProfile = sessionStorage.getItem("myProfile"); 
  console.log("profile", JSON.parse(myProfile))
  const isRoleAdmin = JSON.parse(myProfile).user.roles.includes("Administrator") || JSON.parse(myProfile).user.roles.includes("Owner")

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const data = await dishService.getAll();
        setDishes(data);
      } catch (err) {
        console.error("Greška pri učitavanju jela:", err);
      }
    };
    fetchDishes();
  }, []);

  const grouped = dishes.reduce((a, dish) => {
    if (!a[dish.type]) a[dish.type] = [];
    a[dish.type].push(dish);
    return a;
  }, {});

  const handleSave = async (dish) => {
    try {
      if (dish.id) {
      await dishService.update(dish.id, dish);

      const data = await dishService.getAll();
      setDishes(data);
      } else {
        const created = await dishService.create(dish);
        setDishes((prev) => [...prev, created]);

        setNewDishId(created.id);
        setIsDishGroupOpen(true);
      }
    } catch (err) {
      console.error("Greška pri snimanju:", err);
    }
  };

  const getDishData = async (id) =>{
    const data = await dishService.getById(id);
    console.log("data", data)
  }

  const deleteDish = async (id) => {
    try {
      await dishService.delete(id);
      setDishes((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Greška pri brisanju jela:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Jelovnik:</h1>
      
      {isRoleAdmin && (
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
        <div key={type} style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>{type}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "15px" }}>
            {grouped[type].map((dish) => (
              <div key={dish.id} style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "15px" }}>
                <h2 style={{ margin: "0 0 5px" }}>{dish.name}</h2>
                <p style={{ fontSize: "14px" }}>{dish.description}</p>
                <p style={{ marginTop: "8px", fontWeight: "bold" }}>{dish.price} RSD</p>
                {isRoleAdmin && (
                  <div style={{display: "flex", justifyContent: "space-around"}}>
                    <button 
                      onClick={() => { setSelectedDish(dish); setIsFormOpen(true); getDishData("77777777-7777-7777-7777-777777777777");}}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "bold",
                        transition: "background 0.3s",
                      }}
                      >
                      Izmeni jelo
                    </button>
                    <button 
                      onClick={() => deleteDish(dish.id)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: "#f44336",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "bold",
                        transition: "background 0.3s",
                      }}
                    >
                      Izbriši jelo
                    </button>
                  </div>
                )}
              </div>
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

export default DishesPage;
