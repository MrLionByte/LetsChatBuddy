import { useEffect, useState } from 'react'
import {chatService} from '../../services/apiService';


export const useInterests = (currentUser, sentInterests, onSendInterest) => {
    const [fetchFromBackend, setFetchFromBackend] = useState(true);
    const [sendedInterests, setSendedInterests] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSendedInterests = async () => {
        setLoading(true);
        try {
            
            const data = await chatService.getSendedInterests();
            console.log(data);

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
       sendedInterests,
       loading,
     };
};


