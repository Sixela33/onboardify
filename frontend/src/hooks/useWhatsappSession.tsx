import { useCallback, useEffect, useState } from "react";
import { whatsappApi } from "@/lib/whatsappApi";
import { SessionStatus } from "@/lib/whatsappApi";

interface Session {
    id: string;
    status: string;
}

export const useWhatsAppSession = () => {
    const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [allSessions, setAllSessions] = useState<Session[]>([]);
  
    const pollSessionStatus = useCallback(async () => {

      try {
        const status = await whatsappApi.getSessionStatus();
        setSessionStatus(status);
        
        if (status.status === 'connecting' || status.status === 'qr_ready') {
          setTimeout(() => pollSessionStatus(), 2000);
        }
      } catch (err) {
        console.error('Error polling session status:', err);
        throw new Error('Failed to get session status');
      }
    }, []);
  
    const initiateAuth = async () => {
      setLoading(true);
      try {
        await whatsappApi.initiateAuth();
        pollSessionStatus();
        return 'Authentication initiated! Please scan the QR code with WhatsApp.';
      } catch (err: any) {
        throw new Error(err.response?.data?.message || 'Failed to initiate authentication');
      } finally {
        setLoading(false);
      }
    };
  
    const disconnect = async () => {
      try {
        await whatsappApi.disconnectSession();
        setSessionStatus(null);
        await loadAllSessions();
        return 'Session disconnected successfully';
      } catch (err: any) {
        throw new Error(err.response?.data?.message || 'Failed to disconnect session');
      }
    };
  
    const loadAllSessions = async () => {
      try {
        const sessions = await whatsappApi.getAllSessions();
        setAllSessions(sessions);
      } catch (err) {
        console.error('Failed to load sessions:', err);
      }
    };
  
    useEffect(() => {
      loadAllSessions();
    }, []);
  
    return {
      sessionStatus,
      loading,
      allSessions,
      initiateAuth,
      disconnect,
      loadAllSessions,
      pollSessionStatus
    };
  };