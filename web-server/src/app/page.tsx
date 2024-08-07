"use client";
import { useEffect, useState } from "react";

const Home: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.send(message);
      setMessage("");
    }
  };

  return (
    <div className="text-center flex items-center justify-center p-8">
      <div className="p-4 border max-w-sm w-full">
        <h1>WebSocket Client-Server</h1>
        <input
          type="text"
          value={message}
          className="border p-2 m-2 text-base"
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Place your message here..."
        />
        <button className="py-2 px-6 bg-blue-600 text-white text-base" onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default Home;
