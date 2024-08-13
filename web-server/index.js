const express = require('express');
const { Server } = require('socket.io');
const { createServer } = require('node:http');
const { join } = require('node:path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// io.on('connection', (socket) => {
//   socket.broadcast.emit('hi');
// });

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

httpServer.listen(4000, () => {
  console.log('Server running at http://localhost:4000');
});
