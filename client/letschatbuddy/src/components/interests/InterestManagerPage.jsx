import { useState } from 'react';
import { Heart, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInterests } from './_lib';
import LoadingSpinner from '../../components/loader/LoadingSpinner';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="border-4 border-primary-600 bg-dark-700 p-6 rounded-xl shadow-xl w-full max-w-sm text-white space-y-4">
        <h3 className="text-xl font-bold">Confirmation</h3>
        <p>{message}</p>
        <div className="flex justify-center space-x-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const ReceivedInterestRequests = ({ onAcceptInterest, onRejectInterest }) => {
  const {
    receivedInterests,
    handleAcceptInterest,
    handleRejectInterest,
    loading
  } = useInterests(onAcceptInterest, onRejectInterest);

  const [selectedInterest, setSelectedInterest] = useState(null);
  const [actionType, setActionType] = useState(null);

  const openModal = (interest, type) => {
    setSelectedInterest(interest);
    setActionType(type);
  };

  const handleConfirm = () => {
    if (selectedInterest && actionType) {
      if (actionType === 'accept') {
        handleAcceptInterest(selectedInterest.id);
      } else if (actionType === 'reject') {
        handleRejectInterest(selectedInterest.id);
      }
      setSelectedInterest(null);
      setActionType(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Connection Requests</h2>

      <div className="space-y-4">
        {loading ? (
          <div className="col-span-2 flex justify-center items-center py-12">
            <LoadingSpinner size="large" text="Finding people for you..." />
          </div>
        ) : receivedInterests.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No requests yet</h3>
            <p className="text-white/60">You’ll see incoming interests here when someone wants to connect!</p>
          </div>
        ) : (
          receivedInterests.map((interest, index) => (
            <motion.div
              key={interest?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="card hover:border-primary-500/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={interest?.sender?.avatar}
                    alt={interest?.sender?.username}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary-400"
                  />
                  <div>
                    <h3 className="text-white font-semibold text-lg">{interest?.sender?.username}</h3>
                    <p className="text-white/60">wants to connect with you</p>
                    <span className="text-xs text-primary-400">
                      {new Date(interest?.timestamp).toLocaleString([], {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openModal(interest, 'reject')}
                    className="p-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openModal(interest, 'accept')}
                    className="p-3 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-xl transition-all duration-300"
                  >
                    <Heart className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <ConfirmationModal
        isOpen={!!selectedInterest}
        onClose={() => { setSelectedInterest(null); setActionType(null); }}
        onConfirm={handleConfirm}
        message={
          actionType === 'accept'
            ? `Do you want to accept ${selectedInterest?.sender?.username}'s request?`
            : `Do you want to reject ${selectedInterest?.sender?.username}'s request?`
        }
      />
    </div>
  );
};

export default ReceivedInterestRequests;
