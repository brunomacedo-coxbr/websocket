"use client";

import { useEffect, useState } from "react";
import { IMessageData } from "ws-cox-client";
import { getSocket } from "../utils/socket";

const Home = () => {
  /* let messages: IMessageData[] = [];

  const handleMessage = ({ message, id }: IMessageData) => {
    messages = [...messages, { message, id }];
  };

  const socket = getSocket(handleMessage); */

  const [messages, setMessages] = useState<IMessageData[]>([]);

  const handleMessage = ({ message, id }: IMessageData) => {
    setMessages((prev) => [...prev, { message, id }]);
  };

  useEffect(() => {
    const socket = getSocket(handleMessage);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="text-center flex items-center justify-center p-8">
      <div className="p-4 border max-w-sm w-full">
        <h1 className="text-lg font-bold">WebSocket Client</h1>
        <p className="text-gray-500">Messages from server:</p>
        <ul className="mt-3">
          {messages.map((msgResp) => (
            <li
              key={msgResp.id}
              id={msgResp.id}
              className="odd:bg-slate-300 p-2"
            >
              {msgResp.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
