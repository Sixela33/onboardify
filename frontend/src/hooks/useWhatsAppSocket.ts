import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const socket: Socket = io(VITE_API_URL, {
  transports: ['websocket'],
  autoConnect: true,
});

export const useWhatsAppSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      console.log('Socket connected');
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log('Socket disconnected');
      setIsConnected(false);
    }

    if (socket.connected) {
      onConnect();
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const on = (event: string, listener: (...args: any[]) => void) => {
    socket.on(event, listener);
  };

  const off = (event: string, listener: (...args: any[]) => void) => {
    socket.off(event, listener);
  };

  return { isConnected, on, off };
}; 