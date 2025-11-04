import React from "react";
import ProfileView from "./ProfileView";
import EditUserForm from "./EditUserForm";
import AllergensContainer from "./AllergensContainer";
import AddressView from "./AddressView";
import CourierTabContainer from "./Courier/CourierTabContainer.jsx";
import CourierDeliveries from "./Courier/CourierDeliveries.jsx";
import VoucherList from "../customerComponents/VoucherList";
import WorkersRestaurant from "../../pages/WorkersRestaurant.jsx";
import RestaurantOrders from "./Owner/RestaurantOrders.jsx";

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
  isOwner,
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

            {isCourier && (
            <li className={isActive("courier-delivery")}
            onClick={() => setActiveTab("courier-delivery")}>Dostave
            </li>
            )}

            {isCustomer && (
            <li className={isActive("voucher-list")}
            onClick={() => setActiveTab("voucher-list")}>Vaučeri
            </li>
            )}

            {isOwner && (
            <li className={isActive("workers-restaurant")}
            onClick={() => setActiveTab("workers-restaurant")}>Radnici
            </li>
            )}

            {isOwner && (
              <li
                className={isActive("owner-orders")}
                onClick={() => setActiveTab("owner-orders")}
              >
                Porudžbine restorana
              </li>
            )}
        </ul>
      </aside>

      <main className="content">
        {activeTab == "profil-view" && 
        <ProfileView profile={profile} active={isActive("profil-view")} />}

        {isCustomer && activeTab == "izmeni-podatke-form" && (
          <EditUserForm
            user={user}
            active={isActive("izmeni-podatke-form")}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            setProfilePictureFile={setProfilePictureFile}
          />
        )}

        {isCustomer && activeTab == "alergen-view" && <AllergensContainer 
        active={isActive("alergen-view")} />}

        {isCustomer && activeTab == "adrese-view" && (
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

        {isCourier && activeTab == "courier-view" && (<CourierTabContainer active={isActive("courier-view")} />)}

        {!isAdmin && isCustomer && activeTab == "voucher-list" && (<VoucherList vouchers={vouchers} active={isActive("voucher-list")}/>)}

        {isOwner && activeTab == "workers-restaurant" && (<WorkersRestaurant isOwner={isOwner} />)}
        
        {isCourier && (<CourierDeliveries active={isActive("courier-delivery")} />)}
        
        {isOwner && (<RestaurantOrders user={user} active={isActive("owner-orders")}/>)}
      </main>
    </div>
  );
}
