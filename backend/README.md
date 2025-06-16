# Omboardify Backend

The backend service for Omboardify, built with NestJS, providing WhatsApp integration, form management, and client tracking functionality.

## 🛠️ Technology Stack

- **Framework:** NestJS v11
- **Database:** PostgreSQL with TypeORM
- **WhatsApp API:** @whiskeysockets/baileys
- **Authentication:** Passport JWT
- **Package Manager:** pnpm

## 📁 Project Structure

```
src/
├── auth/               # Authentication module
├── user/               # User management
├── user-forms/         # Form handling and tracking
├── whatsapp/          # WhatsApp integration
├── utils/             # Shared utilities
├── app.module.ts      # Main application module
└── main.ts            # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v10 or higher)
- PostgreSQL
- n8n instance (for workflow automation)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Create `.env` file:

### Development

```bash
# Start in development mode
pnpm run start:dev

# Run tests
pnpm run test

# Build for production
pnpm run build
```

## 📦 Main Modules

### WhatsApp Module

Handles WhatsApp Web integration using @whiskeysockets/baileys:
- Multi-session management
- QR code generation
- Message handling
- Bulk messaging
- Session restoration

### User Forms Module

Manages onboarding forms and client progress:
- Form creation and management
- Progress tracking
- Response handling
- Status monitoring

### Authentication Module

Implements security using Passport:
- JWT authentication
- User management
- Session handling

## 🔄 API Endpoints

### WhatsApp Endpoints

```typescript
POST   /whatsapp/auth/initiate      # Start WhatsApp authentication
GET    /whatsapp/session/status     # Get session status
DELETE /whatsapp/session/disconnect  # Disconnect session
POST   /whatsapp/session/bulk-message # Send bulk messages
```

### Forms Endpoints

```typescript
POST   /user-forms                  # Create new form
GET    /user-forms                  # Get all forms
GET    /user-forms/form-status      # Get all form statuses
POST   /user-forms/respond/:phone   # Save form response
GET    /user-forms/chats           # Get all chat conversations
```

## 📊 Testing

```bash
# Unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```