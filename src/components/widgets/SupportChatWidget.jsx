import React, { useState } from 'react';
import SupportChat from '../ChatSupport';
import '../../styles/SupportChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="chat-widget-container">
      
      {isOpen && (
        <div className="chat-window-popup">
          <div className="chat-header-actions">
            <button className="close-btn" onClick={() => setIsOpen(false)}>X</button>
          </div>
          <SupportChat />
        </div>
      )}

      <button 
        className="chat-fab-button" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '▼' : '💬'} {}
      </button>
    </div>
  );
};

export default ChatWidget;