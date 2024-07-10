
import { clearMessage, newMessage } from '../store/slices/websocketReducer';
import { store } from '../store/store';
import { toast } from 'react-toastify';


let socket;

const notify = (notification) => {
  console.log("notification", notification);
  toast(notification);
};


export const connectWebSocket = (data) => {
  console.log("user_id", data);
  if (data && (!socket || socket.readyState === WebSocket.CLOSED)) {
    socket = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/${data.id}/`);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if(message.message != 'update'){
        notify(message.message);
      }
      store.dispatch(
          newMessage({
            message: message.message,
            count: message.unread_count,
          })
        );
      console.log("message", message);
    };

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      store.dispatch(clearMessage());
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
  }
};
