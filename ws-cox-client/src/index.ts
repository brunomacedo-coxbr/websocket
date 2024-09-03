/**
 * Represents a message used for authentication.
 */
interface AuthMessage {
  type: "auth";
  token: string;
}

/**
 * Represents a response to an authentication message.
 */
interface AuthResponse {
  type: "auth";
  success: boolean;
}

/**
 * Represents data received from the WebSocket.
 */
export interface IMessageData {
  message: string;
  id: string;
}

export interface WSClient {
  sendMessage: (message: string) => void;
  disconnect: () => void;
}

/**
 * Represents the different types of messages that can be received or sent.
 */
export type Message = AuthMessage | AuthResponse | IMessageData;

/**
 * Type guard to determine if a message is of type `AuthResponse`.
 * @param message - The message to check.
 * @returns `true` if the message is an `AuthResponse`, `false` otherwise.
 */
function isAuthResponse(message: Message): message is AuthResponse {
  return (
    (message as AuthResponse).type === "auth" &&
    typeof (message as AuthResponse).success === "boolean"
  );
}

/**
 * Creates a WebSocket client that connects to the specified URL, handles authentication, and processes messages.
 * @param url - The URL to connect to.
 * @param token - The authentication token.
 * @param onMessage - A callback function that is invoked when a message of type `IMessageData` is received.
 * @returns An object with methods to send messages and disconnect the WebSocket.
 *
 * @example
 * ```typescript
 * import WebSocketClient, { IMessageData } from "ws-cox-client";
 *
 * const handleMessage = (data: IMessageData) => {
 *   console.log("Received message:", data.message);
 * };
 *
 * const wsClient = WebSocketClient(
 *   "wss://example.com/socket",
 *   "your-auth-token",
 *   handleMessage
 * );
 *
 * // Send a message
 * wsClient.sendMessage(JSON.stringify({ message: "Hello", id: "1" }));
 *
 * // Disconnect the WebSocket
 * wsClient.disconnect();
 * ```
 */
export default function WebSocketClient(
  url: string,
  token: string,
  onMessage: (data: IMessageData) => void
) {
  let authFailed = false;
  let socket: WebSocket;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 10;
  const reconnectInterval = 5000; // 5 seconds

  const connect = () => {
    socket = new WebSocket(url);

    socket.onopen = () => {
      authFailed = false; // Reset authFailed on new connection attempt
      reconnectAttempts = 0; // Reset reconnect attempts on successful connection
      const authMessage: AuthMessage = { type: "auth", token: token };
      socket.send(JSON.stringify(authMessage));
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data: Message = JSON.parse(event.data);

        if (isAuthResponse(data)) {
          if (data.success) {
            console.log("Authenticated successfully.");
          } else {
            console.error("Authentication failed.");
            authFailed = true;
            socket.close();
          }
        } else {
          /** Ensure that `data` is indeed `IMessageData` */
          if ("message" in data && "id" in data) {
            onMessage(data as IMessageData);
          } else {
            console.error("Received unexpected message format:", data);
          }
        }
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    };

    socket.onclose = () => {
      if (!authFailed && reconnectAttempts < maxReconnectAttempts) {
        console.log(
          `Socket closed. Attempting to reconnect... (${
            reconnectAttempts + 1
          }/${maxReconnectAttempts})`
        );
        reconnectAttempts++;
        setTimeout(connect, reconnectInterval);
      } else if (authFailed) {
        console.error("Authentication failed. Will not attempt to reconnect.");
      } else {
        console.error("Max reconnect attempts reached. Giving up.");
      }
    };

    socket.onerror = (error: Event) => {
      console.error(`Socket encountered error. ${JSON.stringify(error)}`);
      socket.close();
    };
  };

  connect();

  return {
    /**
     * Sends a message over the WebSocket connection.
     * @param message - The message to send.
     */
    sendMessage: (message: string) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      } else {
        console.error("Socket is not open. Message not sent.");
      }
    },
    /**
     * Closes the WebSocket connection.
     */
    disconnect: () => {
      socket.close();
    },
  } as WSClient;
}
