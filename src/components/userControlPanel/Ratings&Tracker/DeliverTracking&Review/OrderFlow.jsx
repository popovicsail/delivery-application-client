import React, { useEffect, useState } from "react";
import DeliveryTracking from "./steps/DeliveryTrackings.jsx"; // komponenta za praćenje statusa
import RatingForm from "./steps/RatingForm.jsx";
import "../../../../styles/orderFlow.scss";
import * as RatingService from "../../../../services/rating.services.jsx";

export default function OrderFlow() {
  const [step, setStep] = useState(1);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // dodato za ručni refresh
  const orderId = localStorage.getItem("orderId");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const customerOrder = await RatingService.getCustomerOrder(orderId);
        setOrder(customerOrder);
      } catch (err) {
        console.error("Greška pri dobavljanju porudžbine:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <p>⏳ Učitavam porudžbinu...</p>;
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
        <>
          <DeliveryTracking
            order={order}
            onCompleted={() => setStep(2)}
            refreshKey={refreshKey} // prosleđujemo refreshKey
          />
          <button onClick={() => setRefreshKey(prev => prev + 1)}>
            🔄 Ručno osveži status
          </button>
        </>
      )}

      {step === 2 && (
        <RatingForm
          orderId={order.id}
          targetId={order.courierId}
          targetType="courier"
          onSuccess={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <RatingForm
          orderId={order.id}
          targetId={order.restaurantId}
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
