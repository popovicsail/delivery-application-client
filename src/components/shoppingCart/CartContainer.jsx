import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import CartModal from "./CartModal"; // pretpostavljam da je u istom folderu
import { useCart } from "./CartContext";
import MenuPage from "../../pages/Menus/MenuPage.jsx";
import * as userService from "../../services/user.services.jsx";

export default function CartContainer({
  onCreateItems,
  onUpdateDetails,
  onConfirmOrder,
  orderId
}) {
  const {
    items,
    total,
    removeFromCart,
    selectedVoucherId,
    setSelectedVoucherId
  } = useCart();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [vouchersState, setVouchersState] = useState([]);

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const openModal = () => {
    setIsModalOpen(true);
    setStep(1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStep(1);
  };

useEffect(() => {
    const fetchAddressesAndVouchers = async () => {
      try {
        const addrs = await userService.getMyAddresses();
        const vouchs = await userService.getMyVouchers();
        setAddresses(addrs);
        setVouchersState(vouchs);
      } catch (error) {
        console.error("Greška pri učitavanju adresa i vaučera:", error);
      }
    };

    fetchAddressesAndVouchers();
  }, []);

  return (
    <>
      <Button variant="outlined" onClick={openModal}>
        🛒 Poruči
      </Button>

      <CartModal
        isOpen={isModalOpen}
        onClose={closeModal}
        step={step}
        nextStep={nextStep}
        prevStep={prevStep}
        items={items}
        total={total}
        removeFromCart={removeFromCart}
        selectedVoucherId={selectedVoucherId}
        setSelectedVoucherId={setSelectedVoucherId}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        setSelectedAddressId={setSelectedAddressId}
        vouchers={vouchersState}
        orderId={orderId}
        onCreateItems={onCreateItems}
        onUpdateDetails={onUpdateDetails}
        onConfirmOrder={onConfirmOrder}
      />
    </>
  );
}
