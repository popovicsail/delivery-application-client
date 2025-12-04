import React, {useEffect} from "react";
import ProfileView from "./ProfileView";
import EditUserForm from "./EditUserForm";
import AllergensContainer from "./AllergensContainer";
import AddressView from "./AddressView";
import CourierTabContainer from "./Courier/CourierTabContainer.jsx";
import CourierDeliveries from "./Courier/CourierDeliveries.jsx";
import VoucherList from "../customerComponents/VoucherList";
import RestaurantOrders from "./Owner/RestaurantOrders.jsx";
import DeliveryHistory from "./Ratings&Tracker/DeliveryHistory.jsx";
import OrderFlow from "./Ratings&Tracker/DeliverTracking&Review/OrderFlow.jsx";
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();
  
  useEffect(() => {
    if (location.state && location.state !== activeTab) {
      setActiveTab(location.state);
    }
  }, [location.state]);

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
              <li
                className={isActive("owner-orders")}
                onClick={() => setActiveTab("owner-orders")}
              >
                Porudžbine restorana
              </li>
            )}

            {isCustomer && (
              <li
                className={isActive("prati-dostavu")}
                onClick={() => setActiveTab("prati-dostavu")}
              >
                Prati dostavu
              </li>
            )}
            
            {isCourier && (
              <li
                className={isActive("istorija-kurir")}
                onClick={() => setActiveTab("istorija-kurir")}
              >
                🚴 Istorija dostava
              </li>
            )}

            {isCustomer && (
              <li
                className={isActive("istorija-dostava")}
                onClick={() => setActiveTab("istorija-dostava")}
              >
                🚴 Istorija dostava
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
        
        {isCourier && (<CourierDeliveries active={isActive("courier-delivery")} />)}
        
        {isOwner && (<RestaurantOrders user={user} active={isActive("owner-orders")}/>)}
        
         {/* ✅ novi wizard za praćenje i ocenjivanje */}
        {isCustomer && activeTab === "prati-dostavu" && (
          <OrderFlow order={user?.lastOrder} />
        )}

        {isCustomer && activeTab === "istorija-dostava" && (
          <DeliveryHistory 
            active={isActive("istorija-dostava")} 
            role="customer" 
            userId={user?.id} 
          />
        )}

        {isCourier && activeTab === "istorija-kurir" && (
          <DeliveryHistory 
            active={isActive("istorija-kurir")} 
            role="courier" 
            userId={user?.courierId} 
          />
        )}


      </main>
    </div>
  );
}
