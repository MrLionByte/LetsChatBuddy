import { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {

    const storedUser = localStorage.getItem('connectChatUser')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        if (user?.accessToken) {
          setCurrentUser(user)
        } else {
          localStorage.removeItem('connectChatUser')
        }
      } catch {
        localStorage.removeItem('connectChatUser')
      }
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setCurrentUser(userData)
    localStorage.setItem('connectChatUser', JSON.stringify(userData))
    navigate('/app')
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('connectChatUser')
    navigate('/')
  }

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}


