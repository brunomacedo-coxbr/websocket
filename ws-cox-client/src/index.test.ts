import { Server } from "mock-socket";
import WebSocketClient, { IMessageData } from ".";

describe("WebSocketClient", () => {
  let mockServer: Server;

  const serverUrl = "ws://localhost:4000";
  const token = "ZXhhbXBsZS10b2tlbi0xMjM0NTY=";

  beforeEach(() => {
    mockServer = new Server(serverUrl);
  });

  afterEach(() => {
    mockServer.stop();
  });

  it("should send authentication message on open", (done) => {
    WebSocketClient(serverUrl, token, () => {});

    mockServer.on("connection", (socket) => {
      socket.on("message", (response) => {
        const data = JSON.parse(response as string);
        expect(data.type).toBe("auth");
        expect(data.token).toBe(token);
        done();
      });
    });
  });

  it("should call onMessage when a valid message is received", (done) => {
    const mockMessage: IMessageData = { id: "1", message: "Test message" };

    mockServer.on("connection", (socket) => {
      socket.on("message", () => {
        socket.send(JSON.stringify(mockMessage));
      });
    });

    WebSocketClient(serverUrl, token, (data) => {
      try {
        expect(data).toEqual(mockMessage);
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  it("should handle authentication failure", (done) => {
    const mockClose = jest.fn();

    mockServer.on("connection", (socket) => {
      socket.on("message", () => {
        socket.send(JSON.stringify({ type: "auth", success: false }));
      });

      /** Spy on the close method */
      socket.close = mockClose;
    });

    WebSocketClient(serverUrl, "invalid-token", () => {});

    setTimeout(() => {
      try {
        expect(mockClose).toHaveBeenCalled();
        done();
      } catch (error) {
        done(error);
      } finally {
        mockServer.close();
      }
    }, 100);
  });

  it("should attempt to reconnect on close", (done) => {
    let reconnectAttempts = 0;

    WebSocketClient(serverUrl, token, () => {});
    mockServer.stop();

    setTimeout(() => {
      mockServer = new Server(serverUrl);

      setTimeout(() => {
        reconnectAttempts++;
        expect(reconnectAttempts).toBeGreaterThan(0);
        done();
      }, 100);
    }, 100);
  });

  it("should stop reconnecting after 10 attempts", (done) => {
    let reconnectAttempts = 0;

    WebSocketClient(serverUrl, token, () => {});
    mockServer.stop();

    const attemptReconnect = () => {
      setTimeout(() => {
        if (reconnectAttempts < 10) {
          reconnectAttempts++;
          attemptReconnect();
        } else {
          expect(reconnectAttempts).toBe(10);
          done();
        }
      }, 100);
    };

    attemptReconnect();
  });
});
