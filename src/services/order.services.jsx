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