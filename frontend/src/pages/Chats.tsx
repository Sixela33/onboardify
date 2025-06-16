import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import axiosInstance from '@/lib/axiosInstance';
import ChatInterface from '@/components/ChatInterface';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Se exportan para que ChatInterface pueda usarlas
export interface Message {
  id: string;
  text: string;
  fromMe: boolean;
  timestamp: number;
}

export interface Chat {
  phoneNumber: string;
  contactName: string;
  conversation: Message[];
  // Los siguientes campos pueden ser útiles en el futuro, los dejamos.
  formId: number;
  currentStep: number;
  isComplete: boolean;
}

interface SocketMessage {
  sessionId: string;
  message: WAMessage;
  messageTimestamp?: number;
}

interface WAMessage {
  key: {
    remoteJid?: string | null;
    fromMe: boolean;
    id?: string | null;
  };
  message?: {
    conversation?: string | null;
    extendedTextMessage?: {
      text?: string | null;
    };
  } | null;
  pushName?: string | null;
  messageTimestamp?: number | null;
}

const getMessageText = (message: WAMessage): string | null => {
  return message.message?.conversation || message.message?.extendedTextMessage?.text || null;
}

export default function Chats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const { isConnected, on, off } = {isConnected: false, on: () => {}, off: () => {}};

  const fetchChats = async () => {
    try {
      const response = await axiosInstance.get<Chat[]>('/user-forms/chats');
      setChats(response.data);
      if (response.data.length > 0) {
        setSelectedChat(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    const handleNewMessage = (data: SocketMessage) => {
      console.log('Nuevo mensaje recibido desde el socket:', data);
      const { message } = data;
      const remoteJid = message.key.remoteJid;
      const text = getMessageText(message);

      if (!remoteJid || !text) return;

      const newMessage: Message = {
        id: message.key.id || `${Date.now()}`,
        text: text,
        fromMe: message.key.fromMe,
        timestamp: message.messageTimestamp || Date.now() / 1000,
      };
      
      setChats(prevChats => {
        const chatIndex = prevChats.findIndex(c => c.phoneNumber === remoteJid);
        const currentChats = [...prevChats];

        // Si el chat no existe, lo creamos
        if (chatIndex === -1) {
          const newChat: Chat = {
            phoneNumber: remoteJid,
            contactName: message.pushName || remoteJid.split('@')[0],
            conversation: [newMessage],
            formId: Date.now(),
            currentStep: 1,
            isComplete: false,
          };
          currentChats.unshift(newChat);
        } else { // Si el chat existe, añadimos el mensaje
          const targetChat = { ...currentChats[chatIndex] };
          
          // Evitamos duplicados
          if (!targetChat.conversation.some(m => m.id === newMessage.id)) {
            targetChat.conversation.push(newMessage);
            targetChat.conversation.sort((a, b) => a.timestamp - b.timestamp); // Ordenamos por si acaso
            currentChats[chatIndex] = targetChat;
          }

          // Movemos el chat actualizado al principio
          if (chatIndex > 0) {
            const [updatedItem] = currentChats.splice(chatIndex, 1);
            currentChats.unshift(updatedItem);
          }
        }
        
        return currentChats;
      });
    };
  }, [isConnected, on, off]);

  useEffect(() => {
    if (selectedChat) {
      const updatedVersionOfSelectedChat = chats.find(c => c.phoneNumber === selectedChat.phoneNumber);
      if (updatedVersionOfSelectedChat && JSON.stringify(updatedVersionOfSelectedChat) !== JSON.stringify(selectedChat)) {
        setSelectedChat(updatedVersionOfSelectedChat);
      }
    }
  }, [chats, selectedChat]);

  const getLastMessage = (chat: Chat) => {
    if (chat.conversation.length === 0) return "No hay mensajes...";
    const lastEntry = chat.conversation[chat.conversation.length - 1];
    return lastEntry.text;
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <div className="w-1/3 flex flex-col bg-[#111B21]">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chats</h2>
          <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm text-gray-400">{isConnected ? 'Conectado' : 'Desconectado'}</span>
          </div>
        </div>
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="p-4 text-center text-gray-400">Cargando chats...</div>
          ) : (
            <div>
              {chats.length > 0 ? (
                chats.map((chat) => (
                  <div
                    key={`${chat.phoneNumber}-${chat.formId}`}
                    className={cn(
                      "p-4 cursor-pointer border-b border-gray-800 hover:bg-[#202C33]",
                      selectedChat?.phoneNumber === chat.phoneNumber && "bg-[#2A3942]"
                    )}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-white">{chat.contactName}</h3>
                      <Badge variant={chat.isComplete ? "default" : "secondary"} className="text-xs">
                        {chat.isComplete ? 'Completado' : 'En Progreso'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {getLastMessage(chat)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <p className="text-sm">Aún no hay conversaciones.</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
      <main className="w-2/3 flex flex-col bg-[#0B141A]">
        <ChatInterface chat={selectedChat} />
      </main>
    </div>
  );
} 