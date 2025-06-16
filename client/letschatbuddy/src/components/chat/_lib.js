import { useEffect, useState } from 'react';
import { chatService } from '../../services/apiService';
import { useNavigate, useParams } from 'react-router-dom';

export const useChatList = () => {
  const [messages, setMessages] = useState({});
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [activeChats, setActiveChats] = useState([]);
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const navigate = useNavigate();
  const params = useParams();

  const fetchChatUsers = async () => {
    setLoading(true);
    try {
      const data = await chatService.getActiveChats();
    
      const chatsWithStatus = data.map(chat => ({
        ...chat,
        is_online: chat.is_online || false,
        last_seen: chat.last_seen || 'Recently'
      }));
      
      setActiveChats(chatsWithStatus);
    } catch (err) {
      // console.error('Error fetching active chats:', err);
      setActiveChats([]);
    } finally {
      setLoading(false);
      setFetchFromBackend(false);
    }
  };

  useEffect(() => {
    if (!currentUser){
        setCurrentUser(JSON.parse(localStorage.getItem('connectChatUser')))
    }
    if (fetchFromBackend) {
      fetchChatUsers();
    }
  }, [fetchFromBackend]);

  return {
    messages,
    setMessages,
    selectedChatId,
    setSelectedChatId,
    activeChats,
    setActiveChats,
    navigate,
    params,
    loading,
    refetchChats: () => setFetchFromBackend(true)
  };
};