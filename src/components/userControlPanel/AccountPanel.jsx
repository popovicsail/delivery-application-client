import ProfileView from "./ProfileView";
import EditUserForm from "./EditUserForm";
import AllergenView from "./AllergenView";
import AddressView from "./AddressView";
import React from "react";

export default function AccountPanel({
  activeTab,
  setActiveTab,
  profile,
  user,
  handleSubmit,
  handleInputChange,
  setProfilePictureBase64,
  setProfilePictureMimeType,
  alergens,
  toggleAlergen,
  handleSubmitAlergens,
  currentAddress,
  handleEditAddress,
  handleDeleteAddress,
  newAddress,
  setNewAddress,
  editingAddress,
  setEditingAddress,
  handleAddAddress,
  handleUpdateAddress
}) {
  const isActive = (tab) => (activeTab === tab ? "active" : "");

  return (
    <div className="account-panel">
      <aside className="sidebar">
        <ul>
          <li className={isActive("profil-view")} onClick={() => setActiveTab("profil-view")}>Profil</li>
          <li className={isActive("izmeni-podatke-form")} onClick={() => setActiveTab("izmeni-podatke-form")}>Izmeni podatke</li>
          <li className={isActive("alergen-view")} onClick={() => setActiveTab("alergen-view")}>Alergeni</li>
          <li className={isActive("adrese-view")} onClick={() => setActiveTab("adrese-view")}>Adrese</li>
        </ul>
      </aside>

      <main className="content">
        <ProfileView profile={profile} active={isActive("profil-view")} />
        <EditUserForm
          user={user}
          active={isActive("izmeni-podatke-form")}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          setProfilePictureBase64={setProfilePictureBase64}
          setProfilePictureMimeType={setProfilePictureMimeType}
        />
        <AllergenView
          alergens={alergens}
          toggleAlergen={toggleAlergen}
          handleSubmitAlergens={handleSubmitAlergens}
          active={isActive("alergen-view")}
        />
        <AddressView
          currentAddress={currentAddress}
          handleEditAddress={handleEditAddress}
          handleDeleteAddress={handleDeleteAddress}
          newAddress={newAddress}
          setNewAddress={setNewAddress}
          editingAddress={editingAddress}
          setEditingAddress={setEditingAddress}
          handleAddAddress={handleAddAddress}
          handleUpdateAddress={handleUpdateAddress}
          active={isActive("adrese-view")}
        />
      </main>
    </div>
  );
}