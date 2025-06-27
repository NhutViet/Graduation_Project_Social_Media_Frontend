import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from 'react';
import {io, Socket} from 'socket.io-client';
import {BASE_URL} from '../services/api';
import {useSelector} from 'react-redux';
import {RootState} from '../services/store';

interface SocketContextType {
  socket: Socket | null; // 🔹 Chat socket
  notificationSocket: Socket | null;
  connectToSocket: (roomId: string) => void;
  connectNotificationSocket: () => void;
  disconnectAllSockets: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  notificationSocket: null,
  connectToSocket: () => {},
  connectNotificationSocket: () => {},
  disconnectAllSockets: () => {},
});

export const SocketProvider = ({children}: {children: React.ReactNode}) => {
  const chatRef = useRef<Socket | null>(null);
  const notiRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null); // 🔹 Chat socket
  const [notificationSocket, setNotificationSocket] = useState<Socket | null>(
    null,
  );
  const user = useSelector((state: RootState) => state.user.user);

  // 🔹 Kết nối socket Chat
  const connectToSocket = (roomId: string) => {
    if (!user?._id || !roomId) return;

    if (chatRef.current) {
      chatRef.current.disconnect();
    }

    const newSocket = io(`${BASE_URL}`, {
      transports: ['websocket'],
      query: {
        userId: user._id,
      },
    });

    newSocket.on('connect', () => {
      console.log('💬 Chat socket connected');
      newSocket.emit('joinRoom', {roomId});
    });

    newSocket.on('connect_error', err => {
      console.log('❌ Chat socket error:', err.message);
    });

    chatRef.current = newSocket;
    setSocket(newSocket);
  };

  // 🔹 Kết nối socket Notification
  const connectNotificationSocket = () => {
    if (!user?._id) return;

    if (notiRef.current) {
      notiRef.current.disconnect();
    }

    const newSocket = io(`${BASE_URL}/notification`, {
      transports: ['websocket'],
      query: {
        userId: user._id,
      },
    });

    newSocket.on('connect', () => {
      console.log('🔔 Notification socket connected');
    });

    newSocket.on('connect_error', err => {
      console.log('❌ Notification socket error:', err.message);
    });

    notiRef.current = newSocket;
    setNotificationSocket(newSocket);
  };

  // 🔹 Ngắt cả 2 socket
  const disconnectAllSockets = () => {
    if (chatRef.current) {
      chatRef.current.disconnect();
      chatRef.current = null;
      setSocket(null);
      console.log('🔌 Chat socket disconnected.');
    }

    if (notiRef.current) {
      notiRef.current.disconnect();
      notiRef.current = null;
      setNotificationSocket(null);
      console.log('🔌 Notification socket disconnected.');
    }
  };

  const disconnectSocket = () => {
    if (chatRef.current) {
      chatRef.current.disconnect();
      chatRef.current = null;
      setSocket(null);
      console.log('🔌 Socket disconnected.');
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket, // ✅ chat
        notificationSocket,
        connectToSocket, // ✅ chat
        connectNotificationSocket,
        disconnectAllSockets,
      }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
