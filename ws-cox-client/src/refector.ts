import { EventEmitter } from "events";

interface AuthMessage {
  type: "auth";
  token: string;
}

interface AuthResponse {
  type: "auth";
  success: boolean;
}

export interface IMessageData {
  message: string;
  id: string;
}

export type Message = AuthMessage | AuthResponse | IMessageData;

function isAuthResponse(message: Message): message is AuthResponse {
  return (
    (message as AuthResponse).type === "auth" &&
    typeof (message as AuthResponse).success === "boolean"
  );
}

/** Observer Pattern (Event Emitter Pattern) */
export default class WebSocketClient extends EventEmitter {
  private socket!: WebSocket;
  private authFailed = false;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 10;
  private readonly reconnectInterval = 5000;

  constructor(private url: string, private token: string) {
    super();
    this.connect();
  }

  private connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this.authFailed = false;
      this.reconnectAttempts = 0;
      const authMessage: AuthMessage = { type: "auth", token: this.token };
      this.socket.send(JSON.stringify(authMessage));
    };

    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const data: Message = JSON.parse(event.data);

        if (isAuthResponse(data)) {
          if (data.success) {
            this.emit("authenticated");
          } else {
            this.emit("authFailed");
            this.authFailed = true;
            this.socket.close();
          }
        } else {
          this.emit("message", data as IMessageData);
        }
      } catch (error) {
        this.emit("error", error);
      }
    };

    this.socket.onclose = () => {
      if (
        !this.authFailed &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        this.reconnectAttempts++;
        setTimeout(() => this.connect(), this.reconnectInterval);
      } else if (this.authFailed) {
        this.emit("authFailed");
      } else {
        this.emit("maxReconnectAttemptsReached");
      }
    };

    this.socket.onerror = (error: Event) => {
      this.emit("error", error);
      this.socket.close();
    };
  }

  public sendMessage(message: string) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      this.emit("error", new Error("Socket is not open. Message not sent."));
    }
  }

  public disconnect() {
    this.socket.close();
  }
}

// // Usage example
// const wsClient = new WebSocketClient(
//   "wss://example.com/socket",
//   "your-auth-token"
// );

// wsClient.on("authenticated", () => {
//   console.log("Authenticated successfully.");
// });

// wsClient.on("authFailed", () => {
//   console.error("Authentication failed.");
// });

// wsClient.on("message", (data: IMessageData) => {
//   console.log("Received message:", data.message);
// });

// wsClient.on("error", (error) => {
//   console.error("Error:", error);
// });

// wsClient.on("maxReconnectAttemptsReached", () => {
//   console.error("Max reconnect attempts reached. Giving up.");
// });
