import { motion } from 'framer-motion'
import {formatLastSeen} from '../../utils/formatDate';
import { MessageCircle } from 'lucide-react'
import {ChatListSkeleton} from '../loader/ChatSkeleton'


const ChatList = ({ activeChats, onSelectChat, selectedChatId, messages, loading }) => {
  
  if (loading) {
    return <ChatListSkeleton />;
  }
  
  if (activeChats.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No active chats</h3>
        <p className="text-white/60">Accept some interests to start chatting!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {activeChats.map((chat, index) => {
        const chatMessages = messages[chat.id] || [];
        const lastMessage = chatMessages.length > 0 ? 
          chatMessages[chatMessages.length - 1] : null;
        
        return (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => onSelectChat(chat.id)}
            className={`bg-dark-400/50 hover:bg-dark-400/70 rounded-xl p-4 cursor-pointer transition-all duration-300 border border-dark-400/50 ${
              selectedChatId === chat.id ? 'border-primary-500' : 'hover:border-primary-500/50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-xl">
                  <img 
                    src={chat?.avatar || '/avatars/default.png'} 
                    alt={chat?.username?.slice(0, 2).toUpperCase()} 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                
                {/* <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-dark-500 ${
                  chat.is_online ? 'bg-green-500' : 'bg-gray-500'
                }`} /> */}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-white font-semibold">{chat.username}</h4>
                  {lastMessage && (
                    <span className="text-xs text-white/40">{lastMessage.timestamp}</span>
                  )}
                </div>
                <p className="text-white/60 text-sm truncate max-w-xs">
                  {lastMessage ? lastMessage.text : 'Start a conversation'}
                </p>
                
                <p className="text-xs text-white/40 mt-1">
                  {chat.is_online ? 'Online' : `Last seen ${chat.last_seen !== 'Recently'? `${formatLastSeen(chat.last_seen)}`: 'recently'}`}
                </p>
              </div>
              <div className="text-white/40">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ChatList;

