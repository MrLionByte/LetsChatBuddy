// Enhanced webSocketLib.js
let socket = null;
const messageHandlers = new Set();
const notificationHandlers = new Set();
const connectionHandlers = new Set();
let reconnectAttempts = 0;
const MAX_RECONNECTS = 5;
let currentChatId = null;
let currentToken = null;

export const initializeWebSocket = (otherUserId, token) => {
  if (socket) {
    socket.onopen = null;
    socket.onmessage = null;
    socket.onclose = null;
    socket.onerror = null;
    socket.close();
  }

  currentChatId = otherUserId;
  currentToken = token;
  
  const wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL}/${otherUserId}/?token=${token}`;
  
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    reconnectAttempts = 0;
    connectionHandlers.forEach((h) => h(true));
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
 
      if (data.type === 'error' && (data.reason === 'invalid_token' || data.reason === 'unauthorized')) {
        socket.close();
        return;
      }

      if (data.type === 'message') {
        messageHandlers.forEach((h) => h({
          type: 'message',
          message: data.message
        }));
      }
      else if (data.type === 'chat_history') {
        messageHandlers.forEach((h) => h({
          type: 'chat_history',
          messages: data.messages
        }));
      }
      else if (data.type === 'user_status') {
        messageHandlers.forEach((h) => h({
          type: 'user_status',
          user_id: data.user_id,
          is_online: data.is_online,
          last_seen: data.last_seen
        }));
      }
      else if (data.type === 'notification') {
        notificationHandlers.forEach((h) => h(data.notification));
      }
    } catch (err) {
      // console.error('WebSocket message parsing error:', err);
    }
  };

  socket.onclose = (e) => {
    connectionHandlers.forEach((h) => h(false));

    if (!e.wasClean && reconnectAttempts < MAX_RECONNECTS) {
      reconnectAttempts++;
      setTimeout(() => {
        if (currentChatId && currentToken) {
          initializeWebSocket(currentChatId, currentToken);
        }
      }, Math.min(1000 * Math.pow(2, reconnectAttempts), 10000)); // Exponential backoff
    } else {
      // console.log('Max reconnect attempts reached or clean close. Not reconnecting.');
    }
  };

  socket.onerror = (err) => {
    // console.error('WebSocket error:', err);
  };
};

export const sendMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    const payload = {
      type: 'message',
      chat_message: message
    };
    socket.send(JSON.stringify(payload));
  } else {
    // console.error('WebSocket is not open. Cannot send message. State:', socket?.readyState);
  }
};

export const sendTypingStatus = (isTyping) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'typing',
      is_typing: isTyping
    }));
  }
};

export const registerMessageHandler = (handler) => {
  messageHandlers.add(handler);
  return () => messageHandlers.delete(handler);
};

export const registerNotificationHandler = (handler) => {
  notificationHandlers.add(handler);
  return () => notificationHandlers.delete(handler);
};

export const registerConnectionHandler = (handler) => {
  connectionHandlers.add(handler);
  return () => connectionHandlers.delete(handler);
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close(1000, 'Component unmounted'); // Clean close
    socket = null;
  }
  currentChatId = null;
  currentToken = null;
};

export const getConnectionState = () => {
  return socket?.readyState || WebSocket.CLOSED;
};