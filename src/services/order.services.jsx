import api from "./api.jsx"


export const getByRestaurant = async (restaurantId) => {
    const response = await api.get(`orders/restaurant/${restaurantId}`);
    return response.data;
}

export const getMyDraft = async () => {
    const response = await api.get(`orders/draft`);
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

export const createOrder = async (data) => {
    const response = await api.post(`orders/items`, data);
    return response.data;
}

export const updateUserData = async (data, orderId) => {
    const response = await api.put(`orders/${orderId}/details`, data);
    return response.data;
}

export const deleteItem = async (itemId) => {
    const response = await api.delete(`orders/items/${itemId}`);
    return response.data;
}

export const deleteOrder = async (id) => {
    const response = await api.delete(`orders/${id}`);
    return response.data;
}