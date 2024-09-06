const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { join } = require("path");
const { v4: uniqueId } = require("uuid");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// const TOKEN = "ZXhhbXBsZS10b2tlbi03ODc4";
const TOKEN = "ZXhhbXBsZS10b2tlbi0xMjM0NTY=";

app.use("/ws-cox-client", express.static(join(__dirname, "../ws-cox-client/dist/index.js")));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

wss.on("connection", (ws) => {
  ws.isAuthenticated = false;

  ws.on("message", (message) => {
    if (!ws.isAuthenticated) {
      const data = JSON.parse(message);

      if (
        data.type === "auth" &&
        data.token === TOKEN
      ) {
        ws.isAuthenticated = true;
        ws.send(JSON.stringify({ type: "auth", success: true }));
        console.log("Client is logged.");
      } else {
        ws.send(JSON.stringify({ type: "auth", success: false }));
        ws.close(4001, "Unauthorized.");
      }
    } else {
      const textMessage = message.toString(); // Convert Buffer to string
      const sendMessage = { message: textMessage, id: uniqueId() };

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          // console.log(sendMessage);
          client.send(JSON.stringify(sendMessage));
        }
      });
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
