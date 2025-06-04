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
      sendedInterests: 'chat/interests-send/',
      receivedInterests: 'chat/interests-receive/',
      InterestAction: 'chat/interests-action/',
      activeChats: 'chat/active-chats/',
    }
};
  
export default API_ENDPOINTS;