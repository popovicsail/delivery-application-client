import React, { useState, useEffect } from 'react';
import { useChat } from '../hooks/useChat';

const SupportChat = () => {
  const API_URL = "https://localhost:5000/support-chat"; 

  const { messages, sendMessageToSupport, replyToCustomer } = useChat(API_URL);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [activeChatUserId, setActiveChatUserId] = useState(null);

  useEffect(() => {
    const profileData = sessionStorage.getItem("myProfile");
    if (profileData) {
      const profile = JSON.parse(profileData);
      setCurrentUser(profile);
    }
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.roles.includes("Support")) {
      const lastCustomerMessage = [...messages].reverse()
        .find(msg => msg.userId !== currentUser.id);
      
      if (lastCustomerMessage) {
        setActiveChatUserId(lastCustomerMessage.userId);
      }
    }
  }, [messages, currentUser]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    if (currentUser && currentUser.roles.includes("Support") && activeChatUserId) {
      replyToCustomer(activeChatUserId, newMessage);
    } else {
      sendMessageToSupport(newMessage);
    }

    setNewMessage("");
  };

  return (
    <div className="chat-window">
      <div className="messages-list">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.userName || msg.userId}: </strong>
            <span>{msg.message}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Unesi poruku..."
        />
        <button type="submit">Pošalji</button>
      </form>
    </div>
  );
};

export default SupportChat;