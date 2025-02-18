"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send } from "lucide-react";
import axios from "axios"; 
import { getTickets } from "@/actions/tickets"; 
import { GET_MESSAGES_BY_TICKET } from "@/actions/queries/querieMessages";
import { SEND_MESSAGE_TICKET } from "@/actions/mutation/message/mutationMessage";

interface Message {
    node:{
        id: number;
        sender: string; // Ajout de la propriété 'sender' dans l'interface
        content: string;
        createdAt: string;
        isAdmin?: boolean;
      //   conversationId: number;
      //   ticketNumber: string;
    }
}

export default function TicketConversation() {
  const [messages, setMessages] = useState<Message[]>([]); 
  const [tickets, setTickets] = useState<any[]>([]); 
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null); 
  const [reply, setReply] = useState(""); 

  // Récupération des tickets avec Axios
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getTickets(); 
        setTickets(data?.data || []); 
      } catch (error) {
        console.error("Erreur lors de la récupération des tickets:", error);
      }
    };

    fetchTickets(); // Charger les tickets au montage du composant
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      const fetchMessages = async () => {
        try {
          const res = await axios.post("http://dj-dev.sellarts.net/sellarts/ ", {
            query: GET_MESSAGES_BY_TICKET,
            variables: { ticket_Id: selectedTicket.id },
          });
          console.log(res.data.data.messages.edges);
          
           setMessages(res.data.data.messages.edges || []); // Mettre à jour l'état des messages
        } catch (error) {
          console.error("Erreur lors de la récupération des messages:", error);
        }
      };

      fetchMessages(); // Charger les messages lorsqu'un ticket est sélectionné
    }
  }, [selectedTicket]);

  const handleReply = async () => {
    if (!reply.trim() || !selectedTicket) return;
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL, {
        query: SEND_MESSAGE_TICKET,
        variables: {
            ticket: selectedTicket.id,
            sender: 478,
            receiver: 602,  
            isAdmin: false,
            content: reply.trim(),
        }
      });
      console.log(response.data.data.featureSendMessage.ankaMessage, "message envoyé");
      

      // Ajouter le message envoyé à la liste des messages
      setMessages([
        ...messages,
        {
          node: {
            id: response.data.data.featureSendMessage.ankaMessage.id,
          sender: "478", 
          content:response.data.data.featureSendMessage.ankaMessage.content,
          createdAt: response.data.data.featureSendMessage.ankaMessage.createdAt,
          isAdmin: false,
        //   conversationId: selectedTicket.id,
        //   ticketNumber: selectedTicket.ticketNumber,
          }
        },
      ]);
      setReply(""); // Réinitialiser le champ de réponse
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  // useEffect(() => {
  //   if (ticketId) {
  //     const ticket = tickets.find((ticket) => ticket.id === ticketId);
  //     setSelectedTicket(ticket || null);
  //   }
  // }, [ticketId, tickets]);

  return (
    <div className="flex h-screen p-6 bg-gray-100">
      {/* Liste des tickets */}
      <div className="w-1/3 p-4 bg-white shadow-lg rounded-md">
        <h1 className="text-2xl font-bold mb-4">Tickets</h1>
        <ScrollArea className="h-[500px] w-full">
          {tickets.map((ticket) => (
            <Card
              key={ticket.id}
              className={`mb-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                selectedTicket?.id === ticket.id ? "bg-gray-100" : ""
              }`}
              onClick={() => setSelectedTicket(ticket)}
            >
              <CardContent className="p-4 relative">
                {/* Numéro du ticket en haut à droite */}
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-sm font-semibold rounded-md px-3 py-1">
                  N°TICK-{ticket.id}
                </div>
                <div className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">{ticket.title}</CardTitle>
                  </CardHeader>
                  <p className="text-gray-600 mt-2">{ticket.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Créé le: {new Date(ticket.createdAt).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </div>

      {/* Zone de conversation */}
      <div className="w-2/3 p-4 bg-white shadow-lg rounded-md ml-4 flex flex-col">
        {selectedTicket ? (
          <>
            <div className="flex items-center border-b pb-3 mb-3">
              <MessageSquare className="mr-2 text-gray-600" />
              <h2 className="text-xl font-bold">Conversation - Ticket #N°TICK-{selectedTicket.id}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-3 bg-gray-50 rounded-md flex flex-col gap-4">
              {messages.map((msg) => (
                <div key={msg.node.id} className={`flex items-end ${msg.node.isAdmin ? "justify-start " : "justify-end"}`}>
                  <div
                    className={`max-w-md p-3 rounded-lg ${
                      msg.node.isAdmin ? "bg-gray-200 self-start" : "bg-blue-500 text-white self-end"
                    }`}
                  >
                    <p>{msg.node.content}</p>
                    <p className="text-xs opacity-80 mt-1">{new Date(msg.node.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Zone de réponse */}
            <div className="mt-4 flex items-center border-t pt-3">
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
          <p className="text-gray-500 text-center mt-20">Sélectionnez un ticket pour afficher la conversation</p>
        )}
      </div>
    </div>
  );
}
