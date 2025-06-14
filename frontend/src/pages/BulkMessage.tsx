import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, Users, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { whatsappApi, BulkMessageResult } from '../lib/whatsappApi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWhatsAppSession } from '@/hooks/useWhatsappSession';

export default function BulkMessage() {
  const { sessionStatus, pollSessionStatus } = useWhatsAppSession();

  const [csvData, setCsvData] = useState('');
  const [message, setMessage] = useState('');
  const [delayBetweenMessages, setDelayBetweenMessages] = useState(2000);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BulkMessageResult | null>(null);

  const canSendMessages = sessionStatus?.status === 'connected';

  useEffect(() => {
      pollSessionStatus();
  }, []);

  const handleSendBulkMessages = async () => {
      if (!canSendMessages) {
          toast.error('Please connect your WhatsApp session first');
          return;
      }

      if (!csvData.trim()) {
          toast.error('Please enter CSV data');
          return;
      }

      if (!message.trim()) {
          toast.error('Please enter a message');
          return;
      }

      setLoading(true);
      setResult(null);

      try {
      const bulkResult = await whatsappApi.sendBulkMessages({
          csvData: csvData.trim(),
          message: message.trim(),
          delayBetweenMessages
      });

      setResult(bulkResult);
      
      if (bulkResult.success) {
          toast.success(`Successfully sent ${bulkResult.sentMessages} messages!`);
      } else {
          toast.warning(`Sent ${bulkResult.sentMessages} messages, ${bulkResult.failedMessages} failed`);
      }
      } catch (error: any) {
          console.error('Error sending bulk messages:', error);
          toast.error(error.response?.data?.message || 'Failed to send bulk messages');
      } finally {
          setLoading(false);
      }
  };

  const csvExample = `name,phone number
      John Doe,+1234567890
      Jane Smith,+0987654321
      Maria Garcia,+1122334455`;

  return (
      <Card>
      <CardHeader>
          <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Bulk Messaging
          </CardTitle>
          <CardDescription>
          Send messages to multiple contacts using CSV data. Use {'{name}'} in your message to personalize it.
          </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
          {!canSendMessages && (
          <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
              {sessionStatus?.status === 'connecting'
                  ? 'Waiting for WhatsApp connection...'
                  : 'Please authenticate your WhatsApp session first'
              }
              </AlertDescription>
          </Alert>
          )}

          <div className="space-y-2">
          <Label htmlFor="csvData">CSV Data</Label>
          <Textarea
              id="csvData"
              placeholder={csvExample}
              value={csvData}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCsvData(e.target.value)}
              rows={6}
              className="font-mono text-sm"
              disabled={!canSendMessages}
          />
          <p className="text-xs text-gray-500">
              Format: name,phone number (one contact per line)
          </p>
          </div>

          <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
              id="message"
              placeholder="Hello {name}! This is a bulk message."
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              rows={3}
              disabled={!canSendMessages}
          />
          <p className="text-xs text-gray-500">
              Use {'{name}'} to personalize the message with each contact's name
          </p>
          </div>

          <div className="space-y-2">
          <Label htmlFor="delay">Delay Between Messages (ms)</Label>
          <Input
              id="delay"
              type="number"
              value={delayBetweenMessages}
              onChange={(e) => setDelayBetweenMessages(Number(e.target.value))}
              min={1000}
              max={10000}
              step={500}
              disabled={!canSendMessages}
          />
          <p className="text-xs text-gray-500">
              Delay between messages to avoid being flagged as spam (1-10 seconds)
          </p>
          </div>

          <Button
          onClick={handleSendBulkMessages}
          disabled={loading || !canSendMessages}
          className="w-full"
          size="lg"
          >
          {loading ? (
              <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending Messages...
              </>
          ) : (
              <>
              <Send className="w-4 h-4 mr-2" />
              Send Bulk Messages
              </>
          )}
          </Button>

          {result && (
          <>
              <Separator />
              <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                  {result.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  )}
                  Bulk Message Results
              </h4>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                  <div className="font-semibold text-lg">{result.totalContacts}</div>
                  <div className="text-gray-500">Total Contacts</div>
                  </div>
                  <div className="text-center">
                  <div className="font-semibold text-lg text-green-600">{result.sentMessages}</div>
                  <div className="text-gray-500">Sent</div>
                  </div>
                  <div className="text-center">
                  <div className="font-semibold text-lg text-red-600">{result.failedMessages}</div>
                  <div className="text-gray-500">Failed</div>
                  </div>
              </div>

              {result.errors.length > 0 && (
                  <div className="space-y-2">
                  <Label>Errors:</Label>
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 max-h-32 overflow-y-auto">
                      {result.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-700">
                          {error}
                      </div>
                      ))}
                  </div>
                  </div>
              )}
              </div>
          </>
          )}
      </CardContent>
      </Card>
  );
}
