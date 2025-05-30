import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { createAvatar } from '@dicebear/core'
import { funEmoji } from '@dicebear/collection'
import Logo from '../../assets/Logo.svg'
import { useAuth } from '../../contexts/AuthContext'
import { authService } from '../../services/apiService'
import { avatars } from '../../services/avatars'


const Signup = () => {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setServerError('')
    const { username, email, password, password_confirm } = data;

    if (password !== password_confirm) {
      setServerError('Passwords do not match')
      return
    }

    try {
      
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)]

      const response = await authService.signup({
        username,
        email,
        password,
        password_confirm,
        avatar: randomAvatar,
      })

      login(response.user)
    } catch (err) {
      console.error(err)
      setServerError(err.response?.data?.message[0] || 'Signup failed')
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
            <img src={Logo} className="w-fit h-fit text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ConnectChat</h1>
          <p className="text-white/60">Where conversations spark connections</p>
        </div>

        {serverError && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
            {serverError}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Username</label>
            <input
              type="text"
              placeholder="Your username"
              {...register('username', { required: 'Username is required' })}
              className="input-primary"
            />
            {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
            <input
              type="email"
              placeholder="Your email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
              })}
              className="input-primary"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
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
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                {...register('password_confirm', { required: 'Please confirm your password' })}
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
            {errors.confirm_password && <p className="text-red-400 text-sm mt-1">{errors.confirm_password.message}</p>}
          </div>

          <motion.button whileTap={{ scale: 0.98 }} type="submit" className="w-full btn-primary mt-10">
            Sign Up
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-dark-400/50 text-center">
          <p className="text-white/60 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300">
              Sign-in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Signup
