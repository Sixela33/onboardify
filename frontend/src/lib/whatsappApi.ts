import axiosInstance from "./axiosInstance";

export interface WhatsAppSession {
  sessionId: string;
  qrCode?: string;
}

export interface SessionStatus {
  status: 'connecting' | 'qr_ready' | 'authenticated' | 'connected' | 'disconnected' | 'failed';
  qrCode?: string;
}

export interface SendMessageRequest {
  to: string;
  message: string;
}

export interface BulkMessageRequest {
  csvData: string;
  message: string;
  delayBetweenMessages?: number;
}

export interface BulkMessageResult {
  success: boolean;
  totalContacts: number;
  sentMessages: number;
  failedMessages: number;
  errors: string[];
}

export const whatsappApi = {
  // Initiate WhatsApp authentication (now uses JWT user)
  initiateAuth: async (): Promise<WhatsAppSession> => {
    const response = await axiosInstance.post('/whatsapp/auth/initiate');
    return response.data.data;
  },

  // Get session status
  getSessionStatus: async (): Promise<SessionStatus> => {
    const response = await axiosInstance.get(`/whatsapp/session/status`);
    return response.data.data;
  },

  // Get QR code for session
  getQRCode: async (): Promise<{ qrCode: string; status: string }> => {
    const response = await axiosInstance.get(`/whatsapp/session/qr`);
    return response.data.data;
  },

  // Disconnect session
  disconnectSession: async (): Promise<void> => {
    await axiosInstance.delete(`/whatsapp/session/disconnect`);
  },

  // Get all sessions
  getAllSessions: async (): Promise<Array<{ id: string; status: string }>> => {
    const response = await axiosInstance.get('/whatsapp/session/status');
    return response.data.data;
  },

  // Send message
  sendMessage: async (data: SendMessageRequest): Promise<void> => {
    await axiosInstance.post(`/whatsapp/session/send-message`, data);
  },

  // Test ping
  testPing: async (to: string): Promise<void> => {
    await axiosInstance.get(`/whatsapp/session/test-ping?to=${encodeURIComponent(to)}`);
  },

  // Send bulk messages
  sendBulkMessages: async (data: BulkMessageRequest): Promise<BulkMessageResult> => {
    const response = await axiosInstance.post(`/whatsapp/session/bulk-message`, data);
    return response.data.data;
  },
};

export default whatsappApi; 