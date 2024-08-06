"use client"
import { useEffect, useState } from 'react';

const Home: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.send(message);
      setMessage('');
    }
  };

  return (
    <div>
      <h1>WebSocket com Next.js e TypeScript</h1>
      <input
        type="text"
        value={message}
        className="border"
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default Home;
