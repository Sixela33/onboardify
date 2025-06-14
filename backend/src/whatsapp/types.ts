import { WASocket } from "@whiskeysockets/baileys";
import { EventEmitter } from "events";

export interface WhatsAppSession {
  id: string;
  socket?: WASocket;
  qrCode?: string;
  status: SessionStatus;
  events: EventEmitter;
  authPath: string;
}

export enum SessionStatus {
  CONNECTING = 'connecting',
  QR_READY = 'qr_ready',
  AUTHENTICATED = 'authenticated',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  FAILED = 'failed'
}