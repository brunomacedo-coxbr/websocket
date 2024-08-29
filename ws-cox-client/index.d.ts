declare module "ws-cox-client" {
  export default class WebSocketClient {
    constructor(url: string, token?: string, onMessage?: (data: any) => void);

    // Initialize connection
    connect(): void;

    // Send messages to server
    sendMessage(message: string): void;

    // Closes WebSocket connection
    disconnect(): void;

    // Set a WebSocket event listener
    addEventListener(event: string, callback: (data: any) => void): void;
  }
}
