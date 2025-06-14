import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { LogOut, User } from 'lucide-react';
import { useUser } from '../contexts/UserContext';


export default function LoginButton() {
    const { user, isLoading, handleLogout } = useUser();

    function handleGoogleLogin() {
        window.location.href = 'http://localhost:3000/auth/google/login';
    }

    if (isLoading) {
        return <Button disabled>Loading...</Button>;
    }

    if (!user) {
        return (
            <Button onClick={handleGoogleLogin} className="w-full">
                <User className="mr-2 h-4 w-4" />
                Login with Google
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center justify-start gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>{user.firstName?.charAt(0) + user.lastName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{user.firstName} {user.lastName}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-sm">
                    <User className="mr-2 h-4 w-4" />
                    <span>{user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}