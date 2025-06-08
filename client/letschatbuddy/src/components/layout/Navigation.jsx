import { useEffect, useState } from 'react';
import { Users, MessageCircle, MessageSquareDashed, Bell, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation = ({ activeTab, onTabChange, interestCount, chatCount }) => {
  const [selectedTab, setSelectedTab] = useState(activeTab || 'discover');

  // Load from localStorage on mount
  useEffect(() => {
    const storedTab = localStorage.getItem('connectChatActiveTab');
    if (storedTab) {
      setSelectedTab(storedTab);
      if (onTabChange) onTabChange(storedTab);
    }
  }, []);

  // Handle tab change and persist to localStorage
  const handleTabChange = (tabId) => {
    setSelectedTab(tabId);
    localStorage.setItem('connectChatActiveTab', tabId);
    if (onTabChange) onTabChange(tabId);
  };

  const tabs = [
    { id: 'discover', label: 'Discover', icon: <Users className="w-5 h-5" /> },
    // { id: 'random', label: 'Random-Chats', icon: <MessageSquareDashed className="w-5 h-5" /> },
    { id: 'interests', label: 'Interests', icon: <Send className="w-5 h-5" />, count: interestCount },
    { id: 'requests', label: 'Received', icon: <Bell className="w-5 h-5" />, count: interestCount },
    { id: 'chats', label: 'Chats', icon: <MessageCircle className="w-5 h-5" />, count: chatCount },
  ];

  return (
    <nav className="bg-dark-500/50 backdrop-blur-xl rounded-2xl p-2 border border-dark-400/50">
      <div className="flex flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`relative flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 mr-2 ${
              selectedTab === tab.id
                ? 'bg-primary-600 text-white shadow-lg'
                : 'text-white/60 hover:text-white hover:bg-dark-400/50'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.count > 0 && (
              <motion.span 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-red-500 text-white text-xs px-2 py-1 rounded-full"
              >
                {tab.count}
              </motion.span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
