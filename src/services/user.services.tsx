import api from "../services/api.jsx";


export async function createUser(userData) {
  const response = await api.post("/Auth/register", userData);
  return response;
}


export async function getAllUsers() {
  const response = await api.get("/Users");
  return Array.isArray(response.data) ? response.data : [];
}

export async function getProfile() {
  const response = await api.get("/Profile/me");
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
  return api.put(`/Customers/my-addresses/${id}`, payload, {
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.data);
}

export async function deleteAddress(id) {
  return api.delete(`/Customers/my-addresses/${id}`)
    .then(res => res.data);
}






