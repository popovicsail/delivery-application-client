import api from "./api.jsx"


export const getByRestaurant = async (restaurantId) => {
    const response = await api.get(`orders/restaurant/${restaurantId}`);
    return response.data;
}


export const updateOrderStatus = async (orderId, newStatus, prepTime) => {
    const response = await api.put(
      `orders/${orderId}/status`,
      { newStatus, prepTime }, // jedan objekat
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  };

export const getByCourier = async (courierId) => {
    const response = await api.get(`orders/courier/${courierId}`);
    return response.data;
}


export async function createOrderItems(payload) {
  return await api.post("/orders/items", payload);
}

export async function updateOrderDetails(orderId, payload) {
  return await api.put(`/orders/${orderId}/details`, payload);
}

export async function confirmOrder(orderId) {
  return await api.post(`/orders/${orderId}/confirm`);
}