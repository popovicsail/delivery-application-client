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

  export const getByCourier = async (courierId, from, to, page = 1, pageSize = 10) => {
    const params = { page, pageSize };
    if (from) params.from = new Date(from).toISOString(); // "2025-11-18T00:00:00.000Z"
    if (to) params.to = new Date(to).toISOString();
    
  
    const response = await api.get(`orders/courier/${courierId}`, { params });
    return response.data; // { items, totalCount }
  };
  

export const getByCustomer = async (customerId, page = 1, pageSize = 10) => {
    const params = { page, pageSize };

    const response = await api.get(`orders/customer/${customerId}/deliveries-history`,{ params });
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