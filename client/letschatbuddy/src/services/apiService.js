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

export const chatService = {
    getSuggestedFriends: async (queryString = '') => {
        const url = queryString ? `${API_ENDPOINTS.chat.suggestedFriends}?${queryString}` : API_ENDPOINTS.chat.suggestedFriends;
        const response = await api.get(url);
        return response.data;
    },

    sendInterest: async (userId) => {
        const response = await api.post(API_ENDPOINTS.chat.interests, {receiver_id: userId});
        return response.data;
    },

    getActiveChats: async () => {
        const response = await api.get(API_ENDPOINTS.chat.activeChats);
        return response.data;
    },
};