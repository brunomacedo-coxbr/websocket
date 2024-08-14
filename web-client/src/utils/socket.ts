import { io, Socket } from "socket.io-client";

const SERVER_URL = "http://localhost:4000";
const JWT = "ZXhhbXBsZS10b2tlbi0xMjM0NTY=";
const RECONNECT_INTERVAL = 5000;
const MAX_RECONNECT_ATTEMPTS = 10;

let socket: Socket;
let reconnectAttempts = 0;

const attemptReconnect = () => {
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts += 1;
    console.log(`Attempting to reconnect... (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
    setTimeout(() => {
      initializeSocket();
    }, RECONNECT_INTERVAL);
  } else {
    console.error("Max reconnect attempts reached. Please check the server.");
  }
};

export const initializeSocket = () => {
  socket = io(SERVER_URL, {
    // transports: ['websocket'],
    auth: {
      token: JWT,
    },
  });

  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
    reconnectAttempts = 0;
  });

  socket.on("connect_error", (error) => {
    console.error("Connection error:", error.message);
  });

  socket.on("disconnect", () => {
    console.warn("Disconnected from WebSocket server");
    attemptReconnect();
  });

  return socket;
};

export const getSocket = () => initializeSocket();
