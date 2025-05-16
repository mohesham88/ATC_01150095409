import { AuthProvider as RaAuthProvider } from "react-admin";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../lib/axios";

export const AuthProvider: RaAuthProvider = {
  login: async ({ email, password }) => {
    const response = await axiosInstance.post(`/admin/auth/signin`, {
      email,
      password,
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Invalid credentials");
    }

    const auth = response.data;
    console.log(auth);
    localStorage.setItem("auth", JSON.stringify(auth));
  },

  logout: async () => {
    const response = await axiosInstance.post(`/admin/auth/signout`);
    if (response.status < 200 || response.status >= 300) {
      return Promise.reject();
    }

    return Promise.resolve();
  },

  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem("auth");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  checkAuth: () => {
    const auth = localStorage.getItem("auth");
    return auth ? Promise.resolve() : Promise.reject();
  },

  getPermissions: () => {
    const auth = localStorage.getItem("auth");
    return auth
      ? Promise.resolve(JSON.parse(auth).permissions)
      : Promise.reject();
  },

  getIdentity: () => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      return Promise.reject();
    }
    const { user } = JSON.parse(auth);
    return Promise.resolve({
      id: user.id,
      fullName: user.name,
      avatar: user.avatar,
    });
  },
};
