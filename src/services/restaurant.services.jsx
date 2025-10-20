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