import api from "../api/axiosConfig";  
import API_ENDPOINTS from "./apiEndpoints";


export const authService = {
    signup: async (userData) => {
        const response = await api.post(API_ENDPOINTS.auth.signup, userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post(API_ENDPOINTS.auth.login, credentials);
        return response.data;
    },

    logout: async () => {
        const response = await api.post(API_ENDPOINTS.auth.logout);
        return response.data;
    },
};
