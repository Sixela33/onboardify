import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Send, MessageSquare } from "lucide-react";
import axiosInstance from '@/lib/axiosInstance';
import { Chat } from '@/pages/Chats';
import { ScrollArea } from "@/components/ui/scroll-area"


interface ChatInterfaceProps {
  chat: Chat | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chat }) => {
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chat) return;

    try {
      await axiosInstance.post('/whatsapp/session/send-message', {
        to: chat.phoneNumber,
        message: newMessage,
      });
      setNewMessage('');
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  useEffect(() => {
    // This is a placeholder for a more complex scroll-to-bottom logic
    // since shadcn's ScrollArea doesn't expose the viewport ref easily.
    // A timeout ensures the DOM has updated before we scroll.
    setTimeout(() => {
        const scrollContainer = document.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }, 100);
}, [chat?.conversation]);


  if (!chat) {
    return (
      <div className="flex-1 flex flex-col gap-4 items-center justify-center h-full bg-[#0B141A] text-gray-400 text-center p-8">
        <MessageSquare size={96} strokeWidth={1} className="text-gray-500" />
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-medium text-white">Tu panel de chats</h2>
          <p className="max-w-sm">
            Aquí aparecerán tus conversaciones. Para empezar, envía un mensaje
            a tu número de WhatsApp o selecciona un chat de la lista.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <Card className="flex-1 flex flex-col h-full rounded-none border-0 bg-transparent">
      <CardHeader className="border-b border-gray-800 bg-[#202C33] p-4">
        <CardTitle className="text-white">{chat.contactName}</CardTitle>
        <p className="text-sm text-gray-400">{chat.phoneNumber}</p>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full p-6 custom-scrollbar">
            <div className="space-y-2">
              {chat.conversation.map((message) => (
                 <div key={message.id} className={`flex items-end mb-2 ${message.fromMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`${message.fromMe ? 'bg-[#005C4B]' : 'bg-[#202C33]'} text-white p-3 rounded-lg max-w-[85%] shadow-sm`}>
                       <p className="break-words">{message.text}</p>
                    </div>
                 </div>
              ))}
            </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-4 border-t border-gray-800 bg-[#202C33]">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-[#2A3942] border-transparent rounded-lg text-white placeholder-gray-400 focus:ring-0"
          />
          <Button onClick={handleSendMessage} className="bg-[#00A884] hover:bg-[#00896b]">
            <Send className="h-4 w-4 text-white" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface; 