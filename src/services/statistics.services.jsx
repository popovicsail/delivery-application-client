import api from "./api";


export const getRestaurantStats = async (id, from, to) => {
    const response = await api.get(
        `Orders/restaurant/${id}/revenue?from=${from}&to=${to}`
    );
    return response.data;
};

export const getRestaurantCanceledStats = async (id, from, to) => {
    const response = await api.get(
        `Orders/restaurant/${id}/canceled?from=${from}&to=${to}`
    );
    return response.data;
};

export const getDishStats = async(dishId, from, to) => {
    const response = await api.get(
        `Orders/dishes/${dishId}/revenue?from=${from}&to=${to}`
    );
    return response.data;
}
