import { Sidebar, SidebarGroupContent, SidebarGroup, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter } from './ui/sidebar'
import { Home, FileText, MessageSquare, MessagesSquare, PlusCircle } from 'lucide-react'
import LoginButton from './LoginButton'

const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Bulk Message",
    url: "/bulk-message",
    icon: MessagesSquare,
  },
  {
    title: "Create Form",
    url: "/create-form",
    icon: PlusCircle,
  },
  {
    title: "Forms",
    url: "/forms",
    icon: FileText,
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
