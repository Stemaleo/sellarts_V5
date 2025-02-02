"use client";

import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";  // Utilisation du Button personnalisé
import Messagerie from "@/components/messagerie";

interface FloatingMessageButtonProps {
  className?: string;
}

const FloatingMessageButton: React.FC<FloatingMessageButtonProps> = ({ className, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6">
        <Button
          variant="default"  // Variante par défaut, peut être modifiée
          size="icon"  // Taille du bouton comme icône
          className={`rounded-full shadow-lg bg-blue-600 text-white p-4 hover:bg-blue-700 transition ${className}`} // Ajout des classes personnalisées
          onClick={() => setIsOpen(true)}
          {...props}
        >
          <MessageCircle className="w-6 h-6" />  {/* Icône du bouton */}
        </Button>
      </div>
      {isOpen && <Messagerie onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default FloatingMessageButton;
