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

