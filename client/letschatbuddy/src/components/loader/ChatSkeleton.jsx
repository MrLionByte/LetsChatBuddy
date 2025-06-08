import { motion } from 'framer-motion'


export const ChatListSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-dark-400/50 rounded-xl p-4 border border-dark-400/50"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-dark-300 rounded-full animate-pulse" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div className="h-4 bg-dark-300 rounded w-24 animate-pulse" />
                <div className="h-3 bg-dark-300 rounded w-12 animate-pulse" />
              </div>
              <div className="h-3 bg-dark-300 rounded w-32 mt-2 animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};


export const ChatMessagesSkeleton = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {[...Array(8)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
              index % 2 === 0 
                ? 'bg-dark-400/50 border border-dark-400/50' 
                : 'bg-primary-600/50'
            }`}
          >
            <div className={`h-4 rounded animate-pulse ${
              index % 2 === 0 ? 'bg-dark-300' : 'bg-primary-300'
            } w-${20 + (index % 3) * 10}`} />
            <div className={`h-3 rounded animate-pulse mt-2 ${
              index % 2 === 0 ? 'bg-dark-300' : 'bg-primary-300'
            } w-12`} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};