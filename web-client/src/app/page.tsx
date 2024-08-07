"use client";
import { useEffect, useState } from "react";
import { v4 as uniqueId } from 'uuid';
import ChatItem from "@/components/chatItem";

const Home: React.FC = () => {
  const [receivedMessage, setReceivedMessage] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    /* ws.onopen = () => {
      console.log('Conectado ao servidor WebSocket');
    }; */

    ws.onmessage = (event: MessageEvent) => {
      if (event.data instanceof Blob) {
        // Se a mensagem for um Blob, converte para texto
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setReceivedMessage((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsText(event.data);
      } else {
        // Caso contrário, assuma que a mensagem já é texto
        setReceivedMessage((prev) => [...prev, event.data as string]);
      }
    };

    /* ws.onerror = (error) => {
      console.error('Erro WebSocket:', error);
    }; */

    /* ws.onclose = () => {
      console.log('Conexão WebSocket fechada');
    }; */

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>WebSocket com Next.js e TypeScript</h1>
      <p>Mensagem recebida:</p>
      <ul>
        {receivedMessage.map((message) => (
          <ChatItem key={uniqueId()} message={message} />
        ))}
      </ul>
    </div>
  );
};

export default Home;
