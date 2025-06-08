import { useEffect, useState } from 'react'
import {chatService} from '../../services/apiService';


export const useSentInterests = () => {
    const [fetchFromBackend, setFetchFromBackend] = useState(true);
    const [sentInterests, setSendedInterests] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSendedInterests = async () => {
        setLoading(true);
        try {
            
            const data = await chatService.getSendedInterests();
            setSendedInterests(data);
        } catch (err) {
            console.error('Error fetching received interests:', err);
        } finally {
            setLoading(false);
            setFetchFromBackend(false);
        }
    }

    useEffect(() => {
        if (fetchFromBackend) {
            fetchSendedInterests();
        }
    }, [fetchFromBackend]);

    return { 
       sentInterests,
       loading,
     };
};


