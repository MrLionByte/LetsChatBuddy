const API_ENDPOINTS = {
    auth: {
      signup: 'accounts/signup/',
      login: 'accounts/login/',
      logout: 'accounts/logout/',
      refreshToken: 'accounts/token/refresh/',
    },

    chat: {
      suggestedFriends: 'chat/suggested-friends/',
      interests: 'chat/interests/',
      activeChats: 'chat/active-chats/',
    }
};
  
export default API_ENDPOINTS;