import React, {createContext, useContext, useRef, useState, useEffect} from 'react';
import {io, Socket} from 'socket.io-client';
import {BASE_URL} from '../services/api';
import {useSelector} from 'react-redux';
import {RootState} from '../services/store';

interface SocketContextType {
  socket: Socket | null;
  connectToSocket: (roomId: string) => void;
  disconnectSocket: () => void;
  globalSocket: Socket | null;
  connectGlobalSocket: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connectToSocket: () => {},
  disconnectSocket: () => {},
  globalSocket: null,
  connectGlobalSocket: () => {},
});

export const SocketProvider = ({children}: {children: React.ReactNode}) => {
  const socketRef = useRef<Socket | null>(null);
  const globalSocketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [globalSocket, setGlobalSocket] = useState<Socket | null>(null);
  const user = useSelector((state: RootState) => state.user.user);

  // Global socket connection for app-wide events
  const connectGlobalSocket = () => {
    if (!user?._id) return;

    if (globalSocketRef.current) {
      globalSocketRef.current.disconnect();
    }

    const newGlobalSocket = io(BASE_URL, {
      transports: ['websocket'],
      query: {
        userId: user._id,
        type: 'global',
      },
    });

    newGlobalSocket.on('connect', () => {
      console.log('🌐 Global socket connected');
      newGlobalSocket.emit('joinRoom', {
        roomId: `user-${user._id}`,
        userId: user._id,
      });
    });

    newGlobalSocket.on('connect_error', err => {
      console.warn('❌ Global socket error:', err.message);
    });

    globalSocketRef.current = newGlobalSocket;
    setGlobalSocket(newGlobalSocket);
  };

  // Auto-connect global socket when user is available
  useEffect(() => {
    if (user?._id && !globalSocketRef.current) {
      connectGlobalSocket();
    }

    return () => {
      if (globalSocketRef.current) {
        globalSocketRef.current.disconnect();
        globalSocketRef.current = null;
        setGlobalSocket(null);
      }
    };
  }, [user?._id]);

  const connectToSocket = (roomId: string) => {
    if (!user?._id || !roomId) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const newSocket = io(BASE_URL, {
      transports: ['websocket'],
      query: {
        userId: user._id,
        roomId,
      },
    });

    newSocket.on('connect', () => {
      newSocket.emit('joinRoom', {roomId, userId: user._id});
    });

    newSocket.on('connect_error', err => {
      console.warn('❌ Socket error:', err.message);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
    }
  };

  return (
    <SocketContext.Provider value={{
      socket, 
      connectToSocket, 
      disconnectSocket,
      globalSocket,
      connectGlobalSocket
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);