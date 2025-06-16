import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatList from './ChatList';
import ChatInterface from './ChatInterface';
import { useAuth } from '../../contexts/AuthContext';
import { useChatList } from './_lib';
import LoadingSpinner from '../loader/LoadingSpinner'
import {ChatListSkeleton, ChatMessagesSkeleton} from '../loader/ChatSkeleton'
import {
  initializeWebSocket,
  sendMessage,
  registerMessageHandler,
  registerConnectionHandler,
  closeWebSocket
} from './webSocketLib';

const ChatPage = () => {
  const {
    currentUser,
    messages,
    setMessages,
    selectedChatId,
    setSelectedChatId,
    activeChats,
    setActiveChats,
    navigate,
    loading: chatsLoading
  } = useChatList();

  const [loadingMessages, setLoadingMessages] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  const { logout } = useAuth();

  const updateUserOnlineStatus = (userId, isOnline, lastSeen = null) => {
    setActiveChats(prevChats => 
      prevChats.map(chat => 
        chat.id === userId 
          ? { 
              ...chat, 
              is_online: isOnline,
              last_seen: lastSeen || chat.last_seen 
            }
          : chat
      )
    );

    if (isOnline) {
      setOnlineUsers(prev => new Set([...prev, userId]));
  
    } else {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const fetchChatHistory = async () => {

    if (!selectedChatId) return;
    if (messages[selectedChatId] && messages[selectedChatId].length > 0) return;
    
    setLoadingMessages(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/v1/chat/${selectedChatId}/messages/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }

      const data = await response.json();

  const formattedMessages = data.map((msg) => ({
        id: msg.id,
        senderId: msg.sender_user_id,
        text: msg.text,
        timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
      }));

      setMessages((prev) => ({
        ...prev,
        [selectedChatId]: formattedMessages,
      }));
    } catch (err) {

      setMessages((prev) => ({
        ...prev,
        [selectedChatId]: [],
      }));
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [selectedChatId]);

  function extractOtherUserIdFromChatId(chatId, currentUserId) {
    const [id1, id2] = chatId.split('_').map(Number);
    return id1 === currentUserId ? id2 : id1;
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      logout();
      return;
    } 
    
    if (!selectedChatId) return;

    initializeWebSocket(selectedChatId, token);

    const unsubscribeMessages = registerMessageHandler((messageData) => {

      if (messageData.type === 'message') {
        
        const { chat_id, id, sender_user_id, text, timestamp } = messageData.message.message;
        
        const otherUserId = sender_user_id === currentUser?.id
          ? extractOtherUserIdFromChatId(chat_id, currentUser?.id)
          : sender_user_id;

        setMessages((prev) => {
          
          const chatMessages = prev[otherUserId] || [];
          const exists = chatMessages.some((m) => m.id === id);
          
          if (exists) return prev;
          
          return {
            ...prev,
            [otherUserId]: [
              ...chatMessages,
              {
                id,
                senderId: sender_user_id,
                text,
                timestamp: new Date(timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }
            ]
          };
        });
      } else if (messageData.type === 'chat_history') {
        const formattedMessages = messageData.messages.map((message) => ({
          id: message.id,
          senderId: message.sender_user_id,
          text: message.content,
          timestamp: new Date(message.timestamp_iso).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
        }));

        setMessages((prev) => ({
          ...prev,
          [selectedChatId]: formattedMessages,
        }));
        
        setLoadingMessages(false);
        
      } else if (messageData.type === 'user_status') {
        const { user_id, is_online, last_seen } = messageData;
        updateUserOnlineStatus(user_id, is_online, last_seen);
      }
    });

    const unsubscribeConnection = registerConnectionHandler((isConnected) => {
      
      // for connection status updates
    });

    return () => {
      unsubscribeMessages();
      unsubscribeConnection();
      closeWebSocket();
    };
  }, [selectedChatId]);
  

  useEffect(() => {
    const chatId = window.location.pathname.split('/').pop();
    if (chatId && chatId !== 'chats' && !isNaN(parseInt(chatId))) {
      setSelectedChatId(parseInt(chatId));
    }
  }, [activeChats]);

  const handleSelectChat = (chatId) => {
    setSelectedChatId(Number(chatId));
    navigate(`/app/chats/${chatId}`);
  };

  const handleBackToChats = () => {
    setSelectedChatId(null);
    navigate('/app/chats');
  };

  const handleSendMessage = (text) => {
    if (!selectedChatId) return;

    const newMessage = {
      chat_id: selectedChatId,
      text,
      timestamp: new Date().toISOString(),
    };
    

    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      sender: currentUser?.username,
      senderId: currentUser?.id,
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      pending: true 
    };

    setMessages((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), optimisticMessage]
    }));

    sendMessage(newMessage);
  };

  return (
    <div >
      <h2 className="text-2xl font-bold text-white mb-6">
        {selectedChatId ? 'Chat' : 'Conversations'}
      </h2>

      <Routes>
        <Route
          path="/"
          element={
            <ChatList
              activeChats={activeChats}
              onSelectChat={handleSelectChat}
              selectedChatId={selectedChatId}
              messages={messages}
              loading={chatsLoading}
            />
          }
        />
        <Route
          path=":chatId"
          element={
            <ChatInterface
              activeChat={activeChats.find((chat) => chat.id === selectedChatId)}
              messages={messages[selectedChatId] || []}
              onSendMessage={handleSendMessage}
              onBackToChats={handleBackToChats}
              loadingMessages={loadingMessages}
            />
          }
        />
      </Routes>
    </div>
  );
};


export default ChatPage;
