import api from "./api.jsx"

export const getProfile = async () => {
    const response = await api.get("profile/me");

    return response.data;
}

export const getAllUsers = async () => {
    const response = await api.get("users/owners");

    return response.data;
}