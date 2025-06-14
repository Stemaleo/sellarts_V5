"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import Image from "next/image";
import chatLogo from "@/assets/logo/chatLogo.jpg";
import { useSession } from "next-auth/react";
import { parse } from "path";
import React from "react";
import ReactMarkdown from 'react-markdown';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  loading?: boolean;
}

interface ChatbotProps {
  chatIcon?: string; // URL for custom chat icon
  logoImage?: string; // URL for logo in title bar
}
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useSession();
  // Add a ref for the messages container
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to scroll to bottom when messages change
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Scroll to bottom when chat is opened
    setTimeout(scrollToBottom, 100);
  };
  
  const user = data?.user;
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    try {
      // Use crypto.randomUUID() for secure unique IDs
      const userMessageId = crypto.randomUUID();
      const botMessageId = crypto.randomUUID();

      const userMessage: Message = {
        id: parseInt(userMessageId.replace(/-/g, ''), 16),
        text: inputMessage,
        sender: 'user',
        timestamp: new Date()
      };

      // Add user message immediately
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      setIsLoading(true);

      // Add loading message
      const loadingMessage: Message = {
        id: parseInt(botMessageId.replace(/-/g, ''), 16),
        text: "...",
        sender: 'bot',
        timestamp: new Date(),
        loading: true
      };
      setMessages(prev => [...prev, loadingMessage]);

      try {
        // Use HTTPS endpoint with streaming
        const response = await fetch("https://chat.sellarts.net/chat/stream", {
          method: "POST",
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: inputMessage,
            user_id: crypto.randomUUID() // More secure anonymous ID
          }),
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        const reader = response.body?.getReader();
        if (!reader) throw new Error('Stream reader not available');
        
        // Remove loading message
        setMessages(prev => prev.filter(msg => msg.id !== parseInt(botMessageId.replace(/-/g, ''), 16)));
        
        // Create bot message with initial empty text
        const botMessage: Message = {
          id: parseInt(botMessageId.replace(/-/g, ''), 16),
          text: "",
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        
        let accumulatedText = "";
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = new TextDecoder().decode(value);
          
          // Handle SSE format
          const lines = chunk.split('\n').filter(line => line.trim());
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const jsonStr = line.substring(6).trim();
                
                // Skip [DONE] messages
                if (jsonStr === '[DONE]') {
                  continue;
                }
                
                const parsedData = JSON.parse(jsonStr);
                
                if (!parsedData.error && parsedData.text) {
                  accumulatedText += parsedData.text;
                  
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === parseInt(botMessageId.replace(/-/g, ''), 16)
                        ? { ...msg, text: accumulatedText }
                        : msg
                    )
                  );
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e);
                // Continue processing other messages even if one fails
                continue;
              }
            }
          }
        }
        
        setIsLoading(false);
        
      } catch (error) {
        console.error("Error sending message:", error);
        
        setMessages(prev => prev.filter(msg => msg.id !== parseInt(botMessageId.replace(/-/g, ''), 16)));
        
        const errorMessage: Message = {
          id: parseInt(crypto.randomUUID().replace(/-/g, ''), 16),
          text: "Sorry, there was an error sending your message. Please try again.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
      }

    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-[380px] h-[600px] flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-500 to-red-600">
            <div className="flex items-center gap-3">
              <Image
                src={chatLogo}
                alt="Chat Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <h3 className="font-semibold text-white">Akilibot</h3>
            </div>
            <button 
              onClick={toggleChat}
              className="hover:bg-red-600 p-1 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-red-500 text-white'
                      : message.loading 
                        ? 'bg-gray-200 animate-pulse'
                        : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.loading ? (
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '200ms'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '400ms'}}></div>
                    </div>
                  ) : message.sender === 'bot' ? (
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  ) : (
                    message.text
                  )}
                </div>
              </div>
            ))}
            {/* Invisible div at the end to scroll to */}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t bg-white p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 disabled:opacity-50"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
         (
          <button
            onClick={toggleChat}
            className="bg-white hover:bg-gray-50 rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-red-500 hover:border-red-600 hover:shadow-red-200 hover:shadow-xl"
          >
            <Image
              src={chatLogo}
              alt="Chat Icon" 
              width={40}
              height={40}
              className="rounded-full transform transition-transform duration-300 hover:rotate-12"
            />
          </button>
        )
      )}
    </div>
  );
}
