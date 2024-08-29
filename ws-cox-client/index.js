export default function WebSocketClient(url, token, onMessage) {
  const socket = new WebSocket(url);

  socket.onopen = () => {
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

  /* socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
  */

  /* socket.onclose = () => {
    console.log("WebSocket connection closed.");
  }; */

  return {
    sendMessage: (message) => {
      socket.send(message);
    },
    disconnect: () => {
      socket.close();
    },
  };
}
