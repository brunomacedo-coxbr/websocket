const WebSocket = require('ws');
const server = require('http').createServer();
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  ws.on('message', (message) => {
    console.log('Mensagem recebida: %s', message);

    // Envia a mensagem para todos os clientes conectados
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(8080, () => {
  console.log('Servidor WebSocket está ouvindo na porta 8080');
});
