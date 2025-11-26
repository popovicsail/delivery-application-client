import { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

export const useChat = (hubUrl) => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const token = sessionStorage.getItem("token"); 
    if (!token) return;

    const newConnection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
          accessTokenFactory: () => token 
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);
  }, [hubUrl]);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log("SignalR Konekcija uspostavljena.");
          connection.on("ReceiveMessage", (userId, userName, message) => {
            const newMessage = { userId, userName, message, timestamp: new Date() };
            setMessages(prevMessages => [...prevMessages, newMessage]);
          });
        })
        .catch(e => console.error("SignalR Konekcija neuspešna: ", e));

      return () => {
        connection.stop();
      };
    }
  }, [connection]);

  const sendMessageToSupport = async (message) => {
    if (connection) {
      try {
        await connection.invoke("SendMessageToSupport", message);
      } catch (e) {
        console.error("Slanje 'SendMessageToSupport' nije uspelo: ", e);
      }
    }
  };

  const replyToCustomer = async (customerUserId, message) => {
    if (connection) {
      try {
        await connection.invoke("ReplyToCustomer", customerUserId, message);
      } catch (e) {
        console.error("Slanje 'ReplyToCustomer' nije uspelo: ", e);
      }
    }
  };

  return { messages, sendMessageToSupport, replyToCustomer };
};