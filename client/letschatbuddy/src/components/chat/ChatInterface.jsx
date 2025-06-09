import { useState, useEffect, useRef } from 'react'
import { Send, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { ChatMessagesSkeleton } from '../loader/ChatSkeleton'

const ChatInterface = ({
  activeChat, 
  messages, 
  onSendMessage, 
  onBackToChats,
  loadingMessages }) => {

  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  const currentUser = JSON.parse(localStorage.getItem('connectChatUser'));

  useEffect(() => {
    if (messagesEndRef.current && !loadingMessages) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, loadingMessages]);
  
  const handleSubmit = (e) => {
    e?.preventDefault()
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim())
      setNewMessage('')
    }
  }
  
  if (!activeChat) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">Select a chat to start messaging</p>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col h-[70vh] md:h-[60vh] -m-6">
     
      <div className="bg-dark-400/50 backdrop-blur-sm border-b border-dark-400/50 p-4 flex items-center space-x-4">
        <button
          onClick={onBackToChats}
          className="text-white/60 hover:text-white transition-colors md:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <img 
              src={activeChat?.avatar} 
              alt={activeChat.name?.slice(0).toUpperCase()} 
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-dark-500 ${
            activeChat.is_online ? 'bg-green-500' : 'bg-gray-500'
          }`} />
        </div>
        <div>
          <h3 className="text-white font-semibold">{activeChat.username}</h3>
          <p className="text-white/60 text-sm">
            {activeChat.is_online ? 'Online' : `Last seen ${activeChat.last_seen}`}
          </p>
        </div>
      </div>

      {loadingMessages ? (
        <ChatMessagesSkeleton />
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-500/20 flex items-center justify-center">
                  <Send className="w-8 h-8 text-primary-400" />
                </div>
                <p className="text-white/60">No messages yet</p>
                <p className="text-white/40 text-sm mt-2">Send a message to start the conversation</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              
              
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index === messages.length - 1 ? 0 : 0 }}
                className={`flex ${(message.senderId === currentUser?.id || message.senderId === undefined) ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    (message.senderId === currentUser?.id || message.senderId === undefined)
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white'
                      : 'bg-dark-400/50 text-white border border-dark-400/50'
                  }`}
                >
                  <p>{message?.text}</p>
                  <span className="text-xs opacity-70 block mt-1">
                    {message.timestamp}
                  </span>
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 bg-dark-400/50 backdrop-blur-sm border-t border-dark-400/50">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="input-primary flex-1"
            disabled={loadingMessages}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!newMessage.trim() || loadingMessages}
            className="p-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 shadow-lg"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
