import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { authService } from '../../services/apiService'
import Logo from '../../assets/Logo.svg'

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const onSubmit = async (data) => {
    setError('')
    try {
      const response = await authService.login(data)
      console.log(response);
      
      const avatars = ['👤', '👩', '👨', '🧑', '👦', '👧', '🧔', '🧕', '🧙', '🧛']
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)]

      const userWithAvatar = {
        ...response.user,         // assumes response contains user object
        avatar: response.user.avatar || randomAvatar, // fallback if backend doesn't provide
      }

      login(userWithAvatar)      // store in context
      navigate('/app')          // redirect to main app
    } catch (err) {
      const message = err?.response?.data?.message[0] || 'Login failed. Check your credentials.'
      setError(message)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <Link to="/" className="absolute top-8 left-8 text-white/80 hover:text-white flex items-center transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-dark-500/50 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-dark-400/50"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <img src={Logo} className="w-fit h-fit text-white" alt="Logo" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ConnectChat</h1>
          <p className="text-white/60">Where conversations spark connections</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
            <input
              type="text"
              {...register('email', { required: 'Email is required' })}
              placeholder="Your email"
              className="input-primary"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required' })}
                placeholder="Your password"
                className="input-primary pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/80"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <motion.button whileTap={{ scale: 0.98 }} type="submit" className="w-full btn-primary mt-6">
            Sign In
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-dark-400/50 text-center">
          <p className="text-white/60 text-sm">
            Don't have an account?{' '}
            <Link to="/sign-up" className="text-primary-400 hover:text-primary-300">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
