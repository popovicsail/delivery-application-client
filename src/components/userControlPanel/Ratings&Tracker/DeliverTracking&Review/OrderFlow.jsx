import React, { useEffect, useState } from "react";
import DeliveryTracking from "./steps/DeliveryTrackings.jsx";
import RatingForm from "./steps/RatingForm.jsx";
import "../../../../styles/orderFlow.scss";

export default function OrderFlow() {
  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState(localStorage.getItem("orderId"));
  const [courierId, setCourierId] = useState(localStorage.getItem("courierId"));
  const [restaurantId, setRestaurantId] = useState(localStorage.getItem("restaurantId"));

  // Resetuj flow kad se sve završi
  useEffect(() => {
    if (step === 4) {
      const timeout = setTimeout(() => {
        localStorage.removeItem("orderId");
        localStorage.removeItem("courierId");
        localStorage.removeItem("restaurantId");
        setOrderId(null);
        setCourierId(null);
        setRestaurantId(null);
        setStep(1);
      }, 5000); // 3 sekunde pauze pre resetovanja

      return () => clearTimeout(timeout);
    }
  }, [step]);

  // Ako nema orderId, prikazuj poruku da se čeka nova porudžbina
  if (!orderId) {
    return (
      <div className="order-rating-wizard">
        <p>🕓 Čekamo novu porudžbinu...</p>
      </div>
    );
  }

  return (
    <div className="order-rating-wizard">
      {/* Stepper vizuelno */}
      <div className="wizard-steps">
        <div className={`step ${step >= 1 ? "active" : ""}`}>1. Praćenje</div>
        <div className={`step ${step >= 2 ? "active" : ""}`}>2. Kurir</div>
        <div className={`step ${step >= 3 ? "active" : ""}`}>3. Restoran</div>
      </div>

      {/* Step content */}
      {step === 1 && (
        <DeliveryTracking onCompleted={() => setStep(2)} />
      )}

      {step === 2 && (
        <RatingForm
          orderId={orderId}
          targetId={courierId}
          targetType="courier"
          onSuccess={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <RatingForm
          orderId={orderId}
          targetId={restaurantId}
          targetType="restaurant"
          onSuccess={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <p>✅ Hvala na ocenama! Vaša porudžbina je kompletno zatvorena.</p>
      )}
    </div>
  );
}
