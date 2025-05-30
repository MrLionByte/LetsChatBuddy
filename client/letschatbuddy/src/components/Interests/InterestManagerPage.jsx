import { Heart, X } from 'lucide-react'
import { motion } from 'framer-motion'

const InterestManagerPage = ({ currentUser, receivedInterests, onAcceptInterest, onRejectInterest }) => {
  if (receivedInterests.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Interest Requests</h2>
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No interests yet</h3>
          <p className="text-white/60">Check back later for new connection requests!</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Interest Requests</h2>
      <div className="space-y-4">
        {receivedInterests.map((interest, index) => (
          <InterestCard
            key={interest.id}
            interest={interest}
            index={index}
            onAccept={() => onAcceptInterest(interest.id)}
            onReject={() => onRejectInterest(interest.id)}
          />
        ))}
      </div>
    </div>
  )
}

const InterestCard = ({ interest, index, onAccept, onReject }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="card hover:border-primary-500/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-xl">
            {interest.from.avatar}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{interest.from.name}</h3>
            <p className="text-white/60">wants to connect with you</p>
            <span className="text-xs text-primary-400">{interest.timestamp}</span>
          </div>
        </div>
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReject}
            className="p-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAccept}
            className="p-3 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-xl transition-all duration-300"
          >
            <Heart className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default InterestManagerPage;
