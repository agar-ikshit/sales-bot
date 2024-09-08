import React, { useEffect, useRef, memo, useState } from 'react';
import TextBox from '../input/Textbox';
import './chat.css';
import LoadingMessage from '../loading/Loading'; // import the LoadingMessage component

const ChatComponent = ({ messages = [] }) => {
  const chatEndRef = useRef(null);
  const [userMessages, setMessages] = useState(messages);
  const [loading, setLoading] = useState(false); // state for loading

  useEffect(() => {
    if (userMessages.length === 0) {
      setMessages([{
        text: "Hi there, how can I help you?",
        type: 'bot'
      }]);
    }
  }, [userMessages]);

  const handleSendMessage = async (messageText, type) => {
    setMessages((prevMessages) => [...prevMessages, { text: messageText, type }]);

    if (type === 'user') {
      setLoading(true); // set loading to true
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
        console.log('API response:', result); // Log the result to inspect its structure

        setMessages((prevMessages) => [
          ...prevMessages,
          { text: result.text.kwargs.content || 'No answer received', type: 'bot' },
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
        setLoading(false); // set loading to false
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
            key={`${message.text}-${index}`} 
            className={`message ${message.type}`}
          >
            {message.text}
          </div>
        ))}
        {loading && <LoadingMessage />} {/* Show loading message */}
        <div ref={chatEndRef} />
      </div>
      
      <TextBox onSendMessage={handleSendMessage} />
   
    </div>
  );
};

ChatComponent.displayName = 'Chat';

const Chat = memo(ChatComponent);

export default Chat;
