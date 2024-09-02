import WebSocketClient, { IMessageData } from "ws-cox-client";

export const initializeSocket = (onMessage: (data: IMessageData) => void) => {

  const wsClient = WebSocketClient(
    `${process.env.NEXT_PUBLIC_API}`,
    `${process.env.NEXT_PUBLIC_TOKEN}`,
    onMessage
  );

  return wsClient;
};

export const getSocket = (onMessage: (data: IMessageData) => void) => initializeSocket(onMessage);
