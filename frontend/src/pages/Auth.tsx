import { useUser } from '../contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import LoginButton from '../components/LoginButton';
import LoadingComponent from '../components/LoadingComponent';

export default function Auth() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen p-4 flex items-center justify-center mx-auto">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome to Onboardify</CardTitle>
          <CardDescription>
            Please log in to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <LoginButton />
        </CardContent>
      </Card>
    </div>
  );
} 