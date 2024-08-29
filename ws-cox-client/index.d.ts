declare module "ws-cox-client" {
  interface IMessageData {
    message: string;
    id: string;
  }

  export default class WebSocketClient {
    constructor(
      url: string,
      token?: string,
      onMessage?: (data: IMessageData) => void
    );

    // Send messages to server
    sendMessage(message: string): void;

    // Closes WebSocket connection
    disconnect(): void;
  }
}
