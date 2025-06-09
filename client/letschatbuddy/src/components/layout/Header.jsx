import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Settings, User } from 'lucide-react'
import Logo from '../../assets/Logo.svg'

const Header = ({ currentUser }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const { logout } = useAuth()

  return (
    <header className="fixed w-full z-40 bg-dark-500/80 backdrop-blur-lg border-b border-dark-400/30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/app" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <img src={Logo} alt="" />
          </div>
          <span className="text-xl font-bold text-white hidden sm:inline-block">ConnectChat</span>
        </Link>
        
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 bg-dark-600/50 hover:bg-dark-600 rounded-xl px-3 py-2 transition-colors border border-dark-400/50"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <img 
              src={currentUser?.avatar} 
              alt={currentUser.username?.slice(0).toUpperCase()} 
              className="w-full h-full rounded-full object-cover"
            />
            </div>
            <span className="text-white hidden sm:inline-block">{currentUser?.username || 'User'}</span>
            <span className="w-2 h-2 border-r-2 border-b-2 border-white/70 transform rotate-45 mt-[-3px]"></span>
          </button>
          
          <AnimatePresence>
            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-dark-600/95 backdrop-blur-md rounded-xl shadow-lg py-2 border border-dark-400/50 z-50"
              >
                <div className="px-4 py-2 border-b border-dark-400/50">
                  <p className="text-white font-medium">{currentUser?.username}</p>
                  <p className="text-white/60 text-sm truncate">{currentUser?.email || 'user@example.com'}</p>
                </div>
                
                <div className="py-1">
                  <button className="flex items-center space-x-3 w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-dark-500/50 transition-colors">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button className="flex items-center space-x-3 w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-dark-500/50 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                </div>
                
                <div className="border-t border-dark-400/50 py-1">
                  <button 
                    onClick={logout}
                    className="flex items-center space-x-3 w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-dark-500/50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

export default Header;
