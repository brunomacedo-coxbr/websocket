import { Server } from "mock-socket";
import WebSocketClient, { IMessageData } from ".";

describe("WebSocketClient", () => {
  const serverUrl = "ws://localhost:4000";
  const token = "ZXhhbXBsZS10b2tlbi0xMjM0NTY=";
  let mockServer: Server;
  // let client: ReturnType<typeof WebSocketClient>;

  beforeAll((done) => {
    // Create a new mock server before each test
    mockServer = new Server(serverUrl);
    done();
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
        // Send a valid message from the server
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

  // it("should handle authentication failure", (done) => {
  //   mockServer.on("connection", (socket) => {
  //     socket.on("message", () => {
  //       // Send an authentication failure response
  //       socket.send(JSON.stringify({ type: "auth", success: false }));
  //     });
  //   });

  //   client = WebSocketClient(serverUrl, token, () => {});

  //   // Wait for the client to handle authentication failure
  //   setTimeout(() => {
  //     // Check that the client did not reconnect
  //     expect(mockServer.clients.length).toBe(0); // The connection should be closed
  //     done();
  //   }, 100);
  // });

  // it("should attempt to reconnect on close", (done) => {
  //   let reconnectAttempts = 0;
  //   mockServer.on("connection", (socket) => {
  //     socket.on("message", () => {
  //       // Close the server immediately to trigger a reconnection attempt
  //       mockServer.close();
  //     });
  //   });

  //   client = WebSocketClient(serverUrl, token, () => {});

  //   // Reopen the server after a short delay to allow for reconnection attempt
  //   setTimeout(() => {
  //     mockServer = new Server(serverUrl); // Reopen the server

  //     // Simulate reconnection attempt
  //     setTimeout(() => {
  //       reconnectAttempts++;
  //       expect(reconnectAttempts).toBeGreaterThan(0);
  //       done();
  //     }, 1000); // Wait enough time to check if reconnection happens
  //   }, 1000); // Allow time for the client to attempt reconnection
  // });

  // it("should stop reconnecting after 10 attempts", (done) => {
  //   let reconnectAttempts = 0;
  //   mockServer.on("connection", (socket) => {
  //     socket.on("message", () => {
  //       // Close the server to trigger reconnections
  //       mockServer.close();
  //     });
  //   });

  //   client = WebSocketClient(serverUrl, token, () => {});

  //   // Reopen the server after a short delay
  //   const attemptReconnect = () => {
  //     setTimeout(() => {
  //       if (reconnectAttempts < 10) {
  //         reconnectAttempts++;
  //         mockServer = new Server(serverUrl); // Reopen the server
  //         attemptReconnect(); // Continue attempting to reconnect
  //       } else {
  //         expect(reconnectAttempts).toBe(10); // Ensure it stopped after 10 attempts
  //         done();
  //       }
  //     }, 5000); // Wait long enough to simulate reconnection intervals
  //   };

  //   attemptReconnect();
  // });
});
