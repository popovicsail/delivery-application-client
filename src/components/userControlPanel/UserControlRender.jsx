import React, { useState, useEffect } from "react";
import "../../styles/userControlPanel.scss";
import "../../styles/courierPanel.scss";
import AccountPanel from "./AccountPanel.jsx";
import * as userService from "../../services/user.services"; 

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profil-view");
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [alergens, setAlergens] = useState([]);
  const [currentAddress, setCurrentAddress] = useState({ addresses: [] });
  const [newAddress, setNewAddress] = useState({
    streetAndNumber: "",
    city: "",
    postalCode: ""
  });
  const [editingAddress, setEditingAddress] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  const isCustomer = user?.roles?.some(r => r.toLowerCase().includes("customer"));
  const isCourier = user?.roles?.some(r => r.toLowerCase().includes("courier"));
  const isAdmin = user?.roles?.some(r => r.toLowerCase().includes("administrator"));

  // 🔄 Učitavanje podataka
  useEffect(() => {
    (async () => {
      const prof = await userService.getProfile();

      if (prof.profilePictureBase64) {
        prof.imageUrl = prof.profilePictureBase64;
      }

      setProfile(prof);
      setUser(prof);
      console.log("Učitani podaci profila:", prof);

      if (prof.roles?.some(r => !r.toLowerCase().includes("customer"))) {
        setAlergens([]);
        setCurrentAddress({ addresses: [] });
        return;
      }
      if (prof.roles?.includes("Customer")) {
        const allergens = await userService.getAllergens();
        setAlergens(allergens.map(a => ({ ...a, selected: false })));
      }
      else {
        return;
      }
      const addresses = await userService.getMyAddresses();
      setCurrentAddress({ addresses });
    })();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUser((prev) => ({ ...prev, [id]: value }));
  };

  // ✏️ Izmena korisnika
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCustomer) {
      console.log("Nije 'Customer' – preskačem update profila (200 OK fallback)");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", user.firstName);
    formData.append("lastName", user.lastName); 
    formData.append("email", user.email);

    if (profilePictureFile) {
      formData.append("ProfilePictureBase64", profilePictureFile);
    }
    console.log("Ažuriranje profila sa podacima: ", {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePictureFile
    });

    await userService.updateProfile(formData);

    const updated = await userService.getProfile();
    if (updated.profilePictureBase64) {
      updated.imageUrl = updated.profilePictureBase64;
    }
    setProfile(updated);
    setUser(updated);
    window.location.reload();
  };

  // 🧬 Alergeni
  const toggleAlergen = (id) => {
    setAlergens((prev) =>
      prev.map((a) => (a.id === id ? { ...a, selected: !a.selected } : a))
    );
  };

  const handleSubmitAlergens = async (e) => {
    e.preventDefault();
    if (!isCustomer) {
      console.log("Nije 'Customer' – preskačem čuvanje alergena (200 OK fallback)");
      return;
    }

    const selectedIds = alergens.filter((a) => a.selected).map((a) => a.id);

    try {
      await userService.putMyAllergens({ allergenIds: selectedIds });
      sessionStorage.setItem('myAllergens', JSON.stringify(selectedIds));
      console.log("Alergeni uspešno sačuvani!");
    } catch (err) {
      console.error("Greška pri čuvanju alergena:", err);
    }
  };

  // 📍 Adrese
  const refreshAddresses = async () => {
    if (!isCustomer) {
      console.log("Nije 'Customer' – preskačem refresh adresa (200 OK fallback)");
      setCurrentAddress({ addresses: [] });
      return;
    }
    const addresses = await userService.getMyAddresses();
    setCurrentAddress({ addresses });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!isCustomer) {
      console.log("Nije 'Customer' – preskačem dodavanje adrese (200 OK fallback)");
      return;
    }

    await userService.addAddress(newAddress);
    await refreshAddresses();
    setNewAddress({ streetAndNumber: "", city: "", postalCode: "" });
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    if (!isCustomer) {
      console.log("Nije 'Customer' – preskačem update adrese (200 OK fallback)");
      return;
    }

    await userService.updateAddress(editingAddress.id, newAddress);
    await refreshAddresses();
    setEditingAddress(null);
    setNewAddress({ streetAndNumber: "", city: "", postalCode: "" });
  };

  const handleDeleteAddress = async (id) => {
    if (!isCustomer) {
      console.log("Nije 'Customer' – preskačem brisanje adrese (200 OK fallback)");
      return;
    }
    await userService.deleteAddress(id);
    await refreshAddresses();
  };

  const handleEditAddress = (addr) => {
    setEditingAddress(addr);
    setNewAddress(addr);
  };

  return (
    <AccountPanel
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      profile={profile}
      user={user}
      isCustomer={isCustomer}
      isAdmin={isAdmin}
      isCourier={isCourier}
      handleSubmit={handleSubmit}
      setProfilePictureFile={setProfilePictureFile}
      alergens={alergens}
      toggleAlergen={toggleAlergen}
      handleSubmitAlergens={handleSubmitAlergens}
      currentAddress={currentAddress}
      handleEditAddress={handleEditAddress}
      handleDeleteAddress={handleDeleteAddress}
      handleInputChange={handleInputChange}
      newAddress={newAddress}
      setNewAddress={setNewAddress}
      editingAddress={editingAddress}
      setEditingAddress={setEditingAddress}
      handleAddAddress={handleAddAddress}
      handleUpdateAddress={handleUpdateAddress}
    />
  );
}
