import WebSocketClient from "ws-cox-client";

export interface IMessageData {
  message: string;
  id: string;
}

export const initializeSocket = (onMessage: (data: IMessageData) => void) => {
  const wsClient = new WebSocketClient(
    "ws://localhost:4000",
    "ZXhhbXBsZS10b2tlbi0xMjM0NTY=",
    onMessage
  );

  return wsClient;
};

export const getSocket = (onMessage: (data: IMessageData) => void) => initializeSocket(onMessage);
