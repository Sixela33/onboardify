import { Sidebar, SidebarGroupContent, SidebarGroup, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter } from './ui/sidebar'
import { Home, FileText, MessageSquare, ListChecks } from 'lucide-react'
import LoginButton from './LoginButton'

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
