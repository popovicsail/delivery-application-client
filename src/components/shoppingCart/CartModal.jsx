import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stepper,
  Step,
  StepLabel
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as orderService from "../../services/order.services.jsx";

export default function CartModal({
  isOpen,
  onClose,
  step,
  nextStep,
  prevStep,
  items,
  total,
  removeFromCart,
  selectedVoucherId,
  setSelectedVoucherId,
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  vouchers,
  onCreateItems,
  onUpdateDetails,
  onConfirmOrder
}) {
  const [orderId, setOrderId] = React.useState(null);

  const selectedVoucher = (vouchers || []).find(v => v.id === selectedVoucherId);
  const discount = selectedVoucher ? selectedVoucher.discountAmount : 0;
  const finalTotal = Math.max(total - discount, 0);
  const steps = ["Stavke", "Adresa i vaučer", "Pregled i potvrda"];
  const profile = JSON.parse(sessionStorage.getItem("myProfile") || "{}");
  const restaurantId = items[0]?.restaurantId;
  const customerid = profile.user.id??null;



  const payload = {
    customerId: customerid,
    restaurantId: restaurantId,
    items: items.map(item => ({
      dishId: item.originalId,
      dishName: item.name, // 👈 obavezno polje
      quantity: Number(item.quantity) || 1,
      price: item.price,
      dishOptionGroups: item.dishOptionGroups.map(group => ({
        groupId: group.id,
        dishOptions: group.dishOptions.map(opt => ({
          optionId: opt.id
        }))
      }))
    }))
  };

  return (
<Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
  <DialogTitle>
    Porudžbina — korak {step}/3
    <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <Stepper activeStep={step - 1} alternativeLabel sx={{ mt: 2, mb: 2 }}>
    {steps.map(label => (
      <Step key={label}>
        <StepLabel>{label}</StepLabel>
      </Step>
    ))}
  </Stepper>

  <DialogContent dividers>
    {step === 1 && (
      <>
        <Typography>Stavke:</Typography>
        <ul>
          {items.map(item => (
            <li key={item.id}>
              {item.name} x {item.quantity} = {item.price * item.quantity} RSD
              <Button size="small" onClick={() => removeFromCart(item.id)}>Ukloni</Button>
            </li>
          ))}
        </ul>
        <Typography variant="h6">Ukupno: {total} RSD</Typography>
      </>
    )}

    {step === 2 && (
      <>
        <FormControl fullWidth margin="normal">
          <InputLabel>Adresa</InputLabel>
          <Select
            value={selectedAddressId || ""}
            onChange={(e) => setSelectedAddressId(e.target.value || null)}
            label="Adresa"
          >
            <MenuItem value="">Izaberi adresu</MenuItem>
            {addresses.map(addr => (
              <MenuItem key={addr.id} value={addr.id}>
                {addr.streetAndNumber}, {addr.city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Vaučer</InputLabel>
          <Select
            value={selectedVoucherId || ""}
            onChange={(e) => setSelectedVoucherId(e.target.value || null)}
            label="Vaučer"
          >
            <MenuItem value="">Bez vaučera</MenuItem>
            {vouchers.map(v => (
              <MenuItem key={v.id} value={v.id}>
                {v.name} - {v.discountAmount} RSD
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    )}

    {step === 3 && (
      <>
        <Typography>Pregled porudžbine:</Typography>
        <ul>
          {items.map(item => (
            <li key={item.id}>
              {item.name} x {item.quantity} = {item.price * item.quantity} RSD
            </li>
          ))}
        </ul>
        <Typography>Adresa: {addresses.find(a => a.id === selectedAddressId)?.streetAndNumber}</Typography>
        <Typography>Vaučer: {vouchers.find(v => v.id === selectedVoucherId)?.name || "Bez"}</Typography>
        <Typography>Način plaćanja: <em>(placeholder)</em></Typography>
        <Typography variant="h6">Ukupno za plaćanje: {Math.max(total - (selectedVoucher?.discountAmount || 0), 0)} RSD</Typography>
      </>
    )}
  </DialogContent>

  <DialogActions>
    {step > 1 && <Button onClick={prevStep}>Nazad</Button>}

    {step === 1 && (
      <Button variant="contained" onClick={async () => {
        console.log("Payload for creating order items:", payload);
        const order = await orderService.createOrderItems(payload);
        console.log("Created order:", order);
        setOrderId(order.data.orderId);
        nextStep();
      }}>
        1️⃣ Kreiraj stavke
      </Button>
    )}

    {step === 2 && (
      <Button variant="contained" onClick={async () => {
        await orderService.updateOrderDetails(orderId, {
          addressId: selectedAddressId,
          voucherId: selectedVoucherId
        });

        nextStep();
      }}>
        2️⃣ Sačuvaj adresu i vaučer
      </Button>
    )}

    {step === 3 && (
      <Button variant="contained" color="success" onClick={async () => {
        await orderService.confirmOrder(orderId);
        onClose();
      }}>
        3️⃣ Potvrdi porudžbinu
      </Button>
    )}
  </DialogActions>
</Dialog>
  );
}
