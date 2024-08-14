import { io, Socket } from "socket.io-client";

const SERVER_URL = "ws://localhost:4000";

let socket: Socket;

export const initializeSocket = (token: string) => {
  socket = io(SERVER_URL, {
    auth: {
      token,
    },
    // transports: ['websocket'],
  });

  return socket;
};

export const getSocket = () => socket;
