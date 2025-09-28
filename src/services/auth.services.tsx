import api from './api'

export const login = async (userName:string, password:string) => {
    
    const loginData = {
        userName: userName,
        password: password
    }

  const response = await api.post("/auth/login", loginData);

  if (response.data.token) {
    sessionStorage.setItem("token", response.data.token);
  }

  return response.data;
};