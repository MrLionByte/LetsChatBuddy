import { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserDiscovery } from './_lib';
import LoadingSpinner from '../../components/loader/LoadingSpinner';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="border-4 border-primary-600 bg-dark-700 p-6 rounded-xl shadow-xl w-full max-w-sm text-white space-y-4">
        <h3 className="text-xl font-bold">Confirm Interest</h3>
        <p>Do you want to send interest to <span className="font-semibold">{user?.username}</span>?</p>
        <div className="flex justify-center space-x-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600">
            Yes, Send
          </button>
        </div>
      </div>
    </div>
  );
};

const UserDiscoveryPage = ({ currentUser, sentInterests, onSendInterest }) => {
  const {
    searchTerm,
    setSearchTerm,
    suggestedUsers,
    loading,  
    handleSendInterest,
    hasMore,
    loadMore,
  } = useUserDiscovery(currentUser, sentInterests, onSendInterest);
  
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = suggestedUsers?.filter(
    user => user.id !== currentUser.id &&
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (user) => {
    setSelectedUser(user);
  };

  const handleConfirmSend = () => {
    if (selectedUser) {
      handleSendInterest(selectedUser);
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Discover People</h2>
      
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-primary pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <div className="col-span-2 flex justify-center items-center py-12">
            <LoadingSpinner size="large" text="Finding people for you..." />
          </div>
        ) : filteredUsers?.length > 0 ? (
          filteredUsers.map((user, index) => (
            <UserCard 
              key={user.id}
              user={user}
              index={index}
              onSendInterest={() => handleOpenModal(user)}
              isInterestSent={sentInterests.includes(user.id)}
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <div className="w-16 h-16 bg-dark-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white/30" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-white/60">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <button 
            onClick={loadMore} 
            className="px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-all"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        onConfirm={handleConfirmSend}
        user={selectedUser}
      />
    </div>
  );
}

const UserCard = ({ user, index, onSendInterest, isInterestSent }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="card group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-dark-800/80 rounded-full flex items-center justify-center text-xl">
                {user.avatar ? (
                  <img src={user.avatar} className="w-10 h-10 rounded-full" alt={`${user.username}'s avatar`} />
                ) : (
                  <span>{user.username?.slice(0).toUpperCase()}</span>
                )}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-dark-500 ${
              user.status === 'online' ? 'bg-green-500' : 
              user.status === 'away' ? 'bg-yellow-500' : 
              'bg-gray-500'
            }`} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg overflow-hidden">{user.username}</h3>
            <div className="flex items-center mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${
                user.status === 'online' ? 'bg-green-500/20 text-green-400' : 
                user.status === 'away' ? 'bg-yellow-500/20 text-yellow-400' : 
                'bg-gray-500/20 text-gray-400'
              }`}>
                {user.status}
              </span>
              <span className="text-white/40 text-xs ml-2">{user.lastActive}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onSendInterest(user)}
          disabled={isInterestSent}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
            isInterestSent
              ? 'bg-dark-400 text-white/40 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-400/40 to-dark-400/40 hover:from-green-500/80 hover:to-dark-400 text-white shadow-lg'
          }`}
        >
          {isInterestSent ? 'Interest Sent' : 'Send Interest'}
        </button>
      </div>
    </motion.div>
  )
};

export default UserDiscoveryPage;
