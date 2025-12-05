import api from "./api.jsx";

export const getExchangeRate = async (baseCode) => {

    const response = await api.get(`ExchangeRate?baseCode=${baseCode}`);
    return response.data;
};