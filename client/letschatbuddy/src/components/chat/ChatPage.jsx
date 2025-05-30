import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import ChatList from './ChatList'
import ChatInterface from './ChatInterface'
import { generateMockMessages } from '../../data/mockData'

const ChatPage = ({ currentUser, activeChats }) => {
  const [messages, setMessages] = useState({})
  const [selectedChatId, setSelectedChatId] = useState(null)
  const navigate = useNavigate()
  const params = useParams()
  
  // Initialize messages for each chat if not already present
  useEffect(() => {
    const newMessages = { ...messages }
    let hasChanges = false
    
    activeChats.forEach(chat => {
      if (!newMessages[chat.id]) {
        newMessages[chat.id] = generateMockMessages(chat.id)
        hasChanges = true
      }
    })
    
    if (hasChanges) {
      setMessages(newMessages)
    }
    
    // Check if there's a chatId in the URL
    const chatIdFromUrl = window.location.pathname.split('/').pop()
    if (chatIdFromUrl && chatIdFromUrl !== 'chats' && !isNaN(parseInt(chatIdFromUrl))) {
      setSelectedChatId(parseInt(chatIdFromUrl))
    }
  }, [activeChats, messages])
  
  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId)
    navigate(`/app/chats/${chatId}`)
  }
  
  const handleBackToChats = () => {
    setSelectedChatId(null)
    navigate('/app/chats')
  }
  
  const handleSendMessage = (text) => {
    if (!selectedChatId) return
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'currentUser',
      text,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }
    
    setMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
    }))
  }
  
  // If on mobile and a chat is selected, show only the chat interface
  const isMobileWithChatSelected = selectedChatId && window.innerWidth < 768
  
  return (
    <div>
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
            />
          } 
        />
        <Route 
          path="/:chatId" 
          element={
            <ChatInterface
              currentUser={currentUser}
              activeChat={activeChats.find(chat => chat.id === selectedChatId)}
              messages={selectedChatId ? messages[selectedChatId] || [] : []}
              onSendMessage={handleSendMessage}
              onBackToChats={handleBackToChats}
            />
          } 
        />
      </Routes>
    </div>
  )
}

export default ChatPage;
