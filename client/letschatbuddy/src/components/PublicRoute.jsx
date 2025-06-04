import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth()
  console.log('ProtectedRoute rendered, isAuthenticated:', isAuthenticated);
  

  if (isAuthenticated) {
    console.log('User is authenticated, redirecting to /app');
    
    return <Navigate to="/app" />
  }

  return <Outlet />
}

export default ProtectedRoute;
