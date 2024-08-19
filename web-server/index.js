const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { v4: uniqueId } = require("uuid");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:9000",
    methods: ["GET", "POST"],
  },
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token === "ZXhhbXBsZS10b2tlbi0xMjM0NTY=") {
    next();
  } else {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  socket.on("send_message", (message) => {
    const chat = { message, id: uniqueId() };
    io.emit("send_message", chat);
    // console.log(JSON.stringify(chat));
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

httpServer.listen(4000, () => {
  console.log("Server listening on port 4000");
});
