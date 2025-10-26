import React from "react";
import ProfileView from "./ProfileView";
import EditUserForm from "./EditUserForm";
import AllergensContainer from "./AllergensContainer";
import AddressView from "./AddressView";
import CourierTabContainer from "./Courier/CourierTabContainer.jsx";
import VoucherList from "../customerComponents/VoucherList";

export default function AccountPanel({
  activeTab,
  setActiveTab,
  profile,
  user,
  handleSubmit,
  handleInputChange,
  setProfilePictureFile,
  currentAddress,
  handleEditAddress,
  handleDeleteAddress,
  newAddress,
  setNewAddress,
  editingAddress,
  setEditingAddress,
  handleAddAddress,
  handleUpdateAddress,
  isAdmin,
  isCourier,
  vouchers,
  isCustomer,
}) {
  const isActive = (tab) => (activeTab === tab ? "active" : "");

  return (
    <div className={`account-panel ${isAdmin ? "admin" : ""}`}>
      <aside className="sidebar">
        <ul>
          <li className={isActive("profil-view")} onClick={() => setActiveTab("profil-view")}>Profil</li>
          {isCustomer && (
            <li className={isActive("izmeni-podatke-form")} 
            onClick={() => setActiveTab("izmeni-podatke-form")}>Izmeni podatke
            </li>
            )}
            {isCustomer && (
            <li className={isActive("alergen-view")}
            onClick={() => setActiveTab("alergen-view")}>Alergeni
            </li>
            )}
            {isCustomer && (
            <li className={isActive("adrese-view")}
            onClick={() => setActiveTab("adrese-view")}>Adrese
            </li>
            )}

            {isCourier && (
            <li className={isActive("courier-view")}
            onClick={() => setActiveTab("courier-view")}>Kurir
            </li>
            )}

            {isCustomer && (
            <li className={isActive("voucher-list")}
            onClick={() => setActiveTab("voucher-list")}>Vouchers
            </li>
            )}
        </ul>
      </aside>

      <main className="content">
        <ProfileView profile={profile} active={isActive("profil-view")} />

        {isCustomer && (
          <EditUserForm
            user={user}
            active={isActive("izmeni-podatke-form")}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            setProfilePictureFile={setProfilePictureFile}
          />
        )}

        {isCustomer && <AllergensContainer 
        active={isActive("alergen-view")} />}

        {isCustomer && (
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
        )}

        {isCourier && (<CourierTabContainer active={isActive("courier-view")} />)}

        {!isAdmin && isCustomer && (<VoucherList vouchers={vouchers} active={isActive("voucher-list")}/>)}
      </main>
    </div>
  );
}
