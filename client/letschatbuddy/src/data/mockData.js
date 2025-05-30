// Mock user data
export const mockUsers = [
  { 
    id: 1, 
    name: 'Alex Chen', 
    avatar: '🎨', 
    status: 'online', 
    bio: 'Digital artist & coffee enthusiast',
    lastActive: '2 min ago'
  },
  { 
    id: 2, 
    name: 'Sam Rivera', 
    avatar: '🎵', 
    status: 'away', 
    bio: 'Music producer, night owl',
    lastActive: '1 hour ago'
  },
  { 
    id: 3, 
    name: 'Jordan Kim', 
    avatar: '📚', 
    status: 'online', 
    bio: 'Bookworm & adventure seeker',
    lastActive: 'now'
  },
  { 
    id: 4, 
    name: 'Casey Morgan', 
    avatar: '🌟', 
    status: 'offline', 
    bio: 'Dreamer & stargazer',
    lastActive: '3 days ago'
  },
  { 
    id: 5, 
    name: 'Riley Park', 
    avatar: '🎭', 
    status: 'online', 
    bio: 'Theater lover & storyteller',
    lastActive: '5 min ago'
  },
  { 
    id: 6, 
    name: 'Taylor Reed', 
    avatar: '🏄', 
    status: 'online', 
    bio: 'Surf enthusiast & web developer',
    lastActive: 'now'
  },
  { 
    id: 7, 
    name: 'Morgan Gray', 
    avatar: '🧘', 
    status: 'away', 
    bio: 'Yoga instructor & mindfulness coach',
    lastActive: '45 min ago'
  },
  { 
    id: 8, 
    name: 'Jamie Lee', 
    avatar: '🎬', 
    status: 'online', 
    bio: 'Film director & storyteller',
    lastActive: 'just now'
  }
]

// Mock messages for demo chats
export const generateMockMessages = (chatId) => {
  const templates = [
    { text: "Hey, how are you doing today?", sent: false },
    { text: "I'm doing well, thanks for asking! How about you?", sent: true },
    { text: "Pretty good! Been working on some new projects lately.", sent: false },
    { text: "That sounds interesting! What kind of projects?", sent: true },
    { text: "Mostly creative stuff - mixing music and some digital art.", sent: false },
    { text: "That's awesome! I'd love to see some of your work sometime.", sent: true },
    { text: "Sure thing! I'll send you some links later. What have you been up to?", sent: false },
    { text: "Just been catching up on some reading and enjoying the weather.", sent: true },
    { text: "Nice! Any book recommendations?", sent: false },
    { text: "I just finished 'The Midnight Library' - it was fantastic!", sent: true }
  ]
  
  // Use a deterministic subset of messages based on chatId
  const count = 4 + (chatId % 7) // between 4 and 10 messages
  
  return Array(count).fill().map((_, idx) => {
    const template = templates[idx % templates.length]
    return {
      id: `msg-${chatId}-${idx}`,
      text: template.text,
      senderId: template.sent ? 'currentUser' : chatId,
      timestamp: getRandomPastTime(),
      isRead: true
    }
  })
}

// Helper to generate random past times
function getRandomPastTime() {
  const times = [
    '2 min ago', '5 min ago', '10 min ago', '15 min ago',
    '30 min ago', '1 hour ago', '2 hours ago', 'Yesterday'
  ]
  return times[Math.floor(Math.random() * times.length)]
}