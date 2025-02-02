import React, { useState } from "react";
import { X, Send, Paperclip } from "lucide-react";
import { Input } from "@/components/ui/input";

// Déclaration du type pour les props de Messagerie
interface MessagerieProps {
  onClose: () => void;
}

const Messagerie: React.FC<MessagerieProps> = ({ onClose }) => {
  const [message, setMessage] = useState(""); // Message de l'utilisateur
  const [messages, setMessages] = useState<{ id: number; content: string; time: string }[]>([]); // Liste des messages

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const currentTime = new Date();
      const timeString = `${currentTime.getHours().toString().padStart(2, "0")}:${currentTime.getMinutes().toString().padStart(2, "0")}`;

      const newMessage = { id: Date.now(), content: message, time: timeString };
      setMessages([...messages, newMessage]);
      setMessage(""); // Réinitialiser le champ de message
    }
  };

  return (
    <div className="fixed bottom-20 right-6 w-80 bg-white shadow-lg rounded-xl border p-4 flex flex-col">
      {/* Header */}
      <div className="flex flex-col justify-between items-start pb-3 border-b border-gray-200 mb-4">
        <h2 className="text-xl font-semibold text-blue-700">Messagerie</h2>
        <p className="text-sm text-gray-500 mt-2">
          Vous avez des questions ? Envoyez-nous un message, notre équipe technique ou un administrateur est là pour vous aider.
        </p>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3 text-gray-600 text-sm">
        {messages.length === 0 ? (
          <p className="text-gray-400">Aucun message encore.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.content.includes("Admin") ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`p-4 rounded-lg max-w-[85%] text-sm break-words ${
                  msg.content.includes("Admin")
                    ? "bg-gray-100 text-gray-800 shadow-md"
                    : "bg-blue-500 text-white shadow-lg"
                }`}
                style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
              >
                <p>{msg.content}</p>
                <p
                  className={`text-xs text-gray-400 mt-1 ${
                    msg.content.includes("Admin") ? "text-left" : "text-right"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Field */}
      <div className="flex items-center gap-3 border-t pt-4 mt-4">
        <button className="text-gray-500 hover:text-gray-700">
          <Paperclip className="w-5 h-5" />
        </button>
        <Input
          type="text"
          placeholder="Écrire un message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 rounded-full border-gray-300 focus:ring-0 py-2 px-4 text-sm"
        />
        <button
          onClick={handleSendMessage}
          className="text-blue-600 hover:text-blue-700 disabled:text-gray-400"
          disabled={!message.trim()}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Messagerie;
