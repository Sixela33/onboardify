# Omboardify Frontend

The frontend application for Omboardify, built with React and Vite, providing a modern and responsive interface for managing client onboarding processes.

## 🛠️ Technology Stack

- **Framework:** React with Vite
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State Management:** React Query
- **Router:** React Router v7
- **UI Components:** Radix UI
- **Package Manager:** pnpm

## 📁 Project Structure

```
src/
├── assets/            # Static assets
├── components/        # Reusable UI components
├── contexts/         # React contexts
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries
├── pages/            # Route components
├── types/            # TypeScript definitions
└── utils/            # Helper functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v10 or higher)
- Backend service running

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Create `.env` file:

### Development

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## 📱 Features

### Dashboard
- Real-time onboarding metrics
- Status tracking
- KYC verification monitoring
- Live onboarding progress

### WhatsApp Integration
- QR code scanning interface
- Session management
- Connection status monitoring
- Bulk messaging interface

### Form Management
- Form creation interface
- Response tracking
- Progress monitoring
- Chat conversations

## 🔄 State Management

Uses React Query for server state:

```typescript
// Example query
const { data, isLoading } = useQuery({
  queryKey: ['formStatus'],
  queryFn: () => api.getForms()
});
```

## 📊 Analytics Integration

Real-time metrics tracking:
- Total clients
- Active onboardings
- Completion rates
- Average times
- Conversion rates