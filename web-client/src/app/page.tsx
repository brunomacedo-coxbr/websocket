"use client"
import { useEffect, useState } from 'react';

const Home: React.FC = () => {
  // const [socket, setSocket] = useState<WebSocket | null>(null);
  const [receivedMessage, setReceivedMessage] = useState<string>('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Conectado ao servidor WebSocket');
    };

    ws.onmessage = (event: MessageEvent) => {
      if (event.data instanceof Blob) {
        // Se a mensagem for um Blob, converta para texto
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setReceivedMessage(reader.result as string);
          }
        };
        reader.readAsText(event.data);
      } else {
        // Caso contrário, assuma que a mensagem já é texto
        setReceivedMessage(event.data as string);
      }
    };

    /* ws.onerror = (error) => {
      console.error('Erro WebSocket:', error);
    }; */

    ws.onclose = () => {
      console.log('Conexão WebSocket fechada');
    };

    // setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>WebSocket com Next.js e TypeScript</h1>
      <p>Mensagem recebida: {receivedMessage}</p>
    </div>
  );
};

export default Home;
