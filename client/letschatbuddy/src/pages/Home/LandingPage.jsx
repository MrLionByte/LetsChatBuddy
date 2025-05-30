import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Users, Heart, Shield, ArrowRight, Menu, X, Github } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import Logo from '../../assets/Logo.svg'

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: <MessageCircle className="w-8 h-8 text-primary-400" />,
      title: "Real-time Messaging",
      description: "Connect instantly with friends through our lightning-fast messaging system."
    },
    {
      icon: <Users className="w-8 h-8 text-primary-400" />,
      title: "User Discovery",
      description: "Find new connections based on shared interests and preferences."
    },
    {
      icon: <Heart className="w-8 h-8 text-primary-400" />,
      title: "Meaningful Connections",
      description: "Our interest-based matching helps you find people you'll truly connect with."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-400" />,
      title: "Privacy First",
      description: "Your conversations are encrypted and your data is never shared with third parties."
    }
  ]

  const testimonials = [
    {
      text: "LetsChatBuddy helped me find amazing friends who share my passion for digital art.",
      name: "Alex Chen",
      role: "Digital Artist"
    },
    {
      text: "The interface is beautiful and the connections I've made are meaningful. Highly recommend!",
      name: "Sam Rivera",
      role: "Music Producer"
    },
    {
      text: "Finally, a chat app that prioritizes genuine connections over endless scrolling.",
      name: "Jordan Kim",
      role: "Book Lover"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-dark-500/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r rounded-full flex items-center justify-center">
                <img src={Logo} className="w-fit h-fit text-white" alt="" />
            </div>
            <span className="text-xl font-bold text-white">LetsChatBuddy</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
            <a href="#testimonials" className="text-white/80 hover:text-white transition-colors">Testimonials</a>
            <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
        
              <Link to="/login" className="btn-primary">
                Get Started
              </Link>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-500/95 backdrop-blur-sm"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <a 
                href="#features" 
                className="text-white/80 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#testimonials" 
                className="text-white/80 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </a>
              <a 
                href="#about" 
                className="text-white/80 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
                <Link 
                  to="/login" 
                  className="btn-primary text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="gradient-bg pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
              >
                Connect with people who <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500">share your interests</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-white/80 mb-8 max-w-lg"
              >
                LetsChatBuddy brings people together through meaningful conversations in a beautiful, intuitive interface designed for genuine connections.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <Link to="/login" className="btn-primary text-center">
                  Get Started <ArrowRight className="w-5 h-5 inline-block ml-2" />
                </Link>
                <a href="#features" className="btn-secondary text-center">
                  Learn More
                </a>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <div className="relative mx-auto w-full max-w-md">
                  {/* App preview mockup */}
                  <div className="bg-dark-600/60 rounded-2xl shadow-2xl overflow-hidden border border-green-800/50">
                    <div className="bg-dark-600/60 px-4 py-2 flex items-center justify-between border-b border-dark-400">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r rounded-full flex items-center justify-center">
                          <img src={Logo} className="w-fit h-fit text-white" alt="" />
                        </div>
                        <span className="text-sm font-medium text-white">LetsChatBuddy</span>
                      </div>
                    </div>
                    <div className="p-4 h-72 overflow-hidden">
                      <div className="space-y-3">
                        <div className="flex justify-start">
                          <div className="bg-dark-400/40 rounded-lg rounded-bl-none p-3 max-w-[80%]">
                            <p className="text-sm text-white">Hi there! How are you doing today?</p>
                            <span className="text-xs text-white/60 mt-1">2 min ago</span>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="bg-gradient-to-r from-green-900 to-teal-700 rounded-lg rounded-br-none p-3 max-w-[80%]">
                            <p className="text-sm text-white">Hey! I'm doing great, thanks for asking!</p>
                            <span className="text-xs text-white/60 mt-1">1 min ago</span>
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div className="bg-dark-400/40 rounded-lg rounded-bl-none p-3 max-w-[80%]">
                            <p className="text-sm text-white">I heard you're into digital art. That's awesome!</p>
                            <span className="text-xs text-white/60 mt-1">Just now</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl"></div>
                  <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary-500/20 rounded-full blur-2xl"></div>
                </div>

              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-dark-500 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Choose LetsChatBuddy?</h2>
            <p className="text-white/70 max-w-2xl mx-auto">Our platform is built to help you find and connect with people who share your interests, in a beautiful and intuitive interface.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-dark-600/80 backdrop-blur-sm rounded-xl p-6 border border-dark-500/50 hover:border-primary-500/30 transition-all duration-300"
              >
                <div className="bg-dark-700/50 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="gradient-bg py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">What Our Users Say</h2>
            <p className="text-white/70 max-w-2xl mx-auto">Don't just take our word for it. Here's what our community has to say about their LetsChatBuddy experience.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-dark-600/60 backdrop-blur-sm rounded-xl p-8 border border-dark-500/50"
              >
                <div className="mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-primary-400">★</span>
                  ))}
                </div>
                <p className="text-white/90 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-dark-400/40 to-teal-400/40 rounded-full flex items-center justify-center text-xl mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-white/70 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-dark-500 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">About LetsChatBuddy</h2>
            <p className="text-white/70 mb-8">
              LetsChatBuddy was created with a simple mission: to help people build meaningful connections in a digital world. 
              We believe that technology should bring people together, not drive them apart.
            </p>
            <p className="text-white/70 mb-8">
              Our platform is designed to foster genuine interactions based on shared interests, 
              helping you find people you'll truly connect with in a beautiful, intuitive interface.
            </p>
            <div className="mt-12">
              <Link to="/sign-up" className="btn-primary">
                Join LetsChatBuddy Today
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-500 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r  rounded-full flex items-center justify-center">
                <img src={Logo} className="w-fit h-fit text-white" alt="" />
              </div>
              <span className="text-xl font-bold text-white">LetsChatBuddy</span>
            </div>
            <div className="flex space-x-8 mb-6 md:mb-0">
              <a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a>
              <a href="#testimonials" className="text-white/70 hover:text-white transition-colors">Testimonials</a>
              <a href="#about" className="text-white/70 hover:text-white transition-colors">About</a>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div className="border-t border-dark-400 mt-8 pt-8 text-center">
            <p className="text-white/50 text-sm">© 2025 LetsChatBuddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage;
