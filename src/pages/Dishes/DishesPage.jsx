import React, { useState } from "react";
import DishForm from "./DishForm";
import DishGroupForm from "./DishGroupForm";

const jela = [
  {
    id: "1",
    name: "Pizza Margherita",
    description: "Klasična pizza sa sirom i paradajz sosom.",
    price: 750,
    type: "Italijanska"
  },
  {
    id: "2",
    name: "Pasta Carbonara",
    description: "Pasta sa slaninom, jajetom i parmezanom.",
    price: 890,
    type: "Italijanska"
  },
  {
    id: "3",
    name: "Sushi",
    description: "Razni nigiri i maki rolnice.",
    price: 1200,
    type: "Japanska"
  },
  {
    id: "4",
    name: "Ramen",
    description: "Tradicionalna supa sa rezancima i povrćem.",
    price: 950,
    type: "Japanska"
  },
  {
    id: "5",
    name: "Cheeseburger",
    description: "Burger sa sirom i pomfritom.",
    price: 650,
    type: "Američka"
  },
];

const DishesPage = () => {
  const [dishes, setDishes] = useState(jela);
  const [selectedDish, setSelectedDish] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  sessionStorage.setItem("token", JSON.stringify({name: "test", role: "vlasnik"}));
  const token = sessionStorage.getItem("token"); 
  const role = token ? JSON.parse(token).role : null;

  const grouped = dishes.reduce((a, dish) => {
    if (!a[dish.type]) a[dish.type] = [];
    a[dish.type].push(dish);
    return a;
  }, {});

  console.log("grouped", grouped)

  const handleSave = (dish) => {
    if (dish.id) {
      //dodati endpoint
    } else {
      //dodati endpoint
    }
  };

  const deleteDish = (id) =>{
    console.log("delete", id) //dodati endpoint
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Jelovnik:</h1>
      
      {role === "vlasnik" && (
        <button 
          onClick={() => { setSelectedDish(null); setIsFormOpen(true); }}
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
                {role === "vlasnik" && (
                  <div style={{display: "flex", justifyContent: "space-around"}}>
                    <button 
                      onClick={() => { setSelectedDish(dish); setIsFormOpen(true); }}
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
