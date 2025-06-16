import { useEffect, useState } from 'react'
import { chatService } from '../../services/apiService';
import { getSuggestedFriends, saveSuggestedFriends } from '../../utils/storage';

const DEBOUNCE_DELAY = 500;

export const useUserDiscovery = (currentUser, sentInterests, onSendInterest) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [fetchFromBackend, setFetchFromBackend] = useState(true);

    const fetchSuggestedFriends = async (page = 1) => {
        setLoading(true);
        try {
            const excludeIds = [...sentInterests, currentUser.id];
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (excludeIds.length) params.append('exclude_ids', excludeIds.join(','));

            const data = await chatService.getSuggestedFriends(params.toString(), page);
            
            const newUsers = page === 1 ? data.results : [...suggestedUsers, ...data.results];

            setSuggestedUsers(newUsers);

            setHasMore(data.next !== null);
            setCurrentPage(page);

            if (!searchTerm && page === 1) {
                saveSuggestedFriends(data);
            }
        } catch (err) {
            // console.error('Error fetching suggested friends:', err);
        } finally {
            setLoading(false);
            setFetchFromBackend(false);
        }
    };

    const loadMore = () => {
        if (hasMore) {
            fetchSuggestedFriends(currentPage + 1);
        }
    };

    const handleSendInterest = async (user) => {
        try {
            await chatService.sendInterest(user.id);
            if (onSendInterest) onSendInterest(user.id);

            setSuggestedUsers(prev => {
                const filtered = prev.filter(u => u.id !== user.id);
                saveSuggestedFriends(filtered);
                return filtered;
            });
        } catch (error) {
            // console.error('Error sending interest:', error);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchSuggestedFriends(1);
        }, DEBOUNCE_DELAY);
        return () => clearTimeout(handler);
    }, [searchTerm, sentInterests, fetchFromBackend]);

    return { 
        searchTerm,
        setSearchTerm,
        suggestedUsers,
        loading,
        handleSendInterest,
        loadMore,
        hasMore,
    };
};
