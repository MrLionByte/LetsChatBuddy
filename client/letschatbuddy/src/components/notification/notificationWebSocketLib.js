let notificationSocket = null;
const notificationHandlers = new Set();
let reconnectAttempts = 0;
const MAX_RECONNECTS = 5;


export const initializeNotificationWebSocket = (token) => {
    if (notificationSocket) {
        notificationSocket.close();
    }

    const wsUrl = `${import.meta.env.VITE_NOTIFICATION_WS_URL}/?token=${token}`;
    notificationSocket = new WebSocket(wsUrl);

    notificationSocket.onopen = () => {
        reconnectAttempts = 0;
    };

    notificationSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'notification') {
            notificationHandlers.forEach((h) => h(data.notification));
        }
    };

    notificationSocket.onclose = (e) => {
        if (!e.wasClean && reconnectAttempts < MAX_RECONNECTS) {
            reconnectAttempts++;
            setTimeout(() => {
                initializeNotificationWebSocket(token);
            }, Math.min(1000 * Math.pow(2, reconnectAttempts), 10000));
        }
    };
    
    notificationSocket.onerror = (err) => {
        // console.error('Notification WebSocket error:', err);
    };
}

export const registerNotificationHandler = (handler) => {
  notificationHandlers.add(handler);
  return () => notificationHandlers.delete(handler);
};

export const closeNotificationWebSocket = () => {
  if (notificationSocket) {
    notificationSocket.close(1000, 'Component unmounted');
    notificationSocket = null;
  }
};