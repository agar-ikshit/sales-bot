import React, { useEffect, useRef, memo, useState } from 'react';
import TextBox from '../input/Textbox';
import './chat.css';
import LoadingMessage from '../loading/Loading'; // Import the LoadingMessage component

const ChatComponent = ({ messages = [] }) => {
  const chatEndRef = useRef(null);
  const [userMessages, setMessages] = useState(messages);
  const [loading, setLoading] = useState(false); // State for loading

  useEffect(() => {
    // Initialize with a welcome message if userMessages is empty and messages prop is not empty
    if (userMessages.length === 0 && messages.length === 0) {
      setMessages([{
        text: "Hi there, how can I help you?",
        type: 'bot'
      }]);
    }
  }, [userMessages, messages]);

  const handleSendMessage = async (messageText, type) => {
    setMessages((prevMessages) => [...prevMessages, { text: messageText, type }]);

    if (type === 'user') {
      setLoading(true); // Set loading to true
      try {
        const response = await fetch(
          'https://backend-theta-eosin.vercel.app/api/generateResponse',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: messageText }), 
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('API response:', result); 

        setMessages((prevMessages) => [
          ...prevMessages,
          { text: result.text || 'No answer received', type: 'bot' },
        ]);
      } catch (error) {
        console.error('Error:', error);

        let errorMessage = 'There was an error communicating with the server.';
        if (error.message) {
          errorMessage = error.message;
        }

        setMessages((prevMessages) => [
          ...prevMessages,
          { text: errorMessage, type: 'bot' },
        ]);
      } finally {
        setLoading(false); // Set loading to false
      }
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [userMessages]);

  return (
    <div className="chat-container">
      <div className="chat-display" aria-live="polite">
        {userMessages.map((message, index) => (
          <div 
            key={`${message.text}-${index}`} // Ensure text is unique or use another unique identifier
            className={`message ${message.type}`}
          >
            {message.text}
          </div>
        ))}
        {loading && <LoadingMessage />} 
        <div ref={chatEndRef} />
      </div>
      
      <TextBox onSendMessage={handleSendMessage} />
   
    </div>
  );
};

ChatComponent.displayName = 'Chat';

const Chat = memo(ChatComponent);

export default Chat;
