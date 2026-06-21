"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextProps {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextProps>({
  socket: null,
  isConnected: false,
});

// Provider quản lý và cung cấp kết nối Socket.IO Client duy nhất trong toàn ứng dụng
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("adminToken");
    if (!token) return;

    // Lấy URL socket bằng cách loại bỏ tiền tố api path
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
    const socketUrl = apiBaseUrl.replace("/api/v1", "");

    // Cấu hình kết nối socket với token xác thực
    const socketInstance = io(socketUrl, {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("Đã kết nối Socket.IO:", socketInstance.id);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("Đã ngắt kết nối Socket.IO");
    });

    setSocket(socketInstance);

    // Ngắt kết nối socket khi unmount context
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook để các component con dễ dàng truy cập và lắng nghe sự kiện
export const useSocket = () => useContext(SocketContext);
