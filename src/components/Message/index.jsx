import React, { useState, useEffect, useContext, createContext } from 'react';
import { PiWarningCircleDuotone } from 'react-icons/pi';

const MessageContext = createContext();

export const useMessage = () => useContext(MessageContext);

const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [messageApi, setMessageApi] = useState();

  useEffect(() => {
    const addMessage = (type, content) => {
      const id = Date.now();
      const messageContent = content instanceof Error ? content.message : content;
      setMessages((prevMessages) => [...prevMessages, { id, type, content: messageContent }]);
      setTimeout(() => removeMessage(id), 3500);
    };

    const removeMessage = (id) => {
      setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
    };

    const messageApi = {
      success: (content) => addMessage('success', content),
      warning: (content) => addMessage('warning', content),
      error: (content) => addMessage('error', content),
    };

    setMessageApi(messageApi);
  }, []);

  // Expose messageApi for use in other components
  return (
    <MessageContext.Provider value={messageApi}>
      {children}
      <div className="message-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <PiWarningCircleDuotone style={{ color: `${message.type}`, fontSize: '24px' }}/>
            {message.content}
          </div>
        ))}
      </div>
    </MessageContext.Provider>
  );
};

export default MessageProvider;
