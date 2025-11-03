import api from "./api.jsx";

export async function createUser(userData) {
  const response = await api.post("/Auth/register", userData);
  return response;
}

export async function getAllUsers() {
  const response = await api.get("/Users");
  return Array.isArray(response.data) ? response.data : [];
}

export async function getAllOwners() {
  const response = await api.get("/owners");
  return response.data;
}

export async function getProfile() {
  const response = await api.get("/Profile/me");
  return response.data;
}

export async function deleteUser(id) {
  const response = await api.delete(`/Admin/delete-user/${id}`);
  return response.data;
}

export async function createCourier(courierData) {
  const response = await api.post("/Admin/register-courier", courierData);
  return response.data;
}

export async function createOwner(ownerData) {
  const response = await api.post("/Admin/register-owner", ownerData);
  return response.data;
}

export async function getAllergens() {
  const response = await api.get("/Allergens");
  return Array.isArray(response.data) ? response.data : [];
}

export async function getMyAllergens() {
  const response = await api.get("/Customers/my-allergens");
  return response.data ?? [];
}


export async function deleteAllergen(id) {
  const response = await api.delete(`Allergens/${id}`);
  return response.data;
}

export async function createAllergen(allergenData) {
  const response = await api.post("/Allergens", allergenData);
  return response.data;
}

export async function updateAllergen(id, payload) {
  const response = await api.put(`/Allergens/${id}`, payload, )
  return response.data;
}

export async function putMyAllergens(payload) {
  const response = await api.put("/Customers/my-allergens", payload, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.data;
}

export async function updateProfile(profileData) {
  const response = await api.put("/Profile/me", profileData);
  return response.data;
}

export async function getMyAddresses() {
  const response = await api.get("/Customers/my-addresses");
  return Array.isArray(response.data) ? response.data : [];
}

export async function addAddress(addressData) {
  const response = await api.post("/Customers/my-addresses", addressData);
  return response.data;
}

export async function updateAddress(id, payload) {
  const response = await api.put(`/Customers/my-addresses/${id}`, payload, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.data;
}

export async function deleteAddress(id) {
  const response = await api.delete(`/Customers/my-addresses/${id}`);
  return response.data;
}

//PERMITS

export async function getMenuPermissionAsync(menuId) {
  const response = await api.get(`/Owners/permit/menu/${menuId}`);
  return response.data;
}

export async function getMyVouchers() {
  const response = await api.get("/customers/my-vouchers");
  return response.data;
}

export async function createOderder(orderData) {
  const response = await api.post("/Orders", orderData);
  return response.data;
}
