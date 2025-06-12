import { useEffect } from "react";
import {toast} from 'react-hot-toast';
import {initializeNotificationWebSocket,registerNotificationHandler} from './notificationWebSocketLib';

const NotificationListener = ({token}) => {
  useEffect(() => {
    
    initializeNotificationWebSocket(token);

    const unregister = registerNotificationHandler((notification) => {
      switch(notification.event) {
        case 'interest_accepted':
          toast.success(notification.message);
          break;
        case 'interest_rejected':
          toast.error(notification.message);
          break;
        default:
          toast(notification.message);
      }
    });

    return () => {
      unregister();
    };
  }, [token]);

  return null;
};

export default NotificationListener;
