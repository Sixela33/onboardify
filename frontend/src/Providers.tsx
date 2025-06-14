import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { UserProvider } from "./contexts/UserContext";
import { SidebarProvider } from "./components/ui/sidebar";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </UserProvider>
    </QueryClientProvider>
    );
};