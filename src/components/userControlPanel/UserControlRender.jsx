import React, { useState, useEffect } from "react";
import "../../styles/userControlPanel.scss";
import "../../styles/courierPanel.scss";
import AccountPanel from "./AccountPanel.jsx";
import * as userService from "../../services/user.services";
import VoucherList from "../customerComponents/VoucherList.jsx";

export default function ProfilePage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profil-view");
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [alergens, setAlergens] = useState([]);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [vouchers, setVouchers] = useState(null);

  const xRoles = JSON.parse(sessionStorage.getItem('myProfile')).roles;
  const isCustomer = xRoles?.some(r => r.toLowerCase().includes("customer"));
  const isCourier = xRoles?.some(r => r.toLowerCase().includes("courier"));
  const isAdmin = xRoles?.some(r => r.toLowerCase().includes("administrator"));
  const isOwner = xRoles?.some(r => r.toLowerCase().includes("owner"));

  useEffect(() => {
    (async () => {
      const prof = await userService.getProfile();

      if (prof.profilePictureBase64) {
        prof.imageUrl = prof.profilePictureBase64;
      }

      setProfile(prof);
      setUser(prof);
      console.log("Učitani podaci profila:", prof);

      if (!isCustomer) return;

      try {
        setLoading(true);
        const allergens = await userService.getAllergens();
        const vouchers = await userService.getMyVouchers();
        setAlergens(allergens.map((a) => ({ ...a, selected: false })));
        setVouchers(vouchers);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        setError("Pogrešna ruta.");
      } else if (error.response.status === 401) {
        setError("Ova stranica je rezervisana samo za prijavljene korisnike.");
      } else if (error.response.status === 500) {
        setError("Greška na serveru. Pokušajte kasnije.");
      } else {
        setError(`Greška: ${error.response.status}`);
      }
    } else if (error.request) {
      setError("Nema odgovora sa servera.");
    } else {
      setError("Došlo je do greške.");
    }
    console.error("Greška:", error.message);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUser((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCustomer) return;

    const formData = new FormData();
    formData.append("firstName", user.firstName);
    formData.append("lastName", user.lastName);
    formData.append("email", user.email);

    if (profilePictureFile) {
      formData.append("ProfilePictureBase64", profilePictureFile);
    }

    try {
      setLoading(true);
      await userService.updateProfile(formData);
      setError("");
      alert("Uspešno ste izmenili profil");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }

    const updated = await userService.getProfile();
    if (updated.profilePictureBase64) {
      updated.imageUrl = updated.profilePictureBase64;
    }
    setProfile(updated);
    setUser(updated);
    window.location.reload();
  };

  const toggleAlergen = (id) => {
    setAlergens((prev) =>
      prev.map((a) => (a.id === id ? { ...a, selected: !a.selected } : a))
    );
  };

  const handleSubmitAlergens = async (e) => {
    e.preventDefault();
    if (!isCustomer) return;

    const selectedIds = alergens.filter((a) => a.selected).map((a) => a.id);

    try {
      setLoading(true);
      await userService.putMyAllergens({ allergenIds: selectedIds });
      sessionStorage.setItem('myAllergens', JSON.stringify(selectedIds));
      console.log("Alergeni uspešno sačuvani!");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <AccountPanel
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      profile={profile}
      user={user}
      isCustomer={isCustomer}
      isAdmin={isAdmin}
      isOwner={isOwner}
      isCourier={isCourier}
      handleSubmit={handleSubmit}
      setProfilePictureFile={setProfilePictureFile}
      alergens={alergens}
      toggleAlergen={toggleAlergen}
      handleSubmitAlergens={handleSubmitAlergens}
      handleInputChange={handleInputChange}
      vouchers={vouchers}
    />
  );
}
