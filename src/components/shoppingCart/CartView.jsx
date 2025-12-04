import React, { useState, useEffect } from "react";
import { validateAddress } from "../../services/user.services.jsx";
import "../../styles/CartView.scss";
import { getExchangeRate } from "../../services/exchangeRate.services.jsx";

export default function CartView({
  draftOrder,
  removeFromCart,
  cancelOrder,
  vouchers,
  addresses,
  onSubmit,
  error,
  loading,
}) {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [addressValidation, setAddressValidation] = useState(null);
  const [validating, setValidating] = useState(false);

  const [baseCode, setBaseCode] = useState("RSD");
  const [exchangeInformation, setExchangeInformation] = useState(null);
  const [finalTotal, setFinalTotal] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(null);

  const handleSubmitCases = () => {
    if (!selectedAddress) {
      alert('Niste popunili adresu!');
      return;
    }
    onSubmit({voucherId: selectedVoucher ? selectedVoucher.id : null, addressId: selectedAddress ? selectedAddress.id : null}, draftOrder.id);        
    setSelectedVoucher(null);
    setSelectedAddress(null);
  }

  const discount = selectedVoucher ? selectedVoucher.discountAmount : 0;
  const badWeatherExtra = draftOrder?.isWeatherGood ? 0 : 200;

  useEffect(() => {
    if (draftOrder) {
      const total = Math.max((draftOrder.totalPrice || 0) - discount + badWeatherExtra, 0);
      setFinalTotal(total);
    }
  }, [draftOrder, discount, badWeatherExtra]);

  useEffect(() => {
    const fetchExchange = async () => {
      if (baseCode === "RSD") {
        setExchangeInformation(null);
        setConvertedAmount(null);
        return;
      }

      if (finalTotal > 0) {
        try {
          const data = await getExchangeRate(baseCode);
          setExchangeInformation(data);
          const rate = data?.rates?.["RSD"]; 
          
          if (rate) {
             const converted = (finalTotal / rate).toFixed(2);
             setConvertedAmount(converted);
          }

        } catch (err) {
          console.error("Greska sa kursom", err);
        }
      }
    };
    fetchExchange();
  }, [baseCode, finalTotal]);

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="cart">
      <h2>Vaša korpa</h2>

      <ul>
        {draftOrder && draftOrder.items.map(item => (
          <li key={item.id}>
            {item.quantity} x {`${item.name} `}
            = {(item.dishPrice + item.optionsPrice) * item.quantity - (item.discountRate > 0 && item.discountRate < 1
              && new Date(item.discountExpireAt) > new Date() ? item.discountRate * item.dishPrice * item.quantity : 0)}  RSD
            {item.discountRate > 0 && item.discountRate < 1
              && new Date(item.discountExpireAt) > new Date() ? <span style={{ textDecoration: 'underline' }}>(<b style={{ color: 'red' }}>-{item.discountRate * 100}%</b> <i>POPUST</i>)</span> : ` `}
            <button onClick={() => removeFromCart(item.id)}>Ukloni Stavku</button>
          </li>
        ))}
      </ul>

      {/* Adrese */}
      <label>
        Adresa za dostavu:
        <select
          required={true}
          value={selectedAddress?.id || ""}
          onChange={async (e) => {
            const addr = addresses?.find(v => v.id === e.target.value) || null;
            setSelectedAddress(addr);
            
            if (addr && draftOrder?.restaurant?.address) {
              const payload = {
                address: `${addr.streetAndNumber}, ${addr.city}`,
                restaurantCity: draftOrder.restaurant.address.city
              };
              
              setValidating(true);
              try {
                const result = await validateAddress(payload);
                setAddressValidation(result);
              } catch (err) {
                setAddressValidation({ isValid: false, message: "Greška pri validaciji" });
              } finally {
                setValidating(false);
              }
            } else {
              setAddressValidation(null);
            }
          }}
        >
          <option value=''>Izaberite Adresu</option>
          {addresses.map(addr => (
            <option key={addr.id} value={addr.id}>
              {addr.streetAndNumber}, {addr.city}
            </option>
          ))}
        </select>
        
        {validating && <span>Validacija adrese...</span>}
        {addressValidation && !addressValidation.isValid && (
          <span style={{ color: "red", display: "block", marginTop: "5px" }}>
            🚫 {addressValidation.message}
          </span>
        )}
      </label>

      {/* Vaučeri */}
      <label>
        Vaučer:
        <select
          value={selectedVoucher?.id || ""}
          onChange={(e) => setSelectedVoucher(vouchers?.find(v => v.id === e.target.value) || null)}
        >
          <option value="">Bez vaučera</option>
          {(vouchers || []).map(v => (
            <option key={v.id} value={v.id}>
              {v.name} - {v.discountAmount} RSD
            </option>
          ))}
        </select>
      </label>

      {/* Rezime */}
      <div className="cart-summary">
        <p>Ukupno stavke: {draftOrder ? `${draftOrder.totalPrice}` : `0`} RSD</p>
        
        {selectedVoucher && (
          <p style={{ color: "green" }}>
            Popust ({selectedVoucher.name}): -{discount} RSD
          </p>
        )}
        
        {badWeatherExtra > 0 && (
           <p style={{ color: "#d9534f" }}>
             +200 RSD (Naknada za loše vreme ☔)
           </p>
        )}

        {draftOrder?.isWeather && (
            <div style={{ color: "orange", fontWeight: "bold", margin: "10px 0" }}>
                ⚠️ Upozorenje: Vremenski uslovi mogu uticati na dostavu.
            </div>
        )}

        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
            <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Prikaži u valuti:</label>
            <select 
                value={baseCode} 
                onChange={(e) => setBaseCode(e.target.value)}
                style={{ padding: '5px', borderRadius: '4px' }}
            >
                <option value="RSD">RSD</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>            
            </select>
        </div>

        <section className="section-row" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
          <h3>
            Za plaćanje: {finalTotal} RSD 
            
            {convertedAmount && (
                <span style={{fontSize: '0.8em', color: '#000000ff', marginLeft: '10px', display:'block', marginTop:'5px'}}>
                    (= {convertedAmount} {baseCode})
                </span>
            )}
          </h3>
          
          <button className="buttons delete-btn" type="button" onClick={e => cancelOrder(draftOrder ? draftOrder.id : null)}>
            🛇 Otkaži
          </button>
        </section>
      </div>

      <button
        disabled={!addressValidation?.isValid || validating || !selectedAddress}
        onClick={handleSubmitCases}
        className="order-btn"
      >
        Pošalji porudžbinu
      </button>
    </div>
  );
}