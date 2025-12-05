import api from "./api.jsx"

export const getRestaurants = async () => {
    const response = await api.get("restaurants");
    
    return response.data;
}

export const getPagedRestaurants = async (sort, filters, page) => {
  const params = new URLSearchParams();
  filters.closedToo = filters.closedToo.toString()

  if (filters.name) params.append("Name", filters.name);
  if (filters.openingTime) params.append("OpeningTime", filters.openingTime);
  if (filters.closingTime) params.append("ClosingTime", filters.closingTime);
  if (filters.closedToo) params.append("ClosedToo", filters.closedToo);
  if (filters.city) params.append("City", filters.city);
  params.append("sort", sort);
  params.append("page", page)

  const response = await api.get(`/restaurants/paged?${params.toString()}`);

    return response.data;
}

export const getMyRestaurants = async () => {
    const response = await api.get("restaurants/my-restaurants");
    
    return response.data;
}

export const getOneRestaurant = async (id) => {
    const response = await api.get("restaurants/" + id);

    return response.data;
}

export const deleteRestaurant = async (id) => {
    const response = await api.delete("restaurants/" + id);

    return response.data;
}

export const updateRestaurant = async (id, data) => {
    const response = await api.put("restaurants/" + id, data);
    
    return response.data;
}

export const createRestaurant = async (data) => {
    const response = await api.post("restaurants", data);
    
    return response.data;
}

export const getTopRated = async () => {
    const response = await api.get("restaurants/top-rated");
    
    return response.data;
}

export const getMostDiscounts = async () => {
    const response = await api.get("restaurants/most-discounts");
    
    return response.data;
}

export const getMostOftenOrderedFromByCustomer = async () => {
    const response = await api.get("restaurants/customer/most-often-ordered-from");
    
    return response.data;
}

export const getMostRecentOrderedFromByCustomer = async () => {
    const response = await api.get("restaurants/customer/most-recent-ordered-from");
    
    return response.data;
}

export const getMyWorkers = async (id) => {
    const response = await api.get("restaurants/" + id + "/workers");

    return response.data;
}

export const registerWorker = async (data) => {
    const response = await api.post("restaurants/" + data.restaurantId + "/workers", data);

    return response.data;
}

export const updateWorker = async (data, workerId) => {
    const response = await api.put("workers/" + workerId, data);

    return response.data;
}

export const suspendWorker = async (id) => {
    const response = await api.put("workers/" + id + "/suspend");

    return response.data;
}

export const unsuspendWorker = async (id) => {
    const response = await api.put("workers/" + id + "/unsuspend");

    return response.data;
}

export const getOneWorker = async (id) => {
    const response = await api.get("workers/" + id);

    return response.data;
}

export const changeSuspendStatus = async (restaurantId, payload) => {
    const response = await api.put(`restaurants/${restaurantId}/suspend-restaurant`, payload)

    return response.data;
}