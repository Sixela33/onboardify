# Omboardify

Omboardify is a powerful B2B onboarding re-engagement platform that helps businesses reconnect with clients who have dropped out of the onboarding process. Using WhatsApp as the primary communication channel, it provides automated follow-ups, form management, and comprehensive tracking of client onboarding progress.

## 🌟 Features

- **WhatsApp Integration**
  - Automated messaging system
  - Multi-session support
  - QR code authentication
  - Bulk messaging capabilities

- **Smart Form Management**
  - Multi-step onboarding forms
  - Progress tracking
  - Response validation
  - Automated follow-ups

- **Client Tracking**
  - Real-time progress monitoring
  - Dropout detection
  - KYC verification status
  - Completion rate analytics

- **Dashboard Analytics**
  - Onboarding metrics
  - Conversion rates
  - Average completion time
  - Status distribution

## 🏗️ Architecture

The project is structured into two main components:

```
server/
├── backend/    # NestJS backend service
└── frontend/   # React frontend application
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v10 or higher)
- PostgreSQL
- n8n (for workflow automation)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd omboardify
```

2. Install dependencies:
```bash
# Install backend dependencies
cd server/backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

3. Set up environment variables:

4. Start the development servers:
```bash
# Start backend
cd server/backend
pnpm run start:dev

# Start frontend
cd ../frontend
pnpm run dev
```

## 📚 Documentation

For detailed documentation about each component:

- [Backend Documentation](server/backend/README.md)
- [Frontend Documentation](server/frontend/README.md)

## 🔧 Technologies

### Backend
- NestJS
- TypeORM
- PostgreSQL
- @whiskeysockets/baileys (WhatsApp Web API)
- Passport JWT

### Frontend
- React
- Vite
- TypeScript
- TailwindCSS
- React Router
- React Query

### Workflow Automation
- n8n

## 📊 Metrics & Analytics

The platform provides comprehensive analytics including:
- Total clients
- Active onboardings
- Completion rates
- Average completion time
- Monthly conversions
- Message statistics