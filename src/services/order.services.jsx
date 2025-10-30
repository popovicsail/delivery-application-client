import api from "./api.jsx"


export const getByRestaurant = async (restaurantId) => {
    const response = await api.get(`orders/restaurant/${restaurantId}`);
    return response.data;
}


export const updateOrderStatus = async (orderId, newStatus) => {
    const response = await api.put(`orders/${orderId}/status`, newStatus,{ headers: { "Content-Type": "application/json" } });
    return response.data;
}