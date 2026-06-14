'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/lib/store';
import { useQueryClient } from '@tanstack/react-query';

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

function GlobalSocketSync({
  socket,
  isConnected,
}: {
  socket: Socket | null;
  isConnected: boolean;
}) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleInvalidate = (payload: { queryKey: unknown[] }) => {
      if (payload && payload.queryKey) {
        queryClient.invalidateQueries({ queryKey: payload.queryKey });
      }
    };

    socket.on('invalidate_cache', handleInvalidate);

    // Core systemic invalidations
    socket.on('notification_received', () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread_notifications_count'] });
    });

    socket.on('order_updated', () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    });

    return () => {
      socket.off('invalidate_cache', handleInvalidate);
      socket.off('notification_received');
      socket.off('order_updated');
    };
  }, [socket, isConnected, queryClient]);

  return null;
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const token = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated || !token) {
      return;
    }

    // Strip trailing /api/v1 or trailing slashes for standard socket.io connections
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const socketUrl = apiUrl.replace(/\/api\/v1\/?$/, '');

    const socketInstance = io(socketUrl, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
      withCredentials: true,
    });

    socketInstance.on('connect', () => setIsConnected(true));
    socketInstance.on('disconnect', () => setIsConnected(false));

    queueMicrotask(() => setSocket(socketInstance));

    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [token, hasHydrated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      <GlobalSocketSync socket={socket} isConnected={isConnected} />
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
