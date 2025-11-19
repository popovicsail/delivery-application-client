import api from "./api.jsx";

// Ocene za restoran sa paginacijom i filterima
export async function getRestaurantRatings(restaurantId, page = 1, pageSize = 5, from = null, to = null) {
  const response = await api.get(`/api/ratings/restaurant/${restaurantId}`, {
    params: { page, pageSize, from, to }
  });
  return response.data; // očekuje { ratings, totalCount }
}

// Ocene za kurira
export async function getCourierRatings(courierId, page = 1, pageSize = 5, from = null, to = null) {
  const response = await api.get(`/api/ratings/courier/${courierId}`, {
    params: { page, pageSize, from, to }
  });
  return response.data;
}

// Prosečna ocena
export async function getAverageRating(targetId, targetType) {
  const response = await api.get(`/api/ratings/average/${targetType}/${targetId}`);
  return response.data; // očekuje { averageScore }
}

// Kreiranje nove ocene
export async function createRating(formData) {
  const response = await api.post("/ratings", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data; // očekuje { ratingId }
}

export async function getCustomerOrder(orderId) {
  const response = await api.get(`/Orders/${orderId}`)
  return response.data
}
