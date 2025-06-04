import { useEffect, useState } from 'react'
import {chatService} from '../../services/apiService';
import { useNavigate, useParams } from 'react-router-dom'


export const useChatList = (currentUser) => {
    const [messages, setMessages] = useState({})
    const [selectedChatId, setSelectedChatId] = useState(null)
    const [activeChats, setActiveChats] = useState([]);
 
    const [fetchFromBackend, setFetchFromBackend] = useState(true)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const params = useParams()

    const fetchChatUsers = async () => {
        setLoading(true)
        try {
            const data = await chatService.getActiveChats()
            console.log(data)
            setActiveChats(data)
        } catch (err) {
            console.error('Error fetching active chats:', err)
        } finally {
            setLoading(false)
            setFetchFromBackend(false)
        }
    }

    useEffect(() => {
        if (fetchFromBackend) {
            fetchChatUsers()
        }
    }, [fetchFromBackend])

    return {
        messages,
        setMessages,
        selectedChatId,
        setSelectedChatId,
        activeChats,
        navigate,
        params
    }
};
