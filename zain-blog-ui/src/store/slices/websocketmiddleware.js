import { closeWebSocket, connectWebSocket } from '../../components/websocketService';
import { newMessage } from './websocketReducer';


const websocketMiddleware = (store) => (next) => (action) => {
  switch (action.type) {
    case 'auth/loginSuccess':
      connectWebSocket(action.payload.data);
      break;
    case 'auth/logoutSuccess':
      closeWebSocket();
      break;
    case 'NEW_MESSAGE':
      store.dispatch(newMessage(action.payload));
      break;
    default:
      break;
  }

  return next(action);
};

export default websocketMiddleware;
