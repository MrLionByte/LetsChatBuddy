import { useEffect, useState } from 'react'
import {chatService} from '../../services/apiService';
import { 
    getSuggestedFriends,
    saveSuggestedFriends,
    clearSuggestedFriends
    } from '../../utils/storage';

const DEBOUNCE_DELAY = 500;

export const useUserDiscovery = (currentUser, sentInterests, onSendInterest) => {
    
    const [searchTerm, setSearchTerm] = useState('')
    const [suggestedUsers, setSuggestedUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [fetchFromBackend, setFetchFromBackend] = useState(true);

    const fetchSuggestedFriends = async () => {
        setLoading(true);
        try {
            const excludeIds = [...sentInterests, currentUser.id];
            const cachedFriends = getSuggestedFriends();
            
            if (cachedFriends && !searchTerm) {
                setSuggestedUsers(cachedFriends);
                setLoading(false);
                return ;
            }
        
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (excludeIds.length) params.append('exclude_ids', excludeIds.join(','));
    
            const data = await chatService.getSuggestedFriends(params.toString());
            console.log(data);
            
            setSuggestedUsers(data);
            if (!searchTerm) {
                saveSuggestedFriends(data);
            }
        } catch (err) {
            console.error('Error fetching suggested friends:', err);
        } finally {
            setLoading(false);
            setFetchFromBackend(false);
        }
    };

    const handleSendInterest = async (user) => {
        try {
            const response = await chatService.sendInterest(user.id);
            console.log(response);
            
            if (onSendInterest) {
                onSendInterest(user.id);
            }
            suggestedUsers(prevUsers => {
                const filterUSers = prevUsers.filter(u => u.id !== user.id);
                saveSuggestedFriends(filterUSers);
                return filterUSers;
            });
        } catch (error) {
            console.error('Error sending interest:', error);
        }
    };

    useEffect (() => {
        const handler = setTimeout(() => {
            fetchSuggestedFriends(); 
        }, DEBOUNCE_DELAY);
        return ()=> clearTimeout(handler);

    }, [searchTerm, sentInterests, fetchFromBackend]);

    return { 
        searchTerm,
        setSearchTerm,
        suggestedUsers,
        loading,
        handleSendInterest,
     };
};


