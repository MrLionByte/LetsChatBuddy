import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/layout/Header';
import Navigation from '../../components/layout/Navigation';
import ChatPage from '../../components/chat/ChatPage';
import UserDiscoveryPage from '../../components/discovery/UserDiscoveryPage';
import InterestManagerPage from '../../components/interests/InterestManagerPage';
import RequestManagerPage from '../../components/requests/RequestManagerPage';
import { mockUsers } from '../../data/mockData';
import { avatars } from '../../services/avatars'; 
import NotificationListener from '../../components/notification/NotificationListener';


const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('discover');
  const [sentInterests, setSentInterests] = useState([]);
  const [receivedInterests, setReceivedInterests] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [currentUserToken, setCurrentUserToken] = useState(null)
  
  // useEffect(()=>{
  //   if(!currentUser){
  //     const token = localStorage.getItem('token')
  //     if (token){
  //         setCurrentUserToken(token)
  //     }
  //   }
  // }, [currentUserToken])

  useEffect(() => {
    const path = window.location.pathname.split('/').pop()
    if (path === 'chats') setActiveTab('chats')
    else if (path === 'interests') setActiveTab('interests')
    else setActiveTab('discover')
    
    // Load any persisted data from localStorage
    const storedSentInterests = localStorage.getItem('sentInterests')
    const storedReceivedInterests = localStorage.getItem('receivedInterests');
    const storedActiveChats = localStorage.getItem('activeChats')
    
    if (storedSentInterests) {
      setSentInterests(JSON.parse(storedSentInterests))
    }

    if (storedReceivedInterests) {
      setReceivedInterests(JSON.parse(storedReceivedInterests));
    }
    
    if (storedActiveChats) {
      setActiveChats(JSON.parse(storedActiveChats))
    }
  }, [navigate])
  
  useEffect(() => {
    localStorage.setItem('sentInterests', JSON.stringify(sentInterests));
    localStorage.setItem('receivedInterests', JSON.stringify(receivedInterests));
    localStorage.setItem('activeChats', JSON.stringify(activeChats));
  }, [sentInterests, receivedInterests, activeChats]);

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    navigate(`/app/${tab}`)
  }


  const handleAcceptInterest = (interestId) => {
    const interest = receivedInterests.find(i => i.id === interestId);
    if (interest) {
      setActiveChats(prev => {
        if (!prev.find(chat => chat.id === interest.sender.id)) {
          return [...prev, interest.sender];
        }
        return prev;
      });
    }
    setReceivedInterests(receivedInterests.filter(i => i.id !== interestId));
  };

  const handleRejectInterest = (interestId) => {
    setReceivedInterests(receivedInterests.filter(i => i.id !== interestId))
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* <NotificationListener token={currentUserToken} /> */}
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
                  sentInterests={sentInterests}
                />
              } 
            />

            <Route 
              path="/interests" 
              element={
                <RequestManagerPage
                  currentUser={currentUser}
                  receivedInterests={receivedInterests}
                  onAcceptInterest={handleAcceptInterest}
                  onRejectInterest={handleRejectInterest}
                />
              } 
            />

            <Route 
              path="/requests" 
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
