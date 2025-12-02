import React, { useState, useEffect, use } from "react";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { dishService } from "../services/dishes.services.jsx";
import { createOrder } from "../services/order.services.jsx";
import DishCard from "../components/dishes/DishCard.jsx";
import OfferCard from "../components/offers/OfferCard.jsx";

const MenuPage = () => {
  const location = useLocation();
  const highlightDishId = location.state?.highlightDishId;
  const { menuId } = useParams();
  const [restaurantId, setRestaurantId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [offers, setOffers] = useState([]);
  const [firstOfferIndex, setFirstOfferIndex] = useState(0);
  const [isCustomer, setIsCustomer] = useState(false);
  const [pickedId, setPickedId] = useState('');
  const [order, setOrder] = useState([]);
  const [offerAddedNotify, setOfferAddedNotify] = useState({
    ind: 0,
    quantity: 0
  });
  const [notifyWindowOpen, setNotifyWindowOpen] = useState(false);
  const navigate = useNavigate();
  
  const myAllergens = JSON.parse(sessionStorage.getItem('myAllergens'))

  useEffect(() => {
    const roles = sessionStorage.getItem('myProfile') && JSON.parse(sessionStorage.getItem('myProfile')).roles;
    setIsCustomer(roles && roles?.includes('Customer'));
  }, []);

  const handleClickForOrder = (id, dish) => {
    setPickedId((prev) => (prev == id ? "" : id));
    addDishToOrder(dish);
  }

  const addDishToOrder = (dishObj) => {
    if(order.some((dish) => dish.id === dishObj.id)) return;
    setOrder((prev) => [...prev, dishObj]);
  };

  const updateDishInOrder = (dishId, updatedData) => {
    setOrder((prev) =>
      prev.map((dish) => (dish.id === dishId ? { ...dish, ...updatedData } : dish))
    );
  };

  const addOfferToOrder = (offerObj) => {
    const existingItem = order.find(item => item.id === offerObj.id);
    const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
    if(existingItem) {
      setOrder((prev) =>
        prev.map((item) => (item.id === offerObj.id ? { ...item, quantity: item.quantity + 1 } : item))
      );
    } else {
      setOrder((prev) => [...prev, { ...offerObj, quantity: 1 }]);
    }

    setOfferAddedNotify(prev => ({
      ind: prev.ind + 1,
      quantity: newQuantity,
    }));
  }

  const updateGroupsInOrder = (dishId, groupId, option, checked, groupType) => {
    setOrder(prevOrder =>
      prevOrder.map(dish => {
        if (dish.id !== dishId) return dish;

        // check if this group already exists
        const groupExists = dish.dishOptionGroups.some(g => g.id === groupId);

        let updatedGroups;

        if (groupExists) {
          // update existing group
          updatedGroups = dish.dishOptionGroups.map(group => {
            if (group.id !== groupId) return group;

            if (groupType === "choice") {
              // Only one option allowed
              return {
                ...group,
                dishOptions: [{ id: option.id, price: option.price }]
              };
            }

            // For independent (checkbox)
            if (checked) {
              // Add if not already there
              if (!group.dishOptions.some(opt => opt.id === option.id)) {
                return {
                  ...group,
                  dishOptions: [...group.dishOptions, { id: option.id, price: option.price }]
                };
              }
              return group;
            } else {
              // Remove if unchecked
              return {
                ...group,
                dishOptions: group.dishOptions.filter(opt => opt.id !== option.id)
              };
            }
          });
        } else {
          // create new group if missing
          updatedGroups = [
            ...dish.dishOptionGroups,
            {
              id: groupId,
              type: groupType,
              dishOptions: checked ? [{ id: option.id, price: option.price }] : []
            }
          ];
        }

        return {
          ...dish,
          dishOptionGroups: updatedGroups
        };
      })
    );
  };
  
  const saveOrder = async () => {
    const filtered = order.filter((o) => o.isOrdered);
    const unstamped = filtered.map((o) => ({...o, id: o.id.replace('_', '')}));
    const payload = {restaurantId: restaurantId, items: unstamped};
    if (unstamped.length == 0) {
      alert('Niste izabrali nista da bi dodali u korpu!');
      return;
    }

    try {
      setLoading(true);
      const response = await createOrder(payload);
      setError('');
      alert('Porudzbina je dodata u korpu');
      navigate('/cart');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('Niste uneli validne podatke.');
        } else if (error.response.status === 404) {
          setError('Pogresna ruta.');
        } else if (error.response.status === 401) {
          setError('Ova stranica je rezervisana samo za prijavljene kupce.');
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

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const data = await dishService.getMenuByid(menuId);
      setRestaurantId(data.restaurantId);
      setDishes(data.dishes || []);
      setOffers(data.offers || []);
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
  }, [menuId]);

  useEffect(() => {
    if (!offerAddedNotify || offerAddedNotify.ind == 0) return;
    setNotifyWindowOpen(true);

    const t = setTimeout(() => {
      setNotifyWindowOpen(false);
    }, 1500);

    return () => clearTimeout(t);
  }, [offerAddedNotify]);

  const grouped = dishes.reduce((a, dish) => {
    if (!a[dish.type]) a[dish.type] = [];
    a[dish.type].push(dish);
    return a;
  }, {});

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return (
    <div style={{ padding: "1rem 3rem", position: 'relative' }}>
      <h1 style={{ marginBottom: "0", fontStyle: 'italic', textAlign: 'center', color: '#694d27'}}>
        <span style={{padding: '0.5rem 12rem', backgroundColor: '#d3b996ff', borderBottomLeftRadius: '60px', borderBottomRightRadius: '60px'}}>
        Glavni Menu</span>
      </h1>

      <button className="to-restaurant-btn" onClick={(e) => navigate(`/restaurants/${restaurantId}/overview`)}>Poseti stranicu restorana</button>

      <div className="offers-container">
        <h2>🔥 Aktuelne Ponude 🔥</h2>

        {offers.length == 0 ? <p>Nema aktuelnih ponuda.</p> : <div className="offers-row">
          <div className={`menu-offer-slide-btn-container ${firstOfferIndex == 0 ? "hidden" : ""}`}>
            <button type="button" className="slide-btn left-slider" onClick={() => setFirstOfferIndex((prev) => prev - 4)}>&lt;</button>
          </div>
          
          {offers.filter((o) => o.offerDishes?.length > 0).map((offer, i) => 
            ((i >= firstOfferIndex && (i <= firstOfferIndex + 3))
            && <OfferCard key={offer.id} offer={offer} isInMenu={true} isOwnerHere={false} isCustomer={isCustomer} addToOrder={addOfferToOrder}/>
          ))}
          <div className={`menu-offer-slide-btn-container 
            ${firstOfferIndex >= (offers ? offers.filter((o) => o.offerDishes?.length > 0).length - 4 : firstOfferIndex) ? "hidden" : ""}`}>
            <button type="button" className="slide-btn right-slider" onClick={() => setFirstOfferIndex((prev) => prev + 4)}>&gt;</button>
          </div>
        </div>}
      </div>

      {Object.keys(grouped).map((type) => (
        <div className="dish-type-row" key={type} style={{ marginBottom: "30px" }}>
          <h2>{type}</h2>
          <div className="dishes-row">
            {grouped[type].map((dish) => (
              <div className="dish-n-order-wrapper" key={dish.id}>
                <DishCard  dish={dish} isInMenu={true} isOwnerHere={false} isCustomer={isCustomer} 
                  clickForOrder={handleClickForOrder} highlighted={highlightDishId == dish.id}></DishCard>
                <div className={(isCustomer && pickedId == dish.id) ? "dish-order-window" : "hidden"} key={pickedId == dish.id ? `${dish.id}-open` : `${dish.id}-closed`}>
                  <section className="section-row" style={{justifyContent: 'flex-start', width: 'fit-content'}}>
                    <label>Broj porcija:</label>
                    <input type="number" min='1' defaultValue='1' onChange={(e) => updateDishInOrder(dish.id, { quantity: Number(e.target.value) })} />
                  </section>
                    <section className="section-row" style={{justifyContent: 'flex-start'}}>
                      {dish.dishOptionGroups.map((g) => (
                        g.type == 'choice' &&
                        <div key={g.id}>
                          <h3>{g.name}</h3>
                        <section className="section-row">
                        {g.dishOptions.map((o) => (
                          <section key={o.id} className="section-row">
                            <input type="radio" name={`radio-${g.id}`} onChange={(e) => 
                              updateGroupsInOrder(dish.id, g.id, o, e.target.checked, g.type)}/>
                            <label>{o.name} +<strong>{o.price}</strong>RSD</label>
                          </section>
                        ))}
                        </section>
                        </div>
                      ))}
                    </section>
                    <section className="section-row" style={{justifyContent: 'flex-start'}}>
                      {dish.dishOptionGroups.map((g) => (
                        g.type == 'independent' && 
                        <div key={g.id}>
                          <h3>{g.name}</h3>
                        <section className="section-row">
                        {g.dishOptions.map((o) => (
                          <section key={o.id} className="section-row">
                            <input type="checkbox" name={`checkbox-${g.id}`} onChange={(e) => 
                              updateGroupsInOrder(dish.id, g.id, o, e.target.checked, g.type)}/>
                            <label>{o.name} +<strong>{o.price}</strong>RSD</label>
                          </section>
                        ))}
                        </section>
                        </div>
                      ))}
                    </section>
                  <button onClick={() => {
                    const isAllergic = dish.allergens.some((a) => (myAllergens && myAllergens.includes(a.id)))
                    if (isAllergic) {
                      window.alert(`Vi ste alergicni na ovaj proizvod, da li ste sigurni da zelite da ga dodate?`);
                      return;
                    }
                    else {
                      if (!window.confirm(`Dodaj u korpu?`)) return;
                    }
                    updateDishInOrder(dish.id, { id: dish.id + "_", isOrdered: true }) //Adding a stamp
                    setPickedId("");
                  }} className="create-button">Dodaj</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button className={!isCustomer ? "hidden" : "menu-order-btn buttons edit-btn"} onClick={e => saveOrder()}>
          Poruči{(order && order.filter(o => o.isOrdered).length > 0) && `(${order.filter(o => o.isOrdered).length})`}
      </button>

      <div className={`offer-added-notify ${notifyWindowOpen ? "" : "hidden"}`}>
        <p>{offerAddedNotify.quantity}</p>
      </div>
    </div>
  );
};

export default MenuPage;
