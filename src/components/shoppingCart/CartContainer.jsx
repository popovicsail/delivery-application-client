import React, { useState, useEffect, use } from "react";
import CartView from "./CartView";
import { useNavigate } from "react-router-dom";
import * as userService from "../../services/user.services.jsx";
import { updateUserData, deleteItem, deleteOrder, getMyDraft } from "../../services/order.services.jsx"
 
export default function CartContainer() {
  const [addresses, setAddresses] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [draftOrder, setDraftOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const userId = JSON.parse(sessionStorage.getItem('myProfile')) && JSON.parse(sessionStorage.getItem('myProfile'))?.user?.id;
  const navigate = useNavigate();

  const handleRemoveFromCart = async (id) => {
    if (!window.confirm(`Da li ste sigurni da zelite da uklonite stavku?`)) return;
    try {
      setLoading(true);
      const response = await deleteItem(id);
      setRefreshKey((prev) => prev + 1);
      setError('');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError('Nije pronadjena stavka.');
        } else if (error.response.status === 401) {
          setError('Ova stranica je rezervisana samo za customere.');
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

  const handleDeleteOrder = async (id) => {
    if (!window.confirm(`Da li ste sigurni da zelite da otkazete porudzbinu?`)) return;
    try {
      setLoading(true);
      const response = await deleteOrder(id);
      setRefreshKey((prev) => prev + 1);
      setError('');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError('Nije pronadjena porudzbina.');
        } else if (error.response.status === 401) {
          setError('Ova stranica je rezervisana samo za customere.');
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

  const handleSubmit = async (data, id) => {
    if (!window.confirm(`Da li ste sigurni da zelite da zavrsite porudzbinu?`)) return;
    try {
      setLoading(true);
      const response = await updateUserData(data, id);
      setRefreshKey((prev) => prev + 1);
      setError('');
      alert('Porudzbina je zavrsena');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError('Nije pronadjena porudzbina, ili adresa, ili vaucer.');
        } else if (error.response.status === 401) {
          setError('Ova stranica je rezervisana samo za customere.');
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
    // Fetch vouchers for the customer
    async function fetchVouchers() {
      try {
        const data = await userService.getMyVouchers(userId);
        
        setVouchers(data.filter((v) => (v.status == "Active")));
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      }
    }
    async function fetchAddress() {
      try {
        const data = await userService.getMyAddresses(userId);
        setAddresses(data);
        console.log('Fetched addresses:', data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    }

    async function fetchItems() {
      try {
        const data = await getMyDraft();
        setDraftOrder(data);
        console.log('Fetched cart items', data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    }


    fetchItems();
    fetchAddress();
    fetchVouchers();

  }, [userId, refreshKey]);


  if (draftOrder) {

    return (
      <CartView
      draftOrder={draftOrder}
      removeFromCart={handleRemoveFromCart}
      cancelOrder={handleDeleteOrder}
      vouchers={vouchers}
      addresses={addresses}
      onSubmit={handleSubmit}
      error={error}
      loading={loading}
      />
    );
  }
  else {
    return (
      <div className="cart">
        <h3>Korpa je prazna</h3>
        <button onClick={(e) => navigate("/dishesSearch")}>Nazad na kupovinu</button>
      </div>
    )
  }
}
