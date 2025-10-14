import React, { useState, useEffect } from "react";
import "../../styles/userControlPanel.scss";
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
  const [profilePictureBase64, setProfilePictureBase64] = useState(null);
  const [profilePictureMimeType, setProfilePictureMimeType] = useState(null);

  // 🔄 Učitavanje podataka
  useEffect(() => {
    (async () => {
      const prof = await userService.getProfile();
  
      // Ako backend vraća imageBase64 i mimeType
      if (prof.
        profilePictureBase64 && prof.profilePictureMimeType) {
        prof.imageUrl = `data:${prof.profilePictureMimeType};base64,${prof.profilePictureBase64}`;
      }
  
      setProfile(prof);
      setUser(prof);
  
      const allergens = await userService.getAllergens();
      setAlergens(allergens.map(a => ({ ...a, selected: false })));
  
      const addresses = await userService.getMyAddresses();
      setCurrentAddress({ addresses });
    })();
  }, []);

  // ✏️ Izmena korisnika
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUser((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      ...user,
      profilePictureBase64,
      profilePictureMimeType
    };
  
    console.log("Payload:", payload);
  
    await userService.updateProfile(payload);
  
    // povuci novi profil sa servera
    const updated = await userService.getProfile();
  
    if (updated.profilePictureBase64 && updated.profilePictureMimeType) {
      updated.imageUrl = `data:${updated.profilePictureMimeType};base64,${updated.profilePictureBase64}`;
    }
    sessionStorage.setItem("myProfile", JSON.stringify(updated));
    setProfile(updated);
    setUser(updated);
    window.location.reload(); // osvezi stranicu da se vide izmene
  };
  

  // 🧬 Alergeni
  const toggleAlergen = (id) => {
    setAlergens((prev) =>
      prev.map((a) => (a.id === id ? { ...a, selected: !a.selected } : a))
    );
  };

  const handleSubmitAlergens = async (e) => {
    e.preventDefault();
    const selectedIds = alergens.filter((a) => a.selected).map((a) => a.id);
  
    try {
      await userService.putMyAllergens({ allergenIds: selectedIds });
      console.log("Alergeni uspešno sačuvani!");
    } catch (err) {
      console.error("Greška pri čuvanju alergena:", err);
    }
  };

  // 📍 Adrese

  const refreshAddresses = async () => {
    const addresses = await userService.getMyAddresses();
    setCurrentAddress({ addresses });
  };


  const handleAddAddress = async (e) => {
  e.preventDefault();
  await userService.addAddress(newAddress);
  await refreshAddresses();
  setNewAddress({ streetAndNumber: "", city: "", postalCode: "" });
};

const handleUpdateAddress = async (e) => {
  e.preventDefault();
  await userService.updateAddress(editingAddress.id, newAddress);
  await refreshAddresses();
  setEditingAddress(null);
  setNewAddress({ streetAndNumber: "", city: "", postalCode: "" });
};

const handleDeleteAddress = async (id) => {
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
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      setProfilePictureBase64={setProfilePictureBase64}
      setProfilePictureMimeType={setProfilePictureMimeType}
      alergens={alergens}
      toggleAlergen={toggleAlergen}
      handleSubmitAlergens={handleSubmitAlergens}
      currentAddress={currentAddress}
      handleEditAddress={handleEditAddress}
      handleDeleteAddress={handleDeleteAddress}
      newAddress={newAddress}
      setNewAddress={setNewAddress}
      editingAddress={editingAddress}
      setEditingAddress={setEditingAddress}
      handleAddAddress={handleAddAddress}
      handleUpdateAddress={handleUpdateAddress}
    />
  );
}
