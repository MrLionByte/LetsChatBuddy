import { Heart, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSentInterests } from './_lib';
import LoadingSpinner from '../../components/loader/LoadingSpinner';

const InterestManagerPage = () => {
  const { sentInterests, loading } = useSentInterests();

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Interest Requests</h2>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" text="Loading your sent interests..." />
        </div>
      ) : sentInterests.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No interests yet</h3>
          <p className="text-white/60">Check back later for new connection requests!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sentInterests.map((interest, index) => (
            <InterestCard key={interest.id} interest={interest} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

const InterestCard = ({ interest, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="card hover:border-primary-500/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={interest?.receiver?.avatar || '/avatars/default.png'}
            alt={interest?.receiver?.username}
            className="w-12 h-12 rounded-full object-cover border border-dark-300"
          />
          <div>
            <h3 className="text-white font-semibold text-lg">
              {interest?.receiver?.username}
            </h3>
            <p className="text-white/60">Waiting for them to accept</p>
            <span className="text-xs text-primary-400">
              {new Date(interest?.timestamp).toLocaleString([], {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-xl transition-all duration-300"
          >
            <Loader className="w-5 h-5 animate-spin" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default InterestManagerPage;
