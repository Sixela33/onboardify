import { Injectable, Logger } from '@nestjs/common';
import { 
  useMultiFileAuthState, 
  makeWASocket, 
  DisconnectReason,
  ConnectionState, 
  WAMessage
} from '@whiskeysockets/baileys';
import * as QRCode from 'qrcode';
import pino from 'pino';
import { EventEmitter } from 'events';
import * as path from 'path';
import * as fs from 'fs';
import { SessionStatus, WhatsAppSession } from '../types';
import axios from 'axios';
import { WhitelistService } from './Whitelist.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Resend } from 'resend';

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class WhatsappService {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WhatsappService.name);
  private sessions: Map<string, WhatsAppSession> = new Map();
  private resend: Resend | null = null;
  // Almacenaremos los números que ya han iniciado un chat para no enviar correos repetidos.
  private notifiedChats: Set<string> = new Set();

  constructor(
    private readonly whitelistService: WhitelistService,
  ) {
    if (process.env.RESEND_API_KEY) {
      this.resend = new Resend(process.env.RESEND_API_KEY);
    } else {
      this.logger.warn('RESEND_API_KEY is not set. Email notifications will be disabled.');
    }
  }

  async onModuleInit() {
    await this.restoreActiveSessions();

    if(!process.env.N8N_WORKFLOW_URL) {
      throw new Error('N8N_WORKFLOW_URL is not set');
    }
  }


  // Restore active sessions from the auth directory on startup
  async restoreActiveSessions() {
    // Read all files in the auth directory
    const authDir = path.join(process.cwd(), 'auth');
    
    if (!fs.existsSync(authDir)) {
      this.logger.log('Auth directory does not exist, no sessions to restore');
      return;
    }
    
    const files = fs.readdirSync(authDir);

    // For each file, check if it is a directory
    for (const file of files) {
      const filePath = path.join(authDir, file);
      try {
        await this.initiateAuth(file);
        this.logger.log(`Restored active session ${file}`);
      } catch (error) {
        this.logger.error(`Error restoring session ${file}:`, error);
        fs.rmSync(filePath, { recursive: true, force: true });
      }
    }
  }

  async initiateAuth(userId: string): Promise<{ sessionId: string; qrCode?: string }> {
    const sessionId = `${userId}`;
    const authPath = path.join(process.cwd(), 'auth', sessionId);
    
    // Ensure auth directory exists
    if (!fs.existsSync(path.dirname(authPath))) {
      fs.mkdirSync(path.dirname(authPath), { recursive: true });
    }

    const session: WhatsAppSession = {
      id: sessionId,
      status: SessionStatus.CONNECTING,
      events: new EventEmitter(),
      authPath
    };

    this.sessions.set(sessionId, session);

    try {
      await this.startWhatsAppConnection(session);
      return { sessionId, qrCode: session.qrCode };
    } catch (error) {
      this.logger.error(`Failed to initiate auth for session ${sessionId}:`, error);
      session.status = SessionStatus.FAILED;
      throw error;
    }
  }

  private async startWhatsAppConnection(session: WhatsAppSession): Promise<void> {
    try {
      const { state, saveCreds } = await useMultiFileAuthState(session.authPath);
      
      const socket = makeWASocket({
        auth: state,
        browser: ['WhatsApp Web', 'Chrome', '112.0.5615.49'],
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 60000,
        emitOwnEvents: false,
        markOnlineOnConnect: false,
        retryRequestDelayMs: 250,
        printQRInTerminal: false,
        maxMsgRetryCount: 3,
        logger: pino({ level: 'silent' })
      });

      session.socket = socket;

      // Handle credentials update
      socket.ev.on('creds.update', saveCreds);

      // Handle connection updates
      socket.ev.on('connection.update', async (update) => {
        try {
          await this.handleConnectionUpdate(session, update);
        } catch (error) {
          this.logger.error(`Error handling connection update:`, error);
        }
      });

      // Handle incoming messages
      socket.ev.on('messages.upsert', (data) => {
        /**
          console.log("data", data);
          console.log("data.messages", data.messages);
          console.log("data.type", data.type);
          console.log("data.requestId", data.requestId);
          console.log("data.key", data.messages[0].message?.audioMessage);
          const messages = data.messages;
        */
        try {
          // Only process new messages (notify) and not message updates (append)
          if (data.type === 'notify') {
            this.handleIncomingMessages(session, data.messages[0]);
          }
        } catch (error) {
          this.logger.error(`Error handling incoming messages:`, error);
        }
      });

    } catch (error) {
      this.logger.error(`Error starting WhatsApp connection for session ${session.id}:`, error);
      session.status = SessionStatus.FAILED;
      throw error;
    }
  }

  // Handle connection updates when the "connection.update" event is emitted
  private async handleConnectionUpdate(session: WhatsAppSession, update: Partial<ConnectionState>): Promise<void> {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      try {
        const qrString = await QRCode.toString(qr, { type: 'svg', width: 256 });
        session.qrCode = qrString;
        session.status = SessionStatus.QR_READY;
        session.events.emit('qr', qrString);
        this.logger.log(`QR Code generated for session ${session.id}`);
      } catch (error) {
        this.logger.error(`Error generating QR code for session ${session.id}:`, error);
      }
    }
    
    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      
      this.logger.warn(`Connection closed for session ${session.id}. Will reconnect: ${shouldReconnect}`);
      
      if (shouldReconnect) {
         session.status = SessionStatus.CONNECTING;
         setTimeout(async () => await this.startWhatsAppConnection(session), 3000);
       } else {
        session.status = SessionStatus.DISCONNECTED;
        session.events.emit('disconnected', session.id);
      }
    } else if (connection === 'open') {
      session.status = SessionStatus.CONNECTED;
      session.events.emit('connected', session.id);
      this.logger.log(`WhatsApp connected successfully for session ${session.id}`);
    }
  }

  // Handle incoming messages when the "messages.upsert" event is emitted
  private async handleIncomingMessages(session: WhatsAppSession, msg: WAMessage): Promise<void> {
    console.log("msg", msg);

    // Evitar procesar mensajes sin remitente o mensajes de estado
    if (!msg.key.remoteJid || msg.key.remoteJid === 'status@broadcast') return;

    // Si es la primera vez que vemos este número, enviamos la notificación.
    if (!this.notifiedChats.has(msg.key.remoteJid) && !msg.key.fromMe) {
      await this.sendNewChatNotification(msg.key.remoteJid, msg.pushName);
      this.notifiedChats.add(msg.key.remoteJid);
    }

    const messageType = msg.message ? Object.keys(msg.message)[0] : 'unknown';
    const messageContent = msg.message?.conversation || msg.message?.extendedTextMessage?.text || 'media/other';
    
    this.logger.log(`New message received - Session: ${session.id}, From: ${msg.key.remoteJid}, Type: ${messageType}, Content: ${messageContent}`);

    // Emit message to frontend via WebSocket
    this.server.emit('whatsapp.message', {
      sessionId: session.id,
      message: msg,
    });

    if (!msg.key.remoteJid) return;

    if (!messageContent) return;

    if (messageContent === '!add') {
      if(await this.whitelistService.isInWhitelist(msg.key.remoteJid, session.id)) {
        session.socket?.sendMessage(msg.key.remoteJid, { text: 'Removed from whitelist' });
        await this.whitelistService.removeFromWhitelist(msg.key.remoteJid, session.id);
        return;
      }

      await this.whitelistService.addToWhitelist(msg.key.remoteJid, session.id);
      session.socket?.sendMessage(msg.key.remoteJid, { text: 'Added to whitelist' });
      return;
    }

    if (!await this.whitelistService.isInWhitelist(msg.key.remoteJid, session.id)) {
      return;
    }

     
    
    try {
      let objet_to_send = {
        message: messageContent,
        from: msg.key.remoteJid,
        type: messageType,
        isDocument: msg?.message?.documentMessage ? true : false,
      }


      // const response = await axios.post(process.env.N8N_WORKFLOW_URL || '', objet_to_send);
      // session.socket?.sendMessage(msg.key.remoteJid, { text: response.data });

    } catch (error) {
      this.logger.error(`Error sending message to webhook:`, error);
    }

    // Basic ping-pong response
    if (msg.message?.conversation === 'miau') {
      session.socket?.sendMessage(msg.key.remoteJid, { text: 'miau!' });
      return;
    } 

  

    session.events.emit('message', msg);
  }

  private async sendNewChatNotification(phoneNumber: string, contactName?: string | null) {
    if (!this.resend) {
      this.logger.warn(`Resend is not configured. Skipping email notification for ${phoneNumber}.`);
      return;
    }

    const notificationEmail = process.env.ONBOARDING_NOTIFICATION_EMAIL;
    if (!notificationEmail) {
      this.logger.warn(`ONBOARDING_NOTIFICATION_EMAIL is not set. Skipping email notification.`);
      return;
    }

    try {
      await this.resend.emails.send({
        from: 'Onboarding Notifier <onboarding@resend.dev>', // Este dominio debe estar verificado en Resend
        to: notificationEmail,
        subject: 'Nuevo Cliente para Onboarding',
        html: `
          <h1>¡Nuevo Chat Iniciado!</h1>
          <p>Un nuevo cliente potencial ha iniciado una conversación.</p>
          <ul>
            <li><strong>Nombre:</strong> ${contactName || 'No disponible'}</li>
            <li><strong>Número de WhatsApp:</strong> ${phoneNumber.split('@')[0]}</li>
          </ul>
          <p>Por favor, ingresa a la plataforma para continuar con el proceso de onboarding.</p>
        `,
      });
      this.logger.log(`Email notification sent for new chat: ${phoneNumber}`);
    } catch (error) {
      this.logger.error('Failed to send new chat notification email', error);
    }
  }

  // Get the status of a session
  getSessionStatus(sessionId: string): { status: string; qrCode?: string } | null {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }

    return {
      status: session.status,
      qrCode: session.qrCode
    };
  }

  // Disconnect a session
  disconnectSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    if (session.socket) {
      session.socket.end(new Error('Disconnected'));
    }

    session.status = SessionStatus.DISCONNECTED;
    this.sessions.delete(sessionId);
    
    // Clean up auth files
    try {
      if (fs.existsSync(session.authPath)) {
        fs.rmSync(session.authPath, { recursive: true, force: true });
      }
    } catch (error) {
      this.logger.warn(`Failed to clean up auth files for session ${sessionId}:`, error);
    }

    return true;
  }

  // Get all sessions from the memory
  getAllSessions(): Array<{ id: string; status: string }> {
    return Array.from(this.sessions.entries()).map(([id, session]) => ({
      id,
      status: session.status
    }));
  }

  // Send a message to a session 
  async sendMessage(sessionId: string, to: string, message: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.socket || session.status !== 'connected') {
      return false;
    }

    try {
      const sentMessage = await session.socket.sendMessage(to, { text: message });
      // Emit the sent message to frontend via WebSocket
      this.server.emit('whatsapp.message', {
        sessionId,
        message: sentMessage,
      });
      return true;
    } catch (error) {
      this.logger.error(`Failed to send message in session ${sessionId}:`, error);
      return false;
    }
  }

  // Parse CSV data from raw text
  private parseCsvData(csvText: string): Array<{ name: string; phone: string }> {
    const lines = csvText.trim().split('\n');
    const contacts: Array<{ name: string; phone: string }> = [];
    
    // Skip header row if it exists
    const startIndex = lines[0]?.toLowerCase().includes('name') && lines[0]?.toLowerCase().includes('phone') ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const [name, phone] = line.split(',').map(field => field.trim().replace(/"/g, ''));
      
      if (name && phone) {
        // Format phone number to WhatsApp format (add @s.whatsapp.net if not present)
        const formattedPhone = phone.includes('@') ? phone : `${phone.replace(/\D/g, '')}@s.whatsapp.net`;
        contacts.push({ name, phone: formattedPhone });
      }
    }
    
    return contacts;
  }

  // Send bulk messages to multiple contacts
  async sendBulkMessages(sessionId: string, csvData: string, message: string, delayBetweenMessages: number = 2000): Promise<{
    success: boolean;
    totalContacts: number;
    sentMessages: number;
    failedMessages: number;
    errors: string[];
  }> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.socket || session.status !== 'connected') {
      throw new Error('Session not found or not connected');
    }

    const contacts = this.parseCsvData(csvData);
    const results = {
      success: true,
      totalContacts: contacts.length,
      sentMessages: 0,
      failedMessages: 0,
      errors: [] as string[]
    };

    this.logger.log(`Starting bulk message sending to ${contacts.length} contacts for session ${sessionId}`);

    for (const contact of contacts) {
      try {
        // Personalize message with contact's name
        const personalizedMessage = message.replace(/\{name\}/g, contact.name);
        
        await session.socket.sendMessage(contact.phone, { text: personalizedMessage });
        results.sentMessages++;
        
        this.logger.log(`Message sent to ${contact.name} (${contact.phone})`);
        
        // Add delay between messages to avoid being flagged as spam
        if (delayBetweenMessages > 0 && results.sentMessages < contacts.length) {
          await new Promise(resolve => setTimeout(resolve, delayBetweenMessages));
        }
      } catch (error) {
        results.failedMessages++;
        const errorMsg = `Failed to send message to ${contact.name} (${contact.phone}): ${error.message}`;
        results.errors.push(errorMsg);
        this.logger.error(errorMsg);
      }
    }

    results.success = results.failedMessages === 0;
    this.logger.log(`Bulk messaging completed. Sent: ${results.sentMessages}, Failed: ${results.failedMessages}`);
    
    return results;
  }

}
