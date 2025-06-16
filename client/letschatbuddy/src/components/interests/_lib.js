import { useEffect, useState } from 'react'
import {chatService} from '../../services/apiService';


export const useInterests = (onAcceptInterest, onRejectInterest) => {
    const [fetchFromBackend, setFetchFromBackend] = useState(true);
    const [receivedInterests, setReceivedInterests] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchReceivedInterests = async () => {
        setLoading(true);
        try {
            
            const data = await chatService.getReceivedInterests();

            setReceivedInterests(data);
        } catch (err) {
            // console.error('Error fetching received interests:', err);
        } finally {
            setLoading(false);
            setFetchFromBackend(false);
        }
    }

    const handleAcceptInterest = async (interestId) =>{
        setLoading(true);
        try {
            const data = await chatService.handleInterestAction(interestId, 'accept');
            setReceivedInterests(prev =>
                prev.filter(interest => interest.id !== interestId)
            );
            onAcceptInterest(interestId)
        } catch (err) {
            // console.error('Error accepting interest:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRejectInterest = async (interestId) =>{
        setLoading(true);
        try {
            const data = await chatService.handleInterestAction(interestId, 'reject');
            setReceivedInterests(prev =>
            prev.filter(interest => interest.id !== interestId)
            );
            onRejectInterest(interestId)
        } catch (err) {
            // console.error('Error accepting interest:', err);
        } finally {
            setLoading(false);
        }
    };   

    useEffect(() => {
        if (fetchFromBackend) {
            fetchReceivedInterests();
        }
    }, [fetchFromBackend]);

    return { 
       receivedInterests,
       loading,
       handleAcceptInterest,
       handleRejectInterest,
     };
};


