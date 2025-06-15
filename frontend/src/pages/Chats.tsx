import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import axiosInstance from '@/lib/axiosInstance';

interface ChatConversation {
  question: string;
  response: string | null;
  step: number;
}

interface Chat {
  phoneNumber: string;
  formId: number;
  formName: string;
  currentStep: number;
  isComplete: boolean;
  conversation: ChatConversation[];
}

export default function Chats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axiosInstance.get('/user-forms/chats');
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Chat Histories</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {chats.map((chat) => (
                <Card key={`${chat.phoneNumber}-${chat.formId}`} className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{chat.phoneNumber}</h3>
                        <p className="text-sm">{chat.formName}</p>
                      </div>
                      <Badge variant={chat.isComplete ? "default" : "secondary"}>
                        {chat.isComplete ? 'Completado' : 'En Progreso'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="conversation">
                        <AccordionTrigger>
                          View Conversation
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 mt-2">
                            {chat.conversation.map((item, index) => (
                              <div key={index} className="space-y-2">
                                <div className="p-3 rounded-lg">
                                  <p className="font-medium">Question {item.step}:</p>
                                  <p>{item.question}</p>
                                </div>
                                {item.response && (
                                  <div className="p-3 rounded-lg ml-4">
                                    <p className="font-medium">Response:</p>
                                    <p>{item.response}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <div className="mt-4">
                      <div className="w-full rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full"
                          style={{ 
                            width: `${Math.round((chat.currentStep / chat.conversation.length) * 100)}%` 
                          }}
                        ></div>
                      </div>
                      <p className="text-sm mt-1">
                        Step {chat.currentStep} of {chat.conversation.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 