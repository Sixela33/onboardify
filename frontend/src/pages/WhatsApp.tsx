import React, { useEffect } from 'react';
import { SessionStatus } from '../lib/whatsappApi';
import { useUser } from '../contexts/UserContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Loader2, MessageCircle, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import LoginButton from '../components/LoginButton';
import LoadingComponent from '../components/LoadingComponent';
import { useWhatsAppSession } from '@/hooks/useWhatsappSession';


// Component for session status utilities
const SessionStatusUtils = {
  getStatusColor: (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'disconnected': return 'text-red-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  },

  getStatusIcon: (status: string) => {
    switch (status) {
      case 'connected': return <MessageCircle className="w-4 h-4 text-green-600" />;
      case 'connecting': return <Loader2 className="w-4 h-4 text-yellow-600 animate-spin" />;
      default: return <Smartphone className="w-4 h-4 text-gray-600" />;
    }
  }
};

// Component for authentication section
const AuthenticationCard: React.FC<{
  sessionStatus: SessionStatus | null;
  loading: boolean;
  onInitiateAuth: () => void;
  onDisconnect: () => void;
}> = ({ sessionStatus, loading, onInitiateAuth, onDisconnect }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Smartphone className="w-5 h-5" />
        WhatsApp Authentication
      </CardTitle>
      <CardDescription>
        Connect your WhatsApp account by scanning the QR code
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex justify-center">
        {!sessionStatus ? (
          <Button 
            onClick={onInitiateAuth} 
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              'Start Authentication'
            )}
          </Button>
        ) : (
          <Button 
            onClick={onDisconnect} 
            variant="destructive"
            size="lg"
          >
            Disconnect Session
          </Button>
        )}
      </div>

      {sessionStatus && (
        <div className="space-y-4">
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {SessionStatusUtils.getStatusIcon(sessionStatus.status)}
              <span className="font-medium">Status:</span>
              <span className={`font-semibold ${SessionStatusUtils.getStatusColor(sessionStatus.status)}`}>
                {sessionStatus.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {sessionStatus.qrCode && sessionStatus.status === 'qr_ready' && (
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border inline-block">
                <div dangerouslySetInnerHTML={{ __html: sessionStatus.qrCode }} />
              </div>
              <p className="text-sm text-gray-600">
                Open WhatsApp on your phone, go to Settings → Linked Devices → Link a Device,
                and scan this QR code
              </p>
            </div>
          )}
        </div>
      )}
    </CardContent>
  </Card>
);

// Component for authentication error
const AuthErrorState: React.FC = () => (
  <div className="min-h-screen p-4 flex items-center justify-center">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-red-600">Authentication Required</CardTitle>
        <CardDescription>
          <p className='mb-4'>Please log in to access the WhatsApp Bot Dashboard</p>
          <LoginButton />
        </CardDescription>
      </CardHeader>
    </Card>
  </div>
);

// Main WhatsApp component
export default function WhatsApp() {
  const { user, isLoading: userLoading } = useUser();
  const {
    sessionStatus,
    loading,
    initiateAuth,
    disconnect,
    pollSessionStatus
  } = useWhatsAppSession();

  console.log("sessionStatus", sessionStatus);

  // Handlers with error handling
  const handleInitiateAuth = async () => {
    if (!user) {
      toast.error('User not authenticated. Please log in first.');
      return;
    }

    try {
      const successMessage = await initiateAuth();
      toast.success(successMessage);
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    }
  };

  const handleDisconnect = async () => {
    try {
      const successMessage = await disconnect();
      if (successMessage) {
        toast.success(successMessage);
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    }
  };

  useEffect(() => {
    pollSessionStatus()
  }, [])

  // Loading and authentication states
  if (userLoading) {
    return <LoadingComponent />;
  }

  if (!user) {
    return <AuthErrorState/>;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <MessageCircle className="w-8 h-8 text-green-600" />
            WhatsApp Bot
          </h1>
        </div>

        <AuthenticationCard
          sessionStatus={sessionStatus}
          loading={loading}
          onInitiateAuth={handleInitiateAuth}
          onDisconnect={handleDisconnect}
        />



      </div>
    </div>
  );
};