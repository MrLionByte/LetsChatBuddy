import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/layout/Header';
import Navigation from '../../components/layout/Navigation';
import ChatPage from '../../components/chat/ChatPage';
import UserDiscoveryPage from '../../components/discovery/UserDiscoveryPage';
import InterestManagerPage from '../../components/Interests/InterestManagerPage';
import { mockUsers } from '../../data/mockData';
import { avatars } from '../../services/avatars'; 


const Dashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('discover');
  const [sentInterests, setSentInterests] = useState([]);
  const [receivedInterests, setReceivedInterests] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth')
      return
    }
    
    // Set the active tab based on the URL
    const path = window.location.pathname.split('/').pop()
    if (path === 'chats') setActiveTab('chats')
    else if (path === 'interests') setActiveTab('interests')
    else setActiveTab('discover')
    
    // Simulate received interests
    setReceivedInterests([
      {
        id: 1,
        from: mockUsers[0],
        timestamp: '2 hours ago'
      },
      {
        id: 2,
        from: mockUsers[1],
        timestamp: '1 day ago'
      }
    ])
    
    // Load any persisted data from localStorage
    const storedSentInterests = localStorage.getItem('sentInterests')
    const storedActiveChats = localStorage.getItem('activeChats')
    
    if (storedSentInterests) {
      setSentInterests(JSON.parse(storedSentInterests))
    }
    
    if (storedActiveChats) {
      setActiveChats(JSON.parse(storedActiveChats))
    }
  }, [isAuthenticated, navigate])
  
  // Persist data to localStorage when it changes
  useEffect(() => {
    if (sentInterests.length > 0) {
      localStorage.setItem('sentInterests', JSON.stringify(sentInterests))
    }
    
    if (activeChats.length > 0) {
      localStorage.setItem('activeChats', JSON.stringify(activeChats))
    }
  }, [sentInterests, activeChats])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    navigate(`/app/${tab}`)
  }

  const handleSendInterest = (user) => {
    setSentInterests([...sentInterests, user.id])
  }

  const handleAcceptInterest = (interestId) => {
    const interest = receivedInterests.find(i => i.id === interestId)
    setActiveChats(prev => {
      // Check if chat already exists
      if (!prev.find(chat => chat.id === interest.from.id)) {
        return [...prev, interest.from]
      }
      return prev
    })
    setReceivedInterests(receivedInterests.filter(i => i.id !== interestId))
  }

  const handleRejectInterest = (interestId) => {
    setReceivedInterests(receivedInterests.filter(i => i.id !== interestId))
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header currentUser={currentUser} />
      
      <div className="max-w-6xl mx-auto p-4 pt-24">
        <Navigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
          interestCount={receivedInterests.length}
          chatCount={activeChats.length}
        />
        
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-dark-500/50 backdrop-blur-xl rounded-2xl p-6 border border-dark-400/50 mt-6"
        >
          <Routes>
            <Route 
              path="/" 
              element={<Navigate to="/app/discover\" replace />} 
            />
            <Route 
              path="/discover" 
              element={
                <UserDiscoveryPage
                  currentUser={currentUser}
                  onSendInterest={handleSendInterest}
                  sentInterests={sentInterests}
                />
              } 
            />
            <Route 
              path="/interests" 
              element={
                <InterestManagerPage
                  currentUser={currentUser}
                  receivedInterests={receivedInterests}
                  onAcceptInterest={handleAcceptInterest}
                  onRejectInterest={handleRejectInterest}
                />
              } 
            />
            <Route 
              path="/chats/*" 
              element={
                <ChatPage
                  currentUser={currentUser}
                  activeChats={activeChats}
                />
              } 
            />
            <Route path="*" element={<Navigate to="/app/discover" replace />} />
          </Routes>
        </motion.main>
      </div>
    </div>
  )
}

export default Dashboard;
