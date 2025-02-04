"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Paperclip, Smile } from "lucide-react";

interface Message {
  id: number;
  sender: string;
  content: string;
  createdAt: string;
  isAdmin?: boolean;
  avatar?: string;
  conversationId: number;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "John Doe", content: "Bonjour, j'ai une question sur mon compte.", createdAt: "2024-07-30T14:20:00", avatar: "https://images.unsplash.com/photo-1736156725121-027231636f9d?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", conversationId: 1 },
    { id: 2, sender: "Admin", content: "Bien sûr, comment puis-je vous aider ?", createdAt: "2024-07-30T14:22:00", isAdmin: true, avatar: "https://images.unsplash.com/photo-1597348989645-46b190ce4918?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", conversationId: 1 },
    { id: 3, sender: "Alice Dupont", content: "Pouvez-vous m'aider avec ma réservation ?", createdAt: "2024-07-30T15:45:00", avatar: "https://images.unsplash.com/photo-1735325332407-73571ee7477b?q=80&w=1778&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", conversationId: 2 },
    { id: 4, sender: "Admin", content: "Oui, quel est votre numéro de réservation ?", createdAt: "2024-07-30T15:47:00", isAdmin: true, avatar: "https://images.unsplash.com/photo-1735596365888-ad6d151533f2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", conversationId: 2 },
  ]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [reply, setReply] = useState("");

  const handleReply = () => {
    if (!reply.trim() || !selectedMessage) return;
    const newMessage: Message = {
      id: messages.length + 1,
      sender: "Admin",
      content: reply,
      createdAt: new Date().toISOString(),
      isAdmin: true,
      avatar: "https://source.unsplash.com/50x50/?admin",
      conversationId: selectedMessage.conversationId
    };
    setMessages([...messages, newMessage]);
    setReply("");
  };

  return (
    <div className="flex h-screen p-6 bg-gray-100">
      {/* Liste des messages */}
      <div className="w-1/3 p-4 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        <ScrollArea className="h-[500px] w-full">
          {messages.filter((msg) => !msg.isAdmin).map((message) => (
            <Card
              key={message.id}
              className={`mb-2 cursor-pointer flex items-center transition-all duration-200 hover:bg-gray-100 ${selectedMessage?.conversationId === message.conversationId ? 'bg-gray-200' : ''}`}
              onClick={() => setSelectedMessage(message)}
            >
              <img src={message.avatar} alt={message.sender} className="w-10 h-10 rounded-full mr-3" />
              <div>
                <CardTitle>{message.sender}</CardTitle>
                <CardContent>
                  <p className="text-gray-700 truncate">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-2">{new Date(message.createdAt).toLocaleString()}</p>
                </CardContent>
              </div>
            </Card>
          ))}
        </ScrollArea>
      </div>
      
      {/* Zone de conversation */}
      <div className="w-2/3 p-4 bg-white shadow-md rounded-md ml-4 flex flex-col">
        {selectedMessage ? (
          <>
            <div className="flex items-center border-b pb-3 mb-3">
              <MessageSquare className="mr-2 text-gray-600" />
              <h2 className="text-xl font-bold">Conversation avec {selectedMessage.sender}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-3 bg-gray-50 rounded-md flex flex-col gap-4">
              {messages.filter((msg) => msg.conversationId === selectedMessage.conversationId).map((msg, index) => (
                <div key={index} className={`flex items-end ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}> 
                  {!msg.isAdmin && <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full mr-2" />}
                  <div className={`max-w-md p-3 rounded-lg ${msg.isAdmin ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 self-start'}`}>
                    <p>{msg.content}</p>
                    <p className="text-xs opacity-80 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                  {msg.isAdmin && <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full ml-2" />}
                </div>
              ))}
            </div>
            {/* Zone de réponse */}
            <div className="mt-4 flex items-center border-t pt-3">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Paperclip size={20} />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Smile size={20} />
              </button>
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="flex-1 p-2 border rounded-md mx-2"
                placeholder="Écrire une réponse..."
              />
              <button
                onClick={handleReply}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center mt-20">Sélectionnez un message pour afficher la conversation</p>
        )}
      </div>
    </div>
  );
}
