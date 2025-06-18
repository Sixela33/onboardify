import { Sidebar, SidebarGroupContent, SidebarGroup, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter } from './ui/sidebar'
import { Home, FileText, MessageSquare, ListChecks } from 'lucide-react'
import LoginButton from './LoginButton'
import { useUser } from '../contexts/UserContext'
import { useLocation } from 'react-router-dom'

const items = [
  {
    title: "Inicio",
    url: "/home",
    icon: Home,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Formularios",
    url: "/forms",
    icon: FileText,
  },
  {
    title: "Estado de Formularios",
    url: "/form-status",
    icon: ListChecks,
  },
  {
    title: "WhatsApp",
    url: "/whatsapp",
    icon: MessageSquare,
  },
  {
    title: "Bulk Message",
    url: "/bulk-message",
    icon: MessageSquare,
  }
]

export default function CustomSidebar() {
  const { user } = useUser();
  const location = useLocation();

  // Don't show sidebar on auth page or when user is not authenticated
  if (!user || location.pathname === '/auth') {
    return null;
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
            Onboardify
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <LoginButton />
      </SidebarFooter>
    </Sidebar>  
  )
}
