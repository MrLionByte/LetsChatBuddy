import {chatService} from '../../services/apiService';

export const fetchSuggestedFriends = async (search = '', excludeIds=[]) => {
  const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (excludeIds.length > 0) params.append('exclude', excludeIds.join(','));
    
    try {
        const response = await chatService.getSuggestedFriends();
        return response;
    } catch (err) {
        console.error('Error fetching suggested friends:', err);
        throw err;
    }
};