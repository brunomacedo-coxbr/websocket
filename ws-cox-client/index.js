export default function WebSocketClient(url, token, onMessage) {
  let socket;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 10;
  const reconnectInterval = 5000; // 5 seconds

  const connect = () => {
    socket = new WebSocket(url);

    socket.onopen = () => {
      reconnectAttempts = 0; // Reset reconnect attempts on successful connection
      socket.send(JSON.stringify({ type: "auth", token: token }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "auth") {
        if (data.success) {
          console.log("Authenticated successfully.");

        } else {
          console.error("Authentication failed.");
          socket.close();
        }

      } else {
        onMessage(data);
      }
    };

    socket.onclose = () => {
      if (reconnectAttempts < maxReconnectAttempts) {
        console.log(`Socket closed. Attempting to reconnect... (${ reconnectAttempts + 1 }/${maxReconnectAttempts})`);
        reconnectAttempts++;

        setTimeout(connect, reconnectInterval);
      } else {
        console.error("Max reconnect attempts reached. Giving up.");
      }
    };

    socket.onerror = (error) => {
      console.error(`Socket encountered error. ${JSON.stringify(error)}`);
      socket.close();
    };
  };

  connect();

  return {
    sendMessage: (message) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      } else {
        console.error("Socket is not open. Message not sent.");
      }
    },
    disconnect: () => {
      socket.close();
    },
  };
}
