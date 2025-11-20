import api from './api'

export const login = async (userName, password) => {

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

export const googleLogin = async (googleToken) => {

  const loginData = {
    googleToken: googleToken
  }

  const response = await api.post("/auth/google-login", loginData);

  if (response.data.token) {
    sessionStorage.setItem("token", response.data.token);
  }

  return response.data;

}


export const activateAccount = async (email, token) => {
  const response = await api.get("/auth/activate-account", {
    params: {
      email: email,
      token: token
    },
  });

  return response.data;
};


export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (email, token, newPassword, confirmPassword) => {
  const response = await api.post("/auth/reset-password", {
    email,
    token,
    newPassword,
    confirmPassword,
  });
  return response.data;
};

export const logout = () => {
  sessionStorage.clear();
};
