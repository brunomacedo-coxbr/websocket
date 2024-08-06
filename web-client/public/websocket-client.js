/* // public/websocket-client.js
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  console.log('Conectado ao WebSocket');
};

ws.onmessage = event => {
  console.log('Mensagem recebida do servidor:', event.data);
  // Aqui você pode atualizar o estado global ou enviar um evento para o Next.js
};

ws.onerror = error => {
  console.error('Erro no WebSocket:', error);
};

ws.onclose = () => {
  console.log('Conexão WebSocket fechada');
};

// Função para enviar mensagens ao servidor
function sendMessage(message) {
  ws.send(message);
}

// Expondo a função globalmente para o Next.js
window.websocketClient = { sendMessage };
 */
