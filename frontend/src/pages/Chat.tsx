import React, { useState, useRef, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  MoreVertical,
  Check,
  CheckCheck,
  Clock
} from "lucide-react"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Message {
  id: string
  text: string
  sender: 'user' | 'business'
  timestamp: Date
  status: 'sent' | 'delivered' | 'read' | 'pending'
}

const mockMessages: Message[] = [
  {
    id: '1',
    text: '¡Hola! Bienvenido a nuestro proceso de onboarding',
    sender: 'business',
    timestamp: new Date(2024, 2, 15, 10, 30),
    status: 'read'
  },
  {
    id: '2',
    text: 'Hola, gracias. ¿Qué documentos necesito presentar?',
    sender: 'user',
    timestamp: new Date(2024, 2, 15, 10, 31),
    status: 'read'
  },
  {
    id: '3',
    text: 'Para comenzar, necesitaremos:\n- Identificación oficial\n- Comprobante de domicilio\n- Estados de cuenta bancarios',
    sender: 'business',
    timestamp: new Date(2024, 2, 15, 10, 32),
    status: 'read'
  }
]

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  const handleSend = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
    
    // Simular respuesta automática después de 1 segundo
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Gracias por tu mensaje. Un asesor te responderá pronto.',
        sender: 'business',
        timestamp: new Date(),
        status: 'sent'
      }
      setMessages(prev => [...prev, response])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const MessageStatus = ({ status }: { status: Message['status'] }) => {
    switch (status) {
      case 'sent':
        return <Check className="h-4 w-4 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="h-4 w-4 text-gray-400" />
      case 'read':
        return <CheckCheck className="h-4 w-4 text-blue-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card className="h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-card">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/company-logo.png" />
              <AvatarFallback>CO</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">Onboarding Fintech</h2>
              <p className="text-sm text-muted-foreground">En línea</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages Area */}
        <ScrollArea 
          ref={scrollAreaRef}
          className="flex-1 p-4 space-y-4"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] break-words rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground ml-12'
                    : 'bg-muted mr-12'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                  message.sender === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'
                }`}>
                  <span>
                    {format(message.timestamp, 'HH:mm', { locale: es })}
                  </span>
                  {message.sender === 'user' && (
                    <MessageStatus status={message.status} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t bg-background">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Smile className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe un mensaje..."
              className="flex-1"
            />
            <Button 
              onClick={handleSend}
              size="icon"
              className="rounded-full"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
} 